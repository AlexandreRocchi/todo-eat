import React, { useState } from 'react';
import { UtensilsCrossed, Plus, Edit, List } from 'lucide-react';
import { Recipe } from '../../types';
import { formatDate } from '../../utils/helpers';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

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
  const [showDetails, setShowDetails] = useState(false);
  
  // Default image if none provided
  const imageUrl = recipe.image || 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg';

  return (
    <>
      <Card className="h-full flex flex-col overflow-hidden">
        <div 
          className="h-40 bg-cover bg-center rounded-t-lg cursor-pointer" 
          style={{ backgroundImage: `url(${imageUrl})` }}
          onClick={() => setShowDetails(true)}
        />
        
        <div className="flex-1 p-2 cursor-pointer" onClick={() => setShowDetails(true)}>
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
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => {
              e.stopPropagation();
              setShowDetails(true);
            }}
            aria-label="Voir détails"
            icon={<List size={16} className="text-gray-500 hover:text-blue-500" />}
          />
        </div>
      </Card>
      
      <Modal 
        isOpen={showDetails} 
        onClose={() => setShowDetails(false)} 
        title={`Détails de la recette: ${recipe.name}`}
      >
        <div className="space-y-4">
          <div 
            className="h-48 bg-cover bg-center rounded-lg" 
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
          
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <UtensilsCrossed size={14} className="mr-1" />
            <span>{formatDate(recipe.createdAt)}</span>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Ingrédients</h4>
            <div className="max-h-60 overflow-y-auto mb-4">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recipe.ingredients.map((ingredient, index) => (
                    <tr key={ingredient.id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                        {ingredient.name}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                        {ingredient.quantity} {ingredient.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {recipe.instructions && (
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Instructions</h4>
              <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-800 max-h-60 overflow-y-auto whitespace-pre-wrap">
                {recipe.instructions}
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button 
              variant="primary" 
              icon={<Plus size={16} />}
              onClick={() => {
                onAddIngredients(recipe.id);
                setShowDetails(false);
              }}
            >
              Ajouter à la liste
            </Button>
            <Button 
              variant="secondary"
              onClick={() => setShowDetails(false)}
            >
              Fermer
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default RecipeCard;