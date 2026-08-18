import type { Vehicle, CreateVehicleInput, UpdateVehicleInput } from "@/domain/vehicles/vehicle";
import type { PaginationParams, PaginatedResult, VehicleFilters } from "@/domain/shared/types";

export interface VehicleRepository {
  findById(id: string): Promise<Vehicle | null>;
  findBySlug(slug: string): Promise<Vehicle | null>;
  list(params?: PaginationParams): Promise<PaginatedResult<Vehicle>>;
  search(query: string, params?: PaginationParams): Promise<PaginatedResult<Vehicle>>;
  filter(filters: VehicleFilters, params?: PaginationParams): Promise<PaginatedResult<Vehicle>>;
  create(input: CreateVehicleInput): Promise<Vehicle>;
  update(input: UpdateVehicleInput): Promise<Vehicle>;
  delete(id: string): Promise<void>;
}
