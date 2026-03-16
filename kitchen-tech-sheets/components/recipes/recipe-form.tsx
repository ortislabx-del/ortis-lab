"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Recipe, RecipeIngredient, RecipeComponent } from "@/types/recipe";
import { createRecipe, updateRecipe } from "@/lib/api-clients/recipes";
import { calculateIngredientCost, calculateComponentCost } from "@/lib/calculations";
import { Button } from "@/components/ui/button";
import { FormInput, Textarea } from "@/components/ui/form-input";
import { Modal } from "@/components/ui/modal";
import { RecipeComponentSelector } from "@/components/recipes/recipe-component-selector";
import { Plus, Trash2, X } from "lucide-react";

const CATEGORIES = [
  "Entrée",
  "Plat principal",
  "Dessert",
  "Sauce",
  "Pâtisserie",
  "Petit-déjeuner",
  "Boisson",
  "Autre",
];

const UNITS = ["g", "kg", "ml", "L", "pièce(s)", "portion(s)", "cl", "c.à.s", "c.à.c"];

interface RecipeFormProps {
  recipe?: Recipe;
}

type FormData = {
  name: string;
  category: string;
  recipeType: "simple" | "composed";
  servings: number;
  prepTime: number;
  cookTime: number;
  sellingPrice: string;
  allergens: string;
  notes: string;
  steps: string;
};

export function RecipeForm({ recipe }: RecipeFormProps) {
  const router = useRouter();
  const isEdit = !!recipe;

  const [form, setForm] = useState<FormData>({
    name: recipe?.name ?? "",
    category: recipe?.category ?? "",
    recipeType: recipe?.recipeType ?? "simple",
    servings: recipe?.servings ?? 1,
    prepTime: recipe?.prepTime ?? 0,
    cookTime: recipe?.cookTime ?? 0,
    sellingPrice: recipe?.sellingPrice?.toString() ?? "",
    allergens: recipe?.allergens ?? "",
    notes: recipe?.notes ?? "",
    steps: recipe?.steps ?? "",
  });

  const [ingredients, setIngredients] = useState<RecipeIngredient[]>(
    recipe?.ingredients ?? []
  );
  const [components, setComponents] = useState<RecipeComponent[]>(
    recipe?.components ?? []
  );

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showComponentSelector, setShowComponentSelector] = useState(false);

  function setField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // ── Ingredient rows ────────────────────────────────────────────────────
  function addIngredient() {
    setIngredients((prev) => [
      ...prev,
      { name: "", quantity: 0, unit: "g" },
    ]);
  }

  function updateIngredient(index: number, field: keyof RecipeIngredient, value: string | number) {
    setIngredients((prev) =>
      prev.map((ing, i) => (i === index ? { ...ing, [field]: value } : ing))
    );
  }

  function removeIngredient(index: number) {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  }

  // ── Component rows ─────────────────────────────────────────────────────
  function addComponent(selected: Recipe) {
    const already = components.some((c) => c.childRecipeId === selected.id);
    if (already) {
      setShowComponentSelector(false);
      return;
    }
    setComponents((prev) => [
      ...prev,
      {
        childRecipeId: selected.id,
        childRecipeName: selected.name,
        quantity: 1,
        unit: "portion(s)",
        totalCost: selected.totalCost,
      },
    ]);
    setShowComponentSelector(false);
  }

  function updateComponent(index: number, field: keyof RecipeComponent, value: string | number) {
    setComponents((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
    );
  }

  function removeComponent(index: number) {
    setComponents((prev) => prev.filter((_, i) => i !== index));
  }

  // ── Calculated total cost ──────────────────────────────────────────────
  const totalCost =
    form.recipeType === "simple"
      ? calculateIngredientCost(ingredients)
      : calculateComponentCost(components);

  // ── Validation ─────────────────────────────────────────────────────────
  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Nom requis";
    if (!form.category) e.category = "Catégorie requise";
    if (form.servings < 1) e.servings = "Au moins 1 portion";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // ── Submit ─────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        ...form,
        servings: Number(form.servings),
        prepTime: Number(form.prepTime),
        cookTime: Number(form.cookTime),
        sellingPrice: form.sellingPrice ? Number(form.sellingPrice) : undefined,
        totalCost,
        ingredients: form.recipeType === "simple" ? ingredients : [],
        components: form.recipeType === "composed" ? components : [],
      };

      if (isEdit) {
        await updateRecipe(recipe.id, payload);
      } else {
        const created = await createRecipe(payload as Omit<Recipe, "id">);
        router.push(`/recipes/${created.id}`);
        return;
      }
      router.push(`/recipes/${recipe.id}`);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <div className="card space-y-4">
          <h3 className="font-semibold text-gray-900">Informations générales</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput
              label="Nom de la recette"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              error={errors.name}
              required
              placeholder="Ex: Sauce tomate maison"
            />

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Catégorie <span className="text-red-500">*</span>
              </label>
              <select
                value={form.category}
                onChange={(e) => setField("category", e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">Sélectionner…</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-xs text-red-500">{errors.category}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Type</label>
              <select
                value={form.recipeType}
                onChange={(e) =>
                  setField("recipeType", e.target.value as "simple" | "composed")
                }
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="simple">Simple</option>
                <option value="composed">Composée</option>
              </select>
            </div>
            <FormInput
              label="Portions"
              type="number"
              min={1}
              value={form.servings}
              onChange={(e) => setField("servings", Number(e.target.value))}
              error={errors.servings}
            />
            <FormInput
              label="Préparation (min)"
              type="number"
              min={0}
              value={form.prepTime}
              onChange={(e) => setField("prepTime", Number(e.target.value))}
            />
            <FormInput
              label="Cuisson (min)"
              type="number"
              min={0}
              value={form.cookTime}
              onChange={(e) => setField("cookTime", Number(e.target.value))}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput
              label="Prix de vente (€)"
              type="number"
              min={0}
              step={0.01}
              value={form.sellingPrice}
              onChange={(e) => setField("sellingPrice", e.target.value)}
              placeholder="0.00"
            />
            <FormInput
              label="Allergènes"
              value={form.allergens}
              onChange={(e) => setField("allergens", e.target.value)}
              placeholder="gluten, lactose, arachides…"
            />
          </div>
        </div>

        {/* Ingredients (simple) */}
        {form.recipeType === "simple" && (
          <div className="card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Ingrédients</h3>
              <Button type="button" variant="secondary" size="sm" onClick={addIngredient}>
                <Plus className="h-4 w-4" />
                Ajouter
              </Button>
            </div>

            {ingredients.length === 0 ? (
              <p className="text-sm text-gray-400">
                Cliquez sur &ldquo;Ajouter&rdquo; pour ajouter des ingrédients.
              </p>
            ) : (
              <div className="space-y-2">
                {ingredients.map((ing, i) => (
                  <div key={i} className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-2">
                    <input
                      type="text"
                      placeholder="Nom"
                      value={ing.name}
                      onChange={(e) => updateIngredient(i, "name", e.target.value)}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                    <input
                      type="number"
                      placeholder="Qté"
                      min={0}
                      step={0.001}
                      value={ing.quantity || ""}
                      onChange={(e) => updateIngredient(i, "quantity", Number(e.target.value))}
                      className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                    <select
                      value={ing.unit}
                      onChange={(e) => updateIngredient(i, "unit", e.target.value)}
                      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    >
                      {UNITS.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Coût/u €"
                      min={0}
                      step={0.0001}
                      value={ing.unitCost ?? ""}
                      onChange={(e) =>
                        updateIngredient(i, "unitCost", e.target.value ? Number(e.target.value) : 0)
                      }
                      className="w-28 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeIngredient(i)}
                      className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <p className="text-right text-sm font-medium text-gray-700">
              Coût total calculé :{" "}
              <span className="text-primary-600">
                {totalCost.toFixed(2)} €
              </span>
            </p>
          </div>
        )}

        {/* Components (composed) */}
        {form.recipeType === "composed" && (
          <div className="card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Compositions</h3>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setShowComponentSelector(true)}
              >
                <Plus className="h-4 w-4" />
                Ajouter une recette
              </Button>
            </div>

            {components.length === 0 ? (
              <p className="text-sm text-gray-400">
                Cliquez sur &ldquo;Ajouter une recette&rdquo; pour composer cette recette.
              </p>
            ) : (
              <div className="space-y-2">
                {components.map((comp, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                    <span className="flex-1 text-sm font-medium text-gray-800">
                      {comp.childRecipeName ?? comp.childRecipeId}
                    </span>
                    <input
                      type="number"
                      min={0.001}
                      step={0.001}
                      value={comp.quantity || ""}
                      onChange={(e) =>
                        updateComponent(i, "quantity", Number(e.target.value))
                      }
                      className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                    />
                    <select
                      value={comp.unit}
                      onChange={(e) => updateComponent(i, "unit", e.target.value)}
                      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                    >
                      {UNITS.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => removeComponent(i)}
                      className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <p className="text-right text-sm font-medium text-gray-700">
              Coût total calculé :{" "}
              <span className="text-primary-600">
                {totalCost.toFixed(2)} €
              </span>
            </p>
          </div>
        )}

        {/* Steps */}
        <div className="card space-y-4">
          <h3 className="font-semibold text-gray-900">Préparation</h3>
          <Textarea
            label="Étapes (une par ligne)"
            value={form.steps}
            onChange={(e) => setField("steps", e.target.value)}
            placeholder={"Couper les légumes\nFaire revenir dans l'huile\nAssaisonner et servir"}
            rows={6}
          />
          <Textarea
            label="Notes"
            value={form.notes}
            onChange={(e) => setField("notes", e.target.value)}
            placeholder="Conseils, variantes, accompagnements…"
            rows={3}
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
          >
            Annuler
          </Button>
          <Button type="submit" loading={loading}>
            {isEdit ? "Enregistrer les modifications" : "Créer la recette"}
          </Button>
        </div>
      </form>

      {/* Component selector modal */}
      <Modal
        open={showComponentSelector}
        onClose={() => setShowComponentSelector(false)}
        title="Sélectionner une recette"
      >
        <RecipeComponentSelector
          onSelect={addComponent}
          excludeIds={[
            ...(recipe ? [recipe.id] : []),
            ...components.map((c) => c.childRecipeId),
          ]}
        />
      </Modal>
    </>
  );
}
