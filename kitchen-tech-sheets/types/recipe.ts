export type RecipeType = "simple" | "composed";
export type UserRole = "admin" | "manager" | "production" | "viewer";
export type MovementType = "in" | "out" | "adjustment";
export type ProductionStatus = "draft" | "validated" | "done" | "cancelled";

export type RecipeIngredient = {
  id?: string;
  recipe_id?: string;
  stock_item_id?: string;
  name: string;
  quantity: number;
  unit: string;
  unitCost?: number;
  sort_order?: number;
};

export type RecipeComponent = {
  id?: string;
  parent_recipe_id?: string;
  childRecipeId: string;
  childRecipeName?: string;
  quantity: number;
  unit: string;
  sortOrder?: number;
  totalCost?: number;
};

export type StockItem = {
  id?: string;
  establishmentId?: string;
  name: string;
  unit: string;
  quantityInStock: number;
  minQuantity: number;
  averageUnitCost?: number;
  created_at?: string;
  updated_at?: string;
};

export type StockMovement = {
  id?: string;
  stockItemId: string;
  movementType: MovementType;
  quantity: number;
  unit_cost?: number;
  reason?: string;
  created_by?: string;
  createdAt?: string;
};

export type RecipeHistoryEntry = {
  id?: string;
  recipeId: string;
  action: "create" | "update" | "delete";
  changedBy?: string;
  snapshot?: Record<string, unknown>;
  changedAt?: string;
};

export type ProductionOrder = {
  id?: string;
  establishmentId?: string;
  recipeId: string;
  recipeName?: string;
  quantity: number;
  status: ProductionStatus;
  notes?: string;
  created_by?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Recipe = {
  id: string;
  establishment_id?: string;
  name: string;
  category: string;
  recipeType: RecipeType;
  servings: number;
  prepTime: number;
  cookTime: number;
  totalCost: number;
  sellingPrice?: number;
  allergens?: string;
  notes?: string;
  steps?: string;
  ingredients: RecipeIngredient[];
  components?: RecipeComponent[];
  created_at?: string;
  updated_at?: string;
};
