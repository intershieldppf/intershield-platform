import { z } from "zod";

import { ORDER_STATUSES, updateOrderById } from "@/lib/orders/orderStore";
import { checkRateLimit, rateLimitResponse } from "@/lib/security/rateLimit";

export const runtime = "nodejs";

const updateSchema = z.object({
  orderStatus: z.enum(ORDER_STATUSES).optional(),
  trackingCode: z.string().trim().max(120).nullable().optional(),
  trackingUrl: z.union([z.literal(""), z.url().max(500)]).nullable().optional(),
  notes: z.string().trim().max(1000).nullable().optional(),
}).refine((value) => Object.keys(value).length > 0);

export async function PATCH(
  request: Request,
  context: { params: Promise<{ orderId: string }> },
) {
  const rateLimit = checkRateLimit(request, "admin-update-order", 60, 60_000);
  if (!rateLimit.allowed) return rateLimitResponse(rateLimit.retryAfterSeconds);

  const { orderId } = await context.params;
  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: "Dados inválidos." }, { status: 400 }); }
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "Atualização inválida." }, { status: 400 });

  const values = parsed.data;
  try {
    const order = await updateOrderById(orderId, {
      ...(values.orderStatus ? { order_status: values.orderStatus } : {}),
      ...(values.trackingCode !== undefined ? { tracking_code: values.trackingCode || null } : {}),
      ...(values.trackingUrl !== undefined ? { tracking_url: values.trackingUrl || null } : {}),
      ...(values.notes !== undefined ? { notes: values.notes || null } : {}),
    });
    return Response.json({ order }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Não foi possível atualizar o pedido." }, { status: 502 });
  }
}
