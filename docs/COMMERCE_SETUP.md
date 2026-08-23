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

O pagamento será integrado ao Checkout Pro do Mercado Pago com Pix e cartão.
Antes de ativar cobranças reais, ainda são necessários:

1. persistência dos pedidos;
2. credenciais de teste do Mercado Pago;
3. endpoint de webhook com validação de assinatura e idempotência;
4. teste completo de pedido, frete, pagamento e retorno ao site.
