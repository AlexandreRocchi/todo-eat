import { GroceryItem, Ingredient } from '../types';

// Generate a random ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

// Format date to readable string
export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Convert recipe ingredients to grocery items
export const ingredientsToGroceryItems = (ingredients: Ingredient[]): GroceryItem[] => {
  return ingredients.map(ingredient => ({
    id: generateId(),
    name: ingredient.name,
    quantity: ingredient.quantity,
    unit: ingredient.unit,
    checked: false
  }));
};

// Common food categories for potential future use
export const FOOD_CATEGORIES = [
  'Fruits & Légumes',
  'Viandes & Poissons',
  'Produits laitiers',
  'Épicerie',
  'Boissons',
  'Surgelés',
  'Produits d\'entretien',
  'Autre'
];

// Common units for food items
export const COMMON_UNITS = [
  'g',
  'kg',
  'ml',
  'l',
  'pièce(s)',
  'tranche(s)',
  'boîte(s)',
  'bouteille(s)',
  'sachet(s)',
  'pot(s)'
];