"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import type { NavItem } from "@/data/navigation";

type MobileMenuProps = {
  items: NavItem[];
  open: boolean;
  onClose: () => void;
  ctaHref?: string;
};

export function MobileMenu({ items, open, onClose, ctaHref }: MobileMenuProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] flex">
      <button
        type="button"
        aria-label="Fechar menu"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/40 transition-opacity"
      />
      <div
        id="mobile-navigation"
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        className="relative ml-auto flex h-full w-[min(92vw,360px)] flex-col bg-white px-6 py-6 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-950">Menu</p>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Fechar menu"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-950 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="mt-8 flex flex-col gap-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="rounded-2xl px-4 py-4 text-sm font-medium text-slate-950 transition hover:bg-slate-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        {ctaHref ? (
          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="mt-auto inline-flex min-h-12 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            Comprar pelo WhatsApp
          </a>
        ) : null}
      </div>
    </div>
  );
}
