/**
 * Format a number as currency (EUR)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

/**
 * Format a date to a readable string
 */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

/**
 * Format a date to include time
 */
export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

/**
 * Calculate total cost of recipe components for a given number of portions
 */
export function calculateRecipeCost(
  components: { quantity: number; ingredient: { cost_per_unit: number } }[],
  portions: number = 1
): number {
  const totalCost = components.reduce((sum, component) => {
    return sum + component.quantity * component.ingredient.cost_per_unit
  }, 0)
  return totalCost / portions
}

/**
 * Format duration in minutes to a readable string
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`
}

/**
 * Truncate text to a maximum length
 */
export function truncate(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * Generate a slug from a string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/**
 * Check if stock is below minimum threshold
 */
export function isLowStock(currentStock: number, minStock: number): boolean {
  return currentStock <= minStock
}

/**
 * Get stock status label and color
 */
export function getStockStatus(
  currentStock: number,
  minStock: number
): { label: string; color: string } {
  if (currentStock <= 0) return { label: 'Épuisé', color: 'text-red-600' }
  if (currentStock <= minStock) return { label: 'Stock faible', color: 'text-orange-500' }
  return { label: 'En stock', color: 'text-green-600' }
}
