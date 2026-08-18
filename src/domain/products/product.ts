import type { ISODateString, UUID, EntityStatus } from "@/domain/shared/types";

export type Product = {
  id: UUID;
  sku: string;
  productTypeId: UUID;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  material: string;
  finish: string;
  thicknessMicrons: number;
  price: number;
  compareAtPrice?: number;
  status: EntityStatus;
  mainImageUrl: string;
  galleryImageUrls: string[];
  seoTitle: string;
  seoDescription: string;
  searchKeywords: string[];
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

export type CreateProductInput = Omit<Product, "id" | "createdAt" | "updatedAt">;

export type UpdateProductInput = Partial<Omit<Product, "createdAt" | "updatedAt">> & {
  id: UUID;
};
