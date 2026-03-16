"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StockMovement } from "@/types/recipe";
import { fetchStockMovements } from "@/lib/api-clients/stock";
import { formatDate, formatCurrency } from "@/lib/utils";
import { PageLoader } from "@/components/ui/loading-spinner";
import { Plus, ArrowDown, ArrowUp, RotateCcw } from "lucide-react";

const TYPE_ICONS = {
  in: <ArrowDown className="h-4 w-4 text-green-500" />,
  out: <ArrowUp className="h-4 w-4 text-red-500" />,
  adjustment: <RotateCcw className="h-4 w-4 text-blue-500" />,
};

const TYPE_LABELS = {
  in: "Entrée",
  out: "Sortie",
  adjustment: "Ajustement",
};

export default function StockMovementsPage() {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStockMovements()
      .then(setMovements)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {loading ? "…" : `${movements.length} mouvement${movements.length > 1 ? "s" : ""}`}
        </p>
        <Link
          href="/stock"
          className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Plus className="h-4 w-4" />
          Nouveau mouvement
        </Link>
      </div>

      {loading ? (
        <PageLoader />
      ) : movements.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <p className="text-gray-400">Aucun mouvement de stock</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["Type", "Article", "Quantité", "Coût unitaire", "Motif", "Date"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {movements.map((mv) => (
                <tr key={mv.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {TYPE_ICONS[mv.movementType]}
                      <span className="text-gray-700">
                        {TYPE_LABELS[mv.movementType]}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {mv.stockItemName ?? mv.stockItemId}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{mv.quantity}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {mv.unitCost != null ? formatCurrency(mv.unitCost) : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {mv.reason ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {mv.createdAt ? formatDate(mv.createdAt) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
