import Link from "next/link";
import { StockItem } from "@/types/recipe";
import { AlertTriangle } from "lucide-react";

interface LowStockAlertProps {
  items: StockItem[];
}

export function LowStockAlert({ items }: LowStockAlertProps) {
  if (items.length === 0) return null;

  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4">
      <div className="mb-3 flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-red-600" />
        <h3 className="font-semibold text-red-900">
          {items.length} article{items.length > 1 ? "s" : ""} en stock faible
        </h3>
      </div>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between text-sm">
            <Link
              href={`/ingredients/${item.id}/edit`}
              className="text-red-800 hover:underline"
            >
              {item.name}
            </Link>
            <span className="text-red-600">
              {item.quantityInStock}/{item.minQuantity} {item.unit}
            </span>
          </li>
        ))}
      </ul>
      <Link
        href="/stock"
        className="mt-3 block text-xs font-medium text-red-700 hover:underline"
      >
        Voir le stock →
      </Link>
    </div>
  );
}
