// TypeScript types matching the Supabase database schema
export type DbRecipe = {
  id: string;
  establishment_id: string | null;
  name: string;
  category: string;
  recipe_type: "simple" | "composed";
  servings: number;
  prep_time: number;
  cook_time: number;
  total_cost: number;
  selling_price: number | null;
  allergens: string | null;
  notes: string | null;
  steps: string | null;
  created_at: string;
  updated_at: string;
};

export type DbRecipeIngredient = {
  id: string;
  recipe_id: string;
  stock_item_id: string | null;
  name: string;
  quantity: number;
  unit: string;
  unit_cost: number | null;
  sort_order: number;
};

export type DbRecipeComponent = {
  id: string;
  parent_recipe_id: string;
  child_recipe_id: string;
  quantity: number;
  unit: string;
  sort_order: number;
  total_cost: number | null;
};

export type DbStockItem = {
  id: string;
  establishment_id: string | null;
  name: string;
  unit: string;
  quantity_in_stock: number;
  min_quantity: number;
  average_unit_cost: number | null;
  created_at: string;
  updated_at: string;
};

export type DbStockMovement = {
  id: string;
  stock_item_id: string;
  movement_type: "in" | "out" | "adjustment";
  quantity: number;
  unit_cost: number | null;
  reason: string | null;
  created_by: string | null;
  created_at: string;
};

export type DbProductionOrder = {
  id: string;
  establishment_id: string | null;
  recipe_id: string;
  quantity: number;
  status: "draft" | "validated" | "done" | "cancelled";
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};
