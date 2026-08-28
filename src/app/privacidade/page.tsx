import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "Privacidade", alternates: { canonical: "/privacidade" } };

export default function PrivacyPage() {
  return (
    <LegalPage title="Política de privacidade" intro="Esta página explica quais dados o site usa e como você pode exercer suas escolhas de privacidade.">
      <section><h2>Dados informados por você</h2><p>Ao iniciar um atendimento pelo WhatsApp, você será direcionado à plataforma do WhatsApp e os dados enviados passam a seguir também as políticas desse serviço. O site não solicita senha, documento ou dados de cartão.</p></section>
      <section><h2>Busca e cálculo de frete</h2><p>Os termos pesquisados são usados para mostrar produtos compatíveis. Quando o cálculo de frete estiver habilitado, o CEP será enviado ao serviço de cotação apenas para retornar modalidades e valores; ele não é usado pelo site para criar um cadastro.</p></section>
      <section><h2>Métricas opcionais</h2><p>Google Analytics e Meta Pixel podem ser ativados para medir visitas e cliques somente após seu consentimento. A escolha fica salva no navegador e pode ser removida apagando os dados locais do site.</p></section>
      <section><h2>Contato</h2><p>Para dúvidas ou solicitações sobre dados, fale com a InterShield pelo WhatsApp (31) 99714-6624.</p></section>
    </LegalPage>
  );
}
