import * as XLSX from "xlsx";
import type { ImportRow, MarketplaceSource } from "@/domain/imports/importTypes";
import { mapMarketplaceRowToImportRow } from "@/services/import/marketplaceColumnMapper";

export async function parseSpreadsheetFile(file: File): Promise<{
  metadata: { name: string; size: number; type: string; lastModified: number };
  rows: ImportRow[];
}> {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  const sheetData = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
    header: 1,
    defval: "",
  });

  const [headerRow, ...bodyRows] = sheetData as string[][];
  const headers = Array.isArray(headerRow) ? headerRow : [];

  const rawRows: Record<string, any>[] = bodyRows.map((row) => {
    const result: Record<string, any> = {};
    if (Array.isArray(row)) {
      headers.forEach((header, index) => {
        result[header] = row[index];
      });
    }
    return result;
  });

  const rows = rawRows.map((row, index) => mapMarketplaceRowToImportRow(row, index));

  return {
    metadata: {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    },
    rows,
  };
}
