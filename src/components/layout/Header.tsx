import Image from "next/image";
import Link from "next/link";

import { PlatformIcon } from "@/components/ui/PlatformIcon";

const navItems = [
  { label: "PPF", href: "/ppf" },
  { label: "Acabamentos para colunas", href: "/black-piano" },
  { label: "Catálogo", href: "/catalogo" },
  { label: "Como instalar", href: "/#instalar" },
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
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] max-w-[1320px] items-center gap-3 px-4 sm:gap-5 sm:px-6 lg:gap-7 lg:px-8">
        <div className="flex w-[48px] shrink-0 justify-start sm:w-[60px]">
          <HomeLogo label="Ir para o início do site" />
        </div>

        <nav className="flex min-w-0 flex-1 items-center justify-start gap-7 overflow-x-auto whitespace-nowrap text-[13px] font-semibold text-slate-700 sm:justify-center lg:gap-9 xl:gap-11">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group relative flex h-[68px] shrink-0 items-center transition-colors duration-200 hover:text-blue-600"
            >
              {item.label}

              <span className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-blue-600 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
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
      </div>
    </header>
  );
}
