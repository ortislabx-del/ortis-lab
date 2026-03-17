import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getLowStockItems } from "@/lib/calculations";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("stock_items").select("*").order("name");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const stockItems = (data || []).map((row) => ({
      id: row.id,
      name: row.name,
      unit: row.unit,
      quantityInStock: Number(row.quantity_in_stock),
      minQuantity: Number(row.min_quantity),
      averageUnitCost: row.average_unit_cost ? Number(row.average_unit_cost) : undefined,
    }));

    return NextResponse.json({
      items: data,
      lowStockItems: getLowStockItems(stockItems),
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
