import Link from "next/link";
import { ProductionOrder } from "@/types/recipe";
import { formatDate } from "@/lib/utils";

const STATUS_LABELS: Record<string, string> = {
  draft: "Brouillon",
  validated: "Validé",
  done: "Terminé",
  cancelled: "Annulé",
};

const STATUS_CLASSES: Record<string, string> = {
  draft: "badge-gray",
  validated: "badge-blue",
  done: "badge-green",
  cancelled: "badge-red",
};

interface ProductionListProps {
  orders: ProductionOrder[];
}

export function ProductionList({ orders }: ProductionListProps) {
  if (orders.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center py-12 text-center">
        <p className="text-gray-400">Aucune commande de production</p>
        <Link
          href="/production/new"
          className="mt-3 text-sm font-medium text-primary-600 hover:underline"
        >
          Créer une commande →
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {["Recette", "Quantité", "Statut", "Date", ""].map((h) => (
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
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">
                <Link
                  href={`/production/${order.id}`}
                  className="hover:text-primary-600"
                >
                  {order.recipeName ?? order.recipeId}
                </Link>
              </td>
              <td className="px-4 py-3 text-gray-600">{order.quantity}</td>
              <td className="px-4 py-3">
                <span className={STATUS_CLASSES[order.status] ?? "badge-gray"}>
                  {STATUS_LABELS[order.status] ?? order.status}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-500">
                {order.createdAt ? formatDate(order.createdAt) : "—"}
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/production/${order.id}`}
                  className="text-xs text-primary-600 hover:underline"
                >
                  Détail →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
