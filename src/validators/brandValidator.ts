import { z } from "zod";

export const brandSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  slug: z.string().min(1),
  aliases: z.array(z.string()),
  isActive: z.boolean(),
  createdAt: z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "Invalid ISO date",
  }),
  updatedAt: z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "Invalid ISO date",
  }),
});

export const createBrandInputSchema = brandSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const updateBrandInputSchema = brandSchema.partial().extend({ id: brandSchema.shape.id });
