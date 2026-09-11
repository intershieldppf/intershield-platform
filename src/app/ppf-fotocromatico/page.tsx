import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  Droplets,
  Gauge,
  Layers3,
  MoonStar,
  Palette,
  Ruler,
  Scissors,
  ShieldCheck,
  Sparkles,
  SunMedium,
} from "lucide-react";

import { Header } from "@/components/layout/Header";
import { PhotochromicCarousel } from "@/components/media/PhotochromicCarousel";
import { PlatformIcon } from "@/components/ui/PlatformIcon";

export const metadata: Metadata = {
  title: "PPF fotocromático para faróis",
  description:
    "Conheça o PPF fotocromático para faróis: proteção em TPU, efeito que responde à luz, acabamento camaleão e orientações importantes de uso.",
  alternates: { canonical: "/ppf-fotocromatico" },
};

const whatsappUrl =
  "https://wa.me/5531988633883?text=Ol%C3%A1%21%20Quero%20saber%20mais%20sobre%20o%20PPF%20fotocrom%C3%A1tico%20para%20far%C3%B3is.%20Meu%20ve%C3%ADculo%20%C3%A9%3A%20";

const benefits = [
  {
    icon: ShieldCheck,
    title: "Barreira contra impactos leves",
    text: "O filme funciona como uma camada de sacrifício diante de pedriscos, areia, insetos e pequenos atritos do uso diário.",
  },
  {
    icon: Sparkles,
    title: "Preservação da lente",
    text: "Ajuda a reduzir riscos e marcas superficiais no farol, mantendo a peça original protegida por mais tempo.",
  },
  {
    icon: Palette,
    title: "Visual que responde à luz",
    text: "A tonalidade se torna mais aparente com maior exposição solar e volta a um aspecto mais claro quando a incidência diminui.",
  },
  {
    icon: Droplets,
    title: "Acabamento ultrabrilhante",
    text: "A superfície lisa valoriza os reflexos do conjunto óptico e também facilita a limpeza e a manutenção cotidiana.",
  },
  {
    icon: Layers3,
    title: "Proteção removível",
    text: "Quando aplicada e removida corretamente, a película protege sem exigir a substituição ou pintura da lente original.",
  },
  {
    icon: Gauge,
    title: "Tecnologia regenerativa",
    text: "Micro-riscos superficiais no próprio filme podem se suavizar com calor, conforme as condições e a especificação do material.",
  },
] as const;

const specifications = [
  ["Formato de venda", "Manta vendida por metragem"],
  ["Largura fixa", "30 cm"],
  ["Comprimentos", "1 m, 2 m, 3 m ou mais"],
  ["Material", "PPF flexível de TPU"],
  ["Espessura nominal", "165 micras"],
  ["Acabamento", "Transparente e ultrabrilhante"],
  ["Resposta visual", "Tonalidade ativada pela luz solar"],
  ["Superfície", "Regenerativa para micro-riscos"],
  ["Durabilidade estimada", "Até 5 anos*"],
] as const;

const questions = [
  {
    title: "O produto chega pré-cortado para o meu farol?",
    text: "Não. O PPF fotocromático é vendido em manta de 30 cm de largura, com o comprimento escolhido no pedido: 1 m, 2 m, 3 m ou mais. A medição, o recorte e o acabamento são feitos durante a instalação.",
  },
  {
    title: "O efeito mantém sempre a mesma cor?",
    text: "Não. A intensidade pode mudar conforme incidência de luz ultravioleta, horário, clima, temperatura, orientação do farol e tempo de exposição.",
  },
  {
    title: "O farol fica totalmente transparente à noite?",
    text: "Com menor exposição UV, o filme tende a retornar ao estado mais claro. O tom residual e o tempo de transição dependem da formulação e das condições ambientais.",
  },
  {
    title: "A película recupera um farol já danificado?",
    text: "Não. Trincas, descascamento, opacidade e amarelamento existentes devem ser avaliados antes. O PPF protege a condição atual, mas não substitui restauração ou reparo.",
  },
  {
    title: "Quando a revitalização do farol é necessária?",
    text: "Se a lente estiver opaca, amarelada ou marcada pelo desgaste, a revitalização profissional — com o processo de polimento adequado ao estado do farol — deve ser realizada antes do PPF para alcançar melhor transparência, brilho e uniformidade. A película protege a superfície preparada, mas não corrige danos existentes. Em lentes íntegras, limpeza e descontaminação corretas são suficientes.",
  },
  {
    title: "Por que a instalação profissional é recomendada?",
    text: "Diferente das peças internas pré-cortadas, a manta precisa ser medida, conformada e recortada no próprio farol. As curvas complexas exigem controle de tensão e acabamento preciso. Recomendamos fortemente um profissional com experiência em PPF automotivo.",
  },
] as const;

export default function PpfFotocromaticoPage() {
  return (
    <div id="top" className="min-h-screen bg-white text-slate-950">
      <Header />

      <main className="overflow-hidden">
        <section className="relative overflow-hidden bg-[#030816] text-white">
          <div className="pointer-events-none absolute -right-40 -top-40 h-[620px] w-[620px] rounded-full bg-blue-600/20 blur-3xl" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />

          <div className="relative mx-auto grid min-h-[610px] max-w-[1320px] items-center gap-12 px-6 py-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-20">
            <div className="max-w-[680px]">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
                <SunMedium className="h-4 w-4" />
                Tecnologia responsiva à luz
              </div>

              <h1 className="mt-7 text-[46px] font-bold leading-[0.98] tracking-[-0.045em] text-white sm:text-[64px] lg:text-[72px]">
                PPF fotocromático para <span className="text-blue-400">faróis.</span>
              </h1>
              <p className="mt-7 max-w-[640px] text-base leading-8 text-slate-300 sm:text-lg">
                Proteção física e personalização dinâmica em uma única camada. Sob maior exposição solar, o filme revela uma tonalidade camaleão; com menos luz UV, retorna gradualmente ao aspecto mais claro.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#comparacao"
                  className="inline-flex h-12 items-center justify-center gap-3 rounded-xl bg-blue-600 px-6 text-sm font-bold text-white transition hover:bg-blue-500"
                >
                  Ver o efeito
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#entenda-a-tecnologia"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 text-sm font-bold text-white transition hover:border-white/30 hover:bg-white/10"
                >
                  Entenda a tecnologia
                </a>
              </div>
            </div>

            <PhotochromicCarousel />
          </div>
        </section>

        <section className="border-b border-slate-100 bg-white py-5">
          <div className="mx-auto grid max-w-[1240px] grid-cols-2 gap-3 px-5 sm:px-8 lg:grid-cols-4 lg:px-10">
            {[
              ["01", "Proteção física"],
              ["02", "Efeito adaptativo"],
              ["03", "Brilho premium"],
              ["04", "Aplicação especializada"],
            ].map(([number, label]) => (
              <div
                key={label}
                className="group flex min-h-20 items-center gap-3 rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-blue-200 hover:bg-blue-50/60"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-xs font-bold text-white shadow-lg shadow-blue-950/15">
                  {number}
                </span>
                <p className="text-sm font-bold leading-5 text-slate-800">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-b border-slate-100 bg-slate-50 py-14 sm:py-20">
          <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-10">
            <div className="overflow-hidden rounded-[28px] border border-blue-100 bg-white shadow-[0_30px_90px_-58px_rgba(37,99,235,0.55)] sm:rounded-[34px]">
              <div className="grid lg:grid-cols-[0.86fr_1.14fr]">
                <div className="relative p-6 sm:p-9 lg:p-11">
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent"
                  />

                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-600">
                    Formato de venda
                  </p>
                  <h2 className="mt-4 max-w-[520px] text-4xl font-bold leading-[1.05] tracking-[-0.04em] text-slate-950 sm:text-[48px]">
                    Manta de 30 cm, no comprimento que você precisa.
                  </h2>
                  <p className="mt-5 max-w-[540px] text-base leading-8 text-slate-600">
                    O PPF fotocromático é enviado com{" "}
                    <strong className="font-bold text-slate-950">
                      30 cm de largura fixa
                    </strong>
                    . No pedido, você escolhe o comprimento em metros conforme o
                    seu projeto.
                  </p>

                  <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    <div className="rounded-[20px] border border-blue-100 bg-blue-50/70 p-4">
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-950/15">
                        <Ruler className="h-5 w-5" />
                      </span>
                      <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                        Medida fixa
                      </p>
                      <p className="mt-1 text-base font-bold text-slate-950">
                        30 cm de largura
                      </p>
                    </div>

                    <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/15">
                        <Scissors className="h-5 w-5" />
                      </span>
                      <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                        Acabamento final
                      </p>
                      <p className="mt-1 text-base font-bold text-slate-950">
                        Recorte pelo instalador
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-start gap-3 rounded-[20px] border border-amber-200 bg-amber-50 px-4 py-4 text-slate-700">
                    <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                    <p className="text-sm leading-6">
                      <strong className="font-bold text-slate-950">
                        Não é um kit pré-cortado.
                      </strong>{" "}
                      O formato do farol é medido e recortado durante a
                      instalação.
                    </p>
                  </div>
                </div>

                <div className="relative overflow-hidden bg-[linear-gradient(145deg,#020817_0%,#07152e_100%)] p-6 text-white sm:p-9 lg:p-11">
                  <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-blue-400/15" />
                  <div className="pointer-events-none absolute -bottom-32 left-8 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl" />

                  <div className="relative">
                    <div className="flex items-center justify-between gap-5 border-b border-white/10 pb-6">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
                          Escolha o comprimento
                        </p>
                        <p className="mt-2 text-3xl font-bold tracking-[-0.04em] text-white">
                          Largura sempre em 30 cm
                        </p>
                      </div>
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-blue-400/30 bg-blue-500/15 text-blue-300 shadow-[0_0_28px_rgba(37,99,235,0.22)]">
                        <Ruler className="h-6 w-6" />
                      </span>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                      {[
                        ["01", "30 cm × 1 m", "1 metro"],
                        ["02", "30 cm × 2 m", "2 metros"],
                        ["03", "30 cm × 3 m", "3 metros"],
                        ["+", "Mais metros", "Sob consulta"],
                      ].map(([number, measure, label], index) => (
                        <div
                          key={measure}
                          className={`group relative min-h-[132px] overflow-hidden rounded-[18px] border p-4 transition duration-300 hover:-translate-y-1 ${
                            index === 3
                              ? "border-blue-400/45 bg-blue-500/15"
                              : "border-white/10 bg-white/[0.045] hover:border-blue-400/35"
                          }`}
                        >
                          <span className="text-xs font-bold tracking-[0.18em] text-blue-400">
                            {number}
                          </span>
                          <p className="mt-5 text-base font-bold leading-6 text-white">
                            {measure}
                          </p>
                          <p className="mt-1 text-xs font-medium text-slate-400">
                            {label}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 rounded-[20px] border border-white/10 bg-white/[0.045] p-4 sm:p-5">
                      <div className="flex items-start gap-3">
                        <Layers3 className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" />
                        <div>
                          <p className="text-sm font-bold text-white">
                            Como a metragem funciona
                          </p>
                          <p className="mt-1 text-sm leading-6 text-slate-300">
                            A largura não muda. Cada unidade acrescenta
                            comprimento à manta para atender projetos maiores.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                      {[
                        ["1", "Escolha"],
                        ["2", "O instalador mede"],
                        ["3", "Recorte e aplique"],
                      ].map(([number, label]) => (
                        <div key={number} className="relative">
                          <span className="mx-auto flex h-7 w-7 items-center justify-center rounded-full border border-blue-400/40 bg-blue-500/15 text-xs font-bold text-blue-300">
                            {number}
                          </span>
                          <p className="mt-2 text-[11px] font-semibold leading-4 text-slate-400">
                            {label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="entenda-a-tecnologia"
          className="scroll-mt-32 bg-white py-16 sm:py-24 lg:scroll-mt-24"
        >
          <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-10">
            <div className="grid items-center gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16">
              <figure className="mx-auto w-full max-w-[540px] overflow-hidden rounded-[28px] border border-slate-200 bg-[#030816] shadow-[0_32px_90px_-50px_rgba(15,23,42,0.8)] lg:mx-0">
                <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
                      Demonstração real
                    </p>
                    <p className="mt-1 text-sm font-bold text-white">
                      O material reagindo à luz
                    </p>
                  </div>
                  <span className="rounded-full border border-blue-400/25 bg-blue-500/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-blue-300">
                    33 segundos
                  </span>
                </div>

                <video
                  controls
                  playsInline
                  preload="metadata"
                  poster="/ppf-fotocromatico-video-poster.webp"
                  className="aspect-[7/8] w-full bg-black object-cover"
                  aria-label="Demonstração do efeito do PPF fotocromático sob a luz"
                >
                  <source
                    src="/videos/ppf-fotocromatico-tecnologia.mp4"
                    type="video/mp4"
                  />
                  Seu navegador não consegue reproduzir este vídeo.
                </video>

                <figcaption className="border-t border-white/10 px-5 py-4 text-sm leading-6 text-slate-400 sm:px-6">
                  A intensidade e o tempo de transição variam conforme luz UV,
                  temperatura e ambiente.
                </figcaption>
              </figure>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-600">
                  Entenda a tecnologia
                </p>
                <h2 className="mt-4 text-4xl font-bold leading-[1.06] tracking-[-0.04em] text-slate-950 sm:text-[52px]">
                  A aparência muda. A proteção permanece.
                </h2>
                <p className="mt-6 text-base leading-8 text-slate-600">
                  Compostos fotocromáticos respondem à radiação ultravioleta.
                  Com maior exposição, a tonalidade se intensifica; quando a
                  incidência diminui, o material retorna progressivamente ao
                  estado mais claro.
                </p>

                <div className="relative mt-8 grid gap-4 sm:grid-cols-2">
                  <article className="relative overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50 p-6">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm">
                      <MoonStar className="h-5 w-5" />
                    </span>
                    <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      Menor exposição UV
                    </p>
                    <h3 className="mt-2 text-xl font-bold tracking-[-0.03em] text-slate-950">
                      Aparência mais clara
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      Em locais cobertos, à sombra ou com pouca luz solar, o tom
                      tende a ficar mais discreto.
                    </p>
                  </article>

                  <article className="relative overflow-hidden rounded-[24px] border border-blue-400/25 bg-[linear-gradient(145deg,#020817_0%,#07152e_100%)] p-6 text-white shadow-[0_24px_60px_-40px_rgba(37,99,235,0.75)]">
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/70 to-transparent"
                    />
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-400/35 bg-blue-500/15 text-blue-300">
                      <SunMedium className="h-5 w-5" />
                    </span>
                    <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-blue-300">
                      Maior exposição UV
                    </p>
                    <h3 className="mt-2 text-xl font-bold tracking-[-0.03em] text-white">
                      Efeito camaleão ativo
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      Sob luz solar intensa, a coloração ganha presença e
                      transforma o visual do conjunto óptico.
                    </p>
                  </article>
                </div>

                <div className="mt-5 flex items-start gap-3 rounded-[20px] border border-blue-100 bg-blue-50/70 px-4 py-4">
                  <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                  <p className="text-sm leading-6 text-slate-700">
                    O efeito é gradual, não instantâneo. A percepção muda com
                    clima, temperatura, orientação do farol e tempo de exposição.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="comparacao"
          className="scroll-mt-32 bg-slate-50 py-16 sm:py-24 lg:scroll-mt-24"
        >
          <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-10">
            <div className="grid gap-6 lg:grid-cols-[1fr_0.72fr] lg:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-600">
                  Comparação visual
                </p>
                <h2 className="mt-4 text-4xl font-bold leading-[1.06] tracking-[-0.04em] text-slate-950 sm:text-[52px]">
                  A tonalidade muda sem esconder o desenho do farol.
                </h2>
              </div>
              <p className="text-base leading-8 text-slate-600 lg:justify-self-end">
                O objetivo é acrescentar profundidade e personalidade,
                preservando a leitura das linhas originais do conjunto óptico.
              </p>
            </div>

            <figure className="mt-10 overflow-hidden rounded-[28px] border border-slate-200 bg-[#030816] shadow-[0_32px_90px_-50px_rgba(15,23,42,0.65)] sm:rounded-[34px]">
              <div className="relative aspect-[4/3] sm:aspect-[16/9]">
                <Image
                  src="/ppf-fotocromatico-antes-depois.webp"
                  alt="Comparativo do mesmo farol sem película e com PPF fotocromático fumê ativado"
                  fill
                  sizes="(max-width: 1280px) 100vw, 1200px"
                  className="object-cover"
                />
                <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 sm:inset-x-6 sm:bottom-6">
                  <span className="rounded-full border border-white/25 bg-black/65 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur sm:px-4 sm:text-xs">
                    Sem película
                  </span>
                  <span className="rounded-full border border-blue-300/35 bg-blue-600/85 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur sm:px-4 sm:text-xs">
                    PPF ativado
                  </span>
                </div>
              </div>
              <figcaption className="border-t border-white/10 px-5 py-4 text-sm leading-6 text-slate-400 sm:px-6">
                Simulação visual. A tonalidade real varia conforme o produto, o
                farol e as condições de luz.
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-10">
            <div className="relative overflow-hidden rounded-[30px] bg-[linear-gradient(145deg,#020817_0%,#07152e_100%)] px-5 py-8 text-white shadow-[0_36px_100px_-58px_rgba(15,23,42,0.9)] sm:rounded-[36px] sm:px-9 sm:py-12 lg:px-12 lg:py-14">
              <div className="pointer-events-none absolute -right-32 -top-40 h-96 w-96 rounded-full border border-blue-400/15" />
              <div className="pointer-events-none absolute -bottom-48 left-1/4 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
              <div
                aria-hidden="true"
                className="absolute inset-x-20 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent"
              />

              <div className="relative grid gap-7 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-12">
                <div className="max-w-3xl">
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-400">
                    Além da personalização
                  </p>
                  <h2 className="mt-4 text-4xl font-bold leading-[1.05] tracking-[-0.04em] text-white sm:text-[50px]">
                    Proteção para uma das áreas mais expostas do veículo.
                  </h2>
                </div>

                <div>
                  <p className="text-base leading-8 text-slate-300">
                    Pedriscos, poeira, insetos, lavagens e exposição ambiental
                    atingem diretamente a lente. O PPF cria uma camada de
                    proteção sem esconder o desenho original do farol.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {["Impactos leves", "Riscos superficiais", "Exposição diária"].map(
                      (item) => (
                        <span
                          key={item}
                          className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-slate-200"
                        >
                          {item}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </div>

              <div className="relative mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {benefits.map((benefit, index) => {
                  const BenefitIcon = benefit.icon;
                  const number = String(index + 1).padStart(2, "0");

                  return (
                    <article
                      key={benefit.title}
                      className="group relative flex min-h-[196px] flex-col overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.045] p-5 transition duration-300 hover:-translate-y-1 hover:border-blue-400/40 hover:bg-blue-500/[0.08] sm:min-h-[220px] sm:p-6"
                    >
                      <div
                        aria-hidden="true"
                        className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      />

                      <div className="flex items-start justify-between gap-4">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-400/35 bg-blue-500/15 text-blue-300 shadow-[0_0_26px_rgba(37,99,235,0.18)] transition duration-300 group-hover:border-blue-300/60 group-hover:bg-blue-500/25">
                          <BenefitIcon className="h-5 w-5" strokeWidth={1.8} />
                        </span>
                        <span className="text-xs font-bold tracking-[0.18em] text-blue-400">
                          {number}
                        </span>
                      </div>

                      <h3 className="mt-5 text-lg font-bold leading-6 tracking-[-0.02em] text-white">
                        {benefit.title}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-slate-300">
                        {benefit.text}
                      </p>
                    </article>
                  );
                })}
              </div>

              <div className="relative mt-6 flex items-start gap-3 rounded-[20px] border border-blue-400/20 bg-blue-500/10 px-4 py-4 sm:items-center sm:px-5">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-300 sm:mt-0" />
                <p className="text-sm leading-6 text-slate-300">
                  O PPF ajuda a preservar a condição atual da lente. Ele não
                  recupera trincas, opacidade ou desgaste já existente.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-blue-100 bg-[#f5f8ff] py-16 sm:py-24">
          <div className="mx-auto grid max-w-[1240px] items-center gap-10 px-5 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16 lg:px-10">
            <figure className="mx-auto w-full max-w-[500px] overflow-hidden rounded-[28px] border border-blue-100 bg-white shadow-[0_32px_90px_-50px_rgba(37,99,235,0.5)] lg:mx-0">
              <div className="relative aspect-[9/16]">
                <Image
                  src="/ppf-fotocromatico-revitalizacao.webp"
                  alt="Comparativo real de um farol desgastado antes e revitalizado depois do polimento"
                  fill
                  sizes="(max-width: 1024px) 90vw, 500px"
                  className="object-cover"
                />
                <div className="absolute left-4 top-4 rounded-full border border-white/30 bg-slate-950/80 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur sm:left-5 sm:top-5 sm:px-4">
                  Antes · lente desgastada
                </div>
                <div className="absolute left-4 top-[52%] rounded-full border border-blue-200/50 bg-blue-600/90 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur sm:left-5 sm:px-4">
                  Depois · revitalizada
                </div>
              </div>
              <figcaption className="border-t border-slate-100 bg-white px-5 py-4 text-sm leading-6 text-slate-500">
                Resultado variável conforme o desgaste e o processo indicado
                para cada lente.
              </figcaption>
            </figure>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-600">
                Preparação antes do PPF
              </p>
              <h2 className="mt-4 text-4xl font-bold leading-[1.06] tracking-[-0.04em] text-slate-950 sm:text-[52px]">
                Primeiro recuperar. Depois proteger.
              </h2>
              <p className="mt-6 text-base leading-8 text-slate-600">
                O PPF preserva a condição atual do farol. Se a lente estiver
                opaca, amarelada ou marcada, a revitalização profissional deve
                ser feita antes da aplicação.
              </p>

              <div className="relative mt-8">
                <div
                  aria-hidden="true"
                  className="absolute bottom-8 left-5 top-8 w-px bg-gradient-to-b from-blue-200 via-blue-500 to-blue-200 sm:left-6"
                />
                <div className="grid gap-4">
                  {[
                    ["01", "Avaliar a lente", "Identificar opacidade, amarelamento, trincas e marcas."],
                    ["02", "Revitalizar quando necessário", "Executar o polimento correto para recuperar transparência e uniformidade."],
                    ["03", "Aplicar sobre a base pronta", "Limpar, descontaminar e instalar o PPF na superfície preparada."],
                  ].map(([number, title, text]) => (
                    <article
                      key={number}
                      className="relative flex items-start gap-4 rounded-[22px] border border-blue-100 bg-white p-4 shadow-[0_18px_50px_-42px_rgba(37,99,235,0.55)] sm:p-5"
                    >
                      <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-white bg-blue-600 text-xs font-bold text-white shadow-md sm:h-12 sm:w-12">
                        {number}
                      </span>
                      <div className="pt-1">
                        <h3 className="text-lg font-bold tracking-[-0.02em] text-slate-950">
                          {title}
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          {text}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex items-start gap-3 rounded-[20px] border border-emerald-200 bg-emerald-50 px-4 py-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <p className="text-sm leading-6 text-slate-700">
                  <strong className="font-bold text-slate-950">
                    Farol íntegro não precisa de polimento.
                  </strong>{" "}
                  Limpeza e descontaminação corretas são suficientes.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#030816] py-16 text-white sm:py-24">
          <div className="mx-auto grid max-w-[1240px] items-center gap-10 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-10">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] border border-white/10 bg-slate-900 shadow-[0_30px_80px_-48px_rgba(37,99,235,0.55)]">
              <Image
                src="/ppf-fotocromatico-aplicacao.webp"
                alt="Aplicação profissional de PPF em um farol automotivo com espátula"
                fill
                sizes="(max-width: 1024px) 100vw, 650px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-white/5" />
              <div className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-black/60 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur sm:bottom-5 sm:left-5">
                Aplicação ilustrativa
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-400">
                Instalação profissional recomendada
              </p>
              <h2 className="mt-4 text-4xl font-bold leading-[1.06] tracking-[-0.04em] text-white sm:text-[50px]">
                A qualidade final depende da aplicação.
              </h2>
              <p className="mt-6 text-base leading-8 text-slate-300">
                Como o material chega em manta, o profissional precisa medir,
                posicionar, conformar e recortar o PPF para cada farol,
                respeitando curvas, bordas e o formato da lente.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  "Medição e aproveitamento da manta",
                  "Controle de tensão nas curvas",
                  "Recorte seguro das bordas",
                  "Avaliação e limpeza da lente",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex min-h-16 items-start gap-3 rounded-[18px] border border-white/10 bg-white/[0.045] px-4 py-4 text-sm leading-6 text-slate-300"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-[20px] border border-blue-400/25 bg-blue-500/10 px-5 py-5">
                <p className="text-sm font-bold text-white">
                  Por que recomendamos um profissional?
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Para obter uniformidade, boa fixação e acabamento correto sem
                  comprometer a lente ou o próprio material.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-100 bg-slate-50 py-16 sm:py-24">
          <div className="mx-auto grid max-w-[1240px] gap-10 px-5 sm:px-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start lg:gap-14 lg:px-10">
            <div className="lg:sticky lg:top-28">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-600">
                Informações do material
              </p>
              <h2 className="mt-4 text-4xl font-bold leading-[1.06] tracking-[-0.04em] text-slate-950 sm:text-[48px]">
                Especificação clara, sem letras miúdas.
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-600">
                Consulte as características principais antes de definir a
                metragem e planejar a instalação.
              </p>

              <div className="mt-7 grid grid-cols-2 gap-3">
                <div className="rounded-[20px] border border-blue-100 bg-blue-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600">
                    Espessura
                  </p>
                  <p className="mt-2 text-xl font-bold text-slate-950">
                    165 micras
                  </p>
                </div>
                <div className="rounded-[20px] border border-blue-100 bg-blue-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600">
                    Largura
                  </p>
                  <p className="mt-2 text-xl font-bold text-slate-950">
                    30 cm
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_28px_80px_-58px_rgba(15,23,42,0.5)]">
              {specifications.map(([label, value], index) => (
                <div
                  key={label}
                  className="grid gap-2 border-b border-slate-100 px-5 py-4 last:border-b-0 sm:grid-cols-[0.85fr_1.15fr] sm:items-center sm:px-7"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-bold tracking-[0.16em] text-blue-500">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="text-sm font-medium text-slate-500">
                      {label}
                    </p>
                  </div>
                  <p className="text-base font-bold text-slate-900 sm:text-right">
                    {value}
                  </p>
                </div>
              ))}
              <p className="border-t border-slate-100 bg-slate-50 px-5 py-4 text-sm leading-6 text-slate-500 sm:px-7">
                *A durabilidade estimada varia conforme clima, exposição,
                manutenção, condição da lente e qualidade da instalação.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-10">
            <div className="relative overflow-hidden rounded-[28px] border border-amber-300/25 bg-[linear-gradient(145deg,#090d18_0%,#15120a_100%)] px-6 py-8 text-white shadow-[0_32px_90px_-54px_rgba(15,23,42,0.8)] sm:rounded-[34px] sm:px-10 sm:py-11 lg:px-12">
              <div className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full border border-amber-300/10" />
              <div className="relative grid gap-6 lg:grid-cols-[auto_1fr] lg:gap-8">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-300/25 bg-amber-400/10 text-amber-300">
                  <CircleAlert className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
                    Uso responsável e legislação
                  </p>
                  <h2 className="mt-4 max-w-4xl text-3xl font-bold leading-tight tracking-[-0.035em] text-white sm:text-[42px]">
                    Verifique a regulamentação antes de comprar e aplicar.
                  </h2>
                  <p className="mt-5 max-w-4xl text-base leading-8 text-slate-300">
                    No Brasil, o art. 10, inciso II, da Resolução CONTRAN nº
                    970/2022 veda películas ou materiais não originais nos
                    dispositivos de iluminação ou sinalização de veículos em
                    circulação. A alteração não pode comprometer cor,
                    intensidade ou eficiência luminosa.
                  </p>
                  <p className="mt-4 max-w-4xl text-base leading-8 text-slate-300">
                    Para projetos de exposição, uso privado ou fora de vias
                    públicas, confirme previamente as condições adequadas de
                    aplicação.
                  </p>
                  <a
                    href="https://www.gov.br/transportes/pt-br/assuntos/transito/conteudo-contran/resolucoes/resolucao9702022.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-7 inline-flex min-h-12 items-center gap-3 rounded-xl border border-amber-300/25 bg-amber-400/10 px-5 text-sm font-bold text-amber-200 transition hover:border-amber-200/50 hover:bg-amber-400/15 hover:text-white"
                  >
                    Consultar a resolução oficial
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-100 bg-slate-50 py-16 sm:py-24">
          <div className="mx-auto grid max-w-[1240px] gap-9 px-5 sm:px-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-14 lg:px-10">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-600">
                Dúvidas importantes
              </p>
              <h2 className="mt-4 text-4xl font-bold leading-[1.06] tracking-[-0.04em] text-slate-950 sm:text-[48px]">
                Saiba antes de aplicar.
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-600">
                Toque em uma pergunta para consultar a resposta. As orientações
                evitam expectativas incorretas sobre o produto e a instalação.
              </p>
            </div>

            <div className="grid gap-3">
              {questions.map((question, index) => (
                <details
                  key={question.title}
                  className="group overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-sm open:border-blue-200 open:shadow-[0_18px_50px_-42px_rgba(37,99,235,0.6)]"
                >
                  <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-5 marker:hidden sm:px-6">
                    <span className="text-xs font-bold tracking-[0.16em] text-blue-500">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="min-w-0 flex-1 text-base font-bold leading-6 tracking-[-0.015em] text-slate-950 sm:text-lg">
                      {question.title}
                    </h3>
                    <span
                      aria-hidden="true"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 text-lg text-slate-500 transition duration-300 group-open:rotate-45 group-open:border-blue-200 group-open:bg-blue-50 group-open:text-blue-600"
                    >
                      +
                    </span>
                  </summary>
                  <div className="border-t border-slate-100 px-5 py-5 sm:px-6">
                    <p className="text-sm leading-7 text-slate-600">
                      {question.text}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-10">
            <div className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#1264f5_0%,#1748c7_100%)] px-6 py-10 text-white shadow-[0_32px_90px_-48px_rgba(37,99,235,0.75)] sm:rounded-[34px] sm:px-10 lg:px-14 lg:py-13">
              <div className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full border border-white/20" />
              <div className="pointer-events-none absolute -bottom-36 right-40 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

              <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="max-w-3xl">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-100">
                    Atendimento direto
                  </p>
                  <h2 className="mt-3 text-3xl font-bold leading-tight tracking-[-0.035em] text-white sm:text-[44px]">
                    Precisa calcular a metragem para o seu projeto?
                  </h2>
                  <p className="mt-4 max-w-2xl text-base leading-8 text-blue-100">
                    Envie o modelo e o ano do veículo. Nossa equipe orienta
                    sobre a quantidade de material e os cuidados antes da
                    compra.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {["Orientação de metragem", "Compatibilidade", "Atendimento humano"].map(
                      (item) => (
                        <span
                          key={item}
                          className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white"
                        >
                          {item}
                        </span>
                      ),
                    )}
                  </div>
                </div>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-13 min-w-[250px] items-center justify-center gap-3 rounded-xl bg-white px-6 text-sm font-bold text-blue-700 shadow-lg shadow-blue-950/20 transition hover:-translate-y-0.5 hover:bg-blue-50"
                >
                  <PlatformIcon
                    name="whatsapp"
                    className="h-5 w-5 text-[#159f50]"
                  />
                  Consultar metragem
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
