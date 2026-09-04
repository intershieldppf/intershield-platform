import "server-only";

import type { StorefrontProduct } from "@/data/storefront/catalog";
import type { GuestCheckoutInput } from "@/lib/commerce/checkout";
import { getSupabaseAdmin } from "@/lib/commerce/supabaseAdmin";
import type { ShippingQuote } from "@/lib/commerce/shipping";

type CreateOrderInput = {
  publicId: string;
  checkout: GuestCheckoutInput;
  product: StorefrontProduct;
  sku: string;
  variantValue: string | null;
  unitPrice: number;
  shippingQuote: ShippingQuote;
};

export async function createGuestOrder({
  publicId,
  checkout,
  product,
  sku,
  variantValue,
  unitPrice,
  shippingQuote,
}: CreateOrderInput) {
  const supabase = getSupabaseAdmin();
  const { data: existingCustomer, error: lookupError } = await supabase
    .from("customers")
    .select("id, marketing_opt_in")
    .eq("email", checkout.customer.email)
    .maybeSingle();

  if (lookupError) {
    throw new Error("Não foi possível consultar os dados da compra.");
  }

  const customerValues = {
    email: checkout.customer.email,
    full_name: checkout.customer.fullName,
    phone: checkout.customer.phone,
    cpf: checkout.customer.cpf,
    marketing_opt_in:
      Boolean(existingCustomer?.marketing_opt_in) ||
      checkout.customer.marketingOptIn,
    updated_at: new Date().toISOString(),
  };

  const customerResult = existingCustomer
    ? await supabase
        .from("customers")
        .update(customerValues)
        .eq("id", existingCustomer.id)
        .select("id")
        .single()
    : await supabase
        .from("customers")
        .insert(customerValues)
        .select("id")
        .single();

  const { data: customer, error: customerError } = customerResult;

  if (customerError || !customer) {
    throw new Error("Não foi possível registrar os dados da compra.");
  }

  const { data: address, error: addressError } = await supabase
    .from("customer_addresses")
    .insert({
      customer_id: customer.id,
      postal_code: checkout.address.postalCode,
      street: checkout.address.street,
      street_number: checkout.address.number,
      complement: checkout.address.complement || null,
      neighborhood: checkout.address.neighborhood,
      city: checkout.address.city,
      state: checkout.address.state,
    })
    .select("id")
    .single();

  if (addressError || !address) {
    throw new Error("Não foi possível registrar o endereço de entrega.");
  }

  const total = Number((unitPrice + shippingQuote.price).toFixed(2));
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      public_id: publicId,
      customer_id: customer.id,
      shipping_address_id: address.id,
      status: "awaiting_payment",
      payment_status: "pending",
      subtotal: unitPrice,
      shipping_price: shippingQuote.price,
      total,
      shipping_service_id: shippingQuote.id,
      shipping_service_name: shippingQuote.name,
      shipping_delivery_time: shippingQuote.deliveryTime,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    throw new Error("Não foi possível criar o pedido.");
  }

  const { error: itemError } = await supabase.from("order_items").insert({
    order_id: order.id,
    product_id: product.id,
    title: product.title,
    sku,
    variant_value: variantValue,
    quantity: 1,
    unit_price: unitPrice,
  });

  if (itemError) {
    await supabase
      .from("orders")
      .update({ status: "creation_error" })
      .eq("id", order.id);
    throw new Error("Não foi possível adicionar o produto ao pedido.");
  }

  return { id: order.id as string, publicId, total };
}

export async function updateOrderPaymentSetup(
  orderId: string,
  values: {
    preferenceId?: string;
    checkoutUrl?: string;
    status?: string;
  },
) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("orders")
    .update({
      mercado_pago_preference_id: values.preferenceId,
      mercado_pago_checkout_url: values.checkoutUrl,
      status: values.status ?? "awaiting_payment",
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  if (error) throw new Error("Não foi possível vincular o pagamento ao pedido.");
}

export async function markOrderPaymentSetupFailed(orderId: string) {
  const supabase = getSupabaseAdmin();
  await supabase
    .from("orders")
    .update({
      status: "payment_setup_failed",
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);
}

export async function findOrderByPublicId(publicId: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("orders")
    .select("id, public_id, total, status, payment_status")
    .eq("public_id", publicId)
    .maybeSingle();

  if (error) throw new Error("Não foi possível consultar o pedido.");
  return data;
}

type PaymentUpdateInput = {
  orderId: string;
  eventId: string;
  paymentId: string;
  paymentStatus: string;
  statusDetail: string | null;
  transactionAmount: number | null;
  orderStatus: string;
};

export async function registerPaymentUpdate({
  orderId,
  eventId,
  paymentId,
  paymentStatus,
  statusDetail,
  transactionAmount,
  orderStatus,
}: PaymentUpdateInput) {
  const supabase = getSupabaseAdmin();
  const now = new Date().toISOString();
  const { error: eventError } = await supabase.from("payment_events").upsert(
    {
      provider_event_id: eventId,
      order_id: orderId,
      provider: "mercado_pago",
      payment_id: paymentId,
      payment_status: paymentStatus,
      status_detail: statusDetail,
      transaction_amount: transactionAmount,
      received_at: now,
    },
    { onConflict: "provider_event_id", ignoreDuplicates: true },
  );

  if (eventError) throw new Error("Não foi possível registrar o evento de pagamento.");

  const { error: orderError } = await supabase
    .from("orders")
    .update({
      status: orderStatus,
      payment_status: paymentStatus,
      mercado_pago_payment_id: paymentId,
      updated_at: now,
    })
    .eq("id", orderId);

  if (orderError) throw new Error("Não foi possível atualizar o pagamento do pedido.");
}
