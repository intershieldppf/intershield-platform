import "server-only";

import { findStorefrontProductBySlug } from "@/data/storefront/catalog";
import {
  DEFAULT_SHIPPING_PACKAGE,
  normalizeMelhorEnvioQuotes,
  SHIPPING_ORIGIN_POSTAL_CODE,
  type ShippingQuote,
} from "@/lib/commerce/shipping";

export async function calculateShippingQuotes(
  productId: string,
  postalCode: string,
): Promise<ShippingQuote[]> {
  const token = process.env.MELHOR_ENVIO_TOKEN;
  const product = findStorefrontProductBySlug(productId);

  if (!token) throw new Error("MELHOR_ENVIO_TOKEN is not configured");
  if (!product || product.price === null || product.price <= 0) {
    throw new Error("Product is not available");
  }

  const baseUrl =
    process.env.MELHOR_ENVIO_ENV === "production"
      ? "https://melhorenvio.com.br"
      : "https://sandbox.melhorenvio.com.br";

  const response = await fetch(`${baseUrl}/api/v2/me/shipment/calculate`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "InterShield Peliculas (contato@intershield.com.br)",
    },
    body: JSON.stringify({
      from: { postal_code: SHIPPING_ORIGIN_POSTAL_CODE },
      to: { postal_code: postalCode },
      volumes: [
        {
          ...DEFAULT_SHIPPING_PACKAGE,
          insurance: Number(product.price.toFixed(2)),
        },
      ],
      options: { receipt: false, own_hand: false },
      services: "1,2",
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    const providerError = await response.text();
    console.error("Melhor Envio checkout quote request failed", {
      status: response.status,
      environment: process.env.MELHOR_ENVIO_ENV === "production" ? "production" : "sandbox",
      response: providerError.slice(0, 500),
    });
    throw new Error("Shipping provider rejected the quote");
  }

  return normalizeMelhorEnvioQuotes(await response.json());
}
