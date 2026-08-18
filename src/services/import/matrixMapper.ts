import type { MatrixImportResult, MatrixProduct, MatrixVariation, MatrixVehicle, MatrixCompatibility, MatrixMedia, MatrixSEO, MatrixChannel, MatrixPendencia, MatrixCadastroNovo } from "@/domain/imports/matrixImportTypes";

export function mapMatrixToDomain(result: MatrixImportResult) {
  const products: MatrixProduct[] = (result.products as any[]).map((row) => ({
    sku: String(row["SKU"] ?? row.sku ?? "").trim(),
    productId: row["Produto_ID"] ?? row["ID do Produto"] ?? row.productId,
    name: row["Nome do Produto"] ?? row["Nome Produto"] ?? row.name,
    shortDescription: row["Descrição Curta"] ?? row.shortDescription ?? row["Short Description"] ?? row.shortDescription,
    fullDescription: row["Descrição Completa"] ?? row.fullDescription ?? row.fullDescription,
    productType: row["Tipo de Produto"] ?? row.productType,
    price: parseFloat(String(row["Preço"] ?? row.price ?? "") || "0") || undefined,
    compareAtPrice: parseFloat(String(row["Preço de comparação"] ?? row.compareAtPrice ?? "") || "0") || undefined,
    status: row["Status"] ?? row.status,
    mainImage: row["Imagem Principal"] ?? row.mainImage,
    gallery: (row["Galeria"] && String(row["Galeria"]).split(";")) || row.gallery || [],
    channels: (row["Canais"] && String(row["Canais"]).split(",")) || row.channels || [],
    original: row,
  }));

  const variations: MatrixVariation[] = (result.variations as any[]).map((row) => ({
    sku: String(row["SKU_Canonico"] ?? row["SKU"] ?? row.sku ?? "").trim(),
    parentSku: row["Produto_ID"] ?? row["SKU Pai"] ?? row.parentSku,
    optionName: row["Nome Variante"] ?? row.optionName,
    optionValue: row["Opção Variante"] ?? row.optionValue,
    quantity: Number(row["Quantidade"] ?? row.quantity) || undefined,
    price: parseFloat(String(row["Preço"] ?? row.price ?? "") || "0") || undefined,
    original: row,
  }));

  const vehicles: MatrixVehicle[] = (result.vehicles as any[]).map((row) => ({
    vehicleId: row["Veiculo_ID"] ?? row.vehicleId,
    brand: row["Marca"] ?? row.brand,
    model: row["Modelo"] ?? row.model,
    yearStart: Number(row["Ano_Inicial"] ?? row.yearStart) || undefined,
    yearEnd: Number(row["Ano_Final"] ?? row.yearEnd) || undefined,
    slug: row["Slug"] ?? row.slug,
    original: row,
  }));

  const compatibilities: MatrixCompatibility[] = (result.compatibilities as any[]).map((row) => ({
    productSku: row["SKU_Canonico"] ?? row["SKU"] ?? row.productSku,
    vehicleSlug: row["Veiculo_Slug"] ?? row["Vehicle_Slug"] ?? row.vehicleSlug,
    notes: row["Notas"] ?? row.notes,
    original: row,
  }));

  const media: MatrixMedia[] = (result.media as any[]).map((row) => ({
    sku: row["SKU_Canonico"] ?? row["SKU"] ?? row.sku,
    url: row["URL"] ?? row["Imagem"] ?? row.url,
    type: row["Tipo"] ?? row.type,
    original: row,
  }));

  const seo: MatrixSEO[] = (result.seo as any[]).map((row) => ({
    sku: row["SKU_Canonico"] ?? row["SKU"] ?? row.sku,
    title: row["SEO_Titulo"] ?? row["Titulo"] ?? row.title,
    description: row["SEO_Descricao"] ?? row["Descricao"] ?? row.description,
    keywords: row["SEO_Keywords"] ? String(row["SEO_Keywords"]).split(",") : undefined,
    original: row,
  }));

  const channels: MatrixChannel[] = (result.channels as any[]).map((row) => ({
    sku: row["SKU_Canonico"] ?? row["SKU"] ?? row.sku,
    channel: row["Canal"] ?? row.channel,
    status: row["Status Canal"] ?? row.status,
    original: row,
  }));

  const pendencias: MatrixPendencia[] = (result.pendencias as any[]).map((row) => ({
    sku: row["SKU_Canonico"] ?? row["SKU"] ?? row.sku,
    issue: row["Pendencia"] ?? row["Issue"] ?? row.issue,
    original: row,
  }));

  const cadastroNovo: MatrixCadastroNovo[] = (result.cadastroNovo as any[]).map((row) => ({
    sku: row["SKU_Canonico"] ?? row["SKU"] ?? row.sku,
    data: row,
  }));

  return { products, variations, vehicles, compatibilities, media, seo, channels, pendencias, cadastroNovo };
}
