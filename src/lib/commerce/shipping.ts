export const SHIPPING_ORIGIN_POSTAL_CODE = "32516128";

export const DEFAULT_SHIPPING_PACKAGE = {
  length: 30,
  width: 20,
  height: 12,
  weight: 0.2,
} as const;

export type ShippingQuote = {
  id: number;
  name: string;
  price: number;
  deliveryTime: number;
  company: string;
};

type MelhorEnvioQuote = {
  id?: number;
  name?: string;
  price?: string;
  custom_price?: string;
  delivery_time?: number;
  custom_delivery_time?: number;
  error?: string;
  company?: {
    name?: string;
  };
};

export function normalizePostalCode(value: string) {
  return value.replace(/\D/g, "").slice(0, 8);
}

export function formatPostalCode(value: string) {
  const normalized = normalizePostalCode(value);

  if (normalized.length <= 5) return normalized;

  return `${normalized.slice(0, 5)}-${normalized.slice(5)}`;
}

export function normalizeMelhorEnvioQuotes(value: unknown): ShippingQuote[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item: MelhorEnvioQuote) => {
    const company = item.company?.name?.trim() ?? "";
    const price = Number(item.custom_price ?? item.price);
    const deliveryTime = Number(
      item.custom_delivery_time ?? item.delivery_time,
    );

    if (
      item.error ||
      typeof item.id !== "number" ||
      !item.name ||
      !company.toLowerCase().includes("correios") ||
      !Number.isFinite(price) ||
      price <= 0 ||
      !Number.isFinite(deliveryTime) ||
      deliveryTime < 0
    ) {
      return [];
    }

    return [
      {
        id: item.id,
        name: item.name,
        price,
        deliveryTime,
        company,
      },
    ];
  });
}
