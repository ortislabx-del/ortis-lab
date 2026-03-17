import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Button from "@/components/ui/button";

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  validated: "bg-blue-100 text-blue-700",
  done: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default async function ProductionPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("production_orders")
    .select("*, recipes(name)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Production Orders</h1>
        <Link href="/production/new"><Button>+ New Order</Button></Link>
      </div>

      {orders && orders.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Recipe</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Quantity</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Notes</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {(order.recipes as { name: string } | null)?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right">{Number(order.quantity).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[order.status] || "bg-gray-100 text-gray-700"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{order.notes || "—"}</td>
                  <td className="px-4 py-3 text-gray-400">{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p>No production orders yet.</p>
          <Link href="/production/new" className="mt-2 inline-block text-kitchen-600 hover:underline">Create your first order</Link>
        </div>
      )}
    </div>
  );
}
