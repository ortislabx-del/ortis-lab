"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  ShoppingBasket,
  Package,
  ClipboardList,
  BarChart3,
  ChefHat,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/recipes", label: "Recettes", icon: BookOpen },
  { href: "/ingredients", label: "Ingrédients", icon: ShoppingBasket },
  { href: "/stock", label: "Stock", icon: Package },
  { href: "/production", label: "Production", icon: ClipboardList },
  { href: "/reports", label: "Rapports", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-gray-200 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600">
          <ChefHat className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 leading-tight">Kitchen</p>
          <p className="text-xs text-gray-500 leading-tight">Tech Sheets</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 p-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/dashboard"
              ? pathname === href || pathname === "/"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary-50 text-primary-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4">
        <p className="text-center text-xs text-gray-400">v1.0 · Kitchen Tech Sheets</p>
      </div>
    </aside>
  );
}
