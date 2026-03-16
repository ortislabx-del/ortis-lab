import type { Production } from '@/types/recipe'
import { formatDateTime } from '@/lib/utils'
import Link from 'next/link'

interface ProductionListProps {
  productions: Production[]
}

export default function ProductionList({ productions }: ProductionListProps) {
  if (productions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <p className="text-lg text-gray-400">Aucune production enregistrée</p>
        <Link
          href="/production/new"
          className="text-green-600 hover:underline mt-2 inline-block font-medium"
        >
          Enregistrer une production
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200 text-left">
            <th className="px-4 py-3 font-medium text-gray-600">Date</th>
            <th className="px-4 py-3 font-medium text-gray-600">Recette</th>
            <th className="px-4 py-3 font-medium text-gray-600">Portions produites</th>
            <th className="px-4 py-3 font-medium text-gray-600">Produit par</th>
            <th className="px-4 py-3 font-medium text-gray-600">Notes</th>
          </tr>
        </thead>
        <tbody>
          {productions.map((production) => (
            <tr key={production.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-500">
                {formatDateTime(production.produced_at)}
              </td>
              <td className="px-4 py-3">
                {production.recipe ? (
                  <Link
                    href={`/recipes/${production.recipe_id}`}
                    className="font-medium text-green-700 hover:underline"
                  >
                    {production.recipe.name}
                  </Link>
                ) : (
                  <span className="text-gray-400">Recette inconnue</span>
                )}
              </td>
              <td className="px-4 py-3">
                <span className="font-semibold">{production.portions_produced}</span>
                {production.recipe && (
                  <span className="text-gray-400 text-xs ml-1">
                    (recette: {production.recipe.portions})
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-gray-600">
                {production.produced_by_profile?.full_name ?? '-'}
              </td>
              <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                {production.notes ?? '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
