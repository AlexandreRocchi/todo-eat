import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import RecipeCard from '../components/recipes/RecipeCard';
import RecipeModal from '../components/recipes/RecipeModal';
import Button from '../components/ui/Button';

const RecipesPage: React.FC = () => {
  const { recipes, addRecipe, updateRecipe, deleteRecipe, addIngredientsToList } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    setSelectedRecipe(id);
    setIsModalOpen(true);
  };

  const handleSave = (recipeData: any) => {
    if (selectedRecipe) {
      updateRecipe({ ...recipeData, id: selectedRecipe });
    } else {
      addRecipe(recipeData);
    }
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Mes recettes</h1>
        <Button
          onClick={() => {
            setSelectedRecipe(null);
            setIsModalOpen(true);
          }}
          icon={<Plus size={18} />}
        >
          Nouvelle recette
        </Button>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Vous n'avez pas encore de recette. Créez votre première recette !
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onAddIngredients={addIngredientsToList}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      <RecipeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRecipe(null);
        }}
        recipe={selectedRecipe ? recipes.find(r => r.id === selectedRecipe) : undefined}
        onSave={handleSave}
      />
    </div>
  );
};

export default RecipesPage;