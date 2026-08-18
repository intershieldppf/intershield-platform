import type { ButtonHTMLAttributes, ReactNode } from "react";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  children: ReactNode;
};

export function IconButton({ label, children, className = "", ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={
        "inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-950 transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500/40 " +
        className
      }
      {...props}
    >
      {children}
    </button>
  );
}
