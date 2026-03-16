import type { Recipe } from '@/types/recipe'
import Link from 'next/link'
import { formatDuration } from '@/lib/utils'

interface RecipeCardProps {
  recipe: Recipe & { components?: { id: string }[] }
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const totalTime = (recipe.prep_time ?? 0) + (recipe.cook_time ?? 0)

  return (
    <Link
      href={`/recipes/${recipe.id}`}
      className="block bg-white rounded-xl shadow-sm border border-gray-200 hover:border-green-400 hover:shadow-md transition-all overflow-hidden group"
    >
      <div className="bg-gradient-to-br from-green-700 to-green-900 h-24 flex items-center justify-center">
        <span className="text-5xl">🍽️</span>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors line-clamp-2">
            {recipe.name}
          </h3>
          {!recipe.is_active && (
            <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
              Inactif
            </span>
          )}
        </div>

        {recipe.category && (
          <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium mb-2">
            {recipe.category.name}
          </span>
        )}

        {recipe.description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">{recipe.description}</p>
        )}

        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span>👥 {recipe.portions} portions</span>
          {totalTime > 0 && <span>⏱️ {formatDuration(totalTime)}</span>}
          {recipe.components && (
            <span>🥕 {recipe.components.length} ingrédients</span>
          )}
        </div>
      </div>
    </Link>
  )
}
