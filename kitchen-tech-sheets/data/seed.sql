-- Test seed data for kitchen-tech-sheets
-- Run after supabase-schema.sql

-- Stock Items (Ingredients)
INSERT INTO stock_items (name, unit, quantity_in_stock, min_quantity, average_unit_cost) VALUES
('Tomatoes', 'kg', 10.0, 2.0, 1.20),
('Olive Oil', 'l', 5.0, 1.0, 8.50),
('Salt', 'kg', 2.0, 0.5, 0.80),
('Black Pepper', 'kg', 0.5, 0.1, 12.00),
('Garlic', 'kg', 1.0, 0.2, 3.50),
('Onion', 'kg', 5.0, 1.0, 1.00),
('Flour', 'kg', 10.0, 2.0, 0.90),
('Eggs', 'pieces', 30, 12, 0.25),
('Butter', 'kg', 2.0, 0.5, 9.00),
('Milk', 'l', 5.0, 1.0, 1.20),
('Chicken Breast', 'kg', 5.0, 1.0, 8.00),
('Beef Mince', 'kg', 3.0, 1.0, 12.00),
('Pasta', 'kg', 4.0, 1.0, 2.00),
('Parmesan', 'kg', 0.5, 0.1, 22.00),
('Basil', 'kg', 0.2, 0.05, 15.00),
('Cream', 'l', 1.0, 0.2, 3.50),
('Lemon', 'pieces', 10, 3, 0.40),
('Thyme', 'kg', 0.1, 0.02, 20.00),
('Bay Leaves', 'pieces', 20, 5, 0.10),
('Breadcrumbs', 'kg', 1.0, 0.2, 2.50);
