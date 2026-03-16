"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StockItem } from "@/types/recipe";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";

const UNITS = ["g", "kg", "ml", "L", "pièce(s)", "cl", "c.à.s", "c.à.c", "boîte(s)"];

interface StockFormProps {
  stockItem?: StockItem;
  onSave?: (item: StockItem) => void;
}

export function StockForm({ stockItem, onSave }: StockFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: stockItem?.name ?? "",
    unit: stockItem?.unit ?? "g",
    quantityInStock: stockItem?.quantityInStock ?? 0,
    minQuantity: stockItem?.minQuantity ?? 0,
    averageUnitCost: stockItem?.averageUnitCost?.toString() ?? "",
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: StockItem = {
        ...stockItem,
        name: form.name,
        unit: form.unit,
        quantityInStock: Number(form.quantityInStock),
        minQuantity: Number(form.minQuantity),
        averageUnitCost: form.averageUnitCost ? Number(form.averageUnitCost) : undefined,
      };
      onSave?.(payload);
      if (!onSave) {
        router.push("/stock");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput
        label="Nom"
        value={form.name}
        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
        required
      />
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Unité</label>
        <select
          value={form.unit}
          onChange={(e) => setForm((p) => ({ ...p, unit: e.target.value }))}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
        >
          {UNITS.map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="Quantité en stock"
          type="number"
          min={0}
          step={0.001}
          value={form.quantityInStock}
          onChange={(e) =>
            setForm((p) => ({ ...p, quantityInStock: Number(e.target.value) }))
          }
        />
        <FormInput
          label="Quantité minimale"
          type="number"
          min={0}
          step={0.001}
          value={form.minQuantity}
          onChange={(e) =>
            setForm((p) => ({ ...p, minQuantity: Number(e.target.value) }))
          }
        />
      </div>
      <FormInput
        label="Coût unitaire moyen (€)"
        type="number"
        min={0}
        step={0.0001}
        value={form.averageUnitCost}
        onChange={(e) =>
          setForm((p) => ({ ...p, averageUnitCost: e.target.value }))
        }
        placeholder="Optionnel"
      />
      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Annuler
        </Button>
        <Button type="submit" loading={loading}>
          Enregistrer
        </Button>
      </div>
    </form>
  );
}
