import { createClient } from "@/lib/supabase/server";
import { IngredientList } from "@/components/ingredients/ingredient-list";
import { LowStockAlert } from "@/components/ingredients/low-stock-alert";
import { getLowStockItems } from "@/lib/calculations";
import Link from "next/link";
import { Plus } from "lucide-react";
import { StockItem } from "@/types/recipe";

async function getIngredients(): Promise<StockItem[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("stock_items").select("*").order("name");
    return (data ?? []).map((row: {
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
  } catch {
    return [];
  }
}

export default async function IngredientsPage() {
  const ingredients = await getIngredients();
  const lowStock = getLowStockItems(ingredients);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {ingredients.length} ingrédient{ingredients.length > 1 ? "s" : ""}
        </p>
        <Link
          href="/ingredients/new"
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          Ajouter
        </Link>
      </div>

      {lowStock.length > 0 && <LowStockAlert items={lowStock} />}

      {ingredients.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <p className="text-gray-400">Aucun ingrédient</p>
          <Link
            href="/ingredients/new"
            className="mt-3 text-sm font-medium text-primary-600 hover:underline"
          >
            Ajouter un ingrédient →
          </Link>
        </div>
      ) : (
        <IngredientList ingredients={ingredients} />
      )}
    </div>
  );
}
