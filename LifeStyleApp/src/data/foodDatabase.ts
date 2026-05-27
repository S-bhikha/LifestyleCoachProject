import { FoodItem } from '../types';

export const foodDatabase: FoodItem[] = [
  // Proteins - Meat & Poultry
  { id: 'f1', name: 'Chicken Breast (cooked)', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, category: 'Protein', serving: '100g', servingGrams: 100 },
  { id: 'f2', name: 'Ground Beef (lean, cooked)', calories: 215, protein: 26, carbs: 0, fat: 12, fiber: 0, category: 'Protein', serving: '100g', servingGrams: 100 },
  { id: 'f3', name: 'Turkey Breast (cooked)', calories: 135, protein: 30, carbs: 0, fat: 1, fiber: 0, category: 'Protein', serving: '100g', servingGrams: 100 },
  { id: 'f4', name: 'Salmon (cooked)', calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, category: 'Protein', serving: '100g', servingGrams: 100 },
  { id: 'f5', name: 'Tuna (canned, water)', calories: 116, protein: 26, carbs: 0, fat: 1, fiber: 0, category: 'Protein', serving: '100g', servingGrams: 100 },
  { id: 'f6', name: 'Tilapia (cooked)', calories: 128, protein: 26, carbs: 0, fat: 2.7, fiber: 0, category: 'Protein', serving: '100g', servingGrams: 100 },
  { id: 'f7', name: 'Shrimp (cooked)', calories: 99, protein: 24, carbs: 0, fat: 0.3, fiber: 0, category: 'Protein', serving: '100g', servingGrams: 100 },
  { id: 'f8', name: 'Pork Loin (cooked)', calories: 189, protein: 26, carbs: 0, fat: 9, fiber: 0, category: 'Protein', serving: '100g', servingGrams: 100 },

  // Proteins - Eggs & Dairy
  { id: 'f9', name: 'Whole Egg', calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, category: 'Eggs & Dairy', serving: '1 large (50g)', servingGrams: 50 },
  { id: 'f10', name: 'Egg Whites', calories: 52, protein: 11, carbs: 0.7, fat: 0.2, fiber: 0, category: 'Eggs & Dairy', serving: '100g', servingGrams: 100 },
  { id: 'f11', name: 'Greek Yogurt (plain, non-fat)', calories: 59, protein: 10, carbs: 3.6, fat: 0.4, fiber: 0, category: 'Eggs & Dairy', serving: '100g', servingGrams: 100 },
  { id: 'f12', name: 'Cottage Cheese (low-fat)', calories: 72, protein: 12.4, carbs: 2.7, fat: 1, fiber: 0, category: 'Eggs & Dairy', serving: '100g', servingGrams: 100 },
  { id: 'f13', name: 'Whole Milk', calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, fiber: 0, category: 'Eggs & Dairy', serving: '100ml', servingGrams: 100 },
  { id: 'f14', name: 'Cheddar Cheese', calories: 402, protein: 25, carbs: 1.3, fat: 33, fiber: 0, category: 'Eggs & Dairy', serving: '30g slice', servingGrams: 30 },
  { id: 'f15', name: 'Whey Protein Powder', calories: 375, protein: 75, carbs: 7, fat: 5, fiber: 0, category: 'Eggs & Dairy', serving: '1 scoop (30g)', servingGrams: 30 },

  // Plant Proteins
  { id: 'f16', name: 'Tofu (firm)', calories: 76, protein: 8, carbs: 1.9, fat: 4.8, fiber: 0.3, category: 'Plant Protein', serving: '100g', servingGrams: 100 },
  { id: 'f17', name: 'Black Beans (cooked)', calories: 132, protein: 8.9, carbs: 24, fat: 0.5, fiber: 8.7, category: 'Plant Protein', serving: '100g', servingGrams: 100 },
  { id: 'f18', name: 'Chickpeas (cooked)', calories: 164, protein: 8.9, carbs: 27, fat: 2.6, fiber: 7.6, category: 'Plant Protein', serving: '100g', servingGrams: 100 },
  { id: 'f19', name: 'Lentils (cooked)', calories: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 7.9, category: 'Plant Protein', serving: '100g', servingGrams: 100 },
  { id: 'f20', name: 'Edamame', calories: 121, protein: 11, carbs: 9, fat: 5, fiber: 5.2, category: 'Plant Protein', serving: '100g', servingGrams: 100 },

  // Grains & Carbs
  { id: 'f21', name: 'Brown Rice (cooked)', calories: 112, protein: 2.6, carbs: 23, fat: 0.9, fiber: 1.8, category: 'Grains', serving: '100g', servingGrams: 100 },
  { id: 'f22', name: 'White Rice (cooked)', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, category: 'Grains', serving: '100g', servingGrams: 100 },
  { id: 'f23', name: 'Rolled Oats (dry)', calories: 379, protein: 13.2, carbs: 67.5, fat: 6.9, fiber: 10.6, category: 'Grains', serving: '50g (1/2 cup)', servingGrams: 50 },
  { id: 'f24', name: 'Whole Wheat Bread', calories: 247, protein: 13, carbs: 41, fat: 4.2, fiber: 7, category: 'Grains', serving: '1 slice (30g)', servingGrams: 30 },
  { id: 'f25', name: 'White Bread', calories: 265, protein: 9, carbs: 49, fat: 3.2, fiber: 2.7, category: 'Grains', serving: '1 slice (30g)', servingGrams: 30 },
  { id: 'f26', name: 'Pasta (cooked)', calories: 131, protein: 5, carbs: 25, fat: 1.1, fiber: 1.8, category: 'Grains', serving: '100g', servingGrams: 100 },
  { id: 'f27', name: 'Quinoa (cooked)', calories: 120, protein: 4.4, carbs: 21.3, fat: 1.9, fiber: 2.8, category: 'Grains', serving: '100g', servingGrams: 100 },
  { id: 'f28', name: 'Sweet Potato (cooked)', calories: 86, protein: 1.6, carbs: 20, fat: 0.1, fiber: 3, category: 'Grains', serving: '100g', servingGrams: 100 },

  // Fruits
  { id: 'f29', name: 'Banana', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, category: 'Fruit', serving: '1 medium (120g)', servingGrams: 120 },
  { id: 'f30', name: 'Apple', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4, category: 'Fruit', serving: '1 medium (182g)', servingGrams: 182 },
  { id: 'f31', name: 'Blueberries', calories: 57, protein: 0.7, carbs: 14.5, fat: 0.3, fiber: 2.4, category: 'Fruit', serving: '100g', servingGrams: 100 },
  { id: 'f32', name: 'Strawberries', calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3, fiber: 2, category: 'Fruit', serving: '100g', servingGrams: 100 },
  { id: 'f33', name: 'Orange', calories: 47, protein: 0.9, carbs: 12, fat: 0.1, fiber: 2.4, category: 'Fruit', serving: '1 medium (131g)', servingGrams: 131 },
  { id: 'f34', name: 'Avocado', calories: 160, protein: 2, carbs: 9, fat: 15, fiber: 7, category: 'Fruit', serving: '100g', servingGrams: 100 },
  { id: 'f35', name: 'Mango', calories: 60, protein: 0.8, carbs: 15, fat: 0.4, fiber: 1.6, category: 'Fruit', serving: '100g', servingGrams: 100 },

  // Vegetables
  { id: 'f36', name: 'Broccoli', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6, category: 'Vegetables', serving: '100g', servingGrams: 100 },
  { id: 'f37', name: 'Spinach', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, category: 'Vegetables', serving: '100g', servingGrams: 100 },
  { id: 'f38', name: 'Bell Pepper', calories: 31, protein: 1, carbs: 6, fat: 0.3, fiber: 2.1, category: 'Vegetables', serving: '100g', servingGrams: 100 },
  { id: 'f39', name: 'Cucumber', calories: 16, protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5, category: 'Vegetables', serving: '100g', servingGrams: 100 },
  { id: 'f40', name: 'Carrots', calories: 41, protein: 0.9, carbs: 10, fat: 0.2, fiber: 2.8, category: 'Vegetables', serving: '100g', servingGrams: 100 },
  { id: 'f41', name: 'Kale', calories: 49, protein: 4.3, carbs: 9, fat: 0.9, fiber: 3.6, category: 'Vegetables', serving: '100g', servingGrams: 100 },
  { id: 'f42', name: 'Tomato', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, category: 'Vegetables', serving: '100g', servingGrams: 100 },

  // Fats & Nuts
  { id: 'f43', name: 'Almonds', calories: 579, protein: 21, carbs: 22, fat: 50, fiber: 12.5, category: 'Nuts & Fats', serving: '30g (small handful)', servingGrams: 30 },
  { id: 'f44', name: 'Walnuts', calories: 654, protein: 15, carbs: 14, fat: 65, fiber: 6.7, category: 'Nuts & Fats', serving: '30g', servingGrams: 30 },
  { id: 'f45', name: 'Peanut Butter', calories: 588, protein: 25, carbs: 20, fat: 50, fiber: 6, category: 'Nuts & Fats', serving: '2 tbsp (32g)', servingGrams: 32 },
  { id: 'f46', name: 'Olive Oil', calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0, category: 'Nuts & Fats', serving: '1 tbsp (14g)', servingGrams: 14 },
  { id: 'f47', name: 'Chia Seeds', calories: 486, protein: 17, carbs: 42, fat: 31, fiber: 34, category: 'Nuts & Fats', serving: '2 tbsp (28g)', servingGrams: 28 },

  // Common Meals & Snacks
  { id: 'f48', name: 'Protein Bar (generic)', calories: 200, protein: 20, carbs: 22, fat: 6, fiber: 3, category: 'Snacks', serving: '1 bar (60g)', servingGrams: 60 },
  { id: 'f49', name: 'Rice Cake', calories: 35, protein: 0.7, carbs: 7.3, fat: 0.3, fiber: 0.2, category: 'Snacks', serving: '1 cake (9g)', servingGrams: 9 },
  { id: 'f50', name: 'Dark Chocolate (70%+)', calories: 598, protein: 7.8, carbs: 46, fat: 43, fiber: 11, category: 'Snacks', serving: '30g (3 squares)', servingGrams: 30 },
  { id: 'f51', name: 'Granola Bar', calories: 400, protein: 7, carbs: 64, fat: 14, fiber: 3.5, category: 'Snacks', serving: '1 bar (47g)', servingGrams: 47 },

  // Beverages
  { id: 'f52', name: 'Orange Juice', calories: 45, protein: 0.7, carbs: 10.4, fat: 0.2, fiber: 0.2, category: 'Beverages', serving: '250ml', servingGrams: 250 },
  { id: 'f53', name: 'Coffee (black)', calories: 2, protein: 0.3, carbs: 0, fat: 0, fiber: 0, category: 'Beverages', serving: '240ml mug', servingGrams: 240 },
  { id: 'f54', name: 'Protein Shake (made)', calories: 130, protein: 25, carbs: 5, fat: 2, fiber: 0, category: 'Beverages', serving: '350ml', servingGrams: 350 },
  { id: 'f55', name: 'Almond Milk (unsweetened)', calories: 15, protein: 0.6, carbs: 1.4, fat: 1.1, fiber: 0.3, category: 'Beverages', serving: '240ml', servingGrams: 240 },

  // Fast/Convenience Foods
  { id: 'f56', name: 'Bagel (plain)', calories: 270, protein: 10, carbs: 53, fat: 1.5, fiber: 2.3, category: 'Grains', serving: '1 medium (98g)', servingGrams: 98 },
  { id: 'f57', name: 'Hummus', calories: 166, protein: 7.9, carbs: 14, fat: 9.6, fiber: 6, category: 'Plant Protein', serving: '100g', servingGrams: 100 },
  { id: 'f58', name: 'Mixed Salad Greens', calories: 20, protein: 1.8, carbs: 3.5, fat: 0.3, fiber: 2, category: 'Vegetables', serving: '100g', servingGrams: 100 },
  { id: 'f59', name: 'Olive (green/black)', calories: 145, protein: 1, carbs: 3.8, fat: 15, fiber: 3.3, category: 'Nuts & Fats', serving: '30g (about 10)', servingGrams: 30 },
  { id: 'f60', name: 'Corn (cooked)', calories: 86, protein: 3.2, carbs: 19, fat: 1.2, fiber: 2, category: 'Vegetables', serving: '100g', servingGrams: 100 },
];

export const foodCategories = [
  'All',
  'Protein',
  'Eggs & Dairy',
  'Plant Protein',
  'Grains',
  'Fruit',
  'Vegetables',
  'Nuts & Fats',
  'Snacks',
  'Beverages',
];
