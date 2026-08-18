"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageCircle, Search, SlidersHorizontal, X } from "lucide-react";

import type { StorefrontProduct } from "@/data/storefront/catalog";

const WHATSAPP_NUMBER = "5531997146624";
const PAGE_SIZE = 24;
const QUICK_FILTERS = ["Todos", "Interior", "Exterior", "Multimídia", "Colunas", "Universal"];

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function oneEditAway(a: string, b: string) {
  if (Math.abs(a.length - b.length) > 1) return false;

  if (a.length === b.length) {
    let differences = 0;
    for (let i = 0; i < a.length; i += 1) {
      if (a[i] !== b[i]) differences += 1;
      if (differences > 1) return false;
    }
    return differences <= 1;
  }

  const [shorter, longer] = a.length < b.length ? [a, b] : [b, a];
  let i = 0;
  let j = 0;
  let differences = 0;

  while (i < shorter.length && j < longer.length) {
    if (shorter[i] === longer[j]) {
      i += 1;
      j += 1;
    } else {
      differences += 1;
      j += 1;
      if (differences > 1) return false;
    }
  }

  return true;
}

function tokenMatches(token: string, words: string[], normalizedSearchText: string) {
  if (normalizedSearchText.includes(token)) return { matched: true, fuzzy: false };
  if (token.length < 4) return { matched: false, fuzzy: false };

  const fuzzy = words.some((word) => word.length >= 3 && oneEditAway(token, word));
  return { matched: fuzzy, fuzzy };
}

function scoreProduct(product: StorefrontProduct, query: string) {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return 0;

  const queryYearMatch = normalizedQuery.match(/\b(20\d{2})\b/);
  const queryYear = queryYearMatch ? Number(queryYearMatch[1]) : null;
  const queryTokens = normalizedQuery
    .split(" ")
    .filter(Boolean)
    .filter((token) => token !== String(queryYear ?? ""));

  const source = [
    product.title,
    product.sku ?? "",
    product.brand ?? "",
    ...product.variantValues,
  ].join(" ");
  const normalizedSource = normalizeText(source);
  const sourceWords = normalizedSource.split(" ").filter(Boolean);
  const compactSource = normalizedSource.replace(/\s+/g, "");
  const compactQuery = normalizedQuery.replace(/\s+/g, "");

  let score = compactSource.includes(compactQuery) ? 120 : 0;

  for (const token of queryTokens) {
    const result = tokenMatches(token, sourceWords, normalizedSource);
    if (!result.matched) return null;
    score += result.fuzzy ? 8 : 22;
  }

  if (product.brand && normalizedQuery.includes(normalizeText(product.brand))) {
    score += 28;
  }

  if (queryYear) {
    if (normalizedSource.includes(String(queryYear))) {
      score += 35;
    } else if (
      product.yearStart &&
      product.yearEnd &&
      queryYear >= product.yearStart &&
      queryYear <= product.yearEnd
    ) {
      score += 25;
    } else if (product.yearStart || product.yearEnd) {
      return null;
    } else {
      score += 2;
    }
  }

  return score;
}

function formatPrice(price: number | null) {
  if (price === null) return "Consulte";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
}

function compatibilityLabel(product: StorefrontProduct) {
  const brand = product.brand ?? (product.tags.includes("Universal") ? "Universal" : null);
  const years =
    product.yearStart && product.yearEnd
      ? product.yearStart === product.yearEnd
        ? String(product.yearStart)
        : `${product.yearStart}–${product.yearEnd}`
      : null;

  return [brand, years].filter(Boolean).join(" · ");
}

function whatsappLink(product: StorefrontProduct, query: string) {
  const vehicleLine = query.trim() ? `\nMinha busca/veículo: ${query.trim()}` : "";
  const text = `Olá! Vi este produto no catálogo da InterShield Películas:\n${product.title}${vehicleLine}\nQuero confirmar a compatibilidade e comprar pelo WhatsApp.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

type CatalogClientProps = {
  products: StorefrontProduct[];
  initialQuery?: string;
};

export function CatalogClient({ products, initialQuery = "" }: CatalogClientProps) {
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState("Todos");
  const [tag, setTag] = useState("Todos");
  const [brand, setBrand] = useState("Todas");
  const [sort, setSort] = useState("destaques");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const brands = useMemo(
    () =>
      Array.from(new Set(products.map((product) => product.brand).filter(Boolean))).sort((a, b) =>
        String(a).localeCompare(String(b), "pt-BR"),
      ) as string[],
    [products],
  );

  const filteredProducts = useMemo(() => {
    const scored = products
      .filter((product) => type === "Todos" || product.type === type)
      .filter((product) => tag === "Todos" || product.tags.includes(tag))
      .filter((product) => brand === "Todas" || product.brand === brand)
      .map((product) => ({ product, score: scoreProduct(product, query) }))
      .filter((item): item is { product: StorefrontProduct; score: number } => item.score !== null);

    if (query.trim()) {
      return scored
        .sort((a, b) => b.score - a.score || a.product.displayOrder - b.product.displayOrder)
        .map((item) => item.product);
    }

    const result = scored.map((item) => item.product);

    if (sort === "menor-preco") {
      return result.sort((a, b) => (a.price ?? Number.MAX_SAFE_INTEGER) - (b.price ?? Number.MAX_SAFE_INTEGER));
    }
    if (sort === "maior-preco") {
      return result.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    }
    if (sort === "az") {
      return result.sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));
    }

    return result.sort((a, b) => a.displayOrder - b.displayOrder);
  }, [products, query, type, tag, brand, sort]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [query, type, tag, brand, sort]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;
  const hasFilters = type !== "Todos" || tag !== "Todos" || brand !== "Todas";

  function clearFilters() {
    setType("Todos");
    setTag("Todos");
    setBrand("Todas");
  }

  const filterControls = (
    <>
      <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        Produto
        <select
          value={type}
          onChange={(event) => setType(event.target.value)}
          className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium normal-case tracking-normal text-slate-900 outline-none focus:border-blue-500"
        >
          <option>Todos</option>
          <option>PPF</option>
          <option>Black Piano</option>
        </select>
      </label>

      <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        Marca
        <select
          value={brand}
          onChange={(event) => setBrand(event.target.value)}
          className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium normal-case tracking-normal text-slate-900 outline-none focus:border-blue-500"
        >
          <option>Todas</option>
          {brands.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>

      <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        Ordenar
        <select
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          disabled={Boolean(query.trim())}
          className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium normal-case tracking-normal text-slate-900 outline-none focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-400"
        >
          <option value="destaques">Destaques</option>
          <option value="menor-preco">Menor preço</option>
          <option value="maior-preco">Maior preço</option>
          <option value="az">A–Z</option>
        </select>
      </label>
    </>
  );

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <section className="border-b border-slate-200 bg-white px-4 pb-6 pt-7 sm:px-8 lg:pb-8 lg:pt-10">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-blue-600">Catálogo InterShield</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[44px]">
              Encontre a proteção certa para o seu veículo
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-[15px]">
              Busque por marca, modelo e ano ou navegue por todo o catálogo. Os resultados compatíveis aparecem primeiro.
            </p>
          </div>
        </div>
      </section>

      <section className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-xl sm:px-8 lg:py-4">
        <div className="mx-auto max-w-7xl">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-600" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                type="search"
                autoComplete="off"
                placeholder="Digite marca, modelo e ano. Ex: BMW X3 2024"
                className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-12 text-[15px] font-medium text-slate-950 shadow-sm outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-950"
                  aria-label="Limpar busca"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => setShowMobileFilters((current) => !current)}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden xs:inline">Filtros</span>
            </button>
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {QUICK_FILTERS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTag(item)}
                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition ${
                  tag === item
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-200 bg-white text-slate-600"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {showMobileFilters ? (
            <div className="mt-3 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:hidden">
              {filterControls}
              {hasFilters ? (
                <button type="button" onClick={clearFilters} className="text-left text-sm font-semibold text-blue-600">
                  Limpar filtros
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>

      <section className="px-4 py-6 sm:px-8 lg:py-8">
        <div className="mx-auto max-w-7xl">
          <div className="hidden grid-cols-[1fr_1fr_1fr_auto] items-end gap-3 rounded-[22px] border border-slate-200 bg-slate-50 p-4 lg:grid">
            {filterControls}
            {hasFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="h-11 rounded-xl px-4 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
              >
                Limpar
              </button>
            ) : (
              <div className="w-20" />
            )}
          </div>

          <div className="mt-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-950">
                {query.trim() ? `Resultados para “${query.trim()}”` : "Todos os produtos"}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {filteredProducts.length} {filteredProducts.length === 1 ? "produto encontrado" : "produtos encontrados"}
              </p>
            </div>
            {query.trim() ? (
              <span className="hidden rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 sm:inline-flex">
                Ordenado por relevância
              </span>
            ) : null}
          </div>

          {visibleProducts.length > 0 ? (
            <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {visibleProducts.map((product) => {
                const compatibility = compatibilityLabel(product);
                return (
                  <article
                    key={product.id}
                    className="group overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                  >
                    <div className="relative aspect-square overflow-hidden bg-slate-50">
                      <img
                        src={product.image}
                        alt={product.title}
                        loading="lazy"
                        className="h-full w-full object-contain p-2 transition duration-300 group-hover:scale-[1.02]"
                      />
                      <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-blue-600 shadow-sm">
                        {product.type}
                      </span>
                    </div>

                    <div className="flex min-h-[230px] flex-col p-3 sm:p-4">
                      {compatibility ? (
                        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                          {compatibility}
                        </p>
                      ) : null}

                      <h2 className="line-clamp-3 text-[13px] font-semibold leading-5 text-slate-900 sm:text-sm">
                        {product.title}
                      </h2>

                      <div className="mt-auto pt-4">
                        <p className="text-lg font-bold tracking-tight text-slate-950 sm:text-xl">
                          {formatPrice(product.price)}
                        </p>
                        <p className="mt-1 text-[10px] text-slate-400">SKU {product.sku ?? product.id}</p>

                        <a
                          href={whatsappLink(product, query)}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-3 py-2 text-center text-[11px] font-semibold text-white transition hover:bg-blue-600 sm:text-xs"
                        >
                          <MessageCircle className="h-4 w-4 shrink-0" />
                          Comprar
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-6 rounded-[26px] border border-slate-200 bg-slate-50 px-6 py-12 text-center">
              <p className="text-xl font-bold text-slate-950">Não encontramos um resultado exato.</p>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">
                Revise o modelo ou ano. Se o seu veículo não estiver no catálogo, fale com a InterShield para confirmarmos a disponibilidade.
              </p>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Olá! Não encontrei meu veículo no catálogo da InterShield. Minha busca foi: ${query}`)}`}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                <MessageCircle className="h-4 w-4" />
                Consultar pelo WhatsApp
              </a>
            </div>
          )}

          {hasMore ? (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((current) => current + PAGE_SIZE)}
                className="h-12 rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-blue-300 hover:text-blue-600"
              >
                Carregar mais produtos
              </button>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
