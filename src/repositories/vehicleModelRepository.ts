import type { VehicleModel, CreateVehicleModelInput, UpdateVehicleModelInput } from "@/domain/vehicle-models/vehicleModel";

export interface VehicleModelRepository {
  findById(id: string): Promise<VehicleModel | null>;
  findBySlug(slug: string): Promise<VehicleModel | null>;
  list(): Promise<VehicleModel[]>;
  search(query: string): Promise<VehicleModel[]>;
  create(input: CreateVehicleModelInput): Promise<VehicleModel>;
  update(input: UpdateVehicleModelInput): Promise<VehicleModel>;
  delete(id: string): Promise<void>;
}
