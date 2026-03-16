import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("production_orders")
      .select("*, recipes(name)")
      .eq("id", id)
      .single();

    if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const row = data as {
      id: string;
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
      recipeName: row.recipes?.name ?? undefined,
      quantity: Number(row.quantity),
      status: row.status,
      notes: row.notes ?? undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  } catch (error) {
    console.error("GET /api/production/[id]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const body = await request.json();

    const { data, error } = await supabase
      .from("production_orders")
      .update({
        status: body.status,
        quantity: body.quantity,
        notes: body.notes ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*, recipes(name)")
      .single();

    if (error) throw error;

    const row = data as {
      id: string;
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
      recipeName: row.recipes?.name ?? undefined,
      quantity: Number(row.quantity),
      status: row.status,
      notes: row.notes ?? undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  } catch (error) {
    console.error("PUT /api/production/[id]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
