type ProductDescriptionProps = {
  productTypeName: string;
  fullDescription: string;
  material: string;
  finish: string;
  thicknessMicrons: number;
  benefits: string[];
  packagingContents: string[];
  installationSteps: string[];
  notes: string[];
};

export function ProductDescription({
  productTypeName,
  fullDescription,
  material,
  finish,
  thicknessMicrons,
  benefits,
  packagingContents,
  installationSteps,
  notes,
}: ProductDescriptionProps) {
  return (
    <section className="space-y-10 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Categoria</p>
            <p className="mt-2 text-xl font-semibold text-slate-950">{productTypeName}</p>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Descrição completa</p>
            <p className="mt-3 text-base leading-8 text-slate-700">{fullDescription}</p>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Material</p>
              <p className="mt-2 font-semibold text-slate-950">{material}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Acabamento</p>
              <p className="mt-2 font-semibold text-slate-950">{finish}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Espessura</p>
              <p className="mt-2 font-semibold text-slate-950">{thicknessMicrons} μm</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
          <h3 className="text-base font-semibold text-slate-950">Benefícios</h3>
          <ul className="space-y-3 text-slate-700">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-600" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
          <h3 className="text-base font-semibold text-slate-950">Conteúdo da embalagem</h3>
          <ul className="space-y-3 text-slate-700">
            {packagingContents.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-slate-950" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
          <h3 className="text-base font-semibold text-slate-950">Instruções de instalação</h3>
          <ol className="space-y-3 text-slate-700">
            {installationSteps.map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="mt-1 font-semibold text-slate-950">{index + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
        <h3 className="text-base font-semibold text-slate-950">Observações</h3>
        <ul className="mt-4 space-y-3 text-slate-700">
          {notes.map((note) => (
            <li key={note} className="flex items-start gap-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-slate-950" />
              <span>{note}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
