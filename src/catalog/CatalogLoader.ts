import * as XLSX from "xlsx";
import { promises as fs } from "fs";
import path from "path";
import {
  CatalogSheetName,
  CatalogFileMetadata,
  CatalogSheetSummary,
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
  CatalogLoadResult,
  CatalogIndex,
  CatalogStatistics,
} from "./catalogTypes";

const supportedSheets: CatalogSheetName[] = [
  "Produtos_Mestre",
  "Variacoes_SKU",
  "Veiculos_Mestre",
  "Compatibilidades",
  "Midias",
  "SEO",
  "Canais",
  "Pendencias",
  "Cadastro_Novo",
];

const ignoredSheets = new Set(["Dashboard", "Listas_Controle", "Original_ML"]);

function normalizeHeader(value: unknown) {
  if (value === null || value === undefined) {
    return "";
  }
  return String(value).trim();
}

function isEmptyRow(row: Record<string, unknown>) {
  return Object.values(row).every((value) => value === null || value === undefined || String(value).trim() === "");
}

function sheetToObjects(worksheet: XLSX.WorkSheet) {
  const sheetData = XLSX.utils.sheet_to_json<unknown[]>(worksheet, { header: 1, defval: "" });
  const [headerRow, ...bodyRows] = sheetData as string[][];
  const headers = Array.isArray(headerRow) ? headerRow.map(normalizeHeader) : [];

  return bodyRows
    .map((row) => {
      const item: Record<string, unknown> = {};
      if (Array.isArray(row)) {
        headers.forEach((header, index) => {
          if (header) {
            item[header] = row[index];
          }
        });
      }
      return item;
    })
    .filter((row) => !isEmptyRow(row));
}

function parseString(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function parseNullableString(value: unknown): string | null {
  const normalized = parseString(value);
  return normalized === "" ? null : normalized;
}

function parseNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }
  const text = String(value).replace(/[^0-9.,-]/g, "").replace(/,/g, ".").trim();
  if (text === "" || text === "." || text === "-") return null;
  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseBoolean(value: unknown): boolean | null {
  if (value === null || value === undefined) return null;
  const normalized = String(value).trim().toLowerCase();
  if (normalized === "true" || normalized === "sim" || normalized === "1" || normalized === "yes") return true;
  if (normalized === "false" || normalized === "não" || normalized === "nao" || normalized === "0" || normalized === "no") return false;
  return null;
}

function parseStringList(value: unknown, separator: string) {
  const text = parseString(value);
  if (!text) return [];
  return text.split(separator).map((item) => parseString(item)).filter(Boolean);
}

function parseProducts(rows: Record<string, unknown>[]): CatalogProduct[] {
  return rows.map((row) => ({
    sku: parseString(row["SKU_Canonico"] ?? row["SKU"]),
    productId: parseString(row["Produto_ID"] ?? row["ID do Produto"] ?? row["ID Produto"]),
    officialName: parseNullableString(
      row["Nome_Oficial"] ?? row["Nome Oficial"] ?? row["Nome do Produto"] ?? row["Nome Produto"] ?? row["Nome"] ?? row["Produto"] ?? row["Product Name"]
    ),
    name: parseString(
      row["Nome do Produto"] ?? row["Nome Produto"] ?? row["Nome"] ?? row["Produto"] ?? row["Product Name"] ?? row["Nome_Oficial"] ?? row["Nome Oficial"]
    ),
    shortDescription: parseNullableString(row["Descrição Curta"] ?? row["Descricao Curta"] ?? row["Short Description"] ?? row["ShortDescription"]),
    fullDescription: parseNullableString(row["Descrição Completa"] ?? row["Descricao Completa"] ?? row["Full Description"]),
    productType: parseNullableString(row["Tipo de Produto"] ?? row["Tipo Produto"] ?? row["Product Type"]),
    material: parseNullableString(row["Material"] ?? row["Material do Produto"] ?? row["Product Material"]),
    price: parseNumber(row["Preço"] ?? row["Price"]),
    compareAtPrice: parseNumber(row["Preço de comparação"] ?? row["Compare At Price"] ?? row["CompareAtPrice"]),
    status: parseNullableString(row["Status"] ?? row["Situação"] ?? row["Situacao"] ?? row["Status do Produto"]),
    mainImage: parseNullableString(row["Imagem Principal"] ?? row["Imagem"] ?? row["Image"]),
    gallery: parseStringList(row["Galeria"] ?? row["Gallery"], ";"),
    channels: parseStringList(row["Canais"] ?? row["Channels"], ","),
    universal: parseBoolean(row["Universal"] ?? row["Universalizado"] ?? row["Universalização"]),
    warranty: {
      type: "Garantia do Vendedor",
      days: 30,
    },
    original: row,
  }));
}

function parseVariants(rows: Record<string, unknown>[]): CatalogVariant[] {
  return rows.map((row) => ({
    sku: parseString(row["SKU_Canonico"] ?? row["SKU"]),
    variationId: parseString(
      row["Variacao_ID"] ?? row["Variacao ID"] ?? row["ID_Variacao"] ?? row["ID da Variacao"] ?? row["ID da Variação"] ?? row["Variation ID"] ?? row["Variation"]
    ),
    productId: parseString(row["Produto_ID"] ?? row["ID do Produto"] ?? row["ID Produto"]),
    finish: parseNullableString(row["Acabamento"] ?? row["Finish"]),
    optionName: parseNullableString(row["Nome Variante"] ?? row["Nome da Variante"] ?? row["Variant Name"]),
    optionValue: parseNullableString(row["Opção Variante"] ?? row["Opcao Variante"] ?? row["Variant Value"] ?? row["Option Value"]),
    variantOption: parseNullableString(row["Variant Option"] ?? row["Option Value"] ?? row["Opcao Variante"] ?? row["Opção Variante"]),
    quantity: parseNumber(row["Estoque"] ?? row["Quantidade"] ?? row["Quantidade Estoque"] ?? row["Quantity"]),
    price: parseNumber(row["Preço"] ?? row["Preco"] ?? row["Price"]),
    marketplaceListingId: parseNullableString(
      row["ID_Anuncio_ML"] ?? row["ID do Anúncio ML"] ?? row["ID do Anuncio ML"] ?? row["ID do Anúncio"] ?? row["ID do Anuncio"] ?? row["ID_Anuncio"] ?? row["ID Anuncio"]
    ),
    validationStatus: parseNullableString(
      row["Status_Validacao"] ?? row["Status da Validacao"] ?? row["Status de Validacao"] ?? row["Status Validacao"] ?? row["Status_Validação"] ?? row["Status de Validação"]
    ),
    pendingIssues: parseNullableString(row["Pendencias"] ?? row["Pendência"] ?? row["Pendencia"] ?? row["Issues"] ?? row["Observacoes"] ?? row["Notas"]),
    original: row,
  }));
}

function parseVehicles(rows: Record<string, unknown>[]): CatalogVehicle[] {
  return rows.map((row) => ({
    vehicleId: parseString(row["Veiculo_ID"] ?? row["Veiculo ID"] ?? row["Vehicle ID"] ?? row["ID Veiculo"] ?? row["ID"]),
    brand: parseNullableString(row["Marca"] ?? row["Brand"]),
    model: parseNullableString(row["Modelo"] ?? row["Model"]),
    yearStart: parseNumber(row["Ano_Inicial"] ?? row["Ano Inicial"] ?? row["Year Start"]),
    yearEnd: parseNumber(row["Ano_Final"] ?? row["Ano Final"] ?? row["Year End"]),
    slug: parseNullableString(row["Slug"] ?? row["Vehicle Slug"] ?? row["Veiculo_Slug"] ?? row["URL Slug"]),
    universal: parseBoolean(row["Universal"] ?? row["Universalizado"]),
    imageUrl: null,
    imageSource: null,
    imageStatus: "missing",
    imageAlt: null,
    original: row,
  }));
}

function parseCompatibilities(rows: Record<string, unknown>[]): CatalogCompatibility[] {
  return rows.map((row) => ({
    productId: parseNullableString(row["Produto_ID"] ?? row["ID do Produto"] ?? row["ID Produto"]),
    sku: parseNullableString(row["SKU_Canonico"] ?? row["SKU"]),
    vehicleId: parseNullableString(row["Veiculo_ID"] ?? row["Veiculo ID"] ?? row["Vehicle ID"]),
    vehicleSlug: parseNullableString(row["Veiculo_Slug"] ?? row["Vehicle_Slug"] ?? row["Slug"] ?? row["Veiculo Slug"]),
    notes: parseNullableString(row["Notas"] ?? row["Observacoes"] ?? row["Notes"]),
    original: row,
  }));
}

function parseMedia(rows: Record<string, unknown>[]): CatalogMedia[] {
  return rows.map((row) => ({
    productId: parseNullableString(row["Produto_ID"] ?? row["ID do Produto"] ?? row["ID Produto"]),
    sku: parseNullableString(row["SKU_Canonico"] ?? row["SKU"]),
    url: parseString(row["URL"] ?? row["Imagem"] ?? row["Image"]),
    type: parseNullableString(row["Tipo"] ?? row["Type"]),
    original: row,
  }));
}

function parseSeo(rows: Record<string, unknown>[]): CatalogSeo[] {
  return rows.map((row) => ({
    productId: parseNullableString(row["Produto_ID"] ?? row["ID do Produto"] ?? row["ID Produto"]),
    sku: parseNullableString(row["SKU_Canonico"] ?? row["SKU"]),
    title: parseNullableString(row["SEO_Titulo"] ?? row["Titulo"] ?? row["Title"]),
    description: parseNullableString(row["SEO_Descricao"] ?? row["Descricao"] ?? row["Description"]),
    keywords: parseStringList(row["SEO_Keywords"] ?? row["Keywords"], ","),
    original: row,
  }));
}

function parseChannels(rows: Record<string, unknown>[]): CatalogChannel[] {
  return rows.map((row) => ({
    productId: parseNullableString(row["Produto_ID"] ?? row["ID do Produto"] ?? row["ID Produto"]),
    sku: parseNullableString(row["SKU_Canonico"] ?? row["SKU"]),
    variationId: parseNullableString(
      row["Variacao_ID"] ?? row["Variacao ID"] ?? row["ID_Variacao"] ?? row["ID da Variacao"] ?? row["ID da Variação"] ?? row["ID_Variacao"]
    ),
    listingId: parseNullableString(row["ID_Anuncio"] ?? row["ID do Anúncio"] ?? row["ID do Anuncio"] ?? row["ID_Anuncio"]),
    channelPrice: parseNumber(row["Preco_Canal"] ?? row["Preço_Canal"] ?? row["Preco Canal"] ?? row["Preço Canal"] ?? row["Price Channel"] ?? row["Channel Price"]),
    channel: parseString(row["Canal"] ?? row["Marketplace"] ?? row["Channel"]),
    status: parseNullableString(row["Status Canal"] ?? row["Status"] ?? row["Channel Status"]),
    original: row,
  }));
}

function parsePendencias(rows: Record<string, unknown>[]): CatalogPendingIssue[] {
  return rows.map((row) => ({
    productId: parseNullableString(row["Produto_ID"] ?? row["ID do Produto"] ?? row["ID Produto"]),
    sku: parseNullableString(row["SKU_Canonico"] ?? row["SKU"]),
    issue: parseNullableString(row["Pendencia"] ?? row["Issue"] ?? row["Observacao"]),
    original: row,
  }));
}

function parseNewRegistrations(rows: Record<string, unknown>[]): CatalogNewRegistration[] {
  return rows.map((row) => ({
    productId: parseNullableString(row["Produto_ID"] ?? row["ID do Produto"] ?? row["ID Produto"]),
    sku: parseNullableString(row["SKU_Canonico"] ?? row["SKU"]),
    data: row,
    original: row,
  }));
}

function buildEmptyIndex(): CatalogIndex {
  return {
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
}

function buildEmptyStatistics(): CatalogStatistics {
  return {
    products: 0,
    variants: 0,
    vehicles: 0,
    compatibilities: 0,
    media: 0,
    seo: 0,
    channels: 0,
    pendingIssues: 0,
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
}

function buildEmptyCatalog(metadata: CatalogFileMetadata): InterShieldCatalog {
  return {
    products: [],
    variants: [],
    vehicles: [],
    compatibilities: [],
    media: [],
    seo: [],
    channels: [],
    pendingIssues: [],
    newRegistrations: [],
    indexes: buildEmptyIndex(),
    statistics: buildEmptyStatistics(),
  };
}

export async function loadProjectMatrix(): Promise<CatalogLoadResult> {
  const filePath = path.join(process.cwd(), "src", "data", "imports", "Matriz_Mestre_InterShield_V2.xlsx");
  try {
    await fs.access(filePath);
  } catch (error: unknown) {
    throw new Error(`Não foi possível acessar a Matriz Mestre em ${filePath}`);
  }

  const buffer = await fs.readFile(filePath);
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const stat = await fs.stat(filePath);
  const metadata: CatalogFileMetadata = {
    name: path.basename(filePath),
    size: stat.size,
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    lastModified: stat.mtimeMs,
  };

  return parseWorkbook(workbook, metadata);
}

export async function parseUploadedMatrix(buffer: ArrayBuffer, name = "uploaded.xlsx"): Promise<CatalogLoadResult> {
  const workbook = XLSX.read(Buffer.from(buffer), { type: "buffer" });
  const metadata: CatalogFileMetadata = {
    name,
    size: buffer.byteLength,
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    lastModified: Date.now(),
  };

  return parseWorkbook(workbook, metadata);
}

function parseWorkbook(workbook: XLSX.WorkBook, metadata: CatalogFileMetadata): CatalogLoadResult {
  const sheetSummaries: CatalogSheetSummary[] = supportedSheets.map((name) => ({
    name,
    found: workbook.SheetNames.includes(name),
    rows: 0,
  }));

  const catalog = buildEmptyCatalog(metadata);
  const parserByName: Record<CatalogSheetName, (rows: Record<string, unknown>[]) => unknown[]> = {
    Produtos_Mestre: parseProducts,
    Variacoes_SKU: parseVariants,
    Veiculos_Mestre: parseVehicles,
    Compatibilidades: parseCompatibilities,
    Midias: parseMedia,
    SEO: parseSeo,
    Canais: parseChannels,
    Pendencias: parsePendencias,
    Cadastro_Novo: parseNewRegistrations,
  };

  workbook.SheetNames.forEach((sheetName) => {
    if (ignoredSheets.has(sheetName)) return;
    if (!supportedSheets.includes(sheetName as CatalogSheetName)) return;

    const worksheet = workbook.Sheets[sheetName];
    if (!worksheet) return;

    const rows = sheetToObjects(worksheet);
    const parser = parserByName[sheetName as CatalogSheetName];
    const parsed = parser(rows);
    const summary = sheetSummaries.find((summaryItem) => summaryItem.name === sheetName);
    if (summary) summary.rows = parsed.length;

    switch (sheetName) {
      case "Produtos_Mestre":
        catalog.products = parsed as CatalogProduct[];
        break;
      case "Variacoes_SKU":
        catalog.variants = parsed as CatalogVariant[];
        break;
      case "Veiculos_Mestre":
        catalog.vehicles = parsed as CatalogVehicle[];
        break;
      case "Compatibilidades":
        catalog.compatibilities = parsed as CatalogCompatibility[];
        break;
      case "Midias":
        catalog.media = parsed as CatalogMedia[];
        break;
      case "SEO":
        catalog.seo = parsed as CatalogSeo[];
        break;
      case "Canais":
        catalog.channels = parsed as CatalogChannel[];
        break;
      case "Pendencias":
        catalog.pendingIssues = parsed as CatalogPendingIssue[];
        break;
      case "Cadastro_Novo":
        catalog.newRegistrations = parsed as CatalogNewRegistration[];
        break;
      default:
        break;
    }
  });

  return {
    fileName: metadata.name,
    analyzedAt: new Date().toISOString(),
    sheetSummaries,
    catalog,
    validation: {
      issues: [],
      productStates: [],
      variantStates: [],
    },
    statistics: buildEmptyStatistics(),
    previewVariants: [],
  };
}
