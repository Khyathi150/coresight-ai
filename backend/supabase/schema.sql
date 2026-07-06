-- CoreSight AI — Supabase schema
-- Run this in the Supabase SQL editor for a fresh project (free tier is plenty).

create extension if not exists "pgcrypto";

create table if not exists businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  industry text not null default 'retail',
  created_at timestamptz default now()
);

create table if not exists sales (
  id bigserial primary key,
  business_id uuid references businesses(id) on delete cascade,
  date date not null,
  branch text,
  product text,
  dish text,
  category text,
  quantity numeric,
  unit_price numeric,
  cost_price numeric
);

create table if not exists inventory (
  id bigserial primary key,
  business_id uuid references businesses(id) on delete cascade,
  product text,
  ingredient text,
  stock_qty numeric,
  reorder_level numeric,
  expiry_date date
);

create table if not exists kpi_snapshots (
  id bigserial primary key,
  business_id uuid references businesses(id) on delete cascade,
  date date,
  revenue numeric,
  profit numeric,
  average_order_value numeric,
  extra jsonb,
  created_at timestamptz default now()
);

create table if not exists forecasts (
  id bigserial primary key,
  business_id uuid references businesses(id) on delete cascade,
  metric text,
  forecast_date date,
  predicted_value numeric,
  confidence numeric,
  created_at timestamptz default now()
);

create table if not exists alerts (
  id bigserial primary key,
  business_id uuid references businesses(id) on delete cascade,
  severity text,
  message text,
  created_at timestamptz default now(),
  resolved boolean default false
);

create table if not exists copilot_logs (
  id bigserial primary key,
  business_id uuid references businesses(id) on delete cascade,
  question text,
  computed_facts jsonb,
  answer text,
  created_at timestamptz default now()
);

-- Seed one demo business so the frontend has a business_id to point at immediately.
insert into businesses (id, name, industry)
values ('00000000-0000-0000-0000-000000000001', 'Demo Retail Co.', 'retail')
on conflict (id) do nothing;
