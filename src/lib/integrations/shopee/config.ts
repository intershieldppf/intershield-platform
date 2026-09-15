import "server-only";

export const SHOPEE_PROVIDER = "shopee" as const;
export const SHOPEE_OAUTH_COOKIE = "intershield_shopee_oauth";

export type ShopeeEnvironment = "sandbox" | "production";

export function getShopeeConfig() {
  const partnerId = process.env.SHOPEE_PARTNER_ID?.trim();
  const partnerKey = process.env.SHOPEE_PARTNER_KEY?.trim();
  const redirectUri = process.env.SHOPEE_REDIRECT_URI?.trim();
  const environment = (process.env.SHOPEE_ENV?.trim().toLowerCase() ||
    "sandbox") as ShopeeEnvironment;

  if (!partnerId || !/^\d+$/.test(partnerId) || !partnerKey || !redirectUri) {
    throw new Error("Shopee OAuth is not configured");
  }
  if (environment !== "sandbox" && environment !== "production") {
    throw new Error("SHOPEE_ENV must be sandbox or production");
  }

  const redirectUrl = new URL(redirectUri);
  if (redirectUrl.protocol !== "https:") {
    throw new Error("Shopee redirect URI must use HTTPS");
  }

  const apiBaseUrl =
    environment === "sandbox"
      ? "https://partner.test-stable.shopeemobile.com"
      : "https://partner.shopeemobile.com";

  return {
    partnerId,
    partnerKey,
    redirectUri: redirectUrl.toString(),
    environment,
    apiBaseUrl,
  };
}
