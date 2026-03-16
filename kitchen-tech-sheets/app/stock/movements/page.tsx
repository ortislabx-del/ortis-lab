import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import StockMovementForm from '@/components/stock-movement-form'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Mouvements de stock - Kitchen Tech Sheets',
}

export default async function StockMovementsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [{ data: ingredients }, { data: movements }] = await Promise.all([
    supabase.from('ingredients').select('*').order('name'),
    supabase
      .from('stock_movements')
      .select('*, ingredient:ingredients(name, unit), created_by_profile:profiles(full_name)')
      .order('created_at', { ascending: false })
      .limit(50),
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

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/stock" className="text-gray-500 hover:text-gray-700">
            ← Stock
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Mouvements de stock</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Nouveau mouvement</h2>
            <StockMovementForm ingredients={ingredients ?? []} userId={user.id} />
          </div>

          {/* Movements history */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Historique des mouvements</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-gray-200">
                    <th className="pb-3 font-medium text-gray-600">Date</th>
                    <th className="pb-3 font-medium text-gray-600">Ingrédient</th>
                    <th className="pb-3 font-medium text-gray-600">Type</th>
                    <th className="pb-3 font-medium text-gray-600">Quantité</th>
                    <th className="pb-3 font-medium text-gray-600">Par</th>
                  </tr>
                </thead>
                <tbody>
                  {(movements ?? []).map((movement) => (
                    <tr key={movement.id} className="border-b border-gray-100">
                      <td className="py-2 text-gray-500">
                        {new Date(movement.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-2 font-medium">{movement.ingredient?.name}</td>
                      <td className="py-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            movement.movement_type === 'in'
                              ? 'bg-green-100 text-green-700'
                              : movement.movement_type === 'out'
                                ? 'bg-red-100 text-red-700'
                                : movement.movement_type === 'production'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {movement.movement_type === 'in'
                            ? 'Entrée'
                            : movement.movement_type === 'out'
                              ? 'Sortie'
                              : movement.movement_type === 'production'
                                ? 'Production'
                                : 'Ajustement'}
                        </span>
                      </td>
                      <td
                        className={`py-2 font-medium ${movement.quantity >= 0 ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {movement.quantity >= 0 ? '+' : ''}
                        {movement.quantity} {movement.ingredient?.unit}
                      </td>
                      <td className="py-2 text-gray-500">
                        {movement.created_by_profile?.full_name ?? '-'}
                      </td>
                    </tr>
                  ))}
                  {!movements?.length && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-400">
                        Aucun mouvement enregistré
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
