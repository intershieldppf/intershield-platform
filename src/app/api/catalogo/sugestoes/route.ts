import { NextRequest, NextResponse } from "next/server";

import { storefrontCatalog } from "@/data/storefront/catalog";

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function scoreSuggestion(title: string, query: string) {
  const normalizedTitle = normalizeText(title);
  const normalizedQuery = normalizeText(query);
  const tokens = normalizedQuery.split(" ").filter(Boolean);

  if (!normalizedQuery || tokens.length === 0) return null;

  const allTokensMatch = tokens.every((token) => normalizedTitle.includes(token));
  if (!allTokensMatch) return null;

  let score = 0;

  if (normalizedTitle === normalizedQuery) score += 300;
  if (normalizedTitle.startsWith(normalizedQuery)) score += 180;
  if (normalizedTitle.includes(normalizedQuery)) score += 120;

  for (const token of tokens) {
    if (normalizedTitle.startsWith(token)) score += 35;
    else if (normalizedTitle.includes(` ${token}`)) score += 25;
    else score += 15;
  }

  return score;
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (query.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  const suggestions = storefrontCatalog
    .map((product) => ({
      product,
      score: scoreSuggestion(product.title, query),
    }))
    .filter(
      (item): item is { product: (typeof storefrontCatalog)[number]; score: number } =>
        item.score !== null,
    )
    .sort(
      (a, b) =>
        b.score - a.score || a.product.displayOrder - b.product.displayOrder,
    )
    .slice(0, 6)
    .map(({ product }) => ({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      sku: product.sku,
      brand: product.brand,
      type: product.type,
    }));

  return NextResponse.json({ suggestions });
}
