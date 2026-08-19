"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const whatsappUrl =
  "https://wa.me/5531997146624?text=Ol%C3%A1%21%20Vim%20pelo%20site%20da%20InterShield%20e%20quero%20encontrar%20um%20kit%20para%20o%20meu%20ve%C3%ADculo.";

const navigationLinks = [
  { label: "Início", href: "/" },
  { label: "PPF", href: "/ppf" },
  { label: "Acabamentos para colunas", href: "/black-piano" },
  { label: "Catálogo", href: "/catalogo" },
  { label: "Como instalar", href: "/#instalar" },
  { label: "Quem somos", href: "/#sobre" },
];

const solutionLinks = [
  { label: "PPF Interior", href: "/ppf" },
  { label: "PPF Exterior", href: "/ppf" },
  { label: "Black Piano", href: "/black-piano" },
  { label: "Preto Fosco Poroso", href: "/black-piano" },
  { label: "Fibra de Carbono 4D", href: "/black-piano" },
];

const salesChannels = [
  {
    label: "Mercado Livre",
    href: "https://www.mercadolivre.com.br/pagina/intershieldppf",
  },
  { label: "Shopee", href: "https://shopee.com.br/intershieldppf" },
  {
    label: "TikTok Shop",
    href: "https://www.tiktok.com/@intershieldppf",
  },
];

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.1 9.1 0 0 1-3.8-.9L3 21l1.9-5A8.5 8.5 0 1 1 21 11.5Z" />
      <path d="M8.4 8.3c.3 2.8 2.5 5 5.3 5.3" />
      <path d="M13.9 13.6c.5 0 .9-.2 1.2-.5l.7-.8" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M15.7 3c.3 2.4 1.7 3.9 4.3 4.1v3.1c-1.5.1-2.9-.3-4.2-1.2v6.1c0 4.1-4.5 6.7-8.1 4.7-3.8-2.1-3.1-7.9 1.1-9.1.8-.2 1.6-.3 2.4-.1v3.2c-.4-.1-.8-.1-1.2 0-1.7.4-2.1 2.8-.6 3.6 1.7 1 3.3-.3 3.3-1.9V3h3Z" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function FooterHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-400">
      {children}
    </h2>
  );
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm leading-6 text-slate-400 transition hover:text-white"
    >
      {children}
    </Link>
  );
}

export function SiteFooter() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="mt-auto overflow-hidden bg-[#030816] text-white">
      <div className="border-b border-white/10 bg-blue-600">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-7 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                Loja em evolução
              </span>
              <span className="text-xs font-medium text-blue-100">
                Compra direta em preparação
              </span>
            </div>
            <p className="mt-3 max-w-2xl text-lg font-semibold leading-7 text-white sm:text-xl">
              Consulte o catálogo agora. Em breve, a compra poderá ser concluída
              diretamente no site.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/catalogo"
              className="inline-flex h-12 items-center justify-center gap-3 rounded-xl bg-white px-6 text-sm font-bold text-blue-700 shadow-sm transition hover:bg-blue-50"
            >
              Explorar catálogo
              <ArrowIcon />
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-3 rounded-xl border border-white/25 bg-blue-700 px-6 text-sm font-bold text-white transition hover:bg-blue-800"
            >
              <WhatsAppIcon />
              Comprar pelo WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-10 lg:py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_0.95fr_1.05fr] lg:gap-10">
          <div>
            <Link
              href="/"
              aria-label="Ir para a página inicial da InterShield Películas"
              className="inline-flex rounded-2xl border border-white/10 bg-white/5 px-4 py-2 transition hover:border-blue-500/40"
            >
              <Image
                src="/intershield-shield-v2.png"
                alt="InterShield Películas"
                width={460}
                height={240}
                className="h-auto w-[190px] brightness-0 invert"
              />
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-7 text-slate-400">
              Kits de proteção e acabamento automotivo desenvolvidos com recorte
              específico para cada veículo.
            </p>
            <p className="mt-3 max-w-sm text-sm leading-7 text-slate-500">
              Atendimento para confirmar a compatibilidade antes da compra e
              envio para todo o Brasil.
            </p>

            <div className="mt-6 flex gap-3">
              <a
                href="https://www.instagram.com/intershieldppf/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram da InterShield Películas"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:border-blue-500/50 hover:bg-blue-600 hover:text-white"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://www.tiktok.com/@intershieldppf"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok da InterShield Películas"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:border-blue-500/50 hover:bg-blue-600 hover:text-white"
              >
                <TikTokIcon />
              </a>
            </div>
          </div>

          <div>
            <FooterHeading>Navegação</FooterHeading>
            <nav
              className="mt-6 flex flex-col gap-3"
              aria-label="Navegação do rodapé"
            >
              {navigationLinks.map((link) => (
                <FooterLink key={link.label} href={link.href}>
                  {link.label}
                </FooterLink>
              ))}
            </nav>
          </div>

          <div>
            <FooterHeading>Soluções</FooterHeading>
            <div className="mt-6 flex flex-col gap-3">
              {solutionLinks.map((link) => (
                <FooterLink key={link.label} href={link.href}>
                  {link.label}
                </FooterLink>
              ))}
            </div>

            <div className="mt-9">
              <FooterHeading>Canais oficiais</FooterHeading>
              <div className="mt-5 flex flex-col gap-3">
                {salesChannels.map((channel) => (
                  <a
                    key={channel.label}
                    href={channel.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm leading-6 text-slate-400 transition hover:text-white"
                  >
                    {channel.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div>
            <FooterHeading>Atendimento</FooterHeading>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center gap-3 text-sm font-semibold text-white transition hover:text-blue-400"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#25D366]/15 text-[#42e27e]">
                <WhatsAppIcon />
              </span>
              <span>
                WhatsApp
                <span className="mt-0.5 block text-xs font-normal text-slate-400">
                  (31) 99714-6624
                </span>
              </span>
            </a>

            <div className="mt-5 flex items-center gap-3 text-sm text-slate-400">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-blue-400">
                <LocationIcon />
              </span>
              <span>
                Atendimento online
                <span className="mt-0.5 block text-xs text-slate-500">
                  Igarapé, Minas Gerais
                </span>
              </span>
            </div>

            <div className="mt-7 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-400">
                Compra segura começa pela escolha correta
              </p>
              <p className="mt-3 text-xs leading-6 text-slate-400">
                Antes de comprar, confirme modelo, ano e peça do veículo com a
                nossa equipe.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-6 text-xs text-slate-500 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <p>© 2026 InterShield Películas. Todos os direitos reservados.</p>
          <p>Proteção e acabamento automotivo sob medida.</p>
        </div>
      </div>
    </footer>
  );
}
