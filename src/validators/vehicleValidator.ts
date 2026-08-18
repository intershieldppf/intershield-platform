import { z } from "zod";

export const vehicleSchema = z.object({
  id: z.string().uuid(),
  vehicleModelId: z.string().uuid(),
  generation: z.string().min(1),
  yearStart: z.number().int().min(1900),
  yearEnd: z.number().int().min(1900),
  versions: z.array(z.string()),
  searchKeywords: z.array(z.string()),
  slug: z.string().min(1),
  isActive: z.boolean(),
  createdAt: z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "Invalid ISO date",
  }),
  updatedAt: z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "Invalid ISO date",
  }),
});

export const createVehicleInputSchema = vehicleSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const updateVehicleInputSchema = vehicleSchema.partial().extend({ id: vehicleSchema.shape.id });
