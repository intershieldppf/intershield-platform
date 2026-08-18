import { z } from "zod";

export const productTypeSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  slug: z.string().min(1),
  category: z.enum([
    "multimedia",
    "dashboard",
    "interior",
    "exterior",
    "interior_exterior",
    "black_piano_ppf",
    "black_piano_vinyl",
    "blackout",
    "headlight",
    "motorcycle",
    "universal",
  ]),
  description: z.string(),
  isActive: z.boolean(),
});

export const createProductTypeInputSchema = productTypeSchema.omit({ id: true });
export const updateProductTypeInputSchema = productTypeSchema.partial().extend({ id: productTypeSchema.shape.id });
