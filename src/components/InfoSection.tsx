import Link from "next/link";

const categories = [
  {
    id: "ppf-interior",
    label: "PPF INTERIOR",
    title: "Proteção para os detalhes mais utilizados",
    description:
      "Películas transparentes pré-cortadas para multimídias, painéis, consoles e outras superfícies sensíveis ao contato e ao desgaste do uso diário.",
    details: "Multimídia • Painel • Console",
    purchaseBenefit: "Kit de aplicação completo incluso",
    href: "/ppf",
    action: "Conhecer o PPF",
    number: "01",
  },
  {
    id: "ppf-exterior",
    label: "PPF EXTERIOR",
    title: "Preserve a pintura e as áreas mais expostas",
    description:
      "Kits em TPU transparente para pintura, soleiras, conchas e pontos sujeitos a atritos, riscos leves e marcas do uso cotidiano.",
    details: "Pintura • Soleiras • Conchas",
    purchaseBenefit: "Kit de aplicação completo incluso",
    href: "/ppf",
    action: "Ver proteção exterior",
    number: "02",
  },
  {
    id: "acabamentos-colunas",
    label: "ACABAMENTOS PARA COLUNAS",
    title: "Renove ou personalize as colunas do veículo",
    description:
      "Opções em Black Piano, Preto Fosco Poroso e Fibra de Carbono 4D, produzidas com recorte específico para cada modelo.",
    details: "Black Piano • Fosco • Fibra 4D",
    purchaseBenefit: "Espátula de aplicação de brinde",
    href: "/black-piano",
    action: "Conhecer os acabamentos",
    number: "03",
  },
] as const;

export function InfoSection() {
  return (
    <section aria-labelledby="categorias-title">
      <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-blue-600">
            Nossas soluções
          </p>

          <h2
            id="categorias-title"
            className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-[38px]"
          >
            Proteção e acabamento para cada detalhe
          </h2>
        </div>

        <p className="max-w-md text-sm leading-6 text-slate-500">
          Escolha o tipo de solução e conheça materiais desenvolvidos para
          preservar ou renovar o visual do seu veículo.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {categories.map((category) => (
          <article
            key={category.id}
            id={category.id}
            className="group relative min-h-[390px] overflow-hidden rounded-[24px] bg-[#050b16] p-7 text-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-25px_rgba(15,23,42,0.45)] sm:p-8"
          >
            <div className="pointer-events-none absolute -right-20 -top-16 h-56 w-56 rounded-full border border-blue-500/20" />
            <div className="pointer-events-none absolute -right-8 -top-4 h-40 w-40 rounded-full border border-blue-500/15" />
            <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-blue-500 transition-all duration-500 group-hover:w-full" />

            <div className="relative z-10 flex h-full flex-col">
              <div className="flex items-start justify-between gap-4">
                <span className="max-w-[230px] text-[10px] font-bold uppercase tracking-[0.24em] text-blue-400">
                  {category.label}
                </span>
                <span className="text-xs font-medium text-slate-600">
                  {category.number}
                </span>
              </div>

              <div className="mt-auto pt-20">
                <h3 className="max-w-[310px] text-[26px] font-bold leading-[1.12] tracking-tight">
                  {category.title}
                </h3>
                <p className="mt-5 max-w-[340px] text-[14px] leading-6 text-slate-400">
                  {category.description}
                </p>
                <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {category.details}
                </p>

                <p className="mt-4 w-fit rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-blue-300">
                  {category.purchaseBenefit}
                </p>

                <Link
                  href={category.href}
                  className="mt-7 inline-flex items-center gap-3 text-[13px] font-semibold text-white transition group-hover:text-blue-400"
                >
                  {category.action}
                  <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
