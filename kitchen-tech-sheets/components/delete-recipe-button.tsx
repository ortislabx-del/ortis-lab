'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface DeleteRecipeButtonProps {
  recipeId: string
  recipeName: string
}

export default function DeleteRecipeButton({ recipeId, recipeName }: DeleteRecipeButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    setIsDeleting(true)
    const supabase = createClient()
    try {
      const { error } = await supabase.from('recipes').delete().eq('id', recipeId)
      if (error) throw error
      router.push('/recipes')
      router.refresh()
    } catch (err) {
      console.error('Error deleting recipe:', err)
      setIsDeleting(false)
      setShowConfirm(false)
    }
  }

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Supprimer &ldquo;{recipeName}&rdquo; ?</span>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
        >
          {isDeleting ? 'Suppression...' : 'Confirmer'}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
        >
          Annuler
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-2 rounded-lg font-medium transition-colors"
    >
      Supprimer
    </button>
  )
}
