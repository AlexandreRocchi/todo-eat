import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Recipe, Ingredient } from '../../types';
import { COMMON_UNITS, generateId } from '../../utils/helpers';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

interface RecipeFormProps {
  initialData?: Recipe;
  onSave: (recipe: Omit<Recipe, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const RecipeForm: React.FC<RecipeFormProps> = ({
  initialData,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    initialData?.ingredients || []
  );
  const [instructions, setInstructions] = useState(initialData?.instructions || '');
  const [image, setImage] = useState(initialData?.image || '');
  
  const [newIngredient, setNewIngredient] = useState<Ingredient>({
    id: '',
    name: '',
    quantity: 1,
    unit: 'pièce(s)',
  });
  
  const [errors, setErrors] = useState({
    name: '',
    ingredients: '',
    newIngredientName: '',
  });

  const addIngredient = () => {
    if (!newIngredient.name.trim()) {
      setErrors({
        ...errors,
        newIngredientName: 'Veuillez saisir un nom',
      });
      return;
    }

    setIngredients([
      ...ingredients,
      { ...newIngredient, id: generateId() },
    ]);
    
    setNewIngredient({
      id: '',
      name: '',
      quantity: 1,
      unit: 'pièce(s)',
    });
    
    setErrors({
      ...errors,
      newIngredientName: '',
    });
  };

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter((i) => i.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formErrors = {
      name: !name.trim() ? 'Veuillez saisir un nom' : '',
      ingredients: ingredients.length === 0 ? 'Ajoutez au moins un ingrédient' : '',
      newIngredientName: '',
    };
    
    if (formErrors.name || formErrors.ingredients) {
      setErrors(formErrors);
      return;
    }
    
    onSave({
      name: name.trim(),
      ingredients,
      instructions: instructions.trim(),
      image: image.trim(),
    });
  };

  const unitOptions = COMMON_UNITS.map(unit => ({
    value: unit,
    label: unit
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Input
          label="Nom de la recette"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Poulet rôti aux herbes"
          fullWidth
          error={errors.name}
        />
      </div>
      
      <div>
        <Input
          label="Image URL (optionnel)"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="https://example.com/image.jpg"
          fullWidth
        />
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Ingrédients
        </h3>
        
        {errors.ingredients && (
          <p className="text-sm text-red-600 mb-2">{errors.ingredients}</p>
        )}
        
        <div className="space-y-2 mb-4">
          {ingredients.map((ingredient) => (
            <div key={ingredient.id} className="flex items-center bg-gray-50 p-2 rounded-md">
              <div className="flex-1">
                <p className="font-medium">{ingredient.name}</p>
                <p className="text-sm text-gray-500">
                  {ingredient.quantity} {ingredient.unit}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={() => removeIngredient(ingredient.id)}
                icon={<Trash2 size={16} className="text-gray-500 hover:text-red-500" />}
                aria-label="Supprimer l'ingrédient"
              />
            </div>
          ))}
        </div>
        
        <div className="bg-gray-50 p-3 rounded-md">
          <h4 className="text-sm font-medium mb-2">Ajouter un ingrédient</h4>
          
          <div className="space-y-2">
            <Input
              label="Nom"
              value={newIngredient.name}
              onChange={(e) => 
                setNewIngredient({ ...newIngredient, name: e.target.value })
              }
              placeholder="Ex: Tomates"
              fullWidth
              error={errors.newIngredientName}
            />
            
            <div className="flex space-x-2">
              <Input
                label="Quantité"
                type="number"
                min="0.1"
                step="0.1"
                value={newIngredient.quantity}
                onChange={(e) => 
                  setNewIngredient({ 
                    ...newIngredient, 
                    quantity: parseFloat(e.target.value) 
                  })
                }
                fullWidth
              />
              
              <Select
                label="Unité"
                options={unitOptions}
                value={newIngredient.unit}
                onChange={(value) => 
                  setNewIngredient({ ...newIngredient, unit: value })
                }
                fullWidth
              />
            </div>
            
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={addIngredient}
              icon={<Plus size={16} />}
            >
              Ajouter l'ingrédient
            </Button>
          </div>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Instructions (optionnel)
        </label>
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          placeholder="Décrivez les étapes de préparation..."
        />
      </div>
      
      <div className="flex space-x-3 pt-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          fullWidth
        >
          Annuler
        </Button>
        <Button 
          type="submit" 
          fullWidth
        >
          Enregistrer
        </Button>
      </div>
    </form>
  );
};

export default RecipeForm;