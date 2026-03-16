import { ProductionOrder } from "@/types/recipe";

const BASE = "/api/production";

export async function fetchProductionOrders(): Promise<ProductionOrder[]> {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error("Failed to fetch production orders");
  return res.json();
}

export async function fetchProductionOrder(id: string): Promise<ProductionOrder> {
  const res = await fetch(`${BASE}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch production order");
  return res.json();
}

export async function createProductionOrder(
  data: Omit<ProductionOrder, "id" | "createdAt" | "updatedAt">
): Promise<ProductionOrder> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create production order");
  return res.json();
}

export async function updateProductionOrder(
  id: string,
  data: Partial<ProductionOrder>
): Promise<ProductionOrder> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update production order");
  return res.json();
}
