import { StockItem, StockMovement } from "@/types/recipe";

export async function fetchStock(): Promise<StockItem[]> {
  const res = await fetch("/api/stock");
  if (!res.ok) throw new Error("Failed to fetch stock");
  return res.json();
}

export async function fetchStockMovements(): Promise<StockMovement[]> {
  const res = await fetch("/api/stock/movements");
  if (!res.ok) throw new Error("Failed to fetch movements");
  return res.json();
}

export async function createStockMovement(
  data: Omit<StockMovement, "id" | "createdAt">
): Promise<StockMovement> {
  const res = await fetch("/api/stock/movements", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create movement");
  return res.json();
}
