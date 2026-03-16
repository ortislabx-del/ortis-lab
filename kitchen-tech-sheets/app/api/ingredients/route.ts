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
      created_at: string;
      updated_at: string;
    }) => ({
      id: row.id,
      establishmentId: row.establishment_id ?? undefined,
      name: row.name,
      unit: row.unit,
      quantityInStock: Number(row.quantity_in_stock),
      minQuantity: Number(row.min_quantity),
      averageUnitCost: row.average_unit_cost != null ? Number(row.average_unit_cost) : undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    console.error("GET /api/ingredients", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const { data, error } = await supabase
      .from("stock_items")
      .insert({
        name: body.name,
        unit: body.unit,
        quantity_in_stock: body.quantityInStock ?? 0,
        min_quantity: body.minQuantity ?? 0,
        average_unit_cost: body.averageUnitCost ?? null,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("POST /api/ingredients", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
