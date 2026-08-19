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

const layerItems = [
  {
    title: "Camada autorregenerativa",
    text: "Camada superior responsável por ajudar a reduzir pequenas marcas superficiais.",
  },
  {
    title: "Filme TPU",
    text: "Estrutura resistente e flexível que forma a principal barreira de proteção.",
  },
  {
    title: "Adesivo",
    text: "Camada que permite a fixação uniforme da película sobre a superfície.",
  },
  {
    title: "Superfície do veículo",
    text: "A peça original permanece protegida contra o desgaste do uso diário.",
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

        <section className="bg-white py-14 sm:py-16">
          <div className="mx-auto grid max-w-[1320px] gap-5 px-6 sm:px-8 lg:grid-cols-[0.74fr_1.26fr] lg:px-10">
            <div className="grid gap-4">
              <article className="rounded-[26px] bg-slate-950 p-7 text-white">
                <div className="text-blue-400"><Icon kind="shield" /></div>
                <h2 className="mt-5 text-2xl font-bold tracking-tight">Proteção sem mudar o visual</h2>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  Por ser transparente, o PPF acompanha o acabamento da peça sem deixar aspecto de adesivo. Ele ajuda a preservar a cor e o acabamento original do veículo.
                </p>
              </article>

              <article className="rounded-[26px] bg-slate-950 p-7 text-white">
                <div className="text-blue-400"><Icon kind="car" /></div>
                <h2 className="mt-5 text-2xl font-bold tracking-tight">Por que usar PPF?</h2>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  Chaves, unhas, anéis, objetos, limpeza e o contato frequente das mãos podem marcar superfícies sensíveis. O PPF ajuda a evitar esse desgaste precoce e a conservar o veículo por mais tempo.
                </p>
              </article>

              <article className="rounded-[26px] bg-slate-950 p-7 text-white">
                <div className="text-blue-400"><Icon kind="spark" /></div>
                <h2 className="mt-5 text-2xl font-bold tracking-tight">Pode melhorar áreas já marcadas?</h2>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  Em riscos leves ou marcas superficiais, a aplicação pode ajudar a suavizar visualmente algumas imperfeições e deixar a superfície mais uniforme. Danos profundos não são removidos pelo PPF.
                </p>
              </article>
            </div>

            <article className="overflow-hidden rounded-[30px] border border-slate-200 bg-slate-50 p-7 sm:p-8 lg:p-10">
              <div className="max-w-2xl">
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-blue-600">Tecnologia InterShield</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-[38px]">Engenharia em camadas</h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  O PPF combina diferentes camadas para criar uma proteção resistente, transparente e adequada às superfícies do veículo.
                </p>
              </div>

              <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
                <div className="relative mx-auto h-[330px] w-full max-w-[520px]">
                  <div className="absolute left-[7%] top-[4%] h-[125px] w-[82%] -rotate-3 rounded-[24px] border border-blue-200 bg-white/75 shadow-[0_20px_45px_-30px_rgba(37,99,235,0.7)] backdrop-blur" />
                  <div className="absolute left-[10%] top-[25%] h-[125px] w-[82%] rotate-2 rounded-[24px] border border-blue-200 bg-blue-50/80 shadow-[0_20px_45px_-30px_rgba(37,99,235,0.7)]" />
                  <div className="absolute left-[7%] top-[47%] h-[125px] w-[82%] -rotate-2 rounded-[24px] border border-blue-300 bg-blue-600/70 shadow-[0_25px_50px_-30px_rgba(37,99,235,0.9)]" />
                  <div className="absolute left-[10%] top-[69%] h-[125px] w-[82%] rotate-1 rounded-[24px] border border-slate-700 bg-[linear-gradient(135deg,#111827,#334155)] shadow-[0_30px_55px_-28px_rgba(15,23,42,0.85)]" />
                </div>

                <div className="space-y-5">
                  {layerItems.map((item, index) => (
                    <div key={item.title} className="flex gap-4">
                      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-white text-[11px] font-bold text-blue-600">
                        0{index + 1}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-950">{item.title}</h3>
                        <p className="mt-1 text-[13px] leading-6 text-slate-600">{item.text}</p>
                      </div>
                    </div>
                  ))}
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
