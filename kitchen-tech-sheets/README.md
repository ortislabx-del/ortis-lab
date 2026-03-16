# Kitchen Tech Sheets

A Kitchen Tech Sheets management system built with Next.js, TypeScript, and Supabase.

## Features

- **Recipe management** – Create and manage simple and composed recipes with ingredients, steps, allergens, and cost tracking
- **Stock management** – Track stock items, quantities, and costs; record inbound, outbound, and adjustment movements
- **Production orders** – Create and track production orders with statuses: draft, validated, done, cancelled
- **PDF generation** – Export recipes as printable PDF sheets
- **Role-based access** – Four user roles: admin, manager, production, viewer

## Tech Stack

- [Next.js 15](https://nextjs.org/) – App Router, Server Components
- [TypeScript](https://www.typescriptlang.org/)
- [Supabase](https://supabase.com/) – Database, Auth, Row Level Security
- [Tailwind CSS](https://tailwindcss.com/)
- [pdf-lib](https://pdf-lib.js.org/) – PDF generation

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com/) project

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
```

Edit `.env.local` and fill in your Supabase credentials.

### Database Setup

Run the SQL schema against your Supabase project:

```bash
# In the Supabase SQL editor, paste and run the contents of:
supabase-schema.sql
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
kitchen-tech-sheets/
├─ app/                  # Next.js App Router pages
│  ├─ login/
│  ├─ dashboard/
│  ├─ recipes/
│  ├─ stock/
│  ├─ production/
│  └─ reports/
├─ components/           # Reusable UI components
├─ lib/                  # Utility functions and Supabase clients
│  └─ supabase/
├─ types/                # TypeScript types
│  └─ recipe.ts
├─ middleware.ts          # Auth middleware
├─ supabase-schema.sql   # Database schema
└─ public/
```

## User Roles

| Role       | Permissions                                   |
|------------|-----------------------------------------------|
| admin      | Full access – manage users, all data          |
| manager    | Manage recipes, stock, and production orders  |
| production | View recipes, create production orders        |
| viewer     | Read-only access                              |

## License

MIT
