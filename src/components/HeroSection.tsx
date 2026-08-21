import Image from "next/image";
import Link from "next/link";

import { VehicleBar } from "@/components/search/VehicleBar";
import { PlatformIcon } from "@/components/ui/PlatformIcon";

const whatsappUrl =
  "https://wa.me/5531997146624?text=Ol%C3%A1%21%20Vim%20pelo%20site%20da%20InterShield%20e%20quero%20comprar%20um%20kit%20de%20prote%C3%A7%C3%A3o.%20Meu%20ve%C3%ADculo%20%C3%A9%3A%20";

export function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative min-h-[680px] overflow-hidden bg-[#010817] lg:min-h-[720px]"
    >
      <Image
        src="/intershield-hero-bmw.png"
        alt="Interior automotivo protegido pela InterShield Películas"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[68%_center] sm:object-[64%_center] lg:object-center"
      />

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(1,7,20,0.99)_0%,rgba(1,7,20,0.94)_32%,rgba(1,7,20,0.72)_56%,rgba(1,7,20,0.18)_82%,rgba(1,7,20,0.08)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(1,7,20,0.86)_0%,rgba(1,7,20,0.08)_45%,rgba(1,7,20,0.12)_100%)] lg:hidden" />

      <div className="relative z-10 mx-auto flex min-h-[680px] max-w-[1440px] items-center px-5 py-14 sm:px-8 sm:py-16 lg:min-h-[720px] lg:px-16 xl:px-20">
        <div className="w-full max-w-[760px]">
          <div className="inline-flex items-center rounded-full border border-blue-500/70 bg-blue-950/20 px-4 py-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-400">
              Kits automotivos sob medida
            </span>
          </div>

          <h1 className="mt-5 max-w-[720px] text-[38px] font-bold leading-[1.05] tracking-[-0.035em] text-white sm:text-[50px] lg:text-[62px]">
            Proteção sob medida para cada detalhe do seu veículo
          </h1>

          <p className="mt-5 max-w-[660px] text-[16px] leading-7 text-slate-200 sm:text-[18px]">
            Kits cortados por computador e desenvolvidos especificamente para a
            marca, o modelo e o ano do seu carro.
          </p>

          <div className="mt-7">
            <VehicleBar hero />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Comprar pelo WhatsApp da InterShield"
              className="inline-flex h-12 items-center justify-center gap-2.5 rounded-xl border border-white/15 bg-white px-5 text-[13px] font-semibold text-slate-950 shadow-sm transition hover:bg-slate-100"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366] text-white">
                <PlatformIcon name="whatsapp" className="h-4 w-4" />
              </span>
              Comprar pelo WhatsApp
            </a>

            <Link
              href="/catalogo"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/5 px-5 text-[13px] font-semibold text-white backdrop-blur-sm transition hover:border-blue-400 hover:bg-blue-500/15"
            >
              Ver catálogo completo
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-[12px] font-medium text-slate-200 sm:text-[13px]">
            {[
              "Corte computadorizado",
              "Películas de alta performance",
              "Envio para todo o Brasil",
            ].map((benefit) => (
              <li key={benefit} className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 text-[11px] font-bold text-blue-300"
                >
                  ✓
                </span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
