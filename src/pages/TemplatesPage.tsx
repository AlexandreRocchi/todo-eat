import React, { useState } from 'react';
import { Trash2, Plus, Copy, Layout as LayoutIcon, Eye, List, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { mergeItems, formatDate } from '../utils/helpers';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';

const TemplatesPage: React.FC = () => {
  const { templates, deleteTemplate, loadTemplate } = useApp();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: '', name: '' });

  const handleDeleteTemplate = (id: string, name: string) => {
    setDeleteConfirm({ isOpen: true, id, name });
  };

  const confirmDeleteTemplate = () => {
    deleteTemplate(deleteConfirm.id);
    setDeleteConfirm({ isOpen: false, id: '', name: '' });
  };

  const handleLoadTemplate = (id: string) => {
    loadTemplate(id);
    // Optionnel : rediriger vers la page d'accueil
    window.location.href = '/';
  };

  const handleShowDetails = (template) => {
    setSelectedTemplate(template);
    setShowDetails(true);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="space-y-2">
        <h1 className="heading-responsive font-bold text-neutral-900 flex items-center">
          <LayoutIcon className="w-6 h-6 sm:w-8 sm:h-8 mr-3 text-primary-600" />
          Mes Templates
        </h1>
        <p className="text-neutral-500">
          {templates.length > 0 ? (
            <>
              {templates.length} template{templates.length > 1 ? 's' : ''} sauvegardé{templates.length > 1 ? 's' : ''}
            </>
          ) : (
            'Aucun template sauvegardé'
          )}
        </p>
      </div>

      {/* Liste des templates */}
      {templates.length > 0 ? (
        <div className="grid-responsive">
          {templates.map((template) => {
            // Filtrer et fusionner les éléments identiques
            const items = Array.isArray(template.items) 
              ? template.items.filter(item => typeof item === 'object') 
              : [];
            const mergedItems = mergeItems(items);
            
            return (
              <Card key={template.id} variant="default" padding="none" hover>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg flex items-center">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                      <LayoutIcon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate">{template.name}</div>
                      <div className="text-sm text-neutral-500 font-normal mt-1">
                        {mergedItems.length} article{mergedItems.length > 1 ? 's' : ''} unique{mergedItems.length > 1 ? 's' : ''}
                        {items.length !== mergedItems.length && (
                          <span className="text-neutral-400 ml-1">
                            ({items.length} au total)
                          </span>
                        )}
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="space-y-2">
                    {mergedItems.slice(0, 3).map((item, index) => (
                      <div 
                        key={`${item.name}-${item.unit}-${index}`}
                        className="flex items-center justify-between text-sm bg-neutral-50 rounded-lg px-3 py-2"
                      >
                        <span className="text-neutral-700 truncate">{item.name}</span>
                        <span className="text-neutral-500 text-xs flex-shrink-0 ml-2 font-medium">
                          {item.quantity} {item.unit}
                        </span>
                      </div>
                    ))}
                    
                    {mergedItems.length > 3 && (
                      <div className="text-xs text-neutral-500 text-center py-1">
                        +{mergedItems.length - 3} article{mergedItems.length - 3 > 1 ? 's' : ''} de plus
                      </div>
                    )}
                  </div>
                </CardContent>

                <CardFooter>
                  <div className="flex gap-2 w-full">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleLoadTemplate(template.id)}
                      icon={<Copy className="w-4 h-4" />}
                      className="flex-1"
                    >
                      Charger
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteTemplate(template.id, template.name)}
                      icon={<Trash2 className="w-4 h-4" />}
                      aria-label={`Supprimer le template ${template.name}`}
                    >
                      <span className="sr-only">Supprimer</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShowDetails(template)}
                      icon={<Eye className="w-4 h-4" />}
                      aria-label={`Voir la liste complète du template ${template.name}`}
                    >
                      <span className="sr-only">Voir détails</span>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        /* État vide */
        <Card variant="filled" padding="lg">
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto bg-neutral-200 rounded-full flex items-center justify-center mb-4">
              <LayoutIcon className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              Aucun template trouvé
            </h3>
            <p className="text-neutral-500 mb-6 max-w-sm mx-auto">
              Créez votre première liste de courses, puis sauvegardez-la comme template pour la réutiliser facilement.
            </p>
            <Button
              variant="primary"
              onClick={() => window.location.href = '/'}
              icon={<Plus className="w-5 h-5" />}
            >
              Créer ma première liste
            </Button>
          </div>
        </Card>
      )}

      {/* Modal pour afficher les détails du template */}
      {selectedTemplate && (
        <Modal 
          isOpen={showDetails} 
          onClose={() => setShowDetails(false)} 
          title={
            <div className="flex items-center">
              <List className="w-5 h-5 mr-2 text-blue-600" />
              <span>Liste complète : {selectedTemplate.name}</span>
            </div>
          }
        >
          <div className="space-y-4">
            {(() => {
              const items = Array.isArray(selectedTemplate.items) 
                ? selectedTemplate.items.filter(item => typeof item === 'object') 
                : [];
              const mergedItems = mergeItems(items);

              return (
                <>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      <span>Créé le {formatDate(selectedTemplate.createdAt)}</span>
                    </div>
                    <div className="flex items-center text-blue-600 font-medium">
                      <List size={14} className="mr-1" />
                      <span>{mergedItems.length} article{mergedItems.length > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                      <List size={16} className="text-blue-600" />
                    </div>
                    Tous les articles de ce template
                  </h4>
                  
                  {mergedItems.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <List size={24} className="text-gray-400" />
                      </div>
                      <p className="text-gray-500">Ce template ne contient aucun article.</p>
                    </div>
                  ) : (
                    <div className="border rounded-lg overflow-hidden">
                      <div className="max-h-96 overflow-y-auto">
                        <table className="w-full">
                          <thead className="bg-blue-50 sticky top-0">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
                                Article
                              </th>
                              <th className="px-4 py-3 text-right text-xs font-semibold text-blue-800 uppercase tracking-wider">
                                Quantité
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {mergedItems.map((item, index) => (
                              <tr key={`${item.name}-${item.unit}-${index}`} className="hover:bg-gray-50 transition-colors duration-150">
                                <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                                  {item.name}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700 text-right font-semibold">
                                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                    {item.quantity} {item.unit}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center pt-4 border-t bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600">
                      🛒 Prêt à faire vos courses avec cette liste ?
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="secondary"
                        onClick={() => setShowDetails(false)}
                        size="sm"
                      >
                        Fermer
                      </Button>
                      <Button 
                        variant="primary" 
                        icon={<Copy size={16} />}
                        onClick={() => {
                          handleLoadTemplate(selectedTemplate.id);
                          setShowDetails(false);
                        }}
                        size="sm"
                      >
                        Charger ce template
                      </Button>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </Modal>
      )}

      {/* Confirmation de suppression */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: '', name: '' })}
        onConfirm={confirmDeleteTemplate}
        title="Supprimer le template"
        message={`Êtes-vous sûr de vouloir supprimer le template "${deleteConfirm.name}" ?`}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
      />
    </div>
  );
};

export default TemplatesPage;