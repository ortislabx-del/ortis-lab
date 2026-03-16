import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getRecipes } from "@/lib/supabase/queries";
import { calculateIngredientCost, calculateComponentCost } from "@/lib/calculations";

export async function GET() {
  try {
    const supabase = await createClient();
    const recipes = await getRecipes(supabase);
    return NextResponse.json(recipes);
  } catch (error) {
    console.error("GET /api/recipes", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const totalCost =
      body.recipeType === "simple"
        ? calculateIngredientCost(body.ingredients ?? [])
        : calculateComponentCost(body.components ?? []);

    const { data: recipe, error } = await supabase
      .from("recipes")
      .insert({
        name: body.name,
        category: body.category ?? "",
        recipe_type: body.recipeType,
        servings: body.servings ?? 1,
        prep_time: body.prepTime ?? 0,
        cook_time: body.cookTime ?? 0,
        total_cost: totalCost,
        selling_price: body.sellingPrice ?? null,
        allergens: body.allergens ?? null,
        notes: body.notes ?? null,
        steps: body.steps ?? null,
      })
      .select()
      .single();

    if (error) throw error;

    // Insert ingredients
    if (body.recipeType === "simple" && body.ingredients?.length > 0) {
      const ingRows = body.ingredients.map(
        (ing: { name: string; quantity: number; unit: string; unitCost?: number; stockItemId?: string }, idx: number) => ({
          recipe_id: recipe.id,
          name: ing.name,
          quantity: ing.quantity,
          unit: ing.unit,
          unit_cost: ing.unitCost ?? null,
          stock_item_id: ing.stockItemId ?? null,
          sort_order: idx,
        })
      );
      const { error: ingError } = await supabase
        .from("recipe_ingredients")
        .insert(ingRows);
      if (ingError) throw ingError;
    }

    // Insert components
    if (body.recipeType === "composed" && body.components?.length > 0) {
      const compRows = body.components.map(
        (comp: { childRecipeId: string; quantity: number; unit: string; totalCost?: number }, idx: number) => ({
          parent_recipe_id: recipe.id,
          child_recipe_id: comp.childRecipeId,
          quantity: comp.quantity,
          unit: comp.unit,
          total_cost: comp.totalCost ?? null,
          sort_order: idx,
        })
      );
      const { error: compError } = await supabase
        .from("recipe_components")
        .insert(compRows);
      if (compError) throw compError;
    }

    // History
    await supabase.from("recipe_history").insert({
      recipe_id: recipe.id,
      action: "create",
      snapshot: body,
    });

    return NextResponse.json({ ...recipe, ingredients: body.ingredients ?? [], components: body.components ?? [] }, { status: 201 });
  } catch (error) {
    console.error("POST /api/recipes", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
