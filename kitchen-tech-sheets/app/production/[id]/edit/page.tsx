import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductionForm } from "@/components/production/production-form";
import { ProductionOrder } from "@/types/recipe";

type Props = { params: Promise<{ id: string }> };

async function getOrder(id: string): Promise<ProductionOrder | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("production_orders")
      .select("*, recipes(name)")
      .eq("id", id)
      .single();
    if (!data) return null;
    const row = data as {
      id: string;
      recipe_id: string;
      quantity: number;
      status: "draft" | "validated" | "done" | "cancelled";
      notes: string | null;
      created_at: string;
      recipes: { name: string } | null;
    };
    return {
      id: row.id,
      recipeId: row.recipe_id,
      recipeName: row.recipes?.name ?? undefined,
      quantity: Number(row.quantity),
      status: row.status,
      notes: row.notes ?? undefined,
      createdAt: row.created_at,
    };
  } catch {
    return null;
  }
}

export default async function EditProductionPage({ params }: Props) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  return (
    <div className="max-w-lg">
      <ProductionForm order={order} />
    </div>
  );
}
