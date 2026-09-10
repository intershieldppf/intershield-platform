import {
  InvalidWebhookSignatureError,
  MercadoPagoConfig,
  Payment,
  WebhookSignatureValidator,
} from "mercadopago";
import { z } from "zod";

import {
  findOrderByPublicId,
  registerPaymentUpdate,
} from "@/lib/commerce/orders";
import { isOrderStoreConfigured } from "@/lib/commerce/supabaseAdmin";

export const runtime = "nodejs";

const notificationSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  type: z.string().optional(),
  action: z.string().optional(),
  data: z.object({ id: z.union([z.string(), z.number()]) }).optional(),
});

function orderStatusForPayment(paymentStatus: string) {
  const statusMap: Record<string, string> = {
    approved: "paid",
    authorized: "authorized",
    pending: "awaiting_payment",
    in_process: "awaiting_payment",
    in_mediation: "payment_review",
    rejected: "payment_rejected",
    cancelled: "cancelled",
    refunded: "refunded",
    charged_back: "charged_back",
  };

  return statusMap[paymentStatus] ?? "payment_review";
}

export async function POST(request: Request) {
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  const webhookSecret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;

  if (!accessToken || !webhookSecret || !isOrderStoreConfigured()) {
    return new Response(null, { status: 503 });
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return new Response(null, { status: 400 });
  }

  const parsed = notificationSchema.safeParse(payload);
  if (!parsed.success || (parsed.data.type && parsed.data.type !== "payment")) {
    return new Response(null, { status: 200 });
  }

  const url = new URL(request.url);
  const dataId =
    url.searchParams.get("data.id") ?? String(parsed.data.data?.id ?? "");

  if (!dataId) return new Response(null, { status: 400 });

  try {
    WebhookSignatureValidator.validate({
      xSignature: request.headers.get("x-signature"),
      xRequestId: request.headers.get("x-request-id"),
      dataId,
      secret: webhookSecret,
    });
  } catch (error) {
    if (error instanceof InvalidWebhookSignatureError) {
      return new Response(null, { status: 401 });
    }
    return new Response(null, { status: 500 });
  }

  try {
    const mercadoPago = new MercadoPagoConfig({
      accessToken,
      options: { timeout: 10_000, maxRetries: 1 },
    });
    const payment = await new Payment(mercadoPago).get({ id: dataId });
    const publicId = payment.external_reference;

    if (!publicId || !payment.status) {
      return new Response(null, { status: 200 });
    }

    const order = await findOrderByPublicId(publicId);
    if (!order) return new Response(null, { status: 200 });

    const amount =
      typeof payment.transaction_amount === "number"
        ? payment.transaction_amount
        : null;
    const amountMatches =
      amount !== null && Math.abs(Number(order.total) - amount) < 0.01;
    const status = amountMatches ? payment.status : "amount_mismatch";
    const orderStatus = amountMatches
      ? orderStatusForPayment(payment.status)
      : "payment_review";

    await registerPaymentUpdate({
      orderId: order.id,
      eventId: String(parsed.data.id ?? `${dataId}:${payment.status}`),
      paymentId: String(payment.id ?? dataId),
      paymentStatus: status,
      statusDetail: payment.status_detail ?? null,
      transactionAmount: amount,
      orderStatus,
    });

    return new Response(null, { status: 200 });
  } catch {
    return new Response(null, { status: 500 });
  }
}
