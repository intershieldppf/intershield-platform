import { Buffer } from "buffer";
import { CatalogLoadResult, InterShieldCatalog, CatalogPreviewVariant } from "./catalogTypes";
import { loadProjectMatrix, parseUploadedMatrix } from "./CatalogLoader";
import { normalizeCatalog } from "./CatalogNormalizer";
import { validateCatalog } from "./CatalogValidator";
import { buildCatalogIndex } from "./CatalogIndex";
import { calculateCatalogStatistics } from "./CatalogStatistics";

function buildPreviewVariants(catalog: InterShieldCatalog, validation: ReturnType<typeof validateCatalog>) {
  const productById = new Map(catalog.products.map((product) => [product.productId, product]));
  const productBySku = new Map(catalog.products.map((product) => [product.sku, product]));
  const mediaByProductId = new Map(catalog.media.map((item) => [item.productId, [item]]));
  const seoByProductId = new Map(catalog.seo.map((item) => [item.productId, [item]]));
  const channelsByVariationId = new Map(catalog.channels.map((item) => [item.variationId, [item]]));
  const channelsByProductId = new Map(catalog.channels.map((item) => [item.productId, [item]]));
  const channelsBySku = new Map(catalog.channels.map((item) => [item.sku, [item]]));
  const compatByProductId = new Map(catalog.compatibilities.map((item) => [item.productId, [item]]));

  return catalog.variants.slice(0, 50).map((variant) => {
    const product = productById.get(variant.productId) ?? productBySku.get(variant.sku);
    const validationEntry = validation.variantStates.find((entry) => entry.id === variant.variationId || entry.sku === variant.sku);
    const productValidation = product ? validation.productStates.find((entry) => entry.id === product.productId || entry.sku === product.sku) : undefined;
    const issues = [
      ...((validationEntry?.issues ?? []) as any[]),
      ...((productValidation?.issues ?? []) as any[]),
    ];

    const productName = product?.name ?? product?.officialName ?? "Não localizado";
    const productId = product?.productId ?? variant.productId;
    const channelCandidates = [
      ...(channelsByVariationId.get(variant.variationId) ?? []),
      ...(channelsByProductId.get(productId) ?? []),
      ...(channelsBySku.get(variant.sku) ?? []),
    ];
    const selectedChannel = channelCandidates.find(Boolean);
    const listingId = variant.marketplaceListingId || selectedChannel?.listingId || null;
    const price = variant.price ?? product?.price ?? selectedChannel?.channelPrice ?? null;
    const finish = variant.finish ?? variant.optionValue ?? variant.variantOption ?? null;
    const mediaCount = mediaByProductId.get(productId)?.length ?? 0;
    const seoTitle = seoByProductId.get(productId)?.[0]?.title ?? null;
    const marketplaces = Array.from(new Set(channelCandidates.map((item) => item.channel))).filter(Boolean);
    const vehicles = compatByProductId.get(productId)?.map((item) => item.vehicleSlug ?? "").filter(Boolean) ?? [];
    const pendencias = (productId ? validation.issues.filter((issue) => issue.rowRef === productId || issue.rowRef === variant.sku) : []).map((issue) => issue.message);

    const isGenerated = /GERADO/i.test(variant.sku);
    const isAdjusted = !/GERADO/i.test(variant.sku) && !!variant.sku && variant.sku.includes("-");
    const hasMedia = mediaCount > 0;
    const hasSeo = !!seoTitle;

    return {
      sku: variant.sku,
      productId,
      productName,
      finish,
      price,
      stock: variant.quantity,
      listingId,
      validationStatus: validationEntry?.status ?? "OK",
      pendingIssues: pendencias,
      mediaCount,
      seoTitle,
      marketplaces,
      vehicles,
      isGenerated,
      isAdjusted,
      hasMedia,
      hasSeo,
    } as CatalogPreviewVariant;
  });
}

export const CatalogEngine = {
  async loadFromProjectMatrix(): Promise<CatalogLoadResult> {
    const result = await loadProjectMatrix();
    const normalizedCatalog = normalizeCatalog(result.catalog);
    const validation = validateCatalog(normalizedCatalog, result.sheetSummaries);
    const statistics = calculateCatalogStatistics(normalizedCatalog);
    const indexes = buildCatalogIndex(normalizedCatalog);
    normalizedCatalog.indexes = indexes;
    normalizedCatalog.statistics = statistics;

    return {
      ...result,
      catalog: normalizedCatalog,
      validation,
      statistics,
      previewVariants: buildPreviewVariants(normalizedCatalog, validation),
    };
  },

  async analyzeUploadedMatrix(buffer: ArrayBuffer, name = "uploaded.xlsx"): Promise<CatalogLoadResult> {
    const result = await parseUploadedMatrix(buffer, name);
    const normalizedCatalog = normalizeCatalog(result.catalog);
    const validation = validateCatalog(normalizedCatalog, result.sheetSummaries);
    const statistics = calculateCatalogStatistics(normalizedCatalog);
    const indexes = buildCatalogIndex(normalizedCatalog);
    normalizedCatalog.indexes = indexes;
    normalizedCatalog.statistics = statistics;

    return {
      ...result,
      catalog: normalizedCatalog,
      validation,
      statistics,
      previewVariants: buildPreviewVariants(normalizedCatalog, validation),
    };
  },
};
