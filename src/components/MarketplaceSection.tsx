import Link from "next/link";
import type { ReactNode } from "react";

import {
  PlatformIcon,
  type PlatformIconName,
} from "@/components/ui/PlatformIcon";

type ChannelIconType = Exclude<PlatformIconName, "instagram" | "youtube">;
type ActionTone = "blue" | "whatsapp" | "dark";

const whatsappUrl =
  "https://wa.me/5531997146624?text=Ol%C3%A1%21%20Vim%20pelo%20site%20da%20InterShield%20e%20quero%20encontrar%20um%20kit%20para%20o%20meu%20ve%C3%ADculo.";

const directChannels = [
  {
    name: "Catálogo InterShield",
    label: "Comece por aqui",
    description:
      "Pesquise por marca, modelo, ano ou peça e encontre os kits desenvolvidos para o seu veículo.",
    features: ["Busca por veículo", "Kits compatíveis"],
    href: "/catalogo",
    action: "Explorar o catálogo",
    icon: "catalog",
    external: false,
    tone: "blue",
  },
  {
    name: "Atendimento pelo WhatsApp",
    label: "Atendimento direto",
    description:
      "Confirme a compatibilidade, tire dúvidas e receba orientação antes de concluir seu pedido.",
    features: ["Atendimento humano", "Compra orientada"],
    href: whatsappUrl,
    action: "Falar com a InterShield",
    icon: "whatsapp",
    external: true,
    tone: "whatsapp",
  },
] as const;

const marketplaces = [
  {
    name: "Mercado Livre",
    description:
      "Kits PPF e acabamentos disponíveis na loja oficial da InterShield.",
    href: "https://www.mercadolivre.com.br/pagina/intershieldppf",
    action: "Acessar loja",
    icon: "mercado-livre",
  },
  {
    name: "Shopee",
    description:
      "Confira os produtos disponíveis e escolha uma opção para seu veículo.",
    href: "https://shopee.com.br/intershieldppf",
    action: "Acessar loja",
    icon: "shopee",
  },
  {
    name: "TikTok Shop",
    description:
      "Veja produtos, demonstrações e conteúdos de proteção automotiva.",
    href: "https://www.tiktok.com/@intershieldppf",
    action: "Acessar perfil",
    icon: "tiktok",
  },
] as const;

function IconBox({
  type,
  compact = false,
}: {
  type: ChannelIconType;
  compact?: boolean;
}) {
  const styles: Record<ChannelIconType, string> = {
    catalog: "bg-blue-600 text-white shadow-blue-950/25",
    whatsapp: "bg-[#25D366] text-white shadow-emerald-900/20",
    "mercado-livre": "bg-[#FFE600] text-[#2D3277] shadow-yellow-900/15",
    shopee: "bg-[#EE4D2D] text-white shadow-orange-900/15",
    tiktok: "bg-slate-950 text-white shadow-slate-950/20",
  };

  return (
    <div
      className={`flex shrink-0 items-center justify-center shadow-lg ${styles[type]} ${
        compact
          ? "h-12 w-12 rounded-2xl"
          : "h-14 w-14 rounded-[18px] sm:h-16 sm:w-16 sm:rounded-[20px]"
      }`}
    >
      <PlatformIcon
        name={type}
        className={
          type === "mercado-livre"
            ? compact
              ? "h-7 w-9"
              : "h-9 w-12"
            : compact
              ? "h-6 w-6"
              : "h-8 w-8"
        }
      />
    </div>
  );
}

function ChannelAction({
  href,
  external,
  tone,
  children,
}: {
  href: string;
  external: boolean;
  tone: ActionTone;
  children: ReactNode;
}) {
  const tones: Record<ActionTone, string> = {
    blue: "bg-blue-600 text-white shadow-blue-950/20 hover:bg-blue-500",
    whatsapp:
      "bg-[#159f50] text-white shadow-emerald-950/15 hover:bg-[#128c46]",
    dark: "bg-slate-950 text-white shadow-slate-950/15 hover:bg-blue-600",
  };
  const className = `mt-6 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-xl px-5 text-sm font-bold shadow-lg transition duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300/40 ${tones[tone]}`;

  const content = (
    <>
      {children}
      <span
        aria-hidden="true"
        className="text-lg transition-transform duration-300 group-hover:translate-x-1"
      >
        →
      </span>
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}

export function MarketplaceSection() {
  return (
    <section
      id="marketplaces"
      className="scroll-mt-32 lg:scroll-mt-24"
      aria-labelledby="marketplaces-title"
    >
      <div className="mb-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-10">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-600">
            Onde comprar
          </p>
          <h2
            id="marketplaces-title"
            className="mt-3 text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-[38px]"
          >
            Escolha como comprar seu kit InterShield
          </h2>
        </div>
        <p className="max-w-lg text-base leading-7 text-slate-600 lg:justify-self-end">
          Encontre seu kit no catálogo, fale com a nossa equipe ou compre pelos
          canais oficiais da InterShield.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
        {directChannels.map((channel) => {
          const isCatalog = channel.icon === "catalog";

          return (
            <article
              key={channel.name}
              className={`group relative flex h-full flex-col overflow-hidden rounded-[26px] border p-6 shadow-[0_24px_70px_-46px_rgba(15,23,42,0.48)] transition duration-300 hover:-translate-y-1 sm:p-8 ${
                isCatalog
                  ? "border-blue-500/25 bg-[linear-gradient(135deg,#020817_0%,#07152e_100%)] text-white"
                  : "border-emerald-200 bg-[linear-gradient(135deg,#ffffff_0%,#f2fff8_100%)] text-slate-950"
              }`}
            >
              <div
                aria-hidden="true"
                className={`absolute -right-16 -top-20 h-56 w-56 rounded-full border ${
                  isCatalog ? "border-blue-400/20" : "border-emerald-200/70"
                }`}
              />
              <div
                aria-hidden="true"
                className={`absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent to-transparent ${
                  isCatalog ? "via-blue-400/70" : "via-emerald-400/60"
                }`}
              />

              <div className="relative flex h-full flex-col">
                <div className="flex items-start justify-between gap-4">
                  <IconBox type={channel.icon} />
                  <span
                    className={`rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] ${
                      isCatalog
                        ? "border-blue-400/25 bg-blue-500/10 text-blue-300"
                        : "border-emerald-200 bg-white/90 text-emerald-700"
                    }`}
                  >
                    {channel.label}
                  </span>
                </div>

                <h3
                  className={`mt-6 text-2xl font-bold tracking-tight ${
                    isCatalog ? "text-white" : "text-slate-950"
                  }`}
                >
                  {channel.name}
                </h3>
                <p
                  className={`mt-3 max-w-[540px] text-base leading-7 ${
                    isCatalog ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  {channel.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {channel.features.map((feature) => (
                    <span
                      key={feature}
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                        isCatalog
                          ? "border border-white/10 bg-white/[0.06] text-slate-200"
                          : "border border-emerald-100 bg-white text-emerald-800"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`h-1.5 w-1.5 rounded-full ${
                          isCatalog ? "bg-blue-400" : "bg-emerald-500"
                        }`}
                      />
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="mt-auto">
                  <ChannelAction
                    href={channel.href}
                    external={channel.external}
                    tone={channel.tone}
                  >
                    {channel.action}
                  </ChannelAction>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-9 flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-200" />
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
          Também estamos nos marketplaces
        </p>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {marketplaces.map((marketplace) => (
          <article
            key={marketplace.name}
            className="group relative flex h-full flex-col overflow-hidden rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-900/10 sm:p-6"
          >
            <div className="absolute left-0 top-0 h-[3px] w-0 bg-blue-600 transition-all duration-500 group-hover:w-full" />

            <div className="flex items-center gap-4">
              <IconBox type={marketplace.icon} compact />
              <h3 className="text-xl font-bold tracking-tight text-slate-950">
                {marketplace.name}
              </h3>
            </div>

            <p className="mt-4 flex-1 text-sm leading-6 text-slate-600">
              {marketplace.description}
            </p>

            <ChannelAction
              href={marketplace.href}
              external
              tone="dark"
            >
              {marketplace.action}
            </ChannelAction>
          </article>
        ))}
      </div>

      <div className="mt-6 rounded-[20px] border border-blue-100 bg-blue-50/60 px-5 py-4 text-center">
        <p className="text-sm leading-6 text-slate-600">
          Você será direcionado somente para canais oficiais da{" "}
          <span className="font-semibold text-slate-950">
            InterShield Películas.
          </span>
        </p>
      </div>
    </section>
  );
}
