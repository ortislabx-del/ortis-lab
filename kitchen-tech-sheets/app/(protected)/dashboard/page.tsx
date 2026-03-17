import { createClient } from "@/lib/supabase/server";
import { getLowStockItems } from "@/lib/calculations";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [recipesRes, stockRes, ordersRes] = await Promise.all([
    supabase.from("recipes").select("id, name, total_cost, selling_price", { count: "exact" }),
    supabase.from("stock_items").select("*"),
    supabase.from("production_orders").select("id, status").eq("status", "draft"),
  ]);

  const recipeCount = recipesRes.count ?? 0;
  const stockItems = (stockRes.data || []).map((row) => ({
    id: row.id,
    name: row.name,
    unit: row.unit,
    quantityInStock: Number(row.quantity_in_stock),
    minQuantity: Number(row.min_quantity),
    averageUnitCost: row.average_unit_cost ? Number(row.average_unit_cost) : undefined,
  }));
  const lowStock = getLowStockItems(stockItems);
  const draftOrders = ordersRes.data?.length ?? 0;

  const totalFoodCost = (recipesRes.data || []).reduce(
    (sum, r) => sum + Number(r.total_cost || 0),
    0
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Recipes" value={recipeCount} color="blue" />
        <StatCard label="Low Stock Alerts" value={lowStock.length} color="red" />
        <StatCard label="Draft Orders" value={draftOrders} color="yellow" />
        <StatCard
          label="Total Food Cost"
          value={`€${totalFoodCost.toFixed(2)}`}
          color="green"
        />
      </div>

      {lowStock.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <h2 className="font-semibold text-red-800 mb-2">⚠️ Low Stock Items</h2>
          <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
            {lowStock.map((item) => (
              <li key={item.id}>
                {item.name} — {item.quantityInStock} {item.unit} (min: {item.minQuantity})
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickLink href="/recipes/new" label="➕ New Recipe" />
        <QuickLink href="/ingredients/new" label="🥬 Add Ingredient" />
        <QuickLink href="/production/new" label="🏭 New Production Order" />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: "blue" | "red" | "yellow" | "green";
}) {
  const colors = {
    blue: "bg-blue-50 border-blue-200 text-blue-800",
    red: "bg-red-50 border-red-200 text-red-800",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-800",
    green: "bg-green-50 border-green-200 text-green-800",
  };

  return (
    <div className={`p-4 rounded-xl border ${colors[color]}`}>
      <p className="text-sm font-medium opacity-70">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-center p-4 bg-white rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-kitchen-300 transition-colors"
    >
      {label}
    </Link>
  );
}
