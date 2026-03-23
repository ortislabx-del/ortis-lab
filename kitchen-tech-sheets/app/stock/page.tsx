import { createClient } from "@/lib/supabase/server";
import { StockSummary } from "@/components/stock/stock-summary";
import { IngredientList } from "@/components/ingredients/ingredient-list";
import Link from "next/link";
import { Plus, ArrowRightLeft } from "lucide-react";
import { StockItem } from "@/types/recipe";

async function getStock(): Promise<StockItem[]> {
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

export default async function StockPage() {
  const stock = await getStock();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <Link
          href="/stock/movements"
          className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <ArrowRightLeft className="h-4 w-4" />
          Voir les mouvements
        </Link>
        <Link
          href="/ingredients/new"
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          Ajouter un article
        </Link>
      </div>

      <StockSummary items={stock} />

      {stock.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <p className="text-gray-400">Aucun article en stock</p>
          <Link
            href="/ingredients/new"
            className="mt-3 text-sm font-medium text-primary-600 hover:underline"
          >
            Ajouter un article →
          </Link>
        </div>
      ) : (
        <IngredientList ingredients={stock} />
      )}
    </div>
  );
}
