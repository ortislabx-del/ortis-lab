import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProductionList from '@/components/production-list'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Production - Kitchen Tech Sheets',
}

export default async function ProductionPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: productions } = await supabase
    .from('productions')
    .select('*, recipe:recipes(id, name, portions), produced_by_profile:profiles(full_name)')
    .order('produced_at', { ascending: false })
    .limit(50)

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-green-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-6">
          <Link href="/dashboard" className="text-xl font-bold">
            🍽️ Kitchen Tech Sheets
          </Link>
          <Link href="/recipes" className="hover:text-green-200">Recettes</Link>
          <Link href="/production" className="text-green-300 font-medium">Production</Link>
          <Link href="/stock" className="hover:text-green-200">Stock</Link>
          <Link href="/reports" className="hover:text-green-200">Rapports</Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Productions</h1>
          <Link
            href="/production/new"
            className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            + Nouvelle production
          </Link>
        </div>

        <ProductionList productions={productions ?? []} />
      </main>
    </div>
  )
}
