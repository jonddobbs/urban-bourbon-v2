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
