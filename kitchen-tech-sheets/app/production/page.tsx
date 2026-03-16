"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProductionOrder } from "@/types/recipe";
import { fetchProductionOrders } from "@/lib/api-clients/production";
import { ProductionList } from "@/components/production/production-list";
import { PageLoader } from "@/components/ui/loading-spinner";
import { Plus } from "lucide-react";

export default function ProductionPage() {
  const [orders, setOrders] = useState<ProductionOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchProductionOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter
    ? orders.filter((o) => o.status === filter)
    : orders;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          {["", "draft", "validated", "done", "cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                filter === s
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {s === "" ? "Tous" : s === "draft" ? "Brouillon" : s === "validated" ? "Validé" : s === "done" ? "Terminé" : "Annulé"}
            </button>
          ))}
        </div>
        <Link
          href="/production/new"
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          Nouvelle commande
        </Link>
      </div>

      {loading ? <PageLoader /> : <ProductionList orders={filtered} />}
    </div>
  );
}
