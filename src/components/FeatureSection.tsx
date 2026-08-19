import Image from "next/image";

const processSteps = [
  {
    number: "01",
    label: "Identificação",
    title: "Veículo e peça confirmados",
    description:
      "Conferimos marca, modelo, ano, versão e a área que receberá a proteção.",
  },
  {
    number: "02",
    label: "Software de corte",
    title: "Molde digital selecionado",
    description:
      "O desenho compatível é preparado no software com as linhas e medidas da peça.",
  },
  {
    number: "03",
    label: "Plotter",
    title: "Recorte automatizado",
    description:
      "A plotter percorre os contornos do arquivo e realiza o corte diretamente no material.",
  },
  {
    number: "04",
    label: "Kit pronto",
    title: "Peças separadas para aplicação",
    description:
      "O cliente recebe o kit pré-cortado, identificado e com menor necessidade de ajustes manuais.",
  },
] as const;

export function FeatureSection() {
  return (
    <section id="instalar" aria-labelledby="processo-corte-title">
      <div className="grid gap-7 lg:grid-cols-[1fr_0.72fr] lg:items-end">
        <div className="max-w-3xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-blue-600">
            Corte computadorizado
          </p>
          <h2
            id="processo-corte-title"
            className="mt-3 text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-[42px]"
          >
            Do molde digital ao kit pronto para o seu veículo
          </h2>
        </div>

        <p className="text-[15px] leading-8 text-slate-600">
          Cada projeto começa pela identificação correta do veículo. Depois, o
          molde compatível é preparado em um software de recorte e enviado à
          plotter, que transforma o arquivo digital em peças pré-cortadas.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.36fr_0.64fr]">
        <article className="group overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
          <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
            <Image
              src="/corte-computadorizado-plotter.webp"
              alt="Plotter realizando o corte computadorizado de moldes em película transparente"
              fill
              sizes="(min-width: 1024px) 65vw, 100vw"
              className="object-cover transition duration-700 group-hover:scale-[1.02]"
            />

            <div className="absolute left-5 top-5 rounded-full border border-white/70 bg-white/90 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700 shadow-sm backdrop-blur">
              Projeto digital + plotter
            </div>

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent px-6 pb-6 pt-20 sm:px-8 sm:pb-8">
              <p className="max-w-xl text-xl font-bold tracking-tight text-white sm:text-2xl">
                O desenho orienta o caminho da lâmina no material
              </p>
            </div>
          </div>

          <div className="grid gap-6 p-7 sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-lg font-bold text-slate-950">
                Recorte realizado antes do envio
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                A plotter segue os contornos do molde digital sobre a película.
                O processo reduz cortes manuais e evita o uso de lâmina
                diretamente sobre a peça original do veículo.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
                ✓
              </span>
              <span className="text-xs font-bold uppercase leading-5 tracking-[0.12em] text-blue-800">
                Sem corte
                <br />
                sobre o veículo
              </span>
            </div>
          </div>
        </article>

        <article className="overflow-hidden rounded-[30px] bg-[#030816] p-4 text-white shadow-xl shadow-slate-950/15 sm:p-5">
          <div className="flex items-center justify-between gap-4 px-2 pb-4 pt-1">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400">
                Processo real
              </p>
              <h3 className="mt-2 text-xl font-bold tracking-tight">
                Veja a plotter em ação
              </h3>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400">
              ▶
            </span>
          </div>

          <div className="relative mx-auto aspect-[9/14] max-h-[560px] overflow-hidden rounded-[22px] border border-white/10 bg-black">
            <video
              className="h-full w-full object-cover"
              src="/corte-ppf-plotter.mp4"
              poster="/corte-ppf-plotter-poster.webp"
              autoPlay
              muted
              loop
              playsInline
              controls
              preload="metadata"
              aria-label="Vídeo real da plotter recortando a película"
            />
          </div>

          <p className="px-2 pb-2 pt-5 text-sm leading-7 text-slate-400">
            No vídeo, o cabeçote percorre o material seguindo o arquivo enviado
            pelo software. É assim que os contornos do kit são produzidos de
            forma padronizada.
          </p>
        </article>
      </div>

      <div className="mt-6 overflow-hidden rounded-[30px] border border-slate-200 bg-slate-50/70 p-6 sm:p-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {processSteps.map((step, index) => (
            <article
              key={step.number}
              className="relative rounded-[22px] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">
                  {step.label}
                </span>
                <span className="text-xs font-bold text-slate-300">
                  {step.number}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-bold leading-6 text-slate-950">
                {step.title}
              </h3>
              <p className="mt-3 text-[13px] leading-6 text-slate-600">
                {step.description}
              </p>

              {index < processSteps.length - 1 ? (
                <span
                  className="absolute -right-3 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-blue-100 bg-white text-xs text-blue-600 shadow-sm xl:flex"
                  aria-hidden="true"
                >
                  →
                </span>
              ) : null}
            </article>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 rounded-[24px] border border-blue-100 bg-blue-50/65 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <p className="font-bold text-slate-950">
            A precisão começa pela compatibilidade correta
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Antes da produção, confirme modelo, ano, versão e a peça desejada.
          </p>
        </div>
        <span className="w-fit rounded-full bg-blue-600 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
          Kit específico para cada modelo
        </span>
      </div>
    </section>
  );
}
