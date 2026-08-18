import type { ImportAnalysis, ImportRow } from "@/domain/imports/importTypes";

export function analyzeImportRows(rows: ImportRow[]): ImportAnalysis {
  return {
    totalRows: rows.length,
    uniqueListings: new Set(rows.map((row) => row.listingId?.trim() ?? "")).size,
    rowsWithSku: rows.filter((row) => row.sku?.trim()).length,
    rowsWithoutSku: rows.filter((row) => !row.sku?.trim()).length,
    duplicateSkus: Object.entries(
      rows.reduce<Record<string, number>>((acc, row) => {
        const sku = row.sku?.trim() ?? "";
        if (!sku) return acc;
        acc[sku] = (acc[sku] ?? 0) + 1;
        return acc;
      }, {})
    )
      .filter(([, count]) => count > 1)
      .map(([sku]) => sku),
    rowsWithDescription: rows.filter((row) => row.description?.trim()).length,
    rowsWithMainImage: rows.filter((row) => row.mainImageUrl?.trim()).length,
    variationRows: rows.filter((row) => row.isVariation).length,
    errors: rows.reduce((count, row) => count + row.validationIssues.filter((issue) => issue.type === "error").length, 0),
    alerts: rows.reduce((count, row) => count + row.validationIssues.filter((issue) => issue.type === "alert").length, 0),
  };
}

export function buildImportSummary(rows: ImportRow[]) {
  return analyzeImportRows(rows);
}
