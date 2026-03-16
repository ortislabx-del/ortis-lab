import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import RecipeForm from '@/components/recipe-form'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Nouvelle recette - Kitchen Tech Sheets',
}

export default async function NewRecipePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [{ data: categories }, { data: ingredients }] = await Promise.all([
    supabase.from('categories').select('*').order('name'),
    supabase.from('ingredients').select('*').order('name'),
  ])

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
        <div className="flex items-center gap-3 mb-8">
          <Link href="/recipes" className="text-gray-500 hover:text-gray-700">
            ← Recettes
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Nouvelle recette</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <RecipeForm
            categories={categories ?? []}
            ingredients={ingredients ?? []}
            userId={user.id}
          />
        </div>
      </main>
    </div>
  )
}
