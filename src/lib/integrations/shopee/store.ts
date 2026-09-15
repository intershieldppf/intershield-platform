import "server-only";

import { encryptMarketplaceSecret } from "@/lib/integrations/mercadolivre/crypto";

import { SHOPEE_PROVIDER, getShopeeConfig } from "./config";
import type { ShopeeTokenResponse } from "./client";

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

export async function saveShopeeTokens(
  tokens: ShopeeTokenResponse,
  authorizedShopId: number,
) {
  if (!tokens.access_token || !tokens.refresh_token || !tokens.expire_in) {
    throw new Error("Invalid Shopee token response");
  }

  const { url } = getSupabaseConfig();
  const { environment } = getShopeeConfig();
  const shopId = tokens.shop_id ?? authorizedShopId;
  const expiresAt = new Date(Date.now() + Math.max(tokens.expire_in - 30, 30) * 1000);
  const response = await fetch(
    `${url}/rest/v1/marketplace_connections?on_conflict=provider`,
    {
      method: "POST",
      headers: supabaseHeaders({ Prefer: "resolution=merge-duplicates,return=minimal" }),
      body: JSON.stringify({
        provider: SHOPEE_PROVIDER,
        external_user_id: String(shopId),
        access_token_encrypted: encryptMarketplaceSecret(
          tokens.access_token,
          "shopee:access-token",
        ),
        refresh_token_encrypted: encryptMarketplaceSecret(
          tokens.refresh_token,
          "shopee:refresh-token",
        ),
        access_token_expires_at: expiresAt.toISOString(),
        scope: null,
        token_type: "bearer",
        status: "connected",
        metadata: {
          connected_at: new Date().toISOString(),
          environment,
          shop_id: shopId,
          merchant_id: tokens.merchant_id ?? null,
          access_mode: "read_only",
        },
      }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(
      `Saving Shopee tokens failed (${response.status}): ${detail.slice(0, 300)}`,
    );
  }
}
