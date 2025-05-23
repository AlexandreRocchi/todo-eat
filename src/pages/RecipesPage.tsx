import React, { useState } from 'react';
import { ChefHat, Plus, Users, Clock, ShoppingCart, Edit, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Recipe } from '../types';
import Button from '../components/ui/Button';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import RecipeModal from '../components/recipes/RecipeModal';

const RecipesPage: React.FC = () => {
  const { recipes, addRecipeToList, addRecipe, updateRecipe, deleteRecipe } = useApp();
  const [confirmAdd, setConfirmAdd] = useState({ isOpen: false, recipeId: '', recipeName: '' });
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, recipeId: '', recipeName: '' });
  const [recipeModal, setRecipeModal] = useState({ isOpen: false, recipe: undefined as Recipe | undefined });

  const handleAddToList = (recipeId: string, recipeName: string) => {
    setConfirmAdd({ isOpen: true, recipeId, recipeName });
  };

  const confirmAddToList = () => {
    addRecipeToList(confirmAdd.recipeId);
    setConfirmAdd({ isOpen: false, recipeId: '', recipeName: '' });
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setRecipeModal({ isOpen: true, recipe });
  };

  const handleDeleteRecipe = (recipeId: string, recipeName: string) => {
    setConfirmDelete({ isOpen: true, recipeId, recipeName });
  };

  const confirmDeleteRecipe = () => {
    deleteRecipe(confirmDelete.recipeId);
    setConfirmDelete({ isOpen: false, recipeId: '', recipeName: '' });
  };

  const handleSaveRecipe = (recipeData: Omit<Recipe, 'id' | 'createdAt'>) => {
    if (recipeModal.recipe) {
      // Mise à jour d'une recette existante
      updateRecipe({ ...recipeModal.recipe, ...recipeData });
    } else {
      // Création d'une nouvelle recette
      addRecipe(recipeData);
    }
    setRecipeModal({ isOpen: false, recipe: undefined });
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="heading-responsive font-bold text-neutral-900 flex items-center">
            <ChefHat className="w-6 h-6 sm:w-8 sm:h-8 mr-3 text-primary-600" />
            Mes Recettes
          </h1>
          <p className="text-neutral-500">
            {recipes.length > 0 ? (
              <>
                {recipes.length} recette{recipes.length > 1 ? 's' : ''} disponible{recipes.length > 1 ? 's' : ''}
              </>
            ) : (
              'Aucune recette disponible'
            )}
          </p>
        </div>
        
        <Button
          variant="primary"
          onClick={() => setRecipeModal({ isOpen: true, recipe: undefined })}
          icon={<Plus className="w-4 h-4" />}
        >
          <span className="hidden sm:inline">Nouvelle recette</span>
          <span className="sm:hidden">Ajouter</span>
        </Button>
      </div>

      {/* Liste des recettes */}
      {recipes.length > 0 ? (
        <div className="grid-responsive">
          {recipes.map((recipe) => (
            <Card key={recipe.id} variant="default" padding="none" hover>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg flex items-start">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mr-3 flex-shrink-0">
                    <ChefHat className="w-6 h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-neutral-900 line-clamp-2">
                      {recipe.name}
                    </div>
                    {recipe.description && (
                      <div className="text-sm text-neutral-500 font-normal mt-1 line-clamp-2">
                        {recipe.description}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditRecipe(recipe)}
                      icon={<Edit className="w-4 h-4" />}
                      aria-label="Modifier la recette"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteRecipe(recipe.id, recipe.name)}
                      icon={<Trash2 className="w-4 h-4 text-red-500" />}
                      aria-label="Supprimer la recette"
                    />
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent>
                {/* Informations de la recette */}
                <div className="flex items-center gap-4 mb-4 text-sm text-neutral-600">
                  {recipe.servings && (
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{recipe.servings} pers.</span>
                    </div>
                  )}
                  {recipe.cookingTime && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{recipe.cookingTime}</span>
                    </div>
                  )}
                </div>

                {/* Ingrédients */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-neutral-700 mb-2">
                    Ingrédients ({recipe.ingredients.length})
                  </h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {recipe.ingredients.slice(0, 4).map((ingredient, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between text-sm bg-neutral-50 rounded-lg px-3 py-2"
                      >
                        <span className="text-neutral-700 truncate">{ingredient.name}</span>
                        <span className="text-neutral-500 text-xs flex-shrink-0 ml-2">
                          {ingredient.quantity} {ingredient.unit}
                        </span>
                      </div>
                    ))}
                    
                    {recipe.ingredients.length > 4 && (
                      <div className="text-xs text-neutral-500 text-center py-1">
                        +{recipe.ingredients.length - 4} ingrédient{recipe.ingredients.length - 4 > 1 ? 's' : ''} de plus
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleAddToList(recipe.id, recipe.name)}
                  icon={<ShoppingCart className="w-4 h-4" />}
                  fullWidth
                >
                  Ajouter à ma liste
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        /* État vide */
        <Card variant="filled" padding="lg">
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-neutral-200 to-neutral-300 rounded-full flex items-center justify-center mb-4">
              <ChefHat className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              Aucune recette disponible
            </h3>
            <p className="text-neutral-500 mb-6 max-w-sm mx-auto">
              Créez votre première recette pour ajouter automatiquement tous les ingrédients nécessaires à votre liste de courses.
            </p>
            <Button
              variant="primary"
              onClick={() => setRecipeModal({ isOpen: true, recipe: undefined })}
              icon={<Plus className="w-4 h-4" />}
            >
              Créer ma première recette
            </Button>
          </div>
        </Card>
      )}

      {/* Modal de recette */}
      <RecipeModal
        isOpen={recipeModal.isOpen}
        onClose={() => setRecipeModal({ isOpen: false, recipe: undefined })}
        recipe={recipeModal.recipe}
        onSave={handleSaveRecipe}
      />

      {/* Confirmation d'ajout à la liste */}
      <ConfirmDialog
        isOpen={confirmAdd.isOpen}
        onClose={() => setConfirmAdd({ isOpen: false, recipeId: '', recipeName: '' })}
        onConfirm={confirmAddToList}
        title="Ajouter à la liste"
        message={`Ajouter les ingrédients de "${confirmAdd.recipeName}" à votre liste de courses ?`}
        confirmText="Ajouter"
        cancelText="Annuler"
        variant="default"
      />

      {/* Confirmation de suppression */}
      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, recipeId: '', recipeName: '' })}
        onConfirm={confirmDeleteRecipe}
        title="Supprimer la recette"
        message={`Êtes-vous sûr de vouloir supprimer la recette "${confirmDelete.recipeName}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="destructive"
      />
    </div>
  );
};

export default RecipesPage;