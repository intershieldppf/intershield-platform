import type { ImportAnalysis } from "@/domain/imports/importTypes";

type ImportSummaryProps = {
  analysis: ImportAnalysis;
};

export function ImportSummary({ analysis }: ImportSummaryProps) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[1.75rem] bg-slate-50 p-5">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Linhas totais</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{analysis.totalRows}</p>
        </div>
        <div className="rounded-[1.75rem] bg-slate-50 p-5">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Anúncios únicos</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{analysis.uniqueListings}</p>
        </div>
        <div className="rounded-[1.75rem] bg-slate-50 p-5">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Linhas com SKU</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{analysis.rowsWithSku}</p>
        </div>
        <div className="rounded-[1.75rem] bg-slate-50 p-5">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Linhas sem SKU</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{analysis.rowsWithoutSku}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[1.75rem] bg-slate-50 p-5">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">SKUs duplicados</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">{analysis.duplicateSkus.length}</p>
        </div>
        <div className="rounded-[1.75rem] bg-slate-50 p-5">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Linhas com descrição</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{analysis.rowsWithDescription}</p>
        </div>
        <div className="rounded-[1.75rem] bg-slate-50 p-5">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Linhas com imagem</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{analysis.rowsWithMainImage}</p>
        </div>
        <div className="rounded-[1.75rem] bg-slate-50 p-5">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Variações</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{analysis.variationRows}</p>
        </div>
      </div>
    </section>
  );
}
