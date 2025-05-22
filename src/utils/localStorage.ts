import { GroceryItem, Template, Recipe, ShoppingList } from '../types';

// Shopping List
export const saveCurrentList = (items: GroceryItem[]): void => {
  localStorage.setItem('todoeat-current-list', JSON.stringify(items));
};

export const getCurrentList = (): GroceryItem[] => {
  const data = localStorage.getItem('todoeat-current-list');
  return data ? JSON.parse(data) : [];
};

// Templates
export const saveTemplate = (template: Template): void => {
  const templates = getTemplates();
  const existingIndex = templates.findIndex(t => t.id === template.id);
  
  if (existingIndex >= 0) {
    templates[existingIndex] = template;
  } else {
    templates.push(template);
  }
  
  localStorage.setItem('todoeat-templates', JSON.stringify(templates));
};

export const getTemplates = (): Template[] => {
  const data = localStorage.getItem('todoeat-templates');
  return data ? JSON.parse(data) : [];
};

export const deleteTemplate = (id: string): void => {
  const templates = getTemplates();
  localStorage.setItem(
    'todoeat-templates', 
    JSON.stringify(templates.filter(t => t.id !== id))
  );
};

// Recipes
export const saveRecipe = (recipe: Recipe): void => {
  const recipes = getRecipes();
  const existingIndex = recipes.findIndex(r => r.id === recipe.id);
  
  if (existingIndex >= 0) {
    recipes[existingIndex] = recipe;
  } else {
    recipes.push(recipe);
  }
  
  localStorage.setItem('todoeat-recipes', JSON.stringify(recipes));
};

export const getRecipes = (): Recipe[] => {
  const data = localStorage.getItem('todoeat-recipes');
  return data ? JSON.parse(data) : [];
};

export const deleteRecipe = (id: string): void => {
  const recipes = getRecipes();
  localStorage.setItem(
    'todoeat-recipes', 
    JSON.stringify(recipes.filter(r => r.id !== id))
  );
};

// History
export const saveToHistory = (list: ShoppingList): void => {
  const history = getHistory();
  const maxHistoryItems = 10; // Keep only last 10 lists
  
  // Add new list to the beginning
  history.unshift(list);
  
  // Keep only the last maxHistoryItems
  const trimmedHistory = history.slice(0, maxHistoryItems);
  
  localStorage.setItem('todoeat-history', JSON.stringify(trimmedHistory));
};

export const getHistory = (): ShoppingList[] => {
  const data = localStorage.getItem('todoeat-history');
  return data ? JSON.parse(data) : [];
};