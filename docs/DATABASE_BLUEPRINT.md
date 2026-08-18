# DATABASE BLUEPRINT

## Entidades

- **Brand**: marcas de veículos.
- **VehicleModel**: modelos associados a uma marca.
- **Vehicle**: geração ou faixa de compatibilidade de um modelo.
- **ProductType**: categorias de produtos e kits.
- **Product**: produtos ou kits oferecidos.
- **Compatibility**: relação entre produto e veículo.

## Relacionamentos

- `Brand` 1:N `VehicleModel`
- `VehicleModel` 1:N `Vehicle`
- `ProductType` 1:N `Product`
- `Vehicle` N:M `Product` via `Compatibility`
- `Product` N:M `Vehicle` via `Compatibility`

### Detalhes do relacionamento Vehicle ↔ Product

- A relação entre `Vehicle` e `Product` é representada por `Compatibility`.
- Cada `Compatibility` conecta um produto a um veículo específico.
- `Compatibility` permite armazenar restrições de versão, notas e intervalos de ano personalizados.
- Isso garante que um mesmo produto possa ser compatível com múltiplos veículos e vice-versa.

## Regras principais

- Não duplicar dados de marca e modelo dentro de `Product`.
- Produtos devem referenciar `productTypeId`.
- Veículos devem referenciar `vehicleModelId`.
- `Compatibility` deve permitir sobrescrever anos e registrar restrições de versão.
- IDs usam UUID; datas usam strings ISO.

## Fluxo futuro de importação

1. Fonte de dados chega em planilhas ou CSV.
2. Dados são validados e convertidos em objetos tipados.
3. Planilha passa por staging para revisão.
4. Dados aprovados são publicados no sistema de produção.

## Camada de serviço de catálogo

- O `CatalogService` define a interface comum de acesso a marcas, modelos, veículos, produtos e compatibilidades.
- Atualmente a implementação local `LocalCatalogService` fornece dados a partir de `src/data/mockCatalog.ts`.
- Futuramente, deve existir uma implementação `SupabaseCatalogService` que respeite a mesma interface.
- A troca de fonte de dados deve ser feita apenas pelo provedor do serviço, sem alterar a interface ou o consumidor.

## Observação

- A planilha de importação deve ser consolidada e revisada antes da publicação final.
- Esta etapa de staging é obrigatória para evitar dados incorretos na plataforma.
