import Image from "next/image";
import Link from "next/link";

const navItems = [
  { label: "PPF", href: "/#kits" },
  { label: "Black Piano", href: "/#blackpiano" },
  { label: "Como instalar", href: "/#instalar" },
  { label: "Sobre", href: "/#sobre" },
  { label: "Suporte", href: "/#suporte" },
];

function HomeLogo({ label }: { label: string }) {
  return (
    <Link
      href="/#top"
      aria-label={label}
      className="flex shrink-0 items-center justify-center transition-opacity hover:opacity-75"
    >
      <Image
        src="/intershield-shield-v2.png"
        alt="InterShield Películas"
        width={460}
        height={240}
        priority
        className="h-auto w-[82px] object-contain sm:w-[100px] lg:w-[118px]"
      />
    </Link>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] max-w-[1320px] items-center gap-3 px-3 sm:gap-5 sm:px-6 lg:gap-8 lg:px-8">
        <div className="flex w-[88px] shrink-0 justify-center sm:w-[108px] lg:w-[132px]">
          <HomeLogo label="Ir para o início do site" />
        </div>

        <nav className="flex min-w-0 flex-1 items-center justify-start gap-8 overflow-x-auto whitespace-nowrap text-[13px] font-semibold text-slate-700 sm:justify-center sm:gap-9 lg:gap-12 xl:gap-14">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative flex h-[68px] shrink-0 items-center transition-colors duration-200 hover:text-blue-600"
            >
              {item.label}

              <span className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-blue-600 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex w-[88px] shrink-0 justify-center sm:w-[108px] lg:w-[132px]">
          <HomeLogo label="Voltar ao início do site" />
        </div>
      </div>
    </header>
  );
}
