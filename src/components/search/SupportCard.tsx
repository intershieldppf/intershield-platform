import { MessageCircle } from "lucide-react";

export function SupportCard() {
  return (
    <div className="flex min-h-[96px] w-full flex-col justify-between rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 transition duration-300 hover:border-slate-300 hover:bg-slate-100">
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.32em] text-slate-600">Não encontrou seu veículo?</p>
        <h3 className="text-base font-semibold text-slate-950">Possuímos um catálogo com milhares de moldes. Nossa equipe pode confirmar rapidamente a compatibilidade.</h3>
      </div>
      <a
        href="https://wa.me/553197146624"
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex items-center justify-center rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-sky-500"
      >
        <MessageCircle size={18} />
        <span className="ml-2">Falar no WhatsApp</span>
      </a>
    </div>
  );
}
