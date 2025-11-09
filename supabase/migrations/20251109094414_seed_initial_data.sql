/*
  # Seed Initial Data for MADRAS FOODIE

  1. Categories
    - Insert initial food categories (Indian, Chinese, Japanese, Snacks, Juice)
  
  2. Food Items
    - Insert sample food items for each category with prices, descriptions, and availability
    - Include various offers, combos, and customizable items
    - All items are marked as available by default
*/

-- Insert Categories
INSERT INTO categories (name, slug) VALUES
  ('Indian', 'indian'),
  ('Chinese', 'chinese'),
  ('Japanese', 'japanese'),
  ('Snacks', 'snacks'),
  ('Juice', 'juice')
ON CONFLICT (slug) DO NOTHING;

-- Get category IDs
DO $$
DECLARE
  indian_id uuid;
  chinese_id uuid;
  japanese_id uuid;
  snacks_id uuid;
  juice_id uuid;
BEGIN
  SELECT id INTO indian_id FROM categories WHERE slug = 'indian';
  SELECT id INTO chinese_id FROM categories WHERE slug = 'chinese';
  SELECT id INTO japanese_id FROM categories WHERE slug = 'japanese';
  SELECT id INTO snacks_id FROM categories WHERE slug = 'snacks';
  SELECT id INTO juice_id FROM categories WHERE slug = 'juice';

  -- Insert Indian Food Items
  INSERT INTO food_items (name, description, category_id, price, is_available, discount_percentage, is_combo, is_customizable, tags) VALUES
    ('Butter Chicken', 'Creamy tomato-based curry with tender chicken pieces', indian_id, 150.00, true, 10, false, true, ARRAY['non-veg', 'popular']),
    ('Paneer Tikka Masala', 'Grilled cottage cheese in rich creamy gravy', indian_id, 130.00, true, 0, false, true, ARRAY['veg', 'popular']),
    ('Biryani', 'Aromatic basmati rice with spices and choice of protein', indian_id, 140.00, true, 15, false, true, ARRAY['non-veg', 'spicy']),
    ('Dal Tadka', 'Yellow lentils tempered with aromatic spices', indian_id, 90.00, true, 0, false, false, ARRAY['veg', 'healthy']),
    ('Masala Dosa', 'Crispy rice crepe filled with spiced potato filling', indian_id, 80.00, true, 5, false, true, ARRAY['veg', 'breakfast']),
    ('Chole Bhature', 'Spicy chickpea curry with fluffy fried bread', indian_id, 100.00, true, 0, true, false, ARRAY['veg', 'popular']),
    ('Chicken Tandoori', 'Marinated chicken grilled to perfection', indian_id, 160.00, true, 10, false, false, ARRAY['non-veg', 'grilled']),
    ('Sambar Rice', 'South Indian lentil stew with vegetables and rice', indian_id, 85.00, true, 0, false, false, ARRAY['veg', 'healthy'])
  ON CONFLICT DO NOTHING;

  -- Insert Chinese Food Items
  INSERT INTO food_items (name, description, category_id, price, is_available, discount_percentage, is_combo, is_customizable, tags) VALUES
    ('Hakka Noodles', 'Stir-fried noodles with vegetables and sauces', chinese_id, 110.00, true, 0, false, true, ARRAY['veg', 'popular']),
    ('Manchurian', 'Deep-fried veggie balls in spicy Indo-Chinese gravy', chinese_id, 120.00, true, 10, false, true, ARRAY['veg', 'spicy']),
    ('Fried Rice', 'Wok-tossed rice with vegetables and seasonings', chinese_id, 100.00, true, 0, false, true, ARRAY['veg']),
    ('Chilli Chicken', 'Crispy chicken tossed in spicy chilli sauce', chinese_id, 150.00, true, 15, false, false, ARRAY['non-veg', 'spicy', 'popular']),
    ('Spring Rolls', 'Crispy rolls filled with vegetables', chinese_id, 90.00, true, 5, false, false, ARRAY['veg', 'appetizer']),
    ('Sweet and Sour', 'Tangy sauce with choice of protein and vegetables', chinese_id, 130.00, true, 0, false, true, ARRAY['non-veg']),
    ('Schezwan Noodles', 'Spicy noodles with schezwan sauce', chinese_id, 120.00, true, 10, false, true, ARRAY['veg', 'spicy']),
    ('Combo Meal', 'Fried rice + Manchurian + Spring Roll', chinese_id, 180.00, true, 20, true, false, ARRAY['veg', 'combo'])
  ON CONFLICT DO NOTHING;

  -- Insert Japanese Food Items
  INSERT INTO food_items (name, description, category_id, price, is_available, discount_percentage, is_combo, is_customizable, tags) VALUES
    ('Vegetable Sushi', 'Fresh vegetable rolls with sushi rice', japanese_id, 140.00, true, 0, false, true, ARRAY['veg']),
    ('Chicken Teriyaki', 'Grilled chicken with teriyaki glaze', japanese_id, 180.00, true, 10, false, false, ARRAY['non-veg', 'grilled']),
    ('Ramen Bowl', 'Japanese noodle soup with toppings', japanese_id, 150.00, true, 0, false, true, ARRAY['non-veg', 'soup']),
    ('Tempura', 'Crispy battered and fried vegetables', japanese_id, 130.00, true, 5, false, false, ARRAY['veg']),
    ('Gyoza', 'Pan-fried dumplings with filling', japanese_id, 120.00, true, 0, false, true, ARRAY['non-veg', 'appetizer']),
    ('Katsu Curry', 'Breaded cutlet with Japanese curry', japanese_id, 170.00, true, 15, false, true, ARRAY['non-veg'])
  ON CONFLICT DO NOTHING;

  -- Insert Snacks
  INSERT INTO food_items (name, description, category_id, price, is_available, discount_percentage, is_combo, is_customizable, tags) VALUES
    ('Classic Burger', 'Juicy patty with fresh vegetables and sauces', snacks_id, 80.00, true, 0, false, true, ARRAY['popular']),
    ('Cheese Sandwich', 'Grilled sandwich with melted cheese', snacks_id, 60.00, true, 5, false, true, ARRAY['veg']),
    ('French Fries', 'Crispy golden fries with seasoning', snacks_id, 50.00, true, 0, false, true, ARRAY['veg', 'popular']),
    ('Veg Sandwich', 'Fresh vegetables with chutneys', snacks_id, 50.00, true, 0, false, true, ARRAY['veg']),
    ('Chicken Burger', 'Crispy chicken patty with special sauce', snacks_id, 100.00, true, 10, false, true, ARRAY['non-veg', 'popular']),
    ('Loaded Fries', 'Fries topped with cheese and sauces', snacks_id, 80.00, true, 15, false, false, ARRAY['veg']),
    ('Samosa', 'Crispy pastry filled with spiced potatoes', snacks_id, 20.00, true, 0, false, false, ARRAY['veg', 'popular']),
    ('Burger Combo', 'Burger + Fries + Drink', snacks_id, 130.00, true, 20, true, true, ARRAY['combo', 'popular'])
  ON CONFLICT DO NOTHING;

  -- Insert Juices
  INSERT INTO food_items (name, description, category_id, price, is_available, discount_percentage, is_combo, is_customizable, tags) VALUES
    ('Mango Juice', 'Fresh mango juice', juice_id, 50.00, true, 0, false, false, ARRAY['fresh', 'popular']),
    ('Orange Juice', 'Freshly squeezed orange juice', juice_id, 50.00, true, 0, false, false, ARRAY['fresh']),
    ('Watermelon Juice', 'Refreshing watermelon juice', juice_id, 45.00, true, 5, false, false, ARRAY['fresh']),
    ('Mixed Fruit Juice', 'Blend of seasonal fruits', juice_id, 60.00, true, 0, false, false, ARRAY['fresh']),
    ('Mint Mojito', 'Refreshing mint and lemon drink', juice_id, 55.00, true, 0, false, true, ARRAY['refreshing', 'popular']),
    ('Blue Lagoon', 'Tropical blue flavored mocktail', juice_id, 70.00, true, 10, false, false, ARRAY['mocktail']),
    ('Virgin Mojito', 'Classic mojito without alcohol', juice_id, 65.00, true, 5, false, true, ARRAY['refreshing', 'popular']),
    ('Lemonade', 'Classic fresh lemonade', juice_id, 40.00, true, 0, false, true, ARRAY['refreshing']),
    ('Strawberry Shake', 'Creamy strawberry milkshake', juice_id, 80.00, true, 10, false, false, ARRAY['shake', 'popular'])
  ON CONFLICT DO NOTHING;
END $$;