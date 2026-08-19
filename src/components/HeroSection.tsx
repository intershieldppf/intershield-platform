import Link from "next/link";

const whatsappUrl =
  "https://wa.me/5531997146624?text=Ol%C3%A1%21%20Vim%20pelo%20site%20da%20InterShield%20e%20quero%20comprar%20um%20kit%20de%20prote%C3%A7%C3%A3o.%20Meu%20ve%C3%ADculo%20%C3%A9%3A%20";

function WhatsAppIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.1 9.1 0 0 1-3.8-.9L3 21l1.9-5A8.5 8.5 0 1 1 21 11.5Z" />
      <path d="M8.4 8.3c.3 2.8 2.5 5 5.3 5.3" />
      <path d="M13.9 13.6c.5 0 .9-.2 1.2-.5l.7-.8" />
    </svg>
  );
}

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
            <span className="text-blue-400">protegem, preservam</span>{" "}
            e <span className="text-blue-400">valorizam</span> cada detalhe do seu
            carro.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/catalogo"
              className="inline-flex h-14 items-center justify-center gap-6 rounded-xl bg-blue-600 px-7 text-[14px] font-semibold text-white transition hover:bg-blue-500"
            >
              Explorar o catálogo
              <span className="text-xl">→</span>
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Comprar pelo WhatsApp da InterShield"
              className="inline-flex h-14 items-center justify-center gap-2.5 rounded-xl border border-white/15 bg-white px-7 text-[14px] font-semibold text-slate-950 shadow-sm transition hover:bg-slate-100"
            >
              <span className="text-[#25D366]">
                <WhatsAppIcon />
              </span>
              Comprar pelo WhatsApp
            </a>
          </div>

          <p className="mt-4 text-[12px] font-medium text-slate-400">
            Atendimento direto para tirar dúvidas e confirmar a compatibilidade
            antes da compra.
          </p>
        </div>
      </div>
    </section>
  );
}
