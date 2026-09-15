import { getShopeeSafeDiagnostics } from "@/lib/integrations/shopee/config";
import { requireAdminRequest } from "@/lib/security/adminAuth";

export const runtime = "nodejs";

export function GET(request: Request) {
  const unauthorized = requireAdminRequest(request);
  if (unauthorized) return unauthorized;

  try {
    return Response.json(getShopeeSafeDiagnostics(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return Response.json(
      { error: "A integração da Shopee ainda não está configurada." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
