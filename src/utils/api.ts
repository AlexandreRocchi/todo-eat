// Utilitaires pour appeler l'API Express/MariaDB
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4001';

// Fonction générique pour gérer les appels API
async function apiCall<T>(url: string, method: string = 'GET', body: any = null): Promise<T> {
  const options: RequestInit = {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined
  };
  
  console.log(`API ${method} ${url}`, body ? '- Body:' : '', body || '');
  
  try {
    const res = await fetch(`${API_URL}${url}`, options);
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error(`API ${method} ${url} - Erreur:`, res.status, errorData);
      throw new Error(`Erreur ${res.status}: ${errorData.error || 'Erreur inconnue'}`);
    }
    
    const data = await res.json();
    console.log(`API ${method} ${url} - Réponse:`, data);
    return data as T;
  } catch (error) {
    console.error(`API ${method} ${url} - Exception:`, error);
    throw error;
  }
}

// --- Grocery Items ---
export async function getGroceryItems() {
  return apiCall<any[]>('/grocery-items');
}

export async function addGroceryItem(item: any) {
  return apiCall<any>('/grocery-items', 'POST', item);
}

export async function updateGroceryItem(id: string, item: any) {
  return apiCall<any>(`/grocery-items/${id}`, 'PUT', item);
}

export async function deleteGroceryItem(id: string) {
  return apiCall<any>(`/grocery-items/${id}`, 'DELETE');
}

// --- Templates ---
export async function getTemplates() {
  return apiCall<any[]>('/templates');
}

export async function addTemplate(template: any) {
  return apiCall<any>('/templates', 'POST', template);
}

export async function updateTemplate(id: string, template: any) {
  return apiCall<any>(`/templates/${id}`, 'PUT', template);
}

export async function deleteTemplate(id: string) {
  return apiCall<any>(`/templates/${id}`, 'DELETE');
}

// --- Recipes ---
export async function getRecipes() {
  return apiCall<any[]>('/recipes');
}

export async function addRecipe(recipe: any) {
  return apiCall<any>('/recipes', 'POST', recipe);
}

export async function updateRecipe(id: string, recipe: any) {
  return apiCall<any>(`/recipes/${id}`, 'PUT', recipe);
}

export async function deleteRecipe(id: string) {
  return apiCall<any>(`/recipes/${id}`, 'DELETE');
}

// --- Shopping Lists ---
export async function getShoppingLists() {
  return apiCall<any[]>('/shopping-lists');
}

export async function addShoppingList(list: any) {
  return apiCall<any>('/shopping-lists', 'POST', list);
}

export async function updateShoppingList(id: string, list: any) {
  return apiCall<any>(`/shopping-lists/${id}`, 'PUT', list);
}

export async function deleteShoppingList(id: string) {
  return apiCall<any>(`/shopping-lists/${id}`, 'DELETE');
} 