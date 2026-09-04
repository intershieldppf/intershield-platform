import type { ReactNode } from "react";

import { Header } from "@/components/layout/Header";

export function LegalPage({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Header />
      <main className="px-4 py-12 sm:px-8 lg:py-16">
        <article className="mx-auto max-w-3xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-blue-600">InterShield Películas</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-5 text-base leading-8 text-slate-600">{intro}</p>
          <div className="mt-10 space-y-8 text-sm leading-7 text-slate-600 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-950 [&_p]:mt-3">
            {children}
          </div>
          <p className="mt-10 border-t border-slate-200 pt-6 text-xs text-slate-500">Última atualização: 4 de setembro de 2026.</p>
        </article>
      </main>
    </div>
  );
}
