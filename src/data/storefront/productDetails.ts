export type StorefrontProductDetails = {
  gallery: string[];
  intro: string[];
  benefits: string[];
  kitContents: string[];
  installation: string[];
  compatibility: string;
  material?: string;
  thickness?: string;
  warranty?: string;
};

export const storefrontProductDetails: Record<string, StorefrontProductDetails> = {
  MLB7157871166: {
    gallery: [
      "https://http2.mlstatic.com/D_NQ_NP_776142-MLB113244850062_072026-F.jpg",
      "https://http2.mlstatic.com/D_NQ_NP_643720-MLB114484221093_072026-F.jpg",
      "https://http2.mlstatic.com/D_NQ_NP_686660-MLB114484603355_072026-F.jpg",
      "https://http2.mlstatic.com/D_NQ_NP_880754-MLB113246331148_072026-F.jpg",
      "https://http2.mlstatic.com/D_NQ_NP_961282-MLB114484131735_072026-F.jpg",
      "https://http2.mlstatic.com/D_NQ_NP_909634-MLB113244850080_072026-F.jpg",
    ],
    intro: [
      "Proteção sob medida para multimídia + velocímetro do seu BYD Song Plus 2022 a 2026.",
      "Desenvolvido para preservar as áreas mais utilizadas do veículo contra riscos superficiais, marcas de uso e desgaste diário, mantendo a aparência original das superfícies.",
      "Fabricado em PPF TPU Premium de 190 micras, oferece excelente transparência, toque suave e tecnologia autorregenerativa para micro riscos superficiais quando exposto ao calor.",
      "O kit possui recorte computadorizado sob medida, desenvolvido especificamente para o BYD Song Plus 2022 a 2026.",
    ],
    benefits: [
      "PPF TPU Premium de 190 micras",
      "Alta transparência",
      "Proteção contra riscos superficiais e marcas de uso",
      "Tecnologia autorregenerativa para micro riscos",
      "Mantém o visual original do veículo",
      "Recorte computadorizado sob medida",
      "Aplicação molhada com solução deslizante",
      "Não necessita corte com estilete sobre a peça do veículo",
    ],
    kitContents: [
      "Película PPF TPU para multimídia",
      "Película PPF TPU para velocímetro digital",
      "Espátula para aplicação",
      "Solução deslizante para instalação",
      "Manual de aplicação",
      "Suporte pós-venda",
    ],
    installation: [
      "Produto desenvolvido para aplicação com solução deslizante.",
      "Durante a instalação, a película pode apresentar pequenas marcas de água ou aspecto levemente embaçado. Esse efeito é normal durante o processo de cura.",
      "A cura completa pode levar até 48 horas após a aplicação.",
      "Recomendamos seguir corretamente o manual de instalação enviado com o produto.",
    ],
    compatibility: "BYD Song Plus 2022 a 2026",
    material: "PPF TPU Premium",
    thickness: "190 micras",
    warranty: "Garantia contra defeitos de fabricação",
  },
};
