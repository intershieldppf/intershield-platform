import Link from "next/link";
import type { ReactNode } from "react";

import {
  PlatformIcon,
  type PlatformIconName,
} from "@/components/ui/PlatformIcon";

type ChannelIconType = Exclude<PlatformIconName, "instagram">;

const whatsappUrl =
  "https://wa.me/5531997146624?text=Ol%C3%A1%21%20Vim%20pelo%20site%20da%20InterShield%20e%20quero%20encontrar%20um%20kit%20para%20o%20meu%20ve%C3%ADculo.";

const directChannels = [
  {
    name: "Catálogo InterShield",
    label: "Compra pelo site",
    description:
      "Pesquise por marca, modelo, ano ou peça e encontre os kits compatíveis disponíveis no catálogo da InterShield.",
    href: "/catalogo",
    action: "Acessar o catálogo",
    icon: "catalog",
    external: false,
  },
  {
    name: "Compre pelo WhatsApp",
    label: "Atendimento direto",
    description:
      "Fale com a nossa equipe para confirmar a compatibilidade, tirar dúvidas e escolher o acabamento mais adequado.",
    href: whatsappUrl,
    action: "Comprar pelo WhatsApp",
    icon: "whatsapp",
    external: true,
  },
] as const;

const marketplaces = [
  {
    name: "Mercado Livre",
    description:
      "Encontre nossos kits PPF e acabamentos automotivos disponíveis na loja oficial da InterShield.",
    href: "https://www.mercadolivre.com.br/pagina/intershieldppf",
    action: "Acessar Mercado Livre",
    icon: "mercado-livre",
  },
  {
    name: "Shopee",
    description:
      "Confira os produtos disponíveis e escolha a proteção compatível com o seu veículo.",
    href: "https://shopee.com.br/intershieldppf",
    action: "Acessar Shopee",
    icon: "shopee",
  },
  {
    name: "TikTok Shop",
    description:
      "Conheça nossos produtos, demonstrações e conteúdos de proteção automotiva no TikTok.",
    href: "https://www.tiktok.com/@intershieldppf",
    action: "Acessar TikTok",
    icon: "tiktok",
  },
] as const;

function IconBox({ type }: { type: ChannelIconType }) {
  const styles: Record<ChannelIconType, string> = {
    catalog: "bg-blue-600 text-white",
    whatsapp: "bg-[#25D366] text-white",
    "mercado-livre": "bg-[#FFE600] text-[#2D3277]",
    shopee: "bg-[#EE4D2D] text-white",
    tiktok: "bg-slate-950 text-white",
  };

  return (
    <div
      className={`flex h-16 w-16 items-center justify-center rounded-[20px] shadow-sm ${styles[type]}`}
    >
      <PlatformIcon
        name={type}
        className={type === "mercado-livre" ? "h-9 w-12" : "h-8 w-8"}
      />
    </div>
  );
}

function ChannelAction({
  href,
  external,
  children,
}: {
  href: string;
  external: boolean;
  children: ReactNode;
}) {
  const className =
    "mt-7 inline-flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-blue-600 px-5 text-[13px] font-bold text-white shadow-sm transition hover:bg-blue-500";

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
        <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
      <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
        →
      </span>
    </Link>
  );
}

export function MarketplaceSection() {
  return (
    <section
      id="marketplaces"
      className="scroll-mt-24"
      aria-labelledby="marketplaces-title"
    >
      <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-blue-600">
            Onde comprar
          </p>
          <h2
            id="marketplaces-title"
            className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-[38px]"
          >
            Escolha como comprar seu kit InterShield
          </h2>
        </div>
        <p className="max-w-md text-sm leading-7 text-slate-500">
          Compre diretamente conosco ou escolha uma de nossas lojas nos
          principais marketplaces.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {directChannels.map((channel) => (
          <article
            key={channel.name}
            className="group relative overflow-hidden rounded-[30px] border border-blue-100 bg-[linear-gradient(135deg,#ffffff_0%,#f5f9ff_100%)] p-7 shadow-[0_24px_70px_-45px_rgba(37,99,235,0.55)] sm:p-8"
          >
            <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full border border-blue-200/50" />
            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <IconBox type={channel.icon} />
                <span className="rounded-full border border-blue-100 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600">
                  {channel.label}
                </span>
              </div>
              <h3 className="mt-7 text-2xl font-bold tracking-tight text-slate-950">
                {channel.name}
              </h3>
              <p className="mt-4 max-w-[520px] text-sm leading-7 text-slate-600">
                {channel.description}
              </p>
              <ChannelAction href={channel.href} external={channel.external}>
                {channel.action}
              </ChannelAction>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10 flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-200" />
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
          Marketplaces oficiais
        </p>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <div className="mt-7 grid gap-5 lg:grid-cols-3">
        {marketplaces.map((marketplace) => (
          <article
            key={marketplace.name}
            className="group relative flex h-full flex-col overflow-hidden rounded-[26px] border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-900/10 sm:p-8"
          >
            <div className="absolute left-0 top-0 h-[3px] w-0 bg-blue-600 transition-all duration-500 group-hover:w-full" />
            <IconBox type={marketplace.icon} />
            <h3 className="mt-7 text-2xl font-bold tracking-tight text-slate-950">
              {marketplace.name}
            </h3>
            <p className="mt-4 flex-1 text-sm leading-7 text-slate-600">
              {marketplace.description}
            </p>
            <ChannelAction href={marketplace.href} external>
              {marketplace.action}
            </ChannelAction>
          </article>
        ))}
      </div>

      <div className="mt-6 rounded-[22px] border border-blue-100 bg-blue-50/60 px-6 py-5 text-center">
        <p className="text-sm leading-6 text-slate-600">
          Todos os links direcionam para canais oficiais da{" "}
          <span className="font-semibold text-slate-950">
            InterShield Películas.
          </span>
        </p>
      </div>
    </section>
  );
}
