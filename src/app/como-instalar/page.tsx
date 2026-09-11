import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
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
    "Aprenda a instalar o PPF pré-cortado da InterShield com vídeos reais, preparação correta, aplicação úmida, acabamento e cuidados de cura.",
  alternates: { canonical: "/como-instalar" },
};

const whatsappUrl =
  "https://wa.me/5531988633883?text=Ol%C3%A1%21%20Estou%20instalando%20meu%20kit%20InterShield%20e%20preciso%20de%20ajuda.";

const kitContents = [
  {
    number: "01",
    icon: Layers,
    title: "PPF pré-cortado",
    text: "Recortado por computador conforme o modelo e a peça escolhidos no pedido.",
  },
  {
    number: "02",
    icon: Droplets,
    title: "Solução de aplicação",
    text: "Ajuda a movimentar e alinhar o filme antes da fixação definitiva.",
  },
  {
    number: "03",
    icon: Hand,
    title: "Espátula",
    text: "Conduz a solução e o ar do centro para as bordas com pressão controlada.",
  },
  {
    number: "04",
    icon: BookOpen,
    title: "Manual",
    text: "Reúne os cuidados essenciais de preparação, aplicação, acabamento e cura.",
  },
] as const;

const installationSteps = [
  {
    number: "01",
    icon: Box,
    title: "Prepare o ambiente",
    text: "Escolha um local limpo, iluminado, sem sol direto, vento ou poeira. Deixe todos os itens ao alcance antes de abrir o kit.",
    emphasis: "Lave e seque bem as mãos antes de tocar no PPF.",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "Limpe a superfície",
    text: "Remova poeira, gordura, cera, silicone e qualquer resíduo. Confira a peça contra a luz antes de seguir.",
    emphasis: "Depois da limpeza, não toque novamente na área.",
  },
  {
    number: "03",
    icon: Droplets,
    title: "Umedeça os dois lados",
    text: "Borrife a solução na peça. Retire o liner aos poucos e umedeça também o lado adesivo do PPF.",
    emphasis: "A aplicação úmida permite corrigir o posicionamento.",
  },
  {
    number: "04",
    icon: Layers,
    title: "Posicione sem pressa",
    text: "Deslize o PPF ainda molhado até alinhar bordas, curvas e recortes. Confira o encaixe inteiro antes de fixar.",
    emphasis: "Se desalinhou, levante, umedeça e reposicione.",
  },
  {
    number: "05",
    icon: Move,
    title: "Expulse solução e ar",
    text: "Passe a espátula do centro para as bordas, com movimentos curtos, firmes e sobrepostos.",
    emphasis: "Evite pressão excessiva para não marcar ou deslocar o filme.",
  },
  {
    number: "06",
    icon: CheckCircle2,
    title: "Revise e deixe curar",
    text: "Seque ao redor, confirme as bordas e mantenha a peça sem lavagem ou contato durante as primeiras 48 horas.",
    emphasis: "Não perfure bolhas e não aplique calor sem orientação.",
  },
] as const;

const questions = [
  {
    title: "Preciso ser instalador profissional?",
    text: "O kit pré-cortado reduz a complexidade porque já vem no formato da peça, mas a qualidade final depende de limpeza, alinhamento e uso correto da espátula. Se você não se sentir seguro, recomendamos a aplicação profissional.",
  },
  {
    title: "Posso aplicar o PPF a seco?",
    text: "Siga o método indicado no manual do seu kit. Nos exemplos desta página, a solução de aplicação permite movimentar o material e corrigir o alinhamento antes da fixação.",
  },
  {
    title: "O que fazer se o PPF ficar desalinhado?",
    text: "Enquanto a área ainda estiver bem umedecida, levante o material com cuidado, borrife novamente e reposicione. Não force o filme já fixado.",
  },
  {
    title: "Pequenas marcas de umidade são normais?",
    text: "Um leve aspecto embaçado ou pequenas marcas de umidade podem aparecer durante a acomodação e tendem a desaparecer. Não perfure bolhas. Se algo persistir, envie uma foto para o suporte.",
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
    <article className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.045] sm:rounded-[34px]">
      <div className="grid items-stretch lg:grid-cols-[0.9fr_1.1fr]">
        <div
          className={`relative flex items-center justify-center bg-black/35 p-4 sm:p-7 lg:p-9 ${
            reverse ? "lg:order-2" : ""
          }`}
        >
          <div className="w-full max-w-[360px] overflow-hidden rounded-[24px] border border-white/15 bg-black shadow-[0_28px_80px_-38px_rgba(37,99,235,0.85)]">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-400">
                Demonstração {number}
              </span>
              <span className="text-xs font-medium text-slate-400">{duration}</span>
            </div>
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

        <div className={`flex flex-col justify-center p-6 sm:p-9 lg:p-12 ${
          reverse ? "lg:order-1" : ""
        }`}>
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-xs font-bold text-white">
              {number}
            </span>
            <span className="h-px w-12 bg-blue-500/50" />
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-400">
              Observe a técnica
            </span>
          </div>
          <h3 className="mt-6 max-w-xl text-3xl font-bold leading-tight tracking-[-0.035em] text-white sm:text-[40px]">
            {title}
          </h3>
          <p className="mt-5 max-w-xl text-base leading-8 text-slate-300">
            {description}
          </p>

          <div className="mt-7 grid gap-3">
            {points.map((point) => (
              <div
                key={point}
                className="flex min-h-14 items-start gap-3 rounded-[16px] border border-white/10 bg-white/[0.035] px-4 py-3 text-sm leading-6 text-slate-300"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" />
                <span>{point}</span>
              </div>
            ))}
          </div>
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
        <section className="relative overflow-hidden bg-[#030816] text-white">
          <div className="pointer-events-none absolute -right-44 -top-44 h-[620px] w-[620px] rounded-full bg-blue-600/20 blur-3xl" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />

          <div className="relative mx-auto grid min-h-[610px] max-w-[1320px] items-center gap-12 px-5 py-14 sm:px-8 sm:py-18 lg:grid-cols-[1.04fr_0.96fr] lg:px-10 lg:py-20">
            <div className="max-w-[700px]">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-300">
                <Hand className="h-4 w-4" />
                Guia de aplicação
              </div>
              <h1 className="mt-7 text-[44px] font-bold leading-[0.98] tracking-[-0.045em] text-white sm:text-[62px] lg:text-[72px]">
                Do kit aberto ao acabamento <span className="text-blue-400">preciso.</span>
              </h1>
              <p className="mt-7 max-w-[650px] text-base leading-8 text-slate-300 sm:text-lg">
                Veja o processo real antes de começar e siga uma sequência clara para preparar, posicionar, fixar e cuidar do PPF pré-cortado.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#videos"
                  className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-blue-600 px-6 text-sm font-bold text-white transition hover:bg-blue-500"
                >
                  <Play className="h-4 w-4 fill-current" />
                  Assistir antes de aplicar
                </a>
                <a
                  href="#passo-a-passo"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 text-sm font-bold text-white transition hover:border-white/30 hover:bg-white/10"
                >
                  Ver as 6 etapas
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="relative lg:pl-12">
              <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.055] shadow-[0_34px_100px_-50px_rgba(37,99,235,0.8)] backdrop-blur sm:rounded-[34px]">
                <div className="border-b border-white/10 px-6 py-5 sm:px-8">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
                    Antes de começar
                  </p>
                  <h2 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-white sm:text-3xl">
                    Três decisões evitam a maioria dos erros.
                  </h2>
                </div>

                <div className="divide-y divide-white/10">
                  {[
                    ["01", "Ambiente limpo", "Sem sol direto, vento ou poeira."],
                    ["02", "Encaixe conferido", "Alinhe tudo antes da primeira passada."],
                    ["03", "Tempo reservado", "Faça sem pressa e respeite 48 h de cura."],
                  ].map(([number, title, text]) => (
                    <div key={number} className="flex items-start gap-4 px-6 py-5 sm:px-8">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-blue-400/30 bg-blue-500/10 text-xs font-bold text-blue-300">
                        {number}
                      </span>
                      <div>
                        <p className="text-base font-bold text-white">{title}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-400">{text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-start gap-3 bg-blue-500/10 px-6 py-5 sm:px-8">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" />
                  <p className="text-sm leading-6 text-slate-300">
                    Quer máxima precisão ou não se sente seguro? Prefira a instalação profissional.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <nav aria-label="Atalhos do guia" className="border-b border-slate-100 bg-white py-4">
          <div className="mx-auto flex max-w-[1240px] gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:px-8 lg:px-10 [&::-webkit-scrollbar]:hidden">
            {[
              ["#conteudo-do-kit", "O que vem no kit"],
              ["#videos", "Vídeos reais"],
              ["#passo-a-passo", "Passo a passo"],
              ["#cura", "Cuidados de cura"],
              ["#duvidas", "Dúvidas"],
            ].map(([href, label], index) => (
              <a
                key={href}
                href={href}
                className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                <span className="text-xs text-blue-600">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {label}
              </a>
            ))}
          </div>
        </nav>

        <section
          id="conteudo-do-kit"
          className="scroll-mt-32 border-b border-slate-100 bg-slate-50 py-16 sm:py-24 lg:scroll-mt-24"
        >
          <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-10">
            <div className="overflow-hidden rounded-[28px] border border-blue-100 bg-white shadow-[0_30px_90px_-58px_rgba(37,99,235,0.55)] sm:rounded-[34px]">
              <div className="grid lg:grid-cols-[0.84fr_1.16fr]">
                <figure className="relative min-h-[340px] bg-slate-100 sm:min-h-[500px]">
                  <Image
                    src="/kit-ppf-completo-intershield.webp"
                    alt="Kit InterShield com PPF pré-cortado, solução para aplicação, espátula e manual"
                    fill
                    sizes="(max-width: 1024px) 100vw, 520px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />
                  <figcaption className="absolute inset-x-5 bottom-5 rounded-[18px] border border-white/20 bg-black/55 px-4 py-3 text-sm font-semibold text-white backdrop-blur sm:inset-x-7 sm:bottom-7">
                    Confira todos os itens antes de retirar o liner.
                  </figcaption>
                </figure>

                <div className="relative bg-[linear-gradient(145deg,#020817_0%,#07152e_100%)] p-6 text-white sm:p-9 lg:p-11">
                  <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-blue-400/15" />
                  <div className="relative">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-400">
                      Seu sistema de aplicação
                    </p>
                    <h2 className="mt-4 max-w-[640px] text-4xl font-bold leading-[1.04] tracking-[-0.04em] text-white sm:text-[50px]">
                      Quatro itens, cada um com uma função.
                    </h2>
                    <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
                      O kit chega organizado para reduzir improvisos. Leia o manual e identifique cada item antes de iniciar.
                    </p>

                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                      {kitContents.map((item) => {
                        const ItemIcon = item.icon;
                        return (
                          <article
                            key={item.number}
                            className="group min-h-[190px] rounded-[20px] border border-white/10 bg-white/[0.045] p-5 transition hover:-translate-y-1 hover:border-blue-400/35"
                          >
                            <div className="flex items-center justify-between">
                              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-950/20">
                                <ItemIcon className="h-5 w-5" />
                              </span>
                              <span className="text-xs font-bold tracking-[0.18em] text-blue-400">
                                {item.number}
                              </span>
                            </div>
                            <h3 className="mt-5 text-lg font-bold text-white">{item.title}</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-400">{item.text}</p>
                          </article>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="videos"
          className="scroll-mt-32 bg-[#030816] py-16 text-white sm:py-24 lg:scroll-mt-24"
        >
          <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-10">
            <div className="mb-10 grid gap-5 lg:grid-cols-[1fr_0.6fr] lg:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-400">
                  Aplicações reais
                </p>
                <h2 className="mt-4 text-4xl font-bold leading-[1.05] tracking-[-0.04em] text-white sm:text-[52px]">
                  Assista agora. Evite corrigir depois.
                </h2>
              </div>
              <p className="text-base leading-8 text-slate-400">
                Ative o som e observe três pontos: alinhamento completo, direção da espátula e revisão das bordas.
              </p>
            </div>

            <div className="space-y-6 sm:space-y-8">
              <VideoChapter
                number="01"
                title="Posicionamento e retirada da solução"
                description="A aplicação úmida permite ajustar a película antes da fixação. Observe como o encaixe é conferido primeiro e como a solução sai sem pressa."
                duration="21 segundos"
                src="/videos/como-instalar-01.mp4"
                label="Aplicação de PPF em tela multimídia com posicionamento e acabamento"
                points={[
                  "Alinhe toda a peça antes da primeira passada",
                  "Conduza a espátula do centro para os cantos",
                  "Seque com microfibra limpa sem puxar as bordas",
                ]}
              />

              <VideoChapter
                number="02"
                title="Fixação em uma tela integrada ao painel"
                description="Mesmo com outro formato de multimídia, a lógica permanece: superfície preparada, PPF alinhado e pressão controlada até o acabamento."
                duration="37 segundos"
                src="/videos/como-instalar-02.mp4"
                label="Aplicação de PPF em tela multimídia integrada ao painel"
                points={[
                  "Mantenha a área umedecida durante o alinhamento",
                  "Use movimentos curtos e sobrepostos",
                  "Revise todas as bordas antes de finalizar",
                ]}
                reverse
              />
            </div>
          </div>
        </section>

        <section
          id="passo-a-passo"
          className="scroll-mt-32 bg-white py-16 sm:py-24 lg:scroll-mt-24"
        >
          <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-10">
            <div className="grid gap-7 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-600">
                  Sequência de instalação
                </p>
                <h2 className="mt-4 text-4xl font-bold leading-[1.05] tracking-[-0.04em] text-slate-950 sm:text-[52px]">
                  Seis etapas, na ordem certa.
                </h2>
              </div>
              <p className="max-w-2xl text-base leading-8 text-slate-600 lg:justify-self-end">
                Leia a sequência inteira antes de retirar o liner. No celular, cada etapa foi organizada para ser consultada com uma mão durante a aplicação.
              </p>
            </div>

            <div className="relative mt-12">
              <div
                aria-hidden="true"
                className="absolute bottom-10 left-5 top-10 w-px bg-gradient-to-b from-blue-100 via-blue-500 to-blue-100 sm:left-6 lg:left-1/2"
              />
              <div className="grid gap-5 lg:grid-cols-2 lg:gap-x-14 lg:gap-y-6">
                {installationSteps.map((step, index) => {
                  const StepIcon = step.icon;
                  const rightColumn = index % 2 === 1;

                  return (
                    <article
                      key={step.number}
                      className={`relative ml-12 rounded-[22px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-50px_rgba(15,23,42,0.55)] transition hover:border-blue-200 hover:shadow-[0_24px_70px_-48px_rgba(37,99,235,0.55)] sm:ml-16 sm:p-6 lg:ml-0 ${
                        rightColumn ? "lg:translate-y-12" : ""
                      }`}
                    >
                      <span className="absolute -left-[50px] top-5 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-blue-600 text-xs font-bold text-white shadow-md sm:-left-[66px] sm:h-12 sm:w-12 lg:hidden">
                        {step.number}
                      </span>

                      <div className="flex items-start justify-between gap-4">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white">
                          <StepIcon className="h-5 w-5" />
                        </span>
                        <span className="text-4xl font-bold tracking-[-0.06em] text-slate-100">
                          {step.number}
                        </span>
                      </div>
                      <h3 className="mt-5 text-2xl font-bold tracking-[-0.03em] text-slate-950">
                        {step.title}
                      </h3>
                      <p className="mt-3 text-base leading-7 text-slate-600">{step.text}</p>
                      <div className="mt-5 flex items-start gap-3 rounded-[16px] border border-blue-100 bg-blue-50/70 px-4 py-3">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                        <p className="text-sm font-semibold leading-6 text-slate-700">
                          {step.emphasis}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section
          id="cura"
          className="scroll-mt-32 border-y border-slate-100 bg-slate-50 py-16 sm:py-24 lg:scroll-mt-24"
        >
          <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-10">
            <div className="overflow-hidden rounded-[28px] border border-blue-100 bg-white shadow-[0_30px_90px_-58px_rgba(37,99,235,0.5)] sm:rounded-[34px]">
              <div className="grid lg:grid-cols-[0.62fr_1.38fr]">
                <div className="relative overflow-hidden bg-blue-600 p-7 text-white sm:p-10 lg:p-12">
                  <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full border border-white/20" />
                  <Clock3 className="relative h-8 w-8" />
                  <p className="relative mt-9 text-[72px] font-bold leading-none tracking-[-0.07em] sm:text-[88px]">
                    48 h
                  </p>
                  <p className="relative mt-3 text-sm font-bold uppercase tracking-[0.16em] text-blue-100">
                    de cuidado inicial
                  </p>
                </div>

                <div className="p-6 sm:p-10 lg:p-12">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-600">
                    Acomodação do material
                  </p>
                  <h2 className="mt-4 max-w-2xl text-3xl font-bold leading-tight tracking-[-0.035em] text-slate-950 sm:text-[42px]">
                    O acabamento continua depois da aplicação.
                  </h2>
                  <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
                    Evite tocar nas bordas, lavar ou molhar a peça nas primeiras 48 horas. Um leve aspecto embaçado ou pequenas marcas de umidade podem aparecer durante a cura e tendem a desaparecer naturalmente.
                  </p>

                  <div className="mt-7 grid gap-3 sm:grid-cols-3">
                    {[
                      ["01", "Não perfure bolhas"],
                      ["02", "Não aplique calor"],
                      ["03", "Não force as bordas"],
                    ].map(([number, item]) => (
                      <div
                        key={number}
                        className="rounded-[18px] border border-slate-200 bg-slate-50 p-4"
                      >
                        <span className="text-xs font-bold tracking-[0.16em] text-blue-600">
                          {number}
                        </span>
                        <p className="mt-2 text-sm font-bold leading-6 text-slate-800">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="duvidas"
          className="scroll-mt-32 bg-white py-16 sm:py-24 lg:scroll-mt-24"
        >
          <div className="mx-auto grid max-w-[1240px] gap-10 px-5 sm:px-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14 lg:px-10">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-600">
                Dúvidas durante a aplicação
              </p>
              <h2 className="mt-4 text-4xl font-bold leading-[1.05] tracking-[-0.04em] text-slate-950 sm:text-[48px]">
                Pare, confira e só depois continue.
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-600">
                As respostas abaixo evitam correções apressadas. Se a situação não estiver clara, envie uma foto para nossa equipe.
              </p>
            </div>

            <div className="grid gap-3">
              {questions.map((question, index) => (
                <details
                  key={question.title}
                  className="group overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-sm open:border-blue-200 open:shadow-[0_18px_50px_-42px_rgba(37,99,235,0.6)]"
                >
                  <summary className="flex min-h-[72px] cursor-pointer list-none items-center gap-4 px-5 py-4 marker:hidden sm:px-6">
                    <span className="text-xs font-bold tracking-[0.16em] text-blue-500">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="min-w-0 flex-1 text-base font-bold leading-6 text-slate-950 sm:text-lg">
                      {question.title}
                    </h3>
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-xl text-slate-500 transition duration-300 group-open:rotate-45 group-open:border-blue-200 group-open:bg-blue-50 group-open:text-blue-600"
                    >
                      +
                    </span>
                  </summary>
                  <div className="border-t border-slate-100 px-5 py-5 sm:px-6">
                    <p className="text-base leading-7 text-slate-600">{question.text}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-16 sm:py-24">
          <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-10">
            <div className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#1264f5_0%,#1748c7_100%)] px-6 py-10 text-white shadow-[0_32px_90px_-48px_rgba(37,99,235,0.75)] sm:rounded-[34px] sm:px-10 lg:px-14 lg:py-13">
              <div className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full border border-white/20" />
              <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="max-w-3xl">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/25 bg-white/10">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-blue-100">
                    Suporte durante a instalação
                  </p>
                  <h2 className="mt-3 text-3xl font-bold leading-tight tracking-[-0.035em] text-white sm:text-[44px]">
                    Ficou com dúvida? Não improvise.
                  </h2>
                  <p className="mt-4 max-w-2xl text-base leading-8 text-blue-100">
                    Envie uma foto ou vídeo da peça. Nossa equipe ajuda você a avaliar o próximo passo antes de continuar.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[52px] min-w-[240px] items-center justify-center gap-3 rounded-xl bg-white px-6 text-sm font-bold text-blue-700 shadow-lg shadow-blue-950/20 transition hover:-translate-y-0.5 hover:bg-blue-50"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Falar com o suporte
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <a
                    href="https://www.youtube.com/@InterShieldPPF"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[52px] min-w-[240px] items-center justify-center gap-3 rounded-xl border border-white/20 bg-white/10 px-6 text-sm font-bold text-white transition hover:border-white/40 hover:bg-white/15"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FF0000]">
                      <PlatformIcon name="youtube" className="h-4 w-4" />
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
