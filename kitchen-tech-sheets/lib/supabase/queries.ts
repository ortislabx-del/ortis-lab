import { SupabaseClient } from "@supabase/supabase-js";
import { Recipe, RecipeIngredient, RecipeComponent } from "@/types/recipe";
import {
  DbRecipe,
  DbRecipeIngredient,
  DbRecipeComponent,
} from "@/lib/supabase/schemas";

// ─── Mappers ────────────────────────────────────────────────────────────────

export function mapDbIngredient(row: DbRecipeIngredient): RecipeIngredient {
  return {
    id: row.id,
    name: row.name,
    quantity: Number(row.quantity),
    unit: row.unit,
    unitCost: row.unit_cost != null ? Number(row.unit_cost) : undefined,
    stockItemId: row.stock_item_id ?? undefined,
    sortOrder: row.sort_order,
  };
}

export function mapDbComponent(row: DbRecipeComponent): RecipeComponent {
  return {
    id: row.id,
    childRecipeId: row.child_recipe_id,
    quantity: Number(row.quantity),
    unit: row.unit,
    sortOrder: row.sort_order,
    totalCost: row.total_cost != null ? Number(row.total_cost) : undefined,
  };
}

export function mapDbRecipe(
  row: DbRecipe,
  ingredients: DbRecipeIngredient[] = [],
  components: DbRecipeComponent[] = []
): Recipe {
  return {
    id: row.id,
    establishmentId: row.establishment_id ?? undefined,
    name: row.name,
    category: row.category,
    recipeType: row.recipe_type,
    servings: row.servings,
    prepTime: row.prep_time,
    cookTime: row.cook_time,
    totalCost: Number(row.total_cost),
    sellingPrice: row.selling_price != null ? Number(row.selling_price) : undefined,
    allergens: row.allergens ?? undefined,
    notes: row.notes ?? undefined,
    steps: row.steps ?? undefined,
    ingredients: ingredients.map(mapDbIngredient),
    components: components.map(mapDbComponent),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

// ─── Queries ────────────────────────────────────────────────────────────────

export async function getRecipes(supabase: SupabaseClient): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as DbRecipe[]).map((r) => mapDbRecipe(r));
}

export async function getRecipeById(
  supabase: SupabaseClient,
  id: string
): Promise<Recipe | null> {
  const [{ data: recipe, error }, { data: ingredients }, { data: components }] =
    await Promise.all([
      supabase.from("recipes").select("*").eq("id", id).single(),
      supabase
        .from("recipe_ingredients")
        .select("*")
        .eq("recipe_id", id)
        .order("sort_order"),
      supabase
        .from("recipe_components")
        .select("*, child:recipes!child_recipe_id(name)")
        .eq("parent_recipe_id", id)
        .order("sort_order"),
    ]);

  if (error || !recipe) return null;

  const mappedComponents = (components ?? []).map((c: DbRecipeComponent & { child?: { name: string } }) => ({
    ...mapDbComponent(c),
    childRecipeName: c.child?.name,
  }));

  return mapDbRecipe(
    recipe as DbRecipe,
    (ingredients ?? []) as DbRecipeIngredient[],
    mappedComponents as unknown as DbRecipeComponent[]
  );
}
