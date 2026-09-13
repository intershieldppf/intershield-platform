import { timingSafeEqual } from "node:crypto";

import { after } from "next/server";

import { getMercadoLivreConfig } from "@/lib/integrations/mercadolivre/config";
import { processMercadoLivreNotification } from "@/lib/integrations/mercadolivre/events";
import {
  type MercadoLivreNotification,
  saveMercadoLivreNotification,
  updateMercadoLivreNotificationStatus,
} from "@/lib/integrations/mercadolivre/store";

export const runtime = "nodejs";
export const maxDuration = 30;

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function GET() {
  return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 64_000) return new Response(null, { status: 413 });

  let rawBody: string;
  let notification: MercadoLivreNotification;
  try {
    rawBody = await request.text();
    notification = JSON.parse(rawBody) as MercadoLivreNotification;
  } catch {
    return new Response(null, { status: 400 });
  }

  if (
    !notification ||
    typeof notification.resource !== "string" ||
    !notification.resource.startsWith("/") ||
    typeof notification.topic !== "string" ||
    notification.user_id === undefined ||
    notification.application_id === undefined
  ) {
    return new Response(null, { status: 400 });
  }

  try {
    const { clientId } = getMercadoLivreConfig();
    if (!safeEqual(String(notification.application_id), clientId)) {
      return new Response(null, { status: 403 });
    }
  } catch {
    return new Response(null, { status: 503 });
  }

  after(async () => {
    let eventKey: string | null = null;
    try {
      eventKey = await saveMercadoLivreNotification(notification, rawBody);
      await updateMercadoLivreNotificationStatus(eventKey, "processing");
      await processMercadoLivreNotification(notification);
      await updateMercadoLivreNotificationStatus(eventKey, "processed");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      if (eventKey) {
        await updateMercadoLivreNotificationStatus(eventKey, "failed", message).catch(() => undefined);
      }
      console.error("Failed to process Mercado Livre notification", { message });
    }
  });

  return new Response(null, { status: 200 });
}
