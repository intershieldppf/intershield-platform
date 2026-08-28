export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { CatalogEngine } from "@/catalog/CatalogEngine";
import {
  extractMarketplaceProductsFromArrayBuffer,
  marketplaceImportCoverage,
} from "@/data/storefront/marketplaceImport";
import { requireAdminRequest } from "@/lib/security/adminAuth";
import { checkRateLimit, rateLimitResponse } from "@/lib/security/rateLimit";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

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
      { status: 200 },
    );
  } catch (error: unknown) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const unauthorized = requireAdminRequest(request);
  if (unauthorized) return unauthorized;

  const rateLimit = checkRateLimit(request, "admin-matrix-import", 10, 60_000);
  if (!rateLimit.allowed) return rateLimitResponse(rateLimit.retryAfterSeconds);

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "O arquivo deve ter no máximo 5 MB." }, { status: 413 });
  }

  try {
    const formData = await request.formData();
    const fileValue = formData.get("file");

    if (!(fileValue instanceof File)) {
      return NextResponse.json({ error: "Envie um arquivo .xlsx no campo file." }, { status: 400 });
    }

    if (!fileValue.name.toLowerCase().endsWith(".xlsx")) {
      return NextResponse.json({ error: "Formato inválido. Envie um arquivo .xlsx." }, { status: 400 });
    }

    if (fileValue.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: "O arquivo deve ter no máximo 5 MB." }, { status: 413 });
    }

    const arrayBuffer = await fileValue.arrayBuffer();
    const marketplaceProducts = extractMarketplaceProductsFromArrayBuffer(arrayBuffer);

    if (!marketplaceProducts.length) {
      return NextResponse.json(
        {
          error:
            "Não encontramos uma exportação compatível. O arquivo precisa conter a aba Original_ML ou colunas de anúncio como ID do Anúncios, Título e Descrição.",
        },
        { status: 422 },
      );
    }

    const coverage = marketplaceImportCoverage(marketplaceProducts);

    return NextResponse.json(
      {
        fileName: fileValue.name,
        analyzedAt: new Date().toISOString(),
        importStandard: "InterShield Storefront Product V1",
        coverage: {
          ...coverage,
          missingDescription: coverage.products - coverage.withDescription,
          missingImages: coverage.products - coverage.withImages,
          missingSku: coverage.products - coverage.withSku,
          missingPrice: coverage.products - coverage.withPrice,
        },
        rules: {
          listingId: "obrigatório",
          title: "obrigatório",
          description: "recomendado; página usa fallback padronizado quando ausente",
          images: "recomendado; usa imagem principal do catálogo quando ausente",
          sku: "recomendado para operação e rastreabilidade",
          price: "recomendado para venda direta",
          variants: "preservadas e consolidadas por anúncio",
        },
        preview: marketplaceProducts.slice(0, 12).map((product) => ({
          listingId: product.listingId,
          title: product.title,
          sku: product.sku,
          price: product.price,
          hasDescription: Boolean(product.description),
          images: product.images.length,
          variants: product.variantValues,
        })),
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 500 });
  }
}
