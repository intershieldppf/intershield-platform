export type UUID = string;

export type MarketplaceSource = "mercado_livre";

export type ImportStatus = "valid" | "alert" | "blocked" | "duplicate" | "variation" | "missing_sku";

export type ImportFileMetadata = {
  name: string;
  size: number;
  type: string;
  lastModified: number;
};

export type ImportRow = {
  rowNumber: number;
  source: MarketplaceSource;
  original: Record<string, any>;
  storeName?: string;
  listingId?: string;
  listingUrl?: string;
  title?: string;
  categoryName?: string;
  description?: string;
  price?: number;
  listingType?: string;
  warrantyType?: string;
  sku?: string;
  quantity?: number;
  mainImageUrl?: string;
  variantName?: string;
  variantOption?: string;
  variantId?: string;
  createdAt?: string;
  updatedAt?: string;
  isVariation?: boolean;
  validationIssues: ImportValidationIssue[];
  status: ImportStatus;
};

export type ImportValidationIssue = {
  type: "error" | "alert";
  code: string;
  message: string;
};

export type ImportAnalysis = {
  totalRows: number;
  uniqueListings: number;
  rowsWithSku: number;
  rowsWithoutSku: number;
  duplicateSkus: string[];
  rowsWithDescription: number;
  rowsWithMainImage: number;
  variationRows: number;
  errors: number;
  alerts: number;
};
