import * as XLSX from "xlsx";

export type MarketplaceProductSource = {
  listingId: string;
  title: string | null;
  description: string | null;
  price: number | null;
  sku: string | null;
  warranty: string | null;
  images: string[];
  variantValues: string[];
};

type MatrixProductRow = {
  Produto_ID?: unknown;
  Nome_Oficial?: unknown;
  Descricao_Padrao?: unknown;
  Garantia_Tipo?: unknown;
  Garantia_Dias?: unknown;
};

type MatrixChannelRow = {
  Produto_ID?: unknown;
  ID_Anuncio?: unknown;
};

type MatrixVariationRow = {
  Produto_ID?: unknown;
  ID_Anuncio_ML?: unknown;
};

function text(value: unknown) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function number(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  const normalized = text(value)
    .replace(/[^0-9,.-]/g, "")
    .replace(",", ".");
  if (!normalized) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeImageUrl(value: unknown) {
  const url = text(value);
  if (!url) return "";
  if (url.startsWith("http://http2.mlstatic.com/")) {
    return url.replace(
      "http://http2.mlstatic.com/",
      "https://http2.mlstatic.com/",
    );
  }
  return url;
}

function findMarketplaceHeaderIndex(rows: unknown[][]) {
  return rows.findIndex((row) => {
    const headers = row.map((value) => text(value).toLowerCase());
    const hasId = headers.some((value) =>
      [
        "id do anúncios",
        "id do anúncio",
        "id do anuncios",
        "id do anuncio",
      ].includes(value),
    );
    const hasTitle = headers.includes("título") || headers.includes("titulo");
    const hasDescription =
      headers.includes("descrição") || headers.includes("descricao");
    return hasId && hasTitle && hasDescription;
  });
}

function sheetToMarketplaceRows(worksheet: XLSX.WorkSheet) {
  const rows = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
    header: 1,
    defval: "",
    raw: false,
  });

  const headerIndex = findMarketplaceHeaderIndex(rows);
  if (headerIndex < 0) return [];

  const headers = rows[headerIndex].map((value) => text(value));

  return rows.slice(headerIndex + 1).map((row) => {
    const record: Record<string, unknown> = {};
    headers.forEach((header, index) => {
      if (header) record[header] = row[index];
    });
    return record;
  });
}

function readField(row: Record<string, unknown>, names: string[]) {
  for (const name of names) {
    if (row[name] !== undefined && text(row[name])) return row[name];
  }
  return null;
}

function readImages(row: Record<string, unknown>) {
  const values: string[] = [];
  for (let index = 1; index <= 12; index += 1) {
    const value = normalizeImageUrl(row[`Imagem de Anúncio${index}`]);
    if (value) values.push(value);
  }
  for (let index = 1; index <= 10; index += 1) {
    const value = normalizeImageUrl(row[`Imagem da Variante${index}`]);
    if (value) values.push(value);
  }
  return Array.from(new Set(values));
}

function readVariantValues(row: Record<string, unknown>) {
  const values: string[] = [];
  for (let index = 1; index <= 5; index += 1) {
    const value = text(row[`Opção por Variante${index}`]);
    if (value) values.push(value);
  }
  return values;
}

function readMatrixRows<T>(workbook: XLSX.WorkBook, sheetName: string) {
  const worksheet = workbook.Sheets[sheetName];
  if (!worksheet) return [];

  return XLSX.utils.sheet_to_json<T>(worksheet, {
    defval: "",
    raw: false,
  });
}

function enrichDescriptionsFromMasterMatrix(
  workbook: XLSX.WorkBook,
  products: MarketplaceProductSource[],
) {
  const productRows = readMatrixRows<MatrixProductRow>(
    workbook,
    "Produtos_Mestre",
  );
  if (!productRows.length) return products;

  const channelRows = readMatrixRows<MatrixChannelRow>(workbook, "Canais");
  const variationRows = readMatrixRows<MatrixVariationRow>(
    workbook,
    "Variacoes_SKU",
  );

  const productById = new Map(
    productRows
      .map((row) => [text(row.Produto_ID), row] as const)
      .filter(([productId]) => Boolean(productId)),
  );

  const productIdByListingId = new Map<string, string>();

  for (const row of channelRows) {
    const listingId = text(row.ID_Anuncio);
    const productId = text(row.Produto_ID);
    if (listingId && productId) productIdByListingId.set(listingId, productId);
  }

  for (const row of variationRows) {
    const listingId = text(row.ID_Anuncio_ML);
    const productId = text(row.Produto_ID);
    if (listingId && productId && !productIdByListingId.has(listingId)) {
      productIdByListingId.set(listingId, productId);
    }
  }

  return products.map((product) => {
    if (product.description) return product;

    const productId = productIdByListingId.get(product.listingId);
    const masterProduct = productId ? productById.get(productId) : null;
    const masterDescription = text(masterProduct?.Descricao_Padrao) || null;

    if (!masterDescription) return product;

    const warrantyType = text(masterProduct?.Garantia_Tipo);
    const warrantyDays = text(masterProduct?.Garantia_Dias);
    const warranty =
      product.warranty ||
      [warrantyType, warrantyDays ? `${warrantyDays} dias` : ""]
        .filter(Boolean)
        .join(" · ") ||
      null;

    return {
      ...product,
      title: product.title || text(masterProduct?.Nome_Oficial) || null,
      description: masterDescription,
      warranty,
    };
  });
}

export function extractMarketplaceProductsFromWorkbook(
  workbook: XLSX.WorkBook,
) {
  const preferredSheets = [
    "Original_ML",
    ...workbook.SheetNames.filter((name) => name !== "Original_ML"),
  ];

  let sourceRows: Record<string, unknown>[] = [];
  for (const sheetName of preferredSheets) {
    const worksheet = workbook.Sheets[sheetName];
    if (!worksheet) continue;
    const rows = sheetToMarketplaceRows(worksheet);
    if (rows.length) {
      sourceRows = rows;
      break;
    }
  }

  const grouped = new Map<string, MarketplaceProductSource>();

  for (const row of sourceRows) {
    const listingId = text(
      readField(row, [
        "ID do Anúncios",
        "ID do Anúncio",
        "ID do Anuncios",
        "ID do Anuncio",
      ]),
    );
    if (!listingId) continue;

    const existing = grouped.get(listingId);
    const title = text(readField(row, ["Título", "Titulo"])) || null;
    const description =
      text(readField(row, ["Descrição", "Descricao"])) || null;
    const price = number(readField(row, ["ML Preço", "Preço", "Preco"]));
    const sku = text(readField(row, ["SKU"])) || null;
    const warranty =
      text(readField(row, ["Tipo de Garantia", "Garantia"])) || null;
    const images = readImages(row);
    const variantValues = readVariantValues(row);

    if (!existing) {
      grouped.set(listingId, {
        listingId,
        title,
        description,
        price,
        sku,
        warranty,
        images,
        variantValues,
      });
      continue;
    }

    existing.title ||= title;
    existing.description ||= description;
    existing.price ??= price;
    existing.sku ||= sku;
    existing.warranty ||= warranty;
    existing.images = Array.from(new Set([...existing.images, ...images]));
    existing.variantValues = Array.from(
      new Set([...existing.variantValues, ...variantValues].filter(Boolean)),
    );
  }

  return enrichDescriptionsFromMasterMatrix(
    workbook,
    Array.from(grouped.values()),
  );
}

export function extractMarketplaceProductsFromArrayBuffer(buffer: ArrayBuffer) {
  const workbook = XLSX.read(new Uint8Array(buffer), { type: "array" });
  return extractMarketplaceProductsFromWorkbook(workbook);
}

export function marketplaceImportCoverage(
  products: MarketplaceProductSource[],
) {
  return {
    products: products.length,
    withDescription: products.filter((product) => Boolean(product.description))
      .length,
    withImages: products.filter((product) => product.images.length > 0).length,
    withSku: products.filter((product) => Boolean(product.sku)).length,
    withPrice: products.filter((product) => product.price !== null).length,
  };
}
