import type { ISODateString, UUID, VehicleType } from "@/domain/shared/types";

export type VehicleModel = {
  id: UUID;
  brandId: UUID;
  name: string;
  slug: string;
  aliases: string[];
  vehicleType: VehicleType;
  isActive: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

export type CreateVehicleModelInput = Omit<VehicleModel, "id" | "createdAt" | "updatedAt">;

export type UpdateVehicleModelInput = Partial<Omit<VehicleModel, "createdAt" | "updatedAt">> & {
  id: UUID;
};
