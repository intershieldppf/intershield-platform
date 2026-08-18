# IMPORTER BLUEPRINT

## Colunas identificadas

O importador reconhece as colunas da exportação do Mercado Livre:

- Nome da Loja
- ID do Anúncios
- Link do Anúncio
- Título
- Nome da Categoria
- Descrição
- ML Preço
- Tipo de Anúncio
- Tipo de Garantia
- SKU
- Quantidade
- Imagem de Anúncio1
- Nome Variante1
- Opção por Variante1
- ID da Variante
- Data de Criação
- Horário Atualizado

Todas as demais colunas originais da planilha também são mantidas em `original` para referência.

## Regras de validação

- SKU vazio gera erro bloqueante.
- Preço vazio ou zerado gera erro bloqueante.
- Título vazio gera erro bloqueante.
- Imagem principal vazia gera alerta.
- Descrição vazia gera alerta.
- SKU repetido é listado como alerta para revisão.
- Linhas com o mesmo ID do anúncio são marcadas como variações, mas não transformadas automaticamente em produtos separados.

## Diferença entre anúncio e variação

- Um `anúncio` é identificado pelo campo `ID do Anúncios`.
- Quando várias linhas compartilham o mesmo `ID do Anúncios`, elas são consideradas variações do mesmo anúncio.
- O importador não consolida automaticamente variações em um único produto; ele mantém cada linha como um registro de staging.

## Fluxo de staging

1. Planilha é enviada.
2. Planilha é lida na primeira aba.
3. Linhas são mapeadas para `ImportRow`.
4. Cada linha é validada.
5. Resultado fica em memória como staging.
6. Os dados estão prontos para normalização e envio futuro ao Supabase.

## Campos que futuramente serão extraídos do título

- Marca do veículo
- Modelo do veículo
- Ano de fabricação
- Tipo de produto ou acabamento
- Variante de cor ou acabamento

## Regras de proteção do catálogo

- Nesta versão, nenhuma importação escreve direto no catálogo oficial.
- Nenhum produto é publicado automaticamente.
- O catálogo atual não é alterado.
- O importador funciona apenas como área de análise e staging.
