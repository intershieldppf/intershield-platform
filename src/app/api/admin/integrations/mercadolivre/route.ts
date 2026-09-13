import { getMercadoLivreDashboard } from "@/lib/integrations/mercadolivre/syncStore";
import { synchronizeMercadoLivre } from "@/lib/integrations/mercadolivre/sync";
import { checkRateLimit, rateLimitResponse } from "@/lib/security/rateLimit";
import { requireAdminRequest } from "@/lib/security/adminAuth";

export const runtime = "nodejs";
export const maxDuration = 60;

function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

export async function GET(request: Request) {
  const unauthorized = requireAdminRequest(request);
  if (unauthorized) return unauthorized;
  try {
    return json({ dashboard: await getMercadoLivreDashboard() });
  } catch {
    return json({ error: "Não foi possível carregar a integração do Mercado Livre." }, 502);
  }
}

export async function POST(request: Request) {
  const unauthorized = requireAdminRequest(request);
  if (unauthorized) return unauthorized;
  const rateLimit = checkRateLimit(request, "admin-mercadolivre-sync", 3, 10 * 60_000);
  if (!rateLimit.allowed) return rateLimitResponse(rateLimit.retryAfterSeconds);
  try {
    const result = await synchronizeMercadoLivre();
    return json({ result, dashboard: await getMercadoLivreDashboard() });
  } catch (error) {
    console.error("Mercado Livre initial sync failed", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return json({ error: "A sincronização não foi concluída. Consulte o registro da última tentativa." }, 502);
  }
}

