import {
  InterShieldCatalog,
  CatalogIndex,
  CatalogMedia,
  CatalogSeo,
  CatalogChannel,
  CatalogCompatibility,
} from "./catalogTypes";

export function buildCatalogIndex(catalog: InterShieldCatalog): CatalogIndex {
  const index: CatalogIndex = {
    productsById: {},
    variantsById: {},
    variantsBySku: {},
    vehiclesById: {},
    compatibilitiesByProductId: {},
    compatibilitiesByVehicleId: {},
    mediaByProductId: {},
    seoByProductId: {},
    channelsByProductId: {},
  };

  catalog.products.forEach((product) => {
    index.productsById[product.productId] = product;
  });

  catalog.variants.forEach((variant) => {
    if (variant.variationId) {
      index.variantsById[variant.variationId] = variant;
    }
    if (variant.sku) {
      index.variantsBySku[variant.sku] = variant;
    }
  });

  catalog.vehicles.forEach((vehicle) => {
    if (vehicle.vehicleId) {
      index.vehiclesById[vehicle.vehicleId] = vehicle;
    }
  });

  catalog.compatibilities.forEach((compatibility) => {
    const productId = compatibility.productId;
    const vehicleId = compatibility.vehicleId;
    if (productId) {
      index.compatibilitiesByProductId[productId] = [...(index.compatibilitiesByProductId[productId] ?? []), compatibility];
    }
    if (vehicleId) {
      index.compatibilitiesByVehicleId[vehicleId] = [...(index.compatibilitiesByVehicleId[vehicleId] ?? []), compatibility];
    }
  });

  catalog.media.forEach((media) => {
    const productId = media.productId;
    if (productId) {
      index.mediaByProductId[productId] = [...(index.mediaByProductId[productId] ?? []), media];
    }
  });

  catalog.seo.forEach((seo) => {
    const productId = seo.productId;
    if (productId) {
      index.seoByProductId[productId] = [...(index.seoByProductId[productId] ?? []), seo];
    }
  });

  catalog.channels.forEach((channel) => {
    const productId = channel.productId;
    if (productId) {
      index.channelsByProductId[productId] = [...(index.channelsByProductId[productId] ?? []), channel];
    }
  });

  return index;
}
