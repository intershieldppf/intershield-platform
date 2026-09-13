import "server-only";

const MERCADOLIVRE_API_URL = "https://api.mercadolibre.com";

export type MercadoLivreAccount = {
  id: number;
  nickname?: string;
  site_id?: string;
  country_id?: string;
  status?: { site_status?: string };
  seller_reputation?: {
    level_id?: string;
    transactions?: { completed?: number; total?: number; canceled?: number };
  };
};

export type MercadoLivreItem = {
  id: string;
  seller_id: number;
  title: string;
  category_id?: string;
  price?: number;
  currency_id?: string;
  available_quantity?: number;
  sold_quantity?: number;
  status?: string;
  condition?: string;
  listing_type_id?: string;
  permalink?: string;
  thumbnail?: string;
  seller_custom_field?: string | null;
  variations?: Array<Record<string, unknown>>;
  attributes?: Array<{ id?: string; value_name?: string | null; [key: string]: unknown }>;
  date_created?: string;
  last_updated?: string;
};

export type MercadoLivreOrder = {
  id: number;
  seller?: { id?: number };
  buyer?: { id?: number; nickname?: string };
  status?: string;
  status_detail?: string | null;
  total_amount?: number;
  paid_amount?: number;
  currency_id?: string;
  shipping?: { id?: number | null };
  pack_id?: number | null;
  date_created?: string;
  date_closed?: string | null;
  last_updated?: string;
  payments?: Array<{ status?: string }>;
  order_items?: Array<{
    item?: { id?: string; title?: string; seller_sku?: string | null; variation_id?: number | null };
    quantity?: number;
    unit_price?: number;
    full_unit_price?: number;
    currency_id?: string;
  }>;
};

type Paging = { total: number; offset: number; limit: number };

async function mercadoLivreGet<T>(path: string, accessToken: string): Promise<T> {
  if (!path.startsWith("/")) throw new Error("Invalid Mercado Livre API path");
  const response = await fetch(`${MERCADOLIVRE_API_URL}${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Mercado Livre API request failed (${response.status}): ${detail.slice(0, 240)}`);
  }
  return (await response.json()) as T;
}

export function getMercadoLivreAccount(accessToken: string) {
  return mercadoLivreGet<MercadoLivreAccount>("/users/me", accessToken);
}

export async function listMercadoLivreItemIds(
  sellerId: string,
  accessToken: string,
  maximum = 1_000,
) {
  const itemIds: string[] = [];
  const limit = 100;
  while (itemIds.length < maximum) {
    const offset = itemIds.length;
    const query = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    const page = await mercadoLivreGet<{ results: string[]; paging: Paging }>(
      `/users/${encodeURIComponent(sellerId)}/items/search?${query}`,
      accessToken,
    );
    itemIds.push(...page.results.slice(0, maximum - itemIds.length));
    if (!page.results.length || itemIds.length >= page.paging.total) break;
  }
  return itemIds;
}

export async function getMercadoLivreItems(itemIds: string[], accessToken: string) {
  const items: MercadoLivreItem[] = [];
  for (let index = 0; index < itemIds.length; index += 20) {
    const ids = itemIds.slice(index, index + 20).join(",");
    const responses = await mercadoLivreGet<Array<{ code: number; body: MercadoLivreItem }>>(
      `/items?ids=${encodeURIComponent(ids)}`,
      accessToken,
    );
    items.push(...responses.filter((entry) => entry.code === 200 && entry.body?.id).map((entry) => entry.body));
  }
  return items;
}

export async function listMercadoLivreOrders(
  sellerId: string,
  accessToken: string,
  maximum = 500,
) {
  const orders: MercadoLivreOrder[] = [];
  const limit = 50;
  while (orders.length < maximum) {
    const query = new URLSearchParams({
      seller: sellerId,
      sort: "date_desc",
      limit: String(limit),
      offset: String(orders.length),
    });
    const page = await mercadoLivreGet<{ results: MercadoLivreOrder[]; paging: Paging }>(
      `/orders/search?${query}`,
      accessToken,
    );
    orders.push(...page.results.slice(0, maximum - orders.length));
    if (!page.results.length || orders.length >= page.paging.total) break;
  }
  return orders;
}

