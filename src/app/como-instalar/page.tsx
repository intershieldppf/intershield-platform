import type { Metadata } from "next";
import {
  Box,
  CheckCircle2,
  Clock3,
  Droplets,
  Hand,
  Layers,
  MessageCircle,
  Move,
  Play,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Header } from "@/components/layout/Header";
import { PlatformIcon } from "@/components/ui/PlatformIcon";

export const metadata: Metadata = {
  title: "Como instalar PPF pré-cortado",
  description:
    "Aprenda a instalar o PPF pré-cortado da InterShield com aplicação úmida, vídeos reais, orientações de posicionamento, acabamento e cura.",
  alternates: { canonical: "/como-instalar" },
};

const whatsappUrl =
  "https://wa.me/5531997146624?text=Ol%C3%A1%21%20Estou%20instalando%20meu%20kit%20InterShield%20e%20preciso%20de%20ajuda.";

const installationSteps = [
  {
    number: "01",
    icon: Box,
    title: "Prepare tudo",
    text: "Trabalhe em um local limpo, protegido do sol, do vento e da poeira. Separe o PPF pré-cortado, a solução, o borrifador, a espátula personalizada e uma microfibra limpa.",
    emphasis: "Lave e seque bem as mãos antes de tocar no material.",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "Limpe e higienize",
    text: "Remova completamente poeira, gordura, cera, silicone e outros resíduos. Use água com detergente neutro ou um produto adequado e confira a superfície contra a luz.",
    emphasis: "Depois da limpeza, não toque novamente na área de aplicação.",
  },
  {
    number: "03",
    icon: Droplets,
    title: "Aplique a solução",
    text: "Borrife a solução por toda a superfície. Retire o liner aos poucos e também umedeça o lado adesivo do PPF, evitando o contato com mãos secas ou sujas.",
    emphasis: "A aplicação úmida permite movimentar o PPF antes da fixação.",
  },
  {
    number: "04",
    icon: Layers,
    title: "Posicione e alinhe",
    text: "Coloque o PPF ainda molhado sobre a peça e deslize com cuidado até alinhar bordas, curvas e recortes. Confira todo o encaixe antes de começar a fixação.",
    emphasis: "Se desalinhou, levante com cuidado, umedeça e reposicione.",
  },
  {
    number: "05",
    icon: Move,
    title: "Fixe com a espátula",
    text: "Passe a espátula do centro para as bordas, usando movimentos curtos, firmes e sobrepostos para retirar a solução e o ar acumulado.",
    emphasis: "Use pressão controlada para não deslocar ou marcar o material.",
  },
  {
    number: "06",
    icon: CheckCircle2,
    title: "Finalize e respeite a cura",
    text: "Seque a área ao redor, confirme a fixação das bordas e evite tocar, lavar ou molhar a peça durante as primeiras 48 horas.",
    emphasis: "Não perfure bolhas nem utilize soprador térmico. Em caso de dúvida, fale conosco.",
  },
] as const;

type VideoChapterProps = {
  number: string;
  title: string;
  description: string;
  duration: string;
  src: string;
  label: string;
  points: readonly string[];
  reverse?: boolean;
};

function VideoChapter({
  number,
  title,
  description,
  duration,
  src,
  label,
  points,
  reverse = false,
}: VideoChapterProps) {
  return (
    <article className="grid items-center gap-8 rounded-[32px] border border-white/10 bg-white/[0.045] p-5 sm:p-7 lg:grid-cols-2 lg:gap-12 lg:p-10">
      <div
        className={`mx-auto w-full max-w-[360px] ${reverse ? "lg:order-2" : ""}`}
      >
        <div className="overflow-hidden rounded-[28px] border border-white/15 bg-black shadow-[0_28px_70px_-35px_rgba(37,99,235,0.65)]">
          <video
            controls
            playsInline
            preload="metadata"
            poster="/como-instalar-capa-intershield.png"
            aria-label={label}
            className="aspect-[9/16] w-full bg-black object-cover"
          >
            <source src={src} type="video/mp4" />
            Seu navegador não conseguiu reproduzir este vídeo.
          </video>
        </div>
      </div>

      <div className={reverse ? "lg:order-1" : ""}>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-[0.22em] text-blue-400">
            Vídeo {number}
          </span>
          <span className="h-px w-10 bg-blue-500/50" />
          <span className="text-xs font-medium text-slate-500">{duration}</span>
        </div>
        <h3 className="mt-5 max-w-xl text-3xl font-bold leading-tight tracking-[-0.03em] text-white sm:text-[40px]">
          {title}
        </h3>
        <p className="mt-5 max-w-xl text-base leading-8 text-slate-300">
          {description}
        </p>

        <div className="mt-7 space-y-3">
          {points.map((point) => (
            <div key={point} className="flex items-start gap-3 text-sm leading-6 text-slate-300">
              <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-blue-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </span>
              <span>{point}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function ComoInstalarPage() {
  return (
    <div id="top" className="min-h-screen bg-white text-slate-950">
      <Header />

      <main className="overflow-hidden">
        <section className="relative border-b border-slate-100 bg-white">
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[46%] bg-[linear-gradient(135deg,transparent_0%,#eff6ff_100%)] lg:block" />
          <div className="relative mx-auto grid min-h-[570px] max-w-[1320px] items-center gap-14 px-6 py-16 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:px-10 lg:py-20">
            <div className="max-w-[720px]">
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-blue-600">
                Guia de aplicação
              </p>
              <h1 className="mt-5 text-[46px] font-bold leading-[0.98] tracking-[-0.045em] text-slate-950 sm:text-[64px] lg:text-[72px]">
                Instale com calma. Finalize com <span className="text-blue-600">precisão.</span>
              </h1>
              <p className="mt-7 max-w-[650px] text-base leading-8 text-slate-600 sm:text-[17px]">
                O PPF já chega pré-cortado no formato da peça. Aqui você encontra vídeos reais e um passo a passo direto para preparar, posicionar e finalizar a aplicação com mais segurança.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#videos"
                  className="inline-flex h-12 items-center justify-center gap-3 rounded-xl bg-slate-950 px-6 text-sm font-bold text-white transition hover:bg-blue-600"
                >
                  <Play className="h-4 w-4 fill-current" />
                  Assistir aos vídeos
                </a>
                <a
                  href="#passo-a-passo"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-bold text-slate-800 transition hover:border-blue-200 hover:text-blue-600"
                >
                  Ver passo a passo
                </a>
              </div>
            </div>

            <div className="relative lg:pl-14">
              <div className="absolute bottom-0 left-0 top-0 hidden w-px bg-gradient-to-b from-transparent via-blue-200 to-transparent lg:block" />

              <div className="flex items-center gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                  <Hand className="h-5 w-5" />
                </span>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-600">
                  Instalação guiada
                </p>
              </div>

              <h2 className="mt-7 text-[42px] font-bold leading-[0.98] tracking-[-0.045em] text-slate-950 sm:text-[54px]">
                Faça você mesmo.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-8 text-slate-600">
                Com o PPF pré-cortado, a espátula inclusa e este guia, você pode realizar a aplicação seguindo cada etapa com calma e atenção.
              </p>

              <div className="mt-9 border-t border-slate-200 pt-8">
                <div className="flex items-start gap-4">
                  <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-blue-600" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                      Nossa recomendação
                    </p>
                    <h3 className="mt-3 text-xl font-bold tracking-[-0.02em] text-slate-950 sm:text-2xl">
                      Para máxima precisão, prefira um profissional.
                    </h3>
                    <p className="mt-3 max-w-lg text-base leading-7 text-slate-600">
                      A instalação profissional oferece mais segurança no posicionamento, na fixação e no acabamento final da peça.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="videos" className="scroll-mt-24 bg-[#030816] py-20 text-white sm:py-24">
          <div className="mx-auto max-w-[1240px] px-6 sm:px-8 lg:px-10">
            <div className="mb-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-blue-400">
                  Aplicações reais
                </p>
                <h2 className="mt-4 text-4xl font-bold tracking-[-0.035em] text-white sm:text-[52px]">
                  Veja o processo antes de começar
                </h2>
              </div>
              <p className="max-w-md text-sm leading-7 text-slate-400">
                Assista aos dois exemplos completos. Ative o som e observe principalmente o alinhamento, a direção da espátula e a secagem final.
              </p>
            </div>

            <div className="space-y-8">
              <VideoChapter
                number="01"
                title="Posicionamento e retirada da solução"
                description="A aplicação úmida permite ajustar a película antes da fixação. Neste exemplo, observe como o encaixe é conferido primeiro e como a solução é removida sem pressa."
                duration="21 segundos"
                src="/videos/como-instalar-01.mp4"
                label="Vídeo de aplicação de PPF em tela multimídia com posicionamento e acabamento"
                points={[
                  "Alinhamento completo antes da primeira passada",
                  "Espátula conduzida do centro para os cantos",
                  "Secagem cuidadosa com microfibra limpa",
                ]}
              />

              <VideoChapter
                number="02"
                title="Fixação em uma tela integrada ao painel"
                description="Um segundo formato de multimídia mostra que a técnica permanece a mesma: superfície preparada, PPF bem alinhado e pressão controlada até o acabamento final."
                duration="37 segundos"
                src="/videos/como-instalar-02.mp4"
                label="Vídeo de aplicação de PPF em tela multimídia integrada ao painel"
                points={[
                  "Aplicação úmida para facilitar o posicionamento",
                  "Movimentos curtos e sobrepostos com a espátula",
                  "Revisão das bordas antes de finalizar",
                ]}
                reverse
              />
            </div>
          </div>
        </section>

        <section id="passo-a-passo" className="scroll-mt-24 bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-[1240px] px-6 sm:px-8 lg:px-10">
            <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-blue-600">
                  Do início ao acabamento
                </p>
                <h2 className="mt-4 text-4xl font-bold tracking-[-0.035em] text-slate-950 sm:text-[52px]">
                  Seis etapas. Uma ordem simples.
                </h2>
              </div>
              <p className="max-w-2xl text-base leading-8 text-slate-600 lg:justify-self-end">
                Leia tudo antes de retirar o liner. Quando cada item já está preparado, a aplicação fica mais organizada e você reduz o risco de poeira, desalinhamento e marcas sob o PPF.
              </p>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {installationSteps.map((step) => {
                const StepIcon = step.icon;

                return (
                  <article
                    key={step.number}
                    className="group relative min-h-[360px] overflow-hidden rounded-[28px] border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_24px_60px_-36px_rgba(37,99,235,0.35)] sm:p-8"
                  >
                    <span className="absolute right-5 top-2 text-[72px] font-bold tracking-[-0.08em] text-slate-50 transition group-hover:text-blue-50">
                      {step.number}
                    </span>
                    <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm shadow-blue-600/20">
                      <StepIcon className="h-5 w-5" />
                    </div>
                    <p className="relative mt-7 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
                      Etapa {step.number}
                    </p>
                    <h3 className="relative mt-2 text-2xl font-bold tracking-[-0.03em] text-slate-950">
                      {step.title}
                    </h3>
                    <p className="relative mt-4 text-sm leading-7 text-slate-600">
                      {step.text}
                    </p>
                    <p className="relative mt-6 border-l-2 border-blue-500 pl-4 text-xs font-semibold leading-6 text-slate-700">
                      {step.emphasis}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-y border-slate-100 bg-slate-50 py-16 sm:py-20">
          <div className="mx-auto grid max-w-[1240px] gap-8 px-6 sm:px-8 lg:grid-cols-[0.72fr_1.28fr] lg:px-10">
            <div className="rounded-[28px] bg-blue-600 p-8 text-white sm:p-10">
              <Clock3 className="h-7 w-7" />
              <p className="mt-8 text-[68px] font-bold leading-none tracking-[-0.06em]">48 h</p>
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-blue-100">
                de cuidado inicial
              </p>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-8 sm:p-10">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-blue-600">
                Durante a acomodação
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-[-0.03em] text-slate-950">
                Dê tempo para o material finalizar a fixação.
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600">
                Evite tocar nas bordas, lavar ou molhar a peça nas primeiras 48 horas. Um leve aspecto embaçado ou pequenas marcas de umidade podem aparecer durante a cura e tendem a desaparecer naturalmente.
              </p>
              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {["Não perfure bolhas", "Não aplique calor", "Não force as bordas"].map(
                  (item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-xs font-bold text-slate-700"
                    >
                      {item}
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-[1240px] px-6 sm:px-8 lg:px-10">
            <div className="relative overflow-hidden rounded-[34px] bg-[#030816] px-7 py-12 text-white sm:px-10 lg:px-14 lg:py-14">
              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-blue-500/20" />
              <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="max-w-2xl">
                  <ShieldCheck className="h-7 w-7 text-blue-400" />
                  <h2 className="mt-6 text-3xl font-bold tracking-[-0.035em] sm:text-[42px]">
                    Ficou com dúvida? Não improvise.
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-slate-400">
                    Envie uma foto ou vídeo para nossa equipe. Também reunimos guias educativos no canal oficial da InterShield.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 min-w-[220px] items-center justify-center gap-3 rounded-xl bg-blue-600 px-6 text-sm font-bold text-white transition hover:bg-blue-500"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Falar com o suporte
                  </a>
                  <a
                    href="https://www.youtube.com/@InterShieldPPF"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 min-w-[220px] items-center justify-center gap-3 rounded-xl border border-white/15 bg-white/5 px-6 text-sm font-bold text-white transition hover:border-white/30 hover:bg-white/10"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#FF0000]">
                      <PlatformIcon name="youtube" className="h-3.5 w-3.5" />
                    </span>
                    Ver mais vídeos
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
