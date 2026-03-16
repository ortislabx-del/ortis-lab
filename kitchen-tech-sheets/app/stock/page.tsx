import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import StockSummary from '@/components/stock-summary'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Stock - Kitchen Tech Sheets',
}

export default async function StockPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: ingredients } = await supabase
    .from('ingredients')
    .select('*')
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
          <Link href="/stock" className="text-green-300 font-medium">Stock</Link>
          <Link href="/reports" className="hover:text-green-200">Rapports</Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestion des stocks</h1>
          <div className="flex gap-3">
            <Link
              href="/stock/movements"
              className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Voir les mouvements
            </Link>
            <Link
              href="/stock/movements"
              className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              + Mouvement de stock
            </Link>
          </div>
        </div>

        <StockSummary ingredients={ingredients ?? []} />
      </main>
    </div>
  )
}
