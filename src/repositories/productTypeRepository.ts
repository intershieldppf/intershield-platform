import type { ProductType, CreateProductTypeInput, UpdateProductTypeInput } from "@/domain/product-types/productType";

export interface ProductTypeRepository {
  findById(id: string): Promise<ProductType | null>;
  findBySlug(slug: string): Promise<ProductType | null>;
  list(): Promise<ProductType[]>;
  create(input: CreateProductTypeInput): Promise<ProductType>;
  update(input: UpdateProductTypeInput): Promise<ProductType>;
  delete(id: string): Promise<void>;
}
