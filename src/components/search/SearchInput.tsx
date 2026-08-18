type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
};

function SearchIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-blue-600">
        <SearchIcon />
      </div>

      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Busque seu veículo ou produto. Ex: BMW X3 2024, multimídia, coluna..."
        aria-label="Buscar veículo ou produto"
        autoComplete="off"
        className="h-[60px] w-full rounded-[18px] border border-slate-200 bg-white pl-14 pr-12 text-[15px] font-medium text-slate-950 shadow-sm outline-none transition-all duration-200 placeholder:font-normal placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Limpar busca"
          className="absolute right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-lg leading-none text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          ×
        </button>
      )}
    </div>
  );
}
