import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ReportCards from '@/components/report-cards'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Rapports - Kitchen Tech Sheets',
}

export default async function ReportsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Fetch productions for the last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: productions } = await supabase
    .from('productions')
    .select('*, recipe:recipes(name, portions)')
    .gte('produced_at', thirtyDaysAgo.toISOString())
    .order('produced_at', { ascending: false })

  const { data: lowStockIngredients } = await supabase
    .from('ingredients')
    .select('*')
    .filter('current_stock', 'lte', 'min_stock')

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
          <Link href="/reports" className="text-green-300 font-medium">Rapports</Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Rapports</h1>
        <ReportCards
          productions={productions ?? []}
          lowStockIngredients={lowStockIngredients ?? []}
        />
      </main>
    </div>
  )
}
