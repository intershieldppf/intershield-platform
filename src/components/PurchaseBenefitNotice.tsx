import {
  BookOpenCheck,
  Droplets,
  Gift,
  Headset,
  PackageCheck,
  PanelsTopLeft,
} from "lucide-react";

import type { PurchaseBenefitKind } from "@/lib/purchaseBenefits";

type PurchaseBenefitNoticeProps = {
  kind: PurchaseBenefitKind;
  compact?: boolean;
  className?: string;
};

const ppfItems = [
  {
    icon: PanelsTopLeft,
    title: "PPF pré-cortado",
    text: "Peças no formato da aplicação anunciada.",
  },
  {
    icon: Droplets,
    title: "Solução deslizante",
    text: "Auxilia no posicionamento durante a aplicação.",
  },
  {
    icon: PackageCheck,
    title: "Espátula de aplicação",
    text: "Ajuda a remover o líquido e acomodar o PPF.",
  },
  {
    icon: BookOpenCheck,
    title: "Manual ilustrado",
    text: "Orientações para preparar e instalar corretamente.",
  },
  {
    icon: Headset,
    title: "Suporte especializado",
    text: "Ajuda da InterShield caso surja alguma dúvida.",
  },
] as const;

export function PurchaseBenefitNotice({
  kind,
  compact = false,
  className = "",
}: PurchaseBenefitNoticeProps) {
  const isPpfKit = kind === "ppf-kit";

  if (compact) {
    return (
      <aside
        aria-label={isPpfKit ? "Kit completo para aplicação de PPF" : "Brinde para aplicação do adesivo"}
        className={`rounded-[20px] border border-blue-200 bg-blue-50/70 p-4 ${className}`}
      >
        <div className="flex gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
            {isPpfKit ? (
              <PackageCheck className="h-5 w-5" />
            ) : (
              <Gift className="h-5 w-5" />
            )}
          </span>
          <div>
            <p className="text-sm font-bold text-slate-950">
              {isPpfKit
                ? "Você recebe o kit de aplicação completo"
                : "Espátula de aplicação de brinde"}
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-600">
              {isPpfKit
                ? "PPF pré-cortado, solução deslizante, espátula, manual ilustrado e suporte especializado."
                : "Além do acabamento adesivo, enviamos uma espátula para auxiliar na aplicação."}
            </p>
          </div>
        </div>
      </aside>
    );
  }

  if (!isPpfKit) {
    return (
      <section
        aria-labelledby="adhesive-gift-title"
        className={`overflow-hidden rounded-[30px] border border-blue-200 bg-[linear-gradient(120deg,#eff6ff_0%,#ffffff_60%,#eef2ff_100%)] p-7 shadow-sm sm:p-9 ${className}`}
      >
        <div className="grid gap-7 lg:grid-cols-[auto_1fr_auto] lg:items-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-900/15">
            <Gift className="h-7 w-7" />
          </span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-blue-600">
              Brinde incluso na compra
            </p>
            <h2 id="adhesive-gift-title" className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Sua espátula de aplicação vai junto com o acabamento
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Você recebe as peças adesivas conforme o anúncio e uma espátula de
              brinde para ajudar no posicionamento, na fixação e no acabamento
              durante a instalação.
            </p>
          </div>
          <span className="w-fit rounded-full border border-blue-200 bg-white px-4 py-2 text-xs font-bold text-blue-700 shadow-sm">
            Espátula grátis
          </span>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="ppf-kit-title"
      className={`overflow-hidden rounded-[32px] border border-slate-800 bg-slate-950 p-7 text-white shadow-[0_28px_80px_-45px_rgba(37,99,235,0.7)] sm:p-9 lg:p-10 ${className}`}
    >
      <div className="max-w-3xl">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-blue-400">
          Mais que a película
        </p>
        <h2 id="ppf-kit-title" className="mt-3 text-3xl font-bold tracking-tight sm:text-[42px]">
          Seu PPF chega como um kit completo de aplicação
        </h2>
        <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-[15px]">
          Reunimos os itens que ajudam na preparação, no posicionamento e no
          acabamento, além do suporte necessário caso apareça alguma dúvida.
        </p>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {ppfItems.map((item) => {
          const ItemIcon = item.icon;

          return (
            <article key={item.title} className="rounded-[20px] border border-white/10 bg-white/[0.055] p-5">
              <ItemIcon className="h-5 w-5 text-blue-400" />
              <h3 className="mt-4 text-sm font-bold text-white">{item.title}</h3>
              <p className="mt-2 text-xs leading-5 text-slate-400">{item.text}</p>
            </article>
          );
        })}
      </div>

      <p className="mt-6 border-l-2 border-blue-500 pl-4 text-xs leading-6 text-slate-400">
        O kit facilita a aplicação, mas o resultado também depende da preparação
        da superfície e da técnica utilizada. Para o melhor acabamento,
        recomendamos instalação profissional.
      </p>
    </section>
  );
}
