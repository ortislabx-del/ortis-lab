'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import type { Category } from '@/types/recipe'

interface RecipeFiltersProps {
  categories: Category[]
}

export default function RecipeFilters({ categories }: RecipeFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <input
        type="search"
        placeholder="Rechercher une recette..."
        defaultValue={searchParams.get('search') ?? ''}
        onChange={(e) => updateFilter('search', e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-64"
      />

      <select
        defaultValue={searchParams.get('category') ?? ''}
        onChange={(e) => updateFilter('category', e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="">Toutes les catégories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      <select
        defaultValue={searchParams.get('active') ?? 'true'}
        onChange={(e) => updateFilter('active', e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="true">Actives seulement</option>
        <option value="all">Toutes</option>
      </select>
    </div>
  )
}
