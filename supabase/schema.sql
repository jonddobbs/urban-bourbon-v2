-- Run this in the Supabase dashboard → SQL Editor

create table if not exists orders (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references auth.users(id) on delete set null,
  items            jsonb not null,
  total            numeric(10, 2) not null,
  stripe_session_id text,
  status           text not null default 'pending',
  created_at       timestamptz not null default now()
);

-- Row-level security: users can only read their own orders
alter table orders enable row level security;

create policy "Users can view own orders"
  on orders for select
  using (auth.uid() = user_id);

create policy "Service role can insert orders"
  on orders for insert
  with check (true);

-- Object-level grants: Supabase applies these automatically when a table is created
-- via the dashboard, but not when created with raw SQL. Without these, service_role
-- gets a Postgres 42501 "permission denied" before RLS is even evaluated.
grant all on table public.orders to anon;
grant all on table public.orders to authenticated;
grant all on table public.orders to service_role;

-- Migration: add shipping address column (run once in SQL Editor if table already exists)
alter table public.orders
  add column if not exists shipping_address jsonb;
