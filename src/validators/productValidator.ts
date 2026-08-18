import { z } from "zod";

export const productSchema = z.object({
  id: z.string().uuid(),
  sku: z.string().min(1),
  productTypeId: z.string().uuid(),
  name: z.string().min(1),
  slug: z.string().min(1),
  shortDescription: z.string(),
  fullDescription: z.string(),
  material: z.string(),
  finish: z.string(),
  thicknessMicrons: z.number().int().nonnegative(),
  price: z.number().nonnegative(),
  compareAtPrice: z.number().nonnegative().optional(),
  status: z.enum(["draft", "active", "inactive", "archived"]),
  mainImageUrl: z.string().url(),
  galleryImageUrls: z.array(z.string().url()),
  seoTitle: z.string(),
  seoDescription: z.string(),
  searchKeywords: z.array(z.string()),
  createdAt: z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "Invalid ISO date",
  }),
  updatedAt: z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "Invalid ISO date",
  }),
});

export const createProductInputSchema = productSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const updateProductInputSchema = productSchema.partial().extend({ id: productSchema.shape.id });
