import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createClient();

    const { data: movement, error: movError } = await supabase
      .from("stock_movements")
      .insert({
        stock_item_id: body.stockItemId,
        movement_type: body.movementType,
        quantity: body.quantity,
        unit_cost: body.unit_cost || null,
        reason: body.reason || null,
      })
      .select()
      .single();

    if (movError) return NextResponse.json({ error: movError.message }, { status: 400 });

    // Update stock quantity
    const { data: item } = await supabase
      .from("stock_items")
      .select("quantity_in_stock")
      .eq("id", body.stockItemId)
      .single();

    if (item) {
      let newQty = Number(item.quantity_in_stock);
      if (body.movementType === "in") newQty += Number(body.quantity);
      else if (body.movementType === "out") newQty -= Number(body.quantity);
      else newQty = Number(body.quantity);

      await supabase
        .from("stock_items")
        .update({ quantity_in_stock: newQty, updated_at: new Date().toISOString() })
        .eq("id", body.stockItemId);
    }

    return NextResponse.json(movement, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
