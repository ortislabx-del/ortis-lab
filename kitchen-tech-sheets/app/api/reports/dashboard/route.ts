import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculateFoodCostPercent, getLowStockItems } from "@/lib/calculations";
import { StockItem } from "@/types/recipe";

export async function GET() {
  try {
    const supabase = await createClient();

    const [recipesRes, stockRes, productionRes] = await Promise.all([
      supabase.from("recipes").select("total_cost, selling_price, recipe_type"),
      supabase.from("stock_items").select("*"),
      supabase
        .from("production_orders")
        .select("status")
        .in("status", ["draft", "validated"]),
    ]);

    if (recipesRes.error) throw recipesRes.error;
    if (stockRes.error) throw stockRes.error;

    const recipes = (recipesRes.data ?? []) as Array<{
      total_cost: number;
      selling_price: number | null;
      recipe_type: string;
    }>;
    const stock = (stockRes.data ?? []).map((row: {
      quantity_in_stock: number;
      min_quantity: number;
    }) => ({
      quantityInStock: Number(row.quantity_in_stock),
      minQuantity: Number(row.min_quantity),
    })) as StockItem[];

    const costsWithPrice = recipes.filter((r) => r.selling_price && Number(r.selling_price) > 0);
    const avgFoodCostPercent =
      costsWithPrice.length > 0
        ? costsWithPrice.reduce(
            (sum, r) =>
              sum + calculateFoodCostPercent(Number(r.total_cost), Number(r.selling_price!)),
            0
          ) / costsWithPrice.length
        : 0;

    const totalRecipes = recipes.length;
    const simpleRecipes = recipes.filter((r) => r.recipe_type === "simple").length;
    const composedRecipes = recipes.filter((r) => r.recipe_type === "composed").length;

    return NextResponse.json({
      totalRecipes,
      simpleRecipes,
      composedRecipes,
      totalIngredients: stock.length,
      lowStockCount: getLowStockItems(stock).length,
      totalProductionOrders: productionRes.data?.length ?? 0,
      pendingOrders: productionRes.data?.filter((o: { status: string }) => o.status === "validated").length ?? 0,
      avgFoodCostPercent,
    });
  } catch (error) {
    console.error("GET /api/reports/dashboard", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
