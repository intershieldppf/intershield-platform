import type { UUID, ProductCategory } from "@/domain/shared/types";

export type ProductType = {
  id: UUID;
  name: string;
  slug: string;
  category: ProductCategory;
  description: string;
  isActive: boolean;
};

export type CreateProductTypeInput = Omit<ProductType, "id">;

export type UpdateProductTypeInput = Partial<Omit<ProductType, "id">> & {
  id: UUID;
};
