"use client";

import { useState } from "react";

type ProductPurchaseCardProps = {
  name: string;
  price: number;
  compareAtPrice?: number;
  status: string;
};

export function ProductPurchaseCard({ name, price, compareAtPrice, status }: ProductPurchaseCardProps) {
  const [quantity, setQuantity] = useState(1);
  const isAvailable = status === "active";
  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);

  return (
    <aside className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Produto</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">{name}</h2>
        </div>

        <div className="rounded-3xl bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Preço</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{formattedPrice}</p>
          {compareAtPrice ? (
            <p className="mt-1 text-sm text-slate-500 line-through">
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(compareAtPrice)}
            </p>
          ) : null}
        </div>

        <div className="rounded-3xl bg-slate-50 p-5 text-sm text-slate-700">
          <p className="uppercase tracking-[0.35em] text-slate-500">Disponibilidade</p>
          <p className={`mt-2 font-semibold ${isAvailable ? "text-slate-950" : "text-rose-600"}`}>
            {isAvailable ? "Em estoque" : "Indisponível"}
          </p>
        </div>

        <div className="rounded-3xl bg-slate-50 p-5">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Quantidade</p>
          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              disabled={quantity <= 1}
              onClick={() => setQuantity((current) => Math.max(1, current - 1))}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-950 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              −
            </button>
            <span className="min-w-[3rem] text-center text-lg font-semibold text-slate-950">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((current) => current + 1)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-950 transition hover:border-slate-300"
            >
              +
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            disabled={!isAvailable}
            className="inline-flex h-14 w-full items-center justify-center rounded-[1.5rem] bg-sky-600 px-5 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
          >
            Adicionar ao carrinho
          </button>
          <button
            type="button"
            disabled={!isAvailable}
            className="inline-flex h-14 w-full items-center justify-center rounded-[1.5rem] border border-slate-200 bg-white px-5 text-sm font-semibold uppercase tracking-[0.18em] text-slate-950 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Comprar agora
          </button>
        </div>
      </div>
    </aside>
  );
}
