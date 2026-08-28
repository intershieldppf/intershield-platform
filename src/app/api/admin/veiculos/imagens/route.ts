export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { mockBrands, mockVehicleModels, mockVehicles, mockProducts, mockCompatibilities } from "@/data/mockCatalog";
import { VehicleImageService } from "@/catalog/VehicleImageService";
import { requireAdminRequest } from "@/lib/security/adminAuth";
import { vehicleImageRepository } from "@/lib/admin/vehicleImageStore";

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

const service = new VehicleImageService(repository, mockVehicles, productData, compatibilityData, []);

function getBrandName(vehicleId: string) {
  const vehicle = mockVehicles.find((item) => item.id === vehicleId);
  if (!vehicle) return null;
  const model = mockVehicleModels.find((item) => item.id === vehicle.vehicleModelId);
  if (!model) return null;
  const brand = mockBrands.find((item) => item.id === model.brandId);
  return brand?.name ?? null;
}

function getModelName(vehicleId: string) {
  const vehicle = mockVehicles.find((item) => item.id === vehicleId);
  if (!vehicle) return null;
  const model = mockVehicleModels.find((item) => item.id === vehicle.vehicleModelId);
  return model?.name ?? null;
}

function getVehicleType(vehicleId: string) {
  const vehicle = mockVehicles.find((item) => item.id === vehicleId);
  if (!vehicle) return null;
  const model = mockVehicleModels.find((item) => item.id === vehicle.vehicleModelId);
  return model?.vehicleType ?? null;
}

export async function GET(request: Request) {
  const unauthorized = requireAdminRequest(request);
  if (unauthorized) return unauthorized;

  const vehicles = service.listVehicles();

  const payload = vehicles.map((vehicle) => ({
    id: vehicle.id,
    brand: getBrandName(vehicle.id),
    model: getModelName(vehicle.id),
    yearStart: vehicle.yearStart,
    yearEnd: vehicle.yearEnd,
    slug: vehicle.slug,
    imageUrl: vehicle.imageUrl || null,
    imageSource: vehicle.imageSource,
    imageStatus: vehicle.imageStatus,
    imageAlt: vehicle.imageAlt,
    candidateCount: vehicle.candidateCount,
    type: getVehicleType(vehicle.id),
  }));

  return NextResponse.json({ vehicles: payload }, { status: 200 });
}
