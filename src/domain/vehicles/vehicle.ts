import type { ISODateString, UUID } from "@/domain/shared/types";

export type Vehicle = {
  id: UUID;
  vehicleModelId: UUID;
  generation: string;
  yearStart: number;
  yearEnd: number;
  versions: string[];
  searchKeywords: string[];
  slug: string;
  imageUrl?: string | null;
  imageSource?: "manual" | "catalog" | "marketplace" | null;
  imageStatus?: "missing" | "selected" | "review" | null;
  imageAlt?: string | null;
  isActive: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

export type CreateVehicleInput = Omit<Vehicle, "id" | "createdAt" | "updatedAt">;

export type UpdateVehicleInput = Partial<Omit<Vehicle, "createdAt" | "updatedAt">> & {
  id: UUID;
};
