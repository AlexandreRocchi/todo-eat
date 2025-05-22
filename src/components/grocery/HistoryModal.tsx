import React from 'react';
import { ShoppingList } from '../../types';
import { formatDate } from '../../utils/helpers';
import Modal from '../ui/Modal';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: ShoppingList[];
  onSelect: (id: string) => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelect,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Historique des courses"
    >
      {history.length === 0 ? (
        <p className="text-center text-gray-500 my-4">
          Aucun historique disponible
        </p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {history.map((list) => (
            <Card 
              key={list.id} 
              interactive
              onClick={() => {
                onSelect(list.id);
                onClose();
              }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{formatDate(list.createdAt)}</p>
                  <p className="text-sm text-gray-500">
                    {list.items.length} article{list.items.length > 1 ? 's' : ''}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                >
                  Charger
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      <div className="mt-4">
        <Button 
          variant="outline" 
          onClick={onClose}
          fullWidth
        >
          Fermer
        </Button>
      </div>
    </Modal>
  );
};

export default HistoryModal;