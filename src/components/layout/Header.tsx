import Link from "next/link";

const navItems = [
  { label: "PPF", href: "/#kits" },
  { label: "Black Piano", href: "/#blackpiano" },
  { label: "Como instalar", href: "/#instalar" },
  { label: "Sobre", href: "/#sobre" },
  { label: "Suporte", href: "/#suporte" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] max-w-[1320px] items-center justify-center px-5 sm:px-8">
        <nav className="flex w-full items-center justify-start gap-9 overflow-x-auto whitespace-nowrap text-[13px] font-semibold text-slate-700 sm:justify-center lg:gap-12 xl:gap-16">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative flex h-[68px] items-center transition-colors duration-200 hover:text-blue-600"
            >
              {item.label}

              <span className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-blue-600 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
