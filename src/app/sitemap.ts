import type { MetadataRoute } from "next";

import { storefrontCatalog, storefrontProductSlug } from "@/data/storefront/catalog";

const baseUrl = "https://www.intershield.com.br";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/catalogo",
    "/ppf",
    "/ppf-fotocromatico",
    "/black-piano",
    "/como-instalar",
    "/privacidade",
    "/envio-trocas",
    "/garantia-instalacao",
  ];

  return [
    ...staticRoutes.map((route, index) => ({
      url: `${baseUrl}${route}`,
      changeFrequency: index < 2 ? ("weekly" as const) : ("monthly" as const),
      priority: index === 0 ? 1 : index === 1 ? 0.9 : 0.7,
    })),
    ...storefrontCatalog.map((product) => ({
      url: `${baseUrl}/produto/${storefrontProductSlug(product)}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: [product.image],
    })),
  ];
}
