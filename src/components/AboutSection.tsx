import Image from "next/image";

import { SectionBlock } from "@/components/SectionBlock";

const founders = [
  {
    name: "Pedro Ian",
    eyebrow: "Experiência técnica",
    title: "Especialista em estética automotiva",
    description:
      "Já esteve à frente de um lava-jato e concluiu formação presencial na Aoraboni Brasil como especialista em estética automotiva. Essa trajetória trouxe experiência prática e conhecimento abrangente sobre os principais processos, cuidados e padrões de acabamento da área.",
  },
  {
    name: "Pedro Dutra",
    eyebrow: "Estratégia e operação",
    title: "Empreendedor com experiência em e-commerce",
    description:
      "Construiu experiência profissional no comércio eletrônico e realizou formações voltadas ao e-commerce. Posteriormente, aprofundou os conhecimentos em estética automotiva e PPF, unindo visão comercial, produto e experiência do cliente.",
  },
] as const;

export function AboutSection() {
  return (
    <SectionBlock
      id="sobre"
      eyebrow="Conheça a InterShield"
      title={
        <>
          Experiência prática e visão de mercado{" "}
          <span className="text-blue-500">em uma só direção</span>
        </>
      }
      description="A InterShield Películas reúne conhecimento técnico em estética automotiva, experiência em e-commerce e especialização em PPF para desenvolver soluções mais precisas para cada veículo."
    >
      <div className="space-y-8">
        <article className="overflow-hidden rounded-[32px] border border-blue-100 bg-[linear-gradient(135deg,#ffffff_0%,#f7faff_58%,#eaf3ff_100%)] shadow-[0_28px_80px_-48px_rgba(37,99,235,0.45)]">
          <div className="grid lg:grid-cols-[0.88fr_1.12fr] lg:items-stretch">
            <div className="relative min-h-[430px] overflow-hidden border-b border-blue-100 bg-slate-50 sm:min-h-[540px] lg:min-h-[620px] lg:border-b-0 lg:border-r">
              <Image
                src="/intershield-fundadores-clean.webp"
                alt="Pedro Dutra e Pedro Ian, fundadores da InterShield Películas"
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
                  Pedro Dutra e Pedro Ian
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-blue-600">
                Nossa história
              </p>
              <h3 className="mt-4 max-w-[620px] text-3xl font-bold leading-tight tracking-[-0.03em] text-slate-950 sm:text-[40px]">
                Da estética automotiva à oportunidade dos kits PPF
              </h3>

              <div className="mt-7 space-y-5 text-[15px] leading-8 text-slate-600">
                <p>
                  Amigos de infância, começamos o projeto com o objetivo de montar
                  uma estética automotiva em nossa cidade. Durante a preparação,
                  buscamos conhecimento técnico, estudamos os serviços e avaliamos
                  como construir uma operação de alto padrão.
                </p>
                <p>
                  Foi nesse processo que o mercado nos mostrou uma oportunidade mais
                  específica: a procura por kits PPF pré-cortados, capazes de proteger
                  superfícies do veículo com encaixe preciso e sem alterar o visual
                  original.
                </p>
                <p>
                  Decidimos direcionar o investimento para essa oportunidade. Deixamos
                  o projeto da estética automotiva de lado e passamos a concentrar
                  nossa experiência, estrutura e desenvolvimento na venda de kits PPF
                  e acabamentos automotivos.
                </p>
              </div>

              <div className="mt-8 rounded-[22px] border border-blue-100 bg-white/80 p-5">
                <p className="text-[13px] leading-6 text-slate-700">
                  Hoje, a InterShield combina conhecimento técnico, visão de e-commerce
                  e atenção ao cliente para tornar a proteção automotiva mais acessível,
                  organizada e compatível com cada veículo.
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
              <p className="mt-5 text-[15px] leading-8 text-slate-600">
                {founder.description}
              </p>
            </article>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["Conhecimento técnico", "Experiência prática em estética automotiva e especialização em PPF."],
            ["Visão comercial", "Experiência em e-commerce aplicada à compra e ao atendimento online."],
            ["Foco no cliente", "Orientação clara para encontrar o kit compatível com cada veículo."],
          ].map(([title, description]) => (
            <div
              key={title}
              className="rounded-[24px] border border-blue-100 bg-blue-50/55 p-6"
            >
              <h4 className="text-base font-bold text-slate-950">{title}</h4>
              <p className="mt-3 text-[13px] leading-6 text-slate-600">
                {description}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-[28px] bg-slate-950 px-8 py-10 text-center">
          <p className="mx-auto max-w-4xl text-2xl font-semibold leading-10 text-white">
            Transformamos experiência prática e visão de mercado em{" "}
            <span className="text-blue-400">
              proteção pensada para cada veículo.
            </span>
          </p>
        </div>
      </div>
    </SectionBlock>
  );
}
