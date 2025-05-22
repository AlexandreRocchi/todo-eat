import React, { createContext, useContext, useState, useEffect } from 'react';
import { GroceryItem, Template, Recipe, ShoppingList } from '../types';
import * as storage from '../utils/localStorage';
import { generateId } from '../utils/helpers';

interface AppContextType {
  // Current shopping list
  currentList: GroceryItem[];
  addItem: (item: Omit<GroceryItem, 'id' | 'checked'>) => void;
  updateItem: (item: GroceryItem) => void;
  removeItem: (id: string) => void;
  toggleItemCheck: (id: string) => void;
  clearList: () => void;
  
  // Templates
  templates: Template[];
  saveAsTemplate: (name: string) => void;
  deleteTemplate: (id: string) => void;
  loadTemplate: (templateId: string) => void;
  
  // Recipes
  recipes: Recipe[];
  addRecipe: (recipe: Omit<Recipe, 'id' | 'createdAt'>) => void;
  updateRecipe: (recipe: Recipe) => void;
  deleteRecipe: (id: string) => void;
  addIngredientsToList: (recipeId: string) => void;
  
  // History
  history: ShoppingList[];
  saveCurrentListToHistory: () => void;
  loadFromHistory: (historyId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentList, setCurrentList] = useState<GroceryItem[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [history, setHistory] = useState<ShoppingList[]>([]);

  // Load initial data
  useEffect(() => {
    setCurrentList(storage.getCurrentList());
    setTemplates(storage.getTemplates());
    setRecipes(storage.getRecipes());
    setHistory(storage.getHistory());
  }, []);

  // Save current list whenever it changes
  useEffect(() => {
    storage.saveCurrentList(currentList);
  }, [currentList]);

  // Shopping list functions
  const addItem = (item: Omit<GroceryItem, 'id' | 'checked'>) => {
    const newItem: GroceryItem = {
      ...item,
      id: generateId(),
      checked: false
    };
    setCurrentList(prev => [...prev, newItem]);
  };

  const updateItem = (item: GroceryItem) => {
    setCurrentList(prev => 
      prev.map(i => i.id === item.id ? item : i)
    );
  };

  const removeItem = (id: string) => {
    setCurrentList(prev => prev.filter(item => item.id !== id));
  };

  const toggleItemCheck = (id: string) => {
    setCurrentList(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, checked: !item.checked } 
          : item
      )
    );
  };

  const clearList = () => {
    setCurrentList([]);
  };

  // Template functions
  const saveAsTemplate = (name: string) => {
    if (currentList.length === 0) return;
    
    const newTemplate: Template = {
      id: generateId(),
      name,
      items: [...currentList],
      createdAt: new Date().toISOString()
    };
    
    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);
    storage.saveTemplate(newTemplate);
  };

  const loadTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      // Create new IDs for the items to avoid conflicts
      const itemsWithNewIds = template.items.map(item => ({
        ...item,
        id: generateId(),
        checked: false // Reset checked status
      }));
      
      setCurrentList(itemsWithNewIds);
    }
  };

  // Recipe functions
  const addRecipe = (recipe: Omit<Recipe, 'id' | 'createdAt'>) => {
    const newRecipe: Recipe = {
      ...recipe,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    
    const updatedRecipes = [...recipes, newRecipe];
    setRecipes(updatedRecipes);
    storage.saveRecipe(newRecipe);
  };

  const updateRecipe = (recipe: Recipe) => {
    const updatedRecipes = recipes.map(r => 
      r.id === recipe.id ? recipe : r
    );
    
    setRecipes(updatedRecipes);
    storage.saveRecipe(recipe);
  };

  const addIngredientsToList = (recipeId: string) => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return;
    
    const ingredientsAsItems = recipe.ingredients.map(ingredient => ({
      id: generateId(),
      name: ingredient.name,
      quantity: ingredient.quantity,
      unit: ingredient.unit,
      checked: false
    }));
    
    setCurrentList(prev => [...prev, ...ingredientsAsItems]);
  };

  // History functions
  const saveCurrentListToHistory = () => {
    if (currentList.length === 0) return;
    
    const historyEntry: ShoppingList = {
      id: generateId(),
      items: [...currentList],
      createdAt: new Date().toISOString()
    };
    
    const updatedHistory = [historyEntry, ...history];
    setHistory(updatedHistory);
    storage.saveToHistory(historyEntry);
  };

  const loadFromHistory = (historyId: string) => {
    const historyEntry = history.find(h => h.id === historyId);
    if (historyEntry) {
      // Create new IDs for the items to avoid conflicts
      const itemsWithNewIds = historyEntry.items.map(item => ({
        ...item,
        id: generateId(),
        checked: false // Reset checked status
      }));
      
      setCurrentList(itemsWithNewIds);
    }
  };

  const value: AppContextType = {
    currentList,
    addItem,
    updateItem,
    removeItem,
    toggleItemCheck,
    clearList,
    
    templates,
    saveAsTemplate,
    deleteTemplate: (id: string) => {
      setTemplates(prev => prev.filter(t => t.id !== id));
      storage.deleteTemplate(id);
    },
    loadTemplate,
    
    recipes,
    addRecipe,
    updateRecipe,
    deleteRecipe: (id: string) => {
      setRecipes(prev => prev.filter(r => r.id !== id));
      storage.deleteRecipe(id);
    },
    addIngredientsToList,
    
    history,
    saveCurrentListToHistory,
    loadFromHistory
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};