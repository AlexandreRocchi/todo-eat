export interface GroceryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  checked: boolean;
  category?: string;
}

export interface TemplateItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface Template {
  id: string;
  name: string;
  items: (string | TemplateItem)[];
  createdAt: string;
}

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: Ingredient[];
  instructions?: string;
  image?: string;
  createdAt: string;
}

export interface ShoppingList {
  id: string;
  items: string[];
  createdAt: string;
}