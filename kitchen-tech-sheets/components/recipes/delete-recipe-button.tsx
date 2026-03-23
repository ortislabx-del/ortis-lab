"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteRecipe } from "@/lib/api-clients/recipes";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export function DeleteRecipeButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Supprimer cette recette définitivement ?")) return;
    setLoading(true);
    try {
      await deleteRecipe(id);
      router.push("/recipes");
      router.refresh();
    } catch (err) {
      alert("Erreur lors de la suppression");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="danger" size="sm" loading={loading} onClick={handleDelete}>
      <Trash2 className="h-4 w-4" />
      Supprimer
    </Button>
  );
}
