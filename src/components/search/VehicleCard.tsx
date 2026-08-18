import { Car } from "lucide-react";
import type { VehicleSearchResult } from "@/services/catalog/catalogService";

type VehicleCardProps = {
  selectedVehicle?: VehicleSearchResult | null;
};

export function VehicleCard({ selectedVehicle }: VehicleCardProps) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_20px_40px_-24px_rgba(15,23,42,0.6)] transition duration-300">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/10 text-sky-400">
          <Car size={24} />
        </div>
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.35em] text-slate-400">Seu veículo</p>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-white">
            {selectedVehicle ? `${selectedVehicle.brand.name} ${selectedVehicle.vehicleModel.name}` : "Nenhum veículo selecionado"}
          </p>
        </div>
      </div>

      {selectedVehicle && selectedVehicle.imageUrl ? (
        <div className="mt-6 overflow-hidden rounded-[1.5rem]">
          <img
            src={selectedVehicle.imageUrl}
            alt={selectedVehicle.imageAlt ?? `${selectedVehicle.brand.name} ${selectedVehicle.vehicleModel.name}`}
            className="h-44 w-full object-cover"
          />
        </div>
      ) : (
        <div className="mt-6 flex h-44 items-center justify-center rounded-[1.5rem] bg-white/10 text-slate-300">
          <span className="text-sm">Imagem oficial não disponível</span>
        </div>
      )}

      {selectedVehicle ? (
        <div className="mt-6 space-y-3 rounded-3xl bg-white/5 px-4 py-4 text-sm text-slate-300">
          <div className="grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.32em] text-slate-400">Marca</p>
              <p className="mt-1 text-base font-semibold text-white">{selectedVehicle.brand.name}</p>
            </div>
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.32em] text-slate-400">Modelo</p>
              <p className="mt-1 text-base font-semibold text-white">{selectedVehicle.vehicleModel.name}</p>
            </div>
          </div>
          <div className="grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.32em] text-slate-400">Ano</p>
              <p className="mt-1 text-base font-semibold text-white">{selectedVehicle.vehicle.yearStart} - {selectedVehicle.vehicle.yearEnd}</p>
            </div>
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.32em] text-slate-400">Tipo de kit</p>
              <p className="mt-1 text-base font-semibold text-white">{selectedVehicle.kitType ?? "-"}</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
