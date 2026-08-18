export type UUID = string;

export type MatrixSheetName =
  | "Produtos_Mestre"
  | "Variacoes_SKU"
  | "Veiculos_Mestre"
  | "Compatibilidades"
  | "Midias"
  | "SEO"
  | "Canais"
  | "Pendencias"
  | "Cadastro_Novo";

export type MatrixFileMetadata = {
  name: string;
  size: number;
  type: string;
  lastModified: number;
};

export type MatrixProduct = {
  sku: string;
  productId?: string;
  name?: string;
  shortDescription?: string;
  fullDescription?: string;
  productType?: string;
  price?: number;
  compareAtPrice?: number;
  status?: string;
  mainImage?: string;
  gallery?: string[];
  channels?: string[];
  original?: Record<string, any>;
};

export type MatrixVariation = {
  sku: string;
  parentSku?: string;
  optionName?: string;
  optionValue?: string;
  quantity?: number;
  price?: number;
  original?: Record<string, any>;
};

export type MatrixVehicle = {
  vehicleId?: string;
  model?: string;
  brand?: string;
  yearStart?: number;
  yearEnd?: number;
  slug?: string;
  original?: Record<string, any>;
};

export type MatrixCompatibility = {
  productSku: string;
  vehicleSlug: string;
  notes?: string;
  original?: Record<string, any>;
};

export type MatrixMedia = {
  sku: string;
  url: string;
  type?: string;
  original?: Record<string, any>;
};

export type MatrixSEO = {
  sku: string;
  title?: string;
  description?: string;
  keywords?: string[];
  original?: Record<string, any>;
};

export type MatrixChannel = {
  sku: string;
  channel: string;
  status?: string;
  original?: Record<string, any>;
};

export type MatrixPendencia = {
  sku?: string;
  issue?: string;
  original?: Record<string, any>;
};

export type MatrixCadastroNovo = {
  sku?: string;
  data?: Record<string, any>;
};

export type MatrixImportResult = {
  metadata: MatrixFileMetadata;
  products: MatrixProduct[];
  variations: MatrixVariation[];
  vehicles: MatrixVehicle[];
  compatibilities: MatrixCompatibility[];
  media: MatrixMedia[];
  seo: MatrixSEO[];
  channels: MatrixChannel[];
  pendencias: MatrixPendencia[];
  cadastroNovo: MatrixCadastroNovo[];
};

export type MatrixValidationSeverity = "error" | "alert";

export type MatrixValidationIssue = {
  severity: MatrixValidationSeverity;
  code: string;
  message: string;
  rowRef?: string; // e.g., SKU or Produto_ID
};

export type MatrixSheetSummary = {
  name: string;
  found: boolean;
  rows: number;
};

export type MatrixSkuSummary = {
  originals: number;
  generated: number;
  duplicates: number;
};

export type MatrixProductStatusSummary = {
  active: number;
  draft: number;
  inactive: number;
  archived: number;
};

export type MatrixAnalysis = {
  fileName: string;
  analyzedAt: string;
  sheets: MatrixSheetSummary[];
  totals: {
    products: number;
    variations: number;
    vehicles: number;
    compatibilities: number;
    media: number;
    seo: number;
    channels: number;
    pendencias: number;
  };
  statusCounts: {
    ok: number;
    review: number;
    blocked: number;
  };
  skuSummary: MatrixSkuSummary;
  productStatusSummary: MatrixProductStatusSummary;
  issues: MatrixValidationIssue[];
  previewVariations: Record<string, any>[];
};
