import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { IngredientForm } from "@/components/ingredients/ingredient-form";
import { StockItem } from "@/types/recipe";

type Props = { params: Promise<{ id: string }> };

async function getIngredient(id: string): Promise<StockItem | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("stock_items")
      .select("*")
      .eq("id", id)
      .single();
    if (!data) return null;
    return {
      id: data.id,
      name: data.name,
      unit: data.unit,
      quantityInStock: Number(data.quantity_in_stock),
      minQuantity: Number(data.min_quantity),
      averageUnitCost:
        data.average_unit_cost != null ? Number(data.average_unit_cost) : undefined,
    };
  } catch {
    return null;
  }
}

export default async function EditIngredientPage({ params }: Props) {
  const { id } = await params;
  const ingredient = await getIngredient(id);
  if (!ingredient) notFound();

  return (
    <div className="max-w-lg">
      <IngredientForm ingredient={ingredient} />
    </div>
  );
}
