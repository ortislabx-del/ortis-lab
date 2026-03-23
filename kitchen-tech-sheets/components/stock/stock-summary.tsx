import { StockItem } from "@/types/recipe";
import { getLowStockItems } from "@/lib/calculations";
import { Package, AlertTriangle, CheckCircle } from "lucide-react";

interface StockSummaryProps {
  items: StockItem[];
}

export function StockSummary({ items }: StockSummaryProps) {
  const low = getLowStockItems(items);
  const ok = items.length - low.length;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="card flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
          <Package className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{items.length}</p>
          <p className="text-sm text-gray-500">Articles total</p>
        </div>
      </div>

      <div className="card flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{ok}</p>
          <p className="text-sm text-gray-500">En stock suffisant</p>
        </div>
      </div>

      <div className="card flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <div>
          <p className="text-2xl font-bold text-red-600">{low.length}</p>
          <p className="text-sm text-gray-500">Stock faible</p>
        </div>
      </div>
    </div>
  );
}
