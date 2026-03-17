"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import ErrorAlert from "@/components/ui/error-alert";
import LoadingSpinner from "@/components/ui/loading-spinner";

export default function EditRecipePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [name, setName] = useState("");
  const [category, setCategory] = useState("main");
  const [servings, setServings] = useState("4");
  const [prepTime, setPrepTime] = useState("0");
  const [cookTime, setCookTime] = useState("0");
  const [sellingPrice, setSellingPrice] = useState("");
  const [allergens, setAllergens] = useState("");
  const [notes, setNotes] = useState("");
  const [steps, setSteps] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("recipes").select("*").eq("id", id).single().then(({ data }) => {
      if (data) {
        setName(data.name);
        setCategory(data.category || "main");
        setServings(String(data.servings));
        setPrepTime(String(data.prep_time));
        setCookTime(String(data.cook_time));
        setSellingPrice(data.selling_price ? String(data.selling_price) : "");
        setAllergens(data.allergens || "");
        setNotes(data.notes || "");
        setSteps(data.steps || "");
      }
      setFetching(false);
    });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.from("recipes").update({
      name: name.trim(),
      category,
      servings: Number(servings),
      prep_time: Number(prepTime),
      cook_time: Number(cookTime),
      selling_price: sellingPrice ? Number(sellingPrice) : null,
      allergens: allergens || null,
      notes: notes || null,
      steps: steps || null,
      updated_at: new Date().toISOString(),
    }).eq("id", id);
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push(`/recipes/${id}`);
      router.refresh();
    }
  };

  if (fetching) return <LoadingSpinner className="mt-12" />;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Recipe</h1>
      {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
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
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Servings" type="number" min="1" value={servings} onChange={(e) => setServings(e.target.value)} />
            <Input label="Prep Time (min)" type="number" min="0" value={prepTime} onChange={(e) => setPrepTime(e.target.value)} />
            <Input label="Cook Time (min)" type="number" min="0" value={cookTime} onChange={(e) => setCookTime(e.target.value)} />
          </div>
          <Input label="Selling Price (€)" type="number" min="0" step="0.01" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} placeholder="Optional" />
          <Input label="Allergens" value={allergens} onChange={(e) => setAllergens(e.target.value)} placeholder="e.g. gluten, dairy" />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Steps</label>
            <textarea value={steps} onChange={(e) => setSteps(e.target.value)} rows={4}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kitchen-500" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kitchen-500" />
          </div>
        </div>
        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Update Recipe"}</Button>
          <Button type="button" variant="secondary" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
