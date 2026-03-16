"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Recipe, ProductionOrder } from "@/types/recipe";
import { fetchRecipes } from "@/lib/api-clients/recipes";
import { createProductionOrder, updateProductionOrder } from "@/lib/api-clients/production";
import { Button } from "@/components/ui/button";
import { FormInput, Textarea } from "@/components/ui/form-input";

interface ProductionFormProps {
  order?: ProductionOrder;
}

export function ProductionForm({ order }: ProductionFormProps) {
  const router = useRouter();
  const isEdit = !!order?.id;
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [form, setForm] = useState({
    recipeId: order?.recipeId ?? "",
    quantity: order?.quantity ?? 1,
    status: order?.status ?? ("draft" as const),
    notes: order?.notes ?? "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRecipes().then(setRecipes);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.recipeId) return;
    setLoading(true);
    try {
      if (isEdit && order.id) {
        await updateProductionOrder(order.id, {
          ...form,
          quantity: Number(form.quantity),
        });
        router.push(`/production/${order.id}`);
      } else {
        const created = await createProductionOrder({
          recipeId: form.recipeId,
          quantity: Number(form.quantity),
          status: form.status,
          notes: form.notes || undefined,
          recipeName:
            recipes.find((r) => r.id === form.recipeId)?.name ?? undefined,
        });
        router.push(`/production/${created.id}`);
      }
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
        {isEdit ? "Modifier la commande" : "Nouvelle commande de production"}
      </h3>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Recette <span className="text-red-500">*</span>
        </label>
        <select
          value={form.recipeId}
          onChange={(e) => setForm((p) => ({ ...p, recipeId: e.target.value }))}
          required
          disabled={isEdit}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:bg-gray-50"
        >
          <option value="">Sélectionner une recette…</option>
          {recipes.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      <FormInput
        label="Quantité à produire"
        type="number"
        min={0.001}
        step={0.001}
        value={form.quantity}
        onChange={(e) => setForm((p) => ({ ...p, quantity: Number(e.target.value) }))}
        required
      />

      {isEdit && (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Statut</label>
          <select
            value={form.status}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                status: e.target.value as ProductionOrder["status"],
              }))
            }
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="draft">Brouillon</option>
            <option value="validated">Validé</option>
            <option value="done">Terminé</option>
            <option value="cancelled">Annulé</option>
          </select>
        </div>
      )}

      <Textarea
        label="Notes"
        value={form.notes}
        onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
        placeholder="Instructions spéciales, priorités…"
        rows={3}
      />

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Annuler
        </Button>
        <Button type="submit" loading={loading}>
          {isEdit ? "Enregistrer" : "Créer la commande"}
        </Button>
      </div>
    </form>
  );
}
