import type { ISODateString, UUID } from "@/domain/shared/types";

export type Compatibility = {
  id: UUID;
  productId: UUID;
  vehicleId: UUID;
  yearStartOverride?: number;
  yearEndOverride?: number;
  versionRestrictions: string[];
  notes: string;
  isConfirmed: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

export type CreateCompatibilityInput = Omit<Compatibility, "id" | "createdAt" | "updatedAt">;

export type UpdateCompatibilityInput = Partial<Omit<Compatibility, "createdAt" | "updatedAt">> & {
  id: UUID;
};
