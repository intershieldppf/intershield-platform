# InterShield Platform

> Todas as implementações futuras devem seguir este documento como referência oficial.

## Objetivo do projeto

Criar uma plataforma digital para InterShield Películas com foco em proteção e customização automotiva. A plataforma deve ser premium, tecnológica e limpa, oferecendo experiência fluida em desktop e mobile.

## Identidade visual

- Paleta de cores: branco, preto e azul elétrico.
- Aparência premium, minimalista e profissional.
- Tipografia clara, com espaçamento tecnológico e hierarquia visual definida.
- Uso restrito de sombras e nenhum gradiente exagerado.
- Todas as imagens e ícones devem reforçar a marca, sem gerar imagens artificiais.

## Arquitetura

- Projeto Next.js com TypeScript.
- Tailwind CSS para estilização.
- Componentes reutilizáveis organizados em `src/components`.
- Estrutura de layout e UI separada de dados e lógica.
- Evitar duplicação de links e conteúdo de navegação.

## Estrutura de pastas

- `src/app/` - entradas e rotas do Next.js.
- `src/components/` - componentes reutilizáveis.
- `src/components/layout/` - componentes de layout e header.
- `src/components/ui/` - componentes de interface genéricos.
- `src/components/search/` - componentes da barra de pesquisa.
- `src/data/` - arquivos de dados e mocks.
- `public/` - ativos públicos, incluindo o logo oficial futuro.

## Componentes

Cada componente deve ser:

- Construído com TypeScript.
- Utilizar Tailwind CSS.
- Ter responsabilidade única.
- Ser reutilizável e fácil de testar.
- Nomeado de forma clara e descritiva.

## Header

- Header fixo no topo com altura aproximada de 76px.
- Layout centralizado com largura máxima de 1440px.
- Lockup textual temporário para a marca:
  - `INTERSHIELD` em preto, caixa alta e espaçamento tecnológico.
  - `PELÍCULAS` menor, centralizado abaixo, com espaçamento entre letras.
- Menu de navegação:
  - Kits para veículos
  - Motos
  - Black Piano
  - Como instalar
  - Conheça a InterShield
  - Suporte
- Ações de usuário e carrinho no lado direito com ícones de `lucide-react`.
- Cartão de carrinho deve exibir indicador de quantidade.
- Mobile deve ter botão hambúrguer e menu lateral ou dropdown acessível.
- Ao abrir o menu mobile, bloquear rolagem da página.

## Barra de pesquisa

- Deve ficar imediatamente abaixo do Header.
- Estrutura:
  - Card "Seu veículo" clicável
  - Campo de pesquisa com placeholder
  - Botão "BUSCAR" em azul InterShield
  - Card lateral com link de WhatsApp
- O card do veículo deve ter fundo preto com ícone de carro.
- O botão de buscar deve ter altura igual ao campo de pesquisa.
- Card lateral deve ter:
  - Título: "NÃO ENCONTROU SEU VEÍCULO?"
  - Subtítulo: "Fale com nossos especialistas"
  - Ícone de WhatsApp
- Mobile deve empilhar os elementos mantendo usabilidade.
- Tablet deve adaptar proporcionalmente.

## Hero

- Título principal com posicionamento de proteção sob medida.
- Mensagem clara de proteção e acabamento premium.
- Botões de ação para buscar e conhecer a InterShield.
- Design limpo e centrado, sem usar imagens artificiais.

## Categorias

- Seção com cartões que representam:
  - Multimídia
  - Interior
  - Exterior
  - Interior + Exterior
  - Black Piano
  - Motos
- Cada cartão deve conter título e breve descrição.

## Catálogo Mestre

- Deve ser desenvolvido como próximo passo após a base do site.
- Deve conter catálogo de produtos e kits por categoria.
- Deve permitir filtragem por marca, modelo e ano.
- Deve ser organizado para futura integração com dados reais.

## Banco de dados (Supabase)

- O projeto atual não deve implementar conexão real com Supabase.
- Qualquer uso de dados deve partir de mocks locais.
- A integração com Supabase deve ser planejada em fases futuras.
- Para o design de dados e relacionamentos, consulte `docs/DATABASE_BLUEPRINT.md`.

## Busca inteligente

- Implementar busca com sugestões mock para a barra de pesquisa.
- Sugestões iniciais:
  - Corolla 2024
  - BMW X3 2024
  - BYD Dolphin Mini 2025
  - Honda HR-V 2025
  - BMW F800GS 2024
- Busca inteligente deve ser responsiva e acessível.

## Regras de UX

- Navegação clara e consistente.
- Acessibilidade: labels, aria-labels e botões interativos.
- Feedback visual em hover e foco.
- Não usar interações confusas ou elementos que escondam conteúdo.
- Mobile-first e adaptação fluida para desktop.

## Regras de UI

- Uso dominante de branco com detalhes em preto e azul elétrico.
- Separação de seções com espaços generosos e bordas sutis.
- Componentes com cantos arredondados suaves.
- Evitar gradientes e sombras exageradas.
- Tipografia consistente e legível.

## SEO

- Metadata relevante para cada página.
- Conteúdo textual claro e objetivo.
- Estrutura de headings semântica: `h1`, `h2`, `h3`, etc.
- Títulos e descrições amigáveis para buscas.

## Performance

- Usar renderização estática sempre que possível.
- Minimizar uso de dependências externas.
- Priorizar CSS leve e componentes otimizados.
- Evitar sobrecarga de scripts desnecessários.

## Deploy

- Deploy previsto para plataformas compatíveis com Next.js.
- Manter configuração padrão do projeto sem alterações externas desnecessárias.
- Não alterar integrações com Git, Vercel ou Supabase nesta fase.

## Convenções de código

- Usar TypeScript estrito.
- Componentes devem ser nomeados com PascalCase.
- Preferir funções e props tipadas explicitamente.
- Usar `@/` para importações absolutas quando apropriado.
- Manter arquivos pequenos e com responsabilidade única.

## Convenções para componentes

- Cada componente em seu próprio arquivo.
- Componentes de layout em `src/components/layout/`.
- Componentes UI genéricos em `src/components/ui/`.
- Componentes de domínio em `src/components/search/` ou outras pastas específicas.
- Evitar lógica de negócio diretamente no componente de apresentação.

## Convenções para páginas

- `src/app/page.tsx` deve apenas montar componentes.
- Página deve permanecer leve e sem lógica complexa.
- Componentes específicos devem ser importados e organizados na página.

## Roadmap

- Sprint 1: Novo Header e arquitetura de componentes.
- Sprint 2: Barra de pesquisa superior com sugestões mock.
- Sprint 3: Hero e seções iniciais da homepage.
- Sprint 4: Catálogo mestre e filtros de busca.
- Sprint 5: Integração com Supabase e dados reais.
- Sprint 6: SEO, performance e deploy.
