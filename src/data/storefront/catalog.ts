import catalog1 from "./catalog-1.json";
import catalog2 from "./catalog-2.json";
import catalog3 from "./catalog-3.json";
import catalog4 from "./catalog-4.json";

export type StorefrontVariantOption = {
  value: string;
  price: number;
  sku: string;
};

export type StorefrontProduct = {
  id: string;
  title: string;
  price: number | null;
  image: string;
  sku: string | null;
  brand: string | null;
  yearStart: number | null;
  yearEnd: number | null;
  type: "PPF" | "Black Piano";
  tags: string[];
  displayOrder: number;
  variantValues: string[];
  variantOptions: StorefrontVariantOption[];
};

type RawCatalogRow = [
  string,
  string,
  number | null,
  string,
  string | null,
  string | null,
  number | null,
  number | null,
  "PPF" | "Black Piano",
  number,
  number,
  string[],
];

const TAGS: Array<[number, string]> = [
  [1, "Interior"],
  [2, "Exterior"],
  [4, "Multimídia"],
  [8, "Tela"],
  [16, "Colunas"],
  [32, "Conchas"],
  [64, "Universal"],
  [128, "Portas"],
  [256, "Painel"],
];

function decodeTags(mask: number) {
  return TAGS.filter(([bit]) => (mask & bit) === bit).map(([, label]) => label);
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function resolveProductType(title: string, type: StorefrontProduct["type"]) {
  const normalized = normalizeText(title);

  if (
    type === "Black Piano" &&
    /\b(ppf|tpu|pelicula)\b/.test(normalized) &&
    !/\b(adesivo|blackout|pvc)\b/.test(normalized)
  ) {
    return "PPF" as const;
  }

  return type;
}

function inferTags(title: string, decodedTags: string[]) {
  if (decodedTags.length > 0) return decodedTags;

  const normalized = normalizeText(title);
  const inferred = TAGS.flatMap(([, label]) =>
    normalized.includes(normalizeText(label)) ? [label] : [],
  );

  if (/\bkit interior\b/.test(normalized)) inferred.push("Interior");
  if (/\bkit exterior\b/.test(normalized)) inferred.push("Exterior");

  return Array.from(new Set(inferred));
}

function inferBrand(title: string, brand: string | null) {
  if (brand) return brand;

  const normalized = normalizeText(title);
  const brands: Array<[RegExp, string]> = [
    [/\bhaval\b|\bgwm\b/, "GWM"],
    [/\bbyd\b/, "BYD"],
    [/\bchevrolet\b|\bonix\b/, "Chevrolet"],
    [/\bvolkswagen\b|\bvw\b/, "Volkswagen"],
    [/\baudi\b/, "Audi"],
    [/\bbmw\b/, "BMW"],
    [/\bjeep\b/, "Jeep"],
  ];

  return brands.find(([pattern]) => pattern.test(normalized))?.[1] ?? null;
}

function normalizeVariant(value: string) {
  const normalized = value.trim().toLocaleLowerCase("pt-BR");
  return normalized ? normalized.charAt(0).toLocaleUpperCase("pt-BR") + normalized.slice(1) : value;
}

function resolveYears(title: string, yearStart: number | null, yearEnd: number | null) {
  const fullYears = Array.from(title.matchAll(/\b20\d{2}\b/g), (match) => Number(match[0]));

  if (fullYears.length >= 2) {
    return {
      yearStart: Math.min(...fullYears),
      yearEnd: Math.max(...fullYears),
    };
  }

  return { yearStart, yearEnd };
}

function mapRow(row: RawCatalogRow): StorefrontProduct {
  const [
    id,
    title,
    price,
    image,
    sku,
    brand,
    yearStart,
    yearEnd,
    type,
    tagMask,
    displayOrder,
    variantValues,
  ] = row;

  const resolvedYears = resolveYears(title, yearStart, yearEnd);

  return {
    id,
    title,
    price,
    image: `https://http2.mlstatic.com/${image}`,
    sku,
    brand: inferBrand(title, brand),
    yearStart: resolvedYears.yearStart,
    yearEnd: resolvedYears.yearEnd,
    type: resolveProductType(title, type),
    tags: inferTags(title, decodeTags(tagMask)),
    displayOrder,
    variantValues: Array.from(new Set(variantValues.map(normalizeVariant))),
    variantOptions: [],
  };
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const rawCatalog = [
  ...(catalog1 as unknown as RawCatalogRow[]),
  ...(catalog2 as unknown as RawCatalogRow[]),
  ...(catalog3 as unknown as RawCatalogRow[]),
  ...(catalog4 as unknown as RawCatalogRow[]),
];

const photochromicVariantOptions: StorefrontVariantOption[] = Array.from(
  { length: 10 },
  (_, index) => {
    const meters = index + 1;

    return {
      value: `0,30 × ${meters} m`,
      price: Number((199.9 * meters - 10 * (meters - 1)).toFixed(2)),
      sku: `PPF-FOTO-CAM-030X${String(meters).padStart(2, "0")}M`,
    };
  },
);

export const photochromicProduct: StorefrontProduct = {
  id: "IS-PPF-FOTO-CAM-030",
  title: "Película PPF Fotocromática Camaleão para Faróis 30 cm",
  price: photochromicVariantOptions[0].price,
  image: "/ppf-fotocromatico-rolo.webp",
  sku: photochromicVariantOptions[0].sku,
  brand: null,
  yearStart: null,
  yearEnd: null,
  type: "PPF",
  tags: ["Exterior", "Universal"],
  displayOrder: -1,
  variantValues: photochromicVariantOptions.map((variant) => variant.value),
  variantOptions: photochromicVariantOptions,
};

function deduplicateCatalog(products: StorefrontProduct[]) {
  const titles = new Set<string>();
  const skus = new Set<string>();

  return products.filter((product) => {
    const titleKey = normalizeText(product.title);
    const skuKey = product.sku?.trim().toLocaleUpperCase("pt-BR") ?? null;
    const duplicate = titles.has(titleKey) || (skuKey ? skus.has(skuKey) : false);

    if (duplicate) return false;

    titles.add(titleKey);
    if (skuKey) skus.add(skuKey);
    return true;
  });
}

export const storefrontCatalog = deduplicateCatalog(
  [...rawCatalog.map(mapRow), photochromicProduct].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  ),
);

export function storefrontProductSlug(product: StorefrontProduct) {
  return `${slugify(product.title)}-${product.id.toLowerCase()}`;
}

export function findStorefrontProductBySlug(value: string) {
  const normalized = value.toLowerCase();

  return storefrontCatalog.find(
    (product) =>
      product.id.toLowerCase() === normalized ||
      storefrontProductSlug(product) === normalized,
  );
}

export const storefrontBrands = Array.from(
  new Set(storefrontCatalog.map((product) => product.brand).filter(Boolean)),
).sort((a, b) => String(a).localeCompare(String(b), "pt-BR")) as string[];
