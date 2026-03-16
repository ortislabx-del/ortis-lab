# Référence API

## Base URL
`/api`

## Recettes

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/recipes` | Liste toutes les recettes |
| POST | `/api/recipes` | Créer une recette |
| GET | `/api/recipes/:id` | Détail d'une recette |
| PUT | `/api/recipes/:id` | Modifier une recette |
| DELETE | `/api/recipes/:id` | Supprimer une recette |

### Corps de requête (POST/PUT)
```json
{
  "name": "string",
  "category": "string",
  "recipeType": "simple|composed",
  "servings": 4,
  "prepTime": 10,
  "cookTime": 30,
  "sellingPrice": 12.50,
  "allergens": "gluten",
  "notes": "string",
  "steps": "Étape 1\nÉtape 2",
  "ingredients": [
    { "name": "Tomate", "quantity": 200, "unit": "g", "unitCost": 0.003 }
  ],
  "components": [
    { "childRecipeId": "uuid", "quantity": 1, "unit": "portion(s)" }
  ]
}
```

## Ingrédients / Stock

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/ingredients` | Liste les articles de stock |
| POST | `/api/ingredients` | Créer un article |
| PUT | `/api/ingredients/:id` | Modifier |
| DELETE | `/api/ingredients/:id` | Supprimer |
| GET | `/api/stock` | État du stock |
| GET | `/api/stock/movements` | Historique des mouvements |
| POST | `/api/stock/movements` | Créer un mouvement |

## Production

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/production` | Liste les commandes |
| POST | `/api/production` | Créer une commande |
| GET | `/api/production/:id` | Détail |
| PUT | `/api/production/:id` | Modifier le statut |

## Rapports

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/reports/dashboard` | Métriques tableau de bord |
