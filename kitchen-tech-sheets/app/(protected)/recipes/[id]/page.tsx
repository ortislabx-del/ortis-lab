import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { calculateFoodCostPercent, calculateMargin } from "@/lib/calculations";
import Button from "@/components/ui/button";

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: recipe } = await supabase
    .from("recipes")
    .select(`*, recipe_ingredients(*), recipe_components(*, child:recipes!child_recipe_id(name))`)
    .eq("id", id)
    .single();

  if (!recipe) notFound();

  const foodCost = calculateFoodCostPercent(
    Number(recipe.total_cost),
    Number(recipe.selling_price || 0)
  );
  const margin = calculateMargin(
    Number(recipe.total_cost),
    Number(recipe.selling_price || 0)
  );

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{recipe.name}</h1>
          <p className="text-sm text-gray-500">
            {recipe.category} · {recipe.recipe_type}
          </p>
        </div>
        <Link href={`/recipes/${id}/edit`}>
          <Button variant="secondary">Edit</Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <InfoCard label="Servings" value={recipe.servings} />
        <InfoCard label="Prep Time" value={`${recipe.prep_time} min`} />
        <InfoCard label="Cook Time" value={`${recipe.cook_time} min`} />
        <InfoCard label="Total Cost" value={`€${Number(recipe.total_cost).toFixed(2)}`} />
      </div>

      {recipe.selling_price && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          <InfoCard label="Selling Price" value={`€${Number(recipe.selling_price).toFixed(2)}`} />
          <InfoCard label="Margin" value={`€${margin.toFixed(2)} (${foodCost.toFixed(1)}%)`} />
        </div>
      )}

      {recipe.allergens && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <span className="text-sm font-medium text-yellow-800">⚠ Allergens: </span>
          <span className="text-sm text-yellow-700">{recipe.allergens}</span>
        </div>
      )}

      {recipe.recipe_ingredients && recipe.recipe_ingredients.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Ingredients</h2>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="min-w-full text-sm divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Name</th>
                  <th className="px-4 py-2 text-right font-medium text-gray-600">Qty</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Unit</th>
                  <th className="px-4 py-2 text-right font-medium text-gray-600">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recipe.recipe_ingredients
                  .sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order)
                  .map((ing: { id: string; name: string; quantity: number; unit: string; unit_cost?: number }) => (
                    <tr key={ing.id}>
                      <td className="px-4 py-2">{ing.name}</td>
                      <td className="px-4 py-2 text-right">{Number(ing.quantity).toFixed(2)}</td>
                      <td className="px-4 py-2 text-gray-500">{ing.unit}</td>
                      <td className="px-4 py-2 text-right text-gray-600">
                        {ing.unit_cost
                          ? `€${(Number(ing.quantity) * Number(ing.unit_cost)).toFixed(4)}`
                          : "—"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {recipe.recipe_components && recipe.recipe_components.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Components</h2>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="min-w-full text-sm divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Recipe</th>
                  <th className="px-4 py-2 text-right font-medium text-gray-600">Qty</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Unit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recipe.recipe_components
                  .sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order)
                  .map((comp: { id: string; child: { name: string }; quantity: number; unit: string }) => (
                    <tr key={comp.id}>
                      <td className="px-4 py-2">{comp.child?.name}</td>
                      <td className="px-4 py-2 text-right">{Number(comp.quantity).toFixed(2)}</td>
                      <td className="px-4 py-2 text-gray-500">{comp.unit}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {recipe.steps && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Steps</h2>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{recipe.steps}</p>
          </div>
        </section>
      )}

      {recipe.notes && (
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Notes</h2>
          <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4">
            <p className="text-sm text-yellow-800">{recipe.notes}</p>
          </div>
        </section>
      )}
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="font-semibold text-gray-900">{value}</p>
    </div>
  );
}
