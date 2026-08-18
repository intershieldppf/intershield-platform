"use client";

import { useMemo, useState } from "react";
import { MatrixPreview } from "@/components/admin/MatrixPreview";
import type { CatalogLoadResult } from "@/catalog";

const acceptedExtensions = [".xlsx"];

export default function AdminImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [catalogResult, setCatalogResult] = useState<CatalogLoadResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLoadMatrix = async () => {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/importar/matriz");
      const json = await res.json();
      if (json.error) {
        setError(String(json.error));
      } else {
        setCatalogResult(json as CatalogLoadResult);
      }
    } catch (err) {
      setError("Falha ao carregar a Matriz Mestre.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setCatalogResult(null);
    setError(null);
  };

  const handleFile = async (fileList: FileList | null) => {
    if (!fileList?.length) return;
    const selected = fileList[0];
    if (!acceptedExtensions.some((ext) => selected.name.toLowerCase().endsWith(ext))) {
      setError("Formato de arquivo inválido. Envie .xlsx.");
      return;
    }

    setError(null);
    setFile(selected);
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    await handleFile(event.dataTransfer.files);
  };

  const fileInfo = useMemo(() => {
    if (!file) return "Nenhum arquivo selecionado";
    return `${file.name} · ${(file.size / 1024).toFixed(2)} KB`;
  }, [file]);

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-14 text-slate-950 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-sky-600">Administrador</p>
              <h1 className="text-3xl font-semibold text-slate-950">Importar catálogo</h1>
            </div>
            <p className="text-sm text-slate-600">Centro de Importação da Matriz Mestre</p>
          </div>

          <div
            onDrop={handleDrop}
            onDragOver={(event) => event.preventDefault()}
            className="rounded-[2rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-center transition hover:border-slate-400"
          >
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Selecione ou arraste arquivo</p>
            <p className="mt-3 text-lg font-semibold text-slate-950">Selecione ou arraste a Matriz Mestre da InterShield</p>
            <p className="mt-2 text-sm text-slate-600">Aceitamos apenas arquivos .xlsx da Matriz Mestre.</p>
            <input
              type="file"
              accept=".xlsx"
              className="mx-auto mt-6 block w-full max-w-md cursor-pointer rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm text-slate-700 shadow-sm transition hover:border-slate-300"
              onChange={(event) => handleFile(event.target.files)}
            />
            <p className="mt-4 text-sm text-slate-600">{fileInfo}</p>
          </div>

          {error ? (
            <div className="mt-6 rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>
          ) : null}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleLoadMatrix}
                disabled={loading}
                className="inline-flex h-14 items-center justify-center rounded-[1.5rem] bg-sky-600 px-6 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Carregando..." : "Carregar Matriz Mestre"}
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="inline-flex h-14 items-center justify-center rounded-[1.5rem] border border-slate-200 bg-white px-6 text-sm font-semibold uppercase tracking-[0.18em] text-slate-950 transition hover:border-slate-300"
              >
                Limpar análise
              </button>
            </div>
            <div className="text-sm text-slate-500">Sem conexão com Supabase nesta versão.</div>
          </div>
        </div>

        {catalogResult ? <MatrixPreview analysis={catalogResult} /> : null}
      </div>
    </div>
  );
}
