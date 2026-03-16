import Link from "next/link";
import { StockItem } from "@/types/recipe";
import { formatCurrency } from "@/lib/utils";
import { Package, Edit, AlertTriangle } from "lucide-react";

interface IngredientCardProps {
  ingredient: StockItem;
}

export function IngredientCard({ ingredient }: IngredientCardProps) {
  const isLowStock = ingredient.quantityInStock <= ingredient.minQuantity;

  return (
    <div className={`card relative ${isLowStock ? "border-red-200" : ""}`}>
      {isLowStock && (
        <div className="absolute right-3 top-3">
          <AlertTriangle className="h-4 w-4 text-red-500" />
        </div>
      )}
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
          <Package className="h-5 w-5 text-gray-500" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{ingredient.name}</h3>
          <p className="text-xs text-gray-400">{ingredient.unit}</p>
        </div>
      </div>

      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">En stock</span>
          <span
            className={`font-medium ${
              isLowStock ? "text-red-600" : "text-gray-900"
            }`}
          >
            {ingredient.quantityInStock} {ingredient.unit}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Minimum</span>
          <span className="text-gray-700">
            {ingredient.minQuantity} {ingredient.unit}
          </span>
        </div>
        {ingredient.averageUnitCost != null && (
          <div className="flex justify-between">
            <span className="text-gray-500">Coût unitaire</span>
            <span className="text-gray-700">
              {formatCurrency(ingredient.averageUnitCost)}/{ingredient.unit}
            </span>
          </div>
        )}
      </div>

      {/* Stock bar */}
      {ingredient.minQuantity > 0 && (
        <div className="mt-3">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full transition-all ${
                isLowStock ? "bg-red-500" : "bg-green-500"
              }`}
              style={{
                width: `${Math.min(
                  (ingredient.quantityInStock / (ingredient.minQuantity * 3)) * 100,
                  100
                )}%`,
              }}
            />
          </div>
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <Link href={`/ingredients/${ingredient.id}/edit`}>
          <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-50 hover:text-gray-700">
            <Edit className="h-3.5 w-3.5" />
            Modifier
          </button>
        </Link>
      </div>
    </div>
  );
}
