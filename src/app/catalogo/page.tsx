import type { Metadata } from "next";

import { CatalogClient } from "@/components/catalog/CatalogClient";
import { Header } from "@/components/layout/Header";
import { storefrontCatalog } from "@/data/storefront/catalog";

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Encontre películas PPF e soluções Black Piano compatíveis com seu veículo.",
  alternates: { canonical: "/catalogo" },
};

type CatalogPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;
  const initialQuery = typeof params.q === "string" ? params.q : "";

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <CatalogClient products={storefrontCatalog} initialQuery={initialQuery} />
    </div>
  );
}
