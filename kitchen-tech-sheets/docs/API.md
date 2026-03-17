# API Reference

Base URL: `/api`

All endpoints require authentication (Supabase session cookie).

## Recipes

### GET /api/recipes
Returns all recipes with ingredients and components.

### POST /api/recipes
Create a new recipe.
Body: `{ name, category, recipe_type, servings, prep_time, cook_time, total_cost, selling_price?, allergens?, notes?, steps? }`

### GET /api/recipes/:id
Get a single recipe by ID.

### PUT /api/recipes/:id
Update a recipe.

### DELETE /api/recipes/:id
Delete a recipe.

### GET /api/recipes/:id/calculate
Calculate cost breakdown for a recipe.
Returns: `{ totalCost, sellingPrice, margin, foodCostPercent }`

## Ingredients (Stock Items)

### GET /api/ingredients
List all stock items.

### POST /api/ingredients
Create a stock item.
Body: `{ name, unit, quantity_in_stock, min_quantity, average_unit_cost? }`

### GET /api/ingredients/:id
Get a stock item.

### PUT /api/ingredients/:id
Update a stock item.

### DELETE /api/ingredients/:id
Delete a stock item.

## Stock

### GET /api/stock
Get all stock items with low-stock analysis.
Returns: `{ items, lowStockItems }`

### POST /api/stock/movements
Record a stock movement.
Body: `{ stockItemId, movementType: "in"|"out"|"adjustment", quantity, unit_cost?, reason? }`

## Production

### GET /api/production
List all production orders.

### POST /api/production
Create a production order.
Body: `{ recipeId, quantity, status?, notes? }`
