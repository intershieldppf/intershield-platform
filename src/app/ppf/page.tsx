import type { Metadata } from "next";
import Image from "next/image";

import { Header } from "@/components/layout/Header";
import { VehicleBar } from "@/components/search/VehicleBar";

export const metadata: Metadata = {
  title: "PPF | InterShield Películas",
  description:
    "Entenda o que é PPF, como ele protege o veículo e conheça as opções Gloss e Fosco da InterShield Películas.",
};

function Icon({ kind }: { kind: "shield" | "spark" | "diamond" | "car" }) {
  if (kind === "spark") {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 2l1.2 4.1L17 8l-3.8 1.9L12 14l-1.2-4.1L7 8l3.8-1.9L12 2Z" />
        <path d="M18.5 13.5l.7 2.3 2.3.7-2.3.7-.7 2.3-.7-2.3-2.3-.7 2.3-.7.7-2.3Z" />
      </svg>
    );
  }

  if (kind === "diamond") {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M5 4h14l3 5-10 11L2 9l3-5Z" />
        <path d="m2 9 10 3 10-3M8 4l4 8 4-8" />
      </svg>
    );
  }

  if (kind === "car") {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="m5 11 1.7-4h10.6l1.7 4" />
        <path d="M3.5 12.5h17v5h-17v-5Z" />
        <path d="M6 17.5v2M18 17.5v2M7 14.8h.01M17 14.8h.01" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3 19 6v5c0 4.6-2.9 7.8-7 10-4.1-2.2-7-5.4-7-10V6l7-3Z" />
      <path d="m9 12 2 2 4-5" />
    </svg>
  );
}

const benefits = [
  {
    icon: "shield" as const,
    title: "Proteção invisível",
    text: "Ajuda a preservar a superfície sem alterar o visual original do veículo.",
  },
  {
    icon: "spark" as const,
    title: "Tecnologia autorregenerativa",
    text: "Pequenas marcas superficiais podem ser reduzidas quando o material recebe calor.",
  },
  {
    icon: "diamond" as const,
    title: "Material premium",
    text: "PPF em TPU de 190 micras, resistente, flexível e desenvolvido para uso automotivo.",
  },
];


const glossPoints = [
  "Mantém ou realça o brilho original",
  "Excelente para Black Piano, painéis e consoles",
  "Visual mais vivo e profundo",
  "Proteção transparente e discreta",
];

const mattePoints = [
  "Visual acetinado e sofisticado",
  "Reduz reflexos na superfície",
  "Ótima opção para um acabamento mais discreto",
  "Mantém a proteção contra o desgaste diário",
];

export default function PpfPage() {
  return (
    <div id="top" className="min-h-screen bg-white text-slate-950">
      <Header />

      <main className="overflow-hidden">
        <section className="relative overflow-hidden border-b border-slate-100 bg-[linear-gradient(110deg,#ffffff_0%,#f7faff_48%,#e8f1ff_100%)]">
          <div className="mx-auto grid min-h-[520px] max-w-[1320px] items-center gap-10 px-6 py-14 sm:px-8 lg:grid-cols-[0.88fr_1.12fr] lg:px-10 lg:py-16">
            <div className="relative z-10 max-w-[560px]">
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-blue-600">
                Proteção automotiva
              </p>
              <h1 className="mt-4 text-[48px] font-bold leading-[0.98] tracking-[-0.04em] text-slate-950 sm:text-[64px]">
                O que é <span className="text-blue-600">PPF?</span>
              </h1>
              <p className="mt-6 max-w-[520px] text-[16px] leading-8 text-slate-600">
                PPF é uma película transparente desenvolvida para proteger as superfícies do veículo contra riscos, atritos e marcas do uso diário.
              </p>
              <p className="mt-3 max-w-[520px] text-[15px] leading-7 text-slate-600">
                Na InterShield Películas, trabalhamos com PPF em TPU de 190 micras: resistente, flexível e praticamente imperceptível após a instalação.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {benefits.map((item) => (
                  <div key={item.title} className="rounded-[20px] border border-blue-100 bg-white/80 p-4 shadow-sm backdrop-blur">
                    <div className="text-blue-600">
                      <Icon kind={item.icon} />
                    </div>
                    <p className="mt-3 text-[12px] font-bold leading-5 text-slate-950">{item.title}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative min-h-[390px] overflow-hidden rounded-[30px] border border-white/70 bg-slate-950 shadow-[0_30px_80px_-35px_rgba(37,99,235,0.45)] lg:min-h-[440px]">
              <Image
                src="/ppf-resistance-test-intershield.webp"
                alt="Teste real de resistência do PPF em TPU"
                fill
                priority
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(2,6,23,0.08),rgba(37,99,235,0.05)_48%,rgba(2,6,23,0.12))]" />
              <div className="absolute bottom-6 left-6 rounded-full border border-white/20 bg-slate-950/70 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur">
                TPU 190 micras
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-100 bg-slate-50/70 py-16 sm:py-20">
          <div className="mx-auto max-w-[1320px] px-6 sm:px-8 lg:px-10">
            <div>
              <h2 className="max-w-[980px] text-4xl font-bold leading-[1.04] tracking-[-0.035em] text-slate-950 sm:text-[52px]">
                Proteção que <span className="text-blue-600">preserva, regenera e resiste.</span>
              </h2>
            </div>

            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {benefits.map((item, index) => (
                <article
                  key={item.title}
                  className="group relative min-h-[320px] overflow-hidden rounded-[26px] border border-slate-800 bg-[#040a18] p-7 text-white shadow-[0_20px_55px_-35px_rgba(15,23,42,0.75)] sm:p-8"
                >
                  {index === 0 && (
                    <>
                      <Image
                        src="/ppf-invisible-protection-multimedia.webp"
                        alt="Multimídia automotiva moderna preservada com proteção transparente"
                        fill
                        className="object-cover object-center transition duration-700 group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.16)_0%,rgba(2,6,23,0.58)_44%,rgba(2,6,23,0.97)_100%)]" />
                    </>
                  )}

                  {index === 1 && (
                    <>
                      <Image
                        src="/ppf-self-healing-premium.webp"
                        alt="Comparação real antes e depois da autorregeneração do PPF após receber calor"
                        fill
                        className="object-cover object-center transition duration-700 group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-y-0 left-0 w-1/2 bg-white/[0.035]" />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.02)_0%,rgba(2,6,23,0.08)_48%,rgba(2,6,23,0.88)_70%,rgba(2,6,23,0.99)_100%)]" />
                      <span className="absolute left-3 top-3 z-10 rounded-lg border border-white/30 bg-white/92 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-950 shadow-sm backdrop-blur-sm">
                        Antes
                      </span>
                      <span className="absolute right-3 top-3 z-10 rounded-lg border border-white/30 bg-white/92 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-950 shadow-sm backdrop-blur-sm">
                        Depois
                      </span>
                    </>
                  )}

                  {index === 2 && (
                    <>
                      <Image
                        src="/ppf-high-resistance-intershield.webp"
                        alt="Teste real de alta resistência do PPF em TPU"
                        fill
                        className="object-cover object-center transition duration-700 group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.28)_0%,rgba(2,6,23,0.58)_44%,rgba(2,6,23,0.97)_100%)]" />
                    </>
                  )}

                  <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-blue-600/10 blur-3xl transition duration-500 group-hover:bg-blue-600/20" />

                  {index === 1 ? (
                    <div className="relative z-10" />
                  ) : (
                    <div className="relative z-10 flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/20 bg-slate-950/45 text-blue-400 backdrop-blur-sm">
                        <Icon kind={item.icon} />
                      </div>
                      <span className="text-[11px] font-bold tracking-[0.18em] text-slate-400">
                        0{index + 1}
                      </span>
                    </div>
                  )}

                  {index === 1 ? (
                    <div className="absolute inset-x-0 bottom-0 z-10 px-7 pb-4 sm:px-8">
                      <h3 className="text-[23px] font-bold leading-tight tracking-tight">
                        {item.title}
                      </h3>
                      <p className="mt-4 max-w-[360px] text-sm leading-7 text-slate-300">
                        {item.text}
                      </p>
                    </div>
                  ) : (
                    <>
                      <h3 className="relative z-10 mt-8 text-[23px] font-bold leading-tight tracking-tight">
                        {index === 2 ? "Alta resistência na prática" : item.title}
                      </h3>
                      <p className="relative z-10 mt-4 max-w-[360px] text-sm leading-7 text-slate-300">
                        {index === 2
                          ? "O TPU combina elasticidade e resistência para absorver o desgaste do uso diário sem perder a transparência."
                          : item.text}
                      </p>
                    </>
                  )}
                  <div className="absolute bottom-0 left-0 z-10 h-[3px] w-0 bg-blue-500 transition-all duration-500 group-hover:w-full" />
                </article>
              ))}
            </div>

            <article className="mt-5 overflow-hidden rounded-[32px] border border-blue-100 bg-white p-5 shadow-[0_28px_80px_-48px_rgba(37,99,235,0.5)] sm:p-8 lg:p-10">
              <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:gap-14">
                <div className="relative mx-auto w-full max-w-[360px] overflow-hidden rounded-[28px] border border-slate-800 bg-slate-950 shadow-[0_28px_70px_-30px_rgba(15,23,42,0.9)]">
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls
                    preload="metadata"
                    poster="/ppf-auto-regeneracao-poster.webp"
                    aria-label="Demonstração real da autorregeneração do PPF com aplicação de calor"
                    className="aspect-[9/16] w-full object-cover"
                  >
                    <source src="/ppf-auto-regeneracao-intershield.mp4" type="video/mp4" />
                    Seu navegador não oferece suporte à reprodução deste vídeo.
                  </video>
                  <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-white/20 bg-slate-950/75 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur">
                    Demonstração real
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-blue-600">
                    Tecnologia autorregenerativa
                  </p>
                  <h3 className="mt-3 max-w-[720px] text-3xl font-bold leading-tight tracking-[-0.03em] text-slate-950 sm:text-[42px]">
                    Como funciona a autorregeneração do PPF
                  </h3>
                  <p className="mt-5 max-w-[720px] text-[15px] leading-7 text-slate-600">
                    O PPF possui uma camada superior desenvolvida para reagir ao calor.
                    Quando surgem micro-riscos, o aquecimento aumenta temporariamente a
                    mobilidade desse revestimento, permitindo que ele se reorganize e
                    reduza visualmente as marcas superficiais.
                  </p>

                  <div className="mt-8 grid gap-3 sm:grid-cols-3">
                    {[
                      {
                        title: "Micro-riscos",
                        text: "Marcas leves atingem a camada superficial do PPF.",
                      },
                      {
                        title: "Ação do calor",
                        text: "O calor ativa a mobilidade do revestimento autorregenerativo.",
                      },
                      {
                        title: "Regeneração",
                        text: "A camada se reorganiza e recupera a uniformidade visual.",
                      },
                    ].map((step, index) => (
                      <div
                        key={step.title}
                        className="rounded-[20px] border border-blue-100 bg-blue-50/55 p-4"
                      >
                        <span className="text-[10px] font-bold tracking-[0.16em] text-blue-600">
                          0{index + 1}
                        </span>
                        <h4 className="mt-3 text-sm font-bold text-slate-950">
                          {step.title}
                        </h4>
                        <p className="mt-2 text-[12px] leading-5 text-slate-600">
                          {step.text}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-[22px] border border-slate-200 bg-slate-50 p-5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-600">
                      O que o vídeo demonstra
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      Primeiro, uma escova provoca micro-riscos sobre a superfície
                      protegida. Em seguida, a aplicação de água quente ativa a camada
                      autorregenerativa. A comparação final mostra a redução das marcas e
                      a recuperação visual do acabamento.
                    </p>
                  </div>

                  <p className="mt-5 border-l-2 border-blue-500 pl-4 text-[12px] leading-6 text-slate-500">
                    A autorregeneração atua em micro-riscos e marcas leves. Cortes,
                    perfurações ou danos que atravessam o filme não são reparados pelo calor.
                  </p>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="bg-slate-50 py-14 sm:py-16">
          <div className="mx-auto max-w-[1320px] px-6 sm:px-8 lg:px-10">
            <div className="mb-8 max-w-3xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-blue-600">Escolha o acabamento</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-[38px]">PPF Gloss ou Fosco?</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                A proteção continua sendo o principal. O acabamento muda a forma como a superfície se apresenta visualmente.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <article className="relative min-h-[410px] overflow-hidden rounded-[28px] bg-slate-950 p-7 text-white sm:p-8">
                <Image src="/intershield-hero-bmw.png" alt="Exemplo de acabamento PPF Gloss" fill className="object-cover object-right opacity-45" />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.98)_0%,rgba(2,6,23,0.88)_45%,rgba(2,6,23,0.22)_100%)]" />
                <div className="relative z-10 max-w-[360px]">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-400">Acabamento brilhante</p>
                  <h3 className="mt-3 text-3xl font-bold">PPF <span className="text-blue-400">Gloss</span></h3>
                  <p className="mt-4 text-sm leading-7 text-slate-300">
                    Indicado para quem deseja manter ou realçar o brilho original da superfície, com aspecto mais vivo e profundo.
                  </p>
                  <ul className="mt-6 space-y-3">
                    {glossPoints.map((point) => (
                      <li key={point} className="flex gap-3 text-sm text-slate-200">
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-400" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>

              <article className="relative min-h-[410px] overflow-hidden rounded-[28px] bg-slate-950 p-7 text-white sm:p-8">
                <Image src="/intershield-hero-bmw.png" alt="Exemplo de acabamento PPF Fosco" fill className="object-cover object-left grayscale opacity-38" />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.98)_0%,rgba(2,6,23,0.9)_48%,rgba(2,6,23,0.28)_100%)]" />
                <div className="relative z-10 max-w-[360px]">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-400">Acabamento acetinado</p>
                  <h3 className="mt-3 text-3xl font-bold">PPF <span className="text-blue-400">Fosco</span></h3>
                  <p className="mt-4 text-sm leading-7 text-slate-300">
                    Para quem prefere um visual mais discreto e sofisticado, com menos reflexo e aparência acetinada.
                  </p>
                  <ul className="mt-6 space-y-3">
                    {mattePoints.map((point) => (
                      <li key={point} className="flex gap-3 text-sm text-slate-200">
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-400" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-100 bg-white pt-8">
          <div className="mx-auto max-w-4xl px-6 text-center sm:px-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-blue-600">Encontre seu kit</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-[38px]">Busque a proteção compatível com o seu veículo</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600">
              Digite marca, modelo, ano ou o nome da peça que deseja proteger. Você será direcionado para os produtos compatíveis do nosso catálogo.
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
