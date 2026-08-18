export type VehicleSuggestion = {
  brand: string;
  model: string;
  year: string;
  kit: string;
};

export const mockVehicles: VehicleSuggestion[] = [
  { brand: "Toyota", model: "Corolla", year: "2024", kit: "Interior + Exterior" },
  { brand: "BMW", model: "X3", year: "2024", kit: "Black Piano" },
  { brand: "BYD", model: "Dolphin Mini", year: "2025", kit: "Multimídia" },
  { brand: "Honda", model: "HR-V", year: "2025", kit: "Exterior" },
  { brand: "BMW", model: "F800GS", year: "2024", kit: "Motos" },
];
