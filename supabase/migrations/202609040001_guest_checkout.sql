create extension if not exists pgcrypto;

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  full_name text not null,
  phone varchar(11) not null,
  cpf varchar(11) not null,
  marketing_opt_in boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint customers_email_lowercase check (email = lower(email)),
  constraint customers_phone_length check (char_length(phone) between 10 and 11),
  constraint customers_cpf_length check (char_length(cpf) = 11)
);

create table if not exists public.customer_addresses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  postal_code varchar(8) not null,
  street text not null,
  street_number text not null,
  complement text,
  neighborhood text not null,
  city text not null,
  state varchar(2) not null,
  created_at timestamptz not null default now(),
  constraint customer_addresses_postal_code_length check (char_length(postal_code) = 8),
  constraint customer_addresses_state_length check (char_length(state) = 2)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  public_id text not null unique,
  customer_id uuid not null references public.customers(id),
  shipping_address_id uuid not null references public.customer_addresses(id),
  status text not null default 'awaiting_payment',
  payment_status text not null default 'pending',
  subtotal numeric(12,2) not null,
  shipping_price numeric(12,2) not null,
  total numeric(12,2) not null,
  shipping_service_id integer not null,
  shipping_service_name text not null,
  shipping_delivery_time integer not null,
  tracking_code text,
  mercado_pago_preference_id text unique,
  mercado_pago_payment_id text,
  mercado_pago_checkout_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint orders_amounts_non_negative check (
    subtotal >= 0 and shipping_price >= 0 and total >= 0
  )
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text not null,
  title text not null,
  sku text not null,
  variant_value text,
  quantity integer not null default 1,
  unit_price numeric(12,2) not null,
  created_at timestamptz not null default now(),
  constraint order_items_quantity_positive check (quantity > 0),
  constraint order_items_price_non_negative check (unit_price >= 0)
);

create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  provider_event_id text not null unique,
  order_id uuid not null references public.orders(id) on delete cascade,
  provider text not null,
  payment_id text not null,
  payment_status text not null,
  status_detail text,
  transaction_amount numeric(12,2),
  received_at timestamptz not null default now()
);

create index if not exists customer_addresses_customer_id_idx
  on public.customer_addresses(customer_id);
create index if not exists orders_customer_id_created_at_idx
  on public.orders(customer_id, created_at desc);
create index if not exists order_items_order_id_idx
  on public.order_items(order_id);
create index if not exists payment_events_order_id_idx
  on public.payment_events(order_id);

alter table public.customers enable row level security;
alter table public.customer_addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payment_events enable row level security;

revoke all on public.customers from anon, authenticated;
revoke all on public.customer_addresses from anon, authenticated;
revoke all on public.orders from anon, authenticated;
revoke all on public.order_items from anon, authenticated;
revoke all on public.payment_events from anon, authenticated;

grant select on public.customers to authenticated;
grant select on public.customer_addresses to authenticated;
grant select on public.orders to authenticated;
grant select on public.order_items to authenticated;

drop policy if exists customers_select_own on public.customers;
create policy customers_select_own
  on public.customers for select to authenticated
  using (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));

drop policy if exists customer_addresses_select_own on public.customer_addresses;
create policy customer_addresses_select_own
  on public.customer_addresses for select to authenticated
  using (
    exists (
      select 1 from public.customers
      where customers.id = customer_addresses.customer_id
        and lower(customers.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  );

drop policy if exists orders_select_own on public.orders;
create policy orders_select_own
  on public.orders for select to authenticated
  using (
    exists (
      select 1 from public.customers
      where customers.id = orders.customer_id
        and lower(customers.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  );

drop policy if exists order_items_select_own on public.order_items;
create policy order_items_select_own
  on public.order_items for select to authenticated
  using (
    exists (
      select 1
      from public.orders
      join public.customers on customers.id = orders.customer_id
      where orders.id = order_items.order_id
        and lower(customers.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  );

grant all on public.customers to service_role;
grant all on public.customer_addresses to service_role;
grant all on public.orders to service_role;
grant all on public.order_items to service_role;
grant all on public.payment_events to service_role;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists customers_set_updated_at on public.customers;
create trigger customers_set_updated_at
before update on public.customers
for each row execute function public.set_updated_at();

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();
