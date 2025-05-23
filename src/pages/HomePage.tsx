import React, { useState } from 'react';
import { History, Save, FileText, Plus, ShoppingCart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import AddItemForm from '../components/grocery/AddItemForm';
import GroceryItem from '../components/grocery/GroceryItem';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import SaveTemplateModal from '../components/grocery/SaveTemplateModal';
import HistoryModal from '../components/grocery/HistoryModal';
import { generateShoppingListPDF } from '../utils/pdfGenerator';
import { cn } from '../utils/cn';

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
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSaveTemplate = (name: string) => {
    saveAsTemplate(name);
    setIsTemplateModalOpen(false);
  };

  const handleSaveToHistory = () => {
    saveCurrentListToHistory();
  };

  const handleGeneratePDF = () => {
    generateShoppingListPDF(currentList);
  };

  const handleAddItem = (name: string, quantity: number, unit: string) => {
    addItem({ name, quantity, unit });
    setShowAddForm(false);
  };

  // Fusionne les doublons par nom+unité (insensible à la casse et aux espaces)
  const mergedList = Object.values(
    currentList.reduce((acc, item) => {
      const key = item.name.trim().toLowerCase() + '|' + item.unit.trim().toLowerCase();
      if (!acc[key]) {
        acc[key] = { ...item };
      } else {
        acc[key].quantity += item.quantity;
        acc[key].checked = acc[key].checked && item.checked;
      }
      return acc;
    }, {} as Record<string, typeof currentList[0]>)
  );

  const checkedItems = mergedList.filter(item => item.checked);
  const uncheckedItems = mergedList.filter(item => !item.checked);
  const hasItems = mergedList.length > 0;
  const hasCheckedItems = checkedItems.length > 0;

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="heading-responsive font-bold text-neutral-900">
              Ma liste de courses
            </h1>
            <p className="text-neutral-500 mt-1">
              {hasItems ? (
                <>
                  {mergedList.length} article{mergedList.length > 1 ? 's' : ''}
                  {hasCheckedItems && (
                    <span className="text-primary-600 ml-2">
                      • {checkedItems.length} terminé{checkedItems.length > 1 ? 's' : ''}
                    </span>
                  )}
                </>
              ) : (
                'Aucun article dans votre liste'
              )}
            </p>
          </div>

          {/* Actions principales */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              size="md"
              onClick={handleGeneratePDF}
              icon={<FileText size={18} />}
              disabled={!hasItems}
              className="w-full sm:w-auto"
            >
              <span className="hidden sm:inline">PDF</span>
              <span className="sm:hidden">Générer PDF</span>
            </Button>
            
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsHistoryModalOpen(true)}
              icon={<History size={18} />}
              className="w-full sm:w-auto"
            >
              <span className="hidden sm:inline">Historique</span>
              <span className="sm:hidden">Voir l'historique</span>
            </Button>
            
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsTemplateModalOpen(true)}
              icon={<Save size={18} />}
              disabled={!hasItems}
              className="w-full sm:w-auto"
            >
              <span className="hidden sm:inline">Sauvegarder</span>
              <span className="sm:hidden">Sauvegarder template</span>
            </Button>
          </div>
        </div>

        {/* Barre de progression */}
        {hasItems && (
          <div className="bg-neutral-100 rounded-full h-2">
            <div 
              className="bg-primary-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(checkedItems.length / mergedList.length) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Formulaire d'ajout */}
      <Card variant="elevated" padding="md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Plus className="w-5 h-5 mr-2 text-primary-600" />
              Ajouter un article
            </CardTitle>
            {!showAddForm && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowAddForm(true)}
                icon={<Plus size={16} />}
                className="md:hidden"
              >
                Ajouter
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className={cn('transition-all duration-300', {
          'block': showAddForm || window.innerWidth >= 768,
          'hidden': !showAddForm && window.innerWidth < 768,
        })}>
          <AddItemForm 
            onAdd={handleAddItem}
            onCancel={() => setShowAddForm(false)}
            showCancel={showAddForm}
          />
        </CardContent>
      </Card>

      {/* Liste des articles */}
      {hasItems ? (
        <div className="space-y-6">
          {/* Articles non cochés */}
          {uncheckedItems.length > 0 && (
            <Card variant="default" padding="md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2 text-neutral-600" />
                  À acheter ({uncheckedItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {uncheckedItems.map((item) => (
                    <GroceryItem
                      key={item.name + '|' + item.unit}
                      item={item}
                      onToggleCheck={toggleItemCheck}
                      onEdit={updateItem}
                      onDelete={removeItem}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Articles cochés */}
          {hasCheckedItems && (
            <Card variant="outlined" padding="md">
              <CardHeader>
                <CardTitle className="flex items-center text-neutral-500">
                  <div className="w-5 h-5 mr-2 rounded-full bg-primary-100 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary-500" />
                  </div>
                  Terminé ({checkedItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {checkedItems.map((item) => (
                    <GroceryItem
                      key={item.name + '|' + item.unit}
                      item={item}
                      onToggleCheck={toggleItemCheck}
                      onEdit={updateItem}
                      onDelete={removeItem}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bouton de finalisation */}
          {hasCheckedItems && (
            <div className="flex justify-center pt-4">
              <Button
                variant="primary"
                size="lg"
                onClick={handleSaveToHistory}
                className="w-full sm:w-auto"
              >
                Terminer les courses
              </Button>
            </div>
          )}
        </div>
      ) : (
        /* État vide */
        <Card variant="filled" padding="lg">
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto bg-neutral-200 rounded-full flex items-center justify-center mb-4">
              <ShoppingCart className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              Votre liste est vide
            </h3>
            <p className="text-neutral-500 mb-6 max-w-sm mx-auto">
              Commencez par ajouter des articles à votre liste de courses.
            </p>
            <Button
              variant="primary"
              onClick={() => setShowAddForm(true)}
              icon={<Plus size={18} />}
              className="md:hidden"
            >
              Ajouter votre premier article
            </Button>
          </div>
        </Card>
      )}

      {/* Modales */}
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