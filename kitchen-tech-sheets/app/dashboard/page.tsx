import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardStats from '@/components/dashboard-stats'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Tableau de bord - Kitchen Tech Sheets',
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-green-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/dashboard" className="text-xl font-bold">
            🍽️ Kitchen Tech Sheets
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/recipes" className="hover:text-green-200 transition-colors">
              Recettes
            </Link>
            <Link href="/production" className="hover:text-green-200 transition-colors">
              Production
            </Link>
            <Link href="/stock" className="hover:text-green-200 transition-colors">
              Stock
            </Link>
            <Link href="/reports" className="hover:text-green-200 transition-colors">
              Rapports
            </Link>
            <span className="text-green-300 text-sm">
              {profile?.full_name ?? user.email}
            </span>
            <form action="/api/auth/signout" method="post">
              <button
                type="submit"
                className="text-sm bg-green-700 hover:bg-green-600 px-3 py-1 rounded transition-colors"
              >
                Déconnexion
              </button>
            </form>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-500 mt-1">
            Bienvenue, {profile?.full_name ?? user.email}
          </p>
        </div>

        <DashboardStats />

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/recipes/new"
            className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-green-400 hover:shadow-md transition-all group"
          >
            <span className="text-3xl mb-2">📋</span>
            <span className="font-medium text-gray-700 group-hover:text-green-700">
              Nouvelle recette
            </span>
          </Link>
          <Link
            href="/production/new"
            className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-green-400 hover:shadow-md transition-all group"
          >
            <span className="text-3xl mb-2">🍳</span>
            <span className="font-medium text-gray-700 group-hover:text-green-700">
              Nouvelle production
            </span>
          </Link>
          <Link
            href="/stock/movements"
            className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-green-400 hover:shadow-md transition-all group"
          >
            <span className="text-3xl mb-2">📦</span>
            <span className="font-medium text-gray-700 group-hover:text-green-700">
              Mouvement de stock
            </span>
          </Link>
          <Link
            href="/reports"
            className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-green-400 hover:shadow-md transition-all group"
          >
            <span className="text-3xl mb-2">📊</span>
            <span className="font-medium text-gray-700 group-hover:text-green-700">
              Voir les rapports
            </span>
          </Link>
        </div>
      </main>
    </div>
  )
}
