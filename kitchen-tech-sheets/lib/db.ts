import { createClient } from "@/lib/supabase/server";
import { Recipe, StockItem, ProductionOrder } from "@/types/recipe";

export async function getRecipes(): Promise<Recipe[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recipes")
    .select(`*, recipe_ingredients(*), recipe_components(*)`)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data || []).map((row) => ({
    id: row.id,
    establishment_id: row.establishment_id,
    name: row.name,
    category: row.category,
    recipeType: row.recipe_type,
    servings: row.servings,
    prepTime: row.prep_time,
    cookTime: row.cook_time,
    totalCost: Number(row.total_cost),
    sellingPrice: row.selling_price ? Number(row.selling_price) : undefined,
    allergens: row.allergens,
    notes: row.notes,
    steps: row.steps,
    ingredients: (row.recipe_ingredients || []).map((ri: Record<string, unknown>) => ({
      id: ri.id as string,
      recipe_id: ri.recipe_id as string,
      stock_item_id: ri.stock_item_id as string | undefined,
      name: ri.name as string,
      quantity: Number(ri.quantity),
      unit: ri.unit as string,
      unitCost: ri.unit_cost ? Number(ri.unit_cost) : undefined,
      sort_order: ri.sort_order as number | undefined,
    })),
    components: (row.recipe_components || []).map((rc: Record<string, unknown>) => ({
      id: rc.id as string,
      parent_recipe_id: rc.parent_recipe_id as string,
      childRecipeId: rc.child_recipe_id as string,
      quantity: Number(rc.quantity),
      unit: rc.unit as string,
      sortOrder: rc.sort_order as number | undefined,
      totalCost: rc.total_cost ? Number(rc.total_cost) : undefined,
    })),
    created_at: row.created_at,
    updated_at: row.updated_at,
  }));
}

export async function getRecipeById(id: string): Promise<Recipe | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recipes")
    .select(`*, recipe_ingredients(*), recipe_components(*)`)
    .eq("id", id)
    .single();

  if (error) return null;
  if (!data) return null;

  return {
    id: data.id,
    establishment_id: data.establishment_id,
    name: data.name,
    category: data.category,
    recipeType: data.recipe_type,
    servings: data.servings,
    prepTime: data.prep_time,
    cookTime: data.cook_time,
    totalCost: Number(data.total_cost),
    sellingPrice: data.selling_price ? Number(data.selling_price) : undefined,
    allergens: data.allergens,
    notes: data.notes,
    steps: data.steps,
    ingredients: (data.recipe_ingredients || []).map((ri: Record<string, unknown>) => ({
      id: ri.id as string,
      recipe_id: ri.recipe_id as string,
      stock_item_id: ri.stock_item_id as string | undefined,
      name: ri.name as string,
      quantity: Number(ri.quantity),
      unit: ri.unit as string,
      unitCost: ri.unit_cost ? Number(ri.unit_cost) : undefined,
      sort_order: ri.sort_order as number | undefined,
    })),
    components: (data.recipe_components || []).map((rc: Record<string, unknown>) => ({
      id: rc.id as string,
      parent_recipe_id: rc.parent_recipe_id as string,
      childRecipeId: rc.child_recipe_id as string,
      quantity: Number(rc.quantity),
      unit: rc.unit as string,
      sortOrder: rc.sort_order as number | undefined,
      totalCost: rc.total_cost ? Number(rc.total_cost) : undefined,
    })),
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

export async function getStockItems(): Promise<StockItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("stock_items")
    .select("*")
    .order("name");

  if (error) throw new Error(error.message);

  return (data || []).map((row) => ({
    id: row.id,
    establishmentId: row.establishment_id,
    name: row.name,
    unit: row.unit,
    quantityInStock: Number(row.quantity_in_stock),
    minQuantity: Number(row.min_quantity),
    averageUnitCost: row.average_unit_cost ? Number(row.average_unit_cost) : undefined,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }));
}

export async function getProductionOrders(): Promise<ProductionOrder[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("production_orders")
    .select(`*, recipes(name)`)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data || []).map((row) => ({
    id: row.id,
    establishmentId: row.establishment_id,
    recipeId: row.recipe_id,
    recipeName: row.recipes?.name,
    quantity: Number(row.quantity),
    status: row.status,
    notes: row.notes,
    created_by: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}
