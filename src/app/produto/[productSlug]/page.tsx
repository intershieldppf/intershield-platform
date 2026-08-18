import Link from "next/link";
import { notFound } from "next/navigation";
import { LocalCatalogService } from "@/services/catalog/localCatalogService";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchaseCard } from "@/components/product/ProductPurchaseCard";
import { ProductDescription } from "@/components/product/ProductDescription";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import type { Product } from "@/domain/products/product";
import type { Vehicle } from "@/domain/vehicles/vehicle";
import type { Brand } from "@/domain/brands/brand";
import type { VehicleModel } from "@/domain/vehicle-models/vehicleModel";

type ProductPageProps = {
  params: {
    productSlug: string;
  };
};

export default async function ProductPage({ params }: ProductPageProps) {
  const service = new LocalCatalogService();
  const product = await service.findProductBySlug(params.productSlug);

  if (!product) {
    notFound();
  }

  const productType = await service.findProductTypeById(product.productTypeId);
  if (!productType) {
    notFound();
  }

  const compatibilityVehicles = await service.listVehiclesByProductId(product.id);
  const relatedProducts = (await service.listProducts()).filter(
    (item) => item.productTypeId === product.productTypeId && item.id !== product.id
  );

  const brands = await service.listBrands();
  const vehicleModels = (
    await Promise.all(brands.map((brand) => service.listVehicleModelsByBrand(brand.slug)))
  ).flat();

  const compatibilityItems = compatibilityVehicles.map((vehicle) => {
    const model = vehicleModels.find((item) => item.id === vehicle.vehicleModelId);
    const brand = model ? brands.find((item) => item.id === model.brandId) : null;

    return {
      id: vehicle.id,
      title: `${brand?.name ?? "Veículo"} ${model?.name ?? "Modelo"}`,
      subtitle: `${vehicle.yearStart} – ${vehicle.yearEnd}`,
      versions: vehicle.versions,
    };
  });

  const benefits = [
    "Proteção premium contra riscos e sujeira",
    "Acabamento com brilho sofisticado",
    "Ajuste preciso para o veículo compatível",
  ];

  const packagingContents = [
    "Kit principal InterShield",
    "Manual de instalação",
    "Adesivo de certificação premium",
  ];

  const installationSteps = [
    "Limpe e prepare a superfície do veículo.",
    "Aplique o filme com cuidado e alise bolhas.",
    "Finalize o acabamento e ajuste as bordas.",
  ];

  const notes = [
    "Recomendamos instalação profissional para melhor resultado.",
    "Produto sujeito à disponibilidade de estoque.",
    "Consulte as instruções antes da aplicação.",
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-14 text-slate-950 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <nav className="text-sm text-slate-500">
            <Link href="/" className="font-semibold text-slate-950 hover:text-sky-600">
              Home
            </Link>
            <span className="px-2">›</span>
            <span className="text-slate-500">Veículo</span>
            <span className="px-2">›</span>
            <span className="text-slate-500">Produto</span>
          </nav>

          <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.35em] text-sky-600">Produto</p>
              <h1 className="text-4xl font-semibold text-slate-950">{product.name}</h1>
              <p className="max-w-2xl text-base text-slate-600">{product.shortDescription}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-700">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Categoria</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">{productType.name}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.7fr_0.9fr]">
          <div className="space-y-8">
            <ProductGallery
              name={product.name}
              mainImageUrl={product.mainImageUrl}
              galleryImageUrls={product.galleryImageUrls}
            />

            <ProductDescription
              productTypeName={productType.name}
              fullDescription={product.fullDescription}
              material={product.material}
              finish={product.finish}
              thicknessMicrons={product.thicknessMicrons}
              benefits={benefits}
              packagingContents={packagingContents}
              installationSteps={installationSteps}
              notes={notes}
            />

            <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Compatibilidade</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-950">Veículos compatíveis</h2>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {compatibilityItems.length > 0 ? (
                  compatibilityItems.map((item) => (
                    <div key={item.id} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
                      <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                      <p className="mt-2 text-sm text-slate-600">{item.subtitle}</p>
                      <p className="mt-3 text-sm text-slate-600">Versões: {item.versions.join(", ")}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-600">Nenhum veículo compatível encontrado para este produto.</p>
                )}
              </div>
            </section>
          </div>

          <ProductPurchaseCard
            name={product.name}
            price={product.price}
            compareAtPrice={product.compareAtPrice}
            status={product.status}
          />
        </div>

        <RelatedProducts products={relatedProducts} />
      </div>
    </main>
  );
}
