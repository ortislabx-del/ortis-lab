export type UserRole = 'admin' | 'chef' | 'staff'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  created_at: string
}

export interface Category {
  id: string
  name: string
  created_at: string
}

export interface Ingredient {
  id: string
  name: string
  unit: string
  cost_per_unit: number
  current_stock: number
  min_stock: number
  created_at: string
}

export interface RecipeComponent {
  id: string
  recipe_id: string
  ingredient_id: string
  quantity: number
  unit: string
  notes: string | null
  ingredient?: Ingredient
}

export interface Recipe {
  id: string
  name: string
  description: string | null
  category_id: string | null
  portions: number
  prep_time: number | null
  cook_time: number | null
  instructions: string | null
  notes: string | null
  is_active: boolean
  created_by: string | null
  created_at: string
  updated_at: string
  category?: Category
  components?: RecipeComponent[]
  created_by_profile?: Profile
}

export type MovementType = 'in' | 'out' | 'adjustment' | 'production'

export interface StockMovement {
  id: string
  ingredient_id: string
  quantity: number
  movement_type: MovementType
  reference: string | null
  production_id: string | null
  notes: string | null
  created_by: string | null
  created_at: string
  ingredient?: Ingredient
  created_by_profile?: Profile
}

export interface Production {
  id: string
  recipe_id: string
  portions_produced: number
  produced_at: string
  produced_by: string | null
  notes: string | null
  created_at: string
  recipe?: Recipe
  produced_by_profile?: Profile
}

export interface DashboardStats {
  totalRecipes: number
  activeRecipes: number
  totalProductions: number
  lowStockIngredients: number
  recentProductions: Production[]
}

export interface ReportData {
  period: string
  totalProductions: number
  mostProducedRecipes: { recipe: Recipe; count: number }[]
  stockUsage: { ingredient: Ingredient; totalUsed: number }[]
  lowStockAlerts: Ingredient[]
}
