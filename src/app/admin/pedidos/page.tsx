import Link from "next/link";

import { OrdersAdminClient } from "@/components/admin/OrdersAdminClient";
import { listOrders, orderStoreIsConfigured } from "@/lib/orders/orderStore";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const configured = orderStoreIsConfigured();
  const orders = configured ? await listOrders().catch(() => []) : [];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:px-7 lg:px-10">
      <div className="mx-auto max-w-[1500px]">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">InterShield · Administração</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Pedidos</h1><p className="mt-1 text-sm text-slate-500">Pagamento, preparação e envio em uma única tela.</p></div>
          <nav className="flex gap-2 text-sm font-bold"><Link href="/admin/importar" className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-700 hover:border-blue-300">Catálogo</Link><Link href="/admin/veiculos/imagens" className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-700 hover:border-blue-300">Imagens</Link></nav>
        </header>
        <OrdersAdminClient initialOrders={orders} configured={configured} />
      </div>
    </main>
  );
}
