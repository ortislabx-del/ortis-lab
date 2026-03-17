import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Button from "@/components/ui/button";

export default async function IngredientsPage() {
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("stock_items")
    .select("*")
    .order("name");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Ingredients</h1>
        <Link href="/ingredients/new">
          <Button>+ New Ingredient</Button>
        </Link>
      </div>

      {items && items.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Unit</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">In Stock</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Min Qty</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Unit Cost</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item) => {
                const isLow = Number(item.quantity_in_stock) <= Number(item.min_quantity);
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {item.name}
                      {isLow && (
                        <span className="ml-2 text-xs text-red-600 font-normal">⚠ Low</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{item.unit}</td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      {Number(item.quantity_in_stock).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-500">
                      {Number(item.min_quantity).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      {item.average_unit_cost ? `€${Number(item.average_unit_cost).toFixed(4)}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/ingredients/${item.id}/edit`}
                        className="text-kitchen-600 hover:underline text-xs"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p>No ingredients yet.</p>
          <Link href="/ingredients/new" className="mt-2 inline-block text-kitchen-600 hover:underline">
            Add your first ingredient
          </Link>
        </div>
      )}
    </div>
  );
}
