import { DashboardStats } from "@/types/recipe";
import { BookOpen, ShoppingBasket, AlertTriangle, ClipboardList, TrendingUp, ChefHat } from "lucide-react";

interface DashboardStatsProps {
  stats: DashboardStats;
}

export function DashboardStatsPanel({ stats }: DashboardStatsProps) {
  const cards = [
    {
      label: "Recettes total",
      value: stats.totalRecipes,
      sub: `${stats.simpleRecipes} simples · ${stats.composedRecipes} composées`,
      icon: BookOpen,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Ingrédients",
      value: stats.totalIngredients,
      sub: "dans la base",
      icon: ShoppingBasket,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Stock faible",
      value: stats.lowStockCount,
      sub: "articles sous le seuil",
      icon: AlertTriangle,
      color: stats.lowStockCount > 0 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600",
    },
    {
      label: "Commandes prod.",
      value: stats.totalProductionOrders,
      sub: `${stats.pendingOrders} en attente`,
      icon: ClipboardList,
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "Coût alim. moyen",
      value: `${stats.avgFoodCostPercent.toFixed(1)}%`,
      sub: "sur les recettes",
      icon: TrendingUp,
      color:
        stats.avgFoodCostPercent > 40
          ? "bg-red-100 text-red-600"
          : stats.avgFoodCostPercent > 30
          ? "bg-yellow-100 text-yellow-600"
          : "bg-green-100 text-green-600",
    },
    {
      label: "Recettes composées",
      value: stats.composedRecipes,
      sub: "avec compositions",
      icon: ChefHat,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <div key={card.label} className="card flex items-center gap-4">
          <div
            className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${card.color}`}
          >
            <card.icon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-sm font-medium text-gray-700">{card.label}</p>
            <p className="text-xs text-gray-400">{card.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
