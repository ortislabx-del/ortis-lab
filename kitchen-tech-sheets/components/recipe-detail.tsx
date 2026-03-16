import type { Recipe } from '@/types/recipe'
import { formatCurrency, formatDuration, formatDate } from '@/lib/utils'
import RecipePrintView from './recipe-print-view'

interface RecipeDetailProps {
  recipe: Recipe
}

export default function RecipeDetail({ recipe }: RecipeDetailProps) {
  const totalCost =
    recipe.components?.reduce((sum, c) => {
      return sum + c.quantity * (c.ingredient?.cost_per_unit ?? 0)
    }, 0) ?? 0

  const costPerPortion = recipe.portions > 0 ? totalCost / recipe.portions : 0

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-900 text-white p-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{recipe.name}</h1>
            {recipe.category && (
              <span className="inline-block bg-white/20 text-sm px-3 py-1 rounded-full">
                {recipe.category.name}
              </span>
            )}
          </div>
          <RecipePrintView recipe={recipe} />
        </div>

        <div className="flex flex-wrap gap-6 mt-6">
          <div>
            <p className="text-green-300 text-xs uppercase tracking-wide">Portions</p>
            <p className="text-2xl font-bold">{recipe.portions}</p>
          </div>
          {recipe.prep_time && (
            <div>
              <p className="text-green-300 text-xs uppercase tracking-wide">Préparation</p>
              <p className="text-2xl font-bold">{formatDuration(recipe.prep_time)}</p>
            </div>
          )}
          {recipe.cook_time && (
            <div>
              <p className="text-green-300 text-xs uppercase tracking-wide">Cuisson</p>
              <p className="text-2xl font-bold">{formatDuration(recipe.cook_time)}</p>
            </div>
          )}
          <div>
            <p className="text-green-300 text-xs uppercase tracking-wide">Coût / portion</p>
            <p className="text-2xl font-bold">{formatCurrency(costPerPortion)}</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Description */}
        {recipe.description && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
            <p className="text-gray-600">{recipe.description}</p>
          </div>
        )}

        {/* Ingredients */}
        {recipe.components && recipe.components.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Ingrédients
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({recipe.components.length})
              </span>
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-2 font-medium text-gray-600 rounded-l-lg">Ingrédient</th>
                    <th className="px-4 py-2 font-medium text-gray-600">Quantité</th>
                    <th className="px-4 py-2 font-medium text-gray-600">Unité</th>
                    <th className="px-4 py-2 font-medium text-gray-600 rounded-r-lg">Coût</th>
                  </tr>
                </thead>
                <tbody>
                  {recipe.components.map((component) => {
                    const cost = component.quantity * (component.ingredient?.cost_per_unit ?? 0)
                    return (
                      <tr key={component.id} className="border-b border-gray-100">
                        <td className="px-4 py-3 font-medium">
                          {component.ingredient?.name ?? 'Ingrédient inconnu'}
                        </td>
                        <td className="px-4 py-3">{component.quantity}</td>
                        <td className="px-4 py-3 text-gray-500">{component.unit}</td>
                        <td className="px-4 py-3 text-gray-600">{formatCurrency(cost)}</td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-green-50">
                    <td colSpan={3} className="px-4 py-3 font-semibold text-right">
                      Coût total :
                    </td>
                    <td className="px-4 py-3 font-bold text-green-700">
                      {formatCurrency(totalCost)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* Instructions */}
        {recipe.instructions && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Instructions</h2>
            <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line">
              {recipe.instructions}
            </div>
          </div>
        )}

        {/* Notes */}
        {recipe.notes && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h2 className="text-sm font-semibold text-amber-800 mb-1">Notes</h2>
            <p className="text-amber-700 text-sm">{recipe.notes}</p>
          </div>
        )}

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-gray-100">
          <span>Créé le {formatDate(recipe.created_at)}</span>
          <span>Mis à jour le {formatDate(recipe.updated_at)}</span>
        </div>
      </div>
    </div>
  )
}
