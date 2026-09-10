# Checkout InterShield Películas

## Configuração de frete

- CEP de origem: `32516128`
- Embalagem-padrão: `30 x 20 x 12 cm`
- Peso-padrão: `0.2 kg`
- Serviços iniciais: Correios PAC e SEDEX via Melhor Envio

Variáveis de ambiente do servidor:

```text
CHECKOUT_ENABLED=false
MELHOR_ENVIO_ENV=sandbox
MELHOR_ENVIO_TOKEN=
```

Nunca prefixar o token com `NEXT_PUBLIC_` e nunca salvar o token no repositório.
O checkout só deve ser ativado após a cotação ter sido validada no sandbox.

## Próxima etapa: pagamentos

O site usa compra como convidado com conta opcional por link enviado ao e-mail.
O pagamento é iniciado pelo Checkout Pro do Mercado Pago e o pedido só muda
para pago após a confirmação recebida por webhook.

Variáveis do servidor:

```text
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
PAYMENTS_ENABLED=false
MERCADO_PAGO_ACCESS_TOKEN=
MERCADO_PAGO_WEBHOOK_SECRET=
MERCADO_PAGO_ENV=sandbox
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Variáveis públicas usadas somente pelo login opcional:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Nunca expor `SUPABASE_SERVICE_ROLE_KEY`, `MERCADO_PAGO_ACCESS_TOKEN` ou
`MERCADO_PAGO_WEBHOOK_SECRET` com o prefixo `NEXT_PUBLIC_`.

Antes de ativar cobranças reais:

1. executar a migration `supabase/migrations/202609040001_guest_checkout.sql`;
2. configurar SMTP próprio no Supabase para os links de acesso;
3. cadastrar `/api/pagamentos/mercado-pago/webhook` como webhook de pagamentos;
4. validar o fluxo no sandbox;
5. trocar as credenciais para produção e então definir `PAYMENTS_ENABLED=true`.
