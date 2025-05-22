import React, { useState } from 'react';
import { Edit2, Trash2, Check } from 'lucide-react';
import { GroceryItem as GroceryItemType } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import EditItemModal from './EditItemModal';

interface GroceryItemProps {
  item: GroceryItemType;
  onToggleCheck: (id: string) => void;
  onEdit: (item: GroceryItemType) => void;
  onDelete: (id: string) => void;
}

const GroceryItem: React.FC<GroceryItemProps> = ({
  item,
  onToggleCheck,
  onEdit,
  onDelete,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <>
      <Card 
        className={`flex items-center justify-between mb-2 transition-opacity ${
          item.checked ? 'opacity-60' : 'opacity-100'
        }`}
      >
        <div className="flex items-center flex-1">
          <button
            onClick={() => onToggleCheck(item.id)}
            className={`w-5 h-5 rounded border mr-3 flex items-center justify-center transition-colors ${
              item.checked 
                ? 'bg-green-500 border-green-500' 
                : 'border-gray-300 hover:border-green-500'
            }`}
            aria-label={item.checked ? "Marquer comme non acheté" : "Marquer comme acheté"}
          >
            {item.checked && <Check size={14} className="text-white" />}
          </button>
          
          <div className="flex-1">
            <h3 className={`font-medium ${item.checked ? 'line-through text-gray-500' : 'text-gray-800'}`}>
              {item.name}
            </h3>
            <p className="text-sm text-gray-500">
              {item.quantity} {item.unit}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsEditModalOpen(true)}
            aria-label="Modifier"
            icon={<Edit2 size={16} className="text-gray-500 hover:text-gray-700" />}
          />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onDelete(item.id)}
            aria-label="Supprimer"
            icon={<Trash2 size={16} className="text-gray-500 hover:text-red-500" />}
          />
        </div>
      </Card>

      <EditItemModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        item={item}
        onSave={(updatedItem) => {
          onEdit(updatedItem);
          setIsEditModalOpen(false);
        }}
      />
    </>
  );
};

export default GroceryItem;