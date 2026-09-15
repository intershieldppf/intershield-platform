import "server-only";

import { createHmac } from "node:crypto";

import { getShopeeConfig } from "./config";

const AUTHORIZE_PATH = "/api/v2/shop/auth_partner";
const TOKEN_PATH = "/api/v2/auth/token/get";

type ShopeeApiError = {
  error?: string;
  message?: string;
  request_id?: string;
};

export type ShopeeTokenResponse = ShopeeApiError & {
  access_token?: string;
  refresh_token?: string;
  expire_in?: number;
  shop_id?: number;
  merchant_id?: number;
};

function unixTimestamp() {
  return Math.floor(Date.now() / 1000);
}

function sign(path: string, timestamp: number) {
  const { partnerId, partnerKey } = getShopeeConfig();
  return createHmac("sha256", partnerKey)
    .update(`${partnerId}${path}${timestamp}`)
    .digest("hex");
}

export function createShopeeAuthorizationUrl(state: string) {
  const { partnerId, redirectUri, apiBaseUrl } = getShopeeConfig();
  const timestamp = unixTimestamp();
  const callbackUrl = new URL(redirectUri);
  callbackUrl.searchParams.set("state", state);

  const url = new URL(AUTHORIZE_PATH, apiBaseUrl);
  url.search = new URLSearchParams({
    partner_id: partnerId,
    timestamp: String(timestamp),
    sign: sign(AUTHORIZE_PATH, timestamp),
    redirect: callbackUrl.toString(),
  }).toString();
  return url;
}

export async function exchangeShopeeAuthorizationCode(code: string, shopId: number) {
  const { partnerId, apiBaseUrl } = getShopeeConfig();
  const timestamp = unixTimestamp();
  const url = new URL(TOKEN_PATH, apiBaseUrl);
  url.search = new URLSearchParams({
    partner_id: partnerId,
    timestamp: String(timestamp),
    sign: sign(TOKEN_PATH, timestamp),
  }).toString();

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code,
      shop_id: shopId,
      partner_id: Number(partnerId),
    }),
    cache: "no-store",
  });
  const payload = (await response.json().catch(() => ({}))) as ShopeeTokenResponse;
  if (!response.ok || payload.error) {
    const detail = payload.error || payload.message || `HTTP ${response.status}`;
    throw new Error(`Shopee token exchange failed: ${detail}`);
  }
  if (!payload.access_token || !payload.refresh_token || !payload.expire_in) {
    throw new Error("Invalid Shopee token response");
  }
  return payload;
}
