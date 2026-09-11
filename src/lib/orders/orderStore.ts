import "server-only";

export const ORDER_STATUSES = [
  "awaiting_payment",
  "new",
  "preparing",
  "ready",
  "shipped",
  "completed",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type StoreOrder = {
  id: string;
  reference: string;
  source: "site" | "manual";
  payment_id: string | null;
  preference_id: string | null;
  payment_status: string;
  order_status: OrderStatus;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string;
  customer_document: string | null;
  product_id: string | null;
  sku: string | null;
  product_title: string;
  variant: string | null;
  product_amount: number;
  shipping_type: "pickup" | "shipping";
  shipping_service: string | null;
  shipping_cost: number;
  postal_code: string | null;
  address: {
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
  } | null;
  tracking_code: string | null;
  tracking_url: string | null;
  notes: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
};

export type NewOrder = Omit<
  StoreOrder,
  "id" | "created_at" | "updated_at" | "payment_id" | "preference_id" | "tracking_code" | "tracking_url" | "paid_at"
> &
  Partial<Pick<StoreOrder, "payment_id" | "preference_id" | "tracking_code" | "tracking_url" | "paid_at">>;

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) throw new Error("Supabase orders storage is not configured");
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

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Supabase order request failed (${response.status}): ${detail.slice(0, 300)}`);
  }
  return (await response.json()) as T;
}

export function orderStoreIsConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function listOrders(limit = 200) {
  const { url } = getSupabaseConfig();
  const query = new URLSearchParams({
    select: "*",
    order: "created_at.desc",
    limit: String(Math.min(Math.max(limit, 1), 500)),
  });
  const response = await fetch(`${url}/rest/v1/orders?${query}`, {
    headers: headers(),
    cache: "no-store",
  });
  return parseResponse<StoreOrder[]>(response);
}

export async function createOrder(order: NewOrder) {
  const { url } = getSupabaseConfig();
  const response = await fetch(`${url}/rest/v1/orders`, {
    method: "POST",
    headers: headers({ Prefer: "return=representation" }),
    body: JSON.stringify(order),
    cache: "no-store",
  });
  const rows = await parseResponse<StoreOrder[]>(response);
  if (!rows[0]) throw new Error("Supabase did not return the created order");
  return rows[0];
}

export async function updateOrderById(id: string, values: Partial<StoreOrder>) {
  const { url } = getSupabaseConfig();
  const query = new URLSearchParams({ id: `eq.${id}` });
  const response = await fetch(`${url}/rest/v1/orders?${query}`, {
    method: "PATCH",
    headers: headers({ Prefer: "return=representation" }),
    body: JSON.stringify(values),
    cache: "no-store",
  });
  const rows = await parseResponse<StoreOrder[]>(response);
  if (!rows[0]) throw new Error("Order was not found");
  return rows[0];
}

export async function updateOrderByReference(reference: string, values: Partial<StoreOrder>) {
  const { url } = getSupabaseConfig();
  const query = new URLSearchParams({ reference: `eq.${reference}` });
  const response = await fetch(`${url}/rest/v1/orders?${query}`, {
    method: "PATCH",
    headers: headers({ Prefer: "return=representation" }),
    body: JSON.stringify(values),
    cache: "no-store",
  });
  const rows = await parseResponse<StoreOrder[]>(response);
  return rows[0] ?? null;
}
