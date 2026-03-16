-- Kitchen Tech Sheets – Supabase Schema
-- Run this in the Supabase SQL editor to set up the database.

-- ─────────────────────────────────────────────
-- Extensions
-- ─────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────
-- Recipes
-- ─────────────────────────────────────────────
create table if not exists recipes (
  id              uuid primary key default uuid_generate_v4(),
  establishment_id uuid,
  name            text not null,
  category        text not null default '',
  recipe_type     text not null check (recipe_type in ('simple', 'composed')),
  servings        integer not null default 1,
  prep_time       integer not null default 0,  -- minutes
  cook_time       integer not null default 0,  -- minutes
  total_cost      numeric(10, 4) not null default 0,
  selling_price   numeric(10, 4),
  allergens       text,
  notes           text,
  steps           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- Recipe Ingredients (for simple recipes)
-- ─────────────────────────────────────────────
create table if not exists recipe_ingredients (
  id            uuid primary key default uuid_generate_v4(),
  recipe_id     uuid not null references recipes(id) on delete cascade,
  stock_item_id uuid,
  name          text not null,
  quantity      numeric(10, 4) not null,
  unit          text not null,
  unit_cost     numeric(10, 4),
  sort_order    integer not null default 0
);

-- ─────────────────────────────────────────────
-- Recipe Components (for composed recipes)
-- ─────────────────────────────────────────────
create table if not exists recipe_components (
  id               uuid primary key default uuid_generate_v4(),
  parent_recipe_id uuid not null references recipes(id) on delete cascade,
  child_recipe_id  uuid not null references recipes(id) on delete restrict,
  quantity         numeric(10, 4) not null,
  unit             text not null,
  sort_order       integer not null default 0,
  total_cost       numeric(10, 4)
);

-- ─────────────────────────────────────────────
-- Recipe History
-- ─────────────────────────────────────────────
create table if not exists recipe_history (
  id         uuid primary key default uuid_generate_v4(),
  recipe_id  uuid not null references recipes(id) on delete cascade,
  action     text not null check (action in ('create', 'update', 'delete')),
  changed_by uuid references auth.users(id),
  snapshot   jsonb,
  changed_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- Stock Items
-- ─────────────────────────────────────────────
create table if not exists stock_items (
  id                 uuid primary key default uuid_generate_v4(),
  establishment_id   uuid,
  name               text not null,
  unit               text not null,
  quantity_in_stock  numeric(10, 4) not null default 0,
  min_quantity       numeric(10, 4) not null default 0,
  average_unit_cost  numeric(10, 4),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- Stock Movements
-- ─────────────────────────────────────────────
create table if not exists stock_movements (
  id             uuid primary key default uuid_generate_v4(),
  stock_item_id  uuid not null references stock_items(id) on delete cascade,
  movement_type  text not null check (movement_type in ('in', 'out', 'adjustment')),
  quantity       numeric(10, 4) not null,
  unit_cost      numeric(10, 4),
  reason         text,
  created_by     uuid references auth.users(id),
  created_at     timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- Production Orders
-- ─────────────────────────────────────────────
create table if not exists production_orders (
  id               uuid primary key default uuid_generate_v4(),
  establishment_id uuid,
  recipe_id        uuid not null references recipes(id) on delete restrict,
  quantity         numeric(10, 4) not null,
  status           text not null default 'draft'
                     check (status in ('draft', 'validated', 'done', 'cancelled')),
  notes            text,
  created_by       uuid references auth.users(id),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- Indexes
-- ─────────────────────────────────────────────
create index if not exists idx_recipes_establishment      on recipes(establishment_id);
create index if not exists idx_recipe_ingredients_recipe  on recipe_ingredients(recipe_id);
create index if not exists idx_recipe_components_parent   on recipe_components(parent_recipe_id);
create index if not exists idx_recipe_history_recipe      on recipe_history(recipe_id);
create index if not exists idx_stock_items_establishment  on stock_items(establishment_id);
create index if not exists idx_stock_movements_item       on stock_movements(stock_item_id);
create index if not exists idx_production_orders_recipe   on production_orders(recipe_id);
create index if not exists idx_production_orders_status   on production_orders(status);

-- ─────────────────────────────────────────────
-- Row Level Security (enable, policies to be
-- configured per-project in Supabase dashboard)
-- ─────────────────────────────────────────────
alter table recipes           enable row level security;
alter table recipe_ingredients enable row level security;
alter table recipe_components  enable row level security;
alter table recipe_history     enable row level security;
alter table stock_items        enable row level security;
alter table stock_movements    enable row level security;
alter table production_orders  enable row level security;

-- Example permissive policy (replace with role-based policies as needed)
create policy "Authenticated users can read recipes"
  on recipes for select
  using (auth.role() = 'authenticated');
