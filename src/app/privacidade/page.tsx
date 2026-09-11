import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "Privacidade", alternates: { canonical: "/privacidade" } };

export default function PrivacyPage() {
  return (
    <LegalPage title="Política de privacidade" intro="Esta página explica quais dados o site usa e como você pode exercer suas escolhas de privacidade.">
      <section><h2>Dados informados por você</h2><p>Para concluir uma compra como convidado, solicitamos nome, e-mail, telefone, CPF e, quando houver entrega, o endereço. Esses dados são utilizados para identificar o pagamento, preparar o pedido, emitir os documentos aplicáveis e realizar a entrega. Não solicitamos nem armazenamos senha ou dados completos do cartão.</p></section>
      <section><h2>Pagamento e frete</h2><p>O pagamento é processado no ambiente seguro do Mercado Pago. O CEP e os dados necessários à entrega são usados para calcular e contratar o frete. Ao utilizar esses serviços, os dados indispensáveis à transação também ficam sujeitos às políticas dos respectivos fornecedores.</p></section>
      <section><h2>Métricas opcionais</h2><p>Google Analytics e Meta Pixel podem ser ativados para medir visitas e cliques somente após seu consentimento. A escolha fica salva no navegador e pode ser removida apagando os dados locais do site.</p></section>
      <section><h2>Contato</h2><p>Para dúvidas ou solicitações sobre dados, fale com a InterShield pelo WhatsApp (31) 99714-6624.</p></section>
    </LegalPage>
  );
}
