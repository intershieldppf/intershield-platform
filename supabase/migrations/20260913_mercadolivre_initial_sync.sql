create table if not exists public.marketplace_accounts (
  provider text not null,
  external_user_id text not null,
  nickname text,
  site_id text,
  country_id text,
  account_status text,
  reputation_level text,
  sales_completed bigint,
  metadata jsonb not null default '{}'::jsonb,
  first_synced_at timestamptz not null default now(),
  last_synced_at timestamptz not null default now(),
  primary key (provider, external_user_id)
);

create table if not exists public.marketplace_items (
  provider text not null,
  item_id text not null,
  seller_id text not null,
  title text not null,
  category_id text,
  price numeric(14, 2),
  currency_id text,
  available_quantity integer,
  sold_quantity integer,
  status text,
  condition text,
  listing_type_id text,
  permalink text,
  thumbnail text,
  sku text,
  variations jsonb not null default '[]'::jsonb,
  attributes jsonb not null default '[]'::jsonb,
  date_created timestamptz,
  last_updated timestamptz,
  synced_at timestamptz not null default now(),
  primary key (provider, item_id)
);

create table if not exists public.marketplace_orders (
  provider text not null,
  order_id text not null,
  seller_id text not null,
  buyer_id text,
  buyer_nickname text,
  status text,
  status_detail text,
  payment_status text,
  total_amount numeric(14, 2),
  paid_amount numeric(14, 2),
  currency_id text,
  shipping_id text,
  pack_id text,
  items jsonb not null default '[]'::jsonb,
  date_created timestamptz,
  date_closed timestamptz,
  last_updated timestamptz,
  synced_at timestamptz not null default now(),
  primary key (provider, order_id)
);

create table if not exists public.marketplace_sync_runs (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  status text not null check (status in ('running', 'completed', 'failed')),
  stage text not null default 'starting',
  accounts_synced integer not null default 0,
  items_synced integer not null default 0,
  orders_synced integer not null default 0,
  error_message text,
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create unique index if not exists marketplace_sync_runs_one_running_idx
  on public.marketplace_sync_runs (provider)
  where status = 'running';
create index if not exists marketplace_items_seller_status_idx
  on public.marketplace_items (provider, seller_id, status);
create index if not exists marketplace_orders_seller_created_idx
  on public.marketplace_orders (provider, seller_id, date_created desc);
create index if not exists marketplace_sync_runs_provider_started_idx
  on public.marketplace_sync_runs (provider, started_at desc);

alter table public.marketplace_accounts enable row level security;
alter table public.marketplace_items enable row level security;
alter table public.marketplace_orders enable row level security;
alter table public.marketplace_sync_runs enable row level security;

revoke all on table public.marketplace_accounts from anon, authenticated;
revoke all on table public.marketplace_items from anon, authenticated;
revoke all on table public.marketplace_orders from anon, authenticated;
revoke all on table public.marketplace_sync_runs from anon, authenticated;

grant select, insert, update on table public.marketplace_accounts to service_role;
grant select, insert, update on table public.marketplace_items to service_role;
grant select, insert, update on table public.marketplace_orders to service_role;
grant select, insert, update on table public.marketplace_sync_runs to service_role;

