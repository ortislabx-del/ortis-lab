"use client";

import { useEffect, useState } from "react";
import { Recipe } from "@/types/recipe";
import { fetchRecipes } from "@/lib/api-clients/recipes";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Search } from "lucide-react";

interface RecipeComponentSelectorProps {
  onSelect: (recipe: Recipe) => void;
  excludeIds?: string[];
}

export function RecipeComponentSelector({
  onSelect,
  excludeIds = [],
}: RecipeComponentSelectorProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchRecipes()
      .then(setRecipes)
      .finally(() => setLoading(false));
  }, []);

  const filtered = recipes.filter(
    (r) =>
      !excludeIds.includes(r.id) &&
      r.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Chercher une recette…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>
      <ul className="max-h-56 divide-y divide-gray-100 overflow-y-auto rounded-lg border border-gray-200">
        {filtered.length === 0 ? (
          <li className="px-4 py-3 text-sm text-gray-400">Aucune recette trouvée</li>
        ) : (
          filtered.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => onSelect(r)}
                className="flex w-full items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-50"
              >
                <span className="font-medium text-gray-800">{r.name}</span>
                <span className="text-gray-400">{r.category}</span>
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
