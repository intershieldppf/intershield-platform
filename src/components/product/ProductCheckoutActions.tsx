"use client";

import { useMemo, useState, type ReactNode } from "react";
import { LoaderCircle, MapPin, MessageCircle, Truck } from "lucide-react";

import type { StorefrontVariantOption } from "@/data/storefront/catalog";
import {
  formatPostalCode,
  normalizePostalCode,
  type ShippingQuote,
} from "@/lib/commerce/shipping";

type ProductCheckoutActionsProps = {
  productId: string;
  productTitle: string;
  sku: string;
  compatibility: string;
  variants: string[];
  variantOptions: StorefrontVariantOption[];
  price: number | null;
  benefitNotice: ReactNode;
  whatsappNumber: string;
  checkoutEnabled: boolean;
};

type QuoteResponse = {
  quotes?: ShippingQuote[];
  error?: string;
};

const priceFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function formatPrice(value: number) {
  return priceFormatter.format(value);
}

export function ProductCheckoutActions({
  productId,
  productTitle,
  sku,
  compatibility,
  variants,
  variantOptions,
  price,
  benefitNotice,
  whatsappNumber,
  checkoutEnabled,
}: ProductCheckoutActionsProps) {
  const [selectedVariant, setSelectedVariant] = useState(
    variantOptions[0]?.value ?? (variants.length === 1 ? variants[0] : ""),
  );
  const [postalCode, setPostalCode] = useState("");
  const [quotes, setQuotes] = useState<ShippingQuote[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const variantByValue = useMemo(
    () => new Map(variantOptions.map((option) => [option.value, option])),
    [variantOptions],
  );
  const selectedOption = variantByValue.get(selectedVariant);
  const displayedPrice = selectedOption?.price ?? price;
  const selectedSku = selectedOption?.sku ?? sku;

  const whatsappUrl = useMemo(() => {
    const whatsappText = [
      "Olá! Quero comprar este produto da InterShield Películas:",
      "",
      `Produto: ${productTitle}`,
      `SKU: ${selectedSku}`,
      selectedVariant ? `Opção: ${selectedVariant}` : null,
      displayedPrice !== null ? `Valor: ${formatPrice(displayedPrice)}` : null,
      `Compatibilidade: ${compatibility}`,
      "",
      "Gostaria de confirmar a compatibilidade e finalizar a compra.",
    ]
      .filter(Boolean)
      .join("\n");

    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;
  }, [
    compatibility,
    displayedPrice,
    productTitle,
    selectedSku,
    selectedVariant,
    whatsappNumber,
  ]);

  async function calculateShipping() {
    const normalizedPostalCode = normalizePostalCode(postalCode);

    if (normalizedPostalCode.length !== 8) {
      setQuotes([]);
      setError("Informe um CEP válido com 8 números.");
      return;
    }

    setIsLoading(true);
    setError("");
    setQuotes([]);

    try {
      const response = await fetch("/api/frete/cotacao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          postalCode: normalizedPostalCode,
          variantValue: selectedVariant || undefined,
        }),
      });
      const data = (await response.json()) as QuoteResponse;

      if (!response.ok || !data.quotes) {
        setError(data.error ?? "Não foi possível calcular o frete agora.");
        return;
      }

      setQuotes(data.quotes);
    } catch {
      setError("Não foi possível calcular o frete agora. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mt-6">
      <div className="border-y border-slate-200 py-6" aria-live="polite">
        <p className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          {displayedPrice === null ? "Consulte" : formatPrice(displayedPrice)}
        </p>
        <p className="mt-2 text-xs text-slate-500">SKU {selectedSku}</p>
      </div>

      {benefitNotice}

      {variants.length > 0 ? (
        <fieldset className="mt-6">
          <legend className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            Escolha uma opção
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {variants.map((value) => {
              const isSelected = selectedVariant === value;
              const pricedVariant = variantByValue.get(value);

              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedVariant(value)}
                  className={`rounded-xl border px-4 py-2.5 text-left text-sm font-semibold transition ${
                    isSelected
                      ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-100"
                      : "border-slate-200 bg-white text-slate-800 hover:border-blue-300"
                  }`}
                >
                  <span className="block">{value}</span>
                  {pricedVariant ? (
                    <span className="mt-1 block text-xs font-bold text-slate-500">
                      {formatPrice(pricedVariant.price)}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
          {variants.length > 1 && !selectedVariant ? (
            <p className="mt-2 text-xs font-medium text-amber-700">
              Selecione a opção correta antes de comprar.
            </p>
          ) : null}
        </fieldset>
      ) : null}

      {checkoutEnabled ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <label
            htmlFor="shipping-postal-code"
            className="flex items-center gap-2 text-sm font-bold text-slate-900"
          >
            <MapPin className="h-4 w-4 text-blue-600" />
            Calcule o frete pelo CEP
          </label>
          <div className="mt-3 flex gap-2">
            <input
              id="shipping-postal-code"
              inputMode="numeric"
              autoComplete="postal-code"
              value={postalCode}
              onChange={(event) =>
                setPostalCode(formatPostalCode(event.target.value))
              }
              placeholder="00000-000"
              className="h-12 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-950 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            />
            <button
              type="button"
              onClick={calculateShipping}
              disabled={isLoading}
              className="inline-flex h-12 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-wait disabled:opacity-70"
            >
              {isLoading ? (
                <LoaderCircle className="h-5 w-5 animate-spin" aria-label="Calculando" />
              ) : (
                "Calcular"
              )}
            </button>
          </div>

          {error ? (
            <p role="alert" className="mt-3 text-xs font-semibold text-rose-700">
              {error}
            </p>
          ) : null}

          {quotes.length > 0 ? (
            <div className="mt-4 space-y-2" aria-live="polite">
              {quotes.map((quote) => (
                <div
                  key={quote.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-3"
                >
                  <div className="flex items-center gap-3">
                    <Truck className="h-4 w-4 shrink-0 text-blue-600" />
                    <div>
                      <p className="text-sm font-bold text-slate-900">{quote.name}</p>
                      <p className="text-xs text-slate-500">
                        até {quote.deliveryTime} dias úteis após a postagem
                      </p>
                    </div>
                  </div>
                  <p className="shrink-0 text-sm font-bold text-slate-950">
                    {formatPrice(quote.price)}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        aria-disabled={variants.length > 1 && !selectedVariant}
        onClick={(event) => {
          if (variants.length > 1 && !selectedVariant) event.preventDefault();
        }}
        className={`mt-7 inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl px-5 text-sm font-bold text-white shadow-sm transition ${
          variants.length > 1 && !selectedVariant
            ? "cursor-not-allowed bg-slate-300"
            : "bg-blue-600 hover:bg-blue-500"
        }`}
      >
        <MessageCircle className="h-5 w-5" />
        Comprar pelo WhatsApp
      </a>

      <p className="mt-3 text-center text-xs leading-5 text-slate-500">
        Atendimento direto para confirmar a compatibilidade antes da compra.
      </p>
    </div>
  );
}
