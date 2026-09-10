import { MercadoPagoConfig, Preference } from "mercadopago";

import { findStorefrontProductBySlug } from "@/data/storefront/catalog";
import {
  createPublicOrderId,
  guestCheckoutSchema,
  splitCustomerName,
  splitPhone,
} from "@/lib/commerce/checkout";
import {
  createGuestOrder,
  markOrderPaymentSetupFailed,
  updateOrderPaymentSetup,
} from "@/lib/commerce/orders";
import { isOrderStoreConfigured } from "@/lib/commerce/supabaseAdmin";
import {
  getShippingQuotes,
  ShippingConfigurationError,
  ShippingUnavailableError,
} from "@/lib/commerce/shippingServer";
import { checkRateLimit, rateLimitResponse } from "@/lib/security/rateLimit";

export const runtime = "nodejs";

function json(data: unknown, status: number) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function resolveSiteOrigin(request: Request) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const value = configured || new URL(request.url).origin;
  const url = new URL(value);

  if (url.protocol !== "https:" && url.hostname !== "localhost") {
    throw new Error("Endereço público do site inválido.");
  }

  return url.origin;
}

export async function POST(request: Request) {
  const rateLimit = checkRateLimit(request, "checkout-preference", 8, 60_000);
  if (!rateLimit.allowed) return rateLimitResponse(rateLimit.retryAfterSeconds);

  if (
    process.env.CHECKOUT_ENABLED !== "true" ||
    process.env.PAYMENTS_ENABLED !== "true"
  ) {
    return json({ error: "O pagamento pelo site ainda está em configuração." }, 503);
  }

  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  const webhookSecret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;
  if (!accessToken || !webhookSecret || !isOrderStoreConfigured()) {
    return json({ error: "O pagamento pelo site ainda está em configuração." }, 503);
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 16_384) {
    return json({ error: "Os dados enviados são maiores que o permitido." }, 413);
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return json({ error: "Revise os dados da compra e tente novamente." }, 400);
  }

  const parsed = guestCheckoutSchema.safeParse(body);
  if (!parsed.success) {
    return json(
      { error: "Revise seus dados, o endereço e as confirmações da compra." },
      400,
    );
  }

  const product = findStorefrontProductBySlug(parsed.data.productId);
  if (!product || product.price === null || product.price <= 0) {
    return json({ error: "Este produto não está disponível para compra." }, 404);
  }

  const selectedVariant = parsed.data.variantValue
    ? product.variantValues.find((variant) => variant === parsed.data.variantValue)
    : null;

  if (product.variantValues.length > 0 && !selectedVariant) {
    return json({ error: "Selecione uma opção válida do produto." }, 400);
  }

  const unitPrice = product.price;
  const sku = product.sku ?? product.id;
  let selectedShipping;

  try {
    const quotes = await getShippingQuotes({
      destinationPostalCode: parsed.data.address.postalCode,
      insuredPrice: unitPrice,
    });
    selectedShipping = quotes.find(
      (quote) => quote.id === parsed.data.shippingQuoteId,
    );
  } catch (error) {
    if (
      error instanceof ShippingConfigurationError ||
      error instanceof ShippingUnavailableError
    ) {
      return json({ error: error.message }, 502);
    }

    return json({ error: "Não foi possível validar o frete agora." }, 502);
  }

  if (!selectedShipping) {
    return json(
      { error: "A opção de frete mudou. Calcule novamente antes de pagar." },
      409,
    );
  }

  const publicId = createPublicOrderId();
  let order: Awaited<ReturnType<typeof createGuestOrder>>;

  try {
    order = await createGuestOrder({
      publicId,
      checkout: parsed.data,
      product,
      sku,
      variantValue: selectedVariant ?? null,
      unitPrice,
      shippingQuote: selectedShipping,
    });
  } catch {
    return json(
      { error: "Não foi possível registrar o pedido. Tente novamente." },
      500,
    );
  }

  const origin = resolveSiteOrigin(request);
  const { name, surname } = splitCustomerName(parsed.data.customer.fullName);
  const phone = splitPhone(parsed.data.customer.phone);
  const mercadoPago = new MercadoPagoConfig({
    accessToken,
    options: { timeout: 10_000, maxRetries: 1 },
  });

  try {
    const preference = await new Preference(mercadoPago).create({
      body: {
        items: [
          {
            id: sku,
            title: product.title,
            description: selectedVariant ?? undefined,
            quantity: 1,
            currency_id: "BRL",
            unit_price: unitPrice,
            type: "physical",
          },
        ],
        payer: {
          name,
          surname,
          email: parsed.data.customer.email,
          phone: { area_code: phone.areaCode, number: phone.number },
          identification: { type: "CPF", number: parsed.data.customer.cpf },
          address: {
            zip_code: parsed.data.address.postalCode,
            street_name: parsed.data.address.street,
            street_number: parsed.data.address.number,
          },
        },
        shipments: {
          cost: selectedShipping.price,
          mode: "not_specified",
          receiver_address: {
            zip_code: parsed.data.address.postalCode,
            street_name: parsed.data.address.street,
            street_number: parsed.data.address.number,
            apartment: parsed.data.address.complement || undefined,
            city_name: parsed.data.address.city,
            state_name: parsed.data.address.state,
            country_name: "Brasil",
          },
        },
        external_reference: publicId,
        metadata: {
          order_id: order.id,
          public_order_id: publicId,
          shipping_service: selectedShipping.name,
        },
        back_urls: {
          success: `${origin}/pedido/sucesso?pedido=${encodeURIComponent(publicId)}`,
          pending: `${origin}/pedido/pendente?pedido=${encodeURIComponent(publicId)}`,
          failure: `${origin}/pedido/falha?pedido=${encodeURIComponent(publicId)}`,
        },
        auto_return: "approved",
        notification_url: `${origin}/api/pagamentos/mercado-pago/webhook`,
        statement_descriptor: "INTERSHIELD",
      },
      requestOptions: { idempotencyKey: publicId },
    });

    const checkoutUrl =
      process.env.MERCADO_PAGO_ENV === "production"
        ? preference.init_point
        : preference.sandbox_init_point ?? preference.init_point;

    if (!preference.id || !checkoutUrl) {
      throw new Error("Preferência de pagamento incompleta.");
    }

    await updateOrderPaymentSetup(order.id, {
      preferenceId: preference.id,
      checkoutUrl,
    });

    return json({ checkoutUrl, orderId: publicId }, 201);
  } catch {
    await markOrderPaymentSetupFailed(order.id);
    return json(
      {
        error:
          "O pedido foi registrado, mas o pagamento não pôde ser iniciado. Tente novamente.",
        orderId: publicId,
      },
      502,
    );
  }
}
