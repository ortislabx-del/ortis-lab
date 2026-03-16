"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StockItem } from "@/types/recipe";
import { createIngredient, updateIngredient } from "@/lib/api-clients/ingredients";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";

const UNITS = ["g", "kg", "ml", "L", "pièce(s)", "cl", "c.à.s", "c.à.c", "boîte(s)"];

interface IngredientFormProps {
  ingredient?: StockItem;
}

export function IngredientForm({ ingredient }: IngredientFormProps) {
  const router = useRouter();
  const isEdit = !!ingredient?.id;

  const [form, setForm] = useState({
    name: ingredient?.name ?? "",
    unit: ingredient?.unit ?? "g",
    quantityInStock: ingredient?.quantityInStock ?? 0,
    minQuantity: ingredient?.minQuantity ?? 0,
    averageUnitCost: ingredient?.averageUnitCost?.toString() ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Nom requis";
    if (!form.unit) e.unit = "Unité requise";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload: Omit<StockItem, "id"> = {
        name: form.name,
        unit: form.unit,
        quantityInStock: Number(form.quantityInStock),
        minQuantity: Number(form.minQuantity),
        averageUnitCost: form.averageUnitCost ? Number(form.averageUnitCost) : undefined,
      };
      if (isEdit && ingredient.id) {
        await updateIngredient(ingredient.id, payload);
      } else {
        await createIngredient(payload);
      }
      router.push("/ingredients");
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
      <h3 className="font-semibold text-gray-900">
        {isEdit ? "Modifier l'ingrédient" : "Nouvel ingrédient"}
      </h3>

      <FormInput
        label="Nom"
        value={form.name}
        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
        error={errors.name}
        required
        placeholder="Ex: Tomate"
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Unité <span className="text-red-500">*</span>
        </label>
        <select
          value={form.unit}
          onChange={(e) => setForm((p) => ({ ...p, unit: e.target.value }))}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          {UNITS.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
        {errors.unit && <p className="text-xs text-red-500">{errors.unit}</p>}
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
          hint="Alerte si stock ≤ ce seuil"
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
        placeholder="0.00"
      />

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Annuler
        </Button>
        <Button type="submit" loading={loading}>
          {isEdit ? "Enregistrer" : "Créer l'ingrédient"}
        </Button>
      </div>
    </form>
  );
}
