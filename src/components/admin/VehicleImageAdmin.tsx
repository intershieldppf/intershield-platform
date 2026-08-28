"use client";

import { useEffect, useMemo, useState } from "react";

type Vehicle = {
  id: string;
  brand: string | null;
  model: string | null;
  yearStart: number | null;
  yearEnd: number | null;
  imageUrl: string | null;
  imageSource: "manual" | "catalog" | "marketplace" | null;
  imageStatus: "missing" | "selected" | "review" | null;
  imageAlt: string | null;
  candidateCount: number;
  type: "car" | "motorcycle" | null;
};

type Candidate = {
  url: string;
  source: "catalog" | "marketplace";
  productName: string | null;
  productSku: string | null;
};

type Filter = "all" | "selected" | "missing" | "review" | "car" | "motorcycle";

const filterLabels: Array<[Filter, string]> = [
  ["all", "Todos"],
  ["selected", "Com imagem"],
  ["missing", "Sem imagem"],
  ["review", "Revisar"],
  ["car", "Carros"],
  ["motorcycle", "Motos"],
];

function years(vehicle: Vehicle) {
  if (!vehicle.yearStart && !vehicle.yearEnd) return "—";
  if (vehicle.yearStart === vehicle.yearEnd) return String(vehicle.yearStart);
  return `${vehicle.yearStart ?? "?"}–${vehicle.yearEnd ?? "?"}`;
}

export function VehicleImageAdmin() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<Vehicle | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedUrl, setSelectedUrl] = useState("");
  const [manualUrl, setManualUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/admin/veiculos/imagens", { signal: controller.signal })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? "Falha ao carregar veículos.");
        setVehicles(data.vehicles ?? []);
      })
      .catch((requestError: Error) => {
        if (requestError.name !== "AbortError") setError(requestError.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, []);

  const filteredVehicles = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("pt-BR");

    return vehicles.filter((vehicle) => {
      const textMatches = !term || `${vehicle.brand ?? ""} ${vehicle.model ?? ""}`.toLocaleLowerCase("pt-BR").includes(term);
      const filterMatches =
        filter === "all" ||
        vehicle.imageStatus === filter ||
        vehicle.type === filter;
      return textMatches && filterMatches;
    });
  }, [filter, query, vehicles]);

  async function openVehicle(vehicle: Vehicle) {
    setSelected(vehicle);
    setSelectedUrl(vehicle.imageUrl ?? "");
    setManualUrl("");
    setImageAlt(vehicle.imageAlt ?? `${vehicle.brand ?? ""} ${vehicle.model ?? ""} ${years(vehicle)}`.trim());
    setCandidates([]);
    setError(null);

    try {
      const response = await fetch(`/api/admin/veiculos/${vehicle.id}/imagens`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Falha ao carregar opções de imagem.");
      setCandidates(data.candidates ?? []);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Falha ao carregar opções de imagem.");
    }
  }

  async function saveImage() {
    if (!selected) return;
    const imageUrl = manualUrl.trim() || selectedUrl;
    if (!imageUrl) {
      setError("Selecione uma imagem do catálogo ou informe uma URL.");
      return;
    }

    const selectedCandidate = candidates.find((candidate) => candidate.url === imageUrl);
    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/veiculos/${selected.id}/imagem`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl,
          imageAlt,
          imageSource: manualUrl.trim() ? "manual" : selectedCandidate?.source ?? selected.imageSource ?? "manual",
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Falha ao salvar a imagem.");

      setVehicles((current) =>
        current.map((vehicle) =>
          vehicle.id === selected.id ? { ...vehicle, ...data.image, imageUrl } : vehicle,
        ),
      );
      setSelected((current) => current ? { ...current, ...data.image, imageUrl } : current);
      setSelectedUrl(imageUrl);
      setManualUrl("");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Falha ao salvar a imagem.");
    } finally {
      setSaving(false);
    }
  }

  async function removeImage() {
    if (!selected) return;
    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/veiculos/${selected.id}/imagem`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Falha ao remover a imagem.");
      setVehicles((current) => current.map((vehicle) => vehicle.id === selected.id ? { ...vehicle, ...data.image, imageUrl: null } : vehicle));
      setSelected((current) => current ? { ...current, ...data.image, imageUrl: null } : current);
      setSelectedUrl("");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Falha ao remover a imagem.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-950 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-blue-600">Administrador</p>
          <h1 className="mt-2 text-3xl font-semibold">Gestão de imagens dos veículos</h1>
          <p className="mt-2 text-sm text-slate-600">Escolha uma imagem proveniente de um produto compatível ou informe uma URL oficial.</p>

          <div className="mt-7 grid gap-4 lg:grid-cols-[1fr_auto]">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Buscar marca ou modelo
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="BMW, Corolla, HR-V" className="h-12 rounded-xl border border-slate-200 px-4 outline-none focus:border-blue-400" />
            </label>
            <div className="flex flex-wrap items-end gap-2">
              {filterLabels.map(([value, label]) => (
                <button key={value} type="button" onClick={() => setFilter(value)} className={`h-11 rounded-xl border px-4 text-xs font-semibold ${filter === value ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-700"}`}>{label}</button>
              ))}
            </div>
          </div>

          {error ? <p role="alert" className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</p> : null}

          <div className="mt-7 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-100 text-xs uppercase tracking-[0.12em] text-slate-500"><tr><th className="p-4">Marca</th><th className="p-4">Modelo</th><th className="p-4">Anos</th><th className="p-4">Status</th><th className="p-4">Opções</th><th className="p-4">Ação</th></tr></thead>
              <tbody className="divide-y divide-slate-200">
                {filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className={selected?.id === vehicle.id ? "bg-blue-50" : "bg-white"}>
                    <td className="p-4 font-semibold">{vehicle.brand ?? "—"}</td><td className="p-4">{vehicle.model ?? "—"}</td><td className="p-4">{years(vehicle)}</td>
                    <td className="p-4"><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">{vehicle.imageStatus === "selected" ? "Selecionada" : vehicle.imageStatus === "review" ? "Revisar" : "Sem imagem"}</span></td>
                    <td className="p-4">{vehicle.candidateCount}</td>
                    <td className="p-4"><button type="button" onClick={() => openVehicle(vehicle)} className="rounded-lg bg-slate-950 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-600">Gerenciar</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {loading || filteredVehicles.length === 0 ? <p className="p-10 text-center text-sm text-slate-500">{loading ? "Carregando veículos..." : "Nenhum veículo encontrado."}</p> : null}
          </div>
        </section>

        {selected ? (
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-semibold">{selected.brand} {selected.model}</h2>
            <p className="mt-2 text-sm text-slate-500">Selecione uma opção compatível ou use uma URL HTTPS validada.</p>

            {candidates.length > 0 ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {candidates.map((candidate) => (
                  <label key={candidate.url} className={`cursor-pointer overflow-hidden rounded-2xl border p-3 ${selectedUrl === candidate.url && !manualUrl ? "border-blue-600 ring-2 ring-blue-100" : "border-slate-200"}`}>
                    <span role="img" aria-label={candidate.productName ?? "Imagem candidata"} className="block aspect-video rounded-xl bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${candidate.url})` }} />
                    <span className="mt-3 flex items-start gap-2 text-xs text-slate-600"><input type="radio" name="candidate" checked={selectedUrl === candidate.url && !manualUrl} onChange={() => { setSelectedUrl(candidate.url); setManualUrl(""); }} /><span>{candidate.productName ?? candidate.productSku ?? "Imagem do catálogo"}</span></span>
                  </label>
                ))}
              </div>
            ) : <p className="mt-6 rounded-xl bg-slate-50 p-5 text-sm text-slate-600">Nenhuma imagem compatível foi encontrada no catálogo.</p>}

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-slate-700">URL manual<input type="url" value={manualUrl} onChange={(event) => setManualUrl(event.target.value)} placeholder="https://..." className="h-12 rounded-xl border border-slate-200 px-4 outline-none focus:border-blue-400" /></label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">Texto alternativo<input value={imageAlt} onChange={(event) => setImageAlt(event.target.value)} className="h-12 rounded-xl border border-slate-200 px-4 outline-none focus:border-blue-400" /></label>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={saveImage} disabled={saving} className="h-12 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Salvando..." : "Salvar imagem"}</button>
              <button type="button" onClick={removeImage} disabled={saving || !selected.imageUrl} className="h-12 rounded-xl border border-rose-200 px-6 text-sm font-semibold text-rose-700 disabled:opacity-50">Remover imagem</button>
            </div>
            <p className="mt-5 text-xs leading-5 text-amber-700">As seleções desta tela são mantidas durante a execução do servidor. Configure armazenamento persistente antes de usá-la como fonte definitiva do catálogo.</p>
          </section>
        ) : null}
      </div>
    </main>
  );
}
