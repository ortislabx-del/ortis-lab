import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import RecipeDetail from '@/components/recipe-detail'
import DeleteRecipeButton from '@/components/delete-recipe-button'
import Link from 'next/link'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const supabase = await createClient()
  const { id } = await params
  const { data: recipe } = await supabase.from('recipes').select('name').eq('id', id).single()
  return {
    title: recipe ? `${recipe.name} - Kitchen Tech Sheets` : 'Recette - Kitchen Tech Sheets',
  }
}

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { id } = await params
  const { data: recipe } = await supabase
    .from('recipes')
    .select(
      '*, category:categories(*), components:recipe_components(*, ingredient:ingredients(*)), created_by_profile:profiles(full_name)'
    )
    .eq('id', id)
    .single()

  if (!recipe) notFound()

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const canEdit = profile?.role === 'admin' || profile?.role === 'chef'

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-green-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-6">
          <Link href="/dashboard" className="text-xl font-bold">
            🍽️ Kitchen Tech Sheets
          </Link>
          <Link href="/recipes" className="hover:text-green-200">Recettes</Link>
          <Link href="/production" className="hover:text-green-200">Production</Link>
          <Link href="/stock" className="hover:text-green-200">Stock</Link>
          <Link href="/reports" className="hover:text-green-200">Rapports</Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/recipes" className="text-gray-500 hover:text-gray-700">
            ← Recettes
          </Link>
          {canEdit && (
            <div className="flex gap-3">
              <Link
                href={`/recipes/${id}/edit`}
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Modifier
              </Link>
              <DeleteRecipeButton recipeId={id} recipeName={recipe.name} />
            </div>
          )}
        </div>

        <RecipeDetail recipe={recipe} />
      </main>
    </div>
  )
}
