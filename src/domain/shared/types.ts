export type UUID = string;
export type ISODateString = string;

export type VehicleType = "car" | "motorcycle";

export type EntityStatus = "draft" | "active" | "inactive" | "archived";

export type ProductCategory =
  | "multimedia"
  | "dashboard"
  | "interior"
  | "exterior"
  | "interior_exterior"
  | "black_piano_ppf"
  | "black_piano_vinyl"
  | "blackout"
  | "headlight"
  | "motorcycle"
  | "universal";

export type PaginationParams = {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
};

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

export type VehicleFilters = {
  brandId?: UUID;
  vehicleModelId?: UUID;
  vehicleType?: VehicleType;
  year?: number;
  keywords?: string;
  isActive?: boolean;
};

export type ProductFilters = {
  productTypeId?: UUID;
  category?: ProductCategory;
  status?: EntityStatus;
  minPrice?: number;
  maxPrice?: number;
  keywords?: string;
  isActive?: boolean;
};
