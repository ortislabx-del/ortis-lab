-- Supabase Schema for Kitchen Tech Sheets
-- Run this in your Supabase SQL editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- User roles enum
create type user_role as enum ('admin', 'chef', 'staff');

-- Profiles table (extends Supabase auth.users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  role user_role not null default 'staff',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Categories for recipes
create table categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ingredients / stock items
create table ingredients (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  unit text not null,
  cost_per_unit numeric(10, 4) not null default 0,
  current_stock numeric(10, 3) not null default 0,
  min_stock numeric(10, 3) not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Recipes
create table recipes (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  category_id uuid references categories(id),
  portions integer not null default 1,
  prep_time integer, -- minutes
  cook_time integer, -- minutes
  instructions text,
  notes text,
  is_active boolean not null default true,
  created_by uuid references profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Recipe components (ingredients used in a recipe)
create table recipe_components (
  id uuid default uuid_generate_v4() primary key,
  recipe_id uuid references recipes(id) on delete cascade not null,
  ingredient_id uuid references ingredients(id) not null,
  quantity numeric(10, 3) not null,
  unit text not null,
  notes text
);

-- Productions (batches made from a recipe)
create table productions (
  id uuid default uuid_generate_v4() primary key,
  recipe_id uuid references recipes(id) not null,
  portions_produced integer not null,
  produced_at timestamp with time zone default timezone('utc'::text, now()) not null,
  produced_by uuid references profiles(id),
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Stock movements
create type movement_type as enum ('in', 'out', 'adjustment', 'production');

create table stock_movements (
  id uuid default uuid_generate_v4() primary key,
  ingredient_id uuid references ingredients(id) not null,
  quantity numeric(10, 3) not null, -- positive = in, negative = out
  movement_type movement_type not null,
  reference text, -- e.g., production ID, supplier invoice
  production_id uuid references productions(id),
  notes text,
  created_by uuid references profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes
create index idx_recipes_category on recipes(category_id);
create index idx_recipe_components_recipe on recipe_components(recipe_id);
create index idx_recipe_components_ingredient on recipe_components(ingredient_id);
create index idx_productions_recipe on productions(recipe_id);
create index idx_stock_movements_ingredient on stock_movements(ingredient_id);
create index idx_stock_movements_created_at on stock_movements(created_at);

-- RLS Policies
alter table profiles enable row level security;
alter table categories enable row level security;
alter table ingredients enable row level security;
alter table recipes enable row level security;
alter table recipe_components enable row level security;
alter table productions enable row level security;
alter table stock_movements enable row level security;

-- Profiles: users can read all, update own
create policy "Profiles are viewable by authenticated users" on profiles
  for select using (auth.role() = 'authenticated');

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

-- Categories: readable by all authenticated
create policy "Categories are viewable by authenticated users" on categories
  for select using (auth.role() = 'authenticated');

create policy "Admins can manage categories" on categories
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- Ingredients: readable by all, manageable by admin/chef
create policy "Ingredients are viewable by authenticated users" on ingredients
  for select using (auth.role() = 'authenticated');

create policy "Chefs and admins can manage ingredients" on ingredients
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'chef'))
  );

-- Recipes: readable by all authenticated
create policy "Recipes are viewable by authenticated users" on recipes
  for select using (auth.role() = 'authenticated');

create policy "Chefs and admins can manage recipes" on recipes
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'chef'))
  );

-- Recipe components: follow recipe policy
create policy "Recipe components are viewable by authenticated users" on recipe_components
  for select using (auth.role() = 'authenticated');

create policy "Chefs and admins can manage recipe components" on recipe_components
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'chef'))
  );

-- Productions: readable by all, manageable by all authenticated
create policy "Productions are viewable by authenticated users" on productions
  for select using (auth.role() = 'authenticated');

create policy "Authenticated users can create productions" on productions
  for insert with check (auth.role() = 'authenticated');

create policy "Admins can manage productions" on productions
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- Stock movements: readable by all, manageable by admin/chef
create policy "Stock movements are viewable by authenticated users" on stock_movements
  for select using (auth.role() = 'authenticated');

create policy "Chefs and admins can manage stock movements" on stock_movements
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'chef'))
  );

-- Function to update ingredient stock on production
create or replace function update_stock_on_production()
returns trigger as $$
begin
  -- Deduct ingredients used in production
  insert into stock_movements (ingredient_id, quantity, movement_type, production_id, created_by)
  select
    rc.ingredient_id,
    -(rc.quantity * new.portions_produced),
    'production'::movement_type,
    new.id,
    new.produced_by
  from recipe_components rc
  where rc.recipe_id = new.recipe_id;

  -- Update current stock for each ingredient
  update ingredients i
  set current_stock = i.current_stock - (rc.quantity * new.portions_produced)
  from recipe_components rc
  where rc.recipe_id = new.recipe_id and rc.ingredient_id = i.id;

  return new;
end;
$$ language plpgsql security definer;

create trigger on_production_created
  after insert on productions
  for each row execute procedure update_stock_on_production();

-- Function to update stock on stock movement
create or replace function update_stock_on_movement()
returns trigger as $$
begin
  update ingredients
  set current_stock = current_stock + new.quantity
  where id = new.ingredient_id;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_stock_movement_created
  after insert on stock_movements
  for each row
  when (new.movement_type != 'production'::movement_type)
  execute procedure update_stock_on_movement();
