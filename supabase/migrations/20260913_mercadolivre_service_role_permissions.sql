grant select, insert, update on table public.marketplace_connections to service_role;
grant select, insert, update on table public.marketplace_events to service_role;

grant usage, select on sequence public.marketplace_events_id_seq to service_role;
