import type { ISODateString, UUID } from "@/domain/shared/types";

export type Brand = {
  id: UUID;
  name: string;
  slug: string;
  aliases: string[];
  isActive: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

export type CreateBrandInput = Omit<Brand, "id" | "createdAt" | "updatedAt">;

export type UpdateBrandInput = Partial<Omit<Brand, "createdAt" | "updatedAt">> & {
  id: UUID;
};
