create table if not exists public.marketplace_connections (
  provider text primary key,
  external_user_id text not null,
  access_token_encrypted text not null,
  refresh_token_encrypted text,
  access_token_expires_at timestamptz not null,
  scope text,
  token_type text,
  status text not null default 'connected' check (status in ('connected', 'expired', 'revoked', 'error')),
  metadata jsonb not null default '{}'::jsonb,
  refresh_lock_id uuid,
  refresh_locked_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.marketplace_events (
  id bigint generated always as identity primary key,
  provider text not null,
  event_key text not null,
  topic text not null,
  resource text not null,
  external_user_id text not null,
  application_id text not null,
  payload jsonb not null,
  status text not null default 'pending' check (status in ('pending', 'processing', 'processed', 'failed')),
  processing_error text,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  unique (provider, event_key)
);

create index if not exists marketplace_events_pending_idx
  on public.marketplace_events (status, received_at);
create index if not exists marketplace_events_topic_idx
  on public.marketplace_events (provider, topic, received_at desc);

alter table public.marketplace_connections enable row level security;
alter table public.marketplace_events enable row level security;

revoke all on table public.marketplace_connections from anon, authenticated;
revoke all on table public.marketplace_events from anon, authenticated;

create or replace function public.set_marketplace_connections_updated_at()
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

drop trigger if exists marketplace_connections_set_updated_at on public.marketplace_connections;
create trigger marketplace_connections_set_updated_at
before update on public.marketplace_connections
for each row execute function public.set_marketplace_connections_updated_at();

create or replace function public.acquire_marketplace_refresh_lock(
  p_provider text,
  p_lock_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  changed_count integer;
begin
  update public.marketplace_connections
  set refresh_lock_id = p_lock_id,
      refresh_locked_until = now() + interval '30 seconds'
  where provider = p_provider
    and (refresh_locked_until is null or refresh_locked_until < now());

  get diagnostics changed_count = row_count;
  return changed_count = 1;
end;
$$;

revoke all on function public.acquire_marketplace_refresh_lock(text, uuid) from public, anon, authenticated;
grant execute on function public.acquire_marketplace_refresh_lock(text, uuid) to service_role;
