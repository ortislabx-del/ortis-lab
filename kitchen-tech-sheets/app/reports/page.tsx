import { createClient } from "@/lib/supabase/server";
import { ReportCards } from "@/components/report-cards";
import { DashboardStats } from "@/types/recipe";
import { calculateFoodCostPercent, getLowStockItems } from "@/lib/calculations";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { StockItem } from "@/types/recipe";

async function getReportData() {
  try {
    const supabase = await createClient();
    const [recipesRes, stockRes, productionRes] = await Promise.all([
      supabase.from("recipes").select("id, name, total_cost, selling_price, recipe_type"),
      supabase.from("stock_items").select("*"),
      supabase.from("production_orders").select("status"),
    ]);

    const recipes = (recipesRes.data ?? []) as Array<{
      id: string;
      name: string;
      total_cost: number;
      selling_price: number | null;
      recipe_type: string;
    }>;
    const stockRaw = stockRes.data ?? [];
    const production = productionRes.data ?? [];

    const stockItems: StockItem[] = stockRaw.map((row: {
      id: string;
      name: string;
      unit: string;
      quantity_in_stock: number;
      min_quantity: number;
      average_unit_cost?: number;
    }) => ({
      id: row.id,
      name: row.name,
      unit: row.unit,
      quantityInStock: Number(row.quantity_in_stock),
      minQuantity: Number(row.min_quantity),
      averageUnitCost: row.average_unit_cost != null ? Number(row.average_unit_cost) : undefined,
    }));

    const costsWithPrice = recipes.filter(
      (r) => r.selling_price && Number(r.selling_price) > 0
    );
    const avgFoodCostPercent =
      costsWithPrice.length > 0
        ? costsWithPrice.reduce(
            (sum, r) =>
              sum + calculateFoodCostPercent(Number(r.total_cost), Number(r.selling_price!)),
            0
          ) / costsWithPrice.length
        : 0;

    const stats: DashboardStats = {
      totalRecipes: recipes.length,
      simpleRecipes: recipes.filter((r) => r.recipe_type === "simple").length,
      composedRecipes: recipes.filter((r) => r.recipe_type === "composed").length,
      totalIngredients: stockItems.length,
      lowStockCount: getLowStockItems(stockItems).length,
      totalProductionOrders: production.length,
      pendingOrders: production.filter((o: { status: string }) => o.status === "validated").length,
      avgFoodCostPercent,
    };

    return { stats, recipes, stockItems };
  } catch {
    return {
      stats: {
        totalRecipes: 0,
        simpleRecipes: 0,
        composedRecipes: 0,
        totalIngredients: 0,
        lowStockCount: 0,
        totalProductionOrders: 0,
        pendingOrders: 0,
        avgFoodCostPercent: 0,
      } as DashboardStats,
      recipes: [],
      stockItems: [],
    };
  }
}

export default async function ReportsPage() {
  const { stats, recipes } = await getReportData();

  // Top expensive recipes
  const topExpensive = [...recipes]
    .filter((r) => r.total_cost > 0)
    .sort((a, b) => Number(b.total_cost) - Number(a.total_cost))
    .slice(0, 5);

  // Highest food cost
  const highFoodCost = recipes
    .filter((r) => r.selling_price && Number(r.selling_price) > 0)
    .map((r) => ({
      ...r,
      foodCost: calculateFoodCostPercent(Number(r.total_cost), Number(r.selling_price!)),
    }))
    .sort((a, b) => b.foodCost - a.foodCost)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <ReportCards stats={stats} />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top expensive recipes */}
        <div className="card">
          <h3 className="mb-4 font-semibold text-gray-900">
            Recettes les plus coûteuses
          </h3>
          {topExpensive.length === 0 ? (
            <p className="text-sm text-gray-400">Pas de données</p>
          ) : (
            <ul className="space-y-2">
              {topExpensive.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between text-sm"
                >
                  <Link
                    href={`/recipes/${r.id}`}
                    className="text-gray-800 hover:text-primary-600 hover:underline"
                  >
                    {r.name}
                  </Link>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(Number(r.total_cost))}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Highest food cost % */}
        <div className="card">
          <h3 className="mb-4 font-semibold text-gray-900">
            Coût alimentaire le plus élevé
          </h3>
          {highFoodCost.length === 0 ? (
            <p className="text-sm text-gray-400">Pas de données</p>
          ) : (
            <ul className="space-y-2">
              {highFoodCost.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between text-sm"
                >
                  <Link
                    href={`/recipes/${r.id}`}
                    className="text-gray-800 hover:text-primary-600 hover:underline"
                  >
                    {r.name}
                  </Link>
                  <span
                    className={`font-medium ${
                      r.foodCost > 40
                        ? "text-red-600"
                        : r.foodCost > 30
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {r.foodCost.toFixed(1)}%
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Distribution */}
      <div className="card">
        <h3 className="mb-4 font-semibold text-gray-900">Distribution des recettes</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{stats.simpleRecipes}</p>
            <p className="text-sm text-gray-500">Recettes simples</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-600">{stats.composedRecipes}</p>
            <p className="text-sm text-gray-500">Recettes composées</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">{stats.totalRecipes}</p>
            <p className="text-sm text-gray-500">Total</p>
          </div>
        </div>
      </div>
    </div>
  );
}
