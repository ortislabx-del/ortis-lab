import Link from "next/link";
import { DashboardStats } from "@/types/recipe";
import { TrendingUp, TrendingDown, BookOpen, Package, Activity } from "lucide-react";

interface ReportCardsProps {
  stats: DashboardStats;
}

export function ReportCards({ stats }: ReportCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="card">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Total recettes</p>
          <BookOpen className="h-5 w-5 text-blue-500" />
        </div>
        <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalRecipes}</p>
        <Link href="/recipes" className="mt-1 text-xs text-primary-600 hover:underline">
          Voir les recettes →
        </Link>
      </div>

      <div className="card">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Coût alimentaire moyen</p>
          {stats.avgFoodCostPercent > 35 ? (
            <TrendingUp className="h-5 w-5 text-red-500" />
          ) : (
            <TrendingDown className="h-5 w-5 text-green-500" />
          )}
        </div>
        <p
          className={`mt-2 text-3xl font-bold ${
            stats.avgFoodCostPercent > 40
              ? "text-red-600"
              : stats.avgFoodCostPercent > 30
              ? "text-yellow-600"
              : "text-green-600"
          }`}
        >
          {stats.avgFoodCostPercent.toFixed(1)}%
        </p>
        <p className="mt-1 text-xs text-gray-400">Idéal: 25–35%</p>
      </div>

      <div className="card">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Articles stock faible</p>
          <Package className="h-5 w-5 text-orange-500" />
        </div>
        <p
          className={`mt-2 text-3xl font-bold ${
            stats.lowStockCount > 0 ? "text-red-600" : "text-green-600"
          }`}
        >
          {stats.lowStockCount}
        </p>
        <Link href="/stock" className="mt-1 text-xs text-primary-600 hover:underline">
          Gérer le stock →
        </Link>
      </div>

      <div className="card">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Commandes en cours</p>
          <Activity className="h-5 w-5 text-purple-500" />
        </div>
        <p className="mt-2 text-3xl font-bold text-gray-900">{stats.pendingOrders}</p>
        <Link href="/production" className="mt-1 text-xs text-primary-600 hover:underline">
          Voir la production →
        </Link>
      </div>
    </div>
  );
}
