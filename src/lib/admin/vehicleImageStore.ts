import { InMemoryVehicleImageRepository } from "@/catalog/VehicleImageService";
import { vehicleImages } from "@/data/vehicleImages";

export const vehicleImageRepository = new InMemoryVehicleImageRepository(vehicleImages);
