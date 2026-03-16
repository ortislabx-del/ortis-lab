'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { Ingredient } from '@/types/recipe'

interface StockFormProps {
  ingredient?: Ingredient
}

export default function StockForm({ ingredient }: StockFormProps) {
  const [name, setName] = useState(ingredient?.name ?? '')
  const [unit, setUnit] = useState(ingredient?.unit ?? '')
  const [costPerUnit, setCostPerUnit] = useState(ingredient?.cost_per_unit?.toString() ?? '0')
  const [minStock, setMinStock] = useState(ingredient?.min_stock?.toString() ?? '0')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const isEditing = !!ingredient

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !unit.trim()) {
      setError('Le nom et l\'unité sont requis')
      return
    }
    setIsLoading(true)
    setError(null)
    const supabase = createClient()

    try {
      const data = {
        name: name.trim(),
        unit: unit.trim(),
        cost_per_unit: Number(costPerUnit),
        min_stock: Number(minStock),
      }

      if (isEditing) {
        const { error } = await supabase
          .from('ingredients')
          .update(data)
          .eq('id', ingredient.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('ingredients').insert({ ...data, current_stock: 0 })
        if (error) throw error
      }

      router.push('/stock')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Ex: Farine T55"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Unité *</label>
        <input
          type="text"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="kg, L, unité..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Coût par unité (€)</label>
        <input
          type="number"
          value={costPerUnit}
          onChange={(e) => setCostPerUnit(e.target.value)}
          min={0}
          step="0.0001"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Stock minimum</label>
        <input
          type="number"
          value={minStock}
          onChange={(e) => setMinStock(e.target.value)}
          min={0}
          step="0.001"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-green-700 hover:bg-green-600 disabled:bg-green-400 text-white font-medium py-2.5 rounded-lg transition-colors"
      >
        {isLoading ? 'Enregistrement...' : isEditing ? 'Mettre à jour' : 'Ajouter l\'ingrédient'}
      </button>
    </form>
  )
}
