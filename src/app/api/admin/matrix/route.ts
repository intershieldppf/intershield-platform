import { NextResponse } from "next/server";
import { CatalogEngine } from "@/catalog/CatalogEngine";
import { requireAdminRequest } from "@/lib/security/adminAuth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const unauthorized = requireAdminRequest(request);
  if (unauthorized) return unauthorized;

  try {
    const result = await CatalogEngine.loadFromProjectMatrix();

    return NextResponse.json(
      {
        fileName: result.fileName,
        analyzedAt: result.analyzedAt,
        sheetSummaries: result.sheetSummaries,
        statistics: result.statistics,
        validation: result.validation,
        previewVariants: result.previewVariants,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
