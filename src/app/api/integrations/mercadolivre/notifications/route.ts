import { timingSafeEqual } from "node:crypto";

import { after } from "next/server";

import { getMercadoLivreConfig } from "@/lib/integrations/mercadolivre/config";
import {
  type MercadoLivreNotification,
  saveMercadoLivreNotification,
} from "@/lib/integrations/mercadolivre/store";

export const runtime = "nodejs";
export const maxDuration = 10;

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
    try {
      await saveMercadoLivreNotification(notification, rawBody);
    } catch (error) {
      console.error("Failed to persist Mercado Livre notification", error);
    }
  });

  return new Response(null, { status: 200 });
}
