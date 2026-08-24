type ProductPurchaseSummary = {
  title: string;
  type: "PPF" | "Black Piano";
};

export type PurchaseBenefitKind = "ppf-kit" | "adhesive-gift";

const STANDARD_GALLERY_IMAGES: Record<PurchaseBenefitKind, string> = {
  "ppf-kit": "/kit-ppf-completo-intershield.webp",
  "adhesive-gift": "/kit-adesivo-espatula-intershield.webp",
};

export const PPF_APPLICATION_EXTRAS = [
  "Solução deslizante para auxiliar na aplicação",
  "Espátula de aplicação",
  "Manual ilustrado de instalação",
  "Suporte especializado da InterShield",
] as const;

export const ADHESIVE_APPLICATION_EXTRAS = [
  "Espátula de aplicação enviada como brinde",
] as const;

export function getPurchaseBenefitKind(
  product: ProductPurchaseSummary,
): PurchaseBenefitKind {
  const title = product.title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (product.type === "PPF" || /\b(ppf|tpu)\b/.test(title)) {
    return "ppf-kit";
  }

  return "adhesive-gift";
}

export function addStandardBenefitImage(
  product: ProductPurchaseSummary,
  images: string[],
) {
  const standardImage = STANDARD_GALLERY_IMAGES[getPurchaseBenefitKind(product)];
  const uniqueImages = Array.from(
    new Set(images.filter((image) => image && image !== standardImage)),
  );

  if (uniqueImages.length === 0) {
    return [standardImage];
  }

  return [uniqueImages[0], standardImage, ...uniqueImages.slice(1)];
}

function hasEquivalentItem(items: string[], extra: string) {
  const normalizedItems = items.map((item) =>
    item
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase(),
  );

  const matcher = extra.startsWith("Solução")
    ? /solucao deslizante|\bslip\b/
    : extra.startsWith("Espátula")
      ? /espatula/
      : extra.startsWith("Manual")
        ? /manual/
        : /suporte/;

  return normalizedItems.some((item) => matcher.test(item));
}

export function addPurchaseExtras(
  product: ProductPurchaseSummary,
  items: string[],
) {
  const extras =
    getPurchaseBenefitKind(product) === "ppf-kit"
      ? PPF_APPLICATION_EXTRAS
      : ADHESIVE_APPLICATION_EXTRAS;

  return [
    ...items,
    ...extras.filter((extra) => !hasEquivalentItem(items, extra)),
  ];
}
