import type { Metadata } from "next";

import { CustomerOrders } from "@/components/account/CustomerOrders";
import { Header } from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Meus pedidos",
  description: "Acompanhe seus pedidos da InterShield Películas com acesso seguro por e-mail.",
  robots: { index: false, follow: false },
};

export default function CustomerAccountPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Header />
      <main className="px-4 py-10 sm:px-8 lg:py-14">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">Conta opcional</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Meus pedidos</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Acompanhe pagamentos, produção e envio. Você entra por um link temporário enviado ao e-mail, sem precisar guardar senha.</p>
          </div>
          <CustomerOrders />
        </div>
      </main>
    </div>
  );
}
