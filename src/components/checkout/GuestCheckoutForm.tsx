"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronRight,
  CreditCard,
  LoaderCircle,
  LockKeyhole,
  MapPin,
  PackageCheck,
  Truck,
  UserRound,
} from "lucide-react";

import {
  formatPostalCode,
  normalizePostalCode,
  type ShippingQuote,
} from "@/lib/commerce/shipping";

type GuestCheckoutFormProps = {
  product: {
    id: string;
    title: string;
    image: string;
    sku: string;
    variantValue: string | null;
    price: number;
  };
  paymentsReady: boolean;
};

type CheckoutForm = {
  fullName: string;
  email: string;
  phone: string;
  cpf: string;
  postalCode: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  compatibilityConfirmed: boolean;
  termsAccepted: boolean;
  marketingOptIn: boolean;
};

type ApiResponse = {
  quotes?: ShippingQuote[];
  checkoutUrl?: string;
  orderId?: string;
  error?: string;
};

const states = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT",
  "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO",
  "RR", "SC", "SP", "SE", "TO",
];

const initialForm: CheckoutForm = {
  fullName: "",
  email: "",
  phone: "",
  cpf: "",
  postalCode: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
  compatibilityConfirmed: false,
  termsAccepted: false,
  marketingOptIn: false,
};

const priceFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function formatCpf(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function Field({
  label,
  name,
  value,
  onChange,
  ...props
}: {
  label: string;
  name: keyof CheckoutForm;
  value: string;
  onChange: (name: keyof CheckoutForm, value: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "name" | "value" | "onChange">) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-800">
      {label}
      <input
        {...props}
        name={name}
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
        className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-base font-medium text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}

export function GuestCheckoutForm({
  product,
  paymentsReady,
}: GuestCheckoutFormProps) {
  const [form, setForm] = useState(initialForm);
  const [quotes, setQuotes] = useState<ShippingQuote[]>([]);
  const [selectedQuoteId, setSelectedQuoteId] = useState<number | null>(null);
  const [shippingError, setShippingError] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  const [isQuoting, setIsQuoting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedQuote = quotes.find((quote) => quote.id === selectedQuoteId);
  const total = useMemo(
    () => product.price + (selectedQuote?.price ?? 0),
    [product.price, selectedQuote?.price],
  );

  function updateField(name: keyof CheckoutForm, value: string | boolean) {
    setForm((current) => ({ ...current, [name]: value }));

    if (name === "postalCode") {
      setQuotes([]);
      setSelectedQuoteId(null);
      setShippingError("");
    }
  }

  async function calculateShipping() {
    const postalCode = normalizePostalCode(form.postalCode);

    if (postalCode.length !== 8) {
      setShippingError("Informe um CEP válido com 8 números.");
      return;
    }

    setIsQuoting(true);
    setShippingError("");
    setQuotes([]);
    setSelectedQuoteId(null);

    try {
      const response = await fetch("/api/frete/cotacao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          postalCode,
          variantValue: product.variantValue ?? undefined,
        }),
      });
      const data = (await response.json()) as ApiResponse;

      if (!response.ok || !data.quotes) {
        setShippingError(data.error ?? "Não foi possível calcular o frete.");
        return;
      }

      setQuotes(data.quotes);
      setSelectedQuoteId(data.quotes[0]?.id ?? null);
    } catch {
      setShippingError("Não foi possível calcular o frete agora. Tente novamente.");
    } finally {
      setIsQuoting(false);
    }
  }

  async function submitCheckout(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCheckoutError("");

    if (!selectedQuote) {
      setCheckoutError("Calcule o frete e escolha uma modalidade antes de pagar.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/checkout/preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          variantValue: product.variantValue ?? undefined,
          shippingQuoteId: selectedQuote.id,
          customer: {
            fullName: form.fullName,
            email: form.email,
            phone: form.phone,
            cpf: form.cpf,
            marketingOptIn: form.marketingOptIn,
          },
          address: {
            postalCode: form.postalCode,
            street: form.street,
            number: form.number,
            complement: form.complement,
            neighborhood: form.neighborhood,
            city: form.city,
            state: form.state,
          },
          compatibilityConfirmed: form.compatibilityConfirmed,
          termsAccepted: form.termsAccepted,
        }),
      });
      const data = (await response.json()) as ApiResponse;

      if (!response.ok || !data.checkoutUrl) {
        setCheckoutError(data.error ?? "Não foi possível iniciar o pagamento.");
        return;
      }

      window.location.assign(data.checkoutUrl);
    } catch {
      setCheckoutError("Não foi possível iniciar o pagamento. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={submitCheckout} className="grid gap-7 lg:grid-cols-[1fr_380px] lg:items-start">
      <div className="space-y-6">
        {!paymentsReady ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-900">
            Esta é a estrutura do novo checkout. O pagamento será liberado após a conexão das credenciais de produção.
          </div>
        ) : null}

        <section className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <UserRound className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Etapa 1</p>
              <h2 className="text-lg font-bold text-slate-950">Seus dados</h2>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Nome completo" name="fullName" value={form.fullName} onChange={updateField} autoComplete="name" required minLength={3} />
            </div>
            <Field label="E-mail" name="email" value={form.email} onChange={updateField} type="email" autoComplete="email" required />
            <Field label="WhatsApp" name="phone" value={form.phone} onChange={(name, value) => updateField(name, formatPhone(value))} inputMode="tel" autoComplete="tel" required placeholder="(31) 99999-9999" />
            <Field label="CPF" name="cpf" value={form.cpf} onChange={(name, value) => updateField(name, formatCpf(value))} inputMode="numeric" autoComplete="off" required placeholder="000.000.000-00" />
          </div>
          <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-500">
            <LockKeyhole className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-600" />
            Seus dados são usados somente para pagamento, emissão fiscal, entrega e atendimento do pedido.
          </p>
        </section>

        <section className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <MapPin className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Etapa 2</p>
              <h2 className="text-lg font-bold text-slate-950">Entrega e frete</h2>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <Field label="CEP" name="postalCode" value={form.postalCode} onChange={(name, value) => updateField(name, formatPostalCode(value))} inputMode="numeric" autoComplete="postal-code" required placeholder="00000-000" />
            <button type="button" onClick={calculateShipping} disabled={isQuoting} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-wait disabled:opacity-70">
              {isQuoting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Truck className="h-4 w-4" />}
              Calcular frete
            </button>
          </div>

          {shippingError ? <p role="alert" className="mt-3 text-sm font-semibold text-rose-700">{shippingError}</p> : null}

          {quotes.length > 0 ? (
            <fieldset className="mt-5 grid gap-3">
              <legend className="mb-2 text-sm font-bold text-slate-900">Escolha a modalidade</legend>
              {quotes.map((quote) => (
                <label key={quote.id} className={`flex cursor-pointer items-center justify-between gap-4 rounded-2xl border p-4 transition ${selectedQuoteId === quote.id ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100" : "border-slate-200 hover:border-blue-300"}`}>
                  <span className="flex items-center gap-3">
                    <input type="radio" name="shippingQuote" value={quote.id} checked={selectedQuoteId === quote.id} onChange={() => setSelectedQuoteId(quote.id)} className="h-4 w-4 accent-blue-600" />
                    <span>
                      <span className="block text-sm font-bold text-slate-950">{quote.name}</span>
                      <span className="mt-0.5 block text-xs text-slate-500">até {quote.deliveryTime} dias úteis após a postagem</span>
                    </span>
                  </span>
                  <span className="text-sm font-bold text-slate-950">{priceFormatter.format(quote.price)}</span>
                </label>
              ))}
            </fieldset>
          ) : null}

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2"><Field label="Rua ou avenida" name="street" value={form.street} onChange={updateField} autoComplete="address-line1" required /></div>
            <Field label="Número" name="number" value={form.number} onChange={updateField} autoComplete="address-line2" required />
            <Field label="Complemento (opcional)" name="complement" value={form.complement} onChange={updateField} autoComplete="address-line3" />
            <Field label="Bairro" name="neighborhood" value={form.neighborhood} onChange={updateField} required />
            <Field label="Cidade" name="city" value={form.city} onChange={updateField} autoComplete="address-level2" required />
            <label className="grid gap-2 text-sm font-semibold text-slate-800">
              Estado
              <select name="state" value={form.state} onChange={(event) => updateField("state", event.target.value)} autoComplete="address-level1" required className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-base font-medium text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
                <option value="">Selecione</option>
                {states.map((state) => <option key={state} value={state}>{state}</option>)}
              </select>
            </label>
          </div>
        </section>

        <section className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <CreditCard className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Etapa 3</p>
              <h2 className="text-lg font-bold text-slate-950">Confirmação e pagamento</h2>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-slate-700">
              <input type="checkbox" checked={form.compatibilityConfirmed} onChange={(event) => updateField("compatibilityConfirmed", event.target.checked)} required className="mt-1 h-4 w-4 shrink-0 accent-blue-600" />
              Conferi o produto, a compatibilidade e a opção selecionada.
            </label>
            <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-slate-700">
              <input type="checkbox" checked={form.termsAccepted} onChange={(event) => updateField("termsAccepted", event.target.checked)} required className="mt-1 h-4 w-4 shrink-0 accent-blue-600" />
              <span>Li e aceito a <Link href="/privacidade" target="_blank" className="font-semibold text-blue-600 hover:underline">Política de Privacidade</Link> e as condições de envio e troca.</span>
            </label>
            <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-slate-700">
              <input type="checkbox" checked={form.marketingOptIn} onChange={(event) => updateField("marketingOptIn", event.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-blue-600" />
              Quero receber novidades e ofertas da InterShield. Opcional.
            </label>
          </div>
        </section>
      </div>

      <aside className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_24px_70px_-42px_rgba(15,23,42,0.5)] sm:p-6 lg:sticky lg:top-24">
        <div className="flex gap-4">
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            <Image
              src={product.image}
              alt=""
              fill
              sizes="80px"
              className="object-contain p-2"
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold leading-5 text-slate-950">{product.title}</p>
            {product.variantValue ? <p className="mt-1 text-xs font-semibold text-blue-600">{product.variantValue}</p> : null}
            <p className="mt-1 text-xs text-slate-500">SKU {product.sku}</p>
          </div>
        </div>

        <dl className="mt-6 space-y-3 border-y border-slate-200 py-5 text-sm">
          <div className="flex justify-between gap-4"><dt className="text-slate-500">Produto</dt><dd className="font-semibold text-slate-950">{priceFormatter.format(product.price)}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-slate-500">Frete</dt><dd className="font-semibold text-slate-950">{selectedQuote ? priceFormatter.format(selectedQuote.price) : "A calcular"}</dd></div>
          <div className="flex justify-between gap-4 pt-2 text-base"><dt className="font-bold text-slate-950">Total</dt><dd className="font-black text-slate-950">{priceFormatter.format(total)}</dd></div>
        </dl>

        {checkoutError ? <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-3 text-sm font-semibold leading-5 text-rose-700">{checkoutError}</p> : null}

        <button type="submit" disabled={isSubmitting || !paymentsReady} className="mt-5 inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-300">
          {isSubmitting ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <LockKeyhole className="h-4 w-4" />}
          Ir para o pagamento seguro
          {!isSubmitting ? <ChevronRight className="h-4 w-4" /> : null}
        </button>

        <div className="mt-5 space-y-3 text-xs leading-5 text-slate-500">
          <p className="flex gap-2"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-600" />Pagamento processado pelo Mercado Pago.</p>
          <p className="flex gap-2"><PackageCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-600" />O pedido só entra em produção após a confirmação.</p>
        </div>

        <Link href="/minha-conta" className="mt-6 block text-center text-xs font-semibold text-blue-600 hover:underline">Já comprou? Acompanhe seus pedidos</Link>
      </aside>
    </form>
  );
}
