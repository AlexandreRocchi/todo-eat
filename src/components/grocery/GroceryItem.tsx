import React, { useState } from 'react';
import { Edit2, Trash2, Check, MoreVertical } from 'lucide-react';
import { GroceryItem as GroceryItemType } from '../../types';
import Button from '../ui/Button';
import EditItemModal from './EditItemModal';
import ConfirmDialog from '../ui/ConfirmDialog';
import { cn } from '../../utils/cn';

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
  const [showActions, setShowActions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleToggleCheck = () => {
    onToggleCheck(item.id);
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
    setShowActions(false);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
    setShowActions(false);
  };

  const confirmDelete = () => {
    onDelete(item.id);
  };

  return (
    <>
      <div 
        className={cn(
          "group bg-white border border-neutral-200 rounded-lg p-4 transition-all duration-200 hover:shadow-sm",
          {
            'opacity-60 bg-neutral-50': item.checked,
            'hover:border-neutral-300': !item.checked,
          }
        )}
      >
        <div className="flex items-center gap-3">
          {/* Checkbox personnalisé */}
          <button
            onClick={handleToggleCheck}
            className={cn(
              "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
              {
                'bg-primary-500 border-primary-500 scale-110': item.checked,
                'border-neutral-300 hover:border-primary-400 hover:bg-primary-50': !item.checked,
              }
            )}
            aria-label={item.checked ? "Marquer comme non acheté" : "Marquer comme acheté"}
          >
            <Check 
              className={cn(
                "w-4 h-4 text-white transition-all duration-200",
                {
                  'opacity-100 scale-100': item.checked,
                  'opacity-0 scale-50': !item.checked,
                }
              )} 
            />
          </button>
          
          {/* Informations de l'article */}
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "font-medium text-sm sm:text-base transition-all duration-200 truncate",
              {
                'line-through text-neutral-500': item.checked,
                'text-neutral-900': !item.checked,
              }
            )}>
              {item.name}
            </h3>
            <p className={cn(
              "text-xs sm:text-sm transition-all duration-200",
              {
                'text-neutral-400': item.checked,
                'text-neutral-500': !item.checked,
              }
            )}>
              {item.quantity} {item.unit}
            </p>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Actions desktop */}
            <div className="hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleEdit}
                aria-label="Modifier l'article"
                icon={<Edit2 className="w-4 h-4 text-neutral-500 hover:text-primary-600" />}
              />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleDelete}
                aria-label="Supprimer l'article"
                icon={<Trash2 className="w-4 h-4 text-neutral-500 hover:text-error-600" />}
              />
            </div>

            {/* Actions mobile */}
            <div className="sm:hidden relative">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowActions(!showActions)}
                aria-label="Options"
                icon={<MoreVertical className="w-4 h-4 text-neutral-500" />}
              />
              
              {showActions && (
                <>
                  {/* Overlay */}
                  <div 
                    className="fixed inset-0 z-10"
                    onClick={() => setShowActions(false)}
                  />
                  
                  {/* Menu actions */}
                  <div className="absolute right-0 top-full mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg z-20 min-w-[120px] py-1">
                    <button
                      onClick={handleEdit}
                      className="w-full px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Modifier
                    </button>
                    <button
                      onClick={handleDelete}
                      className="w-full px-3 py-2 text-left text-sm text-error-600 hover:bg-error-50 flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <EditItemModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        item={item}
        onSave={(updatedItem) => {
          onEdit(updatedItem);
          setIsEditModalOpen(false);
        }}
      />
      
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Supprimer l'article"
        message={`Êtes-vous sûr de vouloir supprimer "${item.name}" ?`}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
      />
    </>
  );
};

export default GroceryItem;