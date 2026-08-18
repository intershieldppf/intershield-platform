import Link from "next/link";

export function HeroSection() {
  return (
    <section
      className="relative min-h-[520px] overflow-hidden bg-[#010817] bg-cover bg-center lg:min-h-[560px]"
      style={{
        backgroundImage: `
          linear-gradient(
            90deg,
            rgba(1, 7, 20, 0.98) 0%,
            rgba(1, 7, 20, 0.92) 24%,
            rgba(1, 7, 20, 0.62) 46%,
            rgba(1, 7, 20, 0.15) 72%,
            rgba(1, 7, 20, 0.05) 100%
          ),
          url('/intershield-hero-bmw.png')
        `,
      }}
    >
      <div className="mx-auto flex min-h-[520px] max-w-[1440px] items-center px-6 py-16 sm:px-10 lg:min-h-[560px] lg:px-16 xl:px-20">
        <div className="relative z-10 max-w-[610px]">
          <div className="inline-flex items-center rounded-full border border-blue-500/70 bg-blue-950/20 px-4 py-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-400">
              Proteção e customização automotiva
            </span>
          </div>

          <h2 className="mt-6 text-[44px] font-bold leading-[1.06] tracking-tight text-white sm:text-[54px] lg:text-[62px]">
            Proteção sob medida
            <br />
            para o seu veículo
          </h2>

          <p className="mt-6 max-w-[560px] text-[17px] leading-7 text-slate-200">
            Películas de alta performance que{" "}
            <span className="text-blue-400">
              protegem, preservam
            </span>{" "}
            e{" "}
            <span className="text-blue-400">
              valorizam
            </span>{" "}
            cada detalhe do seu carro.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="#buscar-veiculo"
              className="inline-flex h-14 items-center justify-center gap-6 rounded-xl bg-blue-600 px-7 text-[14px] font-semibold text-white transition hover:bg-blue-500"
            >
              Buscar veículos
              <span className="text-xl">→</span>
            </Link>

            <Link
              href="#sobre"
              className="inline-flex h-14 items-center justify-center rounded-xl border border-white/50 bg-black/20 px-7 text-[14px] font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
            >
              Conheça a InterShield
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}