import "server-only";

export const MERCADOLIVRE_PROVIDER = "mercadolivre" as const;
export const MERCADOLIVRE_OAUTH_COOKIE = "intershield_ml_oauth";

export function getMercadoLivreConfig() {
  const clientId = process.env.MERCADOLIVRE_CLIENT_ID?.trim();
  const clientSecret = process.env.MERCADOLIVRE_CLIENT_SECRET?.trim();
  const redirectUri = process.env.MERCADOLIVRE_REDIRECT_URI?.trim();

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error("Mercado Livre OAuth is not configured");
  }

  return { clientId, clientSecret, redirectUri };
}
