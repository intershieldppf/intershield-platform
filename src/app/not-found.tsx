import Link from "next/link";

import { Header } from "@/components/layout/Header";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-blue-600">Erro 404</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950">Página não encontrada</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">O endereço pode ter mudado ou o produto não está mais disponível.</p>
        <Link href="/catalogo" className="mt-8 inline-flex h-12 items-center rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white hover:bg-blue-500">Explorar catálogo</Link>
      </main>
    </div>
  );
}
