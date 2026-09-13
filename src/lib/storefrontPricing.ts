export const PRICES_UNDER_CONSULTATION = false;

const DISCOUNT_THRESHOLD = 200;
const DISCOUNT_RATE = 0.15;

export function calculateStorefrontPrice(price: number | null) {
  if (price === null || price <= DISCOUNT_THRESHOLD) return price;

  return Math.round(price * (1 - DISCOUNT_RATE) * 100) / 100;
}

export function formatStorefrontPrice(price: number | null) {
  if (PRICES_UNDER_CONSULTATION || price === null) {
    return "Preço sob consulta";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
}
