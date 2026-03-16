import { z } from "zod";

export const recipeIngredientSchema = z.object({
  name: z.string().min(1, "Nom requis"),
  quantity: z.number().positive("Quantité doit être positive"),
  unit: z.string().min(1, "Unité requise"),
  unitCost: z.number().min(0).optional(),
  stockItemId: z.string().optional(),
});

export const recipeComponentSchema = z.object({
  childRecipeId: z.string().min(1, "Recette requise"),
  childRecipeName: z.string().optional(),
  quantity: z.number().positive("Quantité doit être positive"),
  unit: z.string().min(1, "Unité requise"),
  sortOrder: z.number().optional(),
  totalCost: z.number().optional(),
});

export const recipeSchema = z.object({
  name: z.string().min(1, "Nom requis").max(200),
  category: z.string().min(1, "Catégorie requise"),
  recipeType: z.enum(["simple", "composed"]),
  servings: z.number().int().positive("Nombre de portions requis"),
  prepTime: z.number().int().min(0),
  cookTime: z.number().int().min(0),
  sellingPrice: z.number().min(0).optional(),
  allergens: z.string().optional(),
  notes: z.string().optional(),
  steps: z.string().optional(),
  ingredients: z.array(recipeIngredientSchema),
  components: z.array(recipeComponentSchema).optional(),
});

export const stockItemSchema = z.object({
  name: z.string().min(1, "Nom requis"),
  unit: z.string().min(1, "Unité requise"),
  quantityInStock: z.number().min(0),
  minQuantity: z.number().min(0),
  averageUnitCost: z.number().min(0).optional(),
});

export const stockMovementSchema = z.object({
  stockItemId: z.string().min(1, "Article requis"),
  movementType: z.enum(["in", "out", "adjustment"]),
  quantity: z.number().positive("Quantité doit être positive"),
  unitCost: z.number().min(0).optional(),
  reason: z.string().optional(),
});

export const productionOrderSchema = z.object({
  recipeId: z.string().min(1, "Recette requise"),
  quantity: z.number().positive("Quantité doit être positive"),
  status: z.enum(["draft", "validated", "done", "cancelled"]),
  notes: z.string().optional(),
});

export type RecipeFormValues = z.infer<typeof recipeSchema>;
export type StockItemFormValues = z.infer<typeof stockItemSchema>;
export type StockMovementFormValues = z.infer<typeof stockMovementSchema>;
export type ProductionOrderFormValues = z.infer<typeof productionOrderSchema>;
