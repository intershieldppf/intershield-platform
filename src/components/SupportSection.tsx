import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { buildCustomKitWhatsappUrl } from "@/lib/customKitContact";

export function SupportSection() {
  const whatsappUrl = buildCustomKitWhatsappUrl("Atendimento pelo site");

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
            Não encontrou o kit ou quer outra combinação?
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
            Envie a marca, o modelo, o ano e as peças que deseja proteger. Nossa
            equipe consulta o sistema, verifica a combinação disponível e
            encaminha você para a opção correta.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200/90 bg-slate-950 p-6 text-white">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-300">
            Contato
          </p>

          <p className="mt-5 text-2xl font-semibold">(31) 99714-6624</p>

          <p className="mt-2 text-sm text-slate-300">
            Atendimento via WhatsApp para vendas, compatibilidade e suporte.
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-[#25D366] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#20bd5a]"
          >
            <PlatformIcon name="whatsapp" className="h-5 w-5" />
            Consultar meu kit
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
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[radial-gradient(circle_at_30%_110%,#fdf497_0%,#fdf497_5%,#fd5949_45%,#d6249f_60%,#285AEB_90%)] text-white">
                    <PlatformIcon
                      name="instagram"
                      className="h-[18px] w-[18px]"
                    />
                  </span>
                  Instagram
                </span>
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
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black text-white">
                    <PlatformIcon name="tiktok" className="h-[18px] w-[18px]" />
                  </span>
                  TikTok
                </span>
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
