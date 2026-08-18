import type { ImportRow } from "@/domain/imports/importTypes";

type ImportTableProps = {
  rows: ImportRow[];
  filter: string;
  onSelectFilter: (filter: string) => void;
};

const filters = [
  { label: "Todos", value: "all" },
  { label: "Válidos", value: "valid" },
  { label: "Com alertas", value: "alert" },
  { label: "Bloqueados", value: "blocked" },
  { label: "SKU duplicado", value: "duplicate" },
  { label: "Sem SKU", value: "missing_sku" },
  { label: "Variações", value: "variation" },
];

const getFilterRows = (rows: ImportRow[], filter: string): ImportRow[] => {
  if (filter === "all") return rows;
  return rows.filter((row) => row.status === filter);
};

export function ImportTable({ rows, filter, onSelectFilter }: ImportTableProps) {
  const filteredRows = getFilterRows(rows, filter);

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => onSelectFilter(item.value)}
            className={`rounded-3xl border px-4 py-2 text-sm font-semibold transition ${
              filter === item.value
                ? "border-sky-600 bg-sky-600 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
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
              <th className="px-4 py-3 font-semibold">Linha</th>
              <th className="px-4 py-3 font-semibold">ID do anúncio</th>
              <th className="px-4 py-3 font-semibold">SKU</th>
              <th className="px-4 py-3 font-semibold">Título</th>
              <th className="px-4 py-3 font-semibold">Preço</th>
              <th className="px-4 py-3 font-semibold">Quantidade</th>
              <th className="px-4 py-3 font-semibold">Variação</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Erros / alertas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {filteredRows.map((row) => (
              <tr key={`${row.rowNumber}-${row.sku}-${row.listingId}`}> 
                <td className="px-4 py-3">{row.rowNumber}</td>
                <td className="px-4 py-3 break-words max-w-[10rem]">{row.listingId || "-"}</td>
                <td className="px-4 py-3">{row.sku || "-"}</td>
                <td className="px-4 py-3 break-words max-w-[20rem]">{row.title || "-"}</td>
                <td className="px-4 py-3">{row.price ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(row.price) : "-"}</td>
                <td className="px-4 py-3">{row.quantity ?? "-"}</td>
                <td className="px-4 py-3">{row.isVariation ? "Sim" : "Não"}</td>
                <td className="px-4 py-3 uppercase tracking-[0.16em] text-slate-950">{row.status}</td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {row.validationIssues.length > 0 ? (
                    <ul className="space-y-1">
                      {row.validationIssues.map((issue, index) => (
                        <li key={`${issue.code}-${index}`} className={issue.type === "error" ? "text-rose-600" : "text-amber-600"}>
                          {issue.message}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "Nenhum"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
