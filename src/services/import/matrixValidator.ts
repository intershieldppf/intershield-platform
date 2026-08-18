import type {
  MatrixProduct,
  MatrixVariation,
  MatrixVehicle,
  MatrixCompatibility,
  MatrixMedia,
  MatrixSEO,
  MatrixChannel,
  MatrixImportResult,
  MatrixValidationIssue,
} from "@/domain/imports/matrixImportTypes";

export function validateMappedMatrix(mapped: {
  products: MatrixProduct[];
  variations: MatrixVariation[];
  vehicles: MatrixVehicle[];
  compatibilities: MatrixCompatibility[];
  media: MatrixMedia[];
  seo: MatrixSEO[];
  channels: MatrixChannel[];
  pendencias: any[];
  cadastroNovo: any[];
}) {
  const issues: MatrixValidationIssue[] = [];
  const productById = new Map<string, MatrixProduct>();
  const productBySku = new Map<string, MatrixProduct>();

  mapped.products.forEach((p) => {
    if (p.productId) productById.set(String(p.productId), p);
    if (p.sku) productBySku.set(String(p.sku), p);
  });

  // SKU duplicates
  const skuCounts = new Map<string, number>();
  [...mapped.products, ...mapped.variations].forEach((item: any) => {
    const sku = String(item.sku ?? "").trim();
    if (!sku) return;
    skuCounts.set(sku, (skuCounts.get(sku) ?? 0) + 1);
  });

  skuCounts.forEach((count, sku) => {
    if (count > 1) {
      issues.push({ severity: "error", code: "duplicate_sku", message: `SKU duplicado: ${sku}`, rowRef: sku });
    }
  });

  // Validate products
  const validatedProducts = mapped.products.map((p) => {
    const itemIssues: MatrixValidationIssue[] = [];
    const sku = String(p.sku ?? "").trim();

    if (!p.productId) {
      itemIssues.push({ severity: "error", code: "missing_product_id", message: "Produto_ID vazio", rowRef: sku || undefined });
    }

    if (!sku) {
      itemIssues.push({ severity: "error", code: "missing_sku", message: "SKU_Canonico vazio", rowRef: sku || undefined });
    }

    if (p.price === undefined || p.price === null || p.price <= 0) {
      itemIssues.push({ severity: "error", code: "missing_price", message: "Preço vazio ou inválido", rowRef: sku || undefined });
    }

    if (!p.name || String(p.name).trim() === "") {
      itemIssues.push({ severity: "error", code: "missing_name", message: "Produto sem nome", rowRef: sku || undefined });
    }

    if (!p.mainImage) {
      itemIssues.push({ severity: "alert", code: "missing_image", message: "Produto sem imagem", rowRef: sku || undefined });
    }

    // SEO
    const seoForSku = mapped.seo.find((s) => (s.sku ?? "") === sku);
    if (!seoForSku) {
      itemIssues.push({ severity: "alert", code: "missing_seo", message: "Produto sem SEO", rowRef: sku || undefined });
    }

    // compatibility
    const hasCompatibility = mapped.compatibilities.some((c) => (c.productSku ?? "") === sku || (c.productSku ?? "") === String(p.productId));
    if (!hasCompatibility) {
      itemIssues.push({ severity: "alert", code: "missing_compatibility", message: "Produto sem compatibilidade específica", rowRef: sku || undefined });
    }

    // generated sku marker
    if (sku.includes("GERADO")) {
      itemIssues.push({ severity: "alert", code: "sku_generated", message: "SKU marcado GERADO - REVISAR", rowRef: sku });
    }

    return { product: p, issues: itemIssues };
  });

  // Validate variations parent product existence
  mapped.variations.forEach((v) => {
    const parent = v.parentSku ? (productById.get(String(v.parentSku)) ?? productBySku.get(String(v.parentSku))) : undefined;
    const sku = String(v.sku ?? "").trim();
    if (!parent) {
      issues.push({ severity: "error", code: "variation_parent_missing", message: `Produto_ID da variação inexistente: ${v.parentSku}`, rowRef: sku || undefined });
    }
    if (!sku) {
      issues.push({ severity: "error", code: "missing_sku_variation", message: "SKU_Canonico vazio na variação", rowRef: undefined });
    }
  });

  // Media/SEO/Channel referential checks
  mapped.media.forEach((m) => {
    const sku = String(m.sku ?? "").trim();
    if (m.original && (m.original["Produto_ID"] || m.original["ID do Produto"])) {
      const prodId = String(m.original["Produto_ID"] ?? m.original["ID do Produto"] ?? "").trim();
      if (prodId && !productById.has(prodId)) {
        issues.push({ severity: "error", code: "media_product_missing", message: `Produto_ID de mídia inexistente: ${prodId}`, rowRef: sku || prodId });
      }
    } else if (sku && !productBySku.has(sku)) {
      issues.push({ severity: "error", code: "media_sku_missing", message: `Mídia referencia SKU inexistente: ${sku}`, rowRef: sku });
    }
  });

  mapped.seo.forEach((s) => {
    const sku = String(s.sku ?? "").trim();
    if (s.original && (s.original["Produto_ID"] || s.original["ID do Produto"])) {
      const prodId = String(s.original["Produto_ID"] ?? s.original["ID do Produto"] ?? "").trim();
      if (prodId && !productById.has(prodId)) {
        issues.push({ severity: "error", code: "seo_product_missing", message: `Produto_ID de SEO inexistente: ${prodId}`, rowRef: sku || prodId });
      }
    } else if (sku && !productBySku.has(sku)) {
      issues.push({ severity: "error", code: "seo_sku_missing", message: `SEO referencia SKU inexistente: ${sku}`, rowRef: sku });
    }
  });

  mapped.channels.forEach((c) => {
    const sku = String(c.sku ?? "").trim();
    if (c.original && (c.original["Produto_ID"] || c.original["ID do Produto"])) {
      const prodId = String(c.original["Produto_ID"] ?? c.original["ID do Produto"] ?? "").trim();
      if (prodId && !productById.has(prodId)) {
        issues.push({ severity: "error", code: "channel_product_missing", message: `Produto_ID de canal inexistente: ${prodId}`, rowRef: sku || prodId });
      }
    } else if (sku && !productBySku.has(sku)) {
      issues.push({ severity: "error", code: "channel_sku_missing", message: `Canal referencia SKU inexistente: ${sku}`, rowRef: sku });
    }
  });

  // Compatibilities vehicle check
  const vehicleSlugs = new Set(mapped.vehicles.map((v) => String(v.vehicleId ?? v.slug ?? "").trim()).filter(Boolean));
  mapped.compatibilities.forEach((c) => {
    const vs = String(c.vehicleSlug ?? "").trim();
    if (vs && !vehicleSlugs.has(vs)) {
      issues.push({ severity: "error", code: "compatibility_vehicle_missing", message: `Veiculo_ID de compatibilidade inexistente: ${vs}`, rowRef: c.productSku ?? undefined });
    }
  });

  // Collect product-level issues into global issues
  validatedProducts.forEach((vp) => {
    vp.issues.forEach((iss) => issues.push(iss));
  });

  return {
    issues,
    validatedProducts,
  };
}
