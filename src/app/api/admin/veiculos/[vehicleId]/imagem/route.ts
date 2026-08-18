export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { vehicleImages } from "@/data/vehicleImages";
import { mockProducts, mockCompatibilities } from "@/data/mockCatalog";
import { VehicleImageService, InMemoryVehicleImageRepository } from "@/catalog/VehicleImageService";

const repository = new InMemoryVehicleImageRepository(vehicleImages);
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
  } catch (error: any) {
    return NextResponse.json({ error: String(error.message ?? error) }, { status: 400 });
  }
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ vehicleId: string }> }) {
  const { vehicleId } = await context.params;
  try {
    const image = service.removeSelection(vehicleId);
    return NextResponse.json({ image }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: String(error.message ?? error) }, { status: 400 });
  }
}
