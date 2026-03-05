-- Soft Power Informática - schema base
-- Rode este arquivo no SQL Editor do Supabase

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('product','service')),
  sku text unique,
  name text not null,
  category text,
  price_cents integer not null check (price_cents >= 0),
  promo_price_cents integer check (promo_price_cents is null or promo_price_cents >= 0),
  currency text not null default 'BRL',
  description text,
  short_description text,
  image_main_path text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_items_kind on public.items(kind);
create index if not exists idx_items_active on public.items(is_active);
create index if not exists idx_items_category on public.items(category);

create table if not exists public.item_images (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.items(id) on delete cascade,
  path text not null,
  alt text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_item_images_item_id on public.item_images(item_id);
create index if not exists idx_item_images_sort on public.item_images(item_id, sort_order);

create table if not exists public.promotions (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.items(id) on delete cascade,
  headline text,
  subtext text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_promotions_active_sort on public.promotions(is_active, sort_order);
create index if not exists idx_promotions_item on public.promotions(item_id);

create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  entity text not null check (entity in ('items','promotions')),
  entity_id uuid not null,
  action text not null check (action in ('create','update','delete')),
  payload jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_audit_entity on public.audit_log(entity, entity_id);
create index if not exists idx_audit_created_at on public.audit_log(created_at desc);

drop trigger if exists trg_items_updated_at on public.items;
create trigger trg_items_updated_at
before update on public.items
for each row execute function public.set_updated_at();

drop trigger if exists trg_item_images_updated_at on public.item_images;
create trigger trg_item_images_updated_at
before update on public.item_images
for each row execute function public.set_updated_at();

drop trigger if exists trg_promotions_updated_at on public.promotions;
create trigger trg_promotions_updated_at
before update on public.promotions
for each row execute function public.set_updated_at();

-- RLS (opcional, recomendado)
alter table public.items enable row level security;
alter table public.item_images enable row level security;
alter table public.promotions enable row level security;
alter table public.audit_log enable row level security;

-- leitura pública para catálogo/promos
create policy if not exists "public read items" on public.items
for select using (is_active = true);

create policy if not exists "public read item_images" on public.item_images
for select using (true);

create policy if not exists "public read promotions" on public.promotions
for select using (is_active = true);

-- escrita só service_role (backend/admin seguro)
create policy if not exists "service role manage items" on public.items
for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

create policy if not exists "service role manage item_images" on public.item_images
for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

create policy if not exists "service role manage promotions" on public.promotions
for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

create policy if not exists "service role manage audit" on public.audit_log
for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
