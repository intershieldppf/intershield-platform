import type { Brand } from "@/domain/brands/brand";
import type { VehicleModel } from "@/domain/vehicle-models/vehicleModel";
import type { Vehicle } from "@/domain/vehicles/vehicle";
import type { Product } from "@/domain/products/product";
import type { Compatibility } from "@/domain/compatibilities/compatibility";
import type { ProductType } from "@/domain/product-types/productType";
import type { CatalogService, VehicleSearchFilters, VehicleSearchResult } from "@/services/catalog/catalogService";
import { normalizeSearchText } from "@/lib/search/normalizeSearchText";
import { calculateSearchScore } from "@/lib/search/calculateSearchScore";
import { mockBrands, mockVehicleModels, mockVehicles, mockProductTypes, mockProducts, mockCompatibilities } from "@/data/mockCatalog";
import { VehicleImageService, InMemoryVehicleImageRepository } from "@/catalog/VehicleImageService";
import { vehicleImages } from "@/data/vehicleImages";

function filterVehiclesByText(vehicle: Vehicle, query: string): { score: number; matchedTerms: string[] } {
  const normalizedQuery = normalizeSearchText(query);

  const model = mockVehicleModels.find((item) => item.id === vehicle.vehicleModelId);
  const brand = model ? mockBrands.find((item) => item.id === model.brandId) : null;
  const searchSource = `${brand?.name ?? ""} ${model?.name ?? ""} ${vehicle.generation} ${vehicle.yearStart} ${vehicle.yearEnd} ${vehicle.searchKeywords.join(" ")}`;

  return calculateSearchScore(normalizedQuery, searchSource, model?.aliases ?? []);
}

function getBrandBySlug(slug: string): Brand | null {
  return mockBrands.find((brand) => brand.slug === slug) ?? null;
}

function getVehicleModelBySlug(slug: string): VehicleModel | null {
  return mockVehicleModels.find((model) => model.slug === slug) ?? null;
}

function getVehicleBySlug(slug: string): Vehicle | null {
  return mockVehicles.find((vehicle) => vehicle.slug === slug) ?? null;
}

function getProductsByVehicleId(vehicleId: string): Product[] {
  const compatibilities = mockCompatibilities.filter((item) => item.vehicleId === vehicleId);
  return compatibilities
    .map((compatibility) => mockProducts.find((product) => product.id === compatibility.productId))
    .filter((product): product is Product => Boolean(product));
}

function getProductTypeById(productTypeId: string): ProductType | null {
  return mockProductTypes.find((type) => type.id === productTypeId) ?? null;
}

function getVehicleTypesByVehicleId(vehicleId: string): string[] {
  return getProductsByVehicleId(vehicleId)
    .map((product) => {
      const productType = getProductTypeById(product.productTypeId);
      return productType?.name ?? "";
    })
    .filter(Boolean);
}

function getFirstKitType(vehicleId: string): string | undefined {
  return getVehicleTypesByVehicleId(vehicleId)[0];
}

function getVehiclesByProductId(productId: string): Vehicle[] {
  const compatibilities = mockCompatibilities.filter((item) => item.productId === productId);
  return compatibilities
    .map((compatibility) => mockVehicles.find((vehicle) => vehicle.id === compatibility.vehicleId))
    .filter((vehicle): vehicle is Vehicle => Boolean(vehicle));
}

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

const imageRepository = new InMemoryVehicleImageRepository(vehicleImages);
const imageService = new VehicleImageService(imageRepository, mockVehicles, productData, compatibilityData, []);

function attachVehicleImage(vehicle: Vehicle): Vehicle {
  const imageState = imageService.getOfficialImage(vehicle.id);
  return {
    ...vehicle,
    imageUrl: imageState.imageUrl || null,
    imageSource: imageState.imageSource,
    imageStatus: imageState.imageStatus,
    imageAlt: imageState.imageAlt,
  };
}

export class LocalCatalogService implements CatalogService {
  async listBrands(): Promise<Brand[]> {
    return [...mockBrands];
  }

  async findBrandBySlug(slug: string): Promise<Brand | null> {
    return getBrandBySlug(slug);
  }

  async listVehicleModelsByBrand(brandSlug: string): Promise<VehicleModel[]> {
    const brand = getBrandBySlug(brandSlug);
    if (!brand) {
      return [];
    }
    return mockVehicleModels.filter((model) => model.brandId === brand.id);
  }

  async findVehicleModelBySlug(slug: string): Promise<VehicleModel | null> {
    return getVehicleModelBySlug(slug);
  }

  async listVehicles(): Promise<Vehicle[]> {
    return mockVehicles.map(attachVehicleImage);
  }

  async findVehicleById(id: string): Promise<Vehicle | null> {
    const vehicle = mockVehicles.find((vehicle) => vehicle.id === id);
    return vehicle ? attachVehicleImage(vehicle) : null;
  }

  async findVehicleBySlug(slug: string): Promise<Vehicle | null> {
    const vehicle = getVehicleBySlug(slug);
    return vehicle ? attachVehicleImage(vehicle) : null;
  }

  async searchVehicles(
  query: string,
  filters?: VehicleSearchFilters
): Promise<VehicleSearchResult[]> {
  const normalizedQuery = normalizeSearchText(query);

  let apiQuery = query.trim();

  if (
    filters?.year &&
    !apiQuery.includes(String(filters.year))
  ) {
    apiQuery = `${apiQuery} ${filters.year}`.trim();
  }

  const response = await fetch(
    `/api/veiculos?q=${encodeURIComponent(apiQuery)}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    console.error(
      "Erro ao carregar veículos da Matriz Mestre:",
      response.status
    );

    return [];
  }

  type ApiVehicle = {
    vehicleId: string;
    vehicleIds?: string[];
    brand: string | null;
    model: string | null;
    yearStart: number | null;
    yearEnd: number | null;
    slug: string | null;
    imageUrl: string | null;
    imageStatus: string | null;
    imageAlt: string | null;
  };

  const data = (await response.json()) as {
    vehicles: ApiVehicle[];
  };

  function createSlug(value: string) {
    return normalizeSearchText(value)
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }

  const results = data.vehicles
    .filter((item) => {
      if (!filters?.brandSlug) {
        return true;
      }

      return createSlug(item.brand ?? "") === filters.brandSlug;
    })
    .map((item) => {
      const brandName = item.brand ?? "Marca";
      const modelName = item.model ?? "Modelo";

      const brandSlug = createSlug(brandName);

      const existingBrand = mockBrands.find(
        (brand) =>
          normalizeSearchText(brand.name) ===
          normalizeSearchText(brandName)
      );

      const brand =
        existingBrand ?? {
          ...mockBrands[0],
          id: `api-brand-${brandSlug}`,
          name: brandName,
          slug: brandSlug,
        };

      const existingModel = mockVehicleModels.find(
        (model) =>
          normalizeSearchText(model.name) ===
            normalizeSearchText(modelName) &&
          model.brandId === brand.id
      );

      const vehicleModel =
        existingModel ?? {
          ...mockVehicleModels[0],
          id: `api-model-${item.vehicleId}`,
          brandId: brand.id,
          name: modelName,
          slug: createSlug(modelName),
        };

      const yearStart =
        item.yearStart ??
        item.yearEnd ??
        0;

      const yearEnd =
        item.yearEnd ??
        item.yearStart ??
        yearStart;

      const vehicleSlug =
        item.slug ??
        createSlug(
          `${brandName}-${modelName}-${yearStart}-${yearEnd}`
        );

      const vehicle = {
        ...mockVehicles[0],
        id: item.vehicleId,
        vehicleModelId: vehicleModel.id,
        slug: vehicleSlug,
        yearStart,
        yearEnd,
        generation:
          yearStart && yearEnd
            ? `${yearStart}-${yearEnd}`
            : "",
        isActive: true,
      };

      const searchSource = normalizeSearchText(
        `${brandName} ${modelName} ${yearStart} ${yearEnd}`
      );

      const { score, matchedTerms } =
        calculateSearchScore(
          normalizedQuery,
          searchSource,
          vehicleModel.aliases ?? []
        );

      return {
        vehicle,
        brand,
        vehicleModel,
        score,
        matchedTerms,

        // Ligaremos os produtos reais no próximo sprint.
        compatibleProductCount: 0,

        imageUrl: item.imageUrl,
        imageAlt:
          item.imageAlt ??
          `${brandName} ${modelName}`,

        kitType: "Ver opções",
      };
    })
    .filter(
      (result) =>
        result.score > 0 ||
        normalizedQuery === ""
    )
    .sort((a, b) => b.score - a.score);

  return results;
}
    

  async listProducts(): Promise<Product[]> {
    return [...mockProducts];
  }

  async findProductById(id: string): Promise<Product | null> {
    return mockProducts.find((product) => product.id === id) ?? null;
  }

  async findProductBySlug(slug: string): Promise<Product | null> {
    return mockProducts.find((product) => product.slug === slug) ?? null;
  }

  async findProductTypeById(id: string): Promise<ProductType | null> {
    return getProductTypeById(id);
  }

  async listCompatibilities(): Promise<Compatibility[]> {
    return [...mockCompatibilities];
  }

  async listProductsByVehicleId(vehicleId: string): Promise<Product[]> {
    return getProductsByVehicleId(vehicleId);
  }

  async listVehiclesByProductId(productId: string): Promise<Vehicle[]> {
    return getVehiclesByProductId(productId);
  }
}
