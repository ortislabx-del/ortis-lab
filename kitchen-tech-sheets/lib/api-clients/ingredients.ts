import { StockItem } from "@/types/recipe";

const BASE = "/api/ingredients";

export async function fetchIngredients(): Promise<StockItem[]> {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error("Failed to fetch ingredients");
  return res.json();
}

export async function createIngredient(data: Omit<StockItem, "id">): Promise<StockItem> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create ingredient");
  return res.json();
}

export async function updateIngredient(id: string, data: Partial<StockItem>): Promise<StockItem> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update ingredient");
  return res.json();
}

export async function deleteIngredient(id: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete ingredient");
}
