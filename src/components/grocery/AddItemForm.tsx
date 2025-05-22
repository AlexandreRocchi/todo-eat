import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { COMMON_UNITS } from '../../utils/helpers';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

interface AddItemFormProps {
  onAdd: (name: string, quantity: number, unit: string) => void;
}

const AddItemForm: React.FC<AddItemFormProps> = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('pièce(s)');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Veuillez saisir un nom');
      return;
    }
    
    onAdd(name.trim(), quantity, unit);
    setName('');
    setQuantity(1);
    setUnit('pièce(s)');
    setError('');
  };

  const unitOptions = COMMON_UNITS.map(unit => ({
    value: unit,
    label: unit
  }));

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <h2 className="text-lg font-medium mb-3">Ajouter un article</h2>
      
      <div className="space-y-3">
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
        
        <Button 
          type="submit" 
          fullWidth
          icon={<PlusCircle size={18} />}
        >
          Ajouter
        </Button>
      </div>
    </form>
  );
};

export default AddItemForm;