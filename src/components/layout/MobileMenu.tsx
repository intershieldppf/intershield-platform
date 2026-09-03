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
  currentPath: string;
};

export function MobileMenu({
  items,
  open,
  onClose,
  ctaHref,
  currentPath,
}: MobileMenuProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const originalOverflow = document.body.style.overflow;
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleDialogKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();

      if (event.key === "Tab") {
        const focusable = Array.from(
          dialogRef.current?.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled])',
          ) ?? [],
        );

        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleDialogKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleDialogKeyDown);
      previouslyFocusedRef.current?.focus();
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
        ref={dialogRef}
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
          {items.map((item) => {
            const current =
              currentPath === item.href ||
              (item.href === "/catalogo" &&
                (currentPath.startsWith("/produto/") ||
                  currentPath.startsWith("/veiculo/")));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                aria-current={current ? "page" : undefined}
                className={`rounded-2xl px-4 py-4 text-sm font-medium transition hover:bg-slate-100 ${
                  current ? "bg-blue-50 text-blue-700" : "text-slate-950"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
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
