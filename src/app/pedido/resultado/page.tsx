import Link from "next/link";
import { CircleAlert, CircleCheck, Clock3 } from "lucide-react";

import { getMercadoPagoClients } from "@/lib/commerce/mercadoPago";

type ResultPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

type PaymentState = "approved" | "pending" | "failure";

async function resolvePaymentState(paymentId: string | undefined): Promise<PaymentState> {
  if (!paymentId || !process.env.MERCADO_PAGO_ACCESS_TOKEN) return "pending";

  try {
    const { payment } = getMercadoPagoClients();
    const result = await payment.get({ id: paymentId });
    if (!result.external_reference?.startsWith("IS-")) return "failure";
    if (result.status === "approved") return "approved";
    if (result.status === "rejected" || result.status === "cancelled") return "failure";
    return "pending";
  } catch {
    return "pending";
  }
}

export default async function OrderResultPage({ searchParams }: ResultPageProps) {
  const params = await searchParams;
  const rawPaymentId = params.payment_id ?? params.collection_id;
  const paymentId = Array.isArray(rawPaymentId) ? rawPaymentId[0] : rawPaymentId;
  const state = await resolvePaymentState(paymentId);

  const content = {
    approved: {
      icon: CircleCheck,
      title: "Pagamento aprovado",
      text: "Recebemos a confirmação. A InterShield iniciará a preparação do seu pedido.",
      className: "text-emerald-600 bg-emerald-50",
    },
    pending: {
      icon: Clock3,
      title: "Pagamento em processamento",
      text: "A confirmação ainda está pendente. Você receberá a atualização pelo Mercado Pago.",
      className: "text-amber-700 bg-amber-50",
    },
    failure: {
      icon: CircleAlert,
      title: "Pagamento não concluído",
      text: "A cobrança não foi aprovada. Volte ao produto para tentar novamente.",
      className: "text-rose-700 bg-rose-50",
    },
  }[state];
  const Icon = content.icon;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-sm sm:p-10">
        <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${content.className}`}>
          <Icon className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-950">{content.title}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">{content.text}</p>
        {paymentId ? <p className="mt-4 text-xs text-slate-400">Pagamento {paymentId}</p> : null}
        <Link href="/catalogo" className="mt-7 inline-flex h-12 items-center justify-center rounded-xl bg-blue-600 px-6 text-sm font-bold text-white transition hover:bg-blue-500">
          Voltar ao catálogo
        </Link>
      </section>
    </main>
  );
}
