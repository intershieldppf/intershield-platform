"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center bg-slate-50 px-6 text-center">
      <p className="text-sm font-bold uppercase tracking-[0.28em] text-blue-600">InterShield</p>
      <h1 className="mt-4 text-3xl font-bold text-slate-950">Não foi possível carregar esta página</h1>
      <p className="mt-3 max-w-lg text-sm leading-7 text-slate-600">Tente novamente. Se o problema continuar, fale com nossa equipe pelo WhatsApp.</p>
      <button type="button" onClick={reset} className="mt-7 h-12 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white hover:bg-blue-500">Tentar novamente</button>
    </main>
  );
}
