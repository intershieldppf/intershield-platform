import Link from "next/link";
import { Crosshair, ShieldCheck, Sparkles } from "lucide-react";

import { ChunkedVideo } from "@/components/media/ChunkedVideo";
import { videoChunks } from "@/lib/videoChunks";

const benefits = [
  {
    number: "01",
    title: "Áreas críticas protegidas",
    description:
      "Proteção para black piano, telas e console contra riscos e marcas do uso diário.",
    icon: ShieldCheck,
  },
  {
    number: "02",
    title: "Corte preciso sob medida",
    description:
      "Kits recortados por computador para acompanhar cada detalhe do veículo.",
    icon: Crosshair,
  },
  {
    number: "03",
    title: "Aparência original preservada",
    description:
      "PPF transparente que protege sem alterar o brilho e o acabamento da peça.",
    icon: Sparkles,
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

            <p className="mt-6 max-w-[610px] text-base leading-7 text-slate-200">
              Veja como o PPF transparente é aplicado nas áreas mais sensíveis
              do interior. A película acompanha o desenho da peça, preserva o
              brilho e mantém a aparência original do veículo.
            </p>

            <div className="relative mt-10">
              <div
                aria-hidden="true"
                className="absolute bottom-8 left-6 top-8 w-px bg-gradient-to-b from-blue-500/20 via-blue-400/80 to-blue-500/20 shadow-[0_0_14px_rgba(59,130,246,0.4)] sm:hidden"
              />

              <div className="grid gap-4 sm:grid-cols-3">
                {benefits.map((benefit) => {
                  const Icon = benefit.icon;

                  return (
                    <article
                      key={benefit.number}
                      className="group relative flex min-h-[172px] items-start gap-4 overflow-hidden rounded-[22px] border border-blue-400/20 bg-[linear-gradient(145deg,rgba(15,23,42,0.92),rgba(6,15,32,0.96))] p-4 shadow-[0_18px_45px_-32px_rgba(37,99,235,0.85)] transition duration-300 hover:-translate-y-1 hover:border-blue-400/45 sm:min-h-[238px] sm:flex-col sm:gap-0 sm:p-5"
                    >
                      <div
                        aria-hidden="true"
                        className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/65 to-transparent opacity-70"
                      />

                      <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-blue-400/60 bg-blue-500/10 text-blue-300 shadow-[0_0_24px_rgba(37,99,235,0.22)] transition duration-300 group-hover:border-blue-300 group-hover:bg-blue-500/20">
                        <Icon className="h-5 w-5" strokeWidth={1.8} />
                      </div>

                      <div className="min-w-0 sm:mt-5">
                        <span className="text-xs font-bold tracking-[0.18em] text-blue-400">
                          {benefit.number}
                        </span>
                        <h3 className="mt-2 text-base font-semibold leading-6 text-white">
                          {benefit.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-300">
                          {benefit.description}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
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
              <ChunkedVideo
                ariaLabel="Aplicação do PPF InterShield no console e nas superfícies internas de um veículo"
                chunks={videoChunks.interiorProtection}
                poster="/protecao-interior-intershield-capa.png"
                className="h-full w-full object-cover"
              />
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
