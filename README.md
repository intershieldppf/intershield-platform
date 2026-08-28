# InterShield Platform

Site institucional e catálogo da InterShield Películas, desenvolvido com Next.js 16, React 19 e Tailwind CSS 4.

## Desenvolvimento

```bash
npm ci
npm run dev
```

Antes de publicar uma alteração, execute:

```bash
npm run lint
npm run typecheck
npm run build
npm audit --omit=dev
```

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e defina somente os recursos usados no ambiente. As rotas `/admin` permanecem indisponíveis até que `ADMIN_USERNAME` e `ADMIN_PASSWORD` estejam configurados.

- `ADMIN_USERNAME` e `ADMIN_PASSWORD`: autenticação HTTP Basic da administração.
- `NEXT_PUBLIC_GA_ID`: ativa Google Analytics após consentimento.
- `NEXT_PUBLIC_META_PIXEL_ID`: ativa Meta Pixel após consentimento.
- `CHECKOUT_ENABLED`, `MELHOR_ENVIO_TOKEN` e `MELHOR_ENVIO_ENV`: cálculo de frete opcional.

## Catálogo

O storefront é gerado a partir dos arquivos em `src/data/storefront`. A importação administrativa aceita somente `.xlsx` de até 5 MB e requer autenticação.

## Deploy

O branch `main` é implantado pela Vercel. O workflow de CI valida lint, tipos, build e dependências em pull requests e pushes.
