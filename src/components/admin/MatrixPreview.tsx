import { useMemo, useState } from "react";
import type { CatalogLoadResult, CatalogPreviewVariant } from "@/catalog";

type MatrixPreviewProps = {
  analysis: CatalogLoadResult;
};

const filters = [
  { label: "Todos", value: "all" },
  { label: "OK", value: "OK" },
  { label: "Revisar", value: "REVISAR" },
  { label: "Bloqueados", value: "BLOQUEADO" },
  { label: "SKU gerado", value: "generated" },
  { label: "SKU ajustado", value: "adjusted" },
  { label: "Sem mídia", value: "no_media" },
  { label: "Sem SEO", value: "no_seo" },
];

function filterVariants(variants: CatalogPreviewVariant[], filter: string) {
  if (filter === "all") return variants;
  if (filter === "generated") return variants.filter((variant) => variant.isGenerated);
  if (filter === "adjusted") return variants.filter((variant) => variant.isAdjusted);
  if (filter === "no_media") return variants.filter((variant) => !variant.hasMedia);
  if (filter === "no_seo") return variants.filter((variant) => !variant.hasSeo);
  return variants.filter((variant) => variant.validationStatus === filter);
}

export function MatrixPreview({ analysis }: MatrixPreviewProps) {
  const [filter, setFilter] = useState("all");

  const summary = useMemo(
    () => ({
      products: analysis.statistics.products,
      variants: analysis.statistics.variants,
      vehicles: analysis.statistics.vehicles,
      compatibilities: analysis.statistics.compatibilities,
      media: analysis.statistics.media,
      seo: analysis.statistics.seo,
      channels: analysis.statistics.channels,
      pendencias: analysis.statistics.pendingIssues,
      ok: analysis.statistics.ok,
      review: analysis.statistics.review,
      blocked: analysis.statistics.blocked,
    }),
    [analysis.statistics]
  );

  const filteredVariants = useMemo(() => filterVariants(analysis.previewVariants, filter), [analysis.previewVariants, filter]);

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[1.75rem] bg-slate-50 p-5">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Produtos Base</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{summary.products}</p>
        </div>
        <div className="rounded-[1.75rem] bg-slate-50 p-5">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Variações/SKUs</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{summary.variants}</p>
        </div>
        <div className="rounded-[1.75rem] bg-slate-50 p-5">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Veículos</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{summary.vehicles}</p>
        </div>
        <div className="rounded-[1.75rem] bg-slate-50 p-5">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Compatibilidades</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{summary.compatibilities}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[1.75rem] bg-slate-50 p-5">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Mídias</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{summary.media}</p>
        </div>
        <div className="rounded-[1.75rem] bg-slate-50 p-5">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">SEO</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{summary.seo}</p>
        </div>
        <div className="rounded-[1.75rem] bg-slate-50 p-5">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Canais</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{summary.channels}</p>
        </div>
        <div className="rounded-[1.75rem] bg-slate-50 p-5">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Pendências</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{summary.pendencias}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-[1.75rem] bg-slate-50 p-5">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">OK</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{summary.ok}</p>
        </div>
        <div className="rounded-[1.75rem] bg-slate-50 p-5">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Revisar</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{summary.review}</p>
        </div>
        <div className="rounded-[1.75rem] bg-slate-50 p-5">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Bloqueados</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{summary.blocked}</p>
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-4 flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={`rounded-3xl border px-4 py-2 text-sm font-semibold transition ${
                filter === item.value
                  ? "border-sky-600 bg-sky-600 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">SKU canônico</th>
                <th className="px-4 py-3 font-semibold">Nome do produto</th>
                <th className="px-4 py-3 font-semibold">Acabamento</th>
                <th className="px-4 py-3 font-semibold">Preço</th>
                <th className="px-4 py-3 font-semibold">Estoque</th>
                <th className="px-4 py-3 font-semibold">ID do anúncio</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Pendências</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredVariants.map((variant) => (
                <tr key={variant.sku}>
                  <td className="px-4 py-3">{variant.sku}</td>
                  <td className="px-4 py-3">{variant.productName}</td>
                  <td className="px-4 py-3">{variant.finish || "-"}</td>
                  <td className="px-4 py-3">{variant.price !== null ? variant.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "-"}</td>
                  <td className="px-4 py-3">{variant.stock ?? "-"}</td>
                  <td className="px-4 py-3">{variant.listingId ?? "-"}</td>
                  <td className="px-4 py-3 uppercase tracking-[0.16em] text-slate-950">{variant.validationStatus}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{variant.pendingIssues.length > 0 ? variant.pendingIssues.join(", ") : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-slate-600">A importação para o banco será liberada após a revisão dos registros bloqueados.</div>
        <button disabled className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700">Importar para Supabase</button>
      </div>
    </section>
  );
}
