import type { ReactNode } from "react";

type SectionBlockProps = {
  id?: string;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function SectionBlock({ id, eyebrow, title, description, children }: SectionBlockProps) {
  return (
    <section id={id} className="space-y-8">
      <div className="max-w-3xl space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-600">{eyebrow}</p>
        <h2 className="text-3xl font-semibold text-slate-950 sm:text-4xl">{title}</h2>
        <p className="max-w-2xl text-sm leading-7 text-slate-600">{description}</p>
      </div>
      {children}
    </section>
  );
}
