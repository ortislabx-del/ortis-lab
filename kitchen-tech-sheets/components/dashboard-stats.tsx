import { createClient } from '@/lib/supabase/server'

export default async function DashboardStats() {
  const supabase = await createClient()

  const [
    { count: totalRecipes },
    { count: activeRecipes },
    { count: totalProductions },
    { data: lowStockItems },
  ] = await Promise.all([
    supabase.from('recipes').select('*', { count: 'exact', head: true }),
    supabase
      .from('recipes')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true),
    supabase.from('productions').select('*', { count: 'exact', head: true }),
    supabase.from('ingredients').select('id, name, current_stock, min_stock').filter(
      'current_stock',
      'lte',
      'min_stock'
    ),
  ])

  const stats = [
    {
      label: 'Recettes totales',
      value: totalRecipes ?? 0,
      icon: '📋',
      color: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-700',
    },
    {
      label: 'Recettes actives',
      value: activeRecipes ?? 0,
      icon: '✅',
      color: 'bg-green-50 border-green-200',
      textColor: 'text-green-700',
    },
    {
      label: 'Productions ce mois',
      value: totalProductions ?? 0,
      icon: '🍳',
      color: 'bg-orange-50 border-orange-200',
      textColor: 'text-orange-700',
    },
    {
      label: 'Alertes stock faible',
      value: lowStockItems?.length ?? 0,
      icon: '⚠️',
      color: 'bg-red-50 border-red-200',
      textColor: 'text-red-700',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`${stat.color} border rounded-xl p-6 flex items-center gap-4`}
        >
          <span className="text-4xl">{stat.icon}</span>
          <div>
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
