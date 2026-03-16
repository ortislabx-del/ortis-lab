import type { Production, Ingredient } from '@/types/recipe'
import { formatDate } from '@/lib/utils'

interface ReportCardsProps {
  productions: Production[]
  lowStockIngredients: Ingredient[]
}

export default function ReportCards({ productions, lowStockIngredients }: ReportCardsProps) {
  // Calculate stats
  const totalPortions = productions.reduce((sum, p) => sum + p.portions_produced, 0)

  // Group by recipe
  const byRecipe = productions.reduce(
    (acc, prod) => {
      const name = prod.recipe?.name ?? 'Inconnu'
      if (!acc[name]) acc[name] = { count: 0, portions: 0 }
      acc[name].count += 1
      acc[name].portions += prod.portions_produced
      return acc
    },
    {} as Record<string, { count: number; portions: number }>
  )

  const topRecipes = Object.entries(byRecipe)
    .sort((a, b) => b[1].portions - a[1].portions)
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Productions (30 derniers jours)</p>
          <p className="text-4xl font-bold text-gray-900 mt-1">{productions.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Portions produites</p>
          <p className="text-4xl font-bold text-gray-900 mt-1">{totalPortions}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Alertes stock faible</p>
          <p
            className={`text-4xl font-bold mt-1 ${
              lowStockIngredients.length > 0 ? 'text-red-600' : 'text-green-600'
            }`}
          >
            {lowStockIngredients.length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top recipes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Top recettes produites (30 jours)
          </h2>
          {topRecipes.length > 0 ? (
            <div className="space-y-3">
              {topRecipes.map(([name, stats]) => (
                <div key={name} className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">{name}</span>
                  <div className="text-right">
                    <span className="text-green-700 font-bold">{stats.portions}</span>
                    <span className="text-gray-400 text-sm ml-1">portions</span>
                    <span className="text-gray-300 mx-2">|</span>
                    <span className="text-gray-500 text-sm">{stats.count}×</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-4">Aucune production ce mois</p>
          )}
        </div>

        {/* Low stock alerts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Alertes stock</h2>
          {lowStockIngredients.length > 0 ? (
            <div className="space-y-3">
              {lowStockIngredients.map((ingredient) => (
                <div
                  key={ingredient.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-100"
                >
                  <span className="font-medium text-gray-700">{ingredient.name}</span>
                  <div className="text-right">
                    <span className="text-red-600 font-bold">{ingredient.current_stock}</span>
                    <span className="text-gray-400 text-sm ml-1">{ingredient.unit}</span>
                    <p className="text-xs text-gray-400">
                      Min: {ingredient.min_stock} {ingredient.unit}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <span className="text-4xl">✅</span>
              <p className="text-gray-500 mt-2">Tous les stocks sont suffisants</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent productions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Productions récentes</h2>
        {productions.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="pb-2 font-medium text-gray-600">Date</th>
                <th className="pb-2 font-medium text-gray-600">Recette</th>
                <th className="pb-2 font-medium text-gray-600">Portions</th>
              </tr>
            </thead>
            <tbody>
              {productions.slice(0, 10).map((production) => (
                <tr key={production.id} className="border-b border-gray-100">
                  <td className="py-2 text-gray-500">{formatDate(production.produced_at)}</td>
                  <td className="py-2 font-medium">{production.recipe?.name ?? '-'}</td>
                  <td className="py-2">{production.portions_produced}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-400 text-center py-4">Aucune production ce mois</p>
        )}
      </div>
    </div>
  )
}
