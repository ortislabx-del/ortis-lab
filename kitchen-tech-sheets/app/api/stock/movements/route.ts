import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("stock_movements")
      .select("*, stock_items(name, unit)")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw error;

    const mapped = (data ?? []).map((row: {
      id: string;
      stock_item_id: string;
      movement_type: "in" | "out" | "adjustment";
      quantity: number;
      unit_cost: number | null;
      reason: string | null;
      created_at: string;
      stock_items: { name: string; unit: string } | null;
    }) => ({
      id: row.id,
      stockItemId: row.stock_item_id,
      stockItemName: row.stock_items?.name ?? "",
      movementType: row.movement_type,
      quantity: Number(row.quantity),
      unitCost: row.unit_cost != null ? Number(row.unit_cost) : undefined,
      reason: row.reason ?? undefined,
      createdAt: row.created_at,
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    console.error("GET /api/stock/movements", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const { data, error } = await supabase
      .from("stock_movements")
      .insert({
        stock_item_id: body.stockItemId,
        movement_type: body.movementType,
        quantity: body.quantity,
        unit_cost: body.unitCost ?? null,
        reason: body.reason ?? null,
      })
      .select()
      .single();

    if (error) throw error;

    // Update stock quantity
    const sign =
      body.movementType === "in"
        ? 1
        : body.movementType === "out"
        ? -1
        : 0;

    if (sign !== 0) {
      const { data: current } = await supabase
        .from("stock_items")
        .select("quantity_in_stock")
        .eq("id", body.stockItemId)
        .single();

      if (current) {
        await supabase
          .from("stock_items")
          .update({
            quantity_in_stock:
              Number(current.quantity_in_stock) + sign * Number(body.quantity),
            updated_at: new Date().toISOString(),
          })
          .eq("id", body.stockItemId);
      }
    } else {
      // Adjustment: set absolute value
      await supabase
        .from("stock_items")
        .update({
          quantity_in_stock: Number(body.quantity),
          updated_at: new Date().toISOString(),
        })
        .eq("id", body.stockItemId);
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("POST /api/stock/movements", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
