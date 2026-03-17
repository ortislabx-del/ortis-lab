import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Button from "@/components/ui/button";
import { calculateFoodCostPercent } from "@/lib/calculations";

export default async function RecipesPage() {
  const supabase = await createClient();
  const { data: recipes } = await supabase
    .from("recipes")
    .select("*")
    .order("name");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Recipes</h1>
        <Link href="/recipes/new">
          <Button>+ New Recipe</Button>
        </Link>
      </div>

      {recipes && recipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map((recipe) => {
            const foodCost = calculateFoodCostPercent(
              Number(recipe.total_cost),
              Number(recipe.selling_price || 0)
            );
            return (
              <Link key={recipe.id} href={`/recipes/${recipe.id}`}>
                <div className="bg-white rounded-xl border border-gray-200 p-4 hover:border-kitchen-300 hover:shadow-sm transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{recipe.name}</h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        recipe.recipe_type === "composed"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {recipe.recipe_type}
                    </span>
                  </div>
                  {recipe.category && (
                    <p className="text-xs text-gray-500 mb-2">{recipe.category}</p>
                  )}
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>🍽 {recipe.servings} servings</p>
                    <p>💰 Cost: €{Number(recipe.total_cost).toFixed(2)}</p>
                    {recipe.selling_price && (
                      <p className={foodCost > 35 ? "text-red-600" : "text-green-600"}>
                        📊 Food cost: {foodCost.toFixed(1)}%
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p>No recipes yet.</p>
          <Link href="/recipes/new" className="mt-2 inline-block text-kitchen-600 hover:underline">
            Create your first recipe
          </Link>
        </div>
      )}
    </div>
  );
}
