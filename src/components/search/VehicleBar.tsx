"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { SearchInput } from "@/components/search/SearchInput";
import { SearchSuggestions } from "@/components/search/SearchSuggestions";
import type { VehicleSearchResult } from "@/services/catalog/catalogService";
import { LocalCatalogService } from "@/services/catalog/localCatalogService";

const catalogService = new LocalCatalogService();

export function VehicleBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedVehicle, setSelectedVehicle] =
    useState<VehicleSearchResult | null>(null);
  const [suggestions, setSuggestions] = useState<VehicleSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const term = query.trim();

    if (term.length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    let active = true;

    const timer = window.setTimeout(async () => {
      try {
        setLoading(true);

        const results = await catalogService.searchVehicles(term);

        if (!active) return;

        setSuggestions(results.slice(0, 5));
      } catch (error) {
        console.error("Erro ao buscar veículos:", error);

        if (active) {
          setSuggestions([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }, 250);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [query]);

  function handleQueryChange(value: string) {
    setQuery(value);
    setSelectedVehicle(null);
    setIsOpen(value.trim().length >= 2);
  }

  function goToCatalog(value: string) {
    const term = value.trim();
    router.push(term ? `/catalogo?q=${encodeURIComponent(term)}` : "/catalogo");
  }

  function handleSelect(vehicle: VehicleSearchResult) {
    const value = `${vehicle.brand.name} ${vehicle.vehicleModel.name} ${vehicle.vehicle.yearStart}`;
    setSelectedVehicle(vehicle);
    setQuery(value);
    setIsOpen(false);
    goToCatalog(value);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    goToCatalog(query);
  }

  return (
    <section
      id="buscar-veiculo"
      className="scroll-mt-24 border-b border-slate-100 bg-white"
    >
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-10">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4">
              <span className="hidden h-px w-10 bg-slate-300 sm:block" />
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-blue-600">
                Encontre seu veículo
              </p>
              <span className="hidden h-px w-10 bg-slate-300 sm:block" />
            </div>

            <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950 sm:text-[30px]">
              Localize os kits compatíveis com o seu carro
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="relative mt-6">
            <SearchInput value={query} onChange={handleQueryChange} />

            {isOpen && loading && (
              <div className="absolute left-0 right-0 top-[66px] z-50 rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-lg">
                Buscando veículos...
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
                <div className="absolute left-0 right-0 top-[66px] z-50 rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-lg">
                  Nenhum veículo encontrado. Pressione Enter para buscar no catálogo completo.
                </div>
              )}
          </form>

          <div className="mt-3 flex min-h-5 items-center justify-between gap-3 px-1">
            <p className="text-[12px] text-slate-500">
              Não encontrou seu veículo?{" "}
              <a
                href="#suporte"
                className="font-semibold text-slate-900 transition-colors hover:text-blue-600"
              >
                Fale com a InterShield
              </a>
            </p>

            {selectedVehicle && (
              <p className="hidden text-[12px] font-semibold text-blue-600 sm:block">
                {selectedVehicle.brand.name} {selectedVehicle.vehicleModel.name}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
