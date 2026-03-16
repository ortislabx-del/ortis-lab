import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("stock_items")
      .select("*")
      .order("name");
    if (error) throw error;

    const mapped = (data ?? []).map((row: {
      id: string;
      establishment_id: string | null;
      name: string;
      unit: string;
      quantity_in_stock: number;
      min_quantity: number;
      average_unit_cost: number | null;
    }) => ({
      id: row.id,
      establishmentId: row.establishment_id ?? undefined,
      name: row.name,
      unit: row.unit,
      quantityInStock: Number(row.quantity_in_stock),
      minQuantity: Number(row.min_quantity),
      averageUnitCost: row.average_unit_cost != null ? Number(row.average_unit_cost) : undefined,
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    console.error("GET /api/stock", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
