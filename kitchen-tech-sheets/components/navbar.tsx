"use client";

import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/dashboard": "Tableau de bord",
  "/recipes": "Recettes",
  "/ingredients": "Ingrédients",
  "/stock": "Stock",
  "/stock/movements": "Mouvements de stock",
  "/production": "Commandes de production",
  "/reports": "Rapports & Analytics",
  "/login": "Connexion",
};

function getTitle(pathname: string): string {
  // Exact match first
  if (pageTitles[pathname]) return pageTitles[pathname];
  // Partial match
  for (const [path, title] of Object.entries(pageTitles)) {
    if (path !== "/" && pathname.startsWith(path)) return title;
  }
  return "Kitchen Tech Sheets";
}

export function Navbar() {
  const pathname = usePathname();
  const title = getTitle(pathname);

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      <div className="flex items-center gap-3">
        <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600">
          <Search className="h-5 w-5" />
        </button>
        <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600">
          <Bell className="h-5 w-5" />
        </button>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-sm font-semibold">
          A
        </div>
      </div>
    </header>
  );
}
