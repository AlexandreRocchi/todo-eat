import React from 'react';
import { Recipe } from '../../types';
import Modal from '../ui/Modal';
import RecipeForm from './RecipeForm';

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe?: Recipe;
  onSave: (recipe: Omit<Recipe, 'id' | 'createdAt'>) => void;
}

const RecipeModal: React.FC<RecipeModalProps> = ({
  isOpen,
  onClose,
  recipe,
  onSave,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={recipe ? 'Modifier la recette' : 'Nouvelle recette'}
    >
      <RecipeForm
        initialData={recipe}
        onSave={(data) => {
          onSave(data);
          onClose();
        }}
        onCancel={onClose}
      />
    </Modal>
  );
};

export default RecipeModal;