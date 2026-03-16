import Link from "next/link";
import { Recipe } from "@/types/recipe";
import { formatCurrency, formatTime } from "@/lib/utils";
import { calculateFoodCostPercent, calculateMargin } from "@/lib/calculations";
import { DeleteRecipeButton } from "@/components/recipes/delete-recipe-button";
import { Clock, Users, Edit, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecipeDetailProps {
  recipe: Recipe;
}

export function RecipeDetail({ recipe }: RecipeDetailProps) {
  const foodCost = recipe.sellingPrice
    ? calculateFoodCostPercent(recipe.totalCost, recipe.sellingPrice)
    : null;
  const margin = recipe.sellingPrice
    ? calculateMargin(recipe.totalCost, recipe.sellingPrice)
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">{recipe.name}</h2>
            <span
              className={
                recipe.recipeType === "composed" ? "badge-orange" : "badge-blue"
              }
            >
              {recipe.recipeType === "composed" ? "Composée" : "Simple"}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
            <span className="badge-gray">{recipe.category}</span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" /> {recipe.servings} portion
              {recipe.servings > 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatTime(recipe.prepTime + recipe.cookTime)}
            </span>
          </div>
        </div>

        <div className="flex gap-2 no-print">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.print()}
          >
            <Printer className="h-4 w-4" />
            Imprimer
          </Button>
          <Link href={`/recipes/${recipe.id}/edit`}>
            <Button variant="secondary" size="sm">
              <Edit className="h-4 w-4" />
              Modifier
            </Button>
          </Link>
          <DeleteRecipeButton id={recipe.id} />
        </div>
      </div>

      {/* Cost cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="card text-center">
          <p className="text-xs text-gray-500">Coût total</p>
          <p className="mt-1 text-xl font-bold text-gray-900">
            {formatCurrency(recipe.totalCost)}
          </p>
        </div>
        {recipe.sellingPrice && (
          <div className="card text-center">
            <p className="text-xs text-gray-500">Prix de vente</p>
            <p className="mt-1 text-xl font-bold text-gray-900">
              {formatCurrency(recipe.sellingPrice)}
            </p>
          </div>
        )}
        {foodCost !== null && (
          <div className="card text-center">
            <p className="text-xs text-gray-500">Coût alimentaire</p>
            <p
              className={`mt-1 text-xl font-bold ${
                foodCost > 40
                  ? "text-red-600"
                  : foodCost > 30
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              {foodCost.toFixed(1)}%
            </p>
          </div>
        )}
        {margin !== null && (
          <div className="card text-center">
            <p className="text-xs text-gray-500">Marge</p>
            <p className="mt-1 text-xl font-bold text-green-700">
              {formatCurrency(margin)}
            </p>
          </div>
        )}
      </div>

      {/* Allergens */}
      {recipe.allergens && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm font-medium text-red-800">
            ⚠ Allergènes : {recipe.allergens}
          </p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Ingredients */}
        {recipe.ingredients.length > 0 && (
          <div className="card">
            <h3 className="mb-4 font-semibold text-gray-900">Ingrédients</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs text-gray-500">
                  <th className="pb-2">Nom</th>
                  <th className="pb-2 text-right">Qté</th>
                  <th className="pb-2 text-right">Coût</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recipe.ingredients.map((ing, i) => (
                  <tr key={i}>
                    <td className="py-2 font-medium">{ing.name}</td>
                    <td className="py-2 text-right text-gray-500">
                      {ing.quantity} {ing.unit}
                    </td>
                    <td className="py-2 text-right text-gray-500">
                      {ing.unitCost
                        ? formatCurrency(ing.quantity * ing.unitCost)
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Components */}
        {recipe.components && recipe.components.length > 0 && (
          <div className="card">
            <h3 className="mb-4 font-semibold text-gray-900">Compositions</h3>
            <ul className="space-y-2">
              {recipe.components.map((comp, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm"
                >
                  <Link
                    href={`/recipes/${comp.childRecipeId}`}
                    className="font-medium text-primary-600 hover:underline"
                  >
                    {comp.childRecipeName ?? comp.childRecipeId}
                  </Link>
                  <span className="text-gray-500">
                    {comp.quantity} {comp.unit}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Steps */}
      {recipe.steps && (
        <div className="card">
          <h3 className="mb-4 font-semibold text-gray-900">Étapes de préparation</h3>
          <ol className="space-y-3">
            {recipe.steps
              .split("\n")
              .filter(Boolean)
              .map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-600">
                    {i + 1}
                  </span>
                  <p className="pt-1 text-sm text-gray-700">{step}</p>
                </li>
              ))}
          </ol>
        </div>
      )}

      {/* Notes */}
      {recipe.notes && (
        <div className="card">
          <h3 className="mb-2 font-semibold text-gray-900">Notes</h3>
          <p className="text-sm text-gray-600">{recipe.notes}</p>
        </div>
      )}
    </div>
  );
}
