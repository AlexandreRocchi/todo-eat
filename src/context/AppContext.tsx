import React, { createContext, useContext, useState, useEffect } from 'react';
import { GroceryItem, Template, Recipe, ShoppingList } from '../types';
import * as api from '../utils/api';
import { generateId, mergeItems } from '../utils/helpers';

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
  addRecipeToList: (recipeId: string) => void;
  
  // History
  history: ShoppingList[];
  saveCurrentListToHistory: () => void;
  loadFromHistory: (historyId: string) => void;
  
  // Ajout : fonction pour ajouter un template à la liste existante
  addTemplateToList: (templateId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentList, setCurrentList] = useState<GroceryItem[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [history, setHistory] = useState<ShoppingList[]>([]);

  // Load initial data
  useEffect(() => {
    api.getGroceryItems().then(items => setCurrentList(items.map((i: GroceryItem) => ({ ...i, checked: !!i.checked }))));
    api.getTemplates().then(templates => {
      console.log('Templates récupérés de l\'API:', templates);
      setTemplates(templates);
    });
    api.getRecipes().then(setRecipes);
    api.getShoppingLists().then(setHistory);
  }, []);

  // Shopping list functions
  const addItem = async (item: Omit<GroceryItem, 'id' | 'checked'>) => {
    const newItem = await api.addGroceryItem({ ...item, checked: false });
    setCurrentList(prev => [...prev, newItem]);
  };

  const updateItem = async (item: GroceryItem) => {
    await api.updateGroceryItem(item.id, item);
    setCurrentList(prev => prev.map(i => i.id === item.id ? item : i));
  };

  const removeItem = async (id: string) => {
    await api.deleteGroceryItem(id);
    setCurrentList(prev => prev.filter(item => item.id !== id));
  };

  const toggleItemCheck = async (id: string) => {
    const item = currentList.find(i => i.id === id);
    if (!item) return;
    const updated = { ...item, checked: !item.checked };
    await api.updateGroceryItem(id, updated);
    setCurrentList(prev => prev.map(i => i.id === id ? updated : i));
  };

  const clearList = async () => {
    for (const i of currentList) {
      await api.deleteGroceryItem(i.id);
    }
    setCurrentList([]);
  };

  // Template functions
  const saveAsTemplate = async (name: string) => {
    if (currentList.length === 0) return;
    console.log('Sauvegarde en template:', { name, currentList });
    
    // Récupérer uniquement les IDs des articles
    const itemIds = currentList.map(i => i.id);
    console.log('IDs des articles:', itemIds);
    
    // Formater la date au format MySQL YYYY-MM-DD HH:MM:SS
    const now = new Date();
    const mysqlDate = now.toISOString().slice(0, 19).replace('T', ' ');
    
    const newTemplate = {
      name,
      createdAt: mysqlDate,
      items: itemIds
    };
    console.log('Nouveau template à créer:', newTemplate);
    
    try {
      const saved = await api.addTemplate(newTemplate);
      console.log('Template sauvegardé:', saved);
      setTemplates(prev => [...prev, saved]);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du template:', error);
    }
  };

  const loadTemplate = async (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) {
      console.error('Template non trouvé:', templateId);
      return;
    }

    console.log('Chargement du template:', template);
    
    // D'abord vider la liste actuelle sans supprimer les items de la DB
    setCurrentList([]);
    
    // Si le template contient déjà les objets items complets (depuis l'API)
    if (template.items.length > 0 && typeof template.items[0] === 'object') {
      // Les items sont déjà des objets complets, on les utilise directement
      const templateItems = template.items as any[];
      console.log('Items du template (objets complets):', templateItems);
      
      // Fusionner les éléments identiques AVANT de les créer en DB
      const mergedTemplateItems = mergeItems(templateItems);
      console.log('Items fusionnés avant création:', mergedTemplateItems);
      
      // Créer de nouveaux items dans la DB pour la liste actuelle
      const newItems = mergedTemplateItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        checked: false
      }));
      
      console.log('Nouveaux items à créer:', newItems);
      
      // Ajouter les nouveaux items
      const addedItems = await Promise.all(newItems.map(api.addGroceryItem));
      console.log('Items ajoutés:', addedItems);
      setCurrentList(addedItems);
    } else {
      // Fallback: si les items sont juste des IDs, récupérer depuis l'API
      const itemIds = template.items.map(item => typeof item === 'string' ? item : item.id);
      console.log('IDs des items à récupérer:', itemIds);
      
      const allItems = await api.getGroceryItems();
      const items = itemIds.map(id => allItems.find((item: any) => item.id === id)).filter(Boolean);
      
      console.log('Items récupérés:', items);
      
      // Fusionner les éléments identiques
      const mergedItems = mergeItems(items);
      console.log('Items fusionnés:', mergedItems);
      
      // Créer de nouveaux items avec les données du template
      const newItems = mergedItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        checked: false
      }));
      
      // Ajouter les nouveaux items
      const addedItems = await Promise.all(newItems.map(api.addGroceryItem));
      setCurrentList(addedItems);
    }
  };

  // Recipe functions
  const addRecipe = async (recipe: Omit<Recipe, 'id' | 'createdAt'>) => {
    // Formater la date au format MySQL YYYY-MM-DD HH:MM:SS
    const now = new Date();
    const mysqlDate = now.toISOString().slice(0, 19).replace('T', ' ');
    
    const newRecipe = await api.addRecipe({ ...recipe, createdAt: mysqlDate });
    setRecipes(prev => [...prev, newRecipe]);
  };

  const updateRecipe = async (recipe: Recipe) => {
    // Formater la date au format MySQL YYYY-MM-DD HH:MM:SS si nécessaire
    let updatedRecipe = { ...recipe };
    
    // S'assurer que createdAt existe et est au bon format
    if (!updatedRecipe.createdAt) {
      // Si createdAt est null ou undefined, utiliser la date actuelle
      const now = new Date();
      const mysqlDate = now.toISOString().slice(0, 19).replace('T', ' ');
      updatedRecipe.createdAt = mysqlDate;
    } else if (typeof updatedRecipe.createdAt === 'string' && (updatedRecipe.createdAt.includes('T') || updatedRecipe.createdAt.includes('Z'))) {
      // Convertir le format ISO en format MySQL
      try {
        const date = new Date(updatedRecipe.createdAt);
        const mysqlDate = date.toISOString().slice(0, 19).replace('T', ' ');
        updatedRecipe.createdAt = mysqlDate;
      } catch (e) {
        console.error('Erreur lors de la conversion de la date:', e);
        // Utiliser la date actuelle en cas d'erreur
        const now = new Date();
        const mysqlDate = now.toISOString().slice(0, 19).replace('T', ' ');
        updatedRecipe.createdAt = mysqlDate;
      }
    }
    
    await api.updateRecipe(recipe.id, updatedRecipe);
    setRecipes(prev => prev.map(r => r.id === recipe.id ? updatedRecipe : r));
  };

  const deleteRecipe = async (id: string) => {
    await api.deleteRecipe(id);
    setRecipes(prev => prev.filter(r => r.id !== id));
  };

  const addIngredientsToList = async (recipeId: string) => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return;
    
    // Créer les nouveaux items à partir des ingrédients
    const items = recipe.ingredients.map(ingredient => ({
      name: ingredient.name,
      quantity: ingredient.quantity,
      unit: ingredient.unit,
      checked: false
    }));
    
    // Filtrer les doublons en comparant par nom
    const existingNames = currentList.map(item => item.name.toLowerCase());
    const newItems = items.filter(item => 
      !existingNames.includes(item.name.toLowerCase())
    );
    
    // Ajouter seulement les nouveaux items
    if (newItems.length > 0) {
      const added = await Promise.all(newItems.map(api.addGroceryItem));
      setCurrentList(prev => [...prev, ...added]);
    }
  };

  // History functions (shopping lists)
  const saveCurrentListToHistory = async () => {
    if (currentList.length === 0) return;
    const itemIds = currentList.map(i => i.id);
    
    // Formater la date au format MySQL YYYY-MM-DD HH:MM:SS
    const now = new Date();
    const mysqlDate = now.toISOString().slice(0, 19).replace('T', ' ');
    
    const newList = {
      createdAt: mysqlDate,
      items: itemIds as string[]
    };
    const saved = await api.addShoppingList(newList);
    setHistory(prev => [saved, ...prev]);
  };

  const loadFromHistory = async (historyId: string) => {
    const list = history.find(h => h.id === historyId);
    if (list) {
      const items = await Promise.all((list.items as unknown as string[]).map((id) => api.getGroceryItems().then(list => list.find((i: any) => i.id === id))));
      setCurrentList(items.filter(Boolean));
    }
  };

  // Ajout : fonction pour ajouter un template à la liste existante
  const addTemplateToList = async (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) {
      console.error('Template non trouvé:', templateId);
      return;
    }

    console.log('Ajout du template à la liste:', template);
    
    // Si le template contient déjà les objets items complets (depuis l'API)
    if (template.items.length > 0 && typeof template.items[0] === 'object') {
      // Les items sont déjà des objets complets, on les utilise directement
      const templateItems = template.items as any[];
      console.log('Items du template (objets complets):', templateItems);
      
      // Fusionner les éléments identiques du template
      const mergedTemplateItems = mergeItems(templateItems);
      console.log('Items du template fusionnés:', mergedTemplateItems);
      
      // Créer de nouveaux items dans la DB pour les ajouter à la liste actuelle
      const newItems = mergedTemplateItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        checked: false
      }));
      
      // Au lieu de simplement filtrer par nom, on va fusionner intelligemment
      // avec les éléments existants qui ont le même nom+unité
      const itemsToAdd: typeof newItems = [];
      const existingItemsMap = new Map(
        currentList.map(item => [`${item.name.trim().toLowerCase()}|${item.unit.trim().toLowerCase()}`, item])
      );
      
      for (const newItem of newItems) {
        const key = `${newItem.name.trim().toLowerCase()}|${newItem.unit.trim().toLowerCase()}`;
        const existingItem = existingItemsMap.get(key);
        
        if (existingItem) {
          // Si l'item existe déjà, on met à jour sa quantité
          const updatedItem = { ...existingItem, quantity: existingItem.quantity + newItem.quantity };
          await api.updateGroceryItem(existingItem.id, updatedItem);
          // Mettre à jour localement
          setCurrentList(prev => prev.map(item => 
            item.id === existingItem.id ? updatedItem : item
          ));
        } else {
          // Si l'item n'existe pas, on l'ajoute à la liste des nouveaux
          itemsToAdd.push(newItem);
        }
      }
      
      if (itemsToAdd.length > 0) {
        console.log('Nouveaux items uniques à ajouter:', itemsToAdd);
        const addedItems = await Promise.all(itemsToAdd.map(api.addGroceryItem));
        console.log('Items ajoutés:', addedItems);
        setCurrentList(prev => [...prev, ...addedItems]);
      }
    } else {
      // Fallback: si les items sont juste des IDs, récupérer depuis l'API
      const itemIds = template.items.map(item => typeof item === 'string' ? item : item.id);
      console.log('IDs des items à récupérer:', itemIds);
      
      const allItems = await api.getGroceryItems();
      const items = itemIds.map(id => allItems.find((item: any) => item.id === id)).filter(Boolean);
      
      // Fusionner les éléments identiques du template
      const mergedItems = mergeItems(items);
      console.log('Items fusionnés:', mergedItems);
      
      // Même logique de fusion intelligente que ci-dessus
      const itemsToAdd: any[] = [];
      const existingItemsMap = new Map(
        currentList.map(item => [`${item.name.trim().toLowerCase()}|${item.unit.trim().toLowerCase()}`, item])
      );
      
      for (const item of mergedItems) {
        const key = `${item.name.trim().toLowerCase()}|${item.unit.trim().toLowerCase()}`;
        const existingItem = existingItemsMap.get(key);
        
        if (existingItem) {
          // Si l'item existe déjà, on met à jour sa quantité
          const updatedItem = { ...existingItem, quantity: existingItem.quantity + item.quantity };
          await api.updateGroceryItem(existingItem.id, updatedItem);
          // Mettre à jour localement
          setCurrentList(prev => prev.map(listItem => 
            listItem.id === existingItem.id ? updatedItem : listItem
          ));
        } else {
          // Si l'item n'existe pas, on l'ajoute à la liste des nouveaux
          itemsToAdd.push({
            name: item.name,
            quantity: item.quantity,
            unit: item.unit,
            checked: false
          });
        }
      }
      
      if (itemsToAdd.length > 0) {
        const addedItems = await Promise.all(itemsToAdd.map(api.addGroceryItem));
        setCurrentList(prev => [...prev, ...addedItems]);
      }
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
    deleteTemplate: async (id: string) => {
      await api.deleteTemplate(id);
      setTemplates(prev => prev.filter(t => t.id !== id));
    },
    loadTemplate,
    addTemplateToList,
    recipes,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    addIngredientsToList,
    addRecipeToList: addIngredientsToList,
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