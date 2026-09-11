"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Bell, BellOff, Check, ChevronRight, CircleDollarSign, Clipboard,
  Download, ExternalLink, MapPin, MessageCircle, PackageCheck,
  PackageOpen, Plus, Printer, RefreshCw, Search, Send, Truck, X,
} from "lucide-react";

import type { OrderStatus, StoreOrder } from "@/lib/orders/orderStore";

type Props = { initialOrders: StoreOrder[]; configured: boolean };
type Filter = "all" | OrderStatus;
type SourceFilter = "all" | StoreOrder["source"];
type DeliveryFilter = "all" | StoreOrder["shipping_type"];
type PaymentFilter = "all" | "approved" | "pending" | "failed";
type Sort = "newest" | "oldest" | "highest";

const STATUS: Record<OrderStatus, { label: string; tone: string }> = {
  awaiting_payment: { label: "Aguardando pagamento", tone: "bg-amber-50 text-amber-800 ring-amber-200" },
  new: { label: "Novo", tone: "bg-blue-50 text-blue-700 ring-blue-200" },
  preparing: { label: "Em preparação", tone: "bg-violet-50 text-violet-700 ring-violet-200" },
  ready: { label: "Pronto", tone: "bg-cyan-50 text-cyan-700 ring-cyan-200" },
  shipped: { label: "Enviado", tone: "bg-indigo-50 text-indigo-700 ring-indigo-200" },
  completed: { label: "Concluído", tone: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  cancelled: { label: "Cancelado", tone: "bg-rose-50 text-rose-700 ring-rose-200" },
};

const FILTERS: Array<{ value: Filter; label: string }> = [
  { value: "all", label: "Todos" },
  { value: "awaiting_payment", label: "Aguardando pagamento" },
  { value: "new", label: "Novos" },
  { value: "preparing", label: "Preparação" },
  { value: "ready", label: "Prontos" },
  { value: "shipped", label: "Enviados" },
  { value: "completed", label: "Concluídos" },
  { value: "cancelled", label: "Cancelados" },
];

const PAYMENT_LABELS: Record<string, string> = {
  approved: "Aprovado", pending: "Pendente", in_process: "Em análise",
  preference_created: "Checkout criado", manual: "Pagamento manual",
  rejected: "Recusado", cancelled: "Cancelado", refunded: "Reembolsado",
  charged_back: "Contestado", creation_failed: "Falha no checkout",
};

function money(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function date(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
}

function relativeDate(value: string) {
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 60_000));
  if (minutes < 1) return "agora";
  if (minutes < 60) return `há ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours} h`;
  const days = Math.floor(hours / 24);
  return `há ${days} dia${days === 1 ? "" : "s"}`;
}

function digits(value: string) { return value.replace(/\D/g, ""); }
function total(order: StoreOrder) { return Number(order.product_amount) + Number(order.shipping_cost); }
function paymentLabel(value: string) { return PAYMENT_LABELS[value] ?? value.replaceAll("_", " "); }

function paymentGroup(value: string): Exclude<PaymentFilter, "all"> {
  if (value === "approved" || value === "manual") return "approved";
  if (["rejected", "cancelled", "refunded", "charged_back", "creation_failed"].includes(value)) return "failed";
  return "pending";
}

function whatsappUrl(order: StoreOrder) {
  const text = order.order_status === "shipped"
    ? `Olá, ${order.customer_name}! Seu pedido ${order.reference} da InterShield foi enviado.${order.tracking_code ? `\nCódigo de rastreamento: ${order.tracking_code}` : ""}${order.tracking_url ? `\nAcompanhe: ${order.tracking_url}` : ""}`
    : order.order_status === "ready" && order.shipping_type === "pickup"
      ? `Olá, ${order.customer_name}! Seu pedido ${order.reference} da InterShield está pronto para retirada em Igarapé.`
      : `Olá, ${order.customer_name}! Atualização do seu pedido ${order.reference} da InterShield: ${STATUS[order.order_status].label}.`;
  return `https://wa.me/55${digits(order.customer_phone)}?text=${encodeURIComponent(text)}`;
}

function addressText(order: StoreOrder) {
  if (order.shipping_type === "pickup") return "Retirada em Igarapé";
  const value = order.address;
  return [
    [value?.street, value?.number].filter(Boolean).join(", "), value?.complement,
    value?.neighborhood, [value?.city, value?.state].filter(Boolean).join(" - "), order.postal_code,
  ].filter(Boolean).join(" · ");
}

function orderSummary(order: StoreOrder) {
  return [
    `Pedido ${order.reference}`, `Cliente: ${order.customer_name}`, `Telefone: ${order.customer_phone}`,
    `Produto: ${order.product_title}${order.variant ? ` · ${order.variant}` : ""}`,
    order.sku ? `SKU: ${order.sku}` : "", `Entrega: ${addressText(order)}`,
    `Total: ${money(total(order))}`, `Pagamento: ${paymentLabel(order.payment_status)}`,
    `Situação: ${STATUS[order.order_status].label}`, order.notes ? `Observações: ${order.notes}` : "",
  ].filter(Boolean).join("\n");
}

function csvCell(value: unknown) {
  let text = String(value ?? "").replaceAll('"', '""');
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text}"`;
}

function escapeHtml(value: unknown) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function nextAction(order: StoreOrder) {
  if (order.order_status === "new") return { label: "Iniciar preparação", status: "preparing" as const };
  if (order.order_status === "preparing") return { label: "Marcar como pronto", status: "ready" as const };
  if (order.order_status === "ready" && order.shipping_type === "pickup") return { label: "Confirmar retirada", status: "completed" as const };
  if (order.order_status === "ready") return { label: "Marcar como enviado", status: "shipped" as const };
  if (order.order_status === "shipped") return { label: "Concluir pedido", status: "completed" as const };
  return null;
}

function playAlert() {
  const AudioContextClass = window.AudioContext
    ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return;
  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.frequency.setValueAtTime(880, context.currentTime);
  gain.gain.setValueAtTime(0.08, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.45);
  oscillator.connect(gain); gain.connect(context.destination);
  oscillator.onended = () => void context.close();
  oscillator.start(); oscillator.stop(context.currentTime + 0.45);
}

export function OrdersAdminClient({ initialOrders, configured }: Props) {
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState<Filter>("all");
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");
  const [deliveryFilter, setDeliveryFilter] = useState<DeliveryFilter>("all");
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>("all");
  const [sort, setSort] = useState<Sort>("newest");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(initialOrders[0]?.id ?? "");
  const [showManual, setShowManual] = useState(false);
  const [busy, setBusy] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(new Date());
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const knownStatuses = useRef(new Map(initialOrders.map((order) => [order.id, order.order_status])));

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setAlertsEnabled(window.localStorage.getItem("intershield-order-alerts") === "on");
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const refreshOrders = useCallback(async (silent = false) => {
    if (!silent) setRefreshing(true);
    try {
      const response = await fetch("/api/admin/orders", { cache: "no-store" });
      const data = (await response.json()) as { orders?: StoreOrder[]; error?: string };
      if (!response.ok || !data.orders) throw new Error(data.error);
      const arrived = data.orders.filter((order) => (
        order.order_status === "new" && knownStatuses.current.get(order.id) !== "new"
      ));
      data.orders.forEach((order) => knownStatuses.current.set(order.id, order.order_status));
      setOrders(data.orders); setLastSync(new Date());
      if (alertsEnabled && arrived.length) {
        playAlert();
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Novo pedido na InterShield", { body: `${arrived[0].reference} · ${arrived[0].customer_name}` });
        }
      }
    } catch { if (!silent) setError("Não foi possível atualizar os pedidos."); }
    finally { if (!silent) setRefreshing(false); }
  }, [alertsEnabled]);

  useEffect(() => {
    if (!configured) return;
    const timer = window.setInterval(() => void refreshOrders(true), 30_000);
    return () => window.clearInterval(timer);
  }, [configured, refreshOrders]);

  const counts = useMemo(() => Object.fromEntries(Object.keys(STATUS).map((status) => [
    status, orders.filter((order) => order.order_status === status).length,
  ])) as Record<OrderStatus, number>, [orders]);

  const metrics = useMemo(() => {
    const approved = orders.filter((order) => order.payment_status === "approved");
    return {
      approvedRevenue: approved.reduce((sum, order) => sum + total(order), 0),
      awaitingPayment: orders.filter((order) => paymentGroup(order.payment_status) === "pending").length,
      shipping: orders.filter((order) => order.shipping_type === "shipping" && !["completed", "cancelled"].includes(order.order_status)).length,
    };
  }, [orders]);

  const visibleOrders = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pt-BR");
    const filtered = orders.filter((order) => {
      const haystack = [order.reference, order.customer_name, order.customer_email, order.customer_phone, order.product_title, order.sku, order.payment_id].join(" ").toLocaleLowerCase("pt-BR");
      return (filter === "all" || order.order_status === filter)
        && (sourceFilter === "all" || order.source === sourceFilter)
        && (deliveryFilter === "all" || order.shipping_type === deliveryFilter)
        && (paymentFilter === "all" || paymentGroup(order.payment_status) === paymentFilter)
        && (!normalized || haystack.includes(normalized));
    });
    return filtered.toSorted((left, right) => {
      if (sort === "highest") return total(right) - total(left);
      const difference = new Date(right.created_at).getTime() - new Date(left.created_at).getTime();
      return sort === "oldest" ? -difference : difference;
    });
  }, [deliveryFilter, filter, orders, paymentFilter, query, sort, sourceFilter]);

  const selected = visibleOrders.find((order) => order.id === selectedId) ?? visibleOrders[0] ?? null;
  const action = selected ? nextAction(selected) : null;

  async function updateOrder(id: string, values: Record<string, unknown>, success?: string) {
    setBusy(true); setError(""); setNotice("");
    try {
      const response = await fetch(`/api/admin/orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      const data = (await response.json()) as { order?: StoreOrder; error?: string };
      if (!response.ok || !data.order) { setError(data.error ?? "Não foi possível atualizar o pedido."); return; }
      setOrders((current) => current.map((order) => order.id === id ? data.order! : order));
      if (success) setNotice(success);
    } catch { setError("Não foi possível atualizar o pedido."); }
    finally { setBusy(false); }
  }

  async function advanceOrder() {
    if (!selected || !action) return;
    if (action.status === "shipped" && selected.shipping_type === "shipping" && !selected.tracking_code) {
      setError("Cadastre o código de rastreamento antes de marcar como enviado."); return;
    }
    await updateOrder(selected.id, { orderStatus: action.status }, "Situação atualizada.");
  }

  async function changeStatus(status: OrderStatus) {
    if (!selected || status === selected.order_status) return;
    if (status === "cancelled" && !window.confirm("Cancelar este pedido?")) return;
    await updateOrder(selected.id, { orderStatus: status }, "Situação atualizada.");
  }

  async function saveTracking(formData: FormData) {
    if (selected) await updateOrder(selected.id, { trackingCode: String(formData.get("trackingCode") ?? ""), trackingUrl: String(formData.get("trackingUrl") ?? "") }, "Rastreamento salvo.");
  }

  async function saveNotes(formData: FormData) {
    if (selected) await updateOrder(selected.id, { notes: String(formData.get("notes") ?? "") }, "Observação interna salva.");
  }

  async function createManual(formData: FormData) {
    setBusy(true); setError(""); setNotice("");
    try {
      const response = await fetch("/api/admin/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(formData.entries())) });
      const data = (await response.json()) as { order?: StoreOrder; error?: string };
      if (!response.ok || !data.order) { setError(data.error ?? "Não foi possível criar o pedido."); return; }
      knownStatuses.current.set(data.order.id, data.order.order_status);
      setOrders((current) => [data.order!, ...current]);
      setSelectedId(data.order.id); setShowManual(false); setNotice("Pedido manual criado.");
    } catch { setError("Não foi possível criar o pedido."); }
    finally { setBusy(false); }
  }

  async function toggleAlerts() {
    const enabled = !alertsEnabled; setAlertsEnabled(enabled);
    window.localStorage.setItem("intershield-order-alerts", enabled ? "on" : "off");
    if (enabled) {
      playAlert();
      if ("Notification" in window && Notification.permission === "default") await Notification.requestPermission();
      setNotice("Alertas de novos pedidos ativados neste aparelho.");
    } else setNotice("Alertas desativados neste aparelho.");
  }

  async function copyText(text: string, success: string) {
    await navigator.clipboard.writeText(text); setNotice(success);
  }

  function exportCsv() {
    const header = ["Pedido", "Data", "Cliente", "Telefone", "Produto", "SKU", "Entrega", "Pagamento", "Situação", "Total"];
    const rows = visibleOrders.map((order) => [order.reference, date(order.created_at), order.customer_name, order.customer_phone, order.product_title, order.sku, addressText(order), paymentLabel(order.payment_status), STATUS[order.order_status].label, total(order).toFixed(2)]);
    const csv = [header, ...rows].map((row) => row.map(csvCell).join(";")).join("\n");
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url;
    link.download = `pedidos-intershield-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click(); URL.revokeObjectURL(url);
  }

  function printOrder(order: StoreOrder) {
    const popup = window.open("", "_blank", "width=760,height=900");
    if (!popup) { setError("O navegador bloqueou a janela de impressão."); return; }
    popup.document.write(`<!doctype html><html lang="pt-BR"><head><title>${escapeHtml(order.reference)}</title><style>body{font-family:Arial,sans-serif;color:#0f172a;margin:36px;font-size:14px}h1{font-size:24px;margin:0}h2{font-size:14px;margin:28px 0 8px;text-transform:uppercase;color:#64748b;letter-spacing:.08em}.top{display:flex;justify-content:space-between;border-bottom:2px solid #0f172a;padding-bottom:18px}.box{border-bottom:1px solid #cbd5e1;padding:8px 0;line-height:1.55}.total{font-size:22px;font-weight:700}.muted{color:#64748b}.no-print{margin-top:30px;padding:12px 20px;background:#0f172a;color:white;border:0;border-radius:8px}@media print{.no-print{display:none}body{margin:18px}}</style></head><body><div class="top"><div><strong>INTERSHIELD</strong><h1>Pedido ${escapeHtml(order.reference)}</h1><span class="muted">${escapeHtml(date(order.created_at))}</span></div><strong>${escapeHtml(STATUS[order.order_status].label)}</strong></div><h2>Cliente</h2><div class="box"><strong>${escapeHtml(order.customer_name)}</strong><br>${escapeHtml(order.customer_phone)}${order.customer_email ? `<br>${escapeHtml(order.customer_email)}` : ""}</div><h2>Produto</h2><div class="box"><strong>${escapeHtml(order.product_title)}</strong>${order.variant ? `<br>Variação: ${escapeHtml(order.variant)}` : ""}${order.sku ? `<br>SKU: ${escapeHtml(order.sku)}` : ""}</div><h2>Entrega</h2><div class="box">${escapeHtml(addressText(order))}<br><span class="muted">${escapeHtml(order.shipping_service ?? "")} · ${escapeHtml(money(Number(order.shipping_cost)))}</span></div>${order.notes ? `<h2>Observações</h2><div class="box">${escapeHtml(order.notes)}</div>` : ""}<h2>Total</h2><div class="total">${escapeHtml(money(total(order)))}</div><p class="muted">Pagamento: ${escapeHtml(paymentLabel(order.payment_status))}</p><button class="no-print" onclick="window.print()">Imprimir pedido</button></body></html>`);
    popup.document.close();
  }

  if (!configured) return <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm leading-6 text-amber-900">O painel está pronto, mas o banco de pedidos ainda precisa ser conectado antes do primeiro teste.</div>;

  return <>
    <section aria-label="Resumo dos pedidos" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {[
        ["Novos", counts.new, PackageOpen, "text-blue-600"],
        ["Em preparação", counts.preparing, PackageCheck, "text-violet-600"],
        ["Prontos", counts.ready, Check, "text-cyan-600"],
        ["Envios ativos", metrics.shipping, Truck, "text-indigo-600"],
        ["Receita aprovada no site", money(metrics.approvedRevenue), CircleDollarSign, "text-emerald-600"],
      ].map(([label, value, Icon, tone]) => { const StatusIcon = Icon as typeof PackageOpen; return <div key={String(label)} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-center justify-between gap-2"><span className="text-sm font-semibold text-slate-500">{String(label)}</span><StatusIcon className={`h-5 w-5 ${tone}`} /></div><strong className="mt-3 block text-2xl text-slate-950">{String(value)}</strong></div>; })}
    </section>

    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-center gap-2 text-sm text-slate-500"><span className={`h-2.5 w-2.5 rounded-full ${metrics.awaitingPayment ? "bg-amber-400" : "bg-emerald-500"}`} />{metrics.awaitingPayment} pagamento{metrics.awaitingPayment === 1 ? "" : "s"} pendente{metrics.awaitingPayment === 1 ? "" : "s"}<span className="hidden text-slate-300 sm:inline">·</span><span className="hidden sm:inline">Atualização automática a cada 30 segundos</span></div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => void toggleAlerts()} className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-bold text-slate-700 hover:bg-slate-50">{alertsEnabled ? <Bell className="h-4 w-4 text-blue-600" /> : <BellOff className="h-4 w-4" />}{alertsEnabled ? "Alertas ativos" : "Ativar alertas"}</button>
        <button type="button" onClick={() => void refreshOrders()} disabled={refreshing} className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60"><RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />Atualizar</button>
        <button type="button" onClick={() => setShowManual(true)} className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-500"><Plus className="h-4 w-4" />Pedido manual</button>
      </div>
    </div>

    <section aria-label="Filtros" className="mt-5 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex gap-2 overflow-x-auto pb-2">{FILTERS.map((item) => <button key={item.value} type="button" onClick={() => setFilter(item.value)} className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-bold transition ${filter === item.value ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100"}`}>{item.label} <span className="ml-1 opacity-70">{item.value === "all" ? orders.length : counts[item.value]}</span></button>)}</div>
      <div className="grid gap-2 border-t border-slate-100 pt-3 md:grid-cols-[minmax(220px,1fr)_repeat(4,minmax(130px,180px))_auto]">
        <label className="relative min-w-0"><span className="sr-only">Buscar pedidos</span><Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pedido, cliente, telefone, SKU..." className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-3 text-sm outline-none focus:border-blue-400" /></label>
        <select aria-label="Filtrar por pagamento" value={paymentFilter} onChange={(event) => setPaymentFilter(event.target.value as PaymentFilter)} className="h-11 rounded-xl border border-slate-200 px-3 text-sm text-slate-700"><option value="all">Todo pagamento</option><option value="approved">Aprovado/manual</option><option value="pending">Pendente/análise</option><option value="failed">Falhou/cancelado</option></select>
        <select aria-label="Filtrar por entrega" value={deliveryFilter} onChange={(event) => setDeliveryFilter(event.target.value as DeliveryFilter)} className="h-11 rounded-xl border border-slate-200 px-3 text-sm text-slate-700"><option value="all">Toda entrega</option><option value="shipping">Envio</option><option value="pickup">Retirada</option></select>
        <select aria-label="Filtrar por origem" value={sourceFilter} onChange={(event) => setSourceFilter(event.target.value as SourceFilter)} className="h-11 rounded-xl border border-slate-200 px-3 text-sm text-slate-700"><option value="all">Toda origem</option><option value="site">Site</option><option value="manual">Manual</option></select>
        <select aria-label="Ordenar pedidos" value={sort} onChange={(event) => setSort(event.target.value as Sort)} className="h-11 rounded-xl border border-slate-200 px-3 text-sm text-slate-700"><option value="newest">Mais recentes</option><option value="oldest">Mais antigos</option><option value="highest">Maior valor</option></select>
        <button type="button" onClick={exportCsv} disabled={!visibleOrders.length} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"><Download className="h-4 w-4" />Exportar</button>
      </div>
      <p className="mt-2 text-xs text-slate-400">{visibleOrders.length} pedido{visibleOrders.length === 1 ? "" : "s"} exibido{visibleOrders.length === 1 ? "" : "s"}{lastSync ? ` · atualizado ${relativeDate(lastSync.toISOString())}` : ""}</p>
    </section>

    {error ? <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-700">{error}</p> : null}
    {notice ? <p role="status" className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">{notice}</p> : null}

    <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_430px]">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {visibleOrders.length ? visibleOrders.map((order) => <button key={order.id} type="button" onClick={() => setSelectedId(order.id)} className={`grid w-full gap-3 border-b border-slate-100 p-4 text-left transition last:border-b-0 hover:bg-slate-50 sm:grid-cols-[130px_minmax(0,1fr)_150px_110px_24px] sm:items-center ${selected?.id === order.id ? "bg-blue-50/60" : ""}`}><div><strong className="block text-sm text-slate-950">{order.reference}</strong><span className="text-xs text-slate-500">{relativeDate(order.created_at)}</span></div><div className="min-w-0"><strong className="block truncate text-sm text-slate-900">{order.customer_name}</strong><span className="block truncate text-xs text-slate-500">{order.product_title}{order.variant ? ` · ${order.variant}` : ""}</span><span className="mt-1 block text-xs text-slate-400">{order.shipping_type === "pickup" ? "Retirada" : order.shipping_service || "Envio"} · {paymentLabel(order.payment_status)}</span></div><span className={`w-fit rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${STATUS[order.order_status].tone}`}>{STATUS[order.order_status].label}</span><strong className="text-sm text-slate-900">{money(total(order))}</strong><ChevronRight className="hidden h-4 w-4 text-slate-400 sm:block" /></button>) : <div className="p-10 text-center text-sm text-slate-500">Nenhum pedido encontrado com esses filtros.</div>}
      </div>

      <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:sticky xl:top-5">
        {selected ? <>
          <div className="flex items-start justify-between gap-4"><div><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${STATUS[selected.order_status].tone}`}>{STATUS[selected.order_status].label}</span><h2 className="mt-3 text-xl font-bold text-slate-950">{selected.reference}</h2><p className="mt-1 text-xs text-slate-500">{selected.source === "site" ? "Venda pelo site" : "Pedido manual"} · {date(selected.created_at)}</p></div><CircleDollarSign className={`h-7 w-7 ${paymentGroup(selected.payment_status) === "approved" ? "text-emerald-600" : "text-slate-300"}`} /></div>
          <label className="mt-4 block text-xs font-bold uppercase tracking-wider text-slate-400" htmlFor="order-status">Alterar situação</label>
          <select id="order-status" value={selected.order_status} disabled={busy} onChange={(event) => void changeStatus(event.target.value as OrderStatus)} className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-700">{Object.entries(STATUS).map(([value, item]) => <option key={value} value={value}>{item.label}</option>)}</select>

          <div className="mt-5 space-y-4 border-y border-slate-100 py-5 text-sm">
            <div><span className="text-xs font-bold uppercase tracking-wider text-slate-400">Cliente</span><p className="mt-1 font-bold text-slate-900">{selected.customer_name}</p><p className="break-words text-slate-600">{selected.customer_phone}{selected.customer_email ? ` · ${selected.customer_email}` : ""}</p></div>
            <div><span className="text-xs font-bold uppercase tracking-wider text-slate-400">Produto</span><p className="mt-1 font-bold text-slate-900">{selected.product_title}</p><p className="text-slate-600">{[selected.sku, selected.variant].filter(Boolean).join(" · ") || "Sem SKU ou variação"}</p></div>
            <div><span className="text-xs font-bold uppercase tracking-wider text-slate-400">Entrega</span><p className="mt-1 flex gap-2 text-slate-700"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />{addressText(selected)}</p><p className="mt-1 text-slate-500">{selected.shipping_service || (selected.shipping_type === "pickup" ? "Retirada" : "Serviço não informado")} · {money(Number(selected.shipping_cost))}</p></div>
            <div className="flex items-end justify-between gap-4"><div><span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total</span><p className="mt-1 text-xl font-bold text-slate-950">{money(total(selected))}</p></div><div className="text-right"><span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pagamento</span><p className="mt-1 font-semibold text-slate-700">{paymentLabel(selected.payment_status)}</p>{selected.payment_id ? <button type="button" onClick={() => void copyText(selected.payment_id!, "Identificador do pagamento copiado.")} className="mt-1 text-xs text-blue-600 hover:underline">Copiar ID do pagamento</button> : null}</div></div>
          </div>

          <div className="mt-5"><h3 className="text-sm font-bold text-slate-900">Histórico resumido</h3><ol className="mt-3 space-y-3 border-l-2 border-slate-100 pl-4 text-sm"><li><strong className="block text-slate-800">Pedido recebido</strong><span className="text-xs text-slate-500">{date(selected.created_at)}</span></li>{selected.paid_at ? <li><strong className="block text-emerald-700">Pagamento aprovado</strong><span className="text-xs text-slate-500">{date(selected.paid_at)}</span></li> : null}<li><strong className="block text-slate-800">{STATUS[selected.order_status].label}</strong><span className="text-xs text-slate-500">Última atualização: {date(selected.updated_at)}</span></li></ol></div>

          {selected.shipping_type === "shipping" ? <form key={`tracking-${selected.id}-${selected.updated_at}`} action={saveTracking} className="mt-5 border-t border-slate-100 pt-5"><h3 className="text-sm font-bold text-slate-900">Rastreamento</h3><div className="mt-2 grid gap-2"><input name="trackingCode" defaultValue={selected.tracking_code ?? ""} placeholder="Código de rastreamento" className="h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-400" /><input name="trackingUrl" type="url" defaultValue={selected.tracking_url ?? ""} placeholder="Link de acompanhamento" className="h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-400" /><button disabled={busy} className="h-11 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 hover:bg-slate-50 disabled:opacity-60">Salvar rastreamento</button></div></form> : null}

          <form key={`notes-${selected.id}-${selected.updated_at}`} action={saveNotes} className="mt-5 border-t border-slate-100 pt-5"><label htmlFor="notes" className="text-sm font-bold text-slate-900">Observação interna</label><textarea id="notes" name="notes" defaultValue={selected.notes ?? ""} maxLength={1000} placeholder="Ex.: conferir acabamento, cliente pediu urgência..." className="mt-2 min-h-24 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-400" /><button disabled={busy} className="mt-2 h-10 w-full rounded-xl border border-slate-200 text-sm font-bold text-slate-800 hover:bg-slate-50 disabled:opacity-60">Salvar observação</button></form>

          <div className="mt-5 grid gap-2 border-t border-slate-100 pt-5">
            {action ? <button disabled={busy} type="button" onClick={() => void advanceOrder()} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-500 disabled:opacity-60">{action.label}<ChevronRight className="h-4 w-4" /></button> : null}
            <a href={whatsappUrl(selected)} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-bold text-white hover:bg-emerald-500"><MessageCircle className="h-4 w-4" />Avisar cliente no WhatsApp</a>
            <div className="grid grid-cols-2 gap-2"><button type="button" onClick={() => void copyText(orderSummary(selected), "Resumo do pedido copiado.")} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50"><Clipboard className="h-4 w-4" />Copiar resumo</button><button type="button" onClick={() => printOrder(selected)} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50"><Printer className="h-4 w-4" />Imprimir</button></div>
            {selected.tracking_url ? <a href={selected.tracking_url} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50"><ExternalLink className="h-4 w-4" />Abrir rastreamento</a> : null}
            <button type="button" onClick={() => void copyText(addressText(selected), "Dados de entrega copiados.")} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50"><MapPin className="h-4 w-4" />Copiar entrega</button>
          </div>
        </> : <p className="py-10 text-center text-sm text-slate-500">Selecione um pedido.</p>}
      </aside>
    </div>

    {showManual ? <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label="Novo pedido manual"><form action={createManual} className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-7"><div className="flex items-center justify-between"><div><h2 className="text-xl font-bold text-slate-950">Novo pedido manual</h2><p className="mt-1 text-sm text-slate-500">Para vendas fechadas pelo WhatsApp ou presencialmente.</p></div><button type="button" aria-label="Fechar" onClick={() => setShowManual(false)} className="rounded-xl p-2 hover:bg-slate-100"><X className="h-5 w-5" /></button></div><div className="mt-6 grid gap-3 sm:grid-cols-2">
      <input name="customerName" required placeholder="Nome do cliente" className="h-12 rounded-xl border border-slate-200 px-3 text-sm sm:col-span-2" /><input name="customerPhone" required inputMode="tel" placeholder="Telefone com DDD" className="h-12 rounded-xl border border-slate-200 px-3 text-sm" /><input name="customerEmail" type="email" placeholder="E-mail (opcional)" className="h-12 rounded-xl border border-slate-200 px-3 text-sm" /><input name="productTitle" required placeholder="Produto" className="h-12 rounded-xl border border-slate-200 px-3 text-sm sm:col-span-2" /><input name="sku" placeholder="SKU" className="h-12 rounded-xl border border-slate-200 px-3 text-sm" /><input name="variant" placeholder="Variação" className="h-12 rounded-xl border border-slate-200 px-3 text-sm" /><input name="productAmount" required type="number" inputMode="decimal" min="0" step="0.01" placeholder="Valor do produto" className="h-12 rounded-xl border border-slate-200 px-3 text-sm" /><input name="shippingCost" type="number" inputMode="decimal" min="0" step="0.01" defaultValue="0" placeholder="Valor do frete" className="h-12 rounded-xl border border-slate-200 px-3 text-sm" /><select name="shippingType" className="h-12 rounded-xl border border-slate-200 px-3 text-sm"><option value="pickup">Retirada em Igarapé</option><option value="shipping">Envio</option></select><input name="shippingService" placeholder="Transportadora/serviço" className="h-12 rounded-xl border border-slate-200 px-3 text-sm" />
      <p className="pt-2 text-xs font-bold uppercase tracking-wider text-slate-400 sm:col-span-2">Endereço, quando for envio</p><input name="postalCode" inputMode="numeric" placeholder="CEP" className="h-12 rounded-xl border border-slate-200 px-3 text-sm" /><input name="street" placeholder="Rua ou avenida" className="h-12 rounded-xl border border-slate-200 px-3 text-sm" /><input name="number" placeholder="Número" className="h-12 rounded-xl border border-slate-200 px-3 text-sm" /><input name="complement" placeholder="Complemento" className="h-12 rounded-xl border border-slate-200 px-3 text-sm" /><input name="neighborhood" placeholder="Bairro" className="h-12 rounded-xl border border-slate-200 px-3 text-sm" /><input name="city" placeholder="Cidade" className="h-12 rounded-xl border border-slate-200 px-3 text-sm" /><input name="state" maxLength={2} placeholder="UF" className="h-12 rounded-xl border border-slate-200 px-3 text-sm" /><textarea name="notes" maxLength={1000} placeholder="Observações internas" className="min-h-24 rounded-xl border border-slate-200 p-3 text-sm sm:col-span-2" /></div><button disabled={busy} className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-bold text-white disabled:opacity-60"><Send className="h-4 w-4" />Criar pedido</button></form></div> : null}
  </>;
}
