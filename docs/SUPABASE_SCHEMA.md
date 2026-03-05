# Supabase Schema — Soft Power Informática

Este projeto usa 4 tabelas principais:

## 1) `items`
Catálogo único de produtos e serviços.

Campos principais:
- `id` (uuid, PK)
- `kind` (`product` | `service`)
- `sku` (opcional, unique)
- `name`
- `category`
- `price_cents`
- `promo_price_cents`
- `currency` (default `BRL`)
- `description`
- `short_description`
- `image_main_path`
- `is_active`
- `created_at`, `updated_at`

## 2) `item_images`
Galeria por item.

Campos:
- `id`
- `item_id` (FK `items.id`)
- `path`
- `alt`
- `sort_order`
- `created_at`, `updated_at`

## 3) `promotions`
Slider da landing (sempre referencia item real por ID).

Campos:
- `id`
- `item_id` (FK `items.id`)
- `headline`
- `subtext`
- `sort_order`
- `is_active`
- `created_at`, `updated_at`

## 4) `audit_log` (opcional, recomendado)
Histórico de alterações do admin.

Campos:
- `id`
- `entity` (`items` | `promotions`)
- `entity_id`
- `action` (`create` | `update` | `delete`)
- `payload` (jsonb)
- `created_at`

## Triggers
- `updated_at` automático em `items`, `item_images`, `promotions`.

## Índices
- índices por `kind`, `is_active`, `category` e ordenação de promoções.

## RLS
- Leitura pública apenas para catálogo/promoções ativas.
- Escrita apenas para `service_role`.

> SQL completo: `supabase/schema.sql`
