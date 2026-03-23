import { createClient } from "@/lib/supabase/server";
import { DashboardStatsPanel } from "@/components/dashboard-stats";
import { LowStockAlert } from "@/components/ingredients/low-stock-alert";
import { getLowStockItems } from "@/lib/calculations";
import { calculateFoodCostPercent } from "@/lib/calculations";
import Link from "next/link";
import { Plus, BookOpen, ShoppingBasket } from "lucide-react";
import { StockItem } from "@/types/recipe";
import { DashboardStats } from "@/types/recipe";

async function getStats(): Promise<{ stats: DashboardStats; lowStock: StockItem[] }> {
  try {
    const supabase = await createClient();

    const [recipesRes, stockRes, productionRes] = await Promise.all([
      supabase.from("recipes").select("total_cost, selling_price, recipe_type"),
      supabase.from("stock_items").select("*"),
      supabase.from("production_orders").select("status"),
    ]);

    const recipes = recipesRes.data ?? [];
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
      (r: { selling_price: number | null }) => r.selling_price && Number(r.selling_price) > 0
    );
    const avgFoodCostPercent =
      costsWithPrice.length > 0
        ? costsWithPrice.reduce(
            (sum: number, r: { total_cost: number; selling_price: number }) =>
              sum + calculateFoodCostPercent(Number(r.total_cost), Number(r.selling_price)),
            0
          ) / costsWithPrice.length
        : 0;

    return {
      stats: {
        totalRecipes: recipes.length,
        simpleRecipes: recipes.filter((r: { recipe_type: string }) => r.recipe_type === "simple").length,
        composedRecipes: recipes.filter((r: { recipe_type: string }) => r.recipe_type === "composed").length,
        totalIngredients: stockItems.length,
        lowStockCount: getLowStockItems(stockItems).length,
        totalProductionOrders: production.length,
        pendingOrders: production.filter((o: { status: string }) => o.status === "validated").length,
        avgFoodCostPercent,
      },
      lowStock: getLowStockItems(stockItems),
    };
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
      },
      lowStock: [],
    };
  }
}

export default async function DashboardPage() {
  const { stats, lowStock } = await getStats();

  return (
    <div className="space-y-6">
      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/recipes/new"
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          Nouvelle recette
        </Link>
        <Link
          href="/ingredients/new"
          className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <ShoppingBasket className="h-4 w-4" />
          Ajouter un ingrédient
        </Link>
        <Link
          href="/production/new"
          className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <BookOpen className="h-4 w-4" />
          Commande de production
        </Link>
      </div>

      {/* Stats */}
      <DashboardStatsPanel stats={stats} />

      {/* Low stock alert */}
      {lowStock.length > 0 && <LowStockAlert items={lowStock} />}

      {/* Recent sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="mb-4 font-semibold text-gray-900">Liens rapides</h3>
          <div className="space-y-2">
            {[
              { href: "/recipes", label: "Toutes les recettes" },
              { href: "/recipes/new", label: "Créer une recette" },
              { href: "/ingredients", label: "Gestion des ingrédients" },
              { href: "/stock", label: "État du stock" },
              { href: "/production", label: "Commandes de production" },
              { href: "/reports", label: "Rapports & Analytics" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <span>{label}</span>
                <span className="text-gray-400">→</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="mb-4 font-semibold text-gray-900">À propos</h3>
          <p className="text-sm text-gray-600">
            <strong>Kitchen Tech Sheets</strong> est votre système de gestion de fiches
            techniques culinaires. Créez, gérez et calculez automatiquement vos recettes
            professionnelles.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <span className="badge-green">✓</span>
              Recettes simples et composées
            </li>
            <li className="flex items-center gap-2">
              <span className="badge-green">✓</span>
              Calcul automatique des coûts
            </li>
            <li className="flex items-center gap-2">
              <span className="badge-green">✓</span>
              Gestion du stock en temps réel
            </li>
            <li className="flex items-center gap-2">
              <span className="badge-green">✓</span>
              Commandes de production
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
