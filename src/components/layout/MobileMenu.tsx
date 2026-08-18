"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import type { NavItem } from "@/data/navigation";

type MobileMenuProps = {
  items: NavItem[];
  open: boolean;
  onClose: () => void;
};

export function MobileMenu({ items, open, onClose }: MobileMenuProps) {
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <button
        type="button"
        aria-label="Fechar menu"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/40 transition-opacity"
      />
      <div className="relative ml-auto flex h-full w-[min(92vw,360px)] flex-col bg-white px-6 py-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-950">Menu</p>
          <button
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
      </div>
    </div>
  );
}
