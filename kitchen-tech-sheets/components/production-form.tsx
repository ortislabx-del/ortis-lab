'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { Recipe, RecipeComponent, Ingredient } from '@/types/recipe'
import { validateProductionStock } from '@/lib/production'

type RecipeWithComponents = Pick<Recipe, 'id' | 'name' | 'portions'> & {
  components?: (Partial<RecipeComponent> & { ingredient?: Ingredient })[]
}

interface ProductionFormProps {
  recipes: RecipeWithComponents[]
  userId: string
}

export default function ProductionForm({ recipes, userId }: ProductionFormProps) {
  const [recipeId, setRecipeId] = useState('')
  const [portions, setPortions] = useState(1)
  const [notes, setNotes] = useState('')
  const [producedAt, setProducedAt] = useState(new Date().toISOString().slice(0, 16))
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stockWarnings, setStockWarnings] = useState<string[]>([])
  const router = useRouter()

  const selectedRecipe = recipes.find((r) => r.id === recipeId)

  function handleRecipeChange(id: string) {
    setRecipeId(id)
    setStockWarnings([])
    const recipe = recipes.find((r) => r.id === id)
    if (recipe) {
      const { missingIngredients } = validateProductionStock(recipe, portions)
      setStockWarnings(missingIngredients)
    }
  }

  function handlePortionsChange(value: number) {
    setPortions(value)
    if (selectedRecipe) {
      const { missingIngredients } = validateProductionStock(selectedRecipe, value)
      setStockWarnings(missingIngredients)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!recipeId) {
      setError('Veuillez sélectionner une recette')
      return
    }
    setIsLoading(true)
    setError(null)
    const supabase = createClient()

    try {
      const { error } = await supabase.from('productions').insert({
        recipe_id: recipeId,
        portions_produced: portions,
        produced_at: new Date(producedAt).toISOString(),
        produced_by: userId,
        notes: notes || null,
      })
      if (error) throw error
      router.push('/production')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {stockWarnings.length > 0 && (
        <div className="p-3 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 text-sm">
          <p className="font-medium mb-1">⚠️ Stock insuffisant :</p>
          <ul className="list-disc list-inside space-y-0.5">
            {stockWarnings.map((warning, i) => (
              <li key={i}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Recette *</label>
        <select
          value={recipeId}
          onChange={(e) => handleRecipeChange(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Sélectionner une recette</option>
          {recipes.map((recipe) => (
            <option key={recipe.id} value={recipe.id}>
              {recipe.name} ({recipe.portions} portions)
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Portions produites *</label>
        <input
          type="number"
          value={portions}
          onChange={(e) => handlePortionsChange(Number(e.target.value))}
          required
          min={1}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {selectedRecipe && (
          <p className="text-xs text-gray-500 mt-1">
            Recette de base : {selectedRecipe.portions} portions
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date & heure *</label>
        <input
          type="datetime-local"
          value={producedAt}
          onChange={(e) => setProducedAt(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          placeholder="Observations, ajustements..."
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-green-700 hover:bg-green-600 disabled:bg-green-400 text-white font-medium py-2.5 rounded-lg transition-colors"
        >
          {isLoading ? 'Enregistrement...' : 'Enregistrer la production'}
        </button>
      </div>
    </form>
  )
}
