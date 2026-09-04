import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  ChevronLeft,
  PackageCheck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { CustomKitNotice } from "@/components/CustomKitNotice";
import { PurchaseBenefitNotice } from "@/components/PurchaseBenefitNotice";
import { ProductCheckoutActions } from "@/components/product/ProductCheckoutActions";
import { ProductGallery } from "@/components/product/ProductGallery";
import { Header } from "@/components/layout/Header";
import {
  findStorefrontProductBySlug,
  storefrontCatalog,
  storefrontProductSlug,
} from "@/data/storefront/catalog";
import { buildStorefrontProductDetails } from "@/data/storefront/productDetails";
import { getMarketplaceProductSource } from "@/data/storefront/marketplaceProductData.server";
import {
  addStandardBenefitImage,
  getPurchaseBenefitKind,
} from "@/lib/purchaseBenefits";

const WHATSAPP_NUMBER = "5531997146624";

type ProductPageProps = {
  params: Promise<{
    productSlug: string;
  }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { productSlug } = await params;
  const product = findStorefrontProductBySlug(productSlug);

  if (!product) return {};

  const canonical = `/produto/${storefrontProductSlug(product)}`;
  const description = `${product.title}. Consulte compatibilidade e compre com suporte da InterShield Películas.`;

  return {
    title: product.title,
    description,
    alternates: { canonical },
    openGraph: {
      title: product.title,
      description,
      url: canonical,
      images: [{ url: product.image, alt: product.title }],
      type: "website",
    },
  };
}

function formatPrice(price: number | null) {
  if (price === null) return "Consulte";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productSlug } = await params;
  const product = findStorefrontProductBySlug(productSlug);

  if (!product) {
    notFound();
  }

  const marketplaceSource = await getMarketplaceProductSource(product.id);
  const details = buildStorefrontProductDetails(product, marketplaceSource);
  const sourceImages = details.gallery.length ? details.gallery : [product.image];
  const images = addStandardBenefitImage(product, sourceImages);
  const compatibility = details.compatibility;
  const purchaseBenefitKind = getPurchaseBenefitKind(product);
  const isPpfKit = purchaseBenefitKind === "ppf-kit";
  const isPpfManta = purchaseBenefitKind === "ppf-manta";

  const checkoutEnabled =
    process.env.CHECKOUT_ENABLED === "true" &&
    Boolean(process.env.MELHOR_ENVIO_TOKEN);
  const onlinePurchaseEnabled =
    (process.env.PAYMENTS_ENABLED === "true" &&
      Boolean(process.env.MERCADO_PAGO_ACCESS_TOKEN) &&
      Boolean(process.env.MERCADO_PAGO_WEBHOOK_SECRET) &&
      Boolean(process.env.SUPABASE_URL) &&
      Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)) ||
    process.env.VERCEL_ENV === "preview";

  const relatedProducts = storefrontCatalog
    .filter(
      (item) =>
        item.id !== product.id &&
        ((product.brand && item.brand === product.brand) || item.type === product.type),
    )
    .map((item) => ({
      item,
      score:
        (product.brand && item.brand === product.brand ? 100 : 0) +
        item.tags.filter((tag) => product.tags.includes(tag)).length * 10 +
        (item.type === product.type ? 5 : 0),
    }))
    .sort(
      (a, b) =>
        b.score - a.score || a.item.displayOrder - b.item.displayOrder,
    )
    .map(({ item }) => item)
    .slice(0, 4);

  const canonicalUrl = `https://www.intershield.com.br/produto/${storefrontProductSlug(product)}`;
  const structuredDescription = `${product.title}. Consulte compatibilidade e compre com suporte da InterShield Películas.`;
  const structuredOffers = product.variantOptions.length
    ? product.variantOptions.map((variant) => ({
        "@type": "Offer",
        name: variant.value,
        sku: variant.sku,
        priceCurrency: "BRL",
        price: variant.price,
        url: canonicalUrl,
        seller: { "@type": "Organization", name: "InterShield Películas" },
      }))
    : product.price !== null
      ? {
          "@type": "Offer",
          priceCurrency: "BRL",
          price: product.price,
          url: canonicalUrl,
          seller: { "@type": "Organization", name: "InterShield Películas" },
        }
      : undefined;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: product.title,
        description: structuredDescription,
        image: images.map((image) => image.startsWith("http") ? image : `https://www.intershield.com.br${image}`),
        sku: product.sku ?? product.id,
        category: product.type,
        brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
        url: canonicalUrl,
        offers: structuredOffers,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: "https://www.intershield.com.br/" },
          { "@type": "ListItem", position: 2, name: "Catálogo", item: "https://www.intershield.com.br/catalogo" },
          { "@type": "ListItem", position: 3, name: product.title, item: canonicalUrl },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <Header />
      <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-8">
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-blue-600"
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar ao catálogo
          </Link>
          <span className="hidden text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 sm:block">
            InterShield Películas
          </span>
        </div>
      </div>

      <section className="px-4 py-6 sm:px-8 lg:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12">
            <ProductGallery
              key={product.id}
              name={product.title}
              images={images}
              video={
                product.id === "IS-PPF-FOTO-CAM-030"
                  ? {
                      src: "/videos/ppf-fotocromatico-tecnologia.mp4",
                      poster: "/ppf-fotocromatico-video-poster.webp",
                      label: "Demonstração do efeito do PPF fotocromático sob a luz",
                      position: 2,
                    }
                  : undefined
              }
            />

            <div className="lg:pt-2">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-blue-700">
                  {product.type}
                </span>
                {product.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-semibold text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="mt-5 text-2xl font-bold leading-tight tracking-tight text-slate-950 sm:text-3xl lg:text-[38px]">
                {product.title}
              </h1>

              <p className="mt-3 text-sm font-medium text-slate-500">{compatibility}</p>

              <ProductCheckoutActions
                productId={product.id}
                productTitle={product.title}
                sku={product.sku ?? product.id}
                compatibility={compatibility}
                variants={product.variantValues}
                variantOptions={product.variantOptions}
                price={product.price}
                benefitNotice={
                  <PurchaseBenefitNotice
                    compact
                    kind={purchaseBenefitKind}
                    className="mt-6"
                  />
                }
                whatsappNumber={WHATSAPP_NUMBER}
                checkoutEnabled={checkoutEnabled}
                onlinePurchaseEnabled={onlinePurchaseEnabled}
              />

              <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <ShieldCheck className="h-5 w-5 text-blue-600" />
                  <p className="mt-2 text-xs font-semibold text-slate-800">Compra com suporte</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <PackageCheck className="h-5 w-5 text-blue-600" />
                  <p className="mt-2 text-xs font-semibold text-slate-800">
                    {isPpfKit
                      ? "Kit de aplicação completo"
                      : isPpfManta
                        ? "Manta na medida escolhida"
                        : "Espátula de brinde"}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  <p className="mt-2 text-xs font-semibold text-slate-800">Acabamento automotivo</p>
                </div>
              </div>

              {!isPpfManta ? (
                <CustomKitNotice
                  compact
                  context={`${product.title} · ${compatibility}`}
                  className="mt-4"
                />
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 px-4 py-10 sm:px-8 lg:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-blue-600">
                Sobre este produto
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
                Informações específicas do anúncio
              </h2>

              <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
                {details.intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-bold text-slate-950">Benefícios</h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {details.benefits.map((benefit) => (
                    <div key={benefit} className="flex gap-2.5 text-sm leading-6 text-slate-700">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">
                  {isPpfKit
                    ? "Kit completo incluso"
                    : isPpfManta
                      ? "Venda por metragem"
                      : "Brinde incluso"}
                </p>
                <h2 className="mt-2 text-xl font-bold text-slate-950">
                  {isPpfKit
                    ? "O que acompanha seu kit PPF"
                    : isPpfManta
                      ? "O que acompanha seu pedido"
                      : "O que acompanha seu acabamento"}
                </h2>
                <div className="mt-5 space-y-3">
                  {details.kitContents.map((item) => (
                    <div key={item} className="flex gap-2.5 text-sm leading-6 text-slate-700">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[26px] bg-slate-950 p-6 text-white shadow-sm sm:p-8">
                <h2 className="text-xl font-bold">Informações técnicas</h2>
                <dl className="mt-5 space-y-4 text-sm">
                  <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                    <dt className="text-slate-400">Compatibilidade</dt>
                    <dd className="text-right font-semibold">{details.compatibility}</dd>
                  </div>
                  {details.material ? (
                    <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                      <dt className="text-slate-400">Material</dt>
                      <dd className="text-right font-semibold">{details.material}</dd>
                    </div>
                  ) : null}
                  {details.thickness ? (
                    <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                      <dt className="text-slate-400">Espessura</dt>
                      <dd className="text-right font-semibold">{details.thickness}</dd>
                    </div>
                  ) : null}
                  {details.warranty ? (
                    <div className="flex justify-between gap-4">
                      <dt className="text-slate-400">Garantia</dt>
                      <dd className="text-right font-semibold">{details.warranty}</dd>
                    </div>
                  ) : null}
                </dl>
              </div>
            </div>

            <div className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:col-span-2">
              <h2 className="text-xl font-bold text-slate-950">Instalação</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {details.installation.map((step, index) => (
                  <div key={`${step}-${index}`} className="rounded-2xl bg-slate-50 p-4">
                    <span className="text-xs font-bold text-blue-600">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {details.fullDescription ? (
              <div className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:col-span-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-xl font-bold text-slate-950">Descrição completa</h2>
                  <span className="rounded-full bg-blue-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-blue-700">
                    Dados do anúncio
                  </span>
                </div>
                <div className="mt-5 whitespace-pre-line text-sm leading-7 text-slate-600">
                  {details.fullDescription}
                </div>
              </div>
            ) : (
              <div className="rounded-[26px] border border-amber-200 bg-amber-50 p-6 sm:p-8 lg:col-span-2">
                <p className="text-sm font-semibold text-amber-900">
                  Este anúncio ainda não possui descrição completa na planilha de origem.
                </p>
                <p className="mt-2 text-sm leading-6 text-amber-800">
                  A página continua disponível com os dados de catálogo e informações padronizadas. Para detalhes adicionais, confirme pelo WhatsApp.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 ? (
        <section className="px-4 py-10 sm:px-8 lg:py-14">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-blue-600">
                  Continue navegando
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                  Produtos relacionados
                </h2>
              </div>
              <Link href="/catalogo" className="text-sm font-semibold text-blue-600 hover:text-blue-500">
                Ver catálogo
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
              {relatedProducts.map((item) => (
                <Link
                  key={item.id}
                  href={`/produto/${storefrontProductSlug(item)}`}
                  className="group overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="relative aspect-square bg-slate-50 p-3">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 767px) 50vw, 25vw"
                      className="object-contain p-3"
                    />
                  </div>
                  <div className="p-3 sm:p-4">
                    <p className="line-clamp-2 text-xs font-semibold leading-5 text-slate-900 sm:text-sm">
                      {item.title}
                    </p>
                    <p className="mt-3 text-sm font-bold text-slate-950 sm:text-base">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
      </main>
    </div>
  );
}
