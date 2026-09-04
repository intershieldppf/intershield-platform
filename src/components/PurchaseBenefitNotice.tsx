import {
  BookOpenCheck,
  Droplets,
  Gift,
  Headset,
  PackageCheck,
  PanelsTopLeft,
  Ruler,
} from "lucide-react";
import Image from "next/image";

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
    title: "Espátula personalizada",
    text: "Modelo oficial da InterShield para auxiliar na aplicação.",
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
  const isPpfManta = kind === "ppf-manta";

  if (compact) {
    return (
      <aside
        aria-label={
          isPpfKit
            ? "Kit completo para aplicação de PPF"
            : isPpfManta
              ? "PPF fotocromático vendido por metragem"
              : "Espátula personalizada grátis"
        }
        className={`rounded-[20px] border border-blue-200 bg-blue-50/70 p-4 ${className}`}
      >
        <div className="flex gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
            {isPpfKit ? (
              <PackageCheck className="h-5 w-5" />
            ) : isPpfManta ? (
              <Ruler className="h-5 w-5" />
            ) : (
              <Gift className="h-5 w-5" />
            )}
          </span>
          <div>
            <p className="text-sm font-bold text-slate-950">
              {isPpfKit
                ? "Você recebe o kit de aplicação completo"
                : isPpfManta
                  ? "Manta fotocromática na metragem escolhida"
                : "Espátula personalizada grátis!"}
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-600">
              {isPpfKit
                ? "PPF pré-cortado, solução deslizante, espátula personalizada, manual ilustrado e suporte especializado."
                : isPpfManta
                  ? "Largura fixa de 30 cm e comprimento de 1 a 10 metros. O material não é pré-cortado."
                : "A espátula oficial da InterShield acompanha o acabamento adesivo para auxiliar na aplicação."}
            </p>
          </div>
        </div>
      </aside>
    );
  }

  if (isPpfManta) {
    return (
      <section
        aria-labelledby="ppf-manta-title"
        className={`overflow-hidden rounded-[30px] border border-blue-200 bg-[linear-gradient(120deg,#eff6ff_0%,#ffffff_60%,#eef2ff_100%)] p-7 shadow-sm sm:p-9 ${className}`}
      >
        <div className="flex gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white">
            <Ruler className="h-6 w-6" />
          </span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-blue-600">
              Venda por metragem
            </p>
            <h2
              id="ppf-manta-title"
              className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl"
            >
              Escolha de 1 a 10 metros
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              A manta possui 30 cm de largura fixa. O comprimento é cortado
              conforme a opção escolhida e o acabamento final é realizado pelo
              instalador diretamente no farol.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!isPpfKit) {
    return (
      <section
        aria-labelledby="adhesive-gift-title"
        className={`overflow-hidden rounded-[30px] border border-blue-200 bg-[linear-gradient(120deg,#eff6ff_0%,#ffffff_60%,#eef2ff_100%)] p-7 shadow-sm sm:p-9 ${className}`}
      >
        <div className="grid gap-7 lg:grid-cols-[128px_1fr_auto] lg:items-center">
          <div className="relative flex h-24 w-32 items-center justify-center overflow-hidden rounded-2xl border border-blue-100 bg-white p-2 shadow-lg shadow-blue-900/10">
            <Image
              src="/espatula-personalizada-intershield.png"
              width={182}
              height={140}
              alt="Espátula personalizada oficial da InterShield"
              className="h-full w-full object-contain"
            />
            <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
              <Gift className="h-4 w-4" />
            </span>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-blue-600">
              Brinde personalizado incluso
            </p>
            <h2 id="adhesive-gift-title" className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Espátula personalizada grátis!
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Você recebe as peças adesivas conforme o anúncio e a espátula
              oficial da InterShield para ajudar no posicionamento, na fixação e
              no acabamento durante a instalação.
            </p>
          </div>
          <span className="w-fit rounded-full border border-blue-200 bg-white px-4 py-2 text-xs font-bold text-blue-700 shadow-sm">
            Vai no seu pedido
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
