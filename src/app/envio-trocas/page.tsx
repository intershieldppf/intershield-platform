import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "Envio e trocas", alternates: { canonical: "/envio-trocas" } };

export default function ShippingReturnsPage() {
  return (
    <LegalPage title="Envio, cancelamento e trocas" intro="As condições abaixo se aplicam às compras concluídas diretamente com a InterShield. Nos marketplaces, consulte também as regras exibidas no canal escolhido.">
      <section><h2>Compatibilidade</h2><p>Antes de concluir a compra, confirme marca, modelo, ano, versão e a peça que receberá a película. Produtos sob medida dependem dessas informações para o recorte correto.</p></section>
      <section><h2>Envio</h2><p>Prazo, modalidade, rastreamento e valor do frete são informados no atendimento ou no canal de venda antes da conclusão do pedido. O prazo de transporte começa após a confirmação do pagamento e a preparação do kit.</p></section>
      <section><h2>Cancelamento e arrependimento</h2><p>Solicitações são analisadas conforme o Código de Defesa do Consumidor e a condição do item. Entre em contato o quanto antes e preserve produto, embalagem e acessórios recebidos.</p></section>
      <section><h2>Produto incorreto ou avariado</h2><p>Não instale o produto. Registre fotos da embalagem, etiqueta e peças recebidas e fale com a equipe pelo WhatsApp (31) 99714-6624 para orientação.</p></section>
    </LegalPage>
  );
}
