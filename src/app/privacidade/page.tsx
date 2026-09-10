import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "Privacidade", alternates: { canonical: "/privacidade" } };

export default function PrivacyPage() {
  return (
    <LegalPage title="Política de privacidade" intro="Esta página explica quais dados o site usa e como você pode exercer suas escolhas de privacidade.">
      <section><h2>Dados informados na compra</h2><p>Para registrar, cobrar, emitir os documentos aplicáveis, entregar e prestar suporte ao pedido, solicitamos nome, e-mail, WhatsApp, CPF e endereço. O cadastro de uma conta é opcional e não é exigido para concluir a compra.</p></section>
      <section><h2>Pagamento e entrega</h2><p>O CEP e os dados necessários à entrega são enviados ao serviço de cotação de frete. O pagamento é processado pelo Mercado Pago. A InterShield registra o identificador e a situação da transação, mas não recebe nem armazena os dados completos do cartão.</p></section>
      <section><h2>Conta opcional e segurança</h2><p>O cliente pode acessar seus próprios pedidos por um link temporário enviado ao e-mail utilizado na compra. O acesso é protegido por autenticação e regras que limitam a consulta aos pedidos associados àquele e-mail.</p></section>
      <section><h2>WhatsApp</h2><p>Ao iniciar um atendimento pelo WhatsApp, você será direcionado à plataforma do WhatsApp e os dados enviados passam a seguir também as políticas desse serviço.</p></section>
      <section><h2>Métricas opcionais</h2><p>Google Analytics e Meta Pixel podem ser ativados para medir visitas e cliques somente após seu consentimento. A escolha fica salva no navegador e pode ser removida apagando os dados locais do site.</p></section>
      <section><h2>Comunicações comerciais</h2><p>O envio de novidades e ofertas é opcional e separado da compra. Você pode retirar essa autorização a qualquer momento pelos canais de atendimento.</p></section>
      <section><h2>Contato</h2><p>Para dúvidas ou solicitações sobre dados, fale com a InterShield pelo WhatsApp (31) 99714-6624.</p></section>
    </LegalPage>
  );
}
