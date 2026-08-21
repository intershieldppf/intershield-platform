import Link from "next/link";
import { notFound } from "next/navigation";

import { CustomKitNotice } from "@/components/CustomKitNotice";
import { LocalCatalogService } from "@/services/catalog/localCatalogService";

type VehiclePageProps = {
  params: {
    brandSlug: string;
    vehicleSlug: string;
  };
};

export default async function VehiclePage({ params }: VehiclePageProps) {
  const service = new LocalCatalogService();
  const brand = await service.findBrandBySlug(params.brandSlug);
  if (!brand) {
    notFound();
  }

  const vehicle = await service.findVehicleBySlug(params.vehicleSlug);
  if (!vehicle) {
    notFound();
  }

  const vehicleModel = await service.findVehicleModelBySlug(vehicle.vehicleModelId);
  if (!vehicleModel) {
    notFound();
  }

  if (vehicleModel.brandId !== brand.id) {
    notFound();
  }

  const products = await service.listProductsByVehicleId(vehicle.id);
  const productsWithTypes = await Promise.all(
    products.map(async (product) => ({
      product,
      productType: await service.findProductTypeById(product.productTypeId),
    }))
  );

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-14 text-slate-950 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.35em] text-sky-600">Veículo</p>
              <h1 className="text-3xl font-semibold text-slate-950">
                {brand.name} {vehicleModel.name}
              </h1>
              <p className="text-sm text-slate-600">
                {vehicle.yearStart} – {vehicle.yearEnd} • {vehicleModel.vehicleType === "car" ? "Carro" : "Motocicleta"}
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-700">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Produtos compatíveis</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{products.length}</p>
            </div>
          </div>

          {vehicle.imageUrl ? (
            <div className="mt-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50">
              <img
                src={vehicle.imageUrl}
                alt={vehicle.imageAlt ?? `${brand.name} ${vehicleModel.name}`}
                className="aspect-[16/9] w-full object-cover"
              />
            </div>
          ) : null}

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Marca</p>
              <p className="mt-3 text-base font-semibold text-slate-950">{brand.name}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Modelo</p>
              <p className="mt-3 text-base font-semibold text-slate-950">{vehicleModel.name}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Ano</p>
              <p className="mt-3 text-base font-semibold text-slate-950">{vehicle.yearStart} – {vehicle.yearEnd}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Tipo de veículo</p>
              <p className="mt-3 text-base font-semibold text-slate-950">
                {vehicleModel.vehicleType === "car" ? "Carro" : "Motocicleta"}
              </p>
            </div>
          </div>
        </div>

        <section className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Produtos disponíveis</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-950">Produtos compatíveis com este veículo</h2>
            </div>
            <Link
              href="/"
              className="text-sm font-semibold text-sky-600 transition hover:text-sky-500"
            >
              Voltar à busca
            </Link>
          </div>

          {productsWithTypes.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2">
              {productsWithTypes.map(({ product, productType }) => (
                <article key={product.id} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:border-sky-300">
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-slate-500">{productType?.name ?? "Categoria"}</p>
                      <h3 className="mt-2 text-xl font-semibold text-slate-950">{product.name}</h3>
                    </div>
                    <p className="text-sm leading-7 text-slate-600">{product.shortDescription}</p>
                  </div>
                  <Link
                    href={`/produto/${product.slug}`}
                    className="mt-6 inline-flex items-center justify-center rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-sky-500"
                  >
                    Ver produto
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <p className="rounded-3xl border border-slate-200 bg-white p-6 text-sm leading-7 text-slate-600">
              Ainda não há um kit publicado para esta seleção.
            </p>
          )}

          <CustomKitNotice
            compact
            context={`${brand.name} ${vehicleModel.name} ${vehicle.yearStart}–${vehicle.yearEnd}`}
          />
        </section>
      </div>
    </main>
  );
}
