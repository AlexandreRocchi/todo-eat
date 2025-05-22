import React, { useState } from 'react';
import { History, Save } from 'lucide-react';
import { useApp } from '../context/AppContext';
import AddItemForm from '../components/grocery/AddItemForm';
import GroceryItem from '../components/grocery/GroceryItem';
import Button from '../components/ui/Button';
import SaveTemplateModal from '../components/grocery/SaveTemplateModal';
import HistoryModal from '../components/grocery/HistoryModal';

const HomePage: React.FC = () => {
  const {
    currentList,
    addItem,
    updateItem,
    removeItem,
    toggleItemCheck,
    saveAsTemplate,
    history,
    saveCurrentListToHistory,
    loadFromHistory,
  } = useApp();

  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const handleSaveTemplate = (name: string) => {
    saveAsTemplate(name);
    setIsTemplateModalOpen(false);
  };

  const handleSaveToHistory = () => {
    saveCurrentListToHistory();
  };

  const handleAddItem = (name: string, quantity: number, unit: string) => {
    addItem({ name, quantity, unit });
  };

  // Fusionne les doublons par nom+unité (insensible à la casse et aux espaces)
  const mergedList = Object.values(
    currentList.reduce((acc, item) => {
      const key = item.name.trim().toLowerCase() + '|' + item.unit.trim().toLowerCase();
      if (!acc[key]) {
        acc[key] = { ...item };
      } else {
        acc[key].quantity += item.quantity;
        acc[key].checked = acc[key].checked && item.checked; // reste coché seulement si tous sont cochés
      }
      return acc;
    }, {} as Record<string, typeof currentList[0]>)
  );

  return (
    <div className="max-w-2xl mx-auto">
      {/* Debug : {console.log('currentList au rendu :', currentList)} */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Ma liste de courses</h1>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setIsHistoryModalOpen(true)}
            icon={<History size={18} />}
          >
            Historique
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsTemplateModalOpen(true)}
            icon={<Save size={18} />}
          >
            Sauvegarder
          </Button>
        </div>
      </div>

      <AddItemForm onAdd={handleAddItem} />

      <div className="space-y-2">
        {mergedList.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Votre liste est vide. Ajoutez des articles pour commencer !
          </div>
        ) : (
          <>
            {mergedList.map((item) => (
              <GroceryItem
                key={item.name + '|' + item.unit}
                item={item}
                onToggleCheck={toggleItemCheck}
                onEdit={updateItem}
                onDelete={removeItem}
              />
            ))}

            {mergedList.some((item) => item.checked) && (
              <div className="mt-4 text-right">
                <Button
                  variant="primary"
                  onClick={handleSaveToHistory}
                >
                  Terminer les courses
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <SaveTemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSave={handleSaveTemplate}
      />

      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={history}
        onSelect={loadFromHistory}
      />
    </div>
  );
};

export default HomePage;