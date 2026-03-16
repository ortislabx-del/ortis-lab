'use client'

import { useState } from 'react'
import type { Ingredient, RecipeComponent } from '@/types/recipe'

interface RecipeComponentSelectorProps {
  ingredients: Ingredient[]
  components: Partial<RecipeComponent>[]
  onChange: (components: Partial<RecipeComponent>[]) => void
}

export default function RecipeComponentSelector({
  ingredients,
  components,
  onChange,
}: RecipeComponentSelectorProps) {
  const [selectedIngredientId, setSelectedIngredientId] = useState('')
  const [quantity, setQuantity] = useState('')
  const [unit, setUnit] = useState('')

  const availableIngredients = ingredients.filter(
    (ing) => !components.some((c) => c.ingredient_id === ing.id)
  )

  function handleAdd() {
    if (!selectedIngredientId || !quantity || !unit) return

    const ingredient = ingredients.find((i) => i.id === selectedIngredientId)
    if (!ingredient) return

    const newComponent: Partial<RecipeComponent> = {
      ingredient_id: selectedIngredientId,
      quantity: Number(quantity),
      unit,
      ingredient,
    }

    onChange([...components, newComponent])
    setSelectedIngredientId('')
    setQuantity('')
    setUnit('')
  }

  function handleRemove(ingredientId: string) {
    onChange(components.filter((c) => c.ingredient_id !== ingredientId))
  }

  function handleUnitChange(ingredientId: string, newUnit: string) {
    onChange(
      components.map((c) =>
        c.ingredient_id === ingredientId ? { ...c, unit: newUnit } : c
      )
    )
  }

  function handleQuantityChange(ingredientId: string, newQty: string) {
    onChange(
      components.map((c) =>
        c.ingredient_id === ingredientId ? { ...c, quantity: Number(newQty) } : c
      )
    )
  }

  return (
    <div className="space-y-4">
      {/* Component list */}
      {components.length > 0 && (
        <div className="space-y-2">
          {components.map((component) => (
            <div
              key={component.ingredient_id}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <span className="flex-1 font-medium text-sm text-gray-700">
                {component.ingredient?.name}
              </span>
              <input
                type="number"
                value={component.quantity ?? ''}
                onChange={(e) => handleQuantityChange(component.ingredient_id!, e.target.value)}
                min={0}
                step="0.001"
                className="w-24 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
              />
              <input
                type="text"
                value={component.unit ?? ''}
                onChange={(e) => handleUnitChange(component.ingredient_id!, e.target.value)}
                placeholder="unité"
                className="w-20 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
              />
              <button
                type="button"
                onClick={() => handleRemove(component.ingredient_id!)}
                className="text-red-500 hover:text-red-700 text-lg leading-none"
                aria-label="Supprimer"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add component */}
      <div className="flex items-end gap-2 p-3 border border-dashed border-gray-300 rounded-lg">
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">Ingrédient</label>
          <select
            value={selectedIngredientId}
            onChange={(e) => {
              setSelectedIngredientId(e.target.value)
              const ing = ingredients.find((i) => i.id === e.target.value)
              if (ing) setUnit(ing.unit)
            }}
            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
          >
            <option value="">Choisir un ingrédient</option>
            {availableIngredients.map((ing) => (
              <option key={ing.id} value={ing.id}>
                {ing.name}
              </option>
            ))}
          </select>
        </div>
        <div className="w-24">
          <label className="block text-xs text-gray-500 mb-1">Quantité</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min={0}
            step="0.001"
            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>
        <div className="w-20">
          <label className="block text-xs text-gray-500 mb-1">Unité</label>
          <input
            type="text"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="kg, L..."
            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={!selectedIngredientId || !quantity || !unit}
          className="bg-green-700 hover:bg-green-600 disabled:bg-gray-300 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
        >
          Ajouter
        </button>
      </div>
    </div>
  )
}
