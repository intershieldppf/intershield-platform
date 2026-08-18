import { SectionBlock } from "@/components/SectionBlock";

export function FeatureSection() {
  return (
    <SectionBlock
      id="corte"
      eyebrow="Corte computadorizado"
      title="Encaixe perfeito para cada modelo"
      description="Cada película é cortada de forma precisa para garantir instalação limpa, visual alinhado e acabamento de fabricação."
    >
      <div className="grid gap-6 rounded-[2rem] border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-900/5 sm:grid-cols-2 lg:p-10">
        <div className="space-y-4 rounded-3xl border border-slate-100 bg-slate-50 p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Precisão automatizada</p>
          <h3 className="text-xl font-semibold text-slate-950">Detalhes dimensionados com exatidão</h3>
          <p className="text-sm leading-7 text-slate-600">
            O corte computadorizado reduz desperdício e garante que cada peça se encaixe exatamente nos vidros e superfícies do seu veículo.
          </p>
        </div>
        <div className="space-y-4 rounded-3xl border border-slate-100 bg-slate-50 p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Acabamento premium</p>
          <h3 className="text-xl font-semibold text-slate-950">Instalação fluida e discreta</h3>
          <p className="text-sm leading-7 text-slate-600">
            A composição e o corte trabalham juntos para reduzir vincos, bolhas e excesso de material, garantindo linhas limpas e aspecto profissional.
          </p>
        </div>
      </div>
    </SectionBlock>
  );
}
