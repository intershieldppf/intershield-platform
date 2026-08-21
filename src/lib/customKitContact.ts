const WHATSAPP_NUMBER = "5531997146624";

export function buildCustomKitWhatsappUrl(context?: string) {
  const message = [
    "Olá! Não encontrei no site o kit ou a combinação de peças que procuro.",
    context ? `Referência no site: ${context}` : null,
    "",
    "Veículo (marca, modelo e ano):",
    "Peças que desejo proteger:",
    "",
    "Podem verificar no sistema a combinação disponível para mim?",
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
