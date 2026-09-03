import { z } from "zod";

import { findStorefrontProductBySlug } from "@/data/storefront/catalog";
import {
  DEFAULT_SHIPPING_PACKAGE,
  normalizeMelhorEnvioQuotes,
  normalizePostalCode,
  SHIPPING_ORIGIN_POSTAL_CODE,
} from "@/lib/commerce/shipping";
import { checkRateLimit, rateLimitResponse } from "@/lib/security/rateLimit";

export const runtime = "nodejs";

const quoteSchema = z.object({
  productId: z.string().trim().min(1).max(160),
  postalCode: z.string().transform(normalizePostalCode).pipe(z.string().length(8)),
  variantValue: z.string().trim().min(1).max(80).optional(),
});

function json(data: unknown, status: number) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export async function POST(request: Request) {
  const rateLimit = checkRateLimit(request, "shipping-quote", 20, 60_000);
  if (!rateLimit.allowed) return rateLimitResponse(rateLimit.retryAfterSeconds);

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 4_096) {
    return json({ error: "Dados inválidos para calcular o frete." }, 413);
  }

  if (process.env.CHECKOUT_ENABLED !== "true") {
    return json({ error: "O checkout ainda não está disponível." }, 503);
  }

  const token = process.env.MELHOR_ENVIO_TOKEN;

  if (!token) {
    return json({ error: "O cálculo de frete ainda está em configuração." }, 503);
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return json({ error: "Dados inválidos para calcular o frete." }, 400);
  }

  const parsed = quoteSchema.safeParse(body);

  if (!parsed.success) {
    return json({ error: "Informe um CEP válido com 8 números." }, 400);
  }

  const product = findStorefrontProductBySlug(parsed.data.productId);

  if (!product || product.price === null || product.price <= 0) {
    return json({ error: "Produto indisponível para compra no site." }, 404);
  }

  const selectedVariant = parsed.data.variantValue
    ? product.variantOptions.find(
        (variant) => variant.value === parsed.data.variantValue,
      )
    : null;

  if (product.variantOptions.length > 0 && !selectedVariant) {
    return json({ error: "Selecione uma metragem válida." }, 400);
  }

  const insuredPrice = selectedVariant?.price ?? product.price;

  const baseUrl =
    process.env.MELHOR_ENVIO_ENV === "production"
      ? "https://melhorenvio.com.br"
      : "https://sandbox.melhorenvio.com.br";

  let response: Response;

  try {
    response = await fetch(`${baseUrl}/api/v2/me/shipment/calculate`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "InterShield Peliculas (contato@intershield.com.br)",
      },
      body: JSON.stringify({
        from: { postal_code: SHIPPING_ORIGIN_POSTAL_CODE },
        to: { postal_code: parsed.data.postalCode },
        volumes: [
          {
            ...DEFAULT_SHIPPING_PACKAGE,
            insurance: Number(insuredPrice.toFixed(2)),
          },
        ],
        options: {
          receipt: false,
          own_hand: false,
        },
        services: "1,2",
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    return json(
      { error: "Não foi possível consultar o frete agora. Tente novamente." },
      502,
    );
  }

  if (!response.ok) {
    return json(
      { error: "Não foi possível consultar o frete agora. Tente novamente." },
      502,
    );
  }

  const quotes = normalizeMelhorEnvioQuotes(await response.json());

  if (quotes.length === 0) {
    return json(
      { error: "PAC ou SEDEX não estão disponíveis para este CEP." },
      404,
    );
  }

  return json({ quotes }, 200);
}
