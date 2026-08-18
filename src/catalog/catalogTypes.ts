export type CatalogFileMetadata = {
  name: string;
  size: number;
  type: string;
  lastModified: number;
};

export type CatalogSheetName =
  | "Produtos_Mestre"
  | "Variacoes_SKU"
  | "Veiculos_Mestre"
  | "Compatibilidades"
  | "Midias"
  | "SEO"
  | "Canais"
  | "Pendencias"
  | "Cadastro_Novo";

export type CatalogSheetSummary = {
  name: CatalogSheetName;
  found: boolean;
  rows: number;
};

export type CatalogValidationSeverity = "error" | "alert";

export type CatalogValidationIssue = {
  severity: CatalogValidationSeverity;
  code: string;
  message: string;
  sheet?: CatalogSheetName | "product" | "variant";
  rowRef?: string;
};

export type CatalogValidationItemStatus = "OK" | "REVISAR" | "BLOQUEADO";

export type CatalogValidationItem = {
  id: string;
  sku?: string;
  sheet: CatalogSheetName | "product" | "variant";
  status: CatalogValidationItemStatus;
  issues: CatalogValidationIssue[];
};

export type CatalogValidationResult = {
  issues: CatalogValidationIssue[];
  productStates: CatalogValidationItem[];
  variantStates: CatalogValidationItem[];
};

export type CatalogWarranty = {
  type: "Garantia do Vendedor";
  days: 30;
};

export type CatalogProduct = {
  sku: string;
  productId: string;
  officialName: string | null;
  name: string;
  shortDescription: string | null;
  fullDescription: string | null;
  productType: string | null;
  material: string | null;
  price: number | null;
  compareAtPrice: number | null;
  status: string | null;
  mainImage: string | null;
  gallery: string[];
  channels: string[];
  universal: boolean | null;
  warranty: CatalogWarranty;
  original: Record<string, unknown>;
};

export type CatalogVariant = {
  sku: string;
  variationId: string;
  productId: string;
  optionName: string | null;
  optionValue: string | null;
  finish: string | null;
  variantOption: string | null;
  quantity: number | null;
  price: number | null;
  marketplaceListingId: string | null;
  validationStatus: string | null;
  pendingIssues: string | null;
  original: Record<string, unknown>;
};

export type CatalogVehicle = {
  vehicleId: string;
  brand: string | null;
  model: string | null;
  yearStart: number | null;
  yearEnd: number | null;
  slug: string | null;
  universal: boolean | null;
  imageUrl: string | null;
  imageSource: "manual" | "catalog" | "marketplace" | null;
  imageStatus: "missing" | "selected" | "review" | null;
  imageAlt: string | null;
  original: Record<string, unknown>;
};

export type CatalogCompatibility = {
  productId: string | null;
  sku: string | null;
  vehicleId: string | null;
  vehicleSlug: string | null;
  notes: string | null;
  original: Record<string, unknown>;
};

export type CatalogMedia = {
  productId: string | null;
  sku: string | null;
  url: string;
  type: string | null;
  original: Record<string, unknown>;
};

export type CatalogSeo = {
  productId: string | null;
  sku: string | null;
  title: string | null;
  description: string | null;
  keywords: string[];
  original: Record<string, unknown>;
};

export type CatalogChannel = {
  productId: string | null;
  sku: string | null;
  variationId: string | null;
  listingId: string | null;
  channelPrice: number | null;
  channel: string;
  status: string | null;
  original: Record<string, unknown>;
};

export type CatalogPendingIssue = {
  productId: string | null;
  sku: string | null;
  issue: string | null;
  original: Record<string, unknown>;
};

export type CatalogNewRegistration = {
  productId: string | null;
  sku: string | null;
  data: Record<string, unknown>;
  original: Record<string, unknown>;
};

export type CatalogIndex = {
  productsById: Record<string, CatalogProduct>;
  variantsById: Record<string, CatalogVariant>;
  variantsBySku: Record<string, CatalogVariant>;
  vehiclesById: Record<string, CatalogVehicle>;
  compatibilitiesByProductId: Record<string, CatalogCompatibility[]>;
  compatibilitiesByVehicleId: Record<string, CatalogCompatibility[]>;
  mediaByProductId: Record<string, CatalogMedia[]>;
  seoByProductId: Record<string, CatalogSeo[]>;
  channelsByProductId: Record<string, CatalogChannel[]>;
};

export type CatalogStatistics = {
  products: number;
  variants: number;
  vehicles: number;
  compatibilities: number;
  media: number;
  seo: number;
  channels: number;
  pendingIssues: number;
  ok: number;
  review: number;
  blocked: number;
  skuOriginal: number;
  skuGenerated: number;
  skuDuplicateCorrections: number;
  active: number;
  draft: number;
  inactive: number;
  archived: number;
  productsByType: Record<string, number>;
  productsByBrand: Record<string, number>;
};

export type CatalogPreviewVariant = {
  sku: string;
  productId: string;
  productName: string;
  finish: string | null;
  price: number | null;
  stock: number | null;
  listingId: string | null;
  validationStatus: CatalogValidationItemStatus;
  pendingIssues: string[];
  mediaCount: number;
  seoTitle: string | null;
  marketplaces: string[];
  vehicles: string[];
  isGenerated: boolean;
  isAdjusted: boolean;
  hasMedia: boolean;
  hasSeo: boolean;
};

export type InterShieldCatalog = {
  products: CatalogProduct[];
  variants: CatalogVariant[];
  vehicles: CatalogVehicle[];
  compatibilities: CatalogCompatibility[];
  media: CatalogMedia[];
  seo: CatalogSeo[];
  channels: CatalogChannel[];
  pendingIssues: CatalogPendingIssue[];
  newRegistrations: CatalogNewRegistration[];
  indexes: CatalogIndex;
  statistics: CatalogStatistics;
};

export type CatalogLoadResult = {
  fileName: string;
  analyzedAt: string;
  sheetSummaries: CatalogSheetSummary[];
  catalog: InterShieldCatalog;
  validation: CatalogValidationResult;
  statistics: CatalogStatistics;
  previewVariants: CatalogPreviewVariant[];
};
