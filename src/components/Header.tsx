"use client";

import Link from "next/link";
import { useState } from "react";

const navItems = [
  { label: "Kits para veículos", href: "#kits" },
  { label: "Motos", href: "#motos" },
  { label: "Black Piano", href: "#blackpiano" },
  { label: "Como instalar", href: "#instalar" },
  { label: "Sobre", href: "#sobre" },
];

function UserIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="9" cy="20" r="1" />
      <circle cx="19" cy="20" r="1" />
      <path d="M3 4h2l2.3 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.6L21 8H6" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <div className="relative h-5 w-6">
      <span
        className={`absolute left-0 top-1 block h-[1.5px] w-6 bg-current transition ${
          open ? "translate-y-[6px] rotate-45" : ""
        }`}
      />
      <span
        className={`absolute left-0 top-[10px] block h-[1.5px] w-6 bg-current transition ${
          open ? "opacity-0" : ""
        }`}
      />
      <span
        className={`absolute left-0 top-[16px] block h-[1.5px] w-6 bg-current transition ${
          open ? "-translate-y-[6px] -rotate-45" : ""
        }`}
      />
    </div>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/[0.06] bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center px-5 sm:px-8 lg:px-12">
        {/* MARCA */}
        <Link
          href="/"
          className="group flex min-w-max items-center gap-3"
          aria-label="InterShield Películas"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-[11px] bg-black text-[12px] font-black tracking-[-0.08em] text-white transition-transform duration-300 group-hover:scale-[1.03]">
            IS
          </div>

          <div className="leading-none">
            <div className="text-[16px] font-black uppercase tracking-[0.22em] text-black sm:text-[17px]">
              InterShield
            </div>

            <div className="mt-[5px] text-[8px] font-semibold uppercase tracking-[0.48em] text-slate-500">
              Películas
            </div>
          </div>
        </Link>

        {/* MENU DESKTOP */}
        <nav className="ml-auto hidden items-center gap-7 lg:flex xl:gap-9">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative whitespace-nowrap py-2 text-[13px] font-semibold text-slate-700 transition-colors duration-200 hover:text-black"
            >
              {item.label}

              <span className="absolute bottom-0 left-0 h-[2px] w-0 rounded-full bg-sky-500 transition-all duration-300 hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* AÇÕES */}
        <div className="ml-auto flex items-center gap-2 lg:ml-8">
          <Link
            href="#suporte"
            className="mr-1 hidden rounded-full border border-slate-200 px-5 py-2.5 text-[12px] font-bold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50 xl:inline-flex"
          >
            Suporte
          </Link>

          <button
            type="button"
            aria-label="Minha conta"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-900 transition hover:border-slate-300 hover:bg-slate-50 sm:flex"
          >
            <UserIcon />
          </button>

          <button
            type="button"
            aria-label="Carrinho"
            className="relative hidden h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-900 transition hover:border-slate-300 hover:bg-slate-50 sm:flex"
          >
            <CartIcon />

            <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-sky-500 px-1 text-[9px] font-bold text-white">
              0
            </span>
          </button>

          <button
            type="button"
            aria-label="Abrir menu"
            onClick={() => setMobileOpen((value) => !value)}
            className="ml-1 flex h-10 w-10 items-center justify-center text-black lg:hidden"
          >
            <MenuIcon open={mobileOpen} />
          </button>
        </div>
      </div>

      {/* MENU MOBILE */}
      <div
        className={`overflow-hidden border-t border-slate-100 bg-white transition-all duration-300 lg:hidden ${
          mobileOpen
            ? "max-h-[460px] opacity-100"
            : "max-h-0 border-t-transparent opacity-0"
        }`}
      >
        <nav className="mx-auto flex max-w-[1440px] flex-col px-5 py-4 sm:px-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="border-b border-slate-100 py-4 text-[14px] font-semibold text-slate-900 last:border-0"
            >
              {item.label}
            </Link>
          ))}

          <Link
            href="#suporte"
            onClick={() => setMobileOpen(false)}
            className="mt-4 flex h-12 items-center justify-center rounded-xl bg-black text-[13px] font-bold text-white"
          >
            Falar com a InterShield
          </Link>
        </nav>
      </div>
    </header>
  );
}