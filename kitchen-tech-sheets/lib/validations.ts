import { Recipe, StockItem, ProductionOrder } from "@/types/recipe";

export type ValidationError = { field: string; message: string };

export function validateRecipe(recipe: Partial<Recipe>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!recipe.name || recipe.name.trim() === "") {
    errors.push({ field: "name", message: "Recipe name is required." });
  }
  if (!recipe.recipeType) {
    errors.push({ field: "recipeType", message: "Recipe type is required." });
  }
  if (!recipe.servings || recipe.servings < 1) {
    errors.push({ field: "servings", message: "Servings must be at least 1." });
  }
  if (recipe.sellingPrice !== undefined && recipe.sellingPrice < 0) {
    errors.push({ field: "sellingPrice", message: "Selling price cannot be negative." });
  }

  return errors;
}

export function validateStockItem(item: Partial<StockItem>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!item.name || item.name.trim() === "") {
    errors.push({ field: "name", message: "Stock item name is required." });
  }
  if (!item.unit || item.unit.trim() === "") {
    errors.push({ field: "unit", message: "Unit is required." });
  }
  if (item.minQuantity !== undefined && item.minQuantity < 0) {
    errors.push({ field: "minQuantity", message: "Minimum quantity cannot be negative." });
  }

  return errors;
}

export function validateProductionOrder(order: Partial<ProductionOrder>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!order.recipeId) {
    errors.push({ field: "recipeId", message: "Recipe is required." });
  }
  if (!order.quantity || order.quantity <= 0) {
    errors.push({ field: "quantity", message: "Quantity must be greater than 0." });
  }

  return errors;
}
