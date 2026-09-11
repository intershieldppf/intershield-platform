"use client";

import { useMemo, useState } from "react";
import {
  Check,
  ChevronRight,
  CircleDollarSign,
  Clipboard,
  ExternalLink,
  MapPin,
  MessageCircle,
  PackageCheck,
  PackageOpen,
  Plus,
  Search,
  Send,
  Truck,
  X,
} from "lucide-react";

import type { OrderStatus, StoreOrder } from "@/lib/orders/orderStore";

type Props = { initialOrders: StoreOrder[]; configured: boolean };

const STATUS: Record<OrderStatus, { label: string; tone: string }> = {
  awaiting_payment: { label: "Aguardando pagamento", tone: "bg-amber-50 text-amber-800" },
  new: { label: "Novo", tone: "bg-blue-50 text-blue-700" },
  preparing: { label: "Em preparação", tone: "bg-violet-50 text-violet-700" },
  ready: { label: "Pronto", tone: "bg-cyan-50 text-cyan-700" },
  shipped: { label: "Enviado", tone: "bg-indigo-50 text-indigo-700" },
  completed: { label: "Concluído", tone: "bg-emerald-50 text-emerald-700" },
  cancelled: { label: "Cancelado", tone: "bg-rose-50 text-rose-700" },
};

const FILTERS: Array<{ value: "all" | OrderStatus; label: string }> = [
  { value: "all", label: "Todos" },
  { value: "new", label: "Novos" },
  { value: "preparing", label: "Preparação" },
  { value: "ready", label: "Prontos" },
  { value: "shipped", label: "Enviados" },
  { value: "completed", label: "Concluídos" },
];

const NEXT_ACTION: Partial<Record<OrderStatus, { label: string; status: OrderStatus }>> = {
  new: { label: "Iniciar preparação", status: "preparing" },
  preparing: { label: "Marcar como pronto", status: "ready" },
  ready: { label: "Marcar como enviado", status: "shipped" },
  shipped: { label: "Concluir pedido", status: "completed" },
};

function money(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function date(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
}

function digits(value: string) { return value.replace(/\D/g, ""); }

function whatsappUrl(order: StoreOrder) {
  const text = order.order_status === "shipped"
    ? `Olá, ${order.customer_name}! Seu pedido ${order.reference} da InterShield foi enviado.${order.tracking_code ? `\nCódigo de rastreamento: ${order.tracking_code}` : ""}${order.tracking_url ? `\nAcompanhe: ${order.tracking_url}` : ""}`
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

export function OrdersAdminClient({ initialOrders, configured }: Props) {
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(initialOrders[0]?.id ?? "");
  const [showManual, setShowManual] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const visibleOrders = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pt-BR");
    return orders.filter((order) => {
      const matchesFilter = filter === "all" || order.order_status === filter;
      const haystack = [order.reference, order.customer_name, order.customer_phone, order.product_title, order.sku].join(" ").toLocaleLowerCase("pt-BR");
      return matchesFilter && (!normalized || haystack.includes(normalized));
    });
  }, [filter, orders, query]);

  const selected = orders.find((order) => order.id === selectedId) ?? visibleOrders[0] ?? null;
  const counts = useMemo(() => ({
    new: orders.filter((order) => order.order_status === "new").length,
    preparing: orders.filter((order) => order.order_status === "preparing").length,
    ready: orders.filter((order) => order.order_status === "ready").length,
    shipped: orders.filter((order) => order.order_status === "shipped").length,
  }), [orders]);

  async function updateOrder(id: string, values: Record<string, unknown>) {
    setBusy(true); setError("");
    try {
      const response = await fetch(`/api/admin/orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      const data = (await response.json()) as { order?: StoreOrder; error?: string };
      if (!response.ok || !data.order) { setError(data.error ?? "Não foi possível atualizar o pedido."); return; }
      setOrders((current) => current.map((order) => order.id === id ? data.order! : order));
    } catch { setError("Não foi possível atualizar o pedido."); }
    finally { setBusy(false); }
  }

  async function saveTracking(formData: FormData) {
    if (!selected) return;
    await updateOrder(selected.id, {
      trackingCode: String(formData.get("trackingCode") ?? ""),
      trackingUrl: String(formData.get("trackingUrl") ?? ""),
    });
  }

  async function createManual(formData: FormData) {
    setBusy(true); setError("");
    const body = Object.fromEntries(formData.entries());
    try {
      const response = await fetch("/api/admin/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = (await response.json()) as { order?: StoreOrder; error?: string };
      if (!response.ok || !data.order) { setError(data.error ?? "Não foi possível criar o pedido."); return; }
      setOrders((current) => [data.order!, ...current]); setSelectedId(data.order.id); setShowManual(false);
    } catch { setError("Não foi possível criar o pedido."); }
    finally { setBusy(false); }
  }

  if (!configured) {
    return <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm leading-6 text-amber-900">O painel está pronto, mas o banco de pedidos ainda precisa ser conectado antes do primeiro teste.</div>;
  }

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Novos", counts.new, PackageOpen, "text-blue-600"],
          ["Em preparação", counts.preparing, PackageCheck, "text-violet-600"],
          ["Prontos", counts.ready, Check, "text-cyan-600"],
          ["Enviados", counts.shipped, Truck, "text-indigo-600"],
        ].map(([label, count, Icon, tone]) => {
          const StatusIcon = Icon as typeof PackageOpen;
          return <div key={String(label)} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-center justify-between"><span className="text-sm font-semibold text-slate-500">{String(label)}</span><StatusIcon className={`h-5 w-5 ${tone}`} /></div><strong className="mt-3 block text-3xl text-slate-950">{String(count)}</strong></div>;
        })}
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
          {FILTERS.map((item) => <button key={item.value} type="button" onClick={() => setFilter(item.value)} className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-bold transition ${filter === item.value ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100"}`}>{item.label}</button>)}
        </div>
        <div className="flex gap-2">
          <label className="relative min-w-0 flex-1 lg:w-72"><Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pedido, cliente, SKU..." className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-3 text-sm outline-none focus:border-blue-400" /></label>
          <button type="button" onClick={() => setShowManual(true)} className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-500"><Plus className="h-4 w-4" />Pedido manual</button>
        </div>
      </div>

      {error ? <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-700">{error}</p> : null}

      <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {visibleOrders.length ? visibleOrders.map((order) => (
            <button key={order.id} type="button" onClick={() => setSelectedId(order.id)} className={`grid w-full gap-3 border-b border-slate-100 p-4 text-left transition last:border-b-0 hover:bg-slate-50 sm:grid-cols-[120px_minmax(0,1fr)_140px_110px_24px] sm:items-center ${selected?.id === order.id ? "bg-blue-50/60" : ""}`}>
              <div><strong className="block text-sm text-slate-950">{order.reference}</strong><span className="text-xs text-slate-500">{date(order.created_at)}</span></div>
              <div className="min-w-0"><strong className="block truncate text-sm text-slate-900">{order.customer_name}</strong><span className="block truncate text-xs text-slate-500">{order.product_title}{order.variant ? ` · ${order.variant}` : ""}</span></div>
              <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-bold ${STATUS[order.order_status].tone}`}>{STATUS[order.order_status].label}</span>
              <strong className="text-sm text-slate-900">{money(Number(order.product_amount) + Number(order.shipping_cost))}</strong>
              <ChevronRight className="hidden h-4 w-4 text-slate-400 sm:block" />
            </button>
          )) : <div className="p-10 text-center text-sm text-slate-500">Nenhum pedido encontrado.</div>}
        </div>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:sticky xl:top-5">
          {selected ? <>
            <div className="flex items-start justify-between gap-4"><div><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${STATUS[selected.order_status].tone}`}>{STATUS[selected.order_status].label}</span><h2 className="mt-3 text-xl font-bold text-slate-950">{selected.reference}</h2><p className="mt-1 text-xs text-slate-500">{selected.source === "site" ? "Venda pelo site" : "Pedido manual"} · {date(selected.created_at)}</p></div><CircleDollarSign className={`h-7 w-7 ${selected.payment_status === "approved" ? "text-emerald-600" : "text-slate-300"}`} /></div>
            <div className="mt-5 space-y-4 border-y border-slate-100 py-5 text-sm">
              <div><span className="text-xs font-bold uppercase tracking-wider text-slate-400">Cliente</span><p className="mt-1 font-bold text-slate-900">{selected.customer_name}</p><p className="text-slate-600">{selected.customer_phone}{selected.customer_email ? ` · ${selected.customer_email}` : ""}</p></div>
              <div><span className="text-xs font-bold uppercase tracking-wider text-slate-400">Produto</span><p className="mt-1 font-bold text-slate-900">{selected.product_title}</p><p className="text-slate-600">{[selected.sku, selected.variant].filter(Boolean).join(" · ")}</p></div>
              <div><span className="text-xs font-bold uppercase tracking-wider text-slate-400">Entrega</span><p className="mt-1 flex gap-2 text-slate-700"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />{addressText(selected)}</p><p className="mt-1 text-slate-500">{selected.shipping_service} · {money(Number(selected.shipping_cost))}</p></div>
              <div><span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total</span><p className="mt-1 text-xl font-bold text-slate-950">{money(Number(selected.product_amount) + Number(selected.shipping_cost))}</p><p className="text-xs text-slate-500">Pagamento: {selected.payment_status}</p></div>
            </div>

            {selected.shipping_type === "shipping" ? <form action={saveTracking} className="mt-5"><h3 className="text-sm font-bold text-slate-900">Rastreamento</h3><div className="mt-2 grid gap-2"><input name="trackingCode" defaultValue={selected.tracking_code ?? ""} placeholder="Código de rastreamento" className="h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-400" /><input name="trackingUrl" type="url" defaultValue={selected.tracking_url ?? ""} placeholder="Link de acompanhamento" className="h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-400" /><button disabled={busy} className="h-11 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 hover:bg-slate-50">Salvar rastreamento</button></div></form> : null}

            <div className="mt-5 grid gap-2">
              {NEXT_ACTION[selected.order_status] ? <button disabled={busy} type="button" onClick={() => updateOrder(selected.id, { orderStatus: NEXT_ACTION[selected.order_status]!.status })} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-500 disabled:opacity-60">{NEXT_ACTION[selected.order_status]!.label}<ChevronRight className="h-4 w-4" /></button> : null}
              <a href={whatsappUrl(selected)} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-bold text-white hover:bg-emerald-500"><MessageCircle className="h-4 w-4" />Avisar cliente no WhatsApp</a>
              {selected.tracking_url ? <a href={selected.tracking_url} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-700"><ExternalLink className="h-4 w-4" />Abrir rastreamento</a> : null}
              <button type="button" onClick={() => navigator.clipboard.writeText(addressText(selected))} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-700"><Clipboard className="h-4 w-4" />Copiar entrega</button>
            </div>
          </> : <p className="py-10 text-center text-sm text-slate-500">Selecione um pedido.</p>}
        </aside>
      </div>

      {showManual ? <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label="Novo pedido manual"><form action={createManual} className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-7"><div className="flex items-center justify-between"><div><h2 className="text-xl font-bold text-slate-950">Novo pedido manual</h2><p className="mt-1 text-sm text-slate-500">Para vendas fechadas pelo WhatsApp.</p></div><button type="button" onClick={() => setShowManual(false)} className="rounded-xl p-2 hover:bg-slate-100"><X className="h-5 w-5" /></button></div><div className="mt-6 grid gap-3 sm:grid-cols-2">
        <input name="customerName" required placeholder="Nome do cliente" className="h-12 rounded-xl border border-slate-200 px-3 text-sm sm:col-span-2" /><input name="customerPhone" required placeholder="Telefone com DDD" className="h-12 rounded-xl border border-slate-200 px-3 text-sm" /><input name="customerEmail" type="email" placeholder="E-mail (opcional)" className="h-12 rounded-xl border border-slate-200 px-3 text-sm" /><input name="productTitle" required placeholder="Produto" className="h-12 rounded-xl border border-slate-200 px-3 text-sm sm:col-span-2" /><input name="sku" placeholder="SKU" className="h-12 rounded-xl border border-slate-200 px-3 text-sm" /><input name="variant" placeholder="Variação" className="h-12 rounded-xl border border-slate-200 px-3 text-sm" /><input name="productAmount" required type="number" min="0" step="0.01" placeholder="Valor do produto" className="h-12 rounded-xl border border-slate-200 px-3 text-sm" /><input name="shippingCost" type="number" min="0" step="0.01" defaultValue="0" placeholder="Valor do frete" className="h-12 rounded-xl border border-slate-200 px-3 text-sm" /><select name="shippingType" className="h-12 rounded-xl border border-slate-200 px-3 text-sm"><option value="pickup">Retirada em Igarapé</option><option value="shipping">Envio</option></select><input name="shippingService" placeholder="Transportadora/serviço" className="h-12 rounded-xl border border-slate-200 px-3 text-sm" />
        <p className="pt-2 text-xs font-bold uppercase tracking-wider text-slate-400 sm:col-span-2">Endereço, quando for envio</p><input name="postalCode" placeholder="CEP" className="h-12 rounded-xl border border-slate-200 px-3 text-sm" /><input name="street" placeholder="Rua ou avenida" className="h-12 rounded-xl border border-slate-200 px-3 text-sm" /><input name="number" placeholder="Número" className="h-12 rounded-xl border border-slate-200 px-3 text-sm" /><input name="complement" placeholder="Complemento" className="h-12 rounded-xl border border-slate-200 px-3 text-sm" /><input name="neighborhood" placeholder="Bairro" className="h-12 rounded-xl border border-slate-200 px-3 text-sm" /><input name="city" placeholder="Cidade" className="h-12 rounded-xl border border-slate-200 px-3 text-sm" /><input name="state" maxLength={2} placeholder="UF" className="h-12 rounded-xl border border-slate-200 px-3 text-sm" /><textarea name="notes" placeholder="Observações" className="min-h-24 rounded-xl border border-slate-200 p-3 text-sm sm:col-span-2" /></div><button disabled={busy} className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-bold text-white"><Send className="h-4 w-4" />Criar pedido</button></form></div> : null}
    </>
  );
}
