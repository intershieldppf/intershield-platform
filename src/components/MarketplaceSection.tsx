const marketplaces = [
  {
    name: "Mercado Livre",
    label: "Loja oficial",
    description:
      "Encontre nossos kits de proteção automotiva, PPF e soluções InterShield no Mercado Livre.",
    href: "https://www.mercadolivre.com.br/pagina/intershieldppf",
    initials: "ML",
  },
  {
    name: "Shopee",
    label: "Loja oficial",
    description:
      "Confira produtos InterShield disponíveis na Shopee e escolha a proteção ideal para o seu veículo.",
    href: "https://shopee.com.br/intershieldppf",
    initials: "SH",
  },
  {
    name: "TikTok Shop",
    label: "Loja oficial",
    description:
      "Conheça nossos produtos, demonstrações e soluções de proteção também pelo TikTok.",
    href: "https://www.tiktok.com/@intershieldppf",
    initials: "TK",
  },
];

export function MarketplaceSection() {
  return (
    <section
      id="marketplaces"
      className="scroll-mt-24"
      aria-labelledby="marketplaces-title"
    >
      <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-blue-600">
            Onde comprar
          </p>

          <h2
            id="marketplaces-title"
            className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-[38px]"
          >
            Encontre a InterShield nos principais marketplaces
          </h2>
        </div>

        <p className="max-w-md text-sm leading-7 text-slate-500">
          Escolha a plataforma de sua preferência e acesse diretamente uma de
          nossas lojas oficiais.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {marketplaces.map((marketplace) => (
          <article
            key={marketplace.name}
            className="group relative overflow-hidden rounded-[26px] border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10 sm:p-8"
          >
            <div className="absolute left-0 top-0 h-[3px] w-0 bg-blue-600 transition-all duration-500 group-hover:w-full" />

            <div className="flex items-start justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold tracking-[0.08em] text-white">
                {marketplace.initials}
              </div>

              <span className="rounded-full bg-blue-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600">
                {marketplace.label}
              </span>
            </div>

            <h3 className="mt-7 text-2xl font-bold tracking-tight text-slate-950">
              {marketplace.name}
            </h3>

            <p className="mt-4 min-h-[84px] text-sm leading-7 text-slate-600">
              {marketplace.description}
            </p>

            <a
              href={marketplace.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-slate-950 px-5 text-[13px] font-semibold text-white transition hover:bg-blue-600"
            >
              Visitar nossa loja
              <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
          </article>
        ))}
      </div>

      <div className="mt-6 rounded-[22px] bg-slate-50 px-6 py-5 text-center">
        <p className="text-sm leading-6 text-slate-600">
          Todos os canais acima direcionam para os perfis e lojas oficiais da{" "}
          <span className="font-semibold text-slate-950">
            InterShield Películas.
          </span>
        </p>
      </div>
    </section>
  );
}