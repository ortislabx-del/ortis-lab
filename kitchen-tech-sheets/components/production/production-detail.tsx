import Link from "next/link";
import { ProductionOrder } from "@/types/recipe";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

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

interface ProductionDetailProps {
  order: ProductionOrder;
}

export function ProductionDetail({ order }: ProductionDetailProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {order.recipeName ?? order.recipeId}
          </h2>
          <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
            <span className={STATUS_CLASSES[order.status] ?? "badge-gray"}>
              {STATUS_LABELS[order.status] ?? order.status}
            </span>
            {order.createdAt && <span>{formatDate(order.createdAt)}</span>}
          </div>
        </div>
        <Link href={`/production/${order.id}/edit`}>
          <Button variant="secondary" size="sm">
            <Edit className="h-4 w-4" />
            Modifier
          </Button>
        </Link>
      </div>

      {/* Details */}
      <div className="card grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Recette</p>
          <Link
            href={`/recipes/${order.recipeId}`}
            className="mt-1 font-medium text-primary-600 hover:underline"
          >
            {order.recipeName ?? order.recipeId}
          </Link>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Quantité à produire</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{order.quantity}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Statut</p>
          <div className="mt-1">
            <span className={STATUS_CLASSES[order.status] ?? "badge-gray"}>
              {STATUS_LABELS[order.status] ?? order.status}
            </span>
          </div>
        </div>
        {order.createdAt && (
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Créé le</p>
            <p className="mt-1 text-gray-700">{formatDate(order.createdAt)}</p>
          </div>
        )}
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="card">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Notes</p>
          <p className="mt-2 text-sm text-gray-700">{order.notes}</p>
        </div>
      )}

      {/* Status flow */}
      <div className="card">
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-500">
          Progression
        </p>
        <div className="flex items-center gap-2">
          {(["draft", "validated", "done"] as const).map((status, i) => {
            const statuses = ["draft", "validated", "done", "cancelled"];
            const currentIdx = statuses.indexOf(order.status);
            const stepIdx = i;
            const done = currentIdx > stepIdx;
            const active = currentIdx === stepIdx;
            const cancelled = order.status === "cancelled";

            return (
              <div key={status} className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold
                    ${
                      cancelled
                        ? "bg-gray-100 text-gray-400"
                        : done || active
                        ? "bg-primary-600 text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                >
                  {i + 1}
                </div>
                <span
                  className={`text-xs ${
                    active ? "font-semibold text-primary-700" : "text-gray-400"
                  }`}
                >
                  {STATUS_LABELS[status]}
                </span>
                {i < 2 && <div className="h-px w-8 bg-gray-200" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
