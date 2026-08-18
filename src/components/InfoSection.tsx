import Link from "next/link";

const categories = [
  {
    id: "kits",
    label: "PPF AUTOMOTIVO",
    title: "Proteção sob medida para o seu veículo",
    description:
      "Kits pré-cortados em PPF para áreas internas e externas, desenvolvidos para preservar superfícies sensíveis sem alterar o visual original.",
    details: "Interior • Exterior • Kits completos",
    number: "01",
  },
  {
    id: "blackpiano",
    label: "BLACK PIANO",
    title: "Proteja e renove acabamentos",
    description:
      "Soluções para colunas, detalhes internos e superfícies em Black Piano, ajudando a reduzir riscos e preservar o acabamento do veículo.",
    details: "Colunas • Console • Acabamentos",
    number: "02",
  },
  {
    id: "motos",
    label: "MOTOS",
    title: "Proteção também para duas rodas",
    description:
      "Películas pré-cortadas para painéis TFT, carenagens e regiões de contato, com encaixe específico para cada modelo.",
    details: "Painéis • TFT • Áreas de contato",
    number: "03",
  },
];

export function InfoSection() {
  return (
    <section aria-labelledby="categorias-title">
      {/* CABEÇALHO DA SEÇÃO */}
      <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-blue-600">
            Nossas soluções
          </p>

          <h2
            id="categorias-title"
            className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-[38px]"
          >
            Proteção para cada detalhe
          </h2>
        </div>

        <p className="max-w-md text-sm leading-6 text-slate-500">
          Escolha a categoria ideal e encontre soluções desenvolvidas para
          proteger e preservar seu veículo.
        </p>
      </div>

      {/* CATEGORIAS */}
      <div className="grid gap-5 lg:grid-cols-3">
        {categories.map((category) => (
          <article
            key={category.id}
            id={category.id}
            className="group relative min-h-[390px] overflow-hidden rounded-[24px] bg-[#050b16] p-7 text-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-25px_rgba(15,23,42,0.45)] sm:p-8"
          >
            {/* FUNDO DECORATIVO */}
            <div className="pointer-events-none absolute -right-20 -top-16 h-56 w-56 rounded-full border border-blue-500/20" />
            <div className="pointer-events-none absolute -right-8 -top-4 h-40 w-40 rounded-full border border-blue-500/15" />

            <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-blue-500 transition-all duration-500 group-hover:w-full" />

            <div className="relative z-10 flex h-full flex-col">
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-blue-400">
                  {category.label}
                </span>

                <span className="text-xs font-medium text-slate-600">
                  {category.number}
                </span>
              </div>

              <div className="mt-auto pt-24">
                <h3 className="max-w-[300px] text-[26px] font-bold leading-[1.12] tracking-tight">
                  {category.title}
                </h3>

                <p className="mt-5 max-w-[330px] text-[14px] leading-6 text-slate-400">
                  {category.description}
                </p>

                <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {category.details}
                </p>

                <Link
                  href="#buscar-veiculo"
                  className="mt-7 inline-flex items-center gap-3 text-[13px] font-semibold text-white transition group-hover:text-blue-400"
                >
                  Encontrar meu veículo
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