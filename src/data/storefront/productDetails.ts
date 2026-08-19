import type { StorefrontProduct } from "./catalog";
import type { MarketplaceProductSource } from "./marketplaceImport";

export type StorefrontProductDetails = {
  gallery: string[];
  intro: string[];
  benefits: string[];
  kitContents: string[];
  installation: string[];
  compatibility: string;
  fullDescription: string | null;
  material?: string;
  thickness?: string;
  warranty?: string;
  source: "marketplace" | "generated";
};

const HEADING_ALIASES = [
  "beneficios",
  "diferenciais",
  "caracteristicas",
  "conteudo do kit",
  "conteudo da embalagem",
  "itens inclusos",
  "instalacao",
  "compatibilidade",
  "acabamentos",
  "acabamentos disponiveis",
  "area protegida",
  "areas protegidas",
  "observacoes",
  "informacoes importantes",
  "importante",
  "suporte",
  "garantia",
  "o que e ppf",
  "o que e ppf tpu",
];

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function cleanLine(value: string) {
  return value
    .replace(/^\s*#{1,6}\s*/, "")
    .replace(/\*\*/g, "")
    .replace(/^\s*[-*•]\s*/, "")
    .trim();
}

export function cleanMarketplaceDescription(value: string) {
  return value
    .replace(/\r\n/g, "\n")
    .replace(/\*\*/g, "")
    .replace(/^\s*#{1,6}\s*/gm, "")
    .replace(/^\s*-{3,}\s*$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function isKnownHeading(value: string) {
  const normalized = normalizeText(cleanLine(value));
  return HEADING_ALIASES.some(
    (heading) => normalized === heading || normalized.startsWith(`${heading} `),
  );
}

function sectionItems(description: string, aliases: string[]) {
  const lines = description.split(/\r?\n/);
  let start = -1;

  for (let index = 0; index < lines.length; index += 1) {
    const normalized = normalizeText(cleanLine(lines[index]));
    if (aliases.some((alias) => normalized === alias || normalized.startsWith(`${alias} `))) {
      start = index + 1;
      break;
    }
  }

  if (start < 0) return [];

  const items: string[] = [];
  for (let index = start; index < lines.length; index += 1) {
    const raw = lines[index].trim();
    if (!raw) continue;
    if (isKnownHeading(raw)) break;

    const item = cleanLine(raw);
    if (!item || item.length > 260) continue;
    items.push(item);
  }

  return Array.from(new Set(items)).slice(0, 12);
}

function introParagraphs(description: string, productTitle: string) {
  const cleaned = cleanMarketplaceDescription(description);
  const blocks = cleaned
    .split(/\n\s*\n/)
    .map((block) => block.replace(/\n+/g, " ").trim())
    .filter(Boolean);

  const normalizedTitle = normalizeText(productTitle);
  const result: string[] = [];

  for (const block of blocks) {
    if (isKnownHeading(block)) break;
    const normalizedBlock = normalizeText(block);
    if (!normalizedBlock) continue;
    if (
      normalizedBlock === normalizedTitle ||
      (normalizedBlock.length < 130 && normalizedTitle.includes(normalizedBlock))
    ) {
      continue;
    }
    result.push(block);
    if (result.length >= 4) break;
  }

  return result;
}

function compatibilityLabel(product: StorefrontProduct) {
  if (product.tags.includes("Universal")) return "Universal";

  const years =
    product.yearStart && product.yearEnd
      ? product.yearStart === product.yearEnd
        ? String(product.yearStart)
        : `${product.yearStart} a ${product.yearEnd}`
      : null;

  return [product.brand, years].filter(Boolean).join(" · ") || "Consulte a compatibilidade";
}

function areaLabels(product: StorefrontProduct) {
  const labels = new Map<string, string>([
    ["Interior", "acabamentos internos"],
    ["Exterior", "áreas externas"],
    ["Multimídia", "tela multimídia"],
    ["Tela", "telas"],
    ["Colunas", "colunas de porta"],
    ["Conchas", "conchas das maçanetas"],
    ["Portas", "áreas das portas"],
    ["Painel", "painel/velocímetro"],
    ["Universal", "áreas compatíveis do veículo"],
  ]);

  return Array.from(
    new Set(product.tags.map((tag) => labels.get(tag)).filter(Boolean) as string[]),
  );
}

function fallbackBenefits(product: StorefrontProduct) {
  if (product.type === "Black Piano") {
    return [
      "Renova e valoriza o acabamento visual das peças",
      "Acabamento automotivo de fácil limpeza",
      "Ajuda a proteger a superfície contra marcas e desgaste do uso diário",
      "Aplicação seguindo o formato e a configuração anunciados",
    ];
  }

  return [
    "Ajuda a proteger contra riscos superficiais e marcas de uso",
    "Preserva a aparência original das superfícies protegidas",
    "Acabamento transparente e discreto",
    "Recorte compatível com a aplicação anunciada",
  ];
}

function fallbackKitContents(product: StorefrontProduct) {
  const areas = areaLabels(product);
  const areaText = areas.length ? areas.join(", ") : "a aplicação descrita no anúncio";

  return [
    product.type === "Black Piano"
      ? `Adesivo automotivo para ${areaText}`
      : `Película de proteção para ${areaText}`,
    "Quantidade e formato das peças conforme a configuração do anúncio",
  ];
}

function fallbackInstallation(product: StorefrontProduct) {
  if (product.type === "Black Piano") {
    return [
      "Limpe e desengordure completamente a superfície antes da aplicação.",
      "Posicione cada peça e confirme o alinhamento antes de pressionar definitivamente.",
      "Aplique o adesivo de forma progressiva, evitando poeira e dobras durante o processo.",
      "Em curvas leves, calor moderado pode auxiliar na conformação quando indicado para o material.",
    ];
  }

  return [
    "Limpe e desengordure completamente a superfície antes da aplicação.",
    "Posicione o recorte e confirme o encaixe antes da aplicação definitiva.",
    "Siga o método de aplicação indicado no kit e evite utilizar estilete diretamente sobre a peça do veículo.",
    "Após a instalação, respeite o período de acomodação e cura do material antes de manipular as bordas.",
  ];
}

function inferMaterial(product: StorefrontProduct, source: MarketplaceProductSource | null) {
  const content = `${product.title} ${source?.description ?? ""}`;
  if (/alltak/i.test(content)) return "Vinil automotivo Alltak";
  if (/black piano|blackout|vinil|pvc/i.test(content) && product.type === "Black Piano") {
    return "Vinil/PVC automotivo";
  }
  if (/\btpu\b/i.test(content)) return "PPF TPU";
  if (product.type === "PPF") return "PPF";
  return undefined;
}

function inferThickness(product: StorefrontProduct, source: MarketplaceProductSource | null) {
  const content = `${product.title} ${source?.description ?? ""}`;
  const match = content.match(/(\d{2,3})\s*micras?/i);
  return match ? `${match[1]} micras` : undefined;
}

export function buildStorefrontProductDetails(
  product: StorefrontProduct,
  source: MarketplaceProductSource | null,
): StorefrontProductDetails {
  const rawDescription = source?.description?.trim() || null;
  const cleanedDescription = rawDescription ? cleanMarketplaceDescription(rawDescription) : null;
  const compatibility = compatibilityLabel(product);
  const areas = areaLabels(product);
  const areaText = areas.length ? areas.join(", ") : "as áreas indicadas neste anúncio";

  const parsedIntro = rawDescription ? introParagraphs(rawDescription, product.title) : [];
  const parsedBenefits = rawDescription
    ? sectionItems(rawDescription, ["beneficios", "diferenciais", "caracteristicas"])
    : [];
  const parsedKit = rawDescription
    ? sectionItems(rawDescription, ["conteudo do kit", "conteudo da embalagem", "itens inclusos", "conteudo"])
    : [];
  const parsedInstallation = rawDescription
    ? sectionItems(rawDescription, ["instalacao"])
    : [];

  const intro = parsedIntro.length
    ? parsedIntro
    : [
        product.type === "Black Piano"
          ? `Solução de acabamento automotivo para ${compatibility}, desenvolvida para ${areaText}.`
          : `Proteção desenvolvida para ${compatibility}, com aplicação em ${areaText}.`,
        product.type === "Black Piano"
          ? "O produto segue a configuração anunciada e ajuda a renovar e preservar o visual das superfícies no uso diário."
          : "A película ajuda a preservar as superfícies contra riscos superficiais, marcas de uso e desgaste cotidiano, mantendo o visual original do veículo.",
      ];

  const gallery = Array.from(
    new Set([...(source?.images ?? []), product.image].filter(Boolean)),
  );

  return {
    gallery,
    intro,
    benefits: parsedBenefits.length ? parsedBenefits : fallbackBenefits(product),
    kitContents: parsedKit.length ? parsedKit : fallbackKitContents(product),
    installation: parsedInstallation.length ? parsedInstallation : fallbackInstallation(product),
    compatibility,
    fullDescription: cleanedDescription,
    material: inferMaterial(product, source),
    thickness: inferThickness(product, source),
    warranty: source?.warranty || undefined,
    source: rawDescription ? "marketplace" : "generated",
  };
}
