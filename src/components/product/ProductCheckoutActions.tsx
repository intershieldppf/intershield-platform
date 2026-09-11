"use client";

import { useMemo, useState } from "react";
import { CreditCard, LoaderCircle, MapPin, MessageCircle, Store, Truck } from "lucide-react";

import { formatPostalCode, normalizePostalCode, type ShippingQuote } from "@/lib/commerce/shipping";
import { PRICES_UNDER_CONSULTATION } from "@/lib/storefrontPricing";

type ProductCheckoutActionsProps = {
  productId: string;
  productTitle: string;
  sku: string;
  compatibility: string;
  variants: string[];
  whatsappNumber: string;
  checkoutEnabled: boolean;
};

type QuoteResponse = { quotes?: ShippingQuote[]; error?: string };
type CheckoutResponse = { checkoutUrl?: string; error?: string };
type DeliveryType = "pickup" | "shipping";

const fieldClass = "h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100";

function formatPrice(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export function ProductCheckoutActions({ productId, productTitle, sku, compatibility, variants, whatsappNumber, checkoutEnabled }: ProductCheckoutActionsProps) {
  const [selectedVariant, setSelectedVariant] = useState(variants.length === 1 ? variants[0] : "");
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("pickup");
  const [postalCode, setPostalCode] = useState("");
  const [quotes, setQuotes] = useState<ShippingQuote[]>([]);
  const [selectedQuoteId, setSelectedQuoteId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const selectedQuote = quotes.find((quote) => quote.id === selectedQuoteId);
  const canCheckout = (variants.length <= 1 || Boolean(selectedVariant)) && (deliveryType === "pickup" || Boolean(selectedQuote));

  const whatsappUrl = useMemo(() => {
    const whatsappText = [
      "Olá! Quero comprar este produto da InterShield Películas:", "", `Produto: ${productTitle}`,
      `SKU: ${sku}`, selectedVariant ? `Opção: ${selectedVariant}` : null,
      `Compatibilidade: ${compatibility}`, "", "Gostaria de confirmar a compatibilidade e finalizar a compra.",
    ].filter(Boolean).join("\n");
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;
  }, [compatibility, productTitle, selectedVariant, sku, whatsappNumber]);

  async function calculateShipping() {
    const normalizedPostalCode = normalizePostalCode(postalCode);
    if (normalizedPostalCode.length !== 8) {
      setQuotes([]); setSelectedQuoteId(null); setError("Informe um CEP válido com 8 números."); return;
    }
    setIsLoading(true); setError(""); setQuotes([]); setSelectedQuoteId(null);
    try {
      const response = await fetch("/api/frete/cotacao", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, postalCode: normalizedPostalCode }),
      });
      const data = (await response.json()) as QuoteResponse;
      if (!response.ok || !data.quotes) { setError(data.error ?? "Não foi possível calcular o frete agora."); return; }
      setQuotes(data.quotes);
    } catch { setError("Não foi possível calcular o frete agora. Tente novamente."); }
    finally { setIsLoading(false); }
  }

  async function startCheckout(formData: FormData) {
    if (!canCheckout) return;
    setIsCheckingOut(true); setError("");
    const customer = {
      name: String(formData.get("name") ?? ""), email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""), document: String(formData.get("document") ?? ""),
    };
    const body = deliveryType === "shipping" ? {
      productId, variant: selectedVariant, deliveryType, postalCode: normalizePostalCode(postalCode),
      quoteId: selectedQuoteId, customer,
      address: {
        street: String(formData.get("street") ?? ""), number: String(formData.get("number") ?? ""),
        complement: String(formData.get("complement") ?? ""), neighborhood: String(formData.get("neighborhood") ?? ""),
        city: String(formData.get("city") ?? ""), state: String(formData.get("state") ?? ""),
      },
    } : { productId, variant: selectedVariant, deliveryType, customer };

    try {
      const response = await fetch("/api/checkout/mercado-pago", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
      });
      const data = (await response.json()) as CheckoutResponse;
      if (!response.ok || !data.checkoutUrl) { setError(data.error ?? "Não foi possível iniciar o pagamento."); return; }
      window.location.assign(data.checkoutUrl);
    } catch { setError("Não foi possível iniciar o pagamento. Tente novamente."); }
    finally { setIsCheckingOut(false); }
  }

  return (
    <div className="mt-6">
      {variants.length > 0 ? (
        <fieldset>
          <legend className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Escolha uma opção</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {variants.map((value) => {
              const isSelected = selectedVariant === value;
              return <button key={value} type="button" aria-pressed={isSelected} onClick={() => setSelectedVariant(value)} className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${isSelected ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-100" : "border-slate-200 bg-white text-slate-800 hover:border-blue-300"}`}>{value}</button>;
            })}
          </div>
          {variants.length > 1 && !selectedVariant ? <p className="mt-2 text-xs font-medium text-amber-700">Selecione a opção correta antes de comprar.</p> : null}
        </fieldset>
      ) : null}

      {checkoutEnabled ? (
        <form action={startCheckout} className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <fieldset>
            <legend className="text-sm font-bold text-slate-900">Como deseja receber?</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <button type="button" aria-pressed={deliveryType === "pickup"} onClick={() => { setDeliveryType("pickup"); setError(""); }} className={`flex min-h-16 items-center gap-3 rounded-xl border p-3 text-left transition ${deliveryType === "pickup" ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100" : "border-slate-200 bg-white"}`}>
                <Store className="h-5 w-5 shrink-0 text-blue-600" /><span><strong className="block text-sm text-slate-900">Retirada em Igarapé</strong><span className="text-xs text-slate-500">Grátis</span></span>
              </button>
              <button type="button" aria-pressed={deliveryType === "shipping"} onClick={() => { setDeliveryType("shipping"); setError(""); }} className={`flex min-h-16 items-center gap-3 rounded-xl border p-3 text-left transition ${deliveryType === "shipping" ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100" : "border-slate-200 bg-white"}`}>
                <Truck className="h-5 w-5 shrink-0 text-blue-600" /><span><strong className="block text-sm text-slate-900">Receber pelos Correios</strong><span className="text-xs text-slate-500">PAC ou SEDEX</span></span>
              </button>
            </div>
          </fieldset>

          {deliveryType === "shipping" ? (
            <div className="mt-5">
              <label htmlFor="shipping-postal-code" className="flex items-center gap-2 text-sm font-bold text-slate-900"><MapPin className="h-4 w-4 text-blue-600" />Calcule o frete pelo CEP</label>
              <div className="mt-3 flex gap-2">
                <input id="shipping-postal-code" inputMode="numeric" autoComplete="postal-code" value={postalCode} onChange={(event) => setPostalCode(formatPostalCode(event.target.value))} placeholder="00000-000" className={fieldClass} />
                <button type="button" onClick={calculateShipping} disabled={isLoading} className="inline-flex h-12 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-wait disabled:opacity-70">{isLoading ? <LoaderCircle className="h-5 w-5 animate-spin" aria-label="Calculando" /> : "Calcular"}</button>
              </div>
              {quotes.length > 0 ? <div className="mt-3 space-y-2" aria-live="polite">{quotes.map((quote) => (
                <label key={quote.id} className={`flex cursor-pointer items-center justify-between gap-4 rounded-xl border bg-white p-3 ${selectedQuoteId === quote.id ? "border-blue-600 ring-2 ring-blue-100" : "border-slate-200"}`}>
                  <span className="flex items-center gap-3"><input type="radio" name="shippingQuote" checked={selectedQuoteId === quote.id} onChange={() => setSelectedQuoteId(quote.id)} className="accent-blue-600" /><span><strong className="block text-sm text-slate-900">{quote.name}</strong><span className="text-xs text-slate-500">até {quote.deliveryTime} dias úteis após a postagem</span></span></span>
                  <strong className="shrink-0 text-sm text-slate-950">{formatPrice(quote.price)}</strong>
                </label>
              ))}</div> : null}
            </div>
          ) : null}

          <div className="mt-5 border-t border-slate-200 pt-5">
            <h3 className="text-sm font-bold text-slate-900">Dados para o pedido</h3><p className="mt-1 text-xs text-slate-500">Compre como convidado, sem criar conta.</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input name="name" required autoComplete="name" placeholder="Nome completo" className={`${fieldClass} sm:col-span-2`} />
              <input name="email" required type="email" autoComplete="email" placeholder="E-mail" className={fieldClass} />
              <input name="phone" required inputMode="tel" autoComplete="tel" placeholder="Telefone com DDD" className={fieldClass} />
              <input name="document" required inputMode="numeric" autoComplete="off" placeholder="CPF" className={`${fieldClass} sm:col-span-2`} />
            </div>
          </div>

          {deliveryType === "shipping" ? <div className="mt-5">
            <h3 className="text-sm font-bold text-slate-900">Endereço de entrega</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input name="street" required autoComplete="address-line1" placeholder="Rua ou avenida" className={`${fieldClass} sm:col-span-2`} />
              <input name="number" required autoComplete="address-line2" placeholder="Número" className={fieldClass} />
              <input name="complement" autoComplete="address-line3" placeholder="Complemento (opcional)" className={fieldClass} />
              <input name="neighborhood" required placeholder="Bairro" className={fieldClass} />
              <input name="city" required autoComplete="address-level2" placeholder="Cidade" className={fieldClass} />
              <input name="state" required autoComplete="address-level1" maxLength={2} placeholder="UF" className={fieldClass} />
            </div>
          </div> : null}

          {error ? <p role="alert" className="mt-4 text-xs font-semibold text-rose-700">{error}</p> : null}
          <button type="submit" disabled={!canCheckout || isCheckingOut} className="mt-5 inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-300">
            {isCheckingOut ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <CreditCard className="h-5 w-5" />}{isCheckingOut ? "Abrindo pagamento..." : "Pagar com Mercado Pago"}
          </button>
          <p className="mt-3 text-center text-xs leading-5 text-slate-500">Pix ou cartão em ambiente seguro do Mercado Pago.</p>
        </form>
      ) : null}

      <a href={whatsappUrl} target="_blank" rel="noreferrer" aria-disabled={variants.length > 1 && !selectedVariant} onClick={(event) => { if (variants.length > 1 && !selectedVariant) event.preventDefault(); }} className={`mt-5 inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl px-5 text-sm font-bold text-white shadow-sm transition ${variants.length > 1 && !selectedVariant ? "cursor-not-allowed bg-slate-300" : "bg-slate-950 hover:bg-slate-800"}`}><MessageCircle className="h-5 w-5" />{PRICES_UNDER_CONSULTATION ? "Consultar preço pelo WhatsApp" : "Comprar pelo WhatsApp"}</a>
      <p className="mt-3 text-center text-xs leading-5 text-slate-500">{PRICES_UNDER_CONSULTATION ? "Atendimento direto para consultar o preço e confirmar a compatibilidade." : "Atendimento direto para confirmar a compatibilidade antes da compra."}</p>
    </div>
  );
}
