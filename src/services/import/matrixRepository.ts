import * as XLSX from "xlsx";
import { promises as fs } from "fs";
import path from "path";
import type {
  MatrixImportResult,
  MatrixFileMetadata,
  MatrixSheetName,
  MatrixProduct,
  MatrixVariation,
  MatrixVehicle,
  MatrixCompatibility,
  MatrixMedia,
  MatrixSEO,
  MatrixChannel,
  MatrixPendencia,
  MatrixCadastroNovo,
} from "@/domain/imports/matrixImportTypes";

function normalizeValue(value: unknown) {
  if (value === null || value === undefined) {
    return "";
  }
  return String(value).trim();
}

function sheetToObjects(worksheet: XLSX.WorkSheet) {
  const sheetData = XLSX.utils.sheet_to_json<unknown[]>(worksheet, { header: 1, defval: "" });
  const [headerRow, ...bodyRows] = sheetData as string[][];
  const headers = Array.isArray(headerRow) ? headerRow : [];
  return bodyRows.map((row) => {
    const item: Record<string, any> = {};
    if (Array.isArray(row)) {
      headers.forEach((header, index) => {
        item[normalizeValue(header)] = row[index];
      });
    }
    return item;
  });
}

function parseProdutosMestre(rows: Record<string, any>[]): MatrixProduct[] {
  return rows.map((row) => ({
    sku: normalizeValue(row["SKU_Canonico"] ?? row["SKU"]),
    productId: normalizeValue(row["Produto_ID"] ?? row["ID do Produto"]),
    name: normalizeValue(row["Nome do Produto"] ?? row["Nome Produto"] ?? row["Nome Produto"] ?? row["Nome"] ?? row["Produto"]),
    shortDescription: normalizeValue(row["Descrição Curta"] ?? row["Short Description"] ?? row["Descricao Curta"]),
    fullDescription: normalizeValue(row["Descrição Completa"] ?? row["Full Description"] ?? row["Descricao Completa"]),
    productType: normalizeValue(row["Tipo de Produto"] ?? row["Tipo Produto"]),
    price: Number(String(row["Preço"] ?? row["Price"] ?? "").replace(/[^0-9.,-]/g, "")) || undefined,
    compareAtPrice: Number(String(row["Preço de comparação"] ?? row["Compare At Price"] ?? "").replace(/[^0-9.,-]/g, "")) || undefined,
    status: normalizeValue(row["Status"] ?? row["Situacao"]),
    mainImage: normalizeValue(row["Imagem Principal"] ?? row["Imagem"] ?? row["Imagem URL"] ?? row["Image"]),
    gallery: String(row["Galeria"] ?? row["Gallery"] ?? "")
      .split(";")
      .map((item) => normalizeValue(item))
      .filter(Boolean),
    channels: String(row["Canais"] ?? row["Channels"] ?? "")
      .split(",")
      .map((item) => normalizeValue(item))
      .filter(Boolean),
    original: row,
  }));
}

function parseVariacoesSKU(rows: Record<string, any>[]): MatrixVariation[] {
  return rows.map((row) => ({
    sku: normalizeValue(row["SKU_Canonico"] ?? row["SKU"]),
    parentSku: normalizeValue(row["Produto_ID"] ?? row["SKU Pai"] ?? row["SKU_Pai"] ?? row["Parent SKU"]),
    optionName: normalizeValue(row["Nome Variante"] ?? row["Nome da Variante"] ?? row["Variant Name"]),
    optionValue: normalizeValue(row["Opção Variante"] ?? row["Valor Variante"] ?? row["Option Value"]),
    quantity: Number(String(row["Quantidade"] ?? row["Quantidade Estoque"] ?? row["Quantity"] ?? "").replace(/[^0-9.-]/g, "")) || undefined,
    price: Number(String(row["Preço"] ?? row["Price"] ?? "").replace(/[^0-9.,-]/g, "")) || undefined,
    original: row,
  }));
}

function parseVeiculosMestre(rows: Record<string, any>[]): MatrixVehicle[] {
  return rows.map((row) => ({
    vehicleId: normalizeValue(row["Veiculo_ID"] ?? row["Veiculo ID"] ?? row["Vehicle ID"] ?? row["ID Veiculo"] ?? row["ID"]),
    brand: normalizeValue(row["Marca"] ?? row["Brand"]),
    model: normalizeValue(row["Modelo"] ?? row["Model"]),
    yearStart: Number(String(row["Ano_Inicial"] ?? row["Ano Inicial"] ?? row["Year Start"] ?? "").replace(/[^0-9]/g, "")) || undefined,
    yearEnd: Number(String(row["Ano_Final"] ?? row["Ano Final"] ?? row["Year End"] ?? "").replace(/[^0-9]/g, "")) || undefined,
    slug: normalizeValue(row["Slug"] ?? row["URL Slug"] ?? row["vehicle_slug"]),
    original: row,
  }));
}

function parseCompatibilidades(rows: Record<string, any>[]): MatrixCompatibility[] {
  return rows.map((row) => ({
    productSku: normalizeValue(row["SKU_Canonico"] ?? row["SKU"]),
    vehicleSlug: normalizeValue(row["Veiculo_Slug"] ?? row["Vehicle_Slug"] ?? row["Slug"] ?? row["Slug Veiculo"]),
    notes: normalizeValue(row["Notas"] ?? row["Observacoes"] ?? row["Notes"]),
    original: row,
  }));
}

function parseMidias(rows: Record<string, any>[]): MatrixMedia[] {
  return rows.map((row) => ({
    sku: normalizeValue(row["SKU_Canonico"] ?? row["SKU"]),
    url: normalizeValue(row["URL"] ?? row["Imagem"] ?? row["Image"]),
    type: normalizeValue(row["Tipo"] ?? row["Type"]),
    original: row,
  }));
}

function parseSEO(rows: Record<string, any>[]): MatrixSEO[] {
  return rows.map((row) => ({
    sku: normalizeValue(row["SKU_Canonico"] ?? row["SKU"]),
    title: normalizeValue(row["SEO_Titulo"] ?? row["Titulo"] ?? row["Title"]),
    description: normalizeValue(row["SEO_Descricao"] ?? row["Descricao"] ?? row["Description"]),
    keywords: String(row["SEO_Keywords"] ?? row["Keywords"] ?? "")
      .split(",")
      .map((keyword) => normalizeValue(keyword))
      .filter(Boolean),
    original: row,
  }));
}

function parseCanais(rows: Record<string, any>[]): MatrixChannel[] {
  return rows.map((row) => ({
    sku: normalizeValue(row["SKU_Canonico"] ?? row["SKU"]),
    channel: normalizeValue(row["Canal"] ?? row["Marketplace"] ?? row["Channel"]),
    status: normalizeValue(row["Status Canal"] ?? row["Status"] ?? row["Channel Status"]),
    original: row,
  }));
}

function parsePendencias(rows: Record<string, any>[]): MatrixPendencia[] {
  return rows.map((row) => ({
    sku: normalizeValue(row["SKU_Canonico"] ?? row["SKU"]),
    issue: normalizeValue(row["Pendencia"] ?? row["Issue"] ?? row["Observacao"]),
    original: row,
  }));
}

function parseCadastroNovo(rows: Record<string, any>[]): MatrixCadastroNovo[] {
  return rows.map((row) => ({
    sku: normalizeValue(row["SKU_Canonico"] ?? row["SKU"]),
    data: row,
  }));
}

type MatrixImportSheetKey = Exclude<keyof MatrixImportResult, "metadata">;

type MatrixSheetDefinition<K extends MatrixImportSheetKey> = {
  name: MatrixSheetName;
  key: K;
  parser: (rows: Record<string, any>[]) => MatrixImportResult[K];
};

const sheetMetadata: Array<{
  name: MatrixSheetName;
  key: MatrixImportSheetKey;
  parser: (rows: Record<string, any>[]) => MatrixImportResult[MatrixImportSheetKey];
}> = [
  { name: "Produtos_Mestre", key: "products", parser: parseProdutosMestre },
  { name: "Variacoes_SKU", key: "variations", parser: parseVariacoesSKU },
  { name: "Veiculos_Mestre", key: "vehicles", parser: parseVeiculosMestre },
  { name: "Compatibilidades", key: "compatibilities", parser: parseCompatibilidades },
  { name: "Midias", key: "media", parser: parseMidias },
  { name: "SEO", key: "seo", parser: parseSEO },
  { name: "Canais", key: "channels", parser: parseCanais },
  { name: "Pendencias", key: "pendencias", parser: parsePendencias },
  { name: "Cadastro_Novo", key: "cadastroNovo", parser: parseCadastroNovo },
];

function assignSheetResult<K extends MatrixImportSheetKey>(result: MatrixImportResult, key: K, parsed: MatrixImportResult[K]) {
  switch (key) {
    case "products":
      result.products = parsed as MatrixProduct[];
      break;
    case "variations":
      result.variations = parsed as MatrixVariation[];
      break;
    case "vehicles":
      result.vehicles = parsed as MatrixVehicle[];
      break;
    case "compatibilities":
      result.compatibilities = parsed as MatrixCompatibility[];
      break;
    case "media":
      result.media = parsed as MatrixMedia[];
      break;
    case "seo":
      result.seo = parsed as MatrixSEO[];
      break;
    case "channels":
      result.channels = parsed as MatrixChannel[];
      break;
    case "pendencias":
      result.pendencias = parsed as MatrixPendencia[];
      break;
    case "cadastroNovo":
      result.cadastroNovo = parsed as MatrixCadastroNovo[];
      break;
  }
}

function buildEmptyResult(metadata: MatrixFileMetadata): MatrixImportResult {
  return {
    metadata,
    products: [],
    variations: [],
    vehicles: [],
    compatibilities: [],
    media: [],
    seo: [],
    channels: [],
    pendencias: [],
    cadastroNovo: [],
  };
}

export async function parseMatrixFile(file: File): Promise<MatrixImportResult> {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: "array" });

  const metadata: MatrixFileMetadata = {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
  };

  const result = buildEmptyResult(metadata);

  sheetMetadata.forEach((sheet) => {
    if (workbook.SheetNames.includes(sheet.name)) {
      const worksheet = workbook.Sheets[sheet.name];
      if (worksheet) {
        assignSheetResult(result, sheet.key, sheet.parser(sheetToObjects(worksheet)));
      }
    }
  });

  return result;
}

export async function readMatrixFromRepo(): Promise<MatrixImportResult> {
  const filePath = path.join(process.cwd(), "src", "data", "imports", "Matriz_Mestre_InterShield_V2.xlsx");
  try {
    await fs.access(filePath);
  } catch (error: any) {
    throw new Error(`Não foi possível acessar a Matriz Mestre em ${filePath}: ${error.message ?? error}`);
  }

  const buffer = await fs.readFile(filePath);
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const stat = await fs.stat(filePath);

  const metadata: MatrixFileMetadata = {
    name: path.basename(filePath),
    size: stat.size,
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    lastModified: stat.mtimeMs,
  };

  const result = buildEmptyResult(metadata);

  sheetMetadata.forEach((sheet) => {
    if (workbook.SheetNames.includes(sheet.name)) {
      const worksheet = workbook.Sheets[sheet.name];
      if (worksheet) {
        assignSheetResult(result, sheet.key, sheet.parser(sheetToObjects(worksheet)));
      }
    }
  });

  return result;
}

export const MatrixRepository = {
  parseMatrixFile,
  readMatrixFromRepo,
};
