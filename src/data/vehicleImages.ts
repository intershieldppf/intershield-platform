export type VehicleImageState = {
  imageUrl: string;
  imageSource: "manual" | "catalog" | "marketplace" | null;
  imageStatus: "missing" | "selected" | "review" | null;
  imageAlt: string | null;
};

export const vehicleImages: Record<string, VehicleImageState> = {
  "e2aa5b83-ee41-479c-9f3c-6bcbe4f34f8b": {
    imageUrl: "https://example.com/images/bmw-x3-official.jpg",
    imageSource: "manual",
    imageStatus: "selected",
    imageAlt: "BMW X3 2022 a 2027",
  },
  "95c45eda-bf6f-4a4f-84c6-0d1f2d431d90": {
    imageUrl: "",
    imageSource: null,
    imageStatus: "missing",
    imageAlt: null,
  },
};
