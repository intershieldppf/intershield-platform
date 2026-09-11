create extension if not exists pgcrypto;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  source text not null default 'site' check (source in ('site', 'manual')),
  payment_id text unique,
  preference_id text,
  payment_status text not null default 'pending',
  order_status text not null default 'awaiting_payment' check (
    order_status in ('awaiting_payment', 'new', 'preparing', 'ready', 'shipped', 'completed', 'cancelled')
  ),
  customer_name text not null,
  customer_email text,
  customer_phone text not null,
  customer_document text,
  product_id text,
  sku text,
  product_title text not null,
  variant text,
  product_amount numeric(12, 2) not null check (product_amount >= 0),
  shipping_type text not null check (shipping_type in ('pickup', 'shipping')),
  shipping_service text,
  shipping_cost numeric(12, 2) not null default 0 check (shipping_cost >= 0),
  postal_code text,
  address jsonb,
  tracking_code text,
  tracking_url text,
  notes text,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx on public.orders (order_status, created_at desc);
create index if not exists orders_payment_status_idx on public.orders (payment_status);

alter table public.orders enable row level security;

revoke all on table public.orders from anon, authenticated;

create or replace function public.set_orders_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_orders_updated_at();
