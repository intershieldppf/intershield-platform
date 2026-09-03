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

        <section className="border-b border-slate-100 bg-white">
          <div className="mx-auto grid max-w-[1240px] divide-y divide-slate-100 px-6 sm:grid-cols-2 sm:divide-x sm:divide-y-0 sm:px-8 lg:grid-cols-4 lg:px-10">
            {[
              ["01", "Proteção física"],
              ["02", "Efeito adaptativo"],
              ["03", "Brilho premium"],
              ["04", "Aplicação especializada"],
            ].map(([number, label]) => (
              <div key={label} className="flex items-center gap-4 px-5 py-6 first:pl-0 last:pr-0">
                <span className="text-xs font-bold tracking-[0.18em] text-blue-600">{number}</span>
                <p className="text-sm font-bold text-slate-800">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-b border-slate-100 bg-white py-16 sm:py-20">
          <div className="mx-auto grid max-w-[1240px] items-center gap-10 px-6 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16 lg:px-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-blue-600">
                Formato de venda
              </p>
              <h2 className="mt-4 text-4xl font-bold leading-tight tracking-[-0.04em] text-slate-950 sm:text-[50px]">
                Não é kit pré-cortado.
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-600">
                O PPF fotocromático é fornecido em manta com <strong className="font-bold text-slate-950">30 cm de largura fixa</strong>. Você escolhe o comprimento necessário em metros, de acordo com o projeto.
              </p>
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 text-sm leading-7 text-slate-700">
                <Scissors className="mt-1 h-5 w-5 shrink-0 text-blue-600" />
                <p>O recorte no formato do farol é realizado pelo instalador durante a aplicação.</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-[30px] bg-[#030816] p-6 text-white shadow-[0_30px_80px_-50px_rgba(37,99,235,0.8)] sm:p-8">
              <div className="flex items-center justify-between gap-5 border-b border-white/10 pb-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
                    Largura da manta
                  </p>
                  <p className="mt-2 text-3xl font-bold tracking-[-0.04em]">0,30 metro</p>
                </div>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600">
                  <Ruler className="h-6 w-6" />
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {["0,30 × 1 m", "0,30 × 2 m", "0,30 × 3 m", "Mais metros"].map(
                  (measure, index) => (
                    <div
                      key={measure}
                      className={`rounded-2xl border px-4 py-5 ${
                        index === 3
                          ? "border-blue-400/30 bg-blue-500/15"
                          : "border-white/10 bg-white/[0.04]"
                      }`}
                    >
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                        {index === 3 ? "Sob medida" : "Opção"}
                      </p>
                      <p className="mt-2 text-base font-bold text-white">{measure}</p>
                    </div>
                  ),
                )}
              </div>

              <p className="mt-5 text-sm leading-7 text-slate-400">
                A largura permanece em 30 cm; o comprimento aumenta conforme a metragem selecionada no pedido.
              </p>
            </div>
          </div>
        </section>

        <section
          id="entenda-a-tecnologia"
          className="scroll-mt-24 bg-white py-20 sm:py-24"
        >
          <div className="mx-auto max-w-[1240px] px-6 sm:px-8 lg:px-10">
            <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
              <figure className="mx-auto w-full max-w-[560px] overflow-hidden rounded-[30px] border border-slate-200 bg-[#030816] shadow-[0_32px_80px_-46px_rgba(15,23,42,0.7)] lg:mx-0">
                <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-6">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-blue-400">
                      Demonstração real
                    </p>
                    <p className="mt-1 text-sm font-bold text-white">
                      Veja o material reagindo à luz
                    </p>
                  </div>
                  <span className="rounded-full border border-blue-400/25 bg-blue-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-blue-300">
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

                <figcaption className="border-t border-white/10 px-5 py-4 text-xs leading-6 text-slate-400 sm:px-6">
                  A intensidade e o tempo de transição podem variar conforme a incidência UV, a temperatura e o ambiente.
                </figcaption>
              </figure>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.26em] text-blue-600">
                  Entenda a tecnologia
                </p>
                <h2 className="mt-4 text-4xl font-bold leading-tight tracking-[-0.04em] text-slate-950 sm:text-[52px]">
                  A aparência muda. A proteção permanece.
                </h2>
                <p className="mt-6 text-base leading-8 text-slate-600">
                  Compostos fotocromáticos respondem à radiação ultravioleta presente na luz solar. Com maior exposição, a tonalidade do filme se intensifica; quando a incidência diminui, o material retorna progressivamente ao estado mais claro.
                </p>
                <p className="mt-4 text-base leading-8 text-slate-600">
                  O efeito não funciona como um interruptor. A velocidade e a intensidade da transição variam com luz, temperatura, clima e tempo de exposição — por isso cada ambiente pode produzir uma percepção diferente.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <article className="rounded-[24px] border border-slate-200 bg-slate-50 p-6">
                    <MoonStar className="h-6 w-6 text-slate-700" />
                    <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                      Menor exposição UV
                    </p>
                    <h3 className="mt-3 text-xl font-bold tracking-[-0.03em] text-slate-950">
                      Aparência mais clara
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      Em locais cobertos, à sombra ou com pouca incidência solar, o tom tende a ficar mais discreto.
                    </p>
                  </article>

                  <article className="rounded-[24px] border border-blue-500/20 bg-[#06112b] p-6 text-white">
                    <SunMedium className="h-6 w-6 text-blue-400" />
                    <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-300">
                      Maior exposição UV
                    </p>
                    <h3 className="mt-3 text-xl font-bold tracking-[-0.03em] text-white">
                      Efeito camaleão ativo
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-300">
                      Sob luz solar mais intensa, a coloração ganha presença e transforma o visual do conjunto óptico.
                    </p>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="comparacao" className="scroll-mt-24 bg-slate-50 py-20 sm:py-24">
          <div className="mx-auto max-w-[1240px] px-6 sm:px-8 lg:px-10">
            <div className="grid gap-6 lg:grid-cols-[1fr_0.7fr] lg:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.26em] text-blue-600">
                  Antes e depois
                </p>
                <h2 className="mt-4 text-4xl font-bold tracking-[-0.04em] text-slate-950 sm:text-[52px]">
                  Uma mudança visível, sem esconder o desenho do farol.
                </h2>
              </div>
              <p className="text-base leading-8 text-slate-600 lg:justify-self-end">
                A proposta é criar profundidade e personalidade mantendo a leitura das linhas originais do conjunto óptico.
              </p>
            </div>

            <figure className="mt-12 overflow-hidden rounded-[32px] border border-slate-200 bg-slate-950 shadow-[0_32px_80px_-46px_rgba(15,23,42,0.55)]">
              <div className="relative aspect-[16/9]">
                <Image
                  src="/ppf-fotocromatico-antes-depois.webp"
                  alt="Comparativo do mesmo farol sem película e com PPF fotocromático fumê ativado"
                  fill
                  sizes="(max-width: 1280px) 100vw, 1200px"
                  className="object-cover"
                />
                <div className="absolute left-4 top-4 rounded-full border border-white/30 bg-black/55 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white backdrop-blur sm:left-6 sm:top-6">
                  Antes · sem película
                </div>
                <div className="absolute right-4 top-4 rounded-full border border-blue-300/35 bg-blue-700/75 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white backdrop-blur sm:right-6 sm:top-6">
                  Depois · PPF ativado
                </div>
              </div>
              <figcaption className="border-t border-white/10 bg-[#030816] px-6 py-4 text-sm leading-6 text-slate-400">
                Simulação visual do efeito fotocromático. A tonalidade real pode variar conforme o produto, o farol e as condições de luz.
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-[1240px] px-6 sm:px-8 lg:px-10">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-blue-600">
                Além da personalização
              </p>
              <h2 className="mt-4 text-4xl font-bold tracking-[-0.04em] text-slate-950 sm:text-[52px]">
                O farol está na linha de frente do veículo.
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-600">
                Pedriscos, poeira, insetos, lavagens e exposição ambiental atingem diretamente a lente. O PPF adiciona uma camada protetora sobre essa superfície vulnerável e ajuda a preservar sua aparência.
              </p>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {benefits.map((benefit) => {
                const BenefitIcon = benefit.icon;

                return (
                  <article
                    key={benefit.title}
                    className="rounded-[26px] border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_24px_60px_-38px_rgba(37,99,235,0.35)]"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white">
                      <BenefitIcon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-6 text-xl font-bold tracking-[-0.025em] text-slate-950">
                      {benefit.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{benefit.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-y border-blue-100 bg-[#f5f8ff] py-20 sm:py-24">
          <div className="mx-auto grid max-w-[1240px] items-center gap-12 px-6 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16 lg:px-10">
            <figure className="mx-auto w-full max-w-[520px] overflow-hidden rounded-[30px] border border-blue-100 bg-white shadow-[0_32px_80px_-46px_rgba(37,99,235,0.45)] lg:mx-0">
              <div className="relative aspect-[9/16]">
                <Image
                  src="/ppf-fotocromatico-revitalizacao.webp"
                  alt="Comparativo real de um farol desgastado antes e revitalizado depois do polimento"
                  fill
                  sizes="(max-width: 1024px) 90vw, 500px"
                  className="object-cover"
                />
                <div className="absolute left-4 top-4 rounded-full border border-white/30 bg-slate-950/80 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur sm:left-5 sm:top-5">
                  Antes · lente desgastada
                </div>
                <div className="absolute left-4 top-[52%] rounded-full border border-blue-200/50 bg-blue-600/90 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur sm:left-5">
                  Depois · lente revitalizada
                </div>
              </div>
              <figcaption className="border-t border-slate-100 bg-white px-5 py-4 text-xs leading-6 text-slate-500">
                Comparativo real de revitalização. O resultado varia conforme o nível de desgaste e o processo indicado para cada lente.
              </figcaption>
            </figure>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-blue-600">
                Preparação antes do PPF
              </p>
              <h2 className="mt-4 text-4xl font-bold leading-[1.06] tracking-[-0.04em] text-slate-950 sm:text-[52px]">
                O PPF protege. A revitalização recupera o que já foi desgastado.
              </h2>
              <p className="mt-6 text-base leading-8 text-slate-600">
                A película acompanha e preserva a condição atual do farol. Por isso, se a lente estiver opaca, amarelada, sem brilho ou com marcas de desgaste, ela deve ser revitalizada antes da aplicação. Um polimento profissional adequado cria uma base mais transparente e uniforme, favorecendo o brilho e o acabamento final do PPF.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  ["01", "Avaliar", "Identificar opacidade, amarelamento e marcas na lente."],
                  ["02", "Revitalizar", "Executar o polimento correto quando houver desgaste."],
                  ["03", "Proteger", "Aplicar o PPF somente sobre a superfície pronta e limpa."],
                ].map(([number, title, text]) => (
                  <article key={number} className="rounded-[22px] border border-blue-100 bg-white p-5">
                    <span className="text-xs font-bold tracking-[0.18em] text-blue-600">{number}</span>
                    <h3 className="mt-5 text-lg font-bold tracking-[-0.02em] text-slate-950">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
                  </article>
                ))}
              </div>

              <div className="mt-6 flex items-start gap-3 rounded-[22px] border border-blue-200 bg-blue-600 px-5 py-5 text-white shadow-[0_18px_45px_-30px_rgba(37,99,235,0.8)]">
                <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-blue-100" />
                <p className="text-sm leading-7">
                  <strong>Farol em bom estado não precisa de polimento.</strong> Quando a lente está íntegra, a preparação correta consiste em limpeza e descontaminação completas, evitando desgaste desnecessário da superfície.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#030816] py-20 text-white sm:py-24">
          <div className="mx-auto grid max-w-[1240px] items-center gap-12 px-6 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16 lg:px-10">
            <div className="relative aspect-[3/2] overflow-hidden rounded-[30px] border border-white/10 bg-slate-900">
              <Image
                src="/ppf-fotocromatico-aplicacao.webp"
                alt="Aplicação profissional de PPF em um farol automotivo com espátula"
                fill
                sizes="(max-width: 1024px) 100vw, 650px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/5" />
              <div className="absolute bottom-5 left-5 rounded-full border border-white/20 bg-black/55 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white backdrop-blur">
                Aplicação ilustrativa
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-blue-400">
                Instalação profissional recomendada
              </p>
              <h2 className="mt-4 text-4xl font-bold leading-tight tracking-[-0.04em] text-white sm:text-[50px]">
                Farol não é aplicação de peça pré-cortada.
              </h2>
              <p className="mt-6 text-base leading-8 text-slate-300">
                Diferente dos kits para peças internas, este material chega em manta. O profissional precisa medir, posicionar, conformar e recortar o PPF diretamente para cada farol, respeitando curvas, bordas e o formato específico da lente.
              </p>

              <div className="mt-7 space-y-4">
                {[
                  "Medição e melhor aproveitamento da manta",
                  "Controle de tensão nas curvas complexas do farol",
                  "Recorte seguro e acabamento preciso das bordas",
                  "Avaliação da lente e revitalização, quando necessária",
                  "Superfície descontaminada e completamente limpa",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 text-sm leading-6 text-slate-300">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <p className="mt-7 border-l-2 border-blue-500 pl-4 text-sm font-semibold leading-7 text-white">
                Recomendamos fortemente a instalação por um profissional com experiência em PPF automotivo. É a escolha mais segura para obter uniformidade, boa fixação e acabamento correto.
              </p>

            </div>
          </div>
        </section>

        <section className="border-y border-slate-100 bg-slate-50 py-20 sm:py-24">
          <div className="mx-auto grid max-w-[1240px] gap-12 px-6 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:px-10">
            <div className="lg:sticky lg:top-28">
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-blue-600">
                Informações do material
              </p>
              <h2 className="mt-4 text-4xl font-bold tracking-[-0.04em] text-slate-950 sm:text-[48px]">
                Tecnologia com especificação clara.
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-600">
                Números ajudam na escolha, mas o resultado final também depende da preparação da lente, da instalação, do uso e da conservação.
              </p>
            </div>

            <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white">
              {specifications.map(([label, value]) => (
                <div
                  key={label}
                  className="grid gap-2 border-b border-slate-100 px-6 py-5 last:border-b-0 sm:grid-cols-[0.85fr_1.15fr] sm:items-center sm:px-8"
                >
                  <p className="text-sm font-medium text-slate-500">{label}</p>
                  <p className="text-base font-bold text-slate-900 sm:text-right">{value}</p>
                </div>
              ))}
              <p className="border-t border-slate-100 bg-slate-50 px-6 py-4 text-xs leading-6 text-slate-500 sm:px-8">
                *Durabilidade estimada conforme informação do material. Pode variar por clima, exposição, manutenção, condições da lente e qualidade da instalação.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-[1240px] px-6 sm:px-8 lg:px-10">
            <div className="rounded-[32px] border border-blue-500/20 bg-[#030816] px-7 py-10 text-white sm:px-10 lg:px-12 lg:py-12">
              <div className="grid gap-8 lg:grid-cols-[auto_1fr] lg:gap-8">
                <CircleAlert className="h-8 w-8 text-blue-400" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-300">
                    Uso responsável e legislação
                  </p>
                  <h2 className="mt-4 text-3xl font-bold tracking-[-0.035em] text-white sm:text-[42px]">
                    Antes de aplicar, verifique onde o veículo será utilizado.
                  </h2>
                  <p className="mt-5 max-w-4xl text-base leading-8 text-slate-300">
                    No Brasil, o art. 10, inciso II, da Resolução CONTRAN nº 970/2022 veda a colocação de películas ou materiais não originais do fabricante nos dispositivos de iluminação ou sinalização de veículos em circulação. A alteração também não pode comprometer cor, intensidade ou eficiência luminosa do farol.
                  </p>
                  <p className="mt-4 max-w-4xl text-base leading-8 text-slate-300">
                    Confirme a regulamentação aplicável antes da compra e da instalação. Para projetos de exposição, uso privado ou fora de vias públicas, consulte previamente as condições adequadas de aplicação.
                  </p>
                  <a
                    href="https://www.gov.br/transportes/pt-br/assuntos/transito/conteudo-contran/resolucoes/resolucao9702022.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-blue-300 transition hover:text-white"
                  >
                    Consultar a resolução oficial
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-100 bg-slate-50 py-20 sm:py-24">
          <div className="mx-auto grid max-w-[1240px] gap-10 px-6 sm:px-8 lg:grid-cols-[0.7fr_1.3fr] lg:px-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-blue-600">
                Dúvidas importantes
              </p>
              <h2 className="mt-4 text-4xl font-bold tracking-[-0.04em] text-slate-950 sm:text-[48px]">
                Saiba antes de aplicar.
              </h2>
            </div>

            <div className="grid gap-4">
              {questions.map((question) => (
                <article key={question.title} className="rounded-[22px] border border-slate-200 bg-white p-6 sm:p-7">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                    <div>
                      <h3 className="text-lg font-bold tracking-[-0.02em] text-slate-950">
                        {question.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-slate-600">{question.text}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-[1240px] px-6 sm:px-8 lg:px-10">
            <div className="relative overflow-hidden rounded-[34px] bg-blue-600 px-7 py-12 text-white sm:px-10 lg:px-14 lg:py-14">
              <div className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full border border-white/20" />
              <div className="relative grid gap-9 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="max-w-3xl">
                  <h2 className="text-3xl font-bold tracking-[-0.035em] text-white sm:text-[44px]">
                    Precisa calcular a metragem para o seu projeto?
                  </h2>
                  <p className="mt-4 max-w-2xl text-base leading-8 text-blue-100">
                    Envie o modelo e o ano do veículo. Nossa equipe orienta sobre a quantidade de material e os cuidados antes da compra. Para a aplicação, procure um profissional experiente em PPF.
                  </p>
                </div>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 min-w-[240px] items-center justify-center gap-3 rounded-xl bg-white px-6 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
                >
                  <PlatformIcon name="whatsapp" className="h-5 w-5 text-[#25D366]" />
                  Consultar metragem
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
