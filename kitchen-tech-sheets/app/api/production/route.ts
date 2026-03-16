import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("production_orders")
      .select("*, recipes(name)")
      .order("created_at", { ascending: false });
    if (error) throw error;

    const mapped = (data ?? []).map((row: {
      id: string;
      establishment_id: string | null;
      recipe_id: string;
      quantity: number;
      status: "draft" | "validated" | "done" | "cancelled";
      notes: string | null;
      created_at: string;
      updated_at: string;
      recipes: { name: string } | null;
    }) => ({
      id: row.id,
      establishmentId: row.establishment_id ?? undefined,
      recipeId: row.recipe_id,
      recipeName: row.recipes?.name ?? undefined,
      quantity: Number(row.quantity),
      status: row.status,
      notes: row.notes ?? undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    console.error("GET /api/production", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const { data, error } = await supabase
      .from("production_orders")
      .insert({
        recipe_id: body.recipeId,
        quantity: body.quantity,
        status: body.status ?? "draft",
        notes: body.notes ?? null,
      })
      .select("*, recipes(name)")
      .single();

    if (error) throw error;

    const row = data as {
      id: string;
      establishment_id: string | null;
      recipe_id: string;
      quantity: number;
      status: "draft" | "validated" | "done" | "cancelled";
      notes: string | null;
      created_at: string;
      updated_at: string;
      recipes: { name: string } | null;
    };

    return NextResponse.json({
      id: row.id,
      recipeId: row.recipe_id,
      recipeName: row.recipes?.name ?? body.recipeName,
      quantity: Number(row.quantity),
      status: row.status,
      notes: row.notes ?? undefined,
      createdAt: row.created_at,
    }, { status: 201 });
  } catch (error) {
    console.error("POST /api/production", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
