'use client'

import { useState } from 'react'
import type { Recipe } from '@/types/recipe'
import { generateRecipePdf } from '@/lib/pdf'

interface RecipePrintViewProps {
  recipe: Recipe
}

export default function RecipePrintView({ recipe }: RecipePrintViewProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  async function handleDownloadPdf() {
    setIsGenerating(true)
    try {
      const pdfBytes = await generateRecipePdf(recipe)
      const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `fiche-technique-${recipe.name.toLowerCase().replace(/\s+/g, '-')}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Error generating PDF:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <button
      onClick={handleDownloadPdf}
      disabled={isGenerating}
      className="flex items-center gap-2 bg-white/20 hover:bg-white/30 disabled:bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
    >
      {isGenerating ? (
        <>
          <span className="animate-spin">⏳</span>
          Génération...
        </>
      ) : (
        <>
          <span>📄</span>
          Télécharger PDF
        </>
      )}
    </button>
  )
}
