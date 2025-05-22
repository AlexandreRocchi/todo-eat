import React from 'react';
import { UtensilsCrossed, Plus, Edit } from 'lucide-react';
import { Recipe } from '../../types';
import { formatDate } from '../../utils/helpers';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface RecipeCardProps {
  recipe: Recipe;
  onAddIngredients: (id: string) => void;
  onEdit: (id: string) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onAddIngredients,
  onEdit,
}) => {
  // Default image if none provided
  const imageUrl = recipe.image || 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg';

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <div 
        className="h-40 bg-cover bg-center rounded-t-lg" 
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      
      <div className="flex-1 p-2">
        <h3 className="font-medium text-lg text-gray-800 mb-1">{recipe.name}</h3>
        
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <UtensilsCrossed size={14} className="mr-1" />
          <span>{formatDate(recipe.createdAt)}</span>
        </div>
        
        <div>
          <p className="text-sm font-medium text-gray-700">Ingrédients:</p>
          <ul className="mt-1 text-sm text-gray-600 list-disc list-inside">
            {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
              <li key={index} className="truncate">
                {ingredient.name} ({ingredient.quantity} {ingredient.unit})
              </li>
            ))}
            {recipe.ingredients.length > 3 && (
              <li className="text-gray-400">
                Et {recipe.ingredients.length - 3} autre{recipe.ingredients.length - 3 > 1 ? 's' : ''}...
              </li>
            )}
          </ul>
        </div>
      </div>
      
      <div className="flex mt-2 p-2 space-x-2">
        <Button 
          variant="primary" 
          icon={<Plus size={16} />}
          onClick={() => onAddIngredients(recipe.id)}
          fullWidth
        >
          Ajouter à la liste
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => onEdit(recipe.id)}
          icon={<Edit size={16} />}
          aria-label="Modifier"
        />
      </div>
    </Card>
  );
};

export default RecipeCard;