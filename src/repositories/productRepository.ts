import type { Product, CreateProductInput, UpdateProductInput } from "@/domain/products/product";
import type { PaginationParams, PaginatedResult, ProductFilters } from "@/domain/shared/types";

export interface ProductRepository {
  findById(id: string): Promise<Product | null>;
  findBySlug(slug: string): Promise<Product | null>;
  list(params?: PaginationParams): Promise<PaginatedResult<Product>>;
  search(query: string, params?: PaginationParams): Promise<PaginatedResult<Product>>;
  filter(filters: ProductFilters, params?: PaginationParams): Promise<PaginatedResult<Product>>;
  create(input: CreateProductInput): Promise<Product>;
  update(input: UpdateProductInput): Promise<Product>;
  delete(id: string): Promise<void>;
}
