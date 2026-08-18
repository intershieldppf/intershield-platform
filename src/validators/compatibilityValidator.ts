import { z } from "zod";

export const compatibilitySchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  vehicleId: z.string().uuid(),
  yearStartOverride: z.number().int().optional(),
  yearEndOverride: z.number().int().optional(),
  versionRestrictions: z.array(z.string()),
  notes: z.string(),
  isConfirmed: z.boolean(),
  createdAt: z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "Invalid ISO date",
  }),
  updatedAt: z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "Invalid ISO date",
  }),
});

export const createCompatibilityInputSchema = compatibilitySchema.omit({ id: true, createdAt: true, updatedAt: true });
export const updateCompatibilityInputSchema = compatibilitySchema.partial().extend({ id: compatibilitySchema.shape.id });
