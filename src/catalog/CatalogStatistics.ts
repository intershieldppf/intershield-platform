import {
  CatalogStatistics,
  CatalogProduct,
  CatalogVariant,
  CatalogVehicle,
  CatalogCompatibility,
  CatalogMedia,
  CatalogSeo,
  CatalogChannel,
  InterShieldCatalog,
} from "./catalogTypes";

function safeCount(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCatalogStatistics(catalog: InterShieldCatalog): CatalogStatistics {
  const statistics: CatalogStatistics = {
    products: catalog.products.length,
    variants: catalog.variants.length,
    vehicles: catalog.vehicles.length,
    compatibilities: catalog.compatibilities.length,
    media: catalog.media.length,
    seo: catalog.seo.length,
    channels: catalog.channels.length,
    pendingIssues: catalog.pendingIssues.length,
    ok: 0,
    review: 0,
    blocked: 0,
    skuOriginal: 0,
    skuGenerated: 0,
    skuDuplicateCorrections: 0,
    active: 0,
    draft: 0,
    inactive: 0,
    archived: 0,
    productsByType: {},
    productsByBrand: {},
  };

  const skuCount = new Map<string, number>();

  catalog.products.forEach((product) => {
    if (product.sku) {
      skuCount.set(product.sku, (skuCount.get(product.sku) ?? 0) + 1);
      if (/GERADO/i.test(product.sku)) {
        statistics.skuGenerated += 1;
      } else {
        statistics.skuOriginal += 1;
      }
    }

    const status = (product.status ?? "").toLowerCase();
    if (status.includes("active")) statistics.active += 1;
    else if (status.includes("draft")) statistics.draft += 1;
    else if (status.includes("archiv")) statistics.archived += 1;
    else if (status.includes("inactiv")) statistics.inactive += 1;

    const type = product.productType ?? "Outros";
    statistics.productsByType[type] = (statistics.productsByType[type] ?? 0) + 1;

    const brand = (product.original?.["Marca"] ?? product.original?.["Brand"] ?? "") as string;
    const normalizedBrand = brand ? String(brand).trim() : "Desconhecida";
    statistics.productsByBrand[normalizedBrand] = (statistics.productsByBrand[normalizedBrand] ?? 0) + 1;
  });

  statistics.skuDuplicateCorrections = Array.from(skuCount.values()).filter((count) => count > 1).length;

  return statistics;
}
