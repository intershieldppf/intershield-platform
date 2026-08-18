import * as XLSX from "xlsx";
import { promises as fs } from "fs";
import path from "path";
import type { MatrixImportResult, MatrixFileMetadata, MatrixSheetName } from "@/domain/imports/matrixImportTypes";

function sheetToObjects(worksheet: XLSX.WorkSheet) {
  const sheetData = XLSX.utils.sheet_to_json<unknown[]>(worksheet, { header: 1, defval: "" });
  const [headerRow, ...bodyRows] = sheetData as string[][];
  const headers = Array.isArray(headerRow) ? headerRow : [];
  return bodyRows.map((row) => {
    const obj: Record<string, any> = {};
    if (Array.isArray(row)) {
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
    }
    return obj;
  });
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

  const result: MatrixImportResult = {
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

  const sheetNames = workbook.SheetNames;

  const targetSheets: { name: MatrixSheetName; key: keyof MatrixImportResult }[] = [
    { name: "Produtos_Mestre", key: "products" },
    { name: "Variacoes_SKU", key: "variations" },
    { name: "Veiculos_Mestre", key: "vehicles" },
    { name: "Compatibilidades", key: "compatibilities" },
    { name: "Midias", key: "media" },
    { name: "SEO", key: "seo" },
    { name: "Canais", key: "channels" },
    { name: "Pendencias", key: "pendencias" },
    { name: "Cadastro_Novo", key: "cadastroNovo" },
  ];

  targetSheets.forEach((sheetDef) => {
    if (sheetNames.includes(sheetDef.name)) {
      const ws = workbook.Sheets[sheetDef.name];
      const objects = sheetToObjects(ws);
      (result[sheetDef.key] as any) = objects;
    }
  });

  return result;
}

export async function readMatrixFromRepo(): Promise<MatrixImportResult> {
  const filePath = path.join(
    process.cwd(),
    "src",
    "data",
    "imports",
    "Matriz_Mestre_InterShield_V2.xlsx"
  );

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

  const result: MatrixImportResult = {
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

  const sheetNames = workbook.SheetNames;

  const targetSheets: { name: MatrixSheetName; key: keyof MatrixImportResult }[] = [
    { name: "Produtos_Mestre", key: "products" },
    { name: "Variacoes_SKU", key: "variations" },
    { name: "Veiculos_Mestre", key: "vehicles" },
    { name: "Compatibilidades", key: "compatibilities" },
    { name: "Midias", key: "media" },
    { name: "SEO", key: "seo" },
    { name: "Canais", key: "channels" },
    { name: "Pendencias", key: "pendencias" },
    { name: "Cadastro_Novo", key: "cadastroNovo" },
  ];

  targetSheets.forEach((sheetDef) => {
    if (sheetNames.includes(sheetDef.name)) {
      const ws = workbook.Sheets[sheetDef.name];
      const objects = sheetToObjects(ws);
      (result[sheetDef.key] as any) = objects;
    }
  });

  return result;
}
