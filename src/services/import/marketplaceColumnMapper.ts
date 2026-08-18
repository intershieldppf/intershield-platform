import type { ImportRow, MarketplaceSource } from "@/domain/imports/importTypes";

export const PRODUCT_IMPORT_COLUMNS = [
  "Nome da Loja",
  "ID do Anúncios",
  "Link do Anúncio",
  "Título",
  "Nome da Categoria",
  "Descrição",
  "ML Preço",
  "Tipo de Anúncio",
  "Tipo de Garantia",
  "SKU",
  "Quantidade",
  "Imagem de Anúncio1",
  "Nome Variante1",
  "Opção por Variante1",
  "ID da Variante",
  "Data de Criação",
  "Horário Atualizado",
];

export function mapMarketplaceRowToImportRow(
  row: Record<string, any>,
  rowIndex: number,
  source: MarketplaceSource = "mercado_livre"
): ImportRow {
  return {
    rowNumber: rowIndex + 2,
    source,
    original: row,
    storeName: row["Nome da Loja"]?.toString().trim() ?? "",
    listingId: row["ID do Anúncios"]?.toString().trim() ?? "",
    listingUrl: row["Link do Anúncio"]?.toString().trim() ?? "",
    title: row["Título"]?.toString().trim() ?? "",
    categoryName: row["Nome da Categoria"]?.toString().trim() ?? "",
    description: row["Descrição"]?.toString().trim() ?? "",
    price: parseFloat(String(row["ML Preço"] ?? "").replace(/[.,]/g, (match, offset, str) => (match === "," ? "." : ""))) || undefined,
    listingType: row["Tipo de Anúncio"]?.toString().trim() ?? "",
    warrantyType: row["Tipo de Garantia"]?.toString().trim() ?? "",
    sku: row["SKU"]?.toString().trim() ?? "",
    quantity: Number(row["Quantidade"]) || undefined,
    mainImageUrl: row["Imagem de Anúncio1"]?.toString().trim() ?? "",
    variantName: row["Nome Variante1"]?.toString().trim() ?? "",
    variantOption: row["Opção por Variante1"]?.toString().trim() ?? "",
    variantId: row["ID da Variante"]?.toString().trim() ?? "",
    createdAt: row["Data de Criação"]?.toString().trim() ?? "",
    updatedAt: row["Horário Atualizado"]?.toString().trim() ?? "",
    isVariation: false,
    validationIssues: [],
    status: "valid",
  };
}
