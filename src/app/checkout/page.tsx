import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { GuestCheckoutForm } from "@/components/checkout/GuestCheckoutForm";
import { Header } from "@/components/layout/Header";
import {
  findStorefrontProductBySlug,
  storefrontProductSlug,
} from "@/data/storefront/catalog";
import { isOrderStoreConfigured } from "@/lib/commerce/supabaseAdmin";

export const metadata: Metadata = {
  title: "Finalizar compra",
  robots: { index: false, follow: false },
};

type CheckoutPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const query = await searchParams;
  const productId = firstValue(query.produto);
  const variantValue = firstValue(query.variacao);
  const product = productId ? findStorefrontProductBySlug(productId) : undefined;

  if (!product || product.price === null || product.price <= 0) notFound();

  const selectedVariant = variantValue
    ? product.variantValues.find((variant) => variant === variantValue)
    : product.variantValues[0];

  if (product.variantValues.length > 0 && !selectedVariant) notFound();

  const paymentsReady =
    process.env.CHECKOUT_ENABLED === "true" &&
    Boolean(process.env.MELHOR_ENVIO_TOKEN) &&
    process.env.PAYMENTS_ENABLED === "true" &&
    Boolean(process.env.MERCADO_PAGO_ACCESS_TOKEN) &&
    Boolean(process.env.MERCADO_PAGO_WEBHOOK_SECRET) &&
    isOrderStoreConfigured();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Header />
      <main className="px-4 py-8 sm:px-8 lg:py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">Compra como convidado</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Finalizar compra</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Você não precisa criar uma conta. Após a compra, poderá ativar o acompanhamento por e-mail, sem senha.</p>
            </div>
            <Link href={`/produto/${storefrontProductSlug(product)}`} className="text-sm font-semibold text-blue-600 hover:underline">Voltar ao produto</Link>
          </div>

          <GuestCheckoutForm
            paymentsReady={paymentsReady}
            product={{
              id: product.id,
              title: product.title,
              image: product.image,
              sku: product.sku ?? product.id,
              variantValue: selectedVariant ?? null,
              price: product.price,
            }}
          />
        </div>
      </main>
    </div>
  );
}
