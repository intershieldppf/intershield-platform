import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Headphones,
  MessageCircle,
  PackageCheck,
  ScanSearch,
  Scissors,
} from "lucide-react";

import { SectionBlock } from "@/components/SectionBlock";

const whatsappUrl =
  "https://wa.me/5531997146624?text=Ol%C3%A1%21%20Quero%20confirmar%20qual%20kit%20InterShield%20%C3%A9%20compat%C3%ADvel%20com%20meu%20ve%C3%ADculo.%20Meu%20ve%C3%ADculo%20%C3%A9%3A%20";

const founders = [
  {
    name: "Pedro Ian",
    eyebrow: "Experiência técnica",
    title: "Materiais, aplicação e acabamento",
    description:
      "Com experiência prática em estética automotiva e formação presencial na Aoraboni Brasil, contribui na avaliação dos materiais, nos cuidados de aplicação e no padrão de acabamento dos kits.",
  },
  {
    name: "Pedro Dutra",
    eyebrow: "Estratégia e operação",
    title: "Compra online, atendimento e operação",
    description:
      "Une experiência em comércio eletrônico aos conhecimentos em estética automotiva e PPF para organizar a compra, o atendimento e a evolução da operação online.",
  },
] as const;

const commitments = [
  {
    icon: ScanSearch,
    title: "Compatibilidade confirmada",
    description: "Conferimos marca, modelo, ano, versão e a peça antes da produção.",
  },
  {
    icon: Scissors,
    title: "Corte computadorizado",
    description: "O molde é preparado e recortado antes do envio, sem corte sobre o veículo.",
  },
  {
    icon: PackageCheck,
    title: "Kit de aplicação PPF",
    description: "Os kits PPF acompanham solução, espátula e manual de instalação.",
  },
  {
    icon: Headphones,
    title: "Suporte direto",
    description: "Nossa equipe orienta na escolha do kit e continua disponível após a compra.",
  },
] as const;

export function AboutSection() {
  return (
    <SectionBlock
      id="sobre"
      eyebrow="Conheça a InterShield"
      title={
        <>
          Proteção automotiva feita por quem conhece{" "}
          <span className="text-blue-500">o processo na prática</span>
        </>
      }
      description="Conheça quem está por trás de cada kit e como nossa experiência ajuda você a comprar a proteção correta para o seu veículo."
    >
      <div className="space-y-8">
        <article className="overflow-hidden rounded-[32px] border border-blue-100 bg-[linear-gradient(135deg,#ffffff_0%,#f7faff_58%,#eaf3ff_100%)] shadow-[0_28px_80px_-48px_rgba(37,99,235,0.45)]">
          <div className="grid lg:grid-cols-[0.88fr_1.12fr] lg:items-stretch">
            <div className="relative min-h-[430px] overflow-hidden border-b border-blue-100 bg-slate-50 sm:min-h-[540px] lg:min-h-[620px] lg:border-b-0 lg:border-r">
              <Image
                src="/intershield-fundadores-clean.webp"
                alt="Pedro Ian e Pedro Dutra, fundadores da InterShield Películas"
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 46vw"
              />
              <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-slate-950/70 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-blue-300">
                  Fundadores
                </p>
                <p className="mt-2 text-xl font-bold text-white">
                  Pedro Ian e Pedro Dutra
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-blue-600">
                Nossa história
              </p>
              <h3 className="mt-4 max-w-[620px] text-3xl font-bold leading-tight tracking-[-0.03em] text-slate-950 sm:text-[40px]">
                Uma necessidade real transformada em especialização
              </h3>

              <div className="mt-7 space-y-5 text-base leading-8 text-slate-600">
                <p>
                  Somos Pedro Ian e Pedro Dutra, amigos de infância e profissionais
                  do ramo automotivo. Nossa trajetória começou na estética automotiva,
                  onde buscamos formação técnica e conhecemos de perto os materiais,
                  os processos e os cuidados necessários para um bom acabamento.
                </p>
                <p>
                  Nesse caminho, percebemos a dificuldade de encontrar kits PPF
                  pré-cortados com compatibilidade bem explicada e orientação antes da
                  compra. Transformamos essa necessidade em uma operação especializada
                  em proteção e acabamento automotivo sob medida.
                </p>
              </div>

              <div className="mt-8 rounded-[22px] border border-blue-100 bg-white/85 p-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-blue-600">
                  Mais do que uma marca, um propósito
                </p>
                <p className="mt-3 text-base leading-7 text-slate-700">
                  <strong className="text-slate-950">Inter</strong> representa os
                  interiores onde nossos primeiros projetos ganharam forma.{" "}
                  <strong className="text-slate-950">Shield</strong> significa escudo
                  e proteção. Juntos, os dois nomes traduzem nosso compromisso: ajudar
                  cada cliente a proteger o veículo com mais segurança na escolha.
                </p>
              </div>
            </div>
          </div>
        </article>

        <div className="grid gap-6 lg:grid-cols-2">
          {founders.map((founder, index) => (
            <article
              key={founder.name}
              className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm sm:p-8"
            >
              <span className="absolute right-6 top-6 text-[11px] font-bold tracking-[0.2em] text-slate-300">
                0{index + 1}
              </span>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-blue-600">
                {founder.eyebrow}
              </p>
              <h3 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
                {founder.name}
              </h3>
              <p className="mt-2 text-[15px] font-bold text-blue-600">
                {founder.title}
              </p>
              <div className="mt-5 h-1 w-14 rounded-full bg-blue-500" />
              <p className="mt-5 text-base leading-8 text-slate-600">
                {founder.description}
              </p>
            </article>
          ))}
        </div>

        <div>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-blue-600">
              O que isso representa na sua compra
            </p>
            <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Menos dúvida antes do pedido, mais segurança na escolha
            </h3>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {commitments.map((commitment) => {
              const Icon = commitment.icon;

              return (
                <article
                  key={commitment.title}
                  className="rounded-[24px] border border-blue-100 bg-blue-50/55 p-6"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h4 className="mt-5 text-base font-bold text-slate-950">
                    {commitment.title}
                  </h4>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {commitment.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>

        <div className="overflow-hidden rounded-[28px] bg-slate-950 px-6 py-9 text-center sm:px-10 sm:py-11">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-blue-400">
            Compra segura começa pela escolha correta
          </p>
          <h3 className="mx-auto mt-3 max-w-3xl text-2xl font-bold leading-tight text-white sm:text-3xl">
            Encontre a proteção compatível com seu veículo
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-300">
            Pesquise no catálogo ou envie marca, modelo, ano e versão para nossa
            equipe confirmar a opção correta antes da compra.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/catalogo"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-bold text-white transition hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
            >
              Encontrar meu kit
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/5 px-6 text-sm font-bold text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
            >
              <MessageCircle className="h-4 w-4" />
              Confirmar pelo WhatsApp
            </a>
          </div>
        </div>
      </div>
    </SectionBlock>
  );
}
