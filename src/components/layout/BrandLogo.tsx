import Link from "next/link";

export function BrandLogo() {
  return (
    <Link href="#top" className="inline-flex flex-col items-center gap-1 text-left">
      <span className="text-sm font-semibold uppercase tracking-[0.5em] text-slate-950">
        INTERSHIELD
      </span>
      <span className="text-[0.65rem] uppercase tracking-[0.35em] text-slate-600">
        PELÍCULAS
      </span>
    </Link>
  );
}
