import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculateIngredientCost, calculateFoodCostPercent, calculateMargin } from "@/lib/calculations";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("recipes")
      .select("*, recipe_ingredients(*)")
      .eq("id", id)
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 404 });

    const ingredients = (data.recipe_ingredients || []).map((ri: Record<string, unknown>) => ({
      name: ri.name as string,
      quantity: Number(ri.quantity),
      unit: ri.unit as string,
      unitCost: ri.unit_cost ? Number(ri.unit_cost) : 0,
    }));

    const totalCost = calculateIngredientCost(ingredients);
    const sellingPrice = data.selling_price ? Number(data.selling_price) : 0;

    return NextResponse.json({
      totalCost,
      sellingPrice,
      margin: calculateMargin(totalCost, sellingPrice),
      foodCostPercent: calculateFoodCostPercent(totalCost, sellingPrice),
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
