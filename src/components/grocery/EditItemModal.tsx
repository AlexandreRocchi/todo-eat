import React, { useState } from 'react';
import { GroceryItem } from '../../types';
import { COMMON_UNITS } from '../../utils/helpers';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: GroceryItem;
  onSave: (item: GroceryItem) => void;
}

const EditItemModal: React.FC<EditItemModalProps> = ({
  isOpen,
  onClose,
  item,
  onSave,
}) => {
  const [name, setName] = useState(item.name);
  const [quantity, setQuantity] = useState(item.quantity);
  const [unit, setUnit] = useState(item.unit);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Veuillez saisir un nom');
      return;
    }
    
    onSave({
      ...item,
      name: name.trim(),
      quantity,
      unit
    });
  };

  const unitOptions = COMMON_UNITS.map(unit => ({
    value: unit,
    label: unit
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Modifier l'article"
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            label="Nom de l'article"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Pommes"
            fullWidth
            error={error}
          />
          
          <div className="flex space-x-3">
            <Input
              label="Quantité"
              type="number"
              min="0.1"
              step="0.1"
              value={quantity}
              onChange={(e) => setQuantity(parseFloat(e.target.value))}
              fullWidth
            />
            
            <Select
              label="Unité"
              options={unitOptions}
              value={unit}
              onChange={setUnit}
              fullWidth
            />
          </div>
          
          <div className="flex space-x-3 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
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
        </div>
      </form>
    </Modal>
  );
};

export default EditItemModal;