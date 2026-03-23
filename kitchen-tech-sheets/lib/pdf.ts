import { Recipe } from "@/types/recipe";
import { formatCurrency } from "@/lib/utils";

export async function generateRecipePDF(recipe: Recipe): Promise<Uint8Array> {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");

  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 842]); // A4
  const { height } = page.getSize();

  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontReg = await doc.embedFont(StandardFonts.Helvetica);

  const margin = 40;
  let y = height - margin;

  const drawText = (
    text: string,
    x: number,
    yPos: number,
    size = 10,
    bold = false,
    color = rgb(0, 0, 0)
  ) => {
    page.drawText(text, {
      x,
      y: yPos,
      size,
      font: bold ? fontBold : fontReg,
      color,
    });
  };

  // Title
  drawText(recipe.name, margin, y, 18, true, rgb(0.9, 0.4, 0.05));
  y -= 28;

  // Meta row
  drawText(`Catégorie: ${recipe.category}`, margin, y, 9);
  drawText(`Portions: ${recipe.servings}`, 220, y, 9);
  drawText(`Préparation: ${recipe.prepTime}min`, 310, y, 9);
  drawText(`Cuisson: ${recipe.cookTime}min`, 420, y, 9);
  y -= 14;

  if (recipe.allergens) {
    drawText(`Allergènes: ${recipe.allergens}`, margin, y, 8, false, rgb(0.7, 0.2, 0.2));
    y -= 14;
  }

  // Cost line
  drawText(
    `Coût total: ${formatCurrency(recipe.totalCost)}` +
      (recipe.sellingPrice ? `  |  Prix vente: ${formatCurrency(recipe.sellingPrice)}` : ""),
    margin,
    y,
    9,
    true
  );
  y -= 20;

  // Divider
  page.drawLine({
    start: { x: margin, y },
    end: { x: 595 - margin, y },
    thickness: 0.5,
    color: rgb(0.8, 0.8, 0.8),
  });
  y -= 16;

  // Ingredients
  if (recipe.ingredients && recipe.ingredients.length > 0) {
    drawText("INGRÉDIENTS", margin, y, 11, true);
    y -= 16;
    for (const ing of recipe.ingredients) {
      drawText(`• ${ing.name}`, margin + 8, y, 9);
      drawText(`${ing.quantity} ${ing.unit}`, 360, y, 9);
      if (ing.unitCost) {
        drawText(formatCurrency(ing.quantity * ing.unitCost), 460, y, 9);
      }
      y -= 13;
      if (y < margin + 60) {
        const newPage = doc.addPage([595, 842]);
        y = newPage.getSize().height - margin;
      }
    }
    y -= 8;
  }

  // Components
  if (recipe.components && recipe.components.length > 0) {
    drawText("COMPOSITIONS", margin, y, 11, true);
    y -= 16;
    for (const comp of recipe.components) {
      drawText(`• ${comp.childRecipeName ?? comp.childRecipeId}`, margin + 8, y, 9);
      drawText(`${comp.quantity} ${comp.unit}`, 360, y, 9);
      y -= 13;
    }
    y -= 8;
  }

  // Steps
  if (recipe.steps) {
    drawText("ÉTAPES DE PRÉPARATION", margin, y, 11, true);
    y -= 16;
    const steps = recipe.steps.split("\n").filter(Boolean);
    steps.forEach((step, i) => {
      // Wrap long lines
      const words = `${i + 1}. ${step}`.split(" ");
      let line = "";
      for (const word of words) {
        if ((line + word).length > 80) {
          drawText(line.trim(), margin + 8, y, 9);
          y -= 12;
          line = word + " ";
        } else {
          line += word + " ";
        }
      }
      if (line.trim()) {
        drawText(line.trim(), margin + 8, y, 9);
        y -= 12;
      }
      y -= 4;
      if (y < margin + 60) {
        doc.addPage([595, 842]);
        y = 842 - margin;
      }
    });
  }

  // Notes
  if (recipe.notes) {
    y -= 8;
    drawText("NOTES", margin, y, 11, true);
    y -= 14;
    drawText(recipe.notes, margin + 8, y, 9, false, rgb(0.4, 0.4, 0.4));
  }

  const bytes = await doc.save();
  return bytes;
}
