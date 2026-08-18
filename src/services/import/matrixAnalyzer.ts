import type { MatrixImportResult, MatrixAnalysis } from "@/domain/imports/matrixImportTypes";

export function analyzeMappedMatrix(result: MatrixImportResult, validation: { issues: any[]; validatedProducts: any[] }): MatrixAnalysis {
  const sheets = [
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

  const sheetSummaries = sheets.map((name) => ({
    name,
    found: (result as any)[nameToKey(name)] !== undefined,
    rows: ((result as any)[nameToKey(name)] || []).length,
  }));

  const totals = {
    products: result.products.length,
    variations: result.variations.length,
    vehicles: result.vehicles.length,
    compatibilities: result.compatibilities.length,
    media: result.media.length,
    seo: result.seo.length,
    channels: result.channels.length,
    pendencias: result.pendencias.length,
  };

  const productBySku = new Map<string, any>();
  const productById = new Map<string, any>();
  result.products.forEach((product) => {
    if (product.sku) productBySku.set(product.sku, product);
    if (product.productId) productById.set(product.productId, product);
  });

  const seoBySku = new Map(result.seo.map((item) => [item.sku, item]));
  const mediaBySku = result.media.reduce((map, item) => {
    if (!item.sku) return map;
    const list = map.get(item.sku) ?? [];
    list.push(item);
    map.set(item.sku, list);
    return map;
  }, new Map<string, any[]>());
  const channelsBySku = result.channels.reduce((map, item) => {
    if (!item.sku) return map;
    const list = map.get(item.sku) ?? [];
    list.push(item);
    map.set(item.sku, list);
    return map;
  }, new Map<string, any[]>());
  const pendenciasBySku = result.pendencias.reduce((map, item) => {
    if (!item.sku) return map;
    const list = map.get(item.sku) ?? [];
    list.push(item);
    map.set(item.sku, list);
    return map;
  }, new Map<string, any[]>());
  const compatBySku = result.compatibilities.reduce((map, item) => {
    if (!item.productSku) return map;
    const list = map.get(item.productSku) ?? [];
    list.push(item);
    map.set(item.productSku, list);
    return map;
  }, new Map<string, any[]>());
  const vehicleBySlug = new Map(result.vehicles.map((item) => [item.slug, item]));

  const productStatusCounts = { ok: 0, review: 0, blocked: 0 };
  validation.validatedProducts.forEach((vp: any) => {
    const hasError = vp.issues.some((i: any) => i.severity === "error");
    const hasAlert = vp.issues.some((i: any) => i.severity === "alert");
    if (hasError) productStatusCounts.blocked++;
    else if (hasAlert) productStatusCounts.review++;
    else productStatusCounts.ok++;
  });

  const skuSet = new Set<string>();
  let generated = 0;
  const skuCounts: Record<string, number> = {};
  [...result.products, ...result.variations].forEach((item: any) => {
    const sku = String(item.sku ?? "").trim();
    if (!sku) return;
    skuSet.add(sku);
    skuCounts[sku] = (skuCounts[sku] || 0) + 1;
    if (sku.includes("GERADO")) generated++;
  });
  const duplicates = Object.values(skuCounts).filter((count) => count > 1).length;

  const skuSummary = { originals: skuSet.size - generated, generated, duplicates };

  const statusSummary = { active: 0, draft: 0, inactive: 0, archived: 0 };
  result.products.forEach((product) => {
    const status = String(product.status ?? "").toLowerCase();
    if (status.includes("active")) statusSummary.active++;
    else if (status.includes("draft")) statusSummary.draft++;
    else if (status.includes("archiv")) statusSummary.archived++;
    else if (status.includes("inactiv") || status.includes("inactive")) statusSummary.inactive++;
  });

  const previewVariations = result.variations.slice(0, 50).map((variation) => {
    const parent = variation.parentSku ? productBySku.get(variation.parentSku) ?? productById.get(variation.parentSku) : undefined;
    const sku = variation.sku;
    const product = parent;
    const seo = sku ? seoBySku.get(sku) : undefined;
    const media = sku ? mediaBySku.get(sku) ?? [] : [];
    const channels = sku ? channelsBySku.get(sku) ?? [] : [];
    const compatibilities = sku ? compatBySku.get(sku) ?? [] : [];
    const vehicles = compatibilities
      .map((item) => vehicleBySlug.get(item.vehicleSlug))
      .filter((vehicle): vehicle is NonNullable<typeof vehicle> => Boolean(vehicle));
    const pendencias = sku ? pendenciasBySku.get(sku) ?? [] : [];

    const productValidation = parent ? validation.validatedProducts.find((vp: any) => vp.product.sku === parent.sku || vp.product.productId === parent.productId) : undefined;
    const hasError = productValidation?.issues.some((issue: any) => issue.severity === "error");
    const hasAlert = productValidation?.issues.some((issue: any) => issue.severity === "alert");

    return {
      sku,
      parentSku: variation.parentSku,
      productName: product?.name ?? "Não localizado",
      productId: product?.productId,
      optionName: variation.optionName,
      optionValue: variation.optionValue,
      price: variation.price,
      quantity: variation.quantity,
      marketplaces: channels.map((item) => item.channel),
      mediaCount: media.length,
      seoTitle: seo?.title || "-",
      compatibilityCount: compatibilities.length,
      vehicles: vehicles.map((vehicle) => `${vehicle.brand || ""} ${vehicle.model || ""}`.trim()).filter(Boolean),
      pendencias: pendencias.map((item) => item.issue).filter(Boolean),
      status: hasError ? "BLOQUEADO" : hasAlert ? "REVISAR" : "OK",
    };
  });

  const analysis: MatrixAnalysis = {
    fileName: result.metadata.name,
    analyzedAt: new Date().toISOString(),
    sheets: sheetSummaries,
    totals,
    statusCounts: {
      ok: productStatusCounts.ok,
      review: productStatusCounts.review,
      blocked: productStatusCounts.blocked,
    },
    skuSummary,
    productStatusSummary: statusSummary,
    issues: validation.issues,
    previewVariations,
  };

  return analysis;
}

function nameToKey(name: string) {
  switch (name) {
    case "Produtos_Mestre":
      return "products";
    case "Variacoes_SKU":
      return "variations";
    case "Veiculos_Mestre":
      return "vehicles";
    case "Compatibilidades":
      return "compatibilities";
    case "Midias":
      return "media";
    case "SEO":
      return "seo";
    case "Canais":
      return "channels";
    case "Pendencias":
      return "pendencias";
    case "Cadastro_Novo":
      return "cadastroNovo";
    default:
      return "";
  }
}
