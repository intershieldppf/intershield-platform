type CategoryCardProps = {
  title: string;
  description: string;
};

export function CategoryCard({ title, description }: CategoryCardProps) {
  return (
    <article className="rounded-3xl border border-slate-200/80 bg-slate-50 p-6 transition hover:-translate-y-1 hover:border-slate-300 hover:bg-white md:p-7">
      <h3 className="text-base font-semibold uppercase tracking-[0.26em] text-sky-700">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
    </article>
  );
}
