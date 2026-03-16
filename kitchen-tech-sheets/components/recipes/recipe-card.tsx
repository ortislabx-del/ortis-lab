import Link from "next/link";
import { Recipe } from "@/types/recipe";
import { formatCurrency, formatTime } from "@/lib/utils";
import { calculateFoodCostPercent } from "@/lib/calculations";
import { Clock, Users, ChefHat, DollarSign } from "lucide-react";

interface RecipeCardProps {
  recipe: Recipe;
}

const categoryColors: Record<string, string> = {
  "Entrée": "badge-blue",
  "Plat principal": "badge-orange",
  "Dessert": "badge-green",
  "Sauce": "badge-yellow",
  "Pâtisserie": "badge-red",
};

export function RecipeCard({ recipe }: RecipeCardProps) {
  const foodCost = recipe.sellingPrice
    ? calculateFoodCostPercent(recipe.totalCost, recipe.sellingPrice)
    : null;

  const badgeClass = categoryColors[recipe.category] ?? "badge-gray";

  return (
    <Link href={`/recipes/${recipe.id}`} className="block">
      <div className="card h-full transition-shadow hover:shadow-md">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2">{recipe.name}</h3>
          <span className={badgeClass}>{recipe.category || "—"}</span>
        </div>

        {/* Type badge */}
        <div className="mb-4">
          <span
            className={
              recipe.recipeType === "composed" ? "badge-orange" : "badge-blue"
            }
          >
            {recipe.recipeType === "composed" ? "Composée" : "Simple"}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-gray-400" />
            <span>{recipe.servings} portion{recipe.servings > 1 ? "s" : ""}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-gray-400" />
            <span>{formatTime(recipe.prepTime + recipe.cookTime)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ChefHat className="h-4 w-4 text-gray-400" />
            <span>
              {recipe.recipeType === "simple"
                ? `${recipe.ingredients.length} ingr.`
                : `${recipe.components?.length ?? 0} comp.`}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <DollarSign className="h-4 w-4 text-gray-400" />
            <span>{formatCurrency(recipe.totalCost)}</span>
          </div>
        </div>

        {/* Food cost */}
        {foodCost !== null && (
          <div className="mt-3 border-t border-gray-100 pt-3">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Coût alimentaire</span>
              <span
                className={
                  foodCost > 40
                    ? "font-semibold text-red-600"
                    : foodCost > 30
                    ? "font-semibold text-yellow-600"
                    : "font-semibold text-green-600"
                }
              >
                {foodCost.toFixed(1)}%
              </span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
