import "server-only";

import { createHash, randomUUID } from "node:crypto";

import { decryptMarketplaceSecret, encryptMarketplaceSecret } from "./crypto";
import { MERCADOLIVRE_PROVIDER, getMercadoLivreConfig } from "./config";

type MercadoLivreTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope?: string;
  user_id: number;
  refresh_token?: string;
};

type StoredConnection = {
  provider: typeof MERCADOLIVRE_PROVIDER;
  external_user_id: string;
  access_token_encrypted: string;
  refresh_token_encrypted: string | null;
  access_token_expires_at: string;
  scope: string | null;
  token_type: string | null;
  status: string;
  metadata: Record<string, unknown>;
};

export type MercadoLivreNotification = {
  _id?: string;
  id?: string;
  resource: string;
  user_id: number | string;
  topic: string;
  application_id: number | string;
  attempts?: number;
  sent?: string;
  received?: string;
  actions?: string[];
};

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) throw new Error("Supabase marketplace storage is not configured");
  return { url, serviceKey };
}

function supabaseHeaders(extra?: Record<string, string>) {
  const { serviceKey } = getSupabaseConfig();
  return {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

async function assertSuccess(response: Response, operation: string) {
  if (response.ok) return;
  const detail = await response.text();
  throw new Error(`${operation} failed (${response.status}): ${detail.slice(0, 300)}`);
}

export async function saveMercadoLivreTokens(tokens: MercadoLivreTokenResponse) {
  const { url } = getSupabaseConfig();
  const expiresAt = new Date(Date.now() + Math.max(tokens.expires_in - 30, 30) * 1000);
  const payload: StoredConnection = {
    provider: MERCADOLIVRE_PROVIDER,
    external_user_id: String(tokens.user_id),
    access_token_encrypted: encryptMarketplaceSecret(
      tokens.access_token,
      "mercadolivre:access-token",
    ),
    refresh_token_encrypted: tokens.refresh_token
      ? encryptMarketplaceSecret(tokens.refresh_token, "mercadolivre:refresh-token")
      : null,
    access_token_expires_at: expiresAt.toISOString(),
    scope: tokens.scope ?? null,
    token_type: tokens.token_type ?? "bearer",
    status: "connected",
    metadata: { connected_at: new Date().toISOString() },
  };

  const response = await fetch(
    `${url}/rest/v1/marketplace_connections?on_conflict=provider`,
    {
      method: "POST",
      headers: supabaseHeaders({ Prefer: "resolution=merge-duplicates,return=minimal" }),
      body: JSON.stringify(payload),
      cache: "no-store",
    },
  );
  await assertSuccess(response, "Saving Mercado Livre tokens");
}

async function loadMercadoLivreConnection() {
  const { url } = getSupabaseConfig();
  const query = new URLSearchParams({
    provider: `eq.${MERCADOLIVRE_PROVIDER}`,
    select: "*",
    limit: "1",
  });
  const response = await fetch(`${url}/rest/v1/marketplace_connections?${query}`, {
    headers: supabaseHeaders(),
    cache: "no-store",
  });
  await assertSuccess(response, "Loading Mercado Livre tokens");
  const rows = (await response.json()) as StoredConnection[];
  if (!rows[0]) throw new Error("Mercado Livre is not connected");
  return rows[0];
}

export async function getMercadoLivreAccessToken() {
  let connection = await loadMercadoLivreConnection();
  if (Date.parse(connection.access_token_expires_at) > Date.now() + 120_000) {
    return decryptMarketplaceSecret(
      connection.access_token_encrypted,
      "mercadolivre:access-token",
    );
  }

  if (!connection.refresh_token_encrypted) {
    throw new Error("Mercado Livre refresh token is unavailable");
  }

  const lockId = randomUUID();
  const { url } = getSupabaseConfig();
  const lockResponse = await fetch(`${url}/rest/v1/rpc/acquire_marketplace_refresh_lock`, {
    method: "POST",
    headers: supabaseHeaders(),
    body: JSON.stringify({ p_provider: MERCADOLIVRE_PROVIDER, p_lock_id: lockId }),
    cache: "no-store",
  });
  await assertSuccess(lockResponse, "Acquiring Mercado Livre token refresh lock");
  const acquired = (await lockResponse.json()) as boolean;

  if (!acquired) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    connection = await loadMercadoLivreConnection();
    if (Date.parse(connection.access_token_expires_at) <= Date.now() + 30_000) {
      throw new Error("Mercado Livre token refresh is already in progress");
    }
    return decryptMarketplaceSecret(
      connection.access_token_encrypted,
      "mercadolivre:access-token",
    );
  }

  try {
    const { clientId, clientSecret } = getMercadoLivreConfig();
    const refreshToken = decryptMarketplaceSecret(
      connection.refresh_token_encrypted,
      "mercadolivre:refresh-token",
    );
    const response = await fetch("https://api.mercadolibre.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
      }),
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`Mercado Livre token refresh failed (${response.status})`);
    const tokens = (await response.json()) as MercadoLivreTokenResponse;
    await saveMercadoLivreTokens(tokens);
    return tokens.access_token;
  } finally {
    await fetch(`${url}/rest/v1/marketplace_connections?provider=eq.${MERCADOLIVRE_PROVIDER}&refresh_lock_id=eq.${lockId}`, {
      method: "PATCH",
      headers: supabaseHeaders({ Prefer: "return=minimal" }),
      body: JSON.stringify({ refresh_lock_id: null, refresh_locked_until: null }),
      cache: "no-store",
    }).catch(() => undefined);
  }
}

export async function saveMercadoLivreNotification(
  notification: MercadoLivreNotification,
  rawBody: string,
) {
  const { url } = getSupabaseConfig();
  const sourceId = notification._id ?? notification.id;
  const eventKey = sourceId || createHash("sha256").update(rawBody).digest("hex");
  const response = await fetch(
    `${url}/rest/v1/marketplace_events?on_conflict=provider,event_key`,
    {
      method: "POST",
      headers: supabaseHeaders({ Prefer: "resolution=ignore-duplicates,return=minimal" }),
      body: JSON.stringify({
        provider: MERCADOLIVRE_PROVIDER,
        event_key: eventKey,
        topic: notification.topic,
        resource: notification.resource,
        external_user_id: String(notification.user_id),
        application_id: String(notification.application_id),
        payload: notification,
        status: "pending",
      }),
      cache: "no-store",
    },
  );
  await assertSuccess(response, "Saving Mercado Livre notification");
}
