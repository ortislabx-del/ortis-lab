import { Recipe } from "@/types/recipe";

const BASE = "/api/recipes";

export async function fetchRecipes(): Promise<Recipe[]> {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error("Failed to fetch recipes");
  return res.json();
}

export async function fetchRecipe(id: string): Promise<Recipe> {
  const res = await fetch(`${BASE}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch recipe");
  return res.json();
}

export async function createRecipe(data: Omit<Recipe, "id">): Promise<Recipe> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create recipe");
  return res.json();
}

export async function updateRecipe(id: string, data: Partial<Recipe>): Promise<Recipe> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update recipe");
  return res.json();
}

export async function deleteRecipe(id: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete recipe");
}

export async function duplicateRecipe(id: string): Promise<Recipe> {
  const res = await fetch(`${BASE}/${id}/duplicate`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to duplicate recipe");
  return res.json();
}
