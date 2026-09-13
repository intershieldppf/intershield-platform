import "server-only";

import { MERCADOLIVRE_PROVIDER } from "./config";
import type { MercadoLivreAccount, MercadoLivreItem, MercadoLivreOrder } from "./client";

type ConnectionSummary = {
  external_user_id: string;
  status: string;
  metadata: Record<string, unknown>;
  updated_at: string;
};

type AccountRow = {
  external_user_id: string;
  nickname: string | null;
  site_id: string | null;
  account_status: string | null;
  reputation_level: string | null;
  sales_completed: number | null;
  last_synced_at: string;
};

type ItemStatRow = { status: string | null; available_quantity: number | null; sold_quantity: number | null };
type OrderStatRow = { status: string | null; total_amount: number | null; date_created: string | null };
type EventStatRow = { status: string; received_at: string; processed_at: string | null };
type SyncRunRow = {
  id: string;
  status: "running" | "completed" | "failed";
  stage: string;
  accounts_synced: number;
  items_synced: number;
  orders_synced: number;
  error_message: string | null;
  started_at: string;
  completed_at: string | null;
};

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) throw new Error("Supabase marketplace sync is not configured");
  return { url, serviceKey };
}

function headers(extra?: Record<string, string>) {
  const { serviceKey } = getSupabaseConfig();
  return {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

async function parse<T>(response: Response, operation: string): Promise<T> {
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`${operation} failed (${response.status}): ${detail.slice(0, 240)}`);
  }
  if (response.status === 204) return undefined as T;
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

async function queryRows<T>(table: string, query: URLSearchParams) {
  const { url } = getSupabaseConfig();
  const response = await fetch(`${url}/rest/v1/${table}?${query}`, {
    headers: headers(),
    cache: "no-store",
  });
  return parse<T[]>(response, `Loading ${table}`);
}

async function upsertRows(table: string, rows: unknown[], conflict: string) {
  if (!rows.length) return;
  const { url } = getSupabaseConfig();
  for (let index = 0; index < rows.length; index += 100) {
    const response = await fetch(`${url}/rest/v1/${table}?on_conflict=${encodeURIComponent(conflict)}`, {
      method: "POST",
      headers: headers({ Prefer: "resolution=merge-duplicates,return=minimal" }),
      body: JSON.stringify(rows.slice(index, index + 100)),
      cache: "no-store",
    });
    await parse<void>(response, `Saving ${table}`);
  }
}

async function updateSyncRun(id: string, values: Record<string, unknown>) {
  const { url } = getSupabaseConfig();
  const response = await fetch(`${url}/rest/v1/marketplace_sync_runs?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: headers({ Prefer: "return=minimal" }),
    body: JSON.stringify(values),
    cache: "no-store",
  });
  await parse<void>(response, "Updating Mercado Livre sync run");
}

export async function startMercadoLivreSyncRun() {
  const { url } = getSupabaseConfig();
  await fetch(`${url}/rest/v1/marketplace_sync_runs?provider=eq.${MERCADOLIVRE_PROVIDER}&status=eq.running&started_at=lt.${encodeURIComponent(new Date(Date.now() - 10 * 60_000).toISOString())}`, {
    method: "PATCH",
    headers: headers({ Prefer: "return=minimal" }),
    body: JSON.stringify({ status: "failed", stage: "expired", error_message: "Sincronização interrompida por tempo excedido.", completed_at: new Date().toISOString() }),
    cache: "no-store",
  });

  const response = await fetch(`${url}/rest/v1/marketplace_sync_runs`, {
    method: "POST",
    headers: headers({ Prefer: "return=representation" }),
    body: JSON.stringify({ provider: MERCADOLIVRE_PROVIDER, status: "running", stage: "account" }),
    cache: "no-store",
  });
  if (response.status === 409) throw new Error("Já existe uma sincronização do Mercado Livre em andamento.");
  const rows = await parse<SyncRunRow[]>(response, "Starting Mercado Livre sync run");
  if (!rows[0]) throw new Error("Mercado Livre sync run was not created");
  return rows[0];
}

export function setMercadoLivreSyncStage(id: string, stage: string, values?: Record<string, unknown>) {
  return updateSyncRun(id, { stage, ...values });
}

export function completeMercadoLivreSyncRun(id: string, values: Record<string, unknown>) {
  return updateSyncRun(id, { status: "completed", stage: "completed", completed_at: new Date().toISOString(), ...values });
}

export function failMercadoLivreSyncRun(id: string, stage: string, message: string) {
  return updateSyncRun(id, { status: "failed", stage, error_message: message.slice(0, 500), completed_at: new Date().toISOString() });
}

export async function saveMercadoLivreAccount(account: MercadoLivreAccount) {
  const now = new Date().toISOString();
  await upsertRows("marketplace_accounts", [{
    provider: MERCADOLIVRE_PROVIDER,
    external_user_id: String(account.id),
    nickname: account.nickname ?? null,
    site_id: account.site_id ?? null,
    country_id: account.country_id ?? null,
    account_status: account.status?.site_status ?? null,
    reputation_level: account.seller_reputation?.level_id ?? null,
    sales_completed: account.seller_reputation?.transactions?.completed ?? null,
    metadata: {
      transactions_total: account.seller_reputation?.transactions?.total ?? null,
      transactions_canceled: account.seller_reputation?.transactions?.canceled ?? null,
    },
    last_synced_at: now,
  }], "provider,external_user_id");
}

function itemSku(item: MercadoLivreItem) {
  if (item.seller_custom_field) return item.seller_custom_field;
  return item.attributes?.find((attribute) => attribute.id === "SELLER_SKU")?.value_name ?? null;
}

export function saveMercadoLivreItems(items: MercadoLivreItem[]) {
  const syncedAt = new Date().toISOString();
  return upsertRows("marketplace_items", items.map((item) => ({
    provider: MERCADOLIVRE_PROVIDER,
    item_id: item.id,
    seller_id: String(item.seller_id),
    title: item.title,
    category_id: item.category_id ?? null,
    price: item.price ?? null,
    currency_id: item.currency_id ?? null,
    available_quantity: item.available_quantity ?? null,
    sold_quantity: item.sold_quantity ?? null,
    status: item.status ?? null,
    condition: item.condition ?? null,
    listing_type_id: item.listing_type_id ?? null,
    permalink: item.permalink ?? null,
    thumbnail: item.thumbnail ?? null,
    sku: itemSku(item),
    variations: item.variations ?? [],
    attributes: item.attributes ?? [],
    date_created: item.date_created ?? null,
    last_updated: item.last_updated ?? null,
    synced_at: syncedAt,
  })), "provider,item_id");
}

export function saveMercadoLivreOrders(orders: MercadoLivreOrder[]) {
  const syncedAt = new Date().toISOString();
  return upsertRows("marketplace_orders", orders.map((order) => ({
    provider: MERCADOLIVRE_PROVIDER,
    order_id: String(order.id),
    seller_id: String(order.seller?.id ?? ""),
    buyer_id: order.buyer?.id ? String(order.buyer.id) : null,
    buyer_nickname: order.buyer?.nickname ?? null,
    status: order.status ?? null,
    status_detail: order.status_detail ?? null,
    payment_status: order.payments?.[0]?.status ?? null,
    total_amount: order.total_amount ?? null,
    paid_amount: order.paid_amount ?? null,
    currency_id: order.currency_id ?? null,
    shipping_id: order.shipping?.id ? String(order.shipping.id) : null,
    pack_id: order.pack_id ? String(order.pack_id) : null,
    items: (order.order_items ?? []).map((entry) => ({
      item_id: entry.item?.id ?? null,
      title: entry.item?.title ?? null,
      seller_sku: entry.item?.seller_sku ?? null,
      variation_id: entry.item?.variation_id ?? null,
      quantity: entry.quantity ?? 0,
      unit_price: entry.unit_price ?? null,
      full_unit_price: entry.full_unit_price ?? null,
      currency_id: entry.currency_id ?? order.currency_id ?? null,
    })),
    date_created: order.date_created ?? null,
    date_closed: order.date_closed ?? null,
    last_updated: order.last_updated ?? null,
    synced_at: syncedAt,
  })), "provider,order_id");
}

export async function updateMercadoLivreConnectionSyncMetadata(items: number, orders: number) {
  const { url } = getSupabaseConfig();
  const query = new URLSearchParams({ provider: `eq.${MERCADOLIVRE_PROVIDER}`, select: "metadata" });
  const rows = await queryRows<{ metadata: Record<string, unknown> }>("marketplace_connections", query);
  const response = await fetch(`${url}/rest/v1/marketplace_connections?provider=eq.${MERCADOLIVRE_PROVIDER}`, {
    method: "PATCH",
    headers: headers({ Prefer: "return=minimal" }),
    body: JSON.stringify({
      metadata: { ...(rows[0]?.metadata ?? {}), last_sync_at: new Date().toISOString(), items_synced: items, orders_synced: orders },
    }),
    cache: "no-store",
  });
  await parse<void>(response, "Updating Mercado Livre connection metadata");
}

export type MercadoLivreDashboard = {
  connected: boolean;
  connectionStatus: string | null;
  externalUserId: string | null;
  lastSyncAt: string | null;
  account: AccountRow | null;
  items: { total: number; active: number; paused: number; closed: number; stock: number; sold: number };
  orders: { total: number; paid: number; revenue: number; latestAt: string | null };
  automation: { lastEventAt: string | null; processed: number; pending: number; failed: number };
  lastRun: SyncRunRow | null;
};

export async function getMercadoLivreDashboard(): Promise<MercadoLivreDashboard> {
  const providerFilter = `eq.${MERCADOLIVRE_PROVIDER}`;
  const [connections, accounts, itemRows, orderRows, eventRows, runs] = await Promise.all([
    queryRows<ConnectionSummary>("marketplace_connections", new URLSearchParams({ provider: providerFilter, select: "external_user_id,status,metadata,updated_at", limit: "1" })),
    queryRows<AccountRow>("marketplace_accounts", new URLSearchParams({ provider: providerFilter, select: "external_user_id,nickname,site_id,account_status,reputation_level,sales_completed,last_synced_at", order: "last_synced_at.desc", limit: "1" })).catch(() => []),
    queryRows<ItemStatRow>("marketplace_items", new URLSearchParams({ provider: providerFilter, select: "status,available_quantity,sold_quantity", limit: "1000" })).catch(() => []),
    queryRows<OrderStatRow>("marketplace_orders", new URLSearchParams({ provider: providerFilter, select: "status,total_amount,date_created", order: "date_created.desc", limit: "500" })).catch(() => []),
    queryRows<EventStatRow>("marketplace_events", new URLSearchParams({ provider: providerFilter, select: "status,received_at,processed_at", order: "received_at.desc", limit: "1000" })).catch(() => []),
    queryRows<SyncRunRow>("marketplace_sync_runs", new URLSearchParams({ provider: providerFilter, select: "id,status,stage,accounts_synced,items_synced,orders_synced,error_message,started_at,completed_at", order: "started_at.desc", limit: "1" })).catch(() => []),
  ]);
  const connection = connections[0] ?? null;
  const lastSyncAt = typeof connection?.metadata?.last_sync_at === "string" ? connection.metadata.last_sync_at : null;
  return {
    connected: connection?.status === "connected",
    connectionStatus: connection?.status ?? null,
    externalUserId: connection?.external_user_id ?? null,
    lastSyncAt,
    account: accounts[0] ?? null,
    items: {
      total: itemRows.length,
      active: itemRows.filter((item) => item.status === "active").length,
      paused: itemRows.filter((item) => item.status === "paused").length,
      closed: itemRows.filter((item) => item.status === "closed").length,
      stock: itemRows.reduce((sum, item) => sum + Number(item.available_quantity ?? 0), 0),
      sold: itemRows.reduce((sum, item) => sum + Number(item.sold_quantity ?? 0), 0),
    },
    orders: {
      total: orderRows.length,
      paid: orderRows.filter((order) => order.status === "paid").length,
      revenue: orderRows.reduce((sum, order) => sum + Number(order.total_amount ?? 0), 0),
      latestAt: orderRows[0]?.date_created ?? null,
    },
    automation: {
      lastEventAt: eventRows[0]?.received_at ?? null,
      processed: eventRows.filter((event) => event.status === "processed").length,
      pending: eventRows.filter((event) => event.status === "pending" || event.status === "processing").length,
      failed: eventRows.filter((event) => event.status === "failed").length,
    },
    lastRun: runs[0] ?? null,
  };
}
