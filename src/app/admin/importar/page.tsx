"use client";

import { useMemo, useState } from "react";
import { MatrixPreview } from "@/components/admin/MatrixPreview";
import type { CatalogLoadResult } from "@/catalog";

const acceptedExtensions = [".xlsx"];

type ImportCoverage = {
  products: number;
  withDescription: number;
  withImages: number;
  withSku: number;
  withPrice: number;
  missingDescription: number;
  missingImages: number;
  missingSku: number;
  missingPrice: number;
};

type ImportPreviewItem = {
  listingId: string;
  title: string | null;
  sku: string | null;
  price: number | null;
  hasDescription: boolean;
  images: number;
  variants: string[];
};

type ImportReport = {
  fileName: string;
  analyzedAt: string;
  importStandard: string;
  coverage: ImportCoverage;
  preview: ImportPreviewItem[];
};

export default function AdminImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [catalogResult, setCatalogResult] = useState<CatalogLoadResult | null>(null);
  const [importReport, setImportReport] = useState<ImportReport | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLoadMatrix = async () => {
    setError(null);
    setImportReport(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/importar/matriz");
      const json = await res.json();
      if (!res.ok || json.error) {
        setError(String(json.error ?? "Falha ao carregar a Matriz Mestre."));
      } else {
        setCatalogResult(json as CatalogLoadResult);
      }
    } catch {
      setError("Falha ao carregar a Matriz Mestre.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeSelectedFile = async () => {
    if (!file) {
      setError("Selecione um arquivo .xlsx antes de analisar.");
      return;
    }

    setError(null);
    setCatalogResult(null);
    setImportReport(null);
    setLoading(true);

    try {
      const body = new FormData();
      body.append("file", file);

      const res = await fetch("/api/admin/importar/matriz", {
        method: "POST",
        body,
      });
      const json = await res.json();

      if (!res.ok || json.error) {
        setError(String(json.error ?? "Falha ao analisar o arquivo."));
      } else {
        setImportReport(json as ImportReport);
      }
    } catch {
      setError("Falha ao analisar o arquivo selecionado.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setCatalogResult(null);
    setImportReport(null);
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
    setCatalogResult(null);
    setImportReport(null);
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
              <p className="text-sm uppercase tracking-[0.35em] text-blue-600">Administrador</p>
              <h1 className="text-3xl font-semibold text-slate-950">Importar catálogo</h1>
            </div>
            <p className="text-sm text-slate-600">Padrão InterShield Storefront Product V1</p>
          </div>

          <div
            onDrop={handleDrop}
            onDragOver={(event) => event.preventDefault()}
            className="rounded-[2rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-center transition hover:border-slate-400"
          >
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Selecione ou arraste arquivo</p>
            <p className="mt-3 text-lg font-semibold text-slate-950">Envie uma exportação ou Matriz Mestre da InterShield</p>
            <p className="mt-2 text-sm text-slate-600">
              O analisador reconhece a aba Original_ML e consolida descrição, imagens, SKU, preço e variações por anúncio.
            </p>
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
                onClick={handleAnalyzeSelectedFile}
                disabled={loading || !file}
                className="inline-flex h-14 items-center justify-center rounded-[1.5rem] bg-blue-600 px-6 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Analisando..." : "Analisar arquivo selecionado"}
              </button>
              <button
                type="button"
                onClick={handleLoadMatrix}
                disabled={loading}
                className="inline-flex h-14 items-center justify-center rounded-[1.5rem] border border-slate-200 bg-white px-6 text-sm font-semibold uppercase tracking-[0.18em] text-slate-950 transition hover:border-blue-300 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Carregando..." : "Carregar Matriz atual"}
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="inline-flex h-14 items-center justify-center rounded-[1.5rem] border border-slate-200 bg-white px-6 text-sm font-semibold uppercase tracking-[0.18em] text-slate-950 transition hover:border-slate-300"
              >
                Limpar análise
              </button>
            </div>
            <div className="text-sm text-slate-500">Validação sem publicar alterações automaticamente.</div>
          </div>
        </div>

        {importReport ? (
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-blue-600">Arquivo reconhecido</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">{importReport.fileName}</h2>
                <p className="mt-2 text-sm text-slate-500">{importReport.importStandard}</p>
              </div>
              <p className="text-sm font-semibold text-slate-600">{importReport.coverage.products} anúncios consolidados</p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {[
                ["Descrições", importReport.coverage.withDescription, importReport.coverage.missingDescription],
                ["Imagens", importReport.coverage.withImages, importReport.coverage.missingImages],
                ["SKUs", importReport.coverage.withSku, importReport.coverage.missingSku],
                ["Preços", importReport.coverage.withPrice, importReport.coverage.missingPrice],
                ["Total", importReport.coverage.products, 0],
              ].map(([label, ok, missing]) => (
                <div key={String(label)} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
                  <p className="mt-2 text-2xl font-bold text-slate-950">{ok}</p>
                  {Number(missing) > 0 ? (
                    <p className="mt-1 text-xs text-amber-700">{missing} ausentes</p>
                  ) : (
                    <p className="mt-1 text-xs text-emerald-700">OK</p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-7 overflow-hidden rounded-2xl border border-slate-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Anúncio</th>
                      <th className="px-4 py-3">SKU</th>
                      <th className="px-4 py-3">Descrição</th>
                      <th className="px-4 py-3">Imagens</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {importReport.preview.map((item) => (
                      <tr key={item.listingId}>
                        <td className="max-w-lg px-4 py-3">
                          <p className="font-semibold text-slate-900">{item.title ?? "Sem título"}</p>
                          <p className="mt-1 text-xs text-slate-400">{item.listingId}</p>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{item.sku ?? "—"}</td>
                        <td className="px-4 py-3 text-slate-600">{item.hasDescription ? "OK" : "Ausente"}</td>
                        <td className="px-4 py-3 text-slate-600">{item.images}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        ) : null}

        {catalogResult ? <MatrixPreview analysis={catalogResult} /> : null}
      </div>
    </div>
  );
}
