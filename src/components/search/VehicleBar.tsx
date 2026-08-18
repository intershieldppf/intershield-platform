"use client";

import { useEffect, useState } from "react";
import { LocalCatalogService } from "@/services/catalog/localCatalogService";
import type { VehicleSearchResult } from "@/services/catalog/catalogService";
import { SearchInput } from "@/components/search/SearchInput";
import { SearchSuggestions } from "@/components/search/SearchSuggestions";

const catalogService = new LocalCatalogService();

export function VehicleBar() {
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

  function handleSelect(vehicle: VehicleSearchResult) {
    setSelectedVehicle(vehicle);

    setQuery(
      `${vehicle.brand.name} ${vehicle.vehicleModel.name} ${vehicle.vehicle.yearStart}`
    );

    setIsOpen(false);
  }

  return (
    <section id="buscar-veiculo" className="border-b border-slate-100 bg-white">
      <div className="mx-auto max-w-4xl px-5 py-6 sm:px-8 sm:py-7">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 text-center">
            <h2 className="text-xl font-bold tracking-tight text-slate-950 sm:text-[24px]">
              Encontre seu veículo
            </h2>

            <p className="mt-1 text-[13px] text-slate-500">
              Digite marca, modelo e ano para localizar os kits compatíveis.
            </p>
          </div>

          <div className="relative">
            <SearchInput
              value={query}
              onChange={handleQueryChange}
            />

            {isOpen && loading && (
              <div className="absolute left-0 right-0 top-[56px] z-50 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-xl">
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
                <div className="absolute left-0 right-0 top-[56px] z-50 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-xl">
                  Nenhum veículo encontrado.
                </div>
              )}
          </div>

          <div className="mt-2 flex min-h-4 items-center justify-between gap-3 px-1">
            <p className="text-[11px] text-slate-500">
              Não encontrou seu veículo?{" "}
              <a
                href="#suporte"
                className="font-semibold text-slate-900 transition hover:text-sky-600"
              >
                Fale com a InterShield
              </a>
            </p>

            {selectedVehicle && (
              <p className="hidden text-[11px] font-medium text-slate-500 sm:block">
                {selectedVehicle.brand.name}{" "}
                {selectedVehicle.vehicleModel.name}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}