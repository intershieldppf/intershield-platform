import { randomUUID } from "node:crypto";

import { z } from "zod";

import { createOrder, listOrders, orderStoreIsConfigured } from "@/lib/orders/orderStore";
import { checkRateLimit, rateLimitResponse } from "@/lib/security/rateLimit";

export const runtime = "nodejs";

const manualOrderSchema = z.object({
  customerName: z.string().trim().min(3).max(100),
  customerPhone: z.string().transform((value) => value.replace(/\D/g, "")).pipe(z.string().min(10).max(11)),
  customerEmail: z.union([z.literal(""), z.email().max(160)]).optional().default(""),
  productTitle: z.string().trim().min(3).max(180),
  sku: z.string().trim().max(80).optional().default(""),
  variant: z.string().trim().max(120).optional().default(""),
  productAmount: z.coerce.number().nonnegative().max(1_000_000),
  shippingType: z.enum(["pickup", "shipping"]),
  shippingService: z.string().trim().max(120).optional().default(""),
  shippingCost: z.coerce.number().nonnegative().max(100_000).default(0),
  postalCode: z.string().transform((value) => value.replace(/\D/g, "")).pipe(z.union([z.literal(""), z.string().length(8)])).optional().default(""),
  street: z.string().trim().max(120).optional().default(""),
  number: z.string().trim().max(20).optional().default(""),
  complement: z.string().trim().max(80).optional().default(""),
  neighborhood: z.string().trim().max(80).optional().default(""),
  city: z.string().trim().max(80).optional().default(""),
  state: z.string().trim().max(2).transform((value) => value.toUpperCase()).optional().default(""),
  notes: z.string().trim().max(1000).optional().default(""),
});

function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

export async function GET() {
  if (!orderStoreIsConfigured()) return json({ error: "Banco de pedidos não configurado." }, 503);
  try {
    return json({ orders: await listOrders() });
  } catch {
    return json({ error: "Não foi possível carregar os pedidos." }, 502);
  }
}

export async function POST(request: Request) {
  const rateLimit = checkRateLimit(request, "admin-create-order", 30, 60_000);
  if (!rateLimit.allowed) return rateLimitResponse(rateLimit.retryAfterSeconds);

  let body: unknown;
  try { body = await request.json(); } catch { return json({ error: "Dados inválidos." }, 400); }
  const parsed = manualOrderSchema.safeParse(body);
  if (!parsed.success) return json({ error: "Revise os dados do pedido manual." }, 400);

  const data = parsed.data;
  try {
    const order = await createOrder({
      reference: `MAN-${Date.now()}-${randomUUID().slice(0, 6).toUpperCase()}`,
      source: "manual",
      payment_status: "manual",
      order_status: "new",
      customer_name: data.customerName,
      customer_email: data.customerEmail || null,
      customer_phone: data.customerPhone,
      customer_document: null,
      product_id: null,
      sku: data.sku || null,
      product_title: data.productTitle,
      variant: data.variant || null,
      product_amount: data.productAmount,
      shipping_type: data.shippingType,
      shipping_service: data.shippingService || (data.shippingType === "pickup" ? "Retirada em Igarapé" : null),
      shipping_cost: data.shippingCost,
      postal_code: data.postalCode || null,
      address: data.shippingType === "shipping" ? {
        street: data.street,
        number: data.number,
        complement: data.complement,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
      } : null,
      notes: data.notes || null,
    });
    return json({ order }, 201);
  } catch {
    return json({ error: "Não foi possível criar o pedido manual." }, 502);
  }
}
