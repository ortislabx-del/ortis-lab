"use client";

import { useState } from "react";
import { Search, Filter } from "lucide-react";

export type RecipeFilters = {
  search: string;
  category: string;
  recipeType: string;
};

interface RecipeFiltersBarProps {
  filters: RecipeFilters;
  onChange: (filters: RecipeFilters) => void;
}

const CATEGORIES = [
  "Entrée",
  "Plat principal",
  "Dessert",
  "Sauce",
  "Pâtisserie",
  "Petit-déjeuner",
  "Boisson",
  "Autre",
];

export function RecipeFiltersBar({ filters, onChange }: RecipeFiltersBarProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher une recette…"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>

      {/* Toggle filters */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <Filter className="h-4 w-4" />
        {expanded ? "Masquer les filtres" : "Filtres avancés"}
      </button>

      {expanded && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {/* Category */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Catégorie
            </label>
            <select
              value={filters.category}
              onChange={(e) => onChange({ ...filters, category: e.target.value })}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="">Toutes</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Type
            </label>
            <select
              value={filters.recipeType}
              onChange={(e) => onChange({ ...filters, recipeType: e.target.value })}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="">Tous</option>
              <option value="simple">Simple</option>
              <option value="composed">Composée</option>
            </select>
          </div>

          {/* Reset */}
          <div className="flex items-end">
            <button
              onClick={() => onChange({ search: "", category: "", recipeType: "" })}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
