import catalog1 from "./catalog-1.json";
import catalog2 from "./catalog-2.json";
import catalog3 from "./catalog-3.json";
import catalog4 from "./catalog-4.json";

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

  return {
    id,
    title,
    price,
    image: `https://http2.mlstatic.com/${image}`,
    sku,
    brand,
    yearStart,
    yearEnd,
    type,
    tags: decodeTags(tagMask),
    displayOrder,
    variantValues,
  };
}

const rawCatalog = [
  ...(catalog1 as unknown as RawCatalogRow[]),
  ...(catalog2 as unknown as RawCatalogRow[]),
  ...(catalog3 as unknown as RawCatalogRow[]),
  ...(catalog4 as unknown as RawCatalogRow[]),
];

export const storefrontCatalog = rawCatalog
  .map(mapRow)
  .sort((a, b) => a.displayOrder - b.displayOrder);

export const storefrontBrands = Array.from(
  new Set(storefrontCatalog.map((product) => product.brand).filter(Boolean)),
).sort((a, b) => String(a).localeCompare(String(b), "pt-BR")) as string[];
