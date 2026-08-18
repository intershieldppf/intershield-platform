import Image from "next/image";

const tpuBenefits = [
  "Alta resistência a riscos e impactos leves",
  "Tecnologia autorregenerativa para marcas superficiais",
  "Transparência superior e acabamento premium",
  "Maior resistência ao amarelamento e ressecamento",
  "Elasticidade para acompanhar as curvas do veículo",
  "Durabilidade superior a materiais mais simples",
];

export function AboutSection() {
  return (
    <section
      id="sobre"
      className="scroll-mt-24 overflow-hidden rounded-[32px] bg-white"
    >
      <div className="mx-auto max-w-7xl">
        {/* CABEÇALHO */}
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
          <div className="flex items-center justify-center gap-4">
            <span className="hidden h-px w-12 bg-slate-300 sm:block" />

            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-blue-600">
              Conheça a InterShield
            </p>

            <span className="hidden h-px w-12 bg-slate-300 sm:block" />
          </div>

          <h2 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-[48px]">
            Proteção{" "}
            <span className="text-blue-600">
              inteligente
            </span>{" "}
            para o seu veículo
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-slate-600 sm:text-[15px]">
            A InterShield Películas nasceu da paixão por carros e do compromisso
            com a excelência. Unimos tecnologia, materiais de alta performance
            e atenção aos detalhes para entregar proteção automotiva com
            acabamento premium.
          </p>
        </div>

        {/* QUEM SOMOS + FOTO + PROPÓSITO */}
        <div className="mt-10 grid gap-5 px-5 sm:px-8 lg:grid-cols-[0.72fr_1.6fr_0.72fr] lg:items-stretch">
          {/* QUEM SOMOS */}
          <article className="flex flex-col rounded-[26px] border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-200 text-blue-600">
              <svg
                width="27"
                height="27"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21v-2a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v2" />
              </svg>
            </div>

            <h3 className="mt-7 text-2xl font-bold tracking-tight text-slate-950">
              Quem somos
            </h3>

            <div className="mt-4 h-[3px] w-14 rounded-full bg-blue-600" />

            <div className="mt-6 space-y-5 text-sm leading-7 text-slate-600">
              <p>
                Somos{" "}
                <strong className="font-semibold text-blue-600">
                  Pedro Dutra e Pedro Ian
                </strong>
                , amigos de infância e fundadores da InterShield Películas.
              </p>

              <p>
                Unidos pela mesma visão:{" "}
                <strong className="font-semibold text-blue-600">
                  elevar o padrão
                </strong>{" "}
                da proteção automotiva através de qualidade, tecnologia e
                precisão.
              </p>
            </div>
          </article>

          {/* FOTO */}
          <div className="relative min-h-[420px] overflow-hidden rounded-[26px] bg-slate-100 sm:min-h-[500px] lg:min-h-[460px]">
            <Image
              src="/intershield-socios.png"
              alt="Pedro Dutra e Pedro Ian, fundadores da InterShield Películas"
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover object-center"
            />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          {/* PROPÓSITO */}
          <article className="flex flex-col rounded-[26px] border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-200 text-blue-600">
              <svg
                width="27"
                height="27"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="8" />
                <circle cx="12" cy="12" r="4" />
                <path d="m15 9 5-5" />
                <path d="M16 4h4v4" />
              </svg>
            </div>

            <h3 className="mt-7 text-2xl font-bold tracking-tight text-slate-950">
              Nosso propósito
            </h3>

            <div className="mt-4 h-[3px] w-14 rounded-full bg-blue-600" />

            <div className="mt-6 space-y-5 text-sm leading-7 text-slate-600">
              <p>
                Entregar{" "}
                <strong className="font-semibold text-blue-600">
                  proteção premium
                </strong>
                ,{" "}
                <strong className="font-semibold text-blue-600">
                  acabamento impecável
                </strong>{" "}
                e materiais de alta performance.
              </p>

              <p>
                Tecnologia, precisão e atendimento especializado para colocar a
                proteção do seu veículo em primeiro lugar.
              </p>
            </div>

            <p className="mt-auto pt-7 text-base font-semibold leading-7 text-slate-950">
              Seu veículo protegido{" "}
              <span className="text-blue-600">
                como ele merece.
              </span>
            </p>
          </article>
        </div>

        {/* CONTEÚDO EDUCATIVO */}
        <div className="mt-5 grid gap-5 px-5 pb-5 sm:px-8 sm:pb-8 lg:grid-cols-3">
          {/* CARD 1 */}
          <article className="rounded-[24px] border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex items-start gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-200 text-blue-600">
                <svg
                  width="27"
                  height="27"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 3 5 6v5c0 4.6 2.8 8 7 10 4.2-2 7-5.4 7-10V6l-7-3Z" />
                </svg>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-950">
                  1. O que é PPF?
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  PPF significa{" "}
                  <strong className="font-semibold text-slate-950">
                    Paint Protection Film
                  </strong>
                  . É uma película transparente aplicada sobre superfícies do
                  veículo para ajudar a protegê-las contra riscos, atritos e
                  desgastes comuns do dia a dia.
                </p>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  A proteção preserva a aparência original da peça sem
                  comprometer seu acabamento.
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-200 pt-5">
              <p className="text-xs font-semibold text-slate-700">
                Proteção discreta para o que importa.
              </p>
            </div>
          </article>

          {/* CARD 2 */}
          <article className="rounded-[24px] border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex items-start gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-200 text-blue-600">
                <svg
                  width="27"
                  height="27"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m12 2 8 4-8 4-8-4 8-4Z" />
                  <path d="m4 10 8 4 8-4" />
                  <path d="m4 14 8 4 8-4" />
                </svg>
              </div>

              <div className="w-full">
                <h3 className="text-xl font-bold text-slate-950">
                  2. Por que TPU faz a diferença?
                </h3>

                <ul className="mt-5 space-y-3">
                  {tpuBenefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex gap-3 text-sm leading-6 text-slate-600"
                    >
                      <span className="mt-[2px] font-bold text-blue-600">
                        ✓
                      </span>

                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>

          {/* CARD 3 */}
          <article className="rounded-[24px] border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex items-start gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-200 text-blue-600">
                <svg
                  width="27"
                  height="27"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="9" r="5" />
                  <path d="m8 14-2 7 6-3 6 3-2-7" />
                </svg>
              </div>

              <div>
                <h3 className="text-xl font-bold leading-tight text-slate-950">
                  3. Nem todo “PPF” é igual.
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  Existem películas produzidas com diferentes materiais e
                  níveis de qualidade. Isso influencia diretamente
                  transparência, flexibilidade, acabamento e durabilidade.
                </p>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  Na InterShield Películas trabalhamos com{" "}
                  <strong className="font-semibold text-blue-600">
                    PPF em TPU
                  </strong>
                  , selecionado para oferecer proteção transparente,
                  flexibilidade e acabamento premium.
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}