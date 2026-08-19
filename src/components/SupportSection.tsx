export function SupportSection() {
  return (
    <section
      id="suporte"
      className="rounded-[2rem] border border-slate-200/80 bg-white px-6 py-8 shadow-xl shadow-slate-900/5 sm:px-8 lg:px-10"
    >
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-sky-600">
            Atendimento InterShield
          </p>

          <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">
            Escolha o kit certo com ajuda especializada.
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
            Nossa equipe está pronta para ajudar você a escolher o melhor kit,
            confirmar a compatibilidade com seu veículo e esclarecer dúvidas
            sobre instalação e acabamentos.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200/90 bg-slate-950 p-6 text-white">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-300">
            Contato
          </p>

          <p className="mt-5 text-2xl font-semibold">
            (31) 99714-6624
          </p>

          <p className="mt-2 text-sm text-slate-300">
            Atendimento via WhatsApp para vendas, compatibilidade e suporte.
          </p>

          <a
            href="https://wa.me/5531997146624"
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-sky-400"
          >
            Iniciar conversa
          </a>

          <div className="mt-6 border-t border-white/10 pt-5">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
              Redes sociais
            </p>

            <div className="mt-4 flex flex-col gap-3">
              <a
                href="https://www.instagram.com/intershieldpeliculas/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between text-sm text-slate-300 transition hover:text-white"
              >
                <span>Instagram</span>
                <span className="font-semibold text-white">
                  @intershieldpeliculas
                </span>
              </a>

              <a
                href="https://www.tiktok.com/@intershieldppf"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between text-sm text-slate-300 transition hover:text-white"
              >
                <span>TikTok</span>
                <span className="font-semibold text-white">
                  @intershieldppf
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}