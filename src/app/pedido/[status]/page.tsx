import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CircleAlert, Clock3, PackageCheck } from "lucide-react";

import { Header } from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Situação do pedido",
  robots: { index: false, follow: false },
};

type OrderReturnPageProps = {
  params: Promise<{ status: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const states = {
  sucesso: {
    icon: PackageCheck,
    iconClass: "bg-emerald-50 text-emerald-600",
    label: "Pagamento recebido",
    title: "Obrigado pela sua compra",
    description: "O Mercado Pago recebeu a operação. A confirmação definitiva será feita automaticamente e o pedido entrará em produção após a aprovação.",
  },
  pendente: {
    icon: Clock3,
    iconClass: "bg-amber-50 text-amber-600",
    label: "Pagamento pendente",
    title: "Estamos aguardando a confirmação",
    description: "Alguns pagamentos levam alguns minutos para serem confirmados. Você não precisa refazer a compra enquanto a análise estiver em andamento.",
  },
  falha: {
    icon: CircleAlert,
    iconClass: "bg-rose-50 text-rose-600",
    label: "Pagamento não concluído",
    title: "Não foi possível concluir o pagamento",
    description: "Nenhum pedido será produzido sem pagamento aprovado. Volte ao produto para tentar novamente ou fale conosco pelo WhatsApp.",
  },
} as const;

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function OrderReturnPage({ params, searchParams }: OrderReturnPageProps) {
  const { status } = await params;
  const query = await searchParams;
  const state = states[status as keyof typeof states];
  if (!state) notFound();

  const publicId = firstValue(query.pedido);
  const Icon = state.icon;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Header />
      <main className="px-4 py-14 sm:px-8 lg:py-20">
        <div className="mx-auto max-w-2xl rounded-[32px] border border-slate-200 bg-white p-7 text-center shadow-sm sm:p-10">
          <span className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${state.iconClass}`}><Icon className="h-7 w-7" /></span>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">{state.label}</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">{state.title}</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600">{state.description}</p>
          {publicId ? <p className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800">Pedido {publicId}</p> : null}
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/minha-conta" className="inline-flex h-12 items-center justify-center rounded-xl bg-blue-600 px-6 text-sm font-bold text-white transition hover:bg-blue-500">Acompanhar pedido</Link>
            <Link href="/catalogo" className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-bold text-slate-900 transition hover:border-blue-300">Voltar ao catálogo</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
