import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ShopeeAdsClient } from "@/components/admin/ShopeeAdsClient";

export default function AdminAdsPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:px-7 lg:px-10">
      <div className="mx-auto max-w-[1500px]">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">InterShield · Administração</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Ads Shopee</h1><p className="mt-1 text-sm text-slate-500">Diagnóstico de campanhas, rentabilidade e próximas ações.</p></div>
          <nav className="flex flex-wrap gap-2 text-sm font-bold"><Link href="/admin/pedidos" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-700 hover:border-blue-300"><ArrowLeft className="h-4 w-4" /> Pedidos</Link><Link href="/admin/importar" className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-700 hover:border-blue-300">Catálogo</Link></nav>
        </header>
        <ShopeeAdsClient />
      </div>
    </main>
  );
}
