import { SectionBlock } from "@/components/SectionBlock";

const productionPoints = [
  {
    eyebrow: "Molde específico",
    title: "Desenvolvido para cada modelo",
    description:
      "Os recortes partem de moldes digitais compatíveis com o formato das peças de cada veículo, evitando soluções genéricas.",
  },
  {
    eyebrow: "Kit pré-cortado",
    title: "Mais precisão durante a aplicação",
    description:
      "As peças chegam recortadas, o que reduz ajustes manuais e a necessidade de cortar o material diretamente sobre o veículo.",
  },
] as const;

export function FeatureSection() {
  return (
    <SectionBlock
      id="instalar"
      eyebrow="Corte computadorizado"
      title="Recortes precisos para um acabamento mais limpo"
      description="Cada kit é produzido em plotter a partir de moldes digitais. O objetivo é acompanhar as linhas da peça e tornar a instalação mais organizada, segura e padronizada."
    >
      <div className="grid gap-6 rounded-[2rem] border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-900/5 sm:grid-cols-2 lg:p-10">
        {productionPoints.map((point, index) => (
          <article
            key={point.title}
            className="relative overflow-hidden rounded-3xl border border-slate-100 bg-slate-50 p-6"
          >
            <span className="absolute right-5 top-4 text-[11px] font-bold tracking-[0.18em] text-slate-300">
              0{index + 1}
            </span>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-blue-600">
              {point.eyebrow}
            </p>
            <h3 className="mt-4 max-w-[360px] text-xl font-bold text-slate-950">
              {point.title}
            </h3>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              {point.description}
            </p>
          </article>
        ))}
      </div>
    </SectionBlock>
  );
}
