import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import type { Recipe } from '@/types/recipe'
import { formatCurrency, formatDuration } from './utils'

/**
 * Generate a PDF technical sheet for a recipe
 */
export async function generateRecipePdf(recipe: Recipe): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595, 842]) // A4

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const { width, height } = page.getSize()
  const margin = 50
  let y = height - margin

  // Header background
  page.drawRectangle({
    x: 0,
    y: height - 80,
    width,
    height: 80,
    color: rgb(0.1, 0.4, 0.2),
  })

  // Title
  page.drawText(recipe.name, {
    x: margin,
    y: height - 50,
    size: 24,
    font: boldFont,
    color: rgb(1, 1, 1),
  })

  if (recipe.category) {
    page.drawText(recipe.category.name, {
      x: margin,
      y: height - 70,
      size: 12,
      font,
      color: rgb(0.8, 0.9, 0.8),
    })
  }

  y = height - 100

  // Recipe info
  const infoItems = [
    { label: 'Portions', value: `${recipe.portions}` },
    recipe.prep_time
      ? { label: 'Préparation', value: formatDuration(recipe.prep_time) }
      : null,
    recipe.cook_time ? { label: 'Cuisson', value: formatDuration(recipe.cook_time) } : null,
  ].filter(Boolean) as { label: string; value: string }[]

  infoItems.forEach((item, index) => {
    const x = margin + index * 160
    page.drawText(item.label, { x, y, size: 10, font, color: rgb(0.5, 0.5, 0.5) })
    page.drawText(item.value, {
      x,
      y: y - 16,
      size: 12,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.1),
    })
  })

  y -= 50

  // Separator
  page.drawLine({
    start: { x: margin, y },
    end: { x: width - margin, y },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  })
  y -= 20

  // Description
  if (recipe.description) {
    page.drawText('Description', {
      x: margin,
      y,
      size: 12,
      font: boldFont,
      color: rgb(0.1, 0.4, 0.2),
    })
    y -= 18
    page.drawText(recipe.description, {
      x: margin,
      y,
      size: 10,
      font,
      color: rgb(0.3, 0.3, 0.3),
      maxWidth: width - margin * 2,
    })
    y -= 30
  }

  // Components / Ingredients
  if (recipe.components && recipe.components.length > 0) {
    page.drawText('Ingrédients', {
      x: margin,
      y,
      size: 14,
      font: boldFont,
      color: rgb(0.1, 0.4, 0.2),
    })
    y -= 20

    // Table header
    page.drawRectangle({
      x: margin,
      y: y - 4,
      width: width - margin * 2,
      height: 20,
      color: rgb(0.9, 0.95, 0.9),
    })

    page.drawText('Ingrédient', { x: margin + 4, y, size: 10, font: boldFont })
    page.drawText('Quantité', { x: margin + 200, y, size: 10, font: boldFont })
    page.drawText('Unité', { x: margin + 280, y, size: 10, font: boldFont })
    page.drawText('Coût', { x: margin + 360, y, size: 10, font: boldFont })
    y -= 22

    let totalCost = 0
    for (const component of recipe.components) {
      const cost = component.quantity * (component.ingredient?.cost_per_unit ?? 0)
      totalCost += cost

      page.drawText(component.ingredient?.name ?? '', {
        x: margin + 4,
        y,
        size: 10,
        font,
      })
      page.drawText(component.quantity.toString(), { x: margin + 200, y, size: 10, font })
      page.drawText(component.unit, { x: margin + 280, y, size: 10, font })
      page.drawText(formatCurrency(cost), { x: margin + 360, y, size: 10, font })
      y -= 18
    }

    // Total cost
    y -= 4
    page.drawLine({
      start: { x: margin + 340, y },
      end: { x: width - margin, y },
      thickness: 0.5,
      color: rgb(0.5, 0.5, 0.5),
    })
    y -= 14
    page.drawText('Coût total', { x: margin + 280, y, size: 10, font: boldFont })
    page.drawText(formatCurrency(totalCost), {
      x: margin + 360,
      y,
      size: 10,
      font: boldFont,
      color: rgb(0.1, 0.4, 0.2),
    })
    y -= 30
  }

  // Instructions
  if (recipe.instructions) {
    page.drawText('Instructions', {
      x: margin,
      y,
      size: 14,
      font: boldFont,
      color: rgb(0.1, 0.4, 0.2),
    })
    y -= 18

    const lines = recipe.instructions.split('\n')
    for (const line of lines) {
      if (y < margin + 30) break
      page.drawText(line, {
        x: margin,
        y,
        size: 10,
        font,
        color: rgb(0.2, 0.2, 0.2),
        maxWidth: width - margin * 2,
      })
      y -= 16
    }
    y -= 10
  }

  // Notes
  if (recipe.notes) {
    page.drawText('Notes', {
      x: margin,
      y,
      size: 12,
      font: boldFont,
      color: rgb(0.5, 0.4, 0.1),
    })
    y -= 18
    page.drawText(recipe.notes, {
      x: margin,
      y,
      size: 10,
      font,
      color: rgb(0.4, 0.4, 0.4),
      maxWidth: width - margin * 2,
    })
  }

  // Footer
  page.drawText(`Fiche technique générée le ${new Date().toLocaleDateString('fr-FR')}`, {
    x: margin,
    y: margin - 20,
    size: 8,
    font,
    color: rgb(0.6, 0.6, 0.6),
  })

  const pdfBytes = await pdfDoc.save()
  return pdfBytes
}
