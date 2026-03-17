"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import ErrorAlert from "@/components/ui/error-alert";

type RecipeOption = { id: string; name: string };

export default function NewProductionOrderPage() {
  const router = useRouter();
  const [recipeId, setRecipeId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [notes, setNotes] = useState("");
  const [recipes, setRecipes] = useState<RecipeOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("recipes").select("id, name").order("name")
      .then(({ data }) => setRecipes(data || []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipeId) { setError("Please select a recipe."); return; }
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.from("production_orders").insert({
      recipe_id: recipeId,
      quantity: Number(quantity),
      status: "draft",
      notes: notes || null,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/production");
      router.refresh();
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">New Production Order</h1>
      {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Recipe</label>
          <select value={recipeId} onChange={(e) => setRecipeId(e.target.value)} required
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kitchen-500">
            <option value="">Select recipe…</option>
            {recipes.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
        <Input label="Quantity" type="number" min="0.01" step="0.01" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Notes</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kitchen-500" />
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Create Order"}</Button>
          <Button type="button" variant="secondary" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
