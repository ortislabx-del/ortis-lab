import Link from "next/link";
import { StockItem } from "@/types/recipe";
import { formatCurrency } from "@/lib/utils";
import { Edit, AlertTriangle } from "lucide-react";

interface IngredientListProps {
  ingredients: StockItem[];
}

export function IngredientList({ ingredients }: IngredientListProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {["Nom", "Unité", "En stock", "Minimum", "Coût unitaire", "Statut", ""].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {ingredients.map((ing) => {
            const isLow = ing.quantityInStock <= ing.minQuantity;
            return (
              <tr key={ing.id} className={isLow ? "bg-red-50" : ""}>
                <td className="px-4 py-3 font-medium text-gray-900">
                  {ing.name}
                </td>
                <td className="px-4 py-3 text-gray-500">{ing.unit}</td>
                <td className={`px-4 py-3 ${isLow ? "font-semibold text-red-600" : "text-gray-700"}`}>
                  {ing.quantityInStock}
                </td>
                <td className="px-4 py-3 text-gray-500">{ing.minQuantity}</td>
                <td className="px-4 py-3 text-gray-500">
                  {ing.averageUnitCost != null
                    ? `${formatCurrency(ing.averageUnitCost)}/${ing.unit}`
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  {isLow ? (
                    <span className="flex items-center gap-1 badge-red">
                      <AlertTriangle className="h-3 w-3" />
                      Stock faible
                    </span>
                  ) : (
                    <span className="badge-green">OK</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/ingredients/${ing.id}/edit`}
                    className="flex items-center gap-1 text-gray-400 hover:text-primary-600"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
