import { randomUUID } from "node:crypto";

import { z } from "zod";

import { findStorefrontProductBySlug } from "@/data/storefront/catalog";
import {
  checkoutIsConfigured,
  getMercadoPagoClients,
  getStoreUrl,
} from "@/lib/commerce/mercadoPago";
import { calculateShippingQuotes } from "@/lib/commerce/serverShipping";
import { normalizePostalCode } from "@/lib/commerce/shipping";
import { createOrder, updateOrderByReference } from "@/lib/orders/orderStore";
import { checkRateLimit, rateLimitResponse } from "@/lib/security/rateLimit";

export const runtime = "nodejs";

const customerSchema = z.object({
  name: z.string().trim().min(3).max(100),
  email: z.email().max(160),
  phone: z.string().transform((value) => value.replace(/\D/g, "")).pipe(z.string().min(10).max(11)),
  document: z.string().transform((value) => value.replace(/\D/g, "")).pipe(z.string().length(11)),
});

const addressSchema = z.object({
  street: z.string().trim().min(2).max(120),
  number: z.string().trim().min(1).max(20),
  complement: z.string().trim().max(80).optional().default(""),
  neighborhood: z.string().trim().min(2).max(80),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().length(2).transform((value) => value.toUpperCase()),
});

const checkoutSchema = z.discriminatedUnion("deliveryType", [
  z.object({
    productId: z.string().trim().min(1).max(160),
    variant: z.string().trim().max(120).optional().default(""),
    deliveryType: z.literal("pickup"),
    customer: customerSchema,
  }),
  z.object({
    productId: z.string().trim().min(1).max(160),
    variant: z.string().trim().max(120).optional().default(""),
    deliveryType: z.literal("shipping"),
    postalCode: z.string().transform(normalizePostalCode).pipe(z.string().length(8)),
    quoteId: z.number().int().positive(),
    customer: customerSchema,
    address: addressSchema,
  }),
]);

function json(data: unknown, status: number) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  const rateLimit = checkRateLimit(request, "checkout", 8, 60_000);
  if (!rateLimit.allowed) return rateLimitResponse(rateLimit.retryAfterSeconds);

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 12_000) {
    return json({ error: "Dados da compra inválidos." }, 413);
  }

  if (!checkoutIsConfigured()) {
    return json({ error: "A compra pelo site ainda está em configuração." }, 503);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Dados da compra inválidos." }, 400);
  }

  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return json({ error: "Revise os dados pessoais e de entrega." }, 400);
  }

  const data = parsed.data;
  const product = findStorefrontProductBySlug(data.productId);
  if (!product || product.price === null || product.price <= 0) {
    return json({ error: "Produto indisponível para compra no site." }, 404);
  }

  if (
    product.variantValues.length > 1 &&
    (!data.variant || !product.variantValues.includes(data.variant))
  ) {
    return json({ error: "Selecione uma opção válida do produto." }, 400);
  }

  let shippingCost = 0;
  let shippingName = "Retirada em Igarapé";

  if (data.deliveryType === "shipping") {
    try {
      const quotes = await calculateShippingQuotes(data.productId, data.postalCode);
      const selectedQuote = quotes.find((quote) => quote.id === data.quoteId);
      if (!selectedQuote) {
        return json({ error: "O frete escolhido expirou. Calcule novamente." }, 409);
      }
      shippingCost = selectedQuote.price;
      shippingName = `${selectedQuote.company} ${selectedQuote.name}`;
    } catch {
      return json({ error: "Não foi possível confirmar o frete agora." }, 502);
    }
  }

  const orderReference = `IS-${Date.now()}-${randomUUID().slice(0, 8).toUpperCase()}`;
  const [firstName, ...surnameParts] = data.customer.name.split(/\s+/);
  const digits = data.customer.phone;
  const storeUrl = getStoreUrl();

  try {
    await createOrder({
      reference: orderReference,
      source: "site",
      payment_status: "creating",
      order_status: "awaiting_payment",
      customer_name: data.customer.name,
      customer_email: data.customer.email,
      customer_phone: data.customer.phone,
      customer_document: data.customer.document,
      product_id: product.id,
      sku: product.sku ?? product.id,
      product_title: product.title,
      variant: data.variant || null,
      product_amount: Number(product.price.toFixed(2)),
      shipping_type: data.deliveryType,
      shipping_service: shippingName,
      shipping_cost: Number(shippingCost.toFixed(2)),
      postal_code: data.deliveryType === "shipping" ? data.postalCode : null,
      address: data.deliveryType === "shipping" ? data.address : null,
      notes: null,
    });
  } catch {
    return json({ error: "Não foi possível registrar o pedido agora." }, 503);
  }

  try {
    const { preference } = getMercadoPagoClients();
    const result = await preference.create({
      body: {
        items: [
          {
            id: product.sku ?? product.id,
            title: product.title.slice(0, 120),
            description: [data.variant, product.brand].filter(Boolean).join(" · ").slice(0, 250),
            quantity: 1,
            currency_id: "BRL",
            unit_price: Number(product.price.toFixed(2)),
            category_id: "car_electronics",
            type: "physical",
          },
        ],
        payer: {
          name: firstName,
          surname: surnameParts.join(" "),
          email: data.customer.email,
          phone: { area_code: digits.slice(0, 2), number: digits.slice(2) },
          identification: { type: "CPF", number: data.customer.document },
          ...(data.deliveryType === "shipping"
            ? {
                address: {
                  zip_code: data.postalCode,
                  street_name: data.address.street,
                  street_number: data.address.number,
                },
              }
            : {}),
        },
        shipments:
          data.deliveryType === "shipping"
            ? {
                mode: "not_specified",
                cost: Number(shippingCost.toFixed(2)),
                local_pickup: false,
                receiver_address: {
                  zip_code: data.postalCode,
                  street_name: data.address.street,
                  street_number: data.address.number,
                  apartment: [data.address.complement, data.address.neighborhood]
                    .filter(Boolean)
                    .join(" · "),
                  city_name: data.address.city,
                  state_name: data.address.state,
                  country_name: "Brasil",
                },
              }
            : {
                mode: "not_specified",
                cost: 0,
                free_shipping: true,
                local_pickup: true,
              },
        external_reference: orderReference,
        metadata: {
          product_id: product.id,
          sku: product.sku ?? product.id,
          variant: data.variant,
          delivery_type: data.deliveryType,
          shipping_service: shippingName,
        },
        statement_descriptor: "INTERSHIELD",
        payment_methods: { installments: 12 },
        back_urls: {
          success: `${storeUrl}/pedido/resultado`,
          pending: `${storeUrl}/pedido/resultado`,
          failure: `${storeUrl}/pedido/resultado`,
        },
        auto_return: "approved",
        notification_url: `${storeUrl}/api/webhooks/mercado-pago`,
      },
      requestOptions: { idempotencyKey: orderReference },
    });

    const checkoutUrl =
      process.env.MERCADO_PAGO_ENV === "sandbox"
        ? result.sandbox_init_point
        : result.init_point;

    if (!checkoutUrl) throw new Error("Checkout URL was not returned");

    await updateOrderByReference(orderReference, {
      preference_id: result.id ?? null,
      payment_status: "pending",
    });

    return json({ checkoutUrl, orderReference }, 201);
  } catch {
    await updateOrderByReference(orderReference, {
      payment_status: "creation_failed",
      notes: "Falha ao criar a cobrança no Mercado Pago.",
    }).catch(() => null);
    return json({ error: "Não foi possível iniciar o pagamento agora." }, 502);
  }
}
