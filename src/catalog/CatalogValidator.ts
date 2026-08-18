import {
  CatalogSheetSummary,
  CatalogValidationIssue,
  CatalogValidationItem,
  CatalogValidationResult,
  CatalogValidationItemStatus,
  InterShieldCatalog,
  CatalogProduct,
  CatalogVariant,
  CatalogVehicle,
  CatalogCompatibility,
  CatalogMedia,
  CatalogSeo,
  CatalogChannel,
} from "./catalogTypes";

const requiredSheets: CatalogSheetSummary["name"][] = [
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

function buildIssue(
  severity: CatalogValidationIssue["severity"],
  code: string,
  message: string,
  sheet?: CatalogSheetSummary["name"] | "product" | "variant",
  rowRef?: string
): CatalogValidationIssue {
  return { severity, code, message, sheet, rowRef };
}

function deriveStatus(issues: CatalogValidationIssue[]): CatalogValidationItemStatus {
  if (issues.some((issue) => issue.severity === "error")) {
    return "BLOQUEADO";
  }
  if (issues.some((issue) => issue.severity === "alert")) {
    return "REVISAR";
  }
  return "OK";
}

export function validateCatalog(
  catalog: InterShieldCatalog,
  sheetSummaries: CatalogSheetSummary[]
): CatalogValidationResult {
  const issues: CatalogValidationIssue[] = [];
  const productIdCount = new Map<string, number>();
  const variationIdCount = new Map<string, number>();
  const skuCount = new Map<string, number>();
  const vehicleIdCount = new Map<string, number>();

  const productById = new Map<string, CatalogProduct>();
  const productBySku = new Map<string, CatalogProduct>();
  const vehicleById = new Map<string, CatalogVehicle>();

  catalog.products.forEach((product) => {
    if (product.productId) {
      productIdCount.set(product.productId, (productIdCount.get(product.productId) ?? 0) + 1);
      productById.set(product.productId, product);
    }
    if (product.sku) {
      skuCount.set(product.sku, (skuCount.get(product.sku) ?? 0) + 1);
      productBySku.set(product.sku, product);
    }
  });

  catalog.variants.forEach((variant) => {
    if (variant.variationId) {
      variationIdCount.set(variant.variationId, (variationIdCount.get(variant.variationId) ?? 0) + 1);
    }
    if (variant.sku) {
      skuCount.set(variant.sku, (skuCount.get(variant.sku) ?? 0) + 1);
    }
  });

  catalog.vehicles.forEach((vehicle) => {
    if (vehicle.vehicleId) {
      vehicleIdCount.set(vehicle.vehicleId, (vehicleIdCount.get(vehicle.vehicleId) ?? 0) + 1);
      vehicleById.set(vehicle.vehicleId, vehicle);
    }
  });

  requiredSheets.forEach((sheetName) => {
    const sheet = sheetSummaries.find((item) => item.name === sheetName);
    if (!sheet?.found) {
      issues.push(buildIssue("error", "missing_sheet", `Aba obrigatória ausente: ${sheetName}`, sheetName));
    }
  });

  skuCount.forEach((count, sku) => {
    if (count > 1) {
      issues.push(buildIssue("error", "duplicate_sku", `SKU_Canonico duplicado: ${sku}`, "Produtos_Mestre", sku));
    }
  });

  productIdCount.forEach((count, productId) => {
    if (count > 1) {
      issues.push(buildIssue("error", "duplicate_product_id", `Produto_ID duplicado: ${productId}`, "Produtos_Mestre", productId));
    }
  });

  variationIdCount.forEach((count, variationId) => {
    if (count > 1) {
      issues.push(buildIssue("error", "duplicate_variation_id", `Variacao_ID duplicado: ${variationId}`, "Variacoes_SKU", variationId));
    }
  });

  vehicleIdCount.forEach((count, vehicleId) => {
    if (count > 1) {
      issues.push(buildIssue("error", "duplicate_vehicle_id", `Veiculo_ID duplicado: ${vehicleId}`, "Veiculos_Mestre", vehicleId));
    }
  });

  const mediaByProductId = new Map<string, CatalogMedia[]>();
  catalog.media.forEach((item) => {
    const productId = item.productId ?? productBySku.get(item.sku ?? "")?.productId;
    if (productId) {
      mediaByProductId.set(productId, [...(mediaByProductId.get(productId) ?? []), item]);
    }
  });

  const seoByProductId = new Map<string, CatalogSeo[]>();
  catalog.seo.forEach((item) => {
    const productId = item.productId ?? productBySku.get(item.sku ?? "")?.productId;
    if (productId) {
      seoByProductId.set(productId, [...(seoByProductId.get(productId) ?? []), item]);
    }
  });

  const channelsByProductId = new Map<string, CatalogChannel[]>();
  catalog.channels.forEach((item) => {
    const productId = item.productId ?? productBySku.get(item.sku ?? "")?.productId;
    if (productId) {
      channelsByProductId.set(productId, [...(channelsByProductId.get(productId) ?? []), item]);
    }
  });

  const compatByProductId = new Map<string, CatalogCompatibility[]>();
  catalog.compatibilities.forEach((item) => {
    const productId = item.productId ?? productBySku.get(item.sku ?? "")?.productId;
    if (productId) {
      compatByProductId.set(productId, [...(compatByProductId.get(productId) ?? []), item]);
    }
  });

  const compatByVehicleId = new Map<string, CatalogCompatibility[]>();
  catalog.compatibilities.forEach((item) => {
    if (item.vehicleId) {
      compatByVehicleId.set(item.vehicleId, [...(compatByVehicleId.get(item.vehicleId) ?? []), item]);
    }
  });

  const pendingByProductId = new Map<string, string[]>();
  catalog.pendingIssues.forEach((item) => {
    const productId = item.productId ?? productBySku.get(item.sku ?? "")?.productId;
    if (productId) {
      pendingByProductId.set(productId, [...(pendingByProductId.get(productId) ?? []), item.issue ?? ""]);
    }
  });

  const productStates: CatalogValidationItem[] = catalog.products.map((product) => {
    const productIssues: CatalogValidationIssue[] = [];
    const hasMedia = mediaByProductId.has(product.productId);
    const hasSeo = seoByProductId.has(product.productId);
    const hasCompat = compatByProductId.has(product.productId);
    const canonicalSku = product.sku?.trim() ?? "";

    if (!product.productId) {
      productIssues.push(buildIssue("error", "missing_product_id", "Produto_ID vazio", "Produtos_Mestre", product.sku));
    }
    if (!canonicalSku) {
      productIssues.push(buildIssue("error", "missing_sku", "SKU_Canonico vazio", "Produtos_Mestre", product.productId));
    }
    if (product.price === null || product.price <= 0) {
      productIssues.push(buildIssue("error", "invalid_price", "Preço menor ou igual a zero", "Produtos_Mestre", product.sku));
    }
    if (!product.name) {
      productIssues.push(buildIssue("error", "missing_name", "Produto sem nome oficial", "Produtos_Mestre", product.sku));
    }
    if (!hasCompat && product.universal !== true) {
      productIssues.push(buildIssue("alert", "missing_compatibility", "Produto sem compatibilidade e não universal", "Produtos_Mestre", product.sku));
    }
    if (!hasMedia) {
      productIssues.push(buildIssue("alert", "missing_media", "Produto sem mídia", "Midias", product.sku));
    }
    if (!hasSeo) {
      productIssues.push(buildIssue("alert", "missing_seo", "Produto sem SEO", "SEO", product.sku));
    }
    if (product.status && /GERADO\s*-\s*REVISAR/i.test(product.status)) {
      productIssues.push(buildIssue("alert", "sku_generated", "SKU marcado GERADO - REVISAR", "Produtos_Mestre", product.sku));
    }
    if (product.status && /(revis|bloquead|bloqueio|blocked|review)/i.test(product.status)) {
      productIssues.push(buildIssue("alert", "product_status_review", "Produto em revisão ou bloqueado", "Produtos_Mestre", product.sku));
    }
    if (!product.shortDescription && !product.fullDescription) {
      productIssues.push(buildIssue("alert", "missing_description", "Descrição vazia", "Produtos_Mestre", product.sku));
    }

    productIssues.forEach((issue) => issues.push(issue));

    return {
      id: product.productId || product.sku,
      sku: product.sku,
      sheet: "product",
      status: deriveStatus(productIssues),
      issues: productIssues,
    };
  });

  const variantStates: CatalogValidationItem[] = catalog.variants.map((variant) => {
    const variantIssues: CatalogValidationIssue[] = [];
    const product = productById.get(variant.productId) ?? productBySku.get(variant.sku ?? "");
    const canonicalSku = variant.sku?.trim() ?? "";

    if (!variant.variationId) {
      variantIssues.push(buildIssue("error", "missing_variation_id", "Variacao_ID vazio", "Variacoes_SKU", variant.sku));
    }
    if (!canonicalSku) {
      variantIssues.push(buildIssue("error", "missing_sku", "SKU_Canonico vazio na variação", "Variacoes_SKU", variant.variationId));
    }
    if (variant.price === null || variant.price <= 0) {
      variantIssues.push(buildIssue("error", "invalid_price", "Preço da variação menor ou igual a zero", "Variacoes_SKU", variant.sku));
    }
    if (!product) {
      variantIssues.push(buildIssue("error", "missing_parent_product", "Variação apontando para Produto_ID inexistente", "Variacoes_SKU", variant.productId));
    }

    variantIssues.forEach((issue) => issues.push(issue));

    return {
      id: variant.variationId || variant.sku,
      sku: variant.sku,
      sheet: "variant",
      status: deriveStatus(variantIssues),
      issues: variantIssues,
    };
  });

  catalog.compatibilities.forEach((compatibility) => {
    const compatibilityIssues: CatalogValidationIssue[] = [];
    const productId = compatibility.productId ?? productBySku.get(compatibility.sku ?? "")?.productId;
    const vehicleId = compatibility.vehicleId;
    const vehicleSlug = compatibility.vehicleSlug;

    if (!productId) {
      compatibilityIssues.push(buildIssue("error", "missing_compatibility_product", "Compatibilidade sem Produto_ID ou SKU", "Compatibilidades", compatibility.sku ?? undefined));
    } else if (!productById.has(productId)) {
      compatibilityIssues.push(buildIssue("error", "compatibility_product_missing", "Compatibilidade apontando para Produto_ID inexistente", "Compatibilidades", productId));
    }

    if (vehicleId && !vehicleById.has(vehicleId)) {
      compatibilityIssues.push(buildIssue("error", "compatibility_vehicle_missing", "Compatibilidade apontando para Veiculo_ID inexistente", "Compatibilidades", vehicleId));
    }

    if (!vehicleId && vehicleSlug) {
      const vehicleFound = Array.from(vehicleById.values()).some((vehicle) => vehicle.slug === vehicleSlug);
      if (!vehicleFound) {
        compatibilityIssues.push(buildIssue("error", "compatibility_vehicle_missing", "Compatibilidade apontando para veículo inexistente", "Compatibilidades", vehicleSlug));
      }
    }

    compatibilityIssues.forEach((issue) => issues.push(issue));
  });

  catalog.media.forEach((item) => {
    const productId = item.productId ?? productBySku.get(item.sku ?? "")?.productId;
    if (!productId || !productById.has(productId)) {
      issues.push(buildIssue("error", "media_product_missing", "Mídia apontando para Produto_ID inexistente", "Midias", item.sku ?? item.productId ?? undefined));
    }
  });

  catalog.seo.forEach((item) => {
    const productId = item.productId ?? productBySku.get(item.sku ?? "")?.productId;
    if (!productId || !productById.has(productId)) {
      issues.push(buildIssue("error", "seo_product_missing", "SEO apontando para Produto_ID inexistente", "SEO", item.sku ?? item.productId ?? undefined));
    }
  });

  catalog.channels.forEach((item) => {
    const productId = item.productId ?? productBySku.get(item.sku ?? "")?.productId;
    if (!productId || !productById.has(productId)) {
      issues.push(buildIssue("error", "channel_product_missing", "Canal apontando para Produto_ID inexistente", "Canais", item.sku ?? item.productId ?? undefined));
    }
  });

  catalog.vehicles.forEach((vehicle) => {
    if (!vehicle.vehicleId) {
      issues.push(buildIssue("error", "missing_vehicle_id", "Veiculo_ID vazio", "Veiculos_Mestre", vehicle.slug ?? undefined));
    }
    if (vehicle.yearStart === null && vehicle.yearEnd === null && vehicle.universal !== true) {
      issues.push(buildIssue("alert", "missing_vehicle_year_range", "Veículo sem faixa de anos e não universal", "Veiculos_Mestre", vehicle.vehicleId));
    }
  });

  return {
    issues,
    productStates,
    variantStates,
  };
}
