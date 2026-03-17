import { RecipeComponent, RecipeIngredient, StockItem } from "@/types/recipe";

export function calculateIngredientCost(ingredients: RecipeIngredient[]): number {
  return ingredients.reduce((sum, item) => {
    const quantity = Number(item.quantity || 0);
    const unitCost = Number(item.unitCost || 0);
    return sum + quantity * unitCost;
  }, 0);
}

export function calculateComponentCost(components: RecipeComponent[]): number {
  return components.reduce((sum, item) => {
    const quantity = Number(item.quantity || 0);
    const totalCost = Number(item.totalCost || 0);
    return sum + quantity * totalCost;
  }, 0);
}

export function calculateMargin(totalCost: number, sellingPrice: number): number {
  return Number(sellingPrice || 0) - Number(totalCost || 0);
}

export function calculateFoodCostPercent(totalCost: number, sellingPrice: number): number {
  if (!sellingPrice) return 0;
  return (Number(totalCost || 0) / Number(sellingPrice || 0)) * 100;
}

export function getLowStockItems(stock: StockItem[]): StockItem[] {
  return stock.filter((item) => Number(item.quantityInStock) <= Number(item.minQuantity));
}

export function sumValues(values: number[]): number {
  return values.reduce((sum, value) => sum + Number(value || 0), 0);
}

export function calculatePortionQuantities(
  baseServings: number,
  targetServings: number,
  ingredients: RecipeIngredient[]
): RecipeIngredient[] {
  if (!baseServings || baseServings === 0) return ingredients;
  const ratio = targetServings / baseServings;
  return ingredients.map((ing) => ({
    ...ing,
    quantity: Number((Number(ing.quantity) * ratio).toFixed(4)),
  }));
}
