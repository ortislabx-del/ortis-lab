import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getRecipeById } from "@/lib/supabase/queries";
import { calculateIngredientCost, calculateComponentCost } from "@/lib/calculations";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const recipe = await getRecipeById(supabase, id);
    if (!recipe) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(recipe);
  } catch (error) {
    console.error("GET /api/recipes/[id]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const body = await request.json();

    const totalCost =
      body.recipeType === "simple"
        ? calculateIngredientCost(body.ingredients ?? [])
        : calculateComponentCost(body.components ?? []);

    const { data: recipe, error } = await supabase
      .from("recipes")
      .update({
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
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // Replace ingredients
    await supabase.from("recipe_ingredients").delete().eq("recipe_id", id);
    if (body.recipeType === "simple" && body.ingredients?.length > 0) {
      const ingRows = body.ingredients.map(
        (ing: { name: string; quantity: number; unit: string; unitCost?: number; stockItemId?: string }, idx: number) => ({
          recipe_id: id,
          name: ing.name,
          quantity: ing.quantity,
          unit: ing.unit,
          unit_cost: ing.unitCost ?? null,
          stock_item_id: ing.stockItemId ?? null,
          sort_order: idx,
        })
      );
      await supabase.from("recipe_ingredients").insert(ingRows);
    }

    // Replace components
    await supabase.from("recipe_components").delete().eq("parent_recipe_id", id);
    if (body.recipeType === "composed" && body.components?.length > 0) {
      const compRows = body.components.map(
        (comp: { childRecipeId: string; quantity: number; unit: string; totalCost?: number }, idx: number) => ({
          parent_recipe_id: id,
          child_recipe_id: comp.childRecipeId,
          quantity: comp.quantity,
          unit: comp.unit,
          total_cost: comp.totalCost ?? null,
          sort_order: idx,
        })
      );
      await supabase.from("recipe_components").insert(compRows);
    }

    // History
    await supabase.from("recipe_history").insert({
      recipe_id: id,
      action: "update",
      snapshot: body,
    });

    return NextResponse.json({ ...recipe, ingredients: body.ingredients ?? [], components: body.components ?? [] });
  } catch (error) {
    console.error("PUT /api/recipes/[id]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // History first (before delete cascade)
    await supabase.from("recipe_history").insert({
      recipe_id: id,
      action: "delete",
    });

    const { error } = await supabase.from("recipes").delete().eq("id", id);
    if (error) throw error;

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE /api/recipes/[id]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
