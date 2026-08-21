import Link from "next/link";

const benefits = [
  {
    number: "01",
    title: "Superfícies críticas",
    description: "Black piano, telas e console protegidos no uso diário.",
  },
  {
    number: "02",
    title: "Encaixe sob medida",
    description: "Kits recortados para acompanhar cada detalhe do veículo.",
  },
  {
    number: "03",
    title: "Acabamento preservado",
    description: "Uma barreira transparente contra riscos leves e marcas.",
  },
] as const;

export function InteriorProtectionVideoSection() {
  return (
    <section
      aria-labelledby="protecao-interior-title"
      className="bg-white px-6 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20"
    >
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[30px] bg-[#030814] text-white shadow-[0_32px_90px_-48px_rgba(15,23,42,0.85)] sm:rounded-[36px]">
        <div className="pointer-events-none absolute -left-40 top-0 h-80 w-80 rounded-full bg-blue-600/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative grid items-center gap-12 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_390px] lg:gap-16 lg:px-14 lg:py-16 xl:px-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-blue-500/40 bg-blue-500/10 px-4 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.9)]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-blue-300">
                Proteção interior em ação
              </span>
            </div>

            <h2
              id="protecao-interior-title"
              className="mt-6 max-w-[680px] text-[34px] font-bold leading-[1.08] tracking-tight sm:text-[44px] lg:text-[52px]"
            >
              O acabamento original, protegido desde o primeiro toque.
            </h2>

            <p className="mt-6 max-w-[610px] text-[15px] leading-7 text-slate-300 sm:text-base">
              Veja como o PPF transparente é aplicado nas áreas mais sensíveis
              do interior. A película acompanha o desenho da peça, preserva o
              brilho e mantém a aparência original do veículo.
            </p>

            <div className="mt-9 grid gap-3 sm:grid-cols-3">
              {benefits.map((benefit) => (
                <article
                  key={benefit.number}
                  className="rounded-2xl border border-white/10 bg-white/[0.045] p-4"
                >
                  <span className="text-[10px] font-bold tracking-[0.18em] text-blue-400">
                    {benefit.number}
                  </span>
                  <h3 className="mt-3 text-sm font-semibold text-white">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-slate-400">
                    {benefit.description}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/catalogo"
                className="inline-flex h-13 items-center justify-center gap-4 rounded-xl bg-blue-600 px-6 text-[13px] font-semibold text-white transition hover:bg-blue-500"
              >
                Encontrar o kit do meu veículo
                <span aria-hidden="true" className="text-lg">
                  →
                </span>
              </Link>

              <Link
                href="/ppf"
                className="inline-flex h-13 items-center justify-center rounded-xl border border-white/15 px-6 text-[13px] font-semibold text-white transition hover:border-blue-400/60 hover:bg-white/5"
              >
                Entender o PPF
              </Link>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[390px]">
            <div className="mb-3 flex items-center justify-between px-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-300">
                Aplicação real InterShield
              </p>
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">
                00:29
              </p>
            </div>

            <div className="relative aspect-[9/16] overflow-hidden rounded-[26px] border border-blue-400/25 bg-black shadow-[0_24px_80px_-28px_rgba(37,99,235,0.6)]">
              <video
                controls
                playsInline
                preload="metadata"
                poster="/protecao-interior-intershield-capa.png"
                aria-label="Aplicação do PPF InterShield no console e nas superfícies internas de um veículo"
                className="h-full w-full object-cover"
              >
                <source
                  src="/protecao-interior-intershield.mp4"
                  type="video/mp4"
                />
                Seu navegador não oferece suporte à reprodução deste vídeo.
              </video>
            </div>

            <p className="mt-4 text-center text-[11px] leading-5 text-slate-400">
              Dê o play para assistir com áudio e acompanhar o resultado.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
