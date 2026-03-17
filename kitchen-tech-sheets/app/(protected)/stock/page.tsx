import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Button from "@/components/ui/button";

export default async function StockPage() {
  const supabase = await createClient();
  const [stockRes, movementsRes] = await Promise.all([
    supabase.from("stock_items").select("*").order("name"),
    supabase.from("stock_movements").select("*, stock_items(name)").order("created_at", { ascending: false }).limit(10),
  ]);

  const items = stockRes.data || [];
  const movements = movementsRes.data || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Stock</h1>
        <Link href="/ingredients/new"><Button>+ Add Item</Button></Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Item</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">In Stock</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">Min Qty</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item) => {
              const isLow = Number(item.quantity_in_stock) <= Number(item.min_quantity);
              return (
                <tr key={item.id}>
                  <td className="px-4 py-3 font-medium text-gray-900">{item.name} <span className="text-gray-400 font-normal">({item.unit})</span></td>
                  <td className="px-4 py-3 text-right">{Number(item.quantity_in_stock).toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-gray-500">{Number(item.min_quantity).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isLow ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                      {isLow ? "⚠ Low" : "OK"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <h2 className="text-lg font-semibold text-gray-800 mb-3">Recent Movements</h2>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Item</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Type</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">Qty</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Reason</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {movements.map((m) => (
              <tr key={m.id}>
                <td className="px-4 py-3">{(m.stock_items as { name: string } | null)?.name ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    m.movement_type === "in" ? "bg-green-100 text-green-700" :
                    m.movement_type === "out" ? "bg-red-100 text-red-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>{m.movement_type}</span>
                </td>
                <td className="px-4 py-3 text-right">{Number(m.quantity).toFixed(2)}</td>
                <td className="px-4 py-3 text-gray-500">{m.reason || "—"}</td>
                <td className="px-4 py-3 text-gray-400">{new Date(m.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {movements.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No movements yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
