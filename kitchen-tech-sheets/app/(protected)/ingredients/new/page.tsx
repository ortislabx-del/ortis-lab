"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import ErrorAlert from "@/components/ui/error-alert";

export default function NewIngredientPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("g");
  const [quantityInStock, setQuantityInStock] = useState("0");
  const [minQuantity, setMinQuantity] = useState("0");
  const [averageUnitCost, setAverageUnitCost] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.from("stock_items").insert({
      name: name.trim(),
      unit,
      quantity_in_stock: Number(quantityInStock),
      min_quantity: Number(minQuantity),
      average_unit_cost: averageUnitCost ? Number(averageUnitCost) : null,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/ingredients");
      router.refresh();
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">New Ingredient</h1>

      {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Unit</label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kitchen-500"
          >
            {["g", "kg", "ml", "l", "pieces", "tbsp", "tsp", "cup", "oz"].map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>

        <Input
          label="Quantity in Stock"
          type="number"
          min="0"
          step="0.01"
          value={quantityInStock}
          onChange={(e) => setQuantityInStock(e.target.value)}
        />
        <Input
          label="Minimum Quantity"
          type="number"
          min="0"
          step="0.01"
          value={minQuantity}
          onChange={(e) => setMinQuantity(e.target.value)}
        />
        <Input
          label="Average Unit Cost (€)"
          type="number"
          min="0"
          step="0.0001"
          value={averageUnitCost}
          onChange={(e) => setAverageUnitCost(e.target.value)}
          placeholder="Optional"
        />

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Ingredient"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
