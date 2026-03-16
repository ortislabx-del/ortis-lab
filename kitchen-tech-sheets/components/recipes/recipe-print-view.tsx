"use client";

import { Recipe } from "@/types/recipe";
import { formatCurrency, formatTime } from "@/lib/utils";
import { calculateFoodCostPercent, calculateMargin } from "@/lib/calculations";

interface RecipePrintViewProps {
  recipe: Recipe;
}

export function RecipePrintView({ recipe }: RecipePrintViewProps) {
  const foodCost = recipe.sellingPrice
    ? calculateFoodCostPercent(recipe.totalCost, recipe.sellingPrice)
    : null;
  const margin = recipe.sellingPrice
    ? calculateMargin(recipe.totalCost, recipe.sellingPrice)
    : null;

  return (
    <div className="mx-auto max-w-2xl p-8 font-sans print:p-0">
      {/* Header */}
      <div className="mb-6 border-b-2 border-orange-600 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">{recipe.name}</h1>
        <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
          <span>Catégorie: <strong>{recipe.category}</strong></span>
          <span>Portions: <strong>{recipe.servings}</strong></span>
          <span>Prép: <strong>{formatTime(recipe.prepTime)}</strong></span>
          <span>Cuisson: <strong>{formatTime(recipe.cookTime)}</strong></span>
        </div>
      </div>

      {/* Cost */}
      <div className="mb-6 grid grid-cols-3 gap-4 text-center">
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs text-gray-500">Coût total</p>
          <p className="text-lg font-bold text-gray-900">
            {formatCurrency(recipe.totalCost)}
          </p>
        </div>
        {recipe.sellingPrice && (
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs text-gray-500">Prix vente</p>
            <p className="text-lg font-bold text-gray-900">
              {formatCurrency(recipe.sellingPrice)}
            </p>
          </div>
        )}
        {foodCost !== null && (
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs text-gray-500">Coût alimentaire</p>
            <p
              className={`text-lg font-bold ${
                foodCost > 40 ? "text-red-600" : foodCost > 30 ? "text-yellow-600" : "text-green-600"
              }`}
            >
              {foodCost.toFixed(1)}%
            </p>
          </div>
        )}
        {margin !== null && (
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs text-gray-500">Marge</p>
            <p className="text-lg font-bold text-green-700">
              {formatCurrency(margin)}
            </p>
          </div>
        )}
      </div>

      {/* Allergens */}
      {recipe.allergens && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-sm font-semibold text-red-800">
            ⚠ Allergènes: {recipe.allergens}
          </p>
        </div>
      )}

      {/* Ingredients */}
      {recipe.ingredients.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Ingrédients</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="pb-2">Ingrédient</th>
                <th className="pb-2 text-right">Quantité</th>
                <th className="pb-2 text-right">Coût unitaire</th>
                <th className="pb-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recipe.ingredients.map((ing, i) => (
                <tr key={i}>
                  <td className="py-1.5">{ing.name}</td>
                  <td className="py-1.5 text-right">
                    {ing.quantity} {ing.unit}
                  </td>
                  <td className="py-1.5 text-right">
                    {ing.unitCost ? formatCurrency(ing.unitCost) : "—"}
                  </td>
                  <td className="py-1.5 text-right">
                    {ing.unitCost ? formatCurrency(ing.quantity * ing.unitCost) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Components */}
      {recipe.components && recipe.components.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Compositions</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="pb-2">Recette</th>
                <th className="pb-2 text-right">Quantité</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recipe.components.map((comp, i) => (
                <tr key={i}>
                  <td className="py-1.5">
                    {comp.childRecipeName ?? comp.childRecipeId}
                  </td>
                  <td className="py-1.5 text-right">
                    {comp.quantity} {comp.unit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Steps */}
      {recipe.steps && (
        <div className="mb-6">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">
            Étapes de préparation
          </h2>
          <ol className="space-y-2">
            {recipe.steps
              .split("\n")
              .filter(Boolean)
              .map((step, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-600">
                    {i + 1}
                  </span>
                  <span className="text-gray-700">{step}</span>
                </li>
              ))}
          </ol>
        </div>
      )}

      {/* Notes */}
      {recipe.notes && (
        <div className="rounded-lg bg-gray-50 p-4">
          <h3 className="mb-1 text-sm font-semibold text-gray-700">Notes</h3>
          <p className="text-sm text-gray-600">{recipe.notes}</p>
        </div>
      )}
    </div>
  );
}
