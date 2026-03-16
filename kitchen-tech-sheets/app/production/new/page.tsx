import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProductionForm from '@/components/production-form'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Nouvelle production - Kitchen Tech Sheets',
}

export default async function NewProductionPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: recipes } = await supabase
    .from('recipes')
    .select('id, name, portions, components:recipe_components(*, ingredient:ingredients(*))')
    .eq('is_active', true)
    .order('name')

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

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/production" className="text-gray-500 hover:text-gray-700">
            ← Productions
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Nouvelle production</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <ProductionForm recipes={recipes ?? []} userId={user.id} />
        </div>
      </main>
    </div>
  )
}
