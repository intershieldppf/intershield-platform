import type { Brand, CreateBrandInput, UpdateBrandInput } from "@/domain/brands/brand";

export interface BrandRepository {
  findById(id: string): Promise<Brand | null>;
  findBySlug(slug: string): Promise<Brand | null>;
  list(): Promise<Brand[]>;
  create(input: CreateBrandInput): Promise<Brand>;
  update(input: UpdateBrandInput): Promise<Brand>;
  delete(id: string): Promise<void>;
}
