import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getRecipeById } from "@/lib/supabase/queries";
import { RecipeForm } from "@/components/recipes/recipe-form";

type Props = { params: Promise<{ id: string }> };

export default async function EditRecipePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const recipe = await getRecipeById(supabase, id);

  if (!recipe) notFound();

  return (
    <div className="max-w-4xl">
      <RecipeForm recipe={recipe} />
    </div>
  );
}
