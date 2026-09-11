export const PRICES_UNDER_CONSULTATION = true;

export function formatStorefrontPrice(price: number | null) {
  if (PRICES_UNDER_CONSULTATION || price === null) {
    return "Preço sob consulta";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
}
