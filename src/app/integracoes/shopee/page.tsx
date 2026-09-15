import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Box,
  CheckCircle2,
  ClipboardList,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Integração Shopee",
  description:
    "Interface de integração da InterShield com a Shopee Open Platform.",
  robots: { index: false, follow: false },
};

const modules = [
  {
    icon: Box,
    title: "Produtos e estoque",
    description:
      "Consulta de catálogo, variações, disponibilidade e informações dos anúncios.",
  },
  {
    icon: ClipboardList,
    title: "Pedidos",
    description:
      "Leitura de pedidos e status para acompanhamento operacional centralizado.",
  },
  {
    icon: RefreshCw,
    title: "Sincronização segura",
    description:
      "Atualização controlada com rastreabilidade e aprovação humana para ações sensíveis.",
  },
];

export default function ShopeeIntegrationReviewPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:px-10 lg:py-16">
        <header className="flex flex-col gap-6 border-b border-white/10 pb-9 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl border border-white/10 bg-white p-2.5 shadow-xl shadow-black/20">
              <Image
                src="/intershield-shield-v2.png"
                alt="InterShield"
                width={56}
                height={56}
                priority
                className="h-14 w-14 object-contain"
              />
            </div>
            <div>
              <p className="text-sm font-medium tracking-[0.2em] text-blue-300 uppercase">
                InterShield
              </p>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Gestão Shopee
              </h1>
            </div>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-300">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            Sandbox conectado
          </div>
        </header>

        <section className="grid gap-10 py-12 lg:grid-cols-[1.25fr_0.75fr] lg:items-center lg:py-16">
          <div>
            <p className="mb-4 text-sm font-semibold tracking-[0.18em] text-blue-300 uppercase">
              Integração própria · Shopee Open Platform
            </p>
            <h2 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Operação centralizada com controle e segurança.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Aplicativo interno da InterShield para consultar produtos, estoque e
              pedidos da sua própria loja Shopee. A primeira fase opera somente em
              leitura e não altera anúncios automaticamente.
            </p>
          </div>

          <aside className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-blue-950/30 backdrop-blur">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-7 w-7 text-blue-300" aria-hidden="true" />
              <h3 className="text-lg font-semibold">Ambiente protegido</h3>
            </div>
            <ul className="mt-5 space-y-4 text-sm leading-6 text-slate-300">
              <li className="flex gap-3">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-300" />
                Credenciais mantidas exclusivamente no servidor.
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-300" />
                Tokens armazenados com criptografia.
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-300" />
                Operações sensíveis dependem de aprovação humana.
              </li>
            </ul>
          </aside>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          {modules.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-300">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 flex flex-col gap-5 rounded-3xl border border-blue-400/20 bg-blue-500/10 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-start gap-4">
            <LockKeyhole className="mt-1 h-6 w-6 shrink-0 text-blue-300" aria-hidden="true" />
            <div>
              <h3 className="font-semibold">Uso interno da InterShield</h3>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-300">
                Desenvolvido para a gestão exclusiva da própria operação comercial da
                InterShield no Brasil.
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
          >
            Conhecer a InterShield
          </Link>
        </section>
      </div>
    </main>
  );
}
