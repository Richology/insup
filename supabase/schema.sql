-- InSup 最小商业化数据模型
-- 在 Supabase SQL Editor 中执行即可。

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  create type public.content_item_kind as enum ('document', 'template');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kind public.content_item_kind not null default 'document',
  title text not null,
  body_markdown text not null default '',
  summary text,
  theme_id text,
  layout_mode text,
  tags text[] not null default '{}'::text[],
  metadata jsonb not null default '{}'::jsonb,
  is_favorite boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.asset_blobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  content_item_id uuid references public.content_items (id) on delete set null,
  kind text not null default 'image',
  provider text not null default 'r2',
  storage_key text not null,
  public_url text,
  mime_type text,
  file_name text,
  size_bytes bigint,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.billing_subscriptions (
  user_id uuid primary key references auth.users (id) on delete cascade,
  provider text not null default 'manual',
  plan text not null default 'free',
  status text not null default 'free',
  provider_customer_id text,
  provider_subscription_id text,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data ->> 'display_name',
      new.raw_user_meta_data ->> 'name',
      split_part(new.email, '@', 1)
    )
  )
  on conflict (id) do update
    set email = excluded.email,
        display_name = coalesce(excluded.display_name, public.profiles.display_name),
        updated_at = now();

  insert into public.billing_subscriptions (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

drop trigger if exists set_content_items_updated_at on public.content_items;
create trigger set_content_items_updated_at
before update on public.content_items
for each row execute procedure public.set_updated_at();

drop trigger if exists set_billing_subscriptions_updated_at on public.billing_subscriptions;
create trigger set_billing_subscriptions_updated_at
before update on public.billing_subscriptions
for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.content_items enable row level security;
alter table public.asset_blobs enable row level security;
alter table public.billing_subscriptions enable row level security;

create policy "profiles_select_own"
on public.profiles
for select
using (auth.uid() = id);

create policy "profiles_update_own"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "content_items_select_own"
on public.content_items
for select
using (auth.uid() = user_id);

create policy "content_items_insert_own"
on public.content_items
for insert
with check (auth.uid() = user_id);

create policy "content_items_update_own"
on public.content_items
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "content_items_delete_own"
on public.content_items
for delete
using (auth.uid() = user_id);

create policy "asset_blobs_select_own"
on public.asset_blobs
for select
using (auth.uid() = user_id);

create policy "asset_blobs_insert_own"
on public.asset_blobs
for insert
with check (auth.uid() = user_id);

create policy "asset_blobs_update_own"
on public.asset_blobs
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "asset_blobs_delete_own"
on public.asset_blobs
for delete
using (auth.uid() = user_id);

create policy "billing_subscriptions_select_own"
on public.billing_subscriptions
for select
using (auth.uid() = user_id);
