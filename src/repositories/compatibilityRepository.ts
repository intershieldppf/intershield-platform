import type { Compatibility, CreateCompatibilityInput, UpdateCompatibilityInput } from "@/domain/compatibilities/compatibility";

export interface CompatibilityRepository {
  findById(id: string): Promise<Compatibility | null>;
  list(): Promise<Compatibility[]>;
  create(input: CreateCompatibilityInput): Promise<Compatibility>;
  update(input: UpdateCompatibilityInput): Promise<Compatibility>;
  delete(id: string): Promise<void>;
}
