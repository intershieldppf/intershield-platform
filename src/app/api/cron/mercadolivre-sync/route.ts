import { timingSafeEqual } from "node:crypto";

import { synchronizeMercadoLivre } from "@/lib/integrations/mercadolivre/sync";

export const runtime = "nodejs";
export const maxDuration = 60;

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization") ?? "";
  if (!secret || !safeEqual(authorization, `Bearer ${secret}`)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await synchronizeMercadoLivre({ maximumItems: 1_000, maximumOrders: 100 });
    return Response.json({ ok: true, result }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Scheduled Mercado Livre sync failed", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return Response.json({ error: "Scheduled sync failed" }, { status: 502 });
  }
}

