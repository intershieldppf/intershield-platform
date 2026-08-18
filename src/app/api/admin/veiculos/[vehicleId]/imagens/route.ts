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

export async function GET(_request: NextRequest, context: { params: Promise<{ vehicleId: string }> }) {
  const { vehicleId } = await context.params;
  const candidates = service.getCandidates(vehicleId);
  const image = service.getOfficialImage(vehicleId);
  return NextResponse.json({ candidates, image }, { status: 200 });
}
