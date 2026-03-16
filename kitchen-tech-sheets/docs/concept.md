# Concept métier – Kitchen Tech Sheets

## Vision

Kitchen Tech Sheets est un système de gestion de fiches techniques culinaires modulaire. Il permet aux professionnels de la restauration de créer, gérer et calculer automatiquement leurs recettes.

## Principe fondamental

**Une recette = un assemblage de fiches techniques.**

```
Burger Classique
 ├── Steak haché maison  (1 pièce)
 ├── Sauce tomate maison (100g)
 ├── Pain burger         (2 pièces)
 └── Mélange salade      (50g)
```

Chaque composant peut lui-même être une recette indépendante.

## Types de recettes

### Recette simple
Ingredients directs avec quantités et coûts unitaires.
Exemple : Sauce tomate (tomates + huile + ail…)

### Recette composée
Assemblage de recettes simples ou composées.
Exemple : Burger = Steak + Sauce + Pain + Garniture

## Calculs automatiques

- **Coût total** = Σ(quantité × coût unitaire) pour chaque ingrédient
- **Coût alimentaire (%)** = (coût total / prix de vente) × 100
- **Marge** = prix de vente - coût total
- **Mise à l'échelle** = facteur × quantités originales

## Gestion du stock

- Suivi des quantités en temps réel
- Alertes automatiques sous le seuil minimum
- Historique des mouvements (entrée/sortie/ajustement)

## Production

Les commandes de production permettent de planifier la fabrication et calculer les besoins en ingrédients.

## Multi-rôles

| Rôle       | Accès                          |
|------------|-------------------------------|
| Admin      | Tout                           |
| Manager    | Recettes + Stock               |
| Production | Consultation + commandes       |
| Viewer     | Lecture seule                  |
