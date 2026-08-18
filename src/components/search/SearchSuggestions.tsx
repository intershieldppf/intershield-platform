export type ProductSearchSuggestion = {
  id: string;
  title: string;
  price: number | null;
  image: string;
  sku: string | null;
  brand: string | null;
  type: "PPF" | "Black Piano";
};

type SearchSuggestionsProps = {
  suggestions: ProductSearchSuggestion[];
  onSelect: (value: ProductSearchSuggestion) => void;
};

function formatPrice(price: number | null) {
  if (price === null) return "Consulte";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
}

export function SearchSuggestions({
  suggestions,
  onSelect,
}: SearchSuggestionsProps) {
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="absolute left-0 right-0 top-[66px] z-50 overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-xl">
      <div className="border-b border-slate-100 px-4 py-2.5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          Produtos encontrados
        </p>
      </div>

      <div className="max-h-[410px] overflow-y-auto py-1">
        {suggestions.slice(0, 6).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item)}
            className="flex w-full items-center gap-3 border-b border-slate-100 px-3 py-3 text-left transition-colors last:border-b-0 hover:bg-slate-50 sm:px-4"
          >
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 sm:h-16 sm:w-16">
              {/* Imagens vêm da exportação oficial do catálogo. */}
              <img
                src={item.image}
                alt=""
                className="h-full w-full object-contain p-1"
                loading="lazy"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-blue-50 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-blue-600">
                  {item.type}
                </span>
                {item.brand ? (
                  <span className="truncate text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">
                    {item.brand}
                  </span>
                ) : null}
              </div>

              <p className="mt-1.5 line-clamp-2 text-[13px] font-semibold leading-5 text-slate-950 sm:text-[14px]">
                {item.title}
              </p>

              <div className="mt-1 flex items-center justify-between gap-3">
                <p className="text-[13px] font-bold text-slate-950">
                  {formatPrice(item.price)}
                </p>
                <span className="shrink-0 text-[11px] font-semibold text-blue-600">
                  Ver produto →
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
