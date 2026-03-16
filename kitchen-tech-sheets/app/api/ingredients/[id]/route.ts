import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const body = await request.json();

    const { data, error } = await supabase
      .from("stock_items")
      .update({
        name: body.name,
        unit: body.unit,
        quantity_in_stock: body.quantityInStock,
        min_quantity: body.minQuantity,
        average_unit_cost: body.averageUnitCost ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error("PUT /api/ingredients/[id]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { error } = await supabase.from("stock_items").delete().eq("id", id);
    if (error) throw error;
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE /api/ingredients/[id]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
