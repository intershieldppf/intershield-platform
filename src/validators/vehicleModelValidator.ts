import { z } from "zod";

export const vehicleModelSchema = z.object({
  id: z.string().uuid(),
  brandId: z.string().uuid(),
  name: z.string().min(1),
  slug: z.string().min(1),
  aliases: z.array(z.string()),
  vehicleType: z.enum(["car", "motorcycle"]),
  isActive: z.boolean(),
  createdAt: z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "Invalid ISO date",
  }),
  updatedAt: z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "Invalid ISO date",
  }),
});

export const createVehicleModelInputSchema = vehicleModelSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const updateVehicleModelInputSchema = vehicleModelSchema.partial().extend({ id: vehicleModelSchema.shape.id });
