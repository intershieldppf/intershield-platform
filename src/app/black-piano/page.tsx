import Image from "next/image";
import type { Metadata } from "next";

import { Header } from "@/components/layout/Header";
import { VehicleBar } from "@/components/search/VehicleBar";

export const metadata: Metadata = {
  title: "Acabamentos para Colunas | InterShield Películas",
  description:
    "Conheça os acabamentos Black Piano, Preto Fosco Poroso e Fibra de Carbono 4D para colunas automotivas, produzidos com corte computadorizado.",
};

const finishes = [
  {
    number: "01",
    eyebrow: "Brilho intenso",
    title: "Black Piano",
    headline: "Brilho profundo para renovar o acabamento original",
    description:
      "O Black Piano cria uma superfície preta, lisa e brilhante, indicada para renovar colunas que perderam o brilho ou para transformar peças com acabamento simples. O resultado é um visual elegante, uniforme e integrado às linhas do veículo.",
    image: "/black-piano-card-gloss.webp",
    alt: "Colunas automotivas com acabamento Black Piano brilhante",
    points: [
      "Aparência lisa, profunda e brilhante",
      "Renova o visual sem substituir a peça",
      "Combina com detalhes externos e internos",
    ],
    note:
      "Por ter alto brilho, pode evidenciar poeira e marcas de toque com mais facilidade.",
  },
  {
    number: "02",
    eyebrow: "Discreto e uniforme",
    title: "Preto Fosco Poroso",
    headline: "Menos reflexo e uma textura mais sóbria",
    description:
      "O Preto Fosco Poroso troca o brilho intenso por uma aparência mais discreta. Sua textura ajuda a reduzir reflexos e torna marcas de toque menos evidentes, criando um acabamento moderno para quem prefere colunas com visual sóbrio.",
    image: "/black-piano-card-matte.webp",
    alt: "Colunas automotivas com acabamento preto fosco poroso",
    points: [
      "Textura porosa com baixa reflexão de luz",
      "Marcas de toque ficam menos aparentes",
      "Visual discreto e fácil de combinar",
    ],
    note:
      "O acabamento é propositalmente texturizado e não apresenta o aspecto liso do Black Piano.",
  },
  {
    number: "03",
    eyebrow: "Estilo esportivo",
    title: "Fibra de Carbono 4D",
    headline: "Textura e profundidade para uma personalização marcante",
    description:
      "A Fibra de Carbono 4D reproduz o desenho e a profundidade visual associados à fibra de carbono. É uma escolha mais expressiva para colunas, soleiras e detalhes que pedem uma identidade esportiva sem a necessidade de substituir o componente original.",
    image: "/black-piano-card-carbon.webp",
    alt: "Colunas automotivas com acabamento visual de fibra de carbono 4D",
    points: [
      "Trama com efeito visual de profundidade",
      "Personalização de aparência esportiva",
      "Aplicação sobre a superfície original",
    ],
    note:
      "Trata-se de um acabamento automotivo com efeito visual inspirado em fibra de carbono, não de uma peça fabricada em carbono real.",
  },
] as const;

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

export default function BlackPianoPage() {
  return (
    <div id="top" className="min-h-screen bg-white text-slate-950">
      <Header />

      <main className="overflow-hidden">
        <section className="relative overflow-hidden border-b border-slate-100 bg-[linear-gradient(110deg,#ffffff_0%,#f7faff_50%,#e9f2ff_100%)]">
          <div className="mx-auto grid min-h-[520px] max-w-[1320px] items-center gap-10 px-6 py-14 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-16">
            <div className="relative z-10 max-w-[600px]">
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-blue-600">
                Personalização automotiva
              </p>
              <h1 className="mt-4 text-[46px] font-bold leading-[1.02] tracking-[-0.04em] text-slate-950 sm:text-[62px]">
                Acabamentos para <span className="text-blue-600">colunas</span>
              </h1>
              <p className="mt-6 max-w-[570px] text-[16px] leading-8 text-slate-600">
                Renove ou personalize as colunas do seu veículo com kits pré-cortados em Black Piano, Preto Fosco Poroso ou Fibra de Carbono 4D.
              </p>
              <p className="mt-3 max-w-[570px] text-[15px] leading-7 text-slate-600">
                Cada opção muda a aparência da peça de um jeito diferente, enquanto o corte computadorizado acompanha o formato específico do veículo para entregar um acabamento mais limpo e preciso.
              </p>

              <div className="mt-8 flex flex-wrap gap-2.5">
                {["Black Piano", "Preto Fosco Poroso", "Fibra de Carbono 4D"].map(
                  (item) => (
                    <span
                      key={item}
                      className="rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-[11px] font-bold text-slate-700 shadow-sm backdrop-blur"
                    >
                      {item}
                    </span>
                  ),
                )}
              </div>
            </div>

            <div className="relative min-h-[390px] overflow-hidden rounded-[30px] border border-white/70 bg-slate-950 shadow-[0_30px_80px_-35px_rgba(37,99,235,0.45)] lg:min-h-[440px]">
              <Image
                src="/black-piano-antes-depois.png"
                alt="Comparação de colunas automotivas antes e depois da renovação do acabamento"
                fill
                priority
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-white/5" />
              <div className="absolute bottom-4 right-4 h-[132px] w-[132px] overflow-hidden rounded-[20px] border-4 border-white bg-white shadow-[0_18px_45px_-18px_rgba(15,23,42,0.7)] sm:bottom-5 sm:right-5 sm:h-[170px] sm:w-[170px]">
                <Image
                  src="/black-piano-vinil.webp"
                  alt="Detalhe do material de acabamento automotivo"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-100 bg-white py-16 sm:py-20">
          <div className="mx-auto grid max-w-[1180px] items-center gap-10 px-6 sm:px-8 lg:grid-cols-[1.04fr_0.96fr] lg:gap-16 lg:px-10">
            <div className="max-w-[620px]">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-blue-600">
                O primeiro passo
              </p>
              <h2 className="mt-3 text-3xl font-bold leading-tight tracking-[-0.03em] text-slate-950 sm:text-[44px]">
                Corte computadorizado para cada veículo
              </h2>
              <p className="mt-5 text-[15px] leading-8 text-slate-600">
                Antes de pensar no acabamento, é preciso garantir o encaixe. Cada kit InterShield é desenvolvido a partir de moldes digitais e recortado em plotter computadorizada para acompanhar as linhas e medidas das colunas de cada modelo.
              </p>
              <p className="mt-4 text-[15px] leading-8 text-slate-600">
                Você recebe as peças pré-cortadas e prontas para aplicação. Isso reduz ajustes manuais, evita cortes desnecessários diretamente sobre o veículo e ajuda a manter um resultado mais limpo e padronizado.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {["Molde digital", "Recorte específico", "Encaixe mais preciso"].map(
                  (item, index) => (
                    <div
                      key={item}
                      className="rounded-[18px] border border-blue-100 bg-blue-50/60 px-4 py-4"
                    >
                      <span className="text-[10px] font-bold tracking-[0.18em] text-blue-600">
                        0{index + 1}
                      </span>
                      <p className="mt-2 text-[12px] font-bold leading-5 text-slate-800">
                        {item}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="mx-auto w-full max-w-[360px]">
              <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-slate-950 p-2 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.55)]">
                <video
                  controls
                  playsInline
                  preload="metadata"
                  className="aspect-[9/16] w-full rounded-[22px] bg-black object-cover"
                >
                  <source src="/coluna-black-piano-corte.mp4" type="video/mp4" />
                  Seu navegador não suporta reprodução de vídeo.
                </video>
              </div>
              <p className="mt-3 text-center text-[12px] leading-5 text-slate-500">
                Veja como o kit para colunas é produzido com corte computadorizado.
              </p>
            </div>
          </div>
        </section>

        {finishes.map((finish, index) => (
          <section
            id={finish.title.toLowerCase().replaceAll(" ", "-")}
            key={finish.title}
            className="border-b border-slate-100 bg-white py-16 sm:py-20"
          >
            <div className="mx-auto grid max-w-[1220px] items-center gap-10 px-6 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:px-10">
              <div
                className={`relative min-h-[330px] overflow-hidden rounded-[30px] border shadow-[0_28px_70px_-38px_rgba(15,23,42,0.65)] sm:min-h-[420px] ${
                  index % 2 === 1
                    ? "border-slate-200 lg:order-2"
                    : "border-slate-200"
                }`}
              >
                <Image
                  src={finish.image}
                  alt={finish.alt}
                  fill
                  className="object-cover object-center transition duration-700 hover:scale-[1.025]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                  <span className="rounded-full border border-white/20 bg-slate-950/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-300 backdrop-blur">
                    {finish.eyebrow}
                  </span>
                  <span className="text-[11px] font-bold tracking-[0.2em] text-white/70">
                    {finish.number}
                  </span>
                </div>
              </div>

              <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                <p
                  className="text-[11px] font-bold uppercase tracking-[0.28em] text-blue-600"
                >
                  Acabamento {finish.number}
                </p>
                <h2 className="mt-3 text-4xl font-bold tracking-[-0.035em] sm:text-[48px]">
                  {finish.title}
                </h2>
                <h3
                  className="mt-4 text-xl font-bold leading-snug text-slate-800 sm:text-2xl"
                >
                  {finish.headline}
                </h3>
                <p
                  className="mt-5 text-[15px] leading-8 text-slate-600"
                >
                  {finish.description}
                </p>

                <ul className="mt-7 space-y-3">
                  {finish.points.map((point) => (
                    <li key={point} className="flex items-center gap-3 text-sm">
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600"
                      >
                        <CheckIcon />
                      </span>
                      <span className="text-slate-700">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>

                <div
                  className="mt-7 rounded-[20px] border border-blue-100 bg-blue-50/65 px-5 py-4"
                >
                  <p
                    className="text-[12px] leading-6 text-slate-600"
                  >
                    <strong className="text-slate-950">
                      Importante:
                    </strong>{" "}
                    {finish.note}
                  </p>
                </div>
              </div>
            </div>
          </section>
        ))}

        <section className="relative overflow-hidden border-t border-blue-500/20 bg-slate-950 py-14 text-white sm:py-16">
          <div className="pointer-events-none absolute -left-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl" />

          <div className="relative mx-auto grid max-w-[1220px] gap-9 px-6 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-12 lg:px-10">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-blue-400">
                Encontre seu kit
              </p>
              <h2 className="mt-4 max-w-[520px] text-3xl font-bold leading-tight tracking-[-0.035em] sm:text-[44px]">
                O acabamento certo para suas colunas começa aqui.
              </h2>
              <p className="mt-5 max-w-[520px] text-sm leading-7 text-slate-300">
                Digite a marca, o modelo, o ano ou o acabamento desejado. A busca mostra os kits compatíveis disponíveis no catálogo da InterShield Películas.
              </p>

              <div className="mt-7 grid max-w-[520px] gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {["Recorte sob medida", "Três acabamentos", "Busca por veículo"].map(
                  (item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-semibold text-slate-200"
                    >
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                      {item}
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="rounded-[30px] border border-white/15 bg-white p-2 text-slate-950 shadow-[0_30px_90px_-42px_rgba(37,99,235,0.75)] sm:p-3">
              <div className="px-5 pt-5 sm:px-6 sm:pt-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-blue-600">
                  Busca rápida
                </p>
                <h3 className="mt-2 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
                  Digite seu veículo ou o acabamento desejado
                </h3>
              </div>
              <VehicleBar
                embedded
                quickLinks={[
                  { label: "Black Piano", query: "Black Piano" },
                  { label: "Preto Fosco", query: "Preto Fosco" },
                  { label: "Fibra de Carbono", query: "Fibra de Carbono" },
                ]}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
