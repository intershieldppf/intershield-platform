import type { Brand } from "@/domain/brands/brand";
import type { VehicleModel } from "@/domain/vehicle-models/vehicleModel";
import type { Vehicle } from "@/domain/vehicles/vehicle";
import type { ProductType } from "@/domain/product-types/productType";
import type { Product } from "@/domain/products/product";
import type { Compatibility } from "@/domain/compatibilities/compatibility";
import type { VehicleType } from "@/domain/shared/types";

export type VehicleSearchFilters = {
  brandSlug?: string;
  vehicleType?: VehicleType;
  year?: number;
  isActive?: boolean;
};

export type VehicleSearchResult = {
  vehicle: Vehicle;
  brand: Brand;
  vehicleModel: VehicleModel;
  score: number;
  matchedTerms: string[];
  compatibleProductCount: number;
  imageUrl?: string | null;
  imageAlt?: string | null;
  kitType?: string;
};

export interface CatalogService {
  listBrands(): Promise<Brand[]>;
  findBrandBySlug(slug: string): Promise<Brand | null>;
  listVehicleModelsByBrand(brandSlug: string): Promise<VehicleModel[]>;
  findVehicleModelBySlug(slug: string): Promise<VehicleModel | null>;
  listVehicles(): Promise<Vehicle[]>;
  findVehicleById(id: string): Promise<Vehicle | null>;
  findVehicleBySlug(slug: string): Promise<Vehicle | null>;
  searchVehicles(query: string, filters?: VehicleSearchFilters): Promise<VehicleSearchResult[]>;
  listProducts(): Promise<Product[]>;
  findProductById(id: string): Promise<Product | null>;
  findProductBySlug(slug: string): Promise<Product | null>;
  findProductTypeById(id: string): Promise<ProductType | null>;
  listCompatibilities(): Promise<Compatibility[]>;
  listProductsByVehicleId(vehicleId: string): Promise<Product[]>;
  listVehiclesByProductId(productId: string): Promise<Vehicle[]>;
}
