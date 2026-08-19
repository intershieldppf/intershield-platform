"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { SearchInput } from "@/components/search/SearchInput";
import {
  SearchSuggestions,
  type ProductSearchSuggestion,
} from "@/components/search/SearchSuggestions";

const QUICK_LINKS = [
  { label: "PPF Interior", query: "PPF Interior" },
  { label: "PPF Exterior", query: "PPF Exterior" },
  { label: "Black Piano", query: "Black Piano" },
];

type VehicleBarProps = {
  embedded?: boolean;
};

export function VehicleBar({ embedded = false }: VehicleBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<ProductSearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const term = query.trim();

    if (term.length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const timer = window.setTimeout(async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `/api/catalogo/sugestoes?q=${encodeURIComponent(term)}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("Falha ao buscar produtos");
        }

        const data = (await response.json()) as {
          suggestions?: ProductSearchSuggestion[];
        };

        setSuggestions(data.suggestions ?? []);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Erro ao buscar produtos:", error);
          setSuggestions([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 180);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  function handleQueryChange(value: string) {
    setQuery(value);
    setIsOpen(value.trim().length >= 2);
  }

  function goToCatalog(value: string) {
    const term = value.trim();
    router.push(term ? `/catalogo?q=${encodeURIComponent(term)}` : "/catalogo");
  }

  function handleSelect(product: ProductSearchSuggestion) {
    setQuery(product.title);
    setIsOpen(false);
    goToCatalog(product.title);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsOpen(false);
    goToCatalog(query);
  }

  return (
    <section
      id="buscar-veiculo"
      className={
        embedded
          ? "scroll-mt-24 bg-transparent"
          : "scroll-mt-24 border-b border-slate-100 bg-white"
      }
    >
      <div
        className={
          embedded
            ? "mx-auto max-w-5xl px-5 pb-6 pt-3 sm:px-6 sm:pb-7 sm:pt-4"
            : "mx-auto max-w-5xl px-5 pb-7 pt-3 sm:px-8 sm:pb-8 sm:pt-4"
        }
      >
        <div className="mx-auto max-w-3xl">
          {!embedded && (
            <div className="text-center">
              <div className="flex items-center justify-center gap-4">
                <span className="hidden h-px w-10 bg-slate-300 sm:block" />
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-blue-600">
                  Encontre seu veículo
                </p>
                <span className="hidden h-px w-10 bg-slate-300 sm:block" />
              </div>

              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-[30px]">
                Encontre a proteção ideal para o seu veículo
              </h2>
            </div>
          )}

          <form onSubmit={handleSubmit} className="relative mt-5">
            <SearchInput value={query} onChange={handleQueryChange} />

            {isOpen && loading && (
              <div className="absolute left-0 right-0 top-[68px] z-50 rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-lg">
                Buscando produtos...
              </div>
            )}

            {isOpen && !loading && suggestions.length > 0 && (
              <SearchSuggestions
                suggestions={suggestions}
                onSelect={handleSelect}
              />
            )}

            {isOpen &&
              !loading &&
              query.trim().length >= 2 &&
              suggestions.length === 0 && (
                <div className="absolute left-0 right-0 top-[68px] z-50 rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-lg">
                  Nenhum anúncio com esse termo. Pressione Enter para buscar no catálogo completo.
                </div>
              )}
          </form>

          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[12px] text-slate-500">
              Busque por veículo ou produto.
            </p>

            <button
              type="button"
              onClick={() => goToCatalog("")}
              className="w-fit text-[12px] font-semibold text-blue-600 transition-colors hover:text-blue-700"
            >
              Ver catálogo completo →
            </button>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 sm:justify-center">
            {QUICK_LINKS.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => goToCatalog(item.query)}
                className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
