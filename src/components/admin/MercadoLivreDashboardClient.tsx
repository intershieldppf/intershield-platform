"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, Package, RefreshCw, ShoppingBag, Store, TrendingUp } from "lucide-react";

import type { MercadoLivreDashboard } from "@/lib/integrations/mercadolivre/syncStore";

function formatDate(value: string | null) {
  if (!value) return "Ainda não realizada";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
}

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const number = new Intl.NumberFormat("pt-BR");

export function MercadoLivreDashboardClient({ initialDashboard }: { initialDashboard: MercadoLivreDashboard }) {
  const [dashboard, setDashboard] = useState(initialDashboard);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function synchronize() {
    setSyncing(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/integrations/mercadolivre", { method: "POST" });
      const data = (await response.json()) as { dashboard?: MercadoLivreDashboard; error?: string };
      if (!response.ok || !data.dashboard) throw new Error(data.error ?? "Falha na sincronização.");
      setDashboard(data.dashboard);
      setNotice("Conta, anúncios e pedidos sincronizados com sucesso.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível sincronizar.");
    } finally {
      setSyncing(false);
    }
  }

  const runFailed = dashboard.lastRun?.status === "failed";

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[1.75rem] bg-[#ffe600] p-6 text-slate-950 shadow-xl shadow-yellow-100 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-slate-700"><Store className="h-4 w-4" /> Integração oficial</div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Mercado Livre {dashboard.connected ? "conectado" : "não conectado"}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-700">Sincronização somente leitura. Esta área não altera preço, estoque ou anúncios.</p>
          </div>
          <button type="button" onClick={synchronize} disabled={syncing || !dashboard.connected} className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
            <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} /> {syncing ? "Sincronizando..." : "Sincronizar agora"}
          </button>
        </div>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-slate-700">
          <span>Conta: {dashboard.account?.nickname ?? dashboard.externalUserId ?? "—"}</span>
          <span>Última sincronização: {formatDate(dashboard.lastSyncAt)}</span>
        </div>
      </section>

      {notice ? <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />{notice}</div> : null}
      {error ? <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />{error}</div> : null}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={Package} label="Anúncios importados" value={number.format(dashboard.items.total)} note={`${dashboard.items.active} ativos · ${dashboard.items.paused} pausados`} />
        <Metric icon={ShoppingBag} label="Pedidos importados" value={number.format(dashboard.orders.total)} note={`${dashboard.orders.paid} pagos`} />
        <Metric icon={TrendingUp} label="Valor dos pedidos" value={money.format(dashboard.orders.revenue)} note="Nos pedidos importados" />
        <Metric icon={Store} label="Estoque anunciado" value={number.format(dashboard.items.stock)} note={`${number.format(dashboard.items.sold)} unidades vendidas`} />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Conta conectada</p>
          <h3 className="mt-2 text-2xl font-bold">{dashboard.account?.nickname ?? "Aguardando primeira sincronização"}</h3>
          <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
            <Detail label="ID do vendedor" value={dashboard.account?.external_user_id ?? dashboard.externalUserId ?? "—"} />
            <Detail label="Site" value={dashboard.account?.site_id ?? "—"} />
            <Detail label="Status" value={dashboard.account?.account_status ?? dashboard.connectionStatus ?? "—"} />
            <Detail label="Reputação" value={dashboard.account?.reputation_level ?? "—"} />
          </dl>
        </div>
        <div className={`rounded-[1.75rem] border p-6 shadow-sm ${runFailed ? "border-rose-200 bg-rose-50" : "border-slate-200 bg-white"}`}>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Última execução</p>
          <h3 className="mt-2 text-xl font-bold">{dashboard.lastRun ? (dashboard.lastRun.status === "completed" ? "Concluída" : dashboard.lastRun.status === "running" ? "Em andamento" : "Falhou") : "Nenhuma execução"}</h3>
          {dashboard.lastRun ? <div className="mt-4 space-y-2 text-sm text-slate-600"><p>Início: {formatDate(dashboard.lastRun.started_at)}</p><p>Etapa: {dashboard.lastRun.stage}</p><p>{dashboard.lastRun.items_synced} anúncios · {dashboard.lastRun.orders_synced} pedidos</p>{dashboard.lastRun.error_message ? <p className="font-semibold text-rose-700">{dashboard.lastRun.error_message}</p> : null}</div> : <p className="mt-3 text-sm text-slate-600">Clique em “Sincronizar agora” para importar os primeiros dados.</p>}
        </div>
      </section>

      <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-950"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" /><p><strong>Modo seguro ativo.</strong> A integração apenas consulta e armazena dados. Alterações nos marketplaces só serão liberadas futuramente com sua aprovação explícita.</p></div>
    </div>
  );
}

function Metric({ icon: Icon, label, value, note }: { icon: typeof Package; label: string; value: string; note: string }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><Icon className="h-5 w-5 text-blue-600" /><p className="mt-4 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold tracking-tight">{value}</p><p className="mt-1 text-xs text-slate-500">{note}</p></div>;
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">{label}</dt><dd className="mt-1 font-semibold text-slate-900">{value}</dd></div>;
}

