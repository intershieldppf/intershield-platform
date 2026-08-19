import { promises as fs } from "fs";
import path from "path";
import { cache } from "react";

import {
  extractMarketplaceProductsFromArrayBuffer,
  type MarketplaceProductSource,
} from "./marketplaceImport";

const loadMarketplaceSource = cache(async () => {
  const filePath = path.join(
    process.cwd(),
    "src",
    "data",
    "imports",
    "Matriz_Mestre_InterShield_V2.xlsx",
  );

  try {
    const buffer = await fs.readFile(filePath);
    const arrayBuffer = buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength,
    ) as ArrayBuffer;

    return new Map(
      extractMarketplaceProductsFromArrayBuffer(arrayBuffer).map((product) => [
        product.listingId,
        product,
      ]),
    );
  } catch {
    return new Map<string, MarketplaceProductSource>();
  }
});

export async function getMarketplaceProductSource(listingId: string) {
  const products = await loadMarketplaceSource();
  return products.get(listingId) ?? null;
}
