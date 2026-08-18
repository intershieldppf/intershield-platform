"use client";

import { useMemo, useState } from "react";

const vehicleOptions = [
  "Toyota Corolla 2022",
  "Honda Civic 2021",
  "Chevrolet Onix 2023",
  "Volkswagen T-Cross 2024",
  "Yamaha MT-07 2022",
  "Harley-Davidson 883",
  "BMW Série 3 2023",
  "Jeep Compass 2024",
  "Ford Ranger 2023",
  "Nissan Versa 2022",
];

export function SearchSection() {
  const [query, setQuery] = useState("");

  const suggestions = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!text) {
      return vehicleOptions.slice(0, 5);
    }

    return vehicleOptions.filter((option) => option.toLowerCase().includes(text)).slice(0, 5);
  }, [query]);

  return (
    <section id="busca" className="rounded-[2rem] border border-slate-200/90 bg-slate-950/95 px-6 py-8 text-white shadow-2xl shadow-slate-950/10 sm:px-8 lg:px-10">
      <div className="max-w-4xl space-y-5">
        <div className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10 backdrop-blur-xl sm:p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Encontre o kit certo</p>
          <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
            Busque por marca, modelo e ano em segundos.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            Veja opções preparadas para o seu veículo com acabamento premium e encaixe perfeito.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-[1.8fr_1fr]">
            <label className="grid gap-2 text-sm text-slate-200">
              Veículo
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Ex: Toyota Corolla 2022"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/30"
              />
            </label>
            <button className="inline-flex items-center justify-center rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-sky-400">
              Buscar kits
            </button>
          </div>
        </div>

        <div className="rounded-3xl bg-slate-900/95 p-5 ring-1 ring-white/10 sm:p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Sugestões</p>
          <div className="mt-4 grid gap-3 text-sm text-slate-200 sm:grid-cols-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setQuery(suggestion)}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:border-sky-400/50 hover:bg-slate-800"
              >
                {suggestion}
              </button>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Dica: use o campo para encontrar rapidamente kits compatíveis com o seu ano e modelo.
          </p>
        </div>
      </div>
    </section>
  );
}
