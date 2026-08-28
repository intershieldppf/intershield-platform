export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { mockProducts, mockCompatibilities } from "@/data/mockCatalog";
import { VehicleImageService } from "@/catalog/VehicleImageService";
import { vehicleImageRepository } from "@/lib/admin/vehicleImageStore";
import { requireAdminRequest } from "@/lib/security/adminAuth";
import { checkRateLimit, rateLimitResponse } from "@/lib/security/rateLimit";

const repository = vehicleImageRepository;
const productData = mockProducts.map((product) => ({
  productId: product.id,
  sku: product.sku,
  name: product.name,
  mainImage: product.mainImageUrl,
  gallery: product.galleryImageUrls,
}));
const compatibilityData = mockCompatibilities.map((item) => ({
  productId: item.productId,
  vehicleId: item.vehicleId,
}));
const service = new VehicleImageService(repository, [], productData, compatibilityData, []);

export async function POST(request: NextRequest, context: { params: Promise<{ vehicleId: string }> }) {
  const unauthorized = requireAdminRequest(request);
  if (unauthorized) return unauthorized;

  const rateLimit = checkRateLimit(request, "admin-vehicle-image", 30, 60_000);
  if (!rateLimit.allowed) return rateLimitResponse(rateLimit.retryAfterSeconds);

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 8_192) {
    return NextResponse.json({ error: "Dados da imagem excedem o limite permitido." }, { status: 413 });
  }

  const { vehicleId } = await context.params;
  try {
    const body = await request.json();
    const { imageUrl, imageSource, imageAlt } = body;
    if (!imageUrl || typeof imageUrl !== "string") {
      return NextResponse.json({ error: "URL de imagem obrigatória." }, { status: 400 });
    }
    if (imageSource !== "manual" && imageSource !== "catalog" && imageSource !== "marketplace") {
      return NextResponse.json({ error: "Fonte de imagem inválida." }, { status: 400 });
    }

    const image = service.selectImage(vehicleId, imageUrl, imageSource, imageAlt ?? null);
    return NextResponse.json({ image }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ vehicleId: string }> }) {
  const unauthorized = requireAdminRequest(request);
  if (unauthorized) return unauthorized;

  const rateLimit = checkRateLimit(request, "admin-vehicle-image", 30, 60_000);
  if (!rateLimit.allowed) return rateLimitResponse(rateLimit.retryAfterSeconds);

  const { vehicleId } = await context.params;
  try {
    const image = service.removeSelection(vehicleId);
    return NextResponse.json({ image }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
