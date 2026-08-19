import Image from "next/image";
import { SectionBlock } from "@/components/SectionBlock";

export function AboutSection() {
  return (
    <SectionBlock
      id="sobre"
      eyebrow="Conheça a InterShield"
      title={
        <>
          Proteção <span className="text-blue-500">inteligente</span> para o seu
          veículo
        </>
      }
      description="A InterShield Películas nasceu da paixão por carros e do compromisso com a excelência. Unimos tecnologia, materiais de alta performance e atenção aos detalhes para desenvolver kits de proteção e acabamento com padrão premium."
    >
      <div className="space-y-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr] lg:items-center">
          <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-200 text-blue-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 0115 0"
                />
              </svg>
            </div>

            <h3 className="mt-6 text-3xl font-bold text-slate-950">
              Quem somos
            </h3>

            <div className="mt-4 h-1 w-16 rounded-full bg-blue-500" />

            <div className="mt-6 space-y-5 text-[17px] leading-8 text-slate-700">
              <p>
                Somos <span className="font-semibold text-blue-600">Pedro Dutra</span> e{" "}
                <span className="font-semibold text-blue-600">Pedro Ian</span>,
                amigos de infância e fundadores da InterShield Películas.
              </p>

              <p>
                Construímos a marca com foco em atendimento próximo, qualidade
                real e soluções específicas para cada veículo.
              </p>

              <p>
                Nossa visão é{" "}
                <span className="font-semibold text-blue-600">
                  elevar o padrão da proteção automotiva
                </span>{" "}
                com materiais selecionados, recortes precisos e acabamento premium.
              </p>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[520px]">
            <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-white p-3 shadow-sm">
              <div className="overflow-hidden rounded-[24px]">
                <Image
                  src="/intershield-socios.png"
                  alt="Pedro Dutra e Pedro Ian, fundadores da InterShield Películas"
                  width={900}
                  height={1100}
                  className="h-auto w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-[26px] border border-slate-200 bg-white p-7 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-500">
              Nosso propósito
            </p>
            <div className="mt-4 h-1 w-14 rounded-full bg-blue-500" />
            <p className="mt-5 text-[16px] leading-8 text-slate-700">
              Entregar <span className="font-semibold text-blue-600">proteção premium</span>,
              acabamento impecável e materiais de alta performance para quem quer
              cuidar do veículo de forma séria.
            </p>
          </div>

          <div className="rounded-[26px] border border-slate-200 bg-white p-7 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-500">
              Por que InterShield
            </p>
            <div className="mt-4 h-1 w-14 rounded-full bg-blue-500" />
            <p className="mt-5 text-[16px] leading-8 text-slate-700">
              Atendimento próximo, análise mais cuidadosa do veículo e foco em
              indicar a solução certa, sem empurrar produto genérico.
            </p>
          </div>

          <div className="rounded-[26px] border border-slate-200 bg-white p-7 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-500">
              Materiais selecionados
            </p>
            <div className="mt-4 h-1 w-14 rounded-full bg-blue-500" />
            <p className="mt-5 text-[16px] leading-8 text-slate-700">
              Trabalhamos com soluções voltadas para durabilidade, visual limpo e
              melhor resultado final, valorizando o carro sem pesar no aspecto visual.
            </p>
          </div>
        </div>

        <div className="rounded-[28px] bg-slate-950 px-8 py-10 text-center">
          <p className="mx-auto max-w-4xl text-2xl font-semibold leading-10 text-white">
            Proteção de verdade é aquela que você quase não percebe —
            <span className="text-blue-400"> até o momento em que ela faz a diferença.</span>
          </p>
        </div>
      </div>
    </SectionBlock>
  );
}