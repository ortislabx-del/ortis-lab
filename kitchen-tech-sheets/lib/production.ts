import type { Recipe, Production, StockMovement, RecipeComponent, Ingredient } from '@/types/recipe'

export interface ProductionResult {
  success: boolean
  stockMovements: Partial<StockMovement>[]
  errors: string[]
}

type RecipeForValidation = {
  components?: (Partial<RecipeComponent> & { ingredient?: Partial<Ingredient> })[]
}

/**
 * Validate that there is enough stock to produce a recipe
 */
export function validateProductionStock(
  recipe: RecipeForValidation,
  portionsToProduce: number
): { valid: boolean; missingIngredients: string[] } {
  const missingIngredients: string[] = []

  if (!recipe.components) {
    return { valid: true, missingIngredients: [] }
  }

  for (const component of recipe.components) {
    if (!component.ingredient) continue

    const required = (component.quantity ?? 0) * portionsToProduce
    const available = component.ingredient.current_stock ?? 0

    if (available < required) {
      missingIngredients.push(
        `${component.ingredient.name}: requis ${required} ${component.unit}, disponible ${available} ${component.unit}`
      )
    }
  }

  return {
    valid: missingIngredients.length === 0,
    missingIngredients,
  }
}

/**
 * Calculate the stock movements that would result from a production
 */
export function calculateProductionMovements(
  recipe: Recipe,
  portionsProduced: number,
  productionId: string,
  producedBy: string
): Partial<StockMovement>[] {
  if (!recipe.components) return []

  return recipe.components
    .filter((c) => c.ingredient)
    .map((component) => ({
      ingredient_id: component.ingredient_id,
      quantity: -(component.quantity * portionsProduced),
      movement_type: 'production' as const,
      production_id: productionId,
      created_by: producedBy,
    }))
}

/**
 * Calculate the total cost of a production run
 */
export function calculateProductionCost(recipe: Recipe, portionsProduced: number): number {
  if (!recipe.components) return 0

  const baseCost = recipe.components.reduce((sum, component) => {
    const costPerUnit = component.ingredient?.cost_per_unit ?? 0
    return sum + component.quantity * costPerUnit
  }, 0)

  // Scale from recipe portions to produced portions
  return (baseCost / recipe.portions) * portionsProduced
}

/**
 * Group productions by recipe for reporting
 */
export function groupProductionsByRecipe(
  productions: Production[]
): Map<string, { recipe: Recipe; totalPortions: number; count: number }> {
  const grouped = new Map<string, { recipe: Recipe; totalPortions: number; count: number }>()

  for (const production of productions) {
    if (!production.recipe) continue

    const existing = grouped.get(production.recipe_id)
    if (existing) {
      existing.totalPortions += production.portions_produced
      existing.count += 1
    } else {
      grouped.set(production.recipe_id, {
        recipe: production.recipe,
        totalPortions: production.portions_produced,
        count: 1,
      })
    }
  }

  return grouped
}

/**
 * Get production summary stats for a period
 */
export function getProductionStats(productions: Production[]): {
  totalProductions: number
  totalPortions: number
  uniqueRecipes: number
} {
  const uniqueRecipes = new Set(productions.map((p) => p.recipe_id)).size

  return {
    totalProductions: productions.length,
    totalPortions: productions.reduce((sum, p) => sum + p.portions_produced, 0),
    uniqueRecipes,
  }
}
