import type {
  CatalogProduct,
  CatalogCompatibility,
  CatalogMedia,
  CatalogVehicle,
} from "./catalogTypes";

export type VehicleImageState = {
  imageUrl: string;
  imageSource: "manual" | "catalog" | "marketplace" | null;
  imageStatus: "missing" | "selected" | "review" | null;
  imageAlt: string | null;
};

export type VehicleImageCandidate = {
  url: string;
  source: "catalog" | "marketplace";
  productId: string | null;
  productSku: string | null;
  productName: string | null;
};

export interface VehicleImageRepository {
  getAll(): Record<string, VehicleImageState>;
  get(vehicleId: string): VehicleImageState | null;
  save(vehicleId: string, state: VehicleImageState): VehicleImageState;
  remove(vehicleId: string): VehicleImageState;
}

export class InMemoryVehicleImageRepository implements VehicleImageRepository {
  private state: Record<string, VehicleImageState>;

  constructor(initialState: Record<string, VehicleImageState>) {
    this.state = { ...initialState };
  }

  getAll(): Record<string, VehicleImageState> {
    return { ...this.state };
  }

  get(vehicleId: string): VehicleImageState | null {
    return this.state[vehicleId] ?? null;
  }

  save(vehicleId: string, state: VehicleImageState): VehicleImageState {
    this.state[vehicleId] = { ...state };
    return this.state[vehicleId];
  }

  remove(vehicleId: string): VehicleImageState {
    const fallback: VehicleImageState = {
      imageUrl: "",
      imageSource: null,
      imageStatus: "missing",
      imageAlt: null,
    };

    this.state[vehicleId] = fallback;
    return fallback;
  }
}

type VehicleShape = {
  id: string;
  brand?: string | null;
  model?: string | null;
  yearStart?: number | null;
  yearEnd?: number | null;
  slug?: string | null;
};

export type VehicleImageValidationIssue = {
  severity: "error" | "alert";
  code: string;
  message: string;
  vehicleId: string;
};

export class VehicleImageService {
  constructor(
    private repository: VehicleImageRepository,
    private vehicles: VehicleShape[],
    private products: Array<Pick<CatalogProduct, "productId" | "sku" | "name" | "mainImage" | "gallery">>,
private compatibilities: Array<Pick<CatalogCompatibility, "productId" | "vehicleId">>,
    private media: CatalogMedia[]
  ) {}

  listVehicles() {
    return this.vehicles.map((vehicle) => ({
      ...vehicle,
      ...this.getOfficialImage(vehicle.id),
      candidateCount: this.getCandidates(vehicle.id).length,
    }));
  }

  getCandidates(vehicleId: string): VehicleImageCandidate[] {
    const matches = this.compatibilities.filter((item) => item.vehicleId === vehicleId);
    const productIds = new Set(matches.map((item) => item.productId).filter(Boolean) as string[]);

    const candidates = new Map<string, VehicleImageCandidate>();

    this.products.forEach((product) => {
      if (!productIds.has(product.productId)) {
        return;
      }

      const imageUrls = new Set<string>([]);
      if (product.mainImage) {
        imageUrls.add(product.mainImage);
      }
      for (const url of product.gallery ?? []) {
        if (url) imageUrls.add(url);
      }

      imageUrls.forEach((url) => {
        if (!url) return;
        const normalized = url.trim();
        if (!normalized) return;

        if (!candidates.has(normalized)) {
          candidates.set(normalized, {
            url: normalized,
            source: "catalog",
            productId: product.productId,
            productSku: product.sku,
            productName: product.name,
          });
        }
      });
    });

    return Array.from(candidates.values());
  }

  getOfficialImage(vehicleId: string): VehicleImageState {
    const state = this.repository.get(vehicleId);
    if (!state) {
      return {
        imageUrl: "",
        imageSource: null,
        imageStatus: "missing",
        imageAlt: null,
      };
    }
    return state;
  }

  selectImage(
    vehicleId: string,
    imageUrl: string,
    imageSource: "manual" | "catalog" | "marketplace",
    imageAlt: string | null
  ) {
    if (!imageUrl.trim()) {
      throw new Error("A URL da imagem não pode ficar vazia.");
    }
    if (!this.isValidUrl(imageUrl)) {
      throw new Error("URL de imagem inválida.");
    }

    const state: VehicleImageState = {
      imageUrl: imageUrl.trim(),
      imageSource,
      imageStatus: "selected",
      imageAlt: imageAlt ? imageAlt.trim() : null,
    };

    return this.repository.save(vehicleId, state);
  }

  removeSelection(vehicleId: string) {
    return this.repository.remove(vehicleId);
  }

  validateVehicle(vehicleId: string): VehicleImageValidationIssue[] {
    const state = this.getOfficialImage(vehicleId);
    const issues: VehicleImageValidationIssue[] = [];

    const url = state.imageUrl?.trim() ?? "";
    if (!url) {
      issues.push({
        severity: "alert",
        code: "vehicle_missing_image",
        message: "Veículo sem imagem oficial.",
        vehicleId,
      });
    } else if (!this.isValidUrl(url)) {
      issues.push({
        severity: "error",
        code: "invalid_vehicle_image_url",
        message: "URL de imagem inválida.",
        vehicleId,
      });
    }

    if (state.imageStatus === "selected" && !state.imageAlt) {
      issues.push({
        severity: "alert",
        code: "missing_vehicle_image_alt",
        message: "Imagem selecionada sem texto alternativo.",
        vehicleId,
      });
    }

    const duplicates = this.findDuplicateUrls(vehicleId);
    if (duplicates.length > 0) {
      issues.push({
        severity: "alert",
        code: "duplicate_vehicle_image_url",
        message: "Imagem selecionada já utilizada por outro veículo.",
        vehicleId,
      });
    }

    return issues;
  }

  private findDuplicateUrls(vehicleId: string): string[] {
    const current = this.getOfficialImage(vehicleId).imageUrl?.trim() ?? "";
    if (!current) return [];

    return Object.entries(this.repository.getAll())
      .filter(([id, state]) => id !== vehicleId)
      .filter(([, state]) => state.imageUrl?.trim() === current)
      .map(([id]) => id);
  }

  buildAltText(vehicle: VehicleShape): string {
    const parts: string[] = [];
    if (vehicle.brand) parts.push(vehicle.brand);
    if (vehicle.model) parts.push(vehicle.model);
    if (vehicle.yearStart && vehicle.yearEnd) {
      parts.push(`${vehicle.yearStart} a ${vehicle.yearEnd}`);
    } else if (vehicle.yearStart) {
      parts.push(String(vehicle.yearStart));
    } else if (vehicle.yearEnd) {
      parts.push(String(vehicle.yearEnd));
    }
    return parts.join(" ").trim() || "Veículo InterShield";
  }

  private isValidUrl(value: string) {
    try {
      const url = new URL(value.trim());
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }
}
