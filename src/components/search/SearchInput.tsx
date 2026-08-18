type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
};

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
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

export function SearchInput({
  value,
  onChange,
}: SearchInputProps) {
  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
        <SearchIcon />
      </div>

      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Digite marca, modelo e ano. Ex: BMW X3 2024"
        aria-label="Buscar veículo"
        autoComplete="off"
        className="
          h-[54px]
          w-full
          rounded-xl
          border
          border-slate-200
          bg-white
          pl-12
          pr-12
          text-[15px]
          font-medium
          text-slate-950
          shadow-sm
          outline-none
          transition
          placeholder:font-normal
          placeholder:text-slate-400
          focus:border-slate-400
          focus:shadow-md
        "
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Limpar busca"
          className="
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            text-xl
            leading-none
            text-slate-400
            transition
            hover:text-slate-900
          "
        >
          ×
        </button>
      )}
    </div>
  );
}