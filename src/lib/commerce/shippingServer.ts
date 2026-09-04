import {
  DEFAULT_SHIPPING_PACKAGE,
  normalizeMelhorEnvioQuotes,
  type ShippingQuote,
  SHIPPING_ORIGIN_POSTAL_CODE,
} from "@/lib/commerce/shipping";

type ShippingQuoteInput = {
  destinationPostalCode: string;
  insuredPrice: number;
};

export class ShippingConfigurationError extends Error {}
export class ShippingUnavailableError extends Error {}

export async function getShippingQuotes({
  destinationPostalCode,
  insuredPrice,
}: ShippingQuoteInput): Promise<ShippingQuote[]> {
  const token = process.env.MELHOR_ENVIO_TOKEN;

  if (!token) {
    throw new ShippingConfigurationError(
      "O cálculo de frete ainda está em configuração.",
    );
  }

  const baseUrl =
    process.env.MELHOR_ENVIO_ENV === "production"
      ? "https://melhorenvio.com.br"
      : "https://sandbox.melhorenvio.com.br";

  let response: Response;

  try {
    response = await fetch(`${baseUrl}/api/v2/me/shipment/calculate`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "InterShield Peliculas (contato@intershield.com.br)",
      },
      body: JSON.stringify({
        from: { postal_code: SHIPPING_ORIGIN_POSTAL_CODE },
        to: { postal_code: destinationPostalCode },
        volumes: [
          {
            ...DEFAULT_SHIPPING_PACKAGE,
            insurance: Number(insuredPrice.toFixed(2)),
          },
        ],
        options: {
          receipt: false,
          own_hand: false,
        },
        services: "1,2",
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    throw new ShippingUnavailableError(
      "Não foi possível consultar o frete agora. Tente novamente.",
    );
  }

  if (!response.ok) {
    throw new ShippingUnavailableError(
      "Não foi possível consultar o frete agora. Tente novamente.",
    );
  }

  const quotes = normalizeMelhorEnvioQuotes(await response.json());

  if (quotes.length === 0) {
    throw new ShippingUnavailableError(
      "PAC ou SEDEX não estão disponíveis para este CEP.",
    );
  }

  return quotes;
}
