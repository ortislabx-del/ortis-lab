"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Recipe } from "@/types/recipe";
import { fetchRecipes } from "@/lib/api-clients/recipes";
import { RecipeCard } from "@/components/recipes/recipe-card";
import { RecipeFiltersBar, type RecipeFilters } from "@/components/recipes/recipe-filters";
import { PageLoader } from "@/components/ui/loading-spinner";
import { Plus } from "lucide-react";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<RecipeFilters>({
    search: "",
    category: "",
    recipeType: "",
  });

  useEffect(() => {
    fetchRecipes()
      .then(setRecipes)
      .finally(() => setLoading(false));
  }, []);

  const filtered = recipes.filter((r) => {
    const matchSearch =
      !filters.search ||
      r.name.toLowerCase().includes(filters.search.toLowerCase());
    const matchCategory =
      !filters.category || r.category === filters.category;
    const matchType =
      !filters.recipeType || r.recipeType === filters.recipeType;
    return matchSearch && matchCategory && matchType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">
            {loading ? "…" : `${filtered.length} recette${filtered.length > 1 ? "s" : ""}`}
          </p>
        </div>
        <Link
          href="/recipes/new"
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          Nouvelle recette
        </Link>
      </div>

      {/* Filters */}
      <RecipeFiltersBar filters={filters} onChange={setFilters} />

      {/* Content */}
      {loading ? (
        <PageLoader />
      ) : filtered.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <p className="text-lg font-medium text-gray-500">Aucune recette trouvée</p>
          <p className="mt-1 text-sm text-gray-400">
            {recipes.length === 0
              ? "Créez votre première recette pour commencer."
              : "Modifiez les filtres pour voir plus de résultats."}
          </p>
          {recipes.length === 0 && (
            <Link
              href="/recipes/new"
              className="mt-4 text-sm font-medium text-primary-600 hover:underline"
            >
              Créer une recette →
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}
