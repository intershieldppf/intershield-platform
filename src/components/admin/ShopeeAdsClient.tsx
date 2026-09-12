"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, BarChart3, CheckCircle2, FileSpreadsheet, PauseCircle, ShieldCheck, Target, Upload } from "lucide-react";

type Row = Record<string, string>;
type Campaign = {
  id: string; name: string; status: string; impressions: number; clicks: number;
  carts: number; conversions: number; sold: number; gmv: number; spend: number; roas: number; acos: number;
};
type Report = { shop: string; period: string; createdAt: string; campaigns: Campaign[] };
type Decision = "Manter coletando" | "Otimizar" | "Revisar investimento" | "Pausado" | "Escalar com cautela";

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const number = new Intl.NumberFormat("pt-BR");

function parseCsv(source: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (char === '"' && quoted && source[index + 1] === '"') { cell += '"'; index += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === "," && !quoted) { row.push(cell.trim()); cell = ""; }
    else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && source[index + 1] === "\n") index += 1;
      row.push(cell.trim());
      if (row.some(Boolean)) rows.push(row);
      row = []; cell = "";
    } else cell += char;
  }
  if (cell || row.length) { row.push(cell.trim()); rows.push(row); }
  return rows;
}

function toNumber(value?: string) {
  if (!value || value === "-") return 0;
  const parsed = Number(value.replace(/%/g, "").replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseReport(source: string): Report {
  const rows = parseCsv(source.replace(/^\uFEFF/, ""));
  const headerIndex = rows.findIndex((row) => row.includes("Nome do Anúncio") && row.includes("Despesas"));
  if (headerIndex < 0) throw new Error("Não encontrei as colunas do relatório de anúncios da Shopee.");
  const metadata = new Map(rows.slice(0, headerIndex).filter((row) => row.length > 1).map((row) => [row[0], row[1]]));
  const headers = rows[headerIndex];
  const data: Row[] = rows.slice(headerIndex + 1).map((values) => Object.fromEntries(headers.map((header, i) => [header, values[i] ?? ""])));
  const campaigns = data.filter((item) => item["Nome do Anúncio"]).map((item, index) => ({
    id: item["ID do produto"] || `linha-${index}`,
    name: item["Nome do Anúncio"], status: item.Status || "—",
    impressions: toNumber(item.Impressões), clicks: toNumber(item.Cliques),
    carts: toNumber(item["Adicionar ao carrinho"]), conversions: toNumber(item.Conversões),
    sold: toNumber(item["Itens Vendidos"]), gmv: toNumber(item.GMV), spend: toNumber(item.Despesas),
    roas: toNumber(item.ROAS), acos: toNumber(item.ACOS),
  }));
  if (!campaigns.length) throw new Error("O arquivo foi reconhecido, mas não contém campanhas.");
  return { shop: metadata.get("Nome da loja") || "Loja Shopee", period: metadata.get("Período") || "Período não informado", createdAt: metadata.get("Data de Criação do Relatório") || "", campaigns };
}

function recommendation(campaign: Campaign, targetRoas: number, maxAcos: number, minClicks: number): { decision: Decision; detail: string } {
  if (/pausad/i.test(campaign.status)) return { decision: "Pausado", detail: "A campanha já está pausada na Shopee." };
  if (campaign.conversions >= 2 && campaign.roas >= targetRoas && campaign.acos <= maxAcos) return { decision: "Escalar com cautela", detail: "Resultado acima da meta com conversões suficientes. Aumente o orçamento em pequenos passos." };
  if (campaign.conversions > 0) return { decision: "Otimizar", detail: "Há sinal de venda, mas ainda falta confirmar margem e repetição antes de escalar." };
  if (campaign.clicks >= minClicks) return { decision: "Revisar investimento", detail: "Volume mínimo atingido sem venda. Revise anúncio, preço e busca antes de manter o gasto." };
  return { decision: "Manter coletando", detail: "Amostra pequena. Não tome uma decisão definitiva ainda." };
}

function badgeStyle(decision: Decision) {
  if (decision === "Escalar com cautela") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (decision === "Revisar investimento") return "border-rose-200 bg-rose-50 text-rose-700";
  if (decision === "Otimizar") return "border-amber-200 bg-amber-50 text-amber-700";
  if (decision === "Pausado") return "border-slate-200 bg-slate-100 text-slate-600";
  return "border-blue-200 bg-blue-50 text-blue-700";
}

export function ShopeeAdsClient() {
  const [report, setReport] = useState<Report | null>(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [targetRoas, setTargetRoas] = useState(3);
  const [maxAcos, setMaxAcos] = useState(33);
  const [minClicks, setMinClicks] = useState(20);
  const [fee, setFee] = useState(22);
  const [costs, setCosts] = useState<Record<string, number>>({});

  const totals = useMemo(() => {
    if (!report) return null;
    const sum = report.campaigns.reduce((acc, row) => ({
      impressions: acc.impressions + row.impressions, clicks: acc.clicks + row.clicks,
      conversions: acc.conversions + row.conversions, sold: acc.sold + row.sold,
      gmv: acc.gmv + row.gmv, spend: acc.spend + row.spend,
    }), { impressions: 0, clicks: 0, conversions: 0, sold: 0, gmv: 0, spend: 0 });
    return { ...sum, ctr: sum.impressions ? (sum.clicks / sum.impressions) * 100 : 0, cpc: sum.clicks ? sum.spend / sum.clicks : 0, roas: sum.spend ? sum.gmv / sum.spend : 0, acos: sum.gmv ? (sum.spend / sum.gmv) * 100 : 0 };
  }, [report]);

  async function loadFile(file?: File) {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".csv")) { setError("Envie o relatório em formato CSV exportado pela Shopee."); return; }
    try { setReport(parseReport(await file.text())); setFileName(file.name); setError(""); }
    catch (reason) { setReport(null); setError(reason instanceof Error ? reason.message : "Não foi possível ler o relatório."); }
  }

  const attention = report?.campaigns.filter((row) => recommendation(row, targetRoas, maxAcos, minClicks).decision === "Revisar investimento").length ?? 0;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[1.75rem] bg-slate-950 p-6 text-white shadow-xl shadow-slate-200 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl"><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-blue-300"><ShieldCheck className="h-4 w-4" /> Assistente supervisionado</div><h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Decisões de Ads com foco em lucro</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">Importe o relatório da Shopee. A análise acontece neste navegador e nenhuma campanha é alterada automaticamente.</p></div>
          <label className="inline-flex min-h-14 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 text-sm font-bold transition hover:bg-blue-500"><Upload className="h-4 w-4" /> Importar relatório CSV<input type="file" accept=".csv,text/csv" className="sr-only" onChange={(event) => loadFile(event.target.files?.[0])} /></label>
        </div>
        {fileName ? <p className="mt-5 text-xs text-slate-400">Arquivo analisado: {fileName}</p> : null}
      </section>

      {error ? <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />{error}</div> : null}

      {!report || !totals ? (
        <section className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm"><FileSpreadsheet className="mx-auto h-10 w-10 text-blue-600" /><h3 className="mt-4 text-xl font-bold">Comece pelo relatório “Todos os anúncios”</h3><p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">No painel de Ads da Shopee, selecione o período, exporte o CSV e importe aqui. O arquivo não é enviado para terceiros.</p></section>
      ) : (
        <>
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
            {[["Investimento", money.format(totals.spend), "Verba usada"], ["Vendas", money.format(totals.gmv), `${totals.sold} item(ns)`], ["ROAS", `${totals.roas.toFixed(2)}x`, `Meta ${targetRoas.toFixed(1)}x`], ["ACOS", `${totals.acos.toFixed(1)}%`, `Máx. ${maxAcos}%`], ["CTR", `${totals.ctr.toFixed(2)}%`, `${number.format(totals.clicks)} cliques`], ["CPC", money.format(totals.cpc), `${number.format(totals.impressions)} impressões`]].map(([label, value, note]) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold tracking-tight">{value}</p><p className="mt-1 text-xs text-slate-500">{note}</p></div>)}
          </section>

          <section className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center gap-3"><div className="rounded-xl bg-amber-100 p-2 text-amber-700"><Target className="h-5 w-5" /></div><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Diagnóstico do período</p><h3 className="text-xl font-bold">{attention ? `${attention} campanha(s) exigem revisão` : "Nenhuma pausa urgente"}</h3></div></div><p className="mt-4 text-sm leading-6 text-slate-600">ROAS consolidado de <strong>{totals.roas.toFixed(2)}x</strong> e ACOS de <strong>{totals.acos.toFixed(1)}%</strong>. A rentabilidade real depende do custo do produto, taxa e demais descontos.</p><div className="mt-4 flex items-center gap-2 rounded-xl bg-blue-50 p-3 text-xs font-semibold text-blue-800"><CheckCircle2 className="h-4 w-4 shrink-0" /> Nenhuma recomendação é executada sem sua confirmação.</div></div>
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm"><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Regras da análise</p><div className="mt-4 grid grid-cols-2 gap-3"><NumberField label="ROAS mínimo" value={targetRoas} onChange={setTargetRoas} step="0.1" /><NumberField label="ACOS máximo %" value={maxAcos} onChange={setMaxAcos} /><NumberField label="Cliques mínimos" value={minClicks} onChange={setMinClicks} /><NumberField label="Taxa Shopee %" value={fee} onChange={setFee} /></div></div>
          </section>

          <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-5 sm:px-6"><p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Plano de ação</p><div className="mt-1 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between"><h3 className="text-2xl font-bold">Campanhas</h3><p className="text-xs text-slate-500">{report.shop} · {report.period}</p></div></div>
            <div className="divide-y divide-slate-100">{report.campaigns.map((campaign) => {
              const advice = recommendation(campaign, targetRoas, maxAcos, minClicks);
              const unitCost = costs[campaign.id] || 0;
              const estimatedProfit = campaign.gmv - campaign.spend - (campaign.gmv * fee / 100) - (unitCost * campaign.sold);
              return <article key={`${campaign.id}-${campaign.name}`} className="grid gap-5 p-5 sm:p-6 xl:grid-cols-[minmax(0,1.6fr)_repeat(4,minmax(90px,.42fr))_minmax(180px,.8fr)] xl:items-center"><div className="min-w-0"><div className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] ${badgeStyle(advice.decision)}`}>{advice.decision}</div><h4 className="mt-3 font-bold leading-5 text-slate-900">{campaign.name}</h4><p className="mt-2 text-xs leading-5 text-slate-500">{advice.detail}</p></div><Metric label="Gasto" value={money.format(campaign.spend)} /><Metric label="Vendas" value={money.format(campaign.gmv)} /><Metric label="ROAS" value={`${campaign.roas.toFixed(2)}x`} /><Metric label="Cliques" value={number.format(campaign.clicks)} note={`${campaign.carts} carrinho(s)`} /><div><label className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">Custo unitário</label><input aria-label={`Custo unitário de ${campaign.name}`} type="number" min="0" step="0.01" value={unitCost || ""} placeholder="R$ 0,00" onChange={(event) => setCosts((current) => ({ ...current, [campaign.id]: Number(event.target.value) || 0 }))} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500" /><p className={`mt-2 text-xs font-bold ${estimatedProfit >= 0 ? "text-emerald-700" : "text-rose-700"}`}>Lucro est.: {money.format(estimatedProfit)}</p></div></article>;
            })}</div>
          </section>

          <section className="flex flex-col gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-950 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-3"><PauseCircle className="mt-0.5 h-5 w-5 shrink-0" /><p><strong>Modo seguro ativo.</strong> Esta versão analisa e recomenda. A conexão para aplicar ações na Shopee será uma etapa separada, após validação da API oficial e das suas regras de aprovação.</p></div><BarChart3 className="hidden h-6 w-6 shrink-0 sm:block" /></section>
        </>
      )}
    </div>
  );
}

function NumberField({ label, value, onChange, step = "1" }: { label: string; value: number; onChange: (value: number) => void; step?: string }) {
  return <label className="text-xs font-semibold text-slate-600">{label}<input type="number" min="0" step={step} value={value} onChange={(event) => onChange(Number(event.target.value) || 0)} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-blue-500 focus:bg-white" /></label>;
}

function Metric({ label, value, note }: { label: string; value: string; note?: string }) {
  return <div><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">{label}</p><p className="mt-1 font-bold text-slate-900">{value}</p>{note ? <p className="mt-1 text-xs text-slate-500">{note}</p> : null}</div>;
}
