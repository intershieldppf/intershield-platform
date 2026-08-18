import type { VehicleSearchResult } from "@/services/catalog/catalogService";

type SearchSuggestionsProps = {
  suggestions: VehicleSearchResult[];
  onSelect: (value: VehicleSearchResult) => void;
};

export function SearchSuggestions({
  suggestions,
  onSelect,
}: SearchSuggestionsProps) {
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="absolute left-0 right-0 top-[62px] z-50 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
      <div className="max-h-[320px] overflow-y-auto py-1">
        {suggestions.slice(0, 5).map((item) => (
          <button
            key={item.vehicle.id}
            type="button"
            onClick={() => onSelect(item)}
            className="
              flex
              w-full
              items-center
              justify-between
              gap-4
              border-b
              border-slate-100
              px-4
              py-3.5
              text-left
              transition
              last:border-b-0
              hover:bg-slate-50
            "
          >
            <div className="min-w-0">
              <p className="truncate text-[14px] font-semibold text-slate-950">
                {item.brand.name} {item.vehicleModel.name}
              </p>

              <p className="mt-0.5 text-[12px] text-slate-500">
                {item.vehicle.yearStart}
                {item.vehicle.yearEnd &&
                item.vehicle.yearEnd !== item.vehicle.yearStart
                  ? ` a ${item.vehicle.yearEnd}`
                  : ""}
              </p>
            </div>

            <span className="shrink-0 text-[12px] font-medium text-slate-400">
              Ver veículo
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}