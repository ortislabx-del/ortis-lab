# Déploiement – Vercel + Supabase

## 1. Créer un projet Supabase

1. Aller sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Aller dans **SQL Editor**
4. Copier-coller le contenu de `supabase-schema.sql`
5. Exécuter

## 2. Récupérer les clés

Dans **Project Settings > API** :
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## 3. Déployer sur Vercel

### Option A: Via GitHub
1. Pousser le dossier `kitchen-tech-sheets/` sur GitHub
2. Importer le projet sur [vercel.com](https://vercel.com)
3. Définir le **Root Directory** : `kitchen-tech-sheets`
4. Ajouter les variables d'environnement :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL` = URL Vercel
5. Déployer

### Option B: Via CLI
```bash
npm install -g vercel
cd kitchen-tech-sheets
vercel --prod
```

## 4. Variables d'environnement locales

Copier `.env.example` en `.env.local` :
```bash
cp .env.example .env.local
```

Remplir avec les valeurs Supabase.

## 5. Démarrer en local

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)
