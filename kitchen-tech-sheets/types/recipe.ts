export type RecipeType = "simple" | "composed";
export type UserRole = "admin" | "manager" | "production" | "viewer";
export type MovementType = "in" | "out" | "adjustment";
export type ProductionStatus = "draft" | "validated" | "done" | "cancelled";

export type RecipeIngredient = {
  id?: string;
  name: string;
  quantity: number;
  unit: string;
  unitCost?: number;
  stockItemId?: string;
  sortOrder?: number;
};

export type RecipeComponent = {
  id?: string;
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
  createdAt?: string;
  updatedAt?: string;
};

export type StockMovement = {
  id?: string;
  stockItemId: string;
  stockItemName?: string;
  movementType: MovementType;
  quantity: number;
  unitCost?: number;
  reason?: string;
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
  createdAt?: string;
  updatedAt?: string;
};

export type Recipe = {
  id: string;
  establishmentId?: string;
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

export type DashboardStats = {
  totalRecipes: number;
  simpleRecipes: number;
  composedRecipes: number;
  totalIngredients: number;
  lowStockCount: number;
  totalProductionOrders: number;
  pendingOrders: number;
  avgFoodCostPercent: number;
};
