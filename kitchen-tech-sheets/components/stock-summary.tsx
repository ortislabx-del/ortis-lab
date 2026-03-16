import type { Ingredient } from '@/types/recipe'
import { formatCurrency, getStockStatus } from '@/lib/utils'

interface StockSummaryProps {
  ingredients: Ingredient[]
}

export default function StockSummary({ ingredients }: StockSummaryProps) {
  const lowStock = ingredients.filter((i) => i.current_stock <= i.min_stock)
  const outOfStock = ingredients.filter((i) => i.current_stock <= 0)

  if (ingredients.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <p className="text-lg text-gray-400">Aucun ingrédient enregistré</p>
        <p className="text-sm text-gray-400 mt-1">
          Ajoutez des ingrédients via la base de données Supabase ou les mouvements de stock.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Total ingrédients</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{ingredients.length}</p>
        </div>
        <div
          className={`rounded-xl shadow-sm border p-5 ${
            lowStock.length > 0
              ? 'bg-orange-50 border-orange-200'
              : 'bg-white border-gray-200'
          }`}
        >
          <p className="text-sm text-gray-500">Stock faible</p>
          <p
            className={`text-3xl font-bold mt-1 ${
              lowStock.length > 0 ? 'text-orange-600' : 'text-gray-900'
            }`}
          >
            {lowStock.length}
          </p>
        </div>
        <div
          className={`rounded-xl shadow-sm border p-5 ${
            outOfStock.length > 0
              ? 'bg-red-50 border-red-200'
              : 'bg-white border-gray-200'
          }`}
        >
          <p className="text-sm text-gray-500">Épuisés</p>
          <p
            className={`text-3xl font-bold mt-1 ${
              outOfStock.length > 0 ? 'text-red-600' : 'text-gray-900'
            }`}
          >
            {outOfStock.length}
          </p>
        </div>
      </div>

      {/* Ingredients table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-left">
              <th className="px-4 py-3 font-medium text-gray-600">Ingrédient</th>
              <th className="px-4 py-3 font-medium text-gray-600">Stock actuel</th>
              <th className="px-4 py-3 font-medium text-gray-600">Stock min.</th>
              <th className="px-4 py-3 font-medium text-gray-600">Unité</th>
              <th className="px-4 py-3 font-medium text-gray-600">Coût/unité</th>
              <th className="px-4 py-3 font-medium text-gray-600">Statut</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map((ingredient) => {
              const status = getStockStatus(ingredient.current_stock, ingredient.min_stock)
              return (
                <tr key={ingredient.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{ingredient.name}</td>
                  <td className="px-4 py-3 font-semibold">{ingredient.current_stock}</td>
                  <td className="px-4 py-3 text-gray-500">{ingredient.min_stock}</td>
                  <td className="px-4 py-3 text-gray-500">{ingredient.unit}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {formatCurrency(ingredient.cost_per_unit)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-medium text-xs ${status.color}`}>
                      {status.label}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
