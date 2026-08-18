import type { ImportAnalysis, ImportRow, ImportValidationIssue } from "@/domain/imports/importTypes";

export function validateImportRows(rows: ImportRow[]): ImportRow[] {
  const skuCounts = rows.reduce<Record<string, number>>((acc, row) => {
    const sku = row.sku?.trim() ?? "";
    if (!sku) {
      return acc;
    }
    acc[sku] = (acc[sku] ?? 0) + 1;
    return acc;
  }, {});

  const listingCounts = rows.reduce<Record<string, number>>((acc, row) => {
    const listingId = row.listingId?.trim() ?? "";
    if (!listingId) {
      return acc;
    }
    acc[listingId] = (acc[listingId] ?? 0) + 1;
    return acc;
  }, {});

  return rows.map((row) => {
    const issues: ImportValidationIssue[] = [];
    const sku = row.sku?.trim() ?? "";
    const title = row.title?.trim() ?? "";
    const price = row.price ?? 0;
    const image = row.mainImageUrl?.trim() ?? "";
    const description = row.description?.trim() ?? "";
    const listingId = row.listingId?.trim() ?? "";
    const isDuplicateSku = sku && skuCounts[sku] > 1;
    const isVariation = listingId ? listingCounts[listingId] > 1 : false;

    if (!sku) {
      issues.push({ type: "error", code: "missing_sku", message: "SKU vazio gera erro bloqueante." });
    }

    if (!title) {
      issues.push({ type: "error", code: "missing_title", message: "Título vazio gera erro bloqueante." });
    }

    if (!price || price <= 0) {
      issues.push({ type: "error", code: "missing_price", message: "Preço vazio ou zerado gera erro bloqueante." });
    }

    if (!image) {
      issues.push({ type: "alert", code: "missing_image", message: "Imagem principal vazia gera alerta." });
    }

    if (!description) {
      issues.push({ type: "alert", code: "missing_description", message: "Descrição vazia gera alerta." });
    }

    if (isDuplicateSku) {
      issues.push({ type: "alert", code: "duplicate_sku", message: "SKU repetido deve ser listado para revisão." });
    }

    const status = issues.some((issue) => issue.type === "error")
      ? "blocked"
      : isDuplicateSku
      ? "duplicate"
      : isVariation
      ? "variation"
      : issues.some((issue) => issue.type === "alert")
      ? "alert"
      : "valid";

    return {
      ...row,
      isVariation,
      validationIssues: issues,
      status,
    };
  });
}

export function summarizeImportAnalysis(rows: ImportRow[]): ImportAnalysis {
  const uniqueListings = new Set(rows.map((row) => row.listingId?.trim() ?? ""));
  const skuCounts = rows.reduce<Record<string, number>>((acc, row) => {
    const sku = row.sku?.trim() ?? "";
    if (!sku) return acc;
    acc[sku] = (acc[sku] ?? 0) + 1;
    return acc;
  }, {});

  return {
    totalRows: rows.length,
    uniqueListings: uniqueListings.has("") ? uniqueListings.size - 1 : uniqueListings.size,
    rowsWithSku: rows.filter((row) => row.sku?.trim()).length,
    rowsWithoutSku: rows.filter((row) => !row.sku?.trim()).length,
    duplicateSkus: Object.keys(skuCounts).filter((sku) => skuCounts[sku] > 1),
    rowsWithDescription: rows.filter((row) => row.description?.trim()).length,
    rowsWithMainImage: rows.filter((row) => row.mainImageUrl?.trim()).length,
    variationRows: rows.filter((row) => row.isVariation).length,
    errors: rows.reduce((count, row) => count + row.validationIssues.filter((issue) => issue.type === "error").length, 0),
    alerts: rows.reduce((count, row) => count + row.validationIssues.filter((issue) => issue.type === "alert").length, 0),
  };
}
