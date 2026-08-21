import type { StorefrontProduct } from "./catalog";
import type { MarketplaceProductSource } from "./marketplaceImport";
import { addPurchaseExtras } from "@/lib/purchaseBenefits";

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

type SpecificProductSpec = {
  compatibility: string;
  application: string;
  kitContents: string[];
  material: string;
  finish?: string;
  notes?: string[];
};

const SPECIFIC_PRODUCT_SPECS: Record<string, SpecificProductSpec> = {
  MLB5087455577: {
    compatibility: "BYD Song Plus · 2022 a 2026",
    application: "kit de proteção para os acabamentos do interior completo",
    kitContents: [
      "Kit PPF pré-cortado para o interior completo do BYD Song Plus",
      "Peças correspondentes ao molde apresentado nas imagens do anúncio",
    ],
    material: "PPF TPU transparente de aproximadamente 190 micras",
    finish: "Brilhante",
  },
  MLB5087324703: {
    compatibility: "BYD Han · 2023 e 2024",
    application: "kit de proteção para áreas internas e externas",
    kitContents: [
      "Kit PPF pré-cortado para o interior do BYD Han",
      "Kit PPF pré-cortado para as áreas externas indicadas no anúncio",
      "Peças correspondentes ao molde apresentado nas imagens",
    ],
    material: "PPF TPU transparente de aproximadamente 190 micras",
    finish: "Brilhante",
  },
  MLB5081149207: {
    compatibility: "Omoda 5 · tela multimídia",
    application: "proteção da tela multimídia",
    kitContents: [
      "Película PPF pré-cortada para a tela multimídia do Omoda 5",
      "Peça conforme o formato apresentado nas imagens do anúncio",
    ],
    material: "PPF TPU transparente de aproximadamente 190 micras",
    finish: "Transparente",
    notes: [
      "Confirme o formato da tela e a versão do veículo antes da compra.",
    ],
  },
  MLB5064566751: {
    compatibility:
      "BYD Dolphin, Atto 8, Seal ou Sealion 7 · conforme a opção selecionada",
    application: "proteção das conchas das maçanetas",
    kitContents: [
      "Kit de películas PPF para as conchas das maçanetas",
      "Recortes correspondentes ao modelo BYD selecionado no anúncio",
    ],
    material: "PPF TPU transparente de aproximadamente 190 micras",
    finish: "Transparente",
    notes: [
      "Selecione o modelo correto do veículo antes de concluir a compra.",
    ],
  },
  MLB7419561880: {
    compatibility: "GAC GS4 · colunas de porta",
    application: "proteção das colunas de porta",
    kitContents: [
      "Kit PPF pré-cortado para as colunas de porta do GAC GS4",
      "Peças conforme o molde apresentado nas imagens do anúncio",
    ],
    material: "PPF TPU transparente de aproximadamente 190 micras",
    finish: "Transparente",
    notes: [
      "Confirme o ano, a versão e o formato das colunas antes da compra.",
    ],
  },
  MLB7419423688: {
    compatibility: "Toyota Corolla · 2025",
    application: "proteção do console central e do porta-copos",
    kitContents: [
      "Películas PPF pré-cortadas para o console central e o porta-copos",
      "Peças conforme o molde apresentado nas imagens do anúncio",
    ],
    material: "PPF TPU transparente de aproximadamente 190 micras",
    finish: "Transparente",
  },
  MLB7419416694: {
    compatibility: "Toyota Corolla · 2022 a 2025",
    application: "proteção das colunas de porta",
    kitContents: [
      "Kit PPF pré-cortado para as colunas de porta do Toyota Corolla",
      "Peças conforme o molde apresentado nas imagens do anúncio",
    ],
    material: "PPF TPU transparente de aproximadamente 190 micras",
    finish: "Transparente",
  },
  MLB5041595897: {
    compatibility: "Aplicação universal · confira o formato e as medidas",
    application:
      "customização das colunas de porta com acabamento fibra de carbono poroso",
    kitContents: [
      "4 peças de adesivo automotivo com acabamento fibra de carbono poroso",
      "Peças para ajuste conforme as colunas do veículo",
    ],
    material: "Vinil automotivo com acabamento fibra de carbono poroso",
    finish: "Fibra de carbono",
    notes: ["Produto universal; pode exigir ajuste durante a instalação."],
  },
  MLB5041543195: {
    compatibility: "Fiat Argo · confira as medidas das colunas",
    application: "renovação e customização das colunas de porta",
    kitContents: [
      "4 peças de adesivo Blackout Preto Fosco com 13 x 60 cm cada",
    ],
    material: "Vinil automotivo preto fosco",
    finish: "Preto fosco",
    notes: [
      "Confira as medidas antes da compra; ajustes podem ser necessários.",
    ],
  },
  MLB7390376280: {
    compatibility: "Aplicação universal · confira as medidas das colunas",
    application: "renovação e customização das colunas de porta",
    kitContents: ["6 tiras de adesivo automotivo com 13 x 60 cm cada"],
    material: "Vinil automotivo para acabamento de colunas",
    notes: ["Produto universal; o recorte final deve ser ajustado ao veículo."],
  },
  MLB7336094068: {
    compatibility: "BMW X7 · 2024 a 2027",
    application: "kit de proteção para os acabamentos do interior completo",
    kitContents: [
      "Kit PPF pré-cortado para o interior completo da BMW X7",
      "Peças correspondentes ao molde apresentado nas imagens do anúncio",
    ],
    material: "PPF TPU transparente de aproximadamente 190 micras",
    finish: "Transparente",
  },
  MLB7336125478: {
    compatibility: "BMW X7 · 2024 a 2027",
    application: "kit de proteção para áreas internas e externas",
    kitContents: [
      "Kit PPF pré-cortado para o interior da BMW X7",
      "Kit PPF pré-cortado para as áreas externas indicadas no anúncio",
      "Peças correspondentes ao molde apresentado nas imagens",
    ],
    material: "PPF TPU transparente de aproximadamente 190 micras",
    finish: "Transparente",
  },
  MLB4965179573: {
    compatibility: "BMW X1 · 2024 a 2026",
    application: "proteção das áreas externas indicadas no anúncio",
    kitContents: [
      "Kit PPF pré-cortado para as áreas externas da BMW X1",
      "Peças conforme o molde apresentado nas imagens do anúncio",
    ],
    material: "PPF TPU transparente de aproximadamente 190 micras",
    finish: "Transparente",
  },
  MLB7211688304: {
    compatibility: "Audi Q5 · 2025 a 2027",
    application: "proteção da tela multimídia",
    kitContents: [
      "Película PPF pré-cortada para a tela multimídia do Audi Q5",
      "Peça conforme o formato apresentado nas imagens do anúncio",
    ],
    material: "PPF TPU de aproximadamente 190 micras",
    finish: "Brilhante ou fosco, conforme a opção selecionada",
  },
  MLB7182636316: {
    compatibility: "Audi A7 Sportback · 2019 a 2024",
    application: "proteção da tela multimídia",
    kitContents: [
      "Película PPF pré-cortada para a tela multimídia do Audi A7 Sportback",
      "Peça conforme o formato apresentado nas imagens do anúncio",
    ],
    material: "PPF TPU de aproximadamente 190 micras",
    finish: "Brilhante ou fosco, conforme a opção selecionada",
  },
  MLB6971791104: {
    compatibility: "CAOA Chery iCar · 2023",
    application: "kit de proteção para os acabamentos do interior completo",
    kitContents: [
      "Kit PPF pré-cortado para o interior completo do CAOA Chery iCar",
      "Peças correspondentes ao molde apresentado nas imagens do anúncio",
    ],
    material: "PPF TPU transparente de aproximadamente 190 micras",
    finish: "Transparente",
  },
  MLB4759102961: {
    compatibility: "BMW X3 · 2024 a 2026",
    application: "kit de proteção para os acabamentos do interior completo",
    kitContents: [
      "Kit PPF pré-cortado para o interior completo da BMW X3",
      "Peças correspondentes ao molde apresentado nas imagens do anúncio",
    ],
    material: "PPF TPU transparente de aproximadamente 190 micras",
    finish: "Transparente",
  },
};

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
    if (
      aliases.some(
        (alias) => normalized === alias || normalized.startsWith(`${alias} `),
      )
    ) {
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
    if (block.length > 500) continue;
    if (
      normalizedBlock === normalizedTitle ||
      (normalizedBlock.length < 130 &&
        normalizedTitle.includes(normalizedBlock))
    ) {
      continue;
    }
    result.push(block);
    if (result.length >= 4) break;
  }

  return result;
}

function compatibilityLabel(product: StorefrontProduct) {
  const specific = SPECIFIC_PRODUCT_SPECS[product.id];
  if (specific) return specific.compatibility;

  if (product.tags.includes("Universal")) return "Universal";

  const years =
    product.yearStart && product.yearEnd
      ? product.yearStart === product.yearEnd
        ? String(product.yearStart)
        : `${product.yearStart} a ${product.yearEnd}`
      : null;

  return (
    [product.brand, years].filter(Boolean).join(" · ") ||
    "Consulte a compatibilidade"
  );
}

function generatedFullDescription(product: StorefrontProduct) {
  const specific = SPECIFIC_PRODUCT_SPECS[product.id];
  const compatibility = specific?.compatibility ?? compatibilityLabel(product);
  const areas = areaLabels(product);
  const application =
    specific?.application ??
    (areas.length ? areas.join(", ") : "a área indicada no anúncio");
  const contents = addPurchaseExtras(
    product,
    specific?.kitContents ?? fallbackKitContents(product),
  );

  if (product.type === "Black Piano") {
    const notes = specific?.notes ?? [
      "Confira medidas, quantidade e formato das peças antes da compra.",
    ];

    return [
      product.title,
      "",
      `Produto desenvolvido para ${application}, proporcionando um visual renovado e ajudando a preservar a superfície contra marcas e desgaste do uso diário.`,
      "",
      "Benefícios",
      "• Acabamento automotivo moderno e uniforme.",
      "• Ajuda a disfarçar marcas existentes e proteger contra novos atritos leves.",
      "• Superfície de fácil limpeza.",
      "• Aplicação conforme o formato e as medidas informadas no anúncio.",
      "",
      "Compatibilidade",
      compatibility,
      "",
      "Material e acabamento",
      specific?.material ?? "Vinil automotivo",
      ...(specific?.finish ? [`Acabamento: ${specific.finish}.`] : []),
      "",
      "Conteúdo da embalagem",
      ...contents.map((item) => `• ${item}.`),
      "",
      "Instalação",
      "• Aplicação a seco sobre superfície limpa, lisa e completamente desengordurada.",
      "• Posicione e alinhe as peças antes da fixação definitiva.",
      "• Recomendamos instalação profissional para obter o melhor acabamento.",
      "",
      "Informações importantes",
      ...notes.map((item) => `• ${item}`),
      "• Produto enviado sem aplicação.",
      "• Compare o formato das peças com o veículo antes de instalar.",
    ].join("\n");
  }

  const notes = specific?.notes ?? [
    "Confira o formato das peças e a versão do veículo antes da compra.",
  ];

  return [
    product.title,
    "",
    `Película de proteção desenvolvida para ${application}, preservando o acabamento original de ${compatibility} contra riscos superficiais, marcas de uso e pequenos atritos do dia a dia.`,
    "",
    "Benefícios",
    "• PPF TPU transparente de alta qualidade.",
    "• Aproximadamente 190 micras de espessura.",
    "• Tecnologia autorregenerativa para marcas superficiais com a ação do calor.",
    "• Alta transparência sem alterar a aparência original da peça.",
    "• Corte computadorizado compatível com a aplicação anunciada.",
    "",
    "Compatibilidade",
    compatibility,
    "",
    "Material e acabamento",
    specific?.material ?? "PPF TPU transparente de aproximadamente 190 micras",
    ...(specific?.finish ? [`Acabamento: ${specific.finish}.`] : []),
    "",
    "Conteúdo da embalagem",
    ...contents.map((item) => `• ${item}.`),
    "",
    "Instalação",
    "• Aplicação pelo método úmido.",
    "• Cura recomendada entre 24 e 48 horas.",
    "• Evite utilizar estilete diretamente sobre a peça do veículo.",
    "• Recomendamos instalação profissional para obter o melhor acabamento.",
    "",
    "Informações importantes",
    ...notes.map((item) => `• ${item}`),
    "• Produto enviado sem aplicação.",
    "• Compare o formato das peças com as imagens do anúncio antes de instalar.",
  ].join("\n");
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
    new Set(
      product.tags.map((tag) => labels.get(tag)).filter(Boolean) as string[],
    ),
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
  const areaText = areas.length
    ? areas.join(", ")
    : "a aplicação descrita no anúncio";

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

function inferMaterial(
  product: StorefrontProduct,
  source: MarketplaceProductSource | null,
) {
  const content = `${product.title} ${source?.description ?? ""}`;
  if (/alltak/i.test(content)) return "Vinil automotivo Alltak";
  if (
    /black piano|blackout|vinil|pvc/i.test(content) &&
    product.type === "Black Piano"
  ) {
    return "Vinil/PVC automotivo";
  }
  if (/\btpu\b/i.test(content)) return "PPF TPU";
  if (product.type === "PPF") return "PPF";
  return undefined;
}

function inferThickness(
  product: StorefrontProduct,
  source: MarketplaceProductSource | null,
) {
  const content = `${product.title} ${source?.description ?? ""}`;
  const match = content.match(/(\d{2,3})\s*micras?/i);
  return match ? `${match[1]} micras` : undefined;
}

export function buildStorefrontProductDetails(
  product: StorefrontProduct,
  source: MarketplaceProductSource | null,
): StorefrontProductDetails {
  const rawDescription = source?.description?.trim() || null;
  const specific = SPECIFIC_PRODUCT_SPECS[product.id];
  const cleanedDescription = rawDescription
    ? cleanMarketplaceDescription(rawDescription)
    : null;
  const compatibility = compatibilityLabel(product);
  const areas = areaLabels(product);
  const areaText = areas.length
    ? areas.join(", ")
    : "as áreas indicadas neste anúncio";

  const parsedIntro = rawDescription
    ? introParagraphs(rawDescription, product.title)
    : [];
  const parsedBenefits = rawDescription
    ? sectionItems(rawDescription, [
        "beneficios",
        "diferenciais",
        "caracteristicas",
      ])
    : [];
  const parsedKit = rawDescription
    ? sectionItems(rawDescription, [
        "conteudo do kit",
        "conteudo da embalagem",
        "itens inclusos",
        "conteudo",
      ])
    : [];
  const parsedInstallation = rawDescription
    ? sectionItems(rawDescription, ["instalacao"])
    : [];

  const intro = parsedIntro.length
    ? parsedIntro
    : specific
      ? [
          product.type === "Black Piano"
            ? `Solução automotiva para ${specific.application}, indicada para ${specific.compatibility}.`
            : `Proteção em PPF TPU para ${specific.application}, desenvolvida para ${specific.compatibility}.`,
          product.type === "Black Piano"
            ? "O acabamento renova o visual da peça e ajuda a reduzir a aparência de marcas do uso diário."
            : "O material transparente ajuda a preservar a aparência original contra riscos superficiais, marcas e pequenos atritos do uso diário.",
        ]
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
  const baseKitContents = parsedKit.length
    ? parsedKit
    : (specific?.kitContents ?? fallbackKitContents(product));

  return {
    gallery,
    intro,
    benefits: parsedBenefits.length
      ? parsedBenefits
      : fallbackBenefits(product),
    kitContents: addPurchaseExtras(product, baseKitContents),
    installation: parsedInstallation.length
      ? parsedInstallation
      : fallbackInstallation(product),
    compatibility,
    fullDescription: cleanedDescription ?? generatedFullDescription(product),
    material: specific?.material ?? inferMaterial(product, source),
    thickness: inferThickness(product, source),
    warranty: source?.warranty || undefined,
    source: rawDescription ? "marketplace" : "generated",
  };
}
