import { z } from "zod";

import { findStorefrontProductBySlug } from "@/data/storefront/catalog";
import {
  normalizePostalCode,
} from "@/lib/commerce/shipping";
import {
  getShippingQuotes,
  ShippingConfigurationError,
  ShippingUnavailableError,
} from "@/lib/commerce/shippingServer";
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
    ? product.variantValues.find((variant) => variant === parsed.data.variantValue)
    : null;

  if (product.variantValues.length > 0 && !selectedVariant) {
    return json({ error: "Selecione uma opção válida do produto." }, 400);
  }

  const insuredPrice = product.price;

  try {
    const quotes = await getShippingQuotes({
      destinationPostalCode: parsed.data.postalCode,
      insuredPrice,
    });
    return json({ quotes }, 200);
  } catch (error) {
    if (error instanceof ShippingConfigurationError) {
      return json({ error: error.message }, 503);
    }

    if (error instanceof ShippingUnavailableError) {
      const status = error.message.includes("disponíveis") ? 404 : 502;
      return json({ error: error.message }, status);
    }

    return json({ error: "Não foi possível calcular o frete agora." }, 500);
  }
}
