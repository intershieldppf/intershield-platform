import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "Garantia e instalação", alternates: { canonical: "/garantia-instalacao" } };

export default function WarrantyInstallationPage() {
  return (
    <LegalPage title="Garantia e instalação" intro="A aplicação correta e a confirmação prévia da compatibilidade são essenciais para o melhor resultado do kit.">
      <section><h2>Antes de instalar</h2><p>Confira o veículo e todas as peças a seco, sem remover o liner. A superfície deve estar limpa, fria, sem ceras, silicones ou contaminação. Em caso de dúvida, interrompa e fale com o suporte.</p></section>
      <section><h2>Aplicação</h2><p>Siga as instruções enviadas com o produto. Danos causados por preparação inadequada, ferramenta incorreta, estiramento excessivo, recorte manual sobre a peça ou instalação incompatível não caracterizam defeito de fabricação.</p></section>
      <section><h2>Garantia legal</h2><p>Defeitos de fabricação são tratados conforme a legislação aplicável. Guarde o comprovante de compra e envie fotos ou vídeos que permitam identificar o produto, a peça e a ocorrência.</p></section>
      <section><h2>Suporte</h2><p>Fale pelo WhatsApp (31) 99714-6624 antes ou durante a instalação para confirmar o procedimento recomendado.</p></section>
    </LegalPage>
  );
}
