"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";

import { MobileMenu } from "@/components/layout/MobileMenu";
import { PlatformIcon } from "@/components/ui/PlatformIcon";

const navItems = [
  { label: "PPF", href: "/ppf" },
  { label: "PPF Fotocromático", href: "/ppf-fotocromatico" },
  { label: "Acabamentos para colunas", href: "/black-piano" },
  { label: "Catálogo", href: "/catalogo" },
  { label: "Como instalar", href: "/como-instalar" },
  { label: "Sobre", href: "/#sobre" },
  { label: "Suporte", href: "/#suporte" },
];

const whatsappUrl =
  "https://wa.me/5531997146624?text=Ol%C3%A1%21%20Vim%20pelo%20site%20da%20InterShield%20e%20quero%20encontrar%20a%20prote%C3%A7%C3%A3o%20ideal%20para%20meu%20ve%C3%ADculo.%20Meu%20ve%C3%ADculo%20%C3%A9%3A%20";

function HomeLogo({ label }: { label: string }) {
  return (
    <Link
      href="/#top"
      aria-label={label}
      className="relative flex h-[42px] w-[42px] shrink-0 items-center justify-center overflow-hidden transition-opacity hover:opacity-75"
    >
      <Image
        src="/intershield-shield-v2.png"
        alt="Escudo InterShield"
        width={460}
        height={240}
        priority
        className="pointer-events-none absolute left-1/2 top-[-9px] h-auto w-[126px] max-w-none -translate-x-1/2 object-contain"
      />
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  function isCurrentPage(href: string) {
    if (href === "/catalogo") {
      return (
        pathname === "/catalogo" ||
        pathname.startsWith("/produto/") ||
        pathname.startsWith("/veiculo/")
      );
    }

    return pathname === href;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[60px] max-w-[1320px] items-center gap-2.5 px-4 sm:gap-4 sm:px-6 lg:h-[68px] lg:gap-7 lg:px-8">
        <div className="flex w-[48px] shrink-0 justify-start sm:w-[60px]">
          <HomeLogo label="Ir para o início do site" />
        </div>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-5 whitespace-nowrap text-[12px] font-semibold text-slate-700 lg:flex xl:gap-7 xl:text-[13px]">
          {navItems.map((item) => {
            const current = isCurrentPage(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={`group relative flex h-[68px] shrink-0 items-center transition-colors duration-200 hover:text-blue-600 ${
                  current ? "text-blue-600" : ""
                }`}
              >
                {item.label}

                <span
                  className={`absolute bottom-0 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-blue-600 transition-all duration-300 group-hover:w-full ${
                    current ? "w-full" : "w-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Comprar pelo WhatsApp da InterShield"
          className="hidden h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-[12px] font-semibold text-white transition hover:bg-blue-600 lg:inline-flex"
        >
          <PlatformIcon name="whatsapp" className="h-4 w-4 text-[#25D366]" />
          Comprar pelo WhatsApp
        </a>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Comprar pelo WhatsApp da InterShield"
          className="ml-auto inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-[#17a956] transition hover:border-emerald-300 hover:bg-emerald-100 lg:hidden"
        >
          <PlatformIcon name="whatsapp" className="h-[18px] w-[18px]" />
        </a>

        <button
          type="button"
          aria-label="Abrir menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen(true)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-950 transition hover:border-blue-300 hover:text-blue-600 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <div className="relative border-t border-slate-100 bg-white lg:hidden">
        <nav
          aria-label="Categorias principais"
          className="flex h-[46px] touch-pan-x snap-x snap-mandatory scroll-px-4 scroll-smooth items-center gap-6 overflow-x-auto overscroll-x-contain px-4 pr-12 text-[13px] font-semibold text-slate-600 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {navItems.map((item) => {
            const current = isCurrentPage(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={`relative flex h-full shrink-0 snap-start items-center whitespace-nowrap transition-colors hover:text-blue-600 ${
                  current ? "text-blue-600" : ""
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-blue-600 transition-opacity ${
                    current ? "opacity-100" : "opacity-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white via-white/90 to-transparent"
        />
      </div>
      <MobileMenu
        items={navItems}
        open={menuOpen}
        onClose={closeMenu}
        ctaHref={whatsappUrl}
        currentPath={pathname}
      />
    </header>
  );
}
