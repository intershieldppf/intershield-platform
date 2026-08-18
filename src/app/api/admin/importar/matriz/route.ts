export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { CatalogEngine } from "@/catalog";

export async function GET() {
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
  } catch (err: any) {
    return NextResponse.json({ error: String(err.message ?? err) }, { status: 500 });
  }
}
