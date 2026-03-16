'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { Ingredient, MovementType } from '@/types/recipe'

interface StockMovementFormProps {
  ingredients: Ingredient[]
  userId: string
}

export default function StockMovementForm({ ingredients, userId }: StockMovementFormProps) {
  const [ingredientId, setIngredientId] = useState('')
  const [quantity, setQuantity] = useState('')
  const [movementType, setMovementType] = useState<MovementType>('in')
  const [reference, setReference] = useState('')
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const router = useRouter()

  // Determine sign of quantity based on movement type
  const quantitySign = movementType === 'in' ? 1 : movementType === 'out' ? -1 : 1

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!ingredientId || !quantity) {
      setError('Ingrédient et quantité sont requis')
      return
    }
    setIsLoading(true)
    setError(null)
    const supabase = createClient()

    try {
      const { error } = await supabase.from('stock_movements').insert({
        ingredient_id: ingredientId,
        quantity: Math.abs(Number(quantity)) * quantitySign,
        movement_type: movementType,
        reference: reference.trim() || null,
        notes: notes.trim() || null,
        created_by: userId,
      })
      if (error) throw error

      // Reset form
      setIngredientId('')
      setQuantity('')
      setReference('')
      setNotes('')
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
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
      {success && (
        <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
          ✅ Mouvement enregistré !
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
        <div className="grid grid-cols-3 gap-2">
          {(['in', 'out', 'adjustment'] as MovementType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setMovementType(type)}
              className={`py-2 rounded-lg text-sm font-medium transition-colors border ${
                movementType === type
                  ? type === 'in'
                    ? 'bg-green-700 text-white border-green-700'
                    : type === 'out'
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-gray-600 text-white border-gray-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {type === 'in' ? 'Entrée' : type === 'out' ? 'Sortie' : 'Ajustement'}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ingrédient *</label>
        <select
          value={ingredientId}
          onChange={(e) => setIngredientId(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Sélectionner</option>
          {ingredients.map((ing) => (
            <option key={ing.id} value={ing.id}>
              {ing.name} ({ing.current_stock} {ing.unit})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Quantité *</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
          min={0}
          step="0.001"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Référence</label>
        <input
          type="text"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="N° facture, bon de livraison..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-green-700 hover:bg-green-600 disabled:bg-green-400 text-white font-medium py-2.5 rounded-lg transition-colors"
      >
        {isLoading ? 'Enregistrement...' : 'Enregistrer'}
      </button>
    </form>
  )
}
