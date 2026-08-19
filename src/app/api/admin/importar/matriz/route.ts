export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { CatalogEngine } from "@/catalog";
import {
  extractMarketplaceProductsFromArrayBuffer,
  marketplaceImportCoverage,
} from "@/data/storefront/marketplaceImport";

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

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
      { status: 200 },
    );
  } catch (error: unknown) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const fileValue = formData.get("file");

    if (!(fileValue instanceof File)) {
      return NextResponse.json({ error: "Envie um arquivo .xlsx no campo file." }, { status: 400 });
    }

    if (!fileValue.name.toLowerCase().endsWith(".xlsx")) {
      return NextResponse.json({ error: "Formato inválido. Envie um arquivo .xlsx." }, { status: 400 });
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
