"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import ErrorAlert from "@/components/ui/error-alert";
import { calculateIngredientCost } from "@/lib/calculations";
import type { RecipeIngredient, RecipeType } from "@/types/recipe";

type StockOption = { id: string; name: string; unit: string; average_unit_cost: number | null };

export default function NewRecipePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("main");
  const [recipeType, setRecipeType] = useState<RecipeType>("simple");
  const [servings, setServings] = useState("4");
  const [prepTime, setPrepTime] = useState("0");
  const [cookTime, setCookTime] = useState("0");
  const [sellingPrice, setSellingPrice] = useState("");
  const [allergens, setAllergens] = useState("");
  const [notes, setNotes] = useState("");
  const [steps, setSteps] = useState("");
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);
  const [stockOptions, setStockOptions] = useState<StockOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("stock_items").select("id, name, unit, average_unit_cost").order("name")
      .then(({ data }) => setStockOptions(data || []));
  }, []);

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: 0, unit: "g" }]);
  };

  const updateIngredient = (index: number, field: keyof RecipeIngredient, value: string | number) => {
    const updated = [...ingredients];
    (updated[index] as Record<string, unknown>)[field] = value;
    setIngredients(updated);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const selectStockItem = (index: number, stockId: string) => {
    const item = stockOptions.find((s) => s.id === stockId);
    if (item) {
      const updated = [...ingredients];
      updated[index] = {
        ...updated[index],
        stock_item_id: item.id,
        name: item.name,
        unit: item.unit,
        unitCost: item.average_unit_cost ? Number(item.average_unit_cost) : 0,
      };
      setIngredients(updated);
    }
  };

  const totalCost = calculateIngredientCost(ingredients);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();

    const { data: recipeData, error: recipeError } = await supabase
      .from("recipes")
      .insert({
        name: name.trim(),
        category,
        recipe_type: recipeType,
        servings: Number(servings),
        prep_time: Number(prepTime),
        cook_time: Number(cookTime),
        total_cost: totalCost,
        selling_price: sellingPrice ? Number(sellingPrice) : null,
        allergens: allergens || null,
        notes: notes || null,
        steps: steps || null,
      })
      .select()
      .single();

    if (recipeError) {
      setError(recipeError.message);
      setLoading(false);
      return;
    }

    if (ingredients.length > 0) {
      const { error: ingError } = await supabase.from("recipe_ingredients").insert(
        ingredients.map((ing, i) => ({
          recipe_id: recipeData.id,
          stock_item_id: ing.stock_item_id || null,
          name: ing.name,
          quantity: Number(ing.quantity),
          unit: ing.unit,
          unit_cost: ing.unitCost || null,
          sort_order: i,
        }))
      );
      if (ingError) {
        setError(ingError.message);
        setLoading(false);
        return;
      }
    }

    router.push(`/recipes/${recipeData.id}`);
    router.refresh();
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">New Recipe</h1>
      {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-800">Basic Info</h2>
          <Input label="Recipe Name" value={name} onChange={(e) => setName(e.target.value)} required />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kitchen-500">
                {["appetizer", "main", "dessert", "sauce", "other"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Type</label>
              <select value={recipeType} onChange={(e) => setRecipeType(e.target.value as RecipeType)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kitchen-500">
                <option value="simple">Simple</option>
                <option value="composed">Composed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input label="Servings" type="number" min="1" value={servings} onChange={(e) => setServings(e.target.value)} />
            <Input label="Prep Time (min)" type="number" min="0" value={prepTime} onChange={(e) => setPrepTime(e.target.value)} />
            <Input label="Cook Time (min)" type="number" min="0" value={cookTime} onChange={(e) => setCookTime(e.target.value)} />
          </div>

          <Input
            label="Selling Price (€)"
            type="number"
            min="0"
            step="0.01"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value)}
            placeholder="Optional"
          />
          <Input label="Allergens" value={allergens} onChange={(e) => setAllergens(e.target.value)} placeholder="e.g. gluten, dairy" />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Ingredients</h2>
            <Button type="button" variant="secondary" size="sm" onClick={addIngredient}>
              + Add
            </Button>
          </div>

          {ingredients.map((ing, i) => (
            <div key={i} className="flex gap-2 mb-2 items-start">
              <div className="flex-1">
                <select
                  value={ing.stock_item_id || ""}
                  onChange={(e) => selectStockItem(i, e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-kitchen-500 mb-1"
                >
                  <option value="">Select stock item…</option>
                  {stockOptions.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={ing.name}
                  onChange={(e) => updateIngredient(i, "name", e.target.value)}
                  placeholder="Name"
                  className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-kitchen-500"
                />
              </div>
              <input
                type="number"
                value={ing.quantity}
                min="0"
                step="0.01"
                onChange={(e) => updateIngredient(i, "quantity", Number(e.target.value))}
                className="w-20 border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-kitchen-500"
                placeholder="Qty"
              />
              <select
                value={ing.unit}
                onChange={(e) => updateIngredient(i, "unit", e.target.value)}
                className="w-16 border border-gray-300 rounded-lg px-1 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-kitchen-500"
              >
                {["g", "kg", "ml", "l", "pieces", "tbsp", "tsp"].map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
              <button type="button" onClick={() => removeIngredient(i)} className="text-red-400 hover:text-red-600 text-lg leading-none mt-1">
                ×
              </button>
            </div>
          ))}

          {ingredients.length > 0 && (
            <p className="text-right text-sm font-medium text-gray-700 mt-3">
              Total cost: <span className="text-kitchen-700">€{totalCost.toFixed(4)}</span>
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-800">Details</h2>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Steps</label>
            <textarea
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              rows={4}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kitchen-500"
              placeholder="Step 1: …"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kitchen-500"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Create Recipe"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
