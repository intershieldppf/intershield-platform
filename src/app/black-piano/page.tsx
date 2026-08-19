import type { Metadata } from "next";

import { Header } from "@/components/layout/Header";
import { VehicleBar } from "@/components/search/VehicleBar";

export const metadata: Metadata = {
  title: "Black Piano | InterShield Películas",
  description:
    "Conheça as opções de customização Black Piano, Preto Fosco e Fibra de Carbono 4D da InterShield Películas.",
};

const finishCards = [
  {
    title: "Black Piano",
    eyebrow: "Brilho intenso",
    description:
      "Acabamento preto brilhante, profundo e elegante. Ideal para renovar colunas de porta, soleiras e outros detalhes que perderam o visual original ou que receberão uma nova proposta estética.",
    tags: ["Visual premium", "Brilho profundo", "Acabamento elegante"],
    texture: "gloss",
  },
  {
    title: "Preto Fosco",
    eyebrow: "Textura porosa",
    description:
      "Acabamento mais discreto, uniforme e moderno. A superfície porosa reduz reflexos e entrega um visual sóbrio para quem prefere uma customização menos chamativa.",
    tags: ["Textura porosa", "Visual discreto", "Acabamento moderno"],
    texture: "matte",
  },
  {
    title: "Fibra de Carbono 4D",
    eyebrow: "Visual esportivo",
    description:
      "Efeito visual inspirado em fibra de carbono, com textura e profundidade marcantes. Uma opção para quem deseja personalização mais esportiva em colunas, soleiras e detalhes internos.",
    tags: ["Efeito 4D", "Estilo esportivo", "Personalização"],
    texture: "carbon",
  },
] as const;

function FeatureIcon({ type }: { type: "spark" | "target" | "shield" }) {
  if (type === "target") {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="7" />
        <circle cx="12" cy="12" r="2.5" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
      </svg>
    );
  }

  if (type === "shield") {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3 19 6v5c0 4.6-2.9 7.8-7 10-4.1-2.2-7-5.4-7-10V6l7-3Z" />
        <path d="m9 12 2 2 4-5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 2l1.2 4.1L17 8l-3.8 1.9L12 14l-1.2-4.1L7 8l3.8-1.9L12 2Z" />
      <path d="M18.5 13.5l.7 2.3 2.3.7-2.3.7-.7 2.3-.7-2.3-2.3-.7 2.3-.7.7-2.3Z" />
    </svg>
  );
}

function FinishVisual({ texture }: { texture: "gloss" | "matte" | "carbon" }) {
  if (texture === "matte") {
    return (
      <div className="relative flex h-[270px] items-center justify-center overflow-hidden rounded-[24px] border border-slate-200 bg-[radial-gradient(circle_at_40%_35%,#4b5563_0%,#27272a_35%,#09090b_72%)]">
        <div className="absolute inset-0 opacity-50 [background-image:radial-gradient(circle,rgba(255,255,255,0.2)_0.7px,transparent_0.8px)] [background-size:4px_4px]" />
        <div className="relative h-[190px] w-[190px] rounded-full border-2 border-blue-500 bg-[radial-gradient(circle_at_38%_32%,#52525b_0%,#27272a_40%,#09090b_78%)] shadow-[0_24px_55px_-30px_rgba(37,99,235,0.65)]">
          <div className="absolute inset-0 rounded-full opacity-45 [background-image:radial-gradient(circle,rgba(255,255,255,0.22)_0.6px,transparent_0.8px)] [background-size:4px_4px]" />
        </div>
      </div>
    );
  }

  if (texture === "carbon") {
    return (
      <div className="relative h-[270px] overflow-hidden rounded-[24px] border border-slate-200 bg-slate-950">
        <div className="absolute inset-0 [background-image:linear-gradient(135deg,rgba(255,255,255,0.13)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.13)_50%,rgba(255,255,255,0.13)_75%,transparent_75%,transparent),linear-gradient(45deg,rgba(59,130,246,0.08)_25%,transparent_25%,transparent_50%,rgba(59,130,246,0.08)_50%,rgba(59,130,246,0.08)_75%,transparent_75%,transparent)] [background-position:0_0,6px_6px] [background-size:12px_12px]" />
        <div className="absolute left-[12%] top-[15%] h-[210px] w-[31%] skew-x-[-4deg] rounded-xl border border-white/10 bg-black/25 shadow-[inset_0_0_35px_rgba(255,255,255,0.06)]" />
        <div className="absolute left-[51%] top-[15%] h-[210px] w-[31%] skew-x-[-4deg] rounded-xl border border-white/10 bg-black/25 shadow-[inset_0_0_35px_rgba(255,255,255,0.06)]" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-blue-950/30 to-transparent" />
      </div>
    );
  }

  return (
    <div className="relative h-[270px] overflow-hidden rounded-[24px] border border-slate-200 bg-[linear-gradient(135deg,#f8fafc_0%,#dbeafe_42%,#94a3b8_100%)]">
      <div className="absolute inset-y-0 left-[13%] w-[30%] skew-x-[-4deg] rounded-xl border border-white/40 bg-[linear-gradient(100deg,#020617_0%,#111827_28%,#030712_52%,#334155_68%,#020617_100%)] shadow-[inset_18px_0_28px_rgba(255,255,255,0.06),0_18px_40px_-20px_rgba(15,23,42,0.8)]" />
      <div className="absolute inset-y-0 left-[50%] w-[30%] skew-x-[-4deg] rounded-xl border border-white/40 bg-[linear-gradient(100deg,#020617_0%,#0f172a_32%,#030712_55%,#475569_70%,#020617_100%)] shadow-[inset_18px_0_28px_rgba(255,255,255,0.06),0_18px_40px_-20px_rgba(15,23,42,0.8)]" />
      <div className="absolute inset-x-0 top-[26%] h-px bg-white/45" />
      <div className="absolute left-[15%] top-8 h-20 w-[18%] rotate-[-7deg] bg-white/10 blur-xl" />
    </div>
  );
}

export default function BlackPianoPage() {
  return (
    <div id="top" className="min-h-screen bg-white text-slate-950">
      <Header />

      <main className="overflow-hidden">
        <section className="relative overflow-hidden border-b border-slate-100 bg-[linear-gradient(110deg,#ffffff_0%,#f7faff_50%,#e9f2ff_100%)]">
          <div className="mx-auto grid min-h-[520px] max-w-[1320px] items-center gap-10 px-6 py-14 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-16">
            <div className="relative z-10 max-w-[590px]">
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-blue-600">
                Customização automotiva
              </p>
              <h1 className="mt-4 text-[46px] font-bold leading-[1.02] tracking-[-0.04em] text-slate-950 sm:text-[62px]">
                Black Piano, Fosco e <span className="text-blue-600">Fibra de Carbono 4D</span>
              </h1>
              <p className="mt-6 max-w-[560px] text-[16px] leading-8 text-slate-600">
                A InterShield desenvolve soluções de customização automotiva para renovar ou transformar acabamentos do veículo com visual limpo, moderno e bem acabado.
              </p>
              <p className="mt-3 max-w-[560px] text-[15px] leading-7 text-slate-600">
                Esses materiais são normalmente utilizados em colunas de porta, soleiras personalizadas, consoles e outros detalhes internos e externos.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  ["Acabamento premium", "spark"],
                  ["Encaixe preciso", "target"],
                  ["Customização sob medida", "shield"],
                ].map(([label, icon]) => (
                  <div key={label} className="rounded-[20px] border border-blue-100 bg-white/80 p-4 shadow-sm backdrop-blur">
                    <div className="text-blue-600">
                      <FeatureIcon type={icon as "spark" | "target" | "shield"} />
                    </div>
                    <p className="mt-3 text-[12px] font-bold leading-5 text-slate-950">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative min-h-[390px] overflow-hidden rounded-[30px] border border-white/70 bg-[linear-gradient(135deg,#dbeafe_0%,#f8fafc_38%,#cbd5e1_100%)] shadow-[0_30px_80px_-35px_rgba(37,99,235,0.45)] lg:min-h-[440px]">
              <div className="absolute inset-y-[8%] left-[8%] w-[32%] skew-x-[-4deg] rounded-[22px] border border-white/60 bg-[linear-gradient(100deg,#4b5563_0%,#71717a_48%,#52525b_100%)] shadow-[0_24px_55px_-28px_rgba(15,23,42,0.55)]" />
              <div className="absolute inset-y-[8%] left-[49%] w-[32%] skew-x-[-4deg] rounded-[22px] border border-white/40 bg-[linear-gradient(100deg,#020617_0%,#111827_26%,#020617_51%,#334155_70%,#020617_100%)] shadow-[inset_16px_0_24px_rgba(255,255,255,0.06),0_24px_55px_-28px_rgba(15,23,42,0.75)]" />
              <div className="absolute left-[13%] top-[13%] rounded-full bg-slate-950/75 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white">Antes</div>
              <div className="absolute left-[58%] top-[13%] rounded-full bg-blue-600 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white">Depois</div>
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/65 to-transparent" />
            </div>
          </div>
        </section>

        <section className="border-b border-slate-100 bg-white py-14 sm:py-16">
          <div className="mx-auto grid max-w-[1180px] items-center gap-10 px-6 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:px-10">
            <div className="max-w-[620px]">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-blue-600">Precisão em cada recorte</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-[38px]">Corte computadorizado</h2>
              <p className="mt-5 text-[15px] leading-8 text-slate-600">
                Cada kit InterShield é desenvolvido a partir de moldes digitais e recortado em plotter computadorizada. O processo permite que o material acompanhe com precisão o formato de cada peça, entregando um encaixe mais limpo e padronizado.
              </p>
              <p className="mt-4 text-[15px] leading-8 text-slate-600">
                O cliente recebe as peças já pré-cortadas e prontas para aplicação, reduzindo ajustes manuais e a necessidade de cortes diretamente sobre o veículo.
              </p>
              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {["Moldes digitais", "Pré-corte específico", "Mais precisão na instalação"].map((item) => (
                  <div key={item} className="rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-4 text-[12px] font-semibold text-slate-700">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="mx-auto w-full max-w-[360px]">
              <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-slate-950 p-2 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.55)]">
                <video
                  controls
                  playsInline
                  preload="metadata"
                  poster="/black-piano-antes-depois.png"
                  className="aspect-[9/16] w-full rounded-[22px] bg-black object-cover"
                >
                  <source src="/coluna-black-piano-corte.mp4" type="video/mp4" />
                  Seu navegador não suporta reprodução de vídeo.
                </video>
              </div>
              <p className="mt-3 text-center text-[12px] leading-5 text-slate-500">Veja o processo de corte computadorizado de um kit InterShield.</p>
            </div>
          </div>
        </section>

        <section className="bg-white py-14 sm:py-16">
          <div className="mx-auto max-w-[1320px] px-6 sm:px-8 lg:px-10">
            <div className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
              <div className="grid gap-4">
                <article className="rounded-[26px] bg-slate-950 p-7 text-white">
                  <div className="text-blue-400"><FeatureIcon type="shield" /></div>
                  <h2 className="mt-5 text-2xl font-bold tracking-tight">Customização sem trocar a peça</h2>
                  <p className="mt-4 text-sm leading-7 text-slate-300">
                    O vinil cria um novo acabamento sobre a superfície original, permitindo renovar o visual sem a necessidade de substituir o componente do veículo.
                  </p>
                </article>

                <article className="rounded-[26px] bg-slate-950 p-7 text-white">
                  <div className="text-blue-400"><FeatureIcon type="target" /></div>
                  <h2 className="mt-5 text-2xl font-bold tracking-tight">Onde é mais utilizado?</h2>
                  <p className="mt-4 text-sm leading-7 text-slate-300">
                    Principalmente em colunas de porta e soleiras personalizadas, além de consoles e outros detalhes internos e externos do veículo.
                  </p>
                </article>

                <article className="rounded-[26px] bg-slate-950 p-7 text-white">
                  <div className="text-blue-400"><FeatureIcon type="spark" /></div>
                  <h2 className="mt-5 text-2xl font-bold tracking-tight">Pode melhorar áreas desgastadas</h2>
                  <p className="mt-4 text-sm leading-7 text-slate-300">
                    Em muitas situações, o novo acabamento ajuda a esconder marcas visuais e renovar superfícies que já perderam brilho ou apresentam desgaste do uso diário.
                  </p>
                </article>
              </div>

              <article className="rounded-[30px] border border-slate-200 bg-slate-50 p-7 sm:p-8 lg:p-10">
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-blue-600">Nosso modelo de customização</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-[38px]">Kits desenvolvidos para cada veículo</h2>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
                  Na InterShield, desenvolvemos kits pré-cortados para acompanhar o formato original de cada peça. Isso proporciona encaixe mais preciso, acabamento limpo e reduz a necessidade de cortes diretamente sobre o veículo.
                </p>

                <div className="mt-8 grid gap-5 md:grid-cols-3">
                  {finishCards.map((item) => (
                    <article key={item.title} className="overflow-hidden rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm">
                      <FinishVisual texture={item.texture} />
                      <div className="px-2 pb-2 pt-5">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">{item.eyebrow}</p>
                        <h3 className="mt-2 text-xl font-bold text-slate-950">{item.title}</h3>
                        <p className="mt-3 text-[13px] leading-6 text-slate-600">{item.description}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {item.tags.map((tag) => (
                            <span key={tag} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-semibold text-slate-600">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-100 bg-slate-50 py-12 sm:py-14">
          <div className="mx-auto max-w-[1320px] px-6 sm:px-8 lg:px-10">
            <div className="grid gap-4 md:grid-cols-4">
              {[
                ["Visual renovado", "Transforme superfícies já marcadas ou mude completamente o estilo da peça."],
                ["Personalização exclusiva", "Escolha entre brilho intenso, fosco discreto ou o efeito esportivo da fibra 4D."],
                ["Acabamento preciso", "Kits desenhados para acompanhar as linhas e formatos de cada veículo."],
                ["Aplicação mais limpa", "O pré-corte ajuda a reduzir ajustes e cortes diretamente sobre a peça original."],
              ].map(([title, text]) => (
                <div key={title} className="rounded-[24px] border border-blue-100 bg-white p-6 shadow-sm">
                  <div className="text-blue-600"><FeatureIcon type="spark" /></div>
                  <h3 className="mt-4 text-base font-bold text-slate-950">{title}</h3>
                  <p className="mt-2 text-[13px] leading-6 text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-slate-100 bg-white pt-8">
          <div className="mx-auto max-w-4xl px-6 text-center sm:px-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-blue-600">Encontre seu kit</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-[38px]">Busque a customização compatível com o seu veículo</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600">
              Digite marca, modelo, ano ou termos como coluna, soleira, Black Piano, fosco ou fibra de carbono para encontrar os produtos disponíveis.
            </p>
          </div>
          <div className="mt-5">
            <VehicleBar />
          </div>
        </section>
      </main>
    </div>
  );
}
