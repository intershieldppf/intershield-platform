import { Layers3, MessageCircle, SearchCheck } from "lucide-react";

import { buildCustomKitWhatsappUrl } from "@/lib/customKitContact";

type CustomKitNoticeProps = {
  context?: string;
  compact?: boolean;
  className?: string;
};

export function CustomKitNotice({
  context,
  compact = false,
  className = "",
}: CustomKitNoticeProps) {
  const whatsappUrl = buildCustomKitWhatsappUrl(context);

  if (compact) {
    return (
      <aside
        aria-label="Consulta personalizada de kits"
        className={`rounded-[22px] border border-blue-200 bg-blue-50/70 p-5 ${className}`}
      >
        <div className="flex gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Layers3 className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-base font-bold text-slate-950">
              Quer outra combinação de peças?
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Informe seu veículo e as áreas que deseja proteger. Consultamos
              nosso sistema e verificamos a combinação disponível para você.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-blue-700 transition hover:text-blue-500"
            >
              <MessageCircle className="h-4 w-4" />
              Consultar minha combinação
            </a>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside
      aria-label="Consulta personalizada de kits"
      className={`overflow-hidden rounded-[26px] border border-blue-200 bg-[linear-gradient(135deg,#eff6ff_0%,#ffffff_58%,#eef2ff_100%)] p-6 shadow-sm sm:p-8 ${className}`}
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="flex gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-900/15">
            <SearchCheck className="h-6 w-6" />
          </span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-700">
              Consulta personalizada
            </p>
            <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
              Não encontrou o kit ou a combinação de peças que procura?
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
              Envie a marca, o modelo, o ano e as áreas que deseja proteger. A
              InterShield consulta o sistema, verifica a combinação disponível
              e orienta você até o produto correto.
            </p>
          </div>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-500"
        >
          <MessageCircle className="h-5 w-5" />
          Consultar minha combinação
        </a>
      </div>
    </aside>
  );
}
