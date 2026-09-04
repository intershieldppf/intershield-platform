"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CheckCircle2,
  LoaderCircle,
  LogOut,
  Mail,
  PackageSearch,
} from "lucide-react";

import {
  getSupabaseBrowser,
  isCustomerAccountConfigured,
} from "@/lib/commerce/supabaseBrowser";

type OrderItem = {
  title: string;
  sku: string;
  variant_value: string | null;
  quantity: number;
};

type CustomerOrder = {
  public_id: string;
  status: string;
  payment_status: string;
  total: number;
  shipping_service_name: string;
  shipping_delivery_time: number;
  tracking_code: string | null;
  created_at: string;
  order_items: OrderItem[];
};

const statusLabels: Record<string, string> = {
  awaiting_payment: "Aguardando pagamento",
  paid: "Pagamento aprovado",
  authorized: "Pagamento autorizado",
  payment_review: "Pagamento em análise",
  payment_rejected: "Pagamento recusado",
  cancelled: "Cancelado",
  refunded: "Reembolsado",
  charged_back: "Pagamento contestado",
  processing: "Em produção",
  shipped: "Enviado",
  delivered: "Entregue",
};

const priceFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function CustomerOrders() {
  const configured = isCustomerAccountConfigured();
  const [email, setEmail] = useState("");
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [orders, setOrders] = useState<CustomerOrder[] | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(configured);

  useEffect(() => {
    if (!configured) return;

    const supabase = getSupabaseBrowser();
    let active = true;

    async function loadSession() {
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      setSessionEmail(data.session?.user.email ?? null);
      setLoading(false);
    }

    void loadSession();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setSessionEmail(session?.user.email ?? null);
      setOrders(null);
      setLoading(false);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [configured]);

  useEffect(() => {
    if (!configured || !sessionEmail) return;

    const supabase = getSupabaseBrowser();
    let active = true;

    void supabase
      .from("orders")
      .select(
        "public_id,status,payment_status,total,shipping_service_name,shipping_delivery_time,tracking_code,created_at,order_items(title,sku,variant_value,quantity)",
      )
      .order("created_at", { ascending: false })
      .then(({ data, error: queryError }) => {
        if (!active) return;
        if (queryError) {
          setError("Não foi possível carregar seus pedidos agora.");
          setOrders([]);
        } else {
          setOrders((data ?? []) as CustomerOrder[]);
        }
      });

    return () => {
      active = false;
    };
  }, [configured, sessionEmail]);

  async function sendMagicLink(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/conta/acesso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) throw new Error(data.error);
      setMessage(data.message ?? "Se houver uma compra vinculada, enviaremos o acesso por e-mail.");
    } catch {
      setError("Não foi possível enviar o acesso. Confira o e-mail e tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    setLoading(true);
    await getSupabaseBrowser().auth.signOut();
    setLoading(false);
  }

  if (!configured) {
    return (
      <div className="rounded-[28px] border border-amber-200 bg-amber-50 p-7 text-amber-950">
        <h2 className="text-xl font-bold">Área de pedidos em configuração</h2>
        <p className="mt-3 text-sm leading-6">A compra como convidado continuará disponível. O acesso opcional por e-mail será liberado após a configuração do envio seguro de mensagens.</p>
      </div>
    );
  }

  if (loading && !sessionEmail) {
    return <div className="flex min-h-48 items-center justify-center"><LoaderCircle className="h-7 w-7 animate-spin text-blue-600" aria-label="Carregando" /></div>;
  }

  if (!sessionEmail) {
    return (
      <div className="mx-auto max-w-lg rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><Mail className="h-5 w-5" /></span>
        <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-950">Acesse sem senha</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">Use o mesmo e-mail informado na compra. Enviaremos um link temporário para acessar somente os seus pedidos.</p>
        <form onSubmit={sendMagicLink} className="mt-6">
          <label className="grid gap-2 text-sm font-semibold text-slate-800">
            E-mail da compra
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required className="h-12 rounded-xl border border-slate-200 px-4 text-base outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
          </label>
          {message ? <p className="mt-4 flex gap-2 rounded-xl bg-emerald-50 p-3 text-sm leading-5 text-emerald-800"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />{message}</p> : null}
          {error ? <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-700">{error}</p> : null}
          <button type="submit" disabled={loading} className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-500 disabled:opacity-60">
            {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
            Enviar acesso seguro
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Conta conectada</p><p className="mt-1 text-sm font-semibold text-slate-900">{sessionEmail}</p></div>
        <button type="button" onClick={signOut} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"><LogOut className="h-4 w-4" />Sair</button>
      </div>

      {error ? <p role="alert" className="mt-5 rounded-xl bg-rose-50 p-4 text-sm font-semibold text-rose-700">{error}</p> : null}

      {orders === null ? (
        <div className="flex min-h-48 items-center justify-center"><LoaderCircle className="h-7 w-7 animate-spin text-blue-600" aria-label="Carregando pedidos" /></div>
      ) : orders.length === 0 ? (
        <div className="mt-6 rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm">
          <PackageSearch className="mx-auto h-9 w-9 text-blue-600" />
          <h2 className="mt-4 text-xl font-bold text-slate-950">Nenhum pedido encontrado</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">Quando uma compra for feita com este e-mail, ela aparecerá aqui automaticamente.</p>
          <Link href="/catalogo" className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-bold text-white">Ver catálogo</Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-4">
          {orders.map((order) => (
            <article key={order.public_id} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-start sm:justify-between">
                <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600">{order.public_id}</p><p className="mt-1 text-sm text-slate-500">{new Date(order.created_at).toLocaleDateString("pt-BR")}</p></div>
                <span className="w-fit rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">{statusLabels[order.status] ?? "Em atualização"}</span>
              </div>
              <div className="mt-4 space-y-3">
                {order.order_items.map((item) => (
                  <div key={`${item.sku}-${item.variant_value ?? "padrao"}`}>
                    <p className="text-sm font-bold text-slate-950">{item.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.variant_value ? `${item.variant_value} · ` : ""}SKU {item.sku}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex flex-col gap-2 border-t border-slate-200 pt-4 text-sm sm:flex-row sm:items-center sm:justify-between">
                <p className="text-slate-600">{order.shipping_service_name} · prazo informado de até {order.shipping_delivery_time} dias úteis após postagem</p>
                <p className="font-black text-slate-950">{priceFormatter.format(Number(order.total))}</p>
              </div>
              {order.tracking_code ? <p className="mt-3 text-sm font-semibold text-blue-700">Rastreio: {order.tracking_code}</p> : null}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
