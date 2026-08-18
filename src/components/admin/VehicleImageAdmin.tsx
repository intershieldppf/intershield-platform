export function VehicleImageAdmin() {
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-14 text-slate-950 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-sky-600">Administrador</p>
              <h1 className="text-3xl font-semibold text-slate-950">Gestao de imagens dos veiculos</h1>
              <p className="mt-2 text-sm text-slate-600">Uma imagem oficial para cada veiculo do catalogo.</p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.2fr_auto]">
            <label className="grid gap-2 text-sm text-slate-600">
              Buscar marca ou modelo
              <input
                placeholder="BMW, Corolla, HR-V"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/30"
              />
            </label>

            <div className="grid gap-2 sm:grid-cols-3">
              <button type="button" className="rounded-3xl border border-sky-600 bg-sky-600 px-4 py-3 text-sm font-semibold text-white">Todos</button>
              <button type="button" className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">Com imagem</button>
              <button type="button" className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">Sem imagem</button>
              <button type="button" className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">Revisar</button>
              <button type="button" className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">Carros</button>
              <button type="button" className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">Motos</button>
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50">
            <div className="grid gap-0 border-b border-slate-200 bg-slate-100 px-5 py-4 text-sm uppercase tracking-[0.35em] text-slate-500 sm:grid-cols-[80px_1.2fr_1.2fr_0.9fr_0.9fr_1.2fr_1fr]">
              <span>Miniatura</span>
              <span>Marca</span>
              <span>Modelo</span>
              <span>Anos</span>
              <span>Status</span>
              <span>Imagem Oficial</span>
              <span>Acoes</span>
            </div>
            <div className="p-12 text-center text-slate-500">
              Nenhum veiculo disponivel no momento.
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <span>Exibindo pagina</span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-2">1</span>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">Anterior</button>
              <button type="button" className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">Proxima</button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" className="rounded-3xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white">Selecionar imagem</button>
            <button type="button" className="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-rose-700">Remover imagem</button>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Selecionar imagem</p>
              <h2 className="text-2xl font-semibold text-slate-950">Modal vazio</h2>
            </div>
          </div>
          <div className="mt-6 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
            Esta sprint exibe um modal vazio. Nao ha logica de selecao ou conexao com API.
          </div>
        </div>
      </div>
    </div>
  );
}
