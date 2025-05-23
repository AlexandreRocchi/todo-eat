import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { COMMON_UNITS } from '../../utils/helpers';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { cn } from '../../utils/cn';

interface AddItemFormProps {
  onAdd: (name: string, quantity: number, unit: string) => void;
  onCancel?: () => void;
  showCancel?: boolean;
}

const AddItemForm: React.FC<AddItemFormProps> = ({ 
  onAdd, 
  onCancel, 
  showCancel = false 
}) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('pièce(s)');
  const [errors, setErrors] = useState<{ name?: string; quantity?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: { name?: string; quantity?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Le nom de l\'article est requis';
    }
    
    if (quantity <= 0) {
      newErrors.quantity = 'La quantité doit être supérieure à 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 200)); // Simulation d'une requête
      onAdd(name.trim(), quantity, unit);
      
      // Reset form
      setName('');
      setQuantity(1);
      setUnit('pièce(s)');
      setErrors({});
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setName('');
    setQuantity(1);
    setUnit('pièce(s)');
    setErrors({});
    onCancel?.();
  };

  const unitOptions = COMMON_UNITS.map(unit => ({
    value: unit,
    label: unit
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nom de l'article */}
      <Input
        label="Nom de l'article"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (errors.name) {
            setErrors(prev => ({ ...prev, name: undefined }));
          }
        }}
        placeholder="Ex: Pommes, Pain, Lait..."
        error={errors.name}
        helperText="Saisissez le nom de l'article à ajouter"
        fullWidth
        required
        autoComplete="off"
      />
      
      {/* Quantité et unité */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Quantité"
          type="number"
          min="0.1"
          step="0.1"
          value={quantity}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            setQuantity(value);
            if (errors.quantity && value > 0) {
              setErrors(prev => ({ ...prev, quantity: undefined }));
            }
          }}
          error={errors.quantity}
          helperText="Quantité souhaitée"
          fullWidth
          required
        />
        
        <Select
          label="Unité"
          options={unitOptions}
          value={unit}
          onChange={setUnit}
          helperText="Unité de mesure"
          fullWidth
        />
      </div>
      
      {/* Boutons d'action */}
      <div className={cn(
        "flex gap-3",
        showCancel ? "flex-col sm:flex-row-reverse" : "justify-end"
      )}>
        <Button 
          type="submit" 
          variant="primary"
          size="md"
          loading={isLoading}
          disabled={!name.trim() || quantity <= 0}
          icon={!isLoading ? <Plus size={18} /> : undefined}
          className={cn(showCancel ? "w-full sm:w-auto" : "w-full sm:w-auto")}
        >
          {isLoading ? 'Ajout en cours...' : 'Ajouter l\'article'}
        </Button>
        
        {showCancel && (
          <Button 
            type="button"
            variant="outline"
            size="md"
            onClick={handleCancel}
            icon={<X size={18} />}
            className="w-full sm:w-auto"
          >
            Annuler
          </Button>
        )}
      </div>
    </form>
  );
};

export default AddItemForm;