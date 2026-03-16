"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StockItem } from "@/types/recipe";
import { fetchStock } from "@/lib/api-clients/stock";
import { createStockMovement } from "@/lib/api-clients/stock";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";

export function StockMovementForm() {
  const router = useRouter();
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [form, setForm] = useState({
    stockItemId: "",
    movementType: "in" as "in" | "out" | "adjustment",
    quantity: "",
    unitCost: "",
    reason: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStock().then(setStockItems);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.stockItemId || !form.quantity) return;
    setLoading(true);
    try {
      await createStockMovement({
        stockItemId: form.stockItemId,
        movementType: form.movementType,
        quantity: Number(form.quantity),
        unitCost: form.unitCost ? Number(form.unitCost) : undefined,
        reason: form.reason || undefined,
      });
      router.push("/stock");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card max-w-lg space-y-4">
      <h3 className="font-semibold text-gray-900">Nouveau mouvement de stock</h3>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Article <span className="text-red-500">*</span>
        </label>
        <select
          value={form.stockItemId}
          onChange={(e) => setForm((p) => ({ ...p, stockItemId: e.target.value }))}
          required
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          <option value="">Sélectionner un article…</option>
          {stockItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} ({item.unit})
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Type de mouvement</label>
        <select
          value={form.movementType}
          onChange={(e) =>
            setForm((p) => ({
              ...p,
              movementType: e.target.value as "in" | "out" | "adjustment",
            }))
          }
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          <option value="in">Entrée</option>
          <option value="out">Sortie</option>
          <option value="adjustment">Ajustement</option>
        </select>
      </div>

      <FormInput
        label="Quantité"
        type="number"
        min={0.001}
        step={0.001}
        value={form.quantity}
        onChange={(e) => setForm((p) => ({ ...p, quantity: e.target.value }))}
        required
      />
      <FormInput
        label="Coût unitaire (€)"
        type="number"
        min={0}
        step={0.0001}
        value={form.unitCost}
        onChange={(e) => setForm((p) => ({ ...p, unitCost: e.target.value }))}
        placeholder="Optionnel"
      />
      <FormInput
        label="Motif"
        value={form.reason}
        onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))}
        placeholder="Ex: Réception commande, Production, Inventaire…"
      />

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Annuler
        </Button>
        <Button type="submit" loading={loading}>
          Enregistrer le mouvement
        </Button>
      </div>
    </form>
  );
}
