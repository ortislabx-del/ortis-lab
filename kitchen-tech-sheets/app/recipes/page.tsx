import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import RecipeCard from '@/components/recipe-card'
import RecipeFilters from '@/components/recipe-filters'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Recettes - Kitchen Tech Sheets',
}

export default async function RecipesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string; active?: string }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const params = await searchParams

  let query = supabase
    .from('recipes')
    .select('*, category:categories(id, name), components:recipe_components(id)')
    .order('name')

  if (params.category) {
    query = query.eq('category_id', params.category)
  }
  if (params.active !== 'all') {
    query = query.eq('is_active', true)
  }
  if (params.search) {
    query = query.ilike('name', `%${params.search}%`)
  }

  const { data: recipes } = await query
  const { data: categories } = await supabase.from('categories').select('*').order('name')

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-green-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-6">
          <Link href="/dashboard" className="text-xl font-bold">
            🍽️ Kitchen Tech Sheets
          </Link>
          <Link href="/recipes" className="text-green-300 font-medium">Recettes</Link>
          <Link href="/production" className="hover:text-green-200">Production</Link>
          <Link href="/stock" className="hover:text-green-200">Stock</Link>
          <Link href="/reports" className="hover:text-green-200">Rapports</Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Recettes</h1>
          <Link
            href="/recipes/new"
            className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            + Nouvelle recette
          </Link>
        </div>

        <RecipeFilters categories={categories ?? []} />

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(recipes ?? []).map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
          {!recipes?.length && (
            <div className="col-span-3 py-16 text-center text-gray-400">
              <p className="text-lg">Aucune recette trouvée</p>
              <Link href="/recipes/new" className="text-green-600 hover:underline mt-2 inline-block">
                Créer votre première recette
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
