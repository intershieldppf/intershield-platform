import {
  InvalidWebhookSignatureError,
  WebhookSignatureValidator,
} from "mercadopago";

import { getMercadoPagoClients } from "@/lib/commerce/mercadoPago";
import { updateOrderByReference } from "@/lib/orders/orderStore";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;
  if (!secret) return new Response(null, { status: 503 });

  const url = new URL(request.url);
  const dataId = url.searchParams.get("data.id");

  try {
    WebhookSignatureValidator.validate({
      xSignature: request.headers.get("x-signature"),
      xRequestId: request.headers.get("x-request-id"),
      dataId,
      secret,
      toleranceSeconds: 300,
    });
  } catch (error) {
    if (error instanceof InvalidWebhookSignatureError) {
      return new Response(null, { status: 401 });
    }
    return new Response(null, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(null, { status: 400 });
  }

  const event = body as { type?: unknown; data?: { id?: unknown } };
  if (event.type === "payment" && String(event.data?.id ?? "") === dataId) {
    try {
      const { payment } = getMercadoPagoClients();
      const result = await payment.get({ id: dataId });
      const reference = result.external_reference;

      if (reference?.startsWith("IS-")) {
        const paymentStatus = result.status ?? "unknown";
        const orderStatus =
          paymentStatus === "approved"
            ? "new"
            : paymentStatus === "cancelled" || paymentStatus === "rejected"
              ? "cancelled"
              : "awaiting_payment";

        await updateOrderByReference(reference, {
          payment_id: String(result.id ?? dataId),
          payment_status: paymentStatus,
          order_status: orderStatus,
          paid_at: result.date_approved ?? null,
        });
      }
    } catch {
      return new Response(null, { status: 502 });
    }
  }

  return new Response(null, { status: 200 });
}
