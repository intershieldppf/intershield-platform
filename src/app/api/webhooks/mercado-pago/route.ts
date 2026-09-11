import {
  InvalidWebhookSignatureError,
  WebhookSignatureValidator,
} from "mercadopago";

import { getMercadoPagoClients } from "@/lib/commerce/mercadoPago";

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
      await payment.get({ id: dataId });
    } catch {
      return new Response(null, { status: 502 });
    }
  }

  return new Response(null, { status: 200 });
}
