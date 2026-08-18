import Link from "next/link";
import type { Product } from "@/domain/products/product";

type RelatedProductsProps = {
  products: Product[];
};

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Relacionado</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Produtos relacionados</h2>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <article key={product.id} className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:border-sky-300">
            <div className="space-y-4">
              <div className="overflow-hidden rounded-3xl bg-slate-950">
                {product.mainImageUrl ? (
                  <img
                    src={product.mainImageUrl}
                    alt={product.name}
                    className="h-40 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-40 items-center justify-center bg-slate-800 text-slate-300">
                    Imagem não disponível
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-950">{product.name}</p>
                <p className="text-sm text-slate-500">{product.shortDescription}</p>
              </div>
            </div>
            <Link
              href={`/produto/${product.slug}`}
              className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-sky-600 text-sm font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-sky-500"
            >
              Ver produto
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
