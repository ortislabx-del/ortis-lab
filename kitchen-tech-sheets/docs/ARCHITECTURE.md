# Architecture

## Stack

- **Next.js 15** (App Router, Server Components, API Routes)
- **TypeScript** (strict mode)
- **Supabase** (PostgreSQL, Auth, Row Level Security)
- **Tailwind CSS** (utility-first styling)
- **pdf-lib** (PDF generation)

## Folder Structure

```
kitchen-tech-sheets/
├─ app/                          # Next.js App Router
│  ├─ (protected)/               # Auth-protected route group
│  │  ├─ layout.tsx              # Protected layout with Navbar
│  │  ├─ dashboard/              # Dashboard overview
│  │  ├─ recipes/                # Recipe CRUD + detail
│  │  ├─ ingredients/            # Ingredient/stock CRUD
│  │  ├─ stock/                  # Stock overview + movements
│  │  └─ production/             # Production order management
│  ├─ api/                       # REST API routes
│  │  ├─ recipes/
│  │  ├─ ingredients/
│  │  ├─ stock/
│  │  └─ production/
│  ├─ auth/callback/             # Supabase OAuth callback
│  ├─ login/                     # Login page
│  ├─ globals.css
│  └─ layout.tsx                 # Root layout
├─ components/                   # Reusable components
│  ├─ navbar.tsx
│  └─ ui/                        # Base UI components
├─ lib/                          # Utilities
│  ├─ supabase/                  # Supabase client/server
│  ├─ calculations.ts            # Cost/stock calculations
│  ├─ validations.ts             # Input validation
│  └─ db.ts                      # DB query helpers
├─ types/                        # TypeScript types
│  └─ recipe.ts
├─ data/                         # Seed and example data
├─ docs/                         # Additional documentation
├─ middleware.ts                 # Auth middleware
├─ supabase-schema.sql           # DB schema
└─ tailwind.config.ts
```

## Data Flow

1. **Client components** use `lib/supabase/client.ts` (browser Supabase client)
2. **Server components** use `lib/supabase/server.ts` (cookie-based server client)
3. **API routes** use `lib/supabase/server.ts` with full auth context
4. **Middleware** intercepts all non-public routes and redirects unauthenticated users to `/login`

## Recipe Composition

Recipes can be either:
- **Simple**: Contains a list of raw ingredients (`recipe_ingredients`)
- **Composed**: References other recipes as components (`recipe_components`) plus optional direct ingredients

Cost calculation:
- Simple: `Σ (quantity × unitCost)` across all ingredients
- Composed: `Σ component.totalCost + Σ (directIngredient.quantity × unitCost)`
