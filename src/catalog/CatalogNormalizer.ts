import {
  CatalogProduct,
  CatalogVariant,
  CatalogVehicle,
  CatalogCompatibility,
  CatalogMedia,
  CatalogSeo,
  CatalogChannel,
  CatalogPendingIssue,
  CatalogNewRegistration,
  InterShieldCatalog,
} from "./catalogTypes";

function normalizeString(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function normalizeNullableString(value: unknown): string | null {
  const normalized = normalizeString(value);
  return normalized === "" ? null : normalized;
}

function normalizeNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  const text = String(value)
    .replace(/[^0-9.,-]/g, "")
    .replace(/,/g, ".")
    .trim();

  if (!text || text === "." || text === "-") return null;

  const numberValue = Number(text);

  return Number.isFinite(numberValue)
    ? numberValue
    : null;
}

function normalizeBoolean(value: unknown): boolean | null {
  if (value === null || value === undefined) return null;

  const text = String(value)
    .trim()
    .toLowerCase();

  if (["true", "sim", "1", "yes"].includes(text)) {
    return true;
  }

  if (["false", "não", "nao", "0", "no"].includes(text)) {
    return false;
  }

  return null;
}

function normalizeArray(values: unknown[]): string[] {
  return values
    .map((item) => normalizeString(item))
    .filter(Boolean);
}

export function normalizeProduct(
  product: CatalogProduct
): CatalogProduct {
  return {
    ...product,

    shortDescription:
      normalizeNullableString(
        product.shortDescription
      ),

    fullDescription:
      normalizeNullableString(
        product.fullDescription
      ),

    productType:
      normalizeNullableString(
        product.productType
      ),

    price:
      normalizeNumber(
        product.price
      ),

    compareAtPrice:
      normalizeNumber(
        product.compareAtPrice
      ),

    status:
      normalizeNullableString(
        product.status
      ),

    mainImage:
      normalizeNullableString(
        product.mainImage
      ),

    gallery:
      normalizeArray(
        product.gallery
      ),

    channels:
      normalizeArray(
        product.channels
      ),

    universal:
      normalizeBoolean(
        product.universal
      ),

    warranty: {
      type: "Garantia do Vendedor",
      days: 30,
    },
  };
}

export function normalizeVariant(
  variant: CatalogVariant
): CatalogVariant {
  return {
    ...variant,

    finish:
      normalizeNullableString(
        variant.finish
      ),

    optionName:
      normalizeNullableString(
        variant.optionName
      ),

    optionValue:
      normalizeNullableString(
        variant.optionValue
      ),

    variantOption:
      normalizeNullableString(
        variant.variantOption
      ),

    quantity:
      normalizeNumber(
        variant.quantity
      ),

    price:
      normalizeNumber(
        variant.price
      ),

    marketplaceListingId:
      normalizeNullableString(
        variant.marketplaceListingId
      ),

    validationStatus:
      normalizeNullableString(
        variant.validationStatus
      ),

    pendingIssues:
      normalizeNullableString(
        variant.pendingIssues
      ),
  };
}

export function normalizeVehicle(
  vehicle: CatalogVehicle
): CatalogVehicle {
  return {
    ...vehicle,

    brand:
      normalizeNullableString(
        vehicle.brand
      ),

    model:
      normalizeNullableString(
        vehicle.model
      ),

    yearStart:
      normalizeNumber(
        vehicle.yearStart
      ),

    yearEnd:
      normalizeNumber(
        vehicle.yearEnd
      ),

    slug:
      normalizeNullableString(
        vehicle.slug
      ),

    universal:
      normalizeBoolean(
        vehicle.universal
      ),

    imageUrl:
      normalizeNullableString(
        vehicle.imageUrl
      ),

    imageSource:
      vehicle.imageSource === "manual" ||
      vehicle.imageSource === "catalog" ||
      vehicle.imageSource === "marketplace"
        ? vehicle.imageSource
        : null,

    imageStatus:
      vehicle.imageStatus === "missing" ||
      vehicle.imageStatus === "selected" ||
      vehicle.imageStatus === "review"
        ? vehicle.imageStatus
        : null,

    imageAlt:
      normalizeNullableString(
        vehicle.imageAlt
      ),
  };
}

export function normalizeCompatibility(
  compatibility: CatalogCompatibility
): CatalogCompatibility {
  return {
    ...compatibility,

    productId:
      normalizeNullableString(
        compatibility.productId
      ),

    sku:
      normalizeNullableString(
        compatibility.sku
      ),

    vehicleId:
      normalizeNullableString(
        compatibility.vehicleId
      ),

    vehicleSlug:
      normalizeNullableString(
        compatibility.vehicleSlug
      ),

    notes:
      normalizeNullableString(
        compatibility.notes
      ),
  };
}

export function normalizeMedia(
  media: CatalogMedia
): CatalogMedia {
  return {
    ...media,

    productId:
      normalizeNullableString(
        media.productId
      ),

    sku:
      normalizeNullableString(
        media.sku
      ),

    url:
      normalizeString(
        media.url
      ),

    type:
      normalizeNullableString(
        media.type
      ),
  };
}

export function normalizeSeo(
  seo: CatalogSeo
): CatalogSeo {
  return {
    ...seo,

    productId:
      normalizeNullableString(
        seo.productId
      ),

    sku:
      normalizeNullableString(
        seo.sku
      ),

    title:
      normalizeNullableString(
        seo.title
      ),

    description:
      normalizeNullableString(
        seo.description
      ),

    keywords:
      normalizeArray(
        seo.keywords
      ),
  };
}

export function normalizeChannel(
  channel: CatalogChannel
): CatalogChannel {
  return {
    ...channel,

    productId:
      normalizeNullableString(
        channel.productId
      ),

    sku:
      normalizeNullableString(
        channel.sku
      ),

    variationId:
      normalizeNullableString(
        channel.variationId
      ),

    listingId:
      normalizeNullableString(
        channel.listingId
      ),

    channelPrice:
      normalizeNumber(
        channel.channelPrice
      ),

    channel:
      normalizeString(
        channel.channel
      ),

    status:
      normalizeNullableString(
        channel.status
      ),
  };
}

export function normalizePendingIssue(
  issue: CatalogPendingIssue
): CatalogPendingIssue {
  return {
    ...issue,

    productId:
      normalizeNullableString(
        issue.productId
      ),

    sku:
      normalizeNullableString(
        issue.sku
      ),

    issue:
      normalizeNullableString(
        issue.issue
      ),
  };
}

export function normalizeNewRegistration(
  registration: CatalogNewRegistration
): CatalogNewRegistration {
  return {
    ...registration,

    productId:
      normalizeNullableString(
        registration.productId
      ),

    sku:
      normalizeNullableString(
        registration.sku
      ),

    data:
      registration.data,
  };
}

export function normalizeCatalog(
  catalog: InterShieldCatalog
): InterShieldCatalog {
  return {
    ...catalog,

    products:
      catalog.products.map(
        normalizeProduct
      ),

    variants:
      catalog.variants.map(
        normalizeVariant
      ),

    vehicles:
      catalog.vehicles.map(
        normalizeVehicle
      ),

    compatibilities:
      catalog.compatibilities.map(
        normalizeCompatibility
      ),

    media:
      catalog.media.map(
        normalizeMedia
      ),

    seo:
      catalog.seo.map(
        normalizeSeo
      ),

    channels:
      catalog.channels.map(
        normalizeChannel
      ),

    pendingIssues:
      catalog.pendingIssues.map(
        normalizePendingIssue
      ),

    newRegistrations:
      catalog.newRegistrations.map(
        normalizeNewRegistration
      ),

    indexes:
      catalog.indexes,

    statistics:
      catalog.statistics,
  };
}