'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { Recipe, Category, Ingredient, RecipeComponent } from '@/types/recipe'
import RecipeComponentSelector from './recipe-component-selector'

interface RecipeFormProps {
  categories: Category[]
  ingredients: Ingredient[]
  userId: string
  recipe?: Recipe
}

export default function RecipeForm({
  categories,
  ingredients,
  userId,
  recipe,
}: RecipeFormProps) {
  const [name, setName] = useState(recipe?.name ?? '')
  const [description, setDescription] = useState(recipe?.description ?? '')
  const [categoryId, setCategoryId] = useState(recipe?.category_id ?? '')
  const [portions, setPortions] = useState(recipe?.portions ?? 4)
  const [prepTime, setPrepTime] = useState(recipe?.prep_time ?? '')
  const [cookTime, setCookTime] = useState(recipe?.cook_time ?? '')
  const [instructions, setInstructions] = useState(recipe?.instructions ?? '')
  const [notes, setNotes] = useState(recipe?.notes ?? '')
  const [isActive, setIsActive] = useState(recipe?.is_active ?? true)
  const [components, setComponents] = useState<Partial<RecipeComponent>[]>(
    recipe?.components ?? []
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const isEditing = !!recipe

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setError('Le nom de la recette est requis')
      return
    }
    setIsLoading(true)
    setError(null)
    const supabase = createClient()

    try {
      const recipeData = {
        name: name.trim(),
        description: description.trim() || null,
        category_id: categoryId || null,
        portions: Number(portions),
        prep_time: prepTime ? Number(prepTime) : null,
        cook_time: cookTime ? Number(cookTime) : null,
        instructions: instructions.trim() || null,
        notes: notes.trim() || null,
        is_active: isActive,
        created_by: userId,
        updated_at: new Date().toISOString(),
      }

      let recipeId: string

      if (isEditing) {
        const { error } = await supabase
          .from('recipes')
          .update(recipeData)
          .eq('id', recipe.id)
        if (error) throw error
        recipeId = recipe.id

        // Delete existing components and re-insert
        await supabase.from('recipe_components').delete().eq('recipe_id', recipe.id)
      } else {
        const { data, error } = await supabase
          .from('recipes')
          .insert(recipeData)
          .select('id')
          .single()
        if (error) throw error
        recipeId = data.id
      }

      // Insert components
      if (components.length > 0) {
        const componentsData = components.map((c) => ({
          recipe_id: recipeId,
          ingredient_id: c.ingredient_id!,
          quantity: c.quantity!,
          unit: c.unit!,
          notes: c.notes ?? null,
        }))
        const { error } = await supabase.from('recipe_components').insert(componentsData)
        if (error) throw error
      }

      router.push(`/recipes/${recipeId}`)
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Basic info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom de la recette *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Ex: Tarte aux pommes"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Sans catégorie</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Portions *</label>
          <input
            type="number"
            value={portions}
            onChange={(e) => setPortions(Number(e.target.value))}
            required
            min={1}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Temps de préparation (min)
          </label>
          <input
            type="number"
            value={prepTime}
            onChange={(e) => setPrepTime(e.target.value)}
            min={0}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Temps de cuisson (min)
          </label>
          <input
            type="number"
            value={cookTime}
            onChange={(e) => setCookTime(e.target.value)}
            min={0}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Components */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Ingrédients</label>
        <RecipeComponentSelector
          ingredients={ingredients}
          components={components}
          onChange={setComponents}
        />
      </div>

      {/* Instructions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          rows={6}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          placeholder="Étapes de préparation..."
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          placeholder="Conseils, variantes, allergènes..."
        />
      </div>

      {/* Active toggle */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="isActive"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
        />
        <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
          Recette active (disponible pour la production)
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-green-700 hover:bg-green-600 disabled:bg-green-400 text-white font-medium py-2.5 rounded-lg transition-colors"
        >
          {isLoading
            ? 'Enregistrement...'
            : isEditing
              ? 'Mettre à jour'
              : 'Créer la recette'}
        </button>
      </div>
    </form>
  )
}
