import "server-only";

import { MercadoPagoConfig, Payment, Preference } from "mercadopago";

export function getMercadoPagoClients() {
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error("MERCADO_PAGO_ACCESS_TOKEN is not configured");
  }

  const client = new MercadoPagoConfig({
    accessToken,
    options: { timeout: 10_000 },
  });

  return {
    payment: new Payment(client),
    preference: new Preference(client),
  };
}

export function getStoreUrl() {
  const configuredUrl = process.env.STORE_URL?.trim();
  const value = configuredUrl || "https://www.intershield.com.br";

  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.hostname !== "localhost") {
      throw new Error("STORE_URL must use HTTPS");
    }
    return url.origin;
  } catch {
    throw new Error("STORE_URL is invalid");
  }
}

export function checkoutIsConfigured() {
  return Boolean(
    process.env.CHECKOUT_ENABLED === "true" &&
      process.env.MERCADO_PAGO_ACCESS_TOKEN &&
      process.env.MELHOR_ENVIO_TOKEN &&
      process.env.SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}
