import React, { useState } from 'react';
import { Calendar, Copy, Trash2, List, Eye } from 'lucide-react';
import { Template, TemplateItem } from '../../types';
import { formatDate, mergeItems } from '../../utils/helpers';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

interface TemplateCardProps {
  template: Template;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onLoad,
  onDelete,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  
  // S'assurer que template.items est un tableau et contient des objets TemplateItem
  const items = Array.isArray(template.items) 
    ? template.items.filter(item => typeof item === 'object') as TemplateItem[]
    : [];
  
  // Fusionner les éléments identiques
  const mergedItems = mergeItems(items);
  
  console.log('Items du template dans TemplateCard:', template.name, items);
  console.log('Items fusionnés:', mergedItems);
  
  return (
    <>
      <Card className="h-full flex flex-col">
        <div className="flex-1">
          <h3 className="font-medium text-lg text-gray-800">{template.name}</h3>
          
          <div className="flex items-center mt-1 text-sm text-gray-500">
            <Calendar size={14} className="mr-1" />
            <span>{formatDate(template.createdAt)}</span>
          </div>
          
          <div className="mt-3">
            <p className="text-sm text-gray-600">
              {mergedItems.length} article{mergedItems.length > 1 ? 's' : ''} unique{mergedItems.length > 1 ? 's' : ''}
              {items.length !== mergedItems.length && (
                <span className="text-gray-400 ml-1">
                  ({items.length} au total)
                </span>
              )}
            </p>
            
            <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
              {mergedItems.slice(0, 3).map((item, index) => (
                <li key={`${item.name}-${item.unit}-${index}`} className="truncate">
                  {`${item.quantity} ${item.unit} ${item.name}`}
                </li>
              ))}
              {mergedItems.length > 3 && (
                <li className="text-gray-400">
                  Et {mergedItems.length - 3} autre{mergedItems.length - 3 > 1 ? 's' : ''}...
                </li>
              )}
            </ul>
          </div>
        </div>
        
        <div className="flex mt-4 space-x-2">
          <Button 
            variant="primary" 
            icon={<Copy size={16} />}
            onClick={() => onLoad(template.id)}
            fullWidth
          >
            Charger
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onDelete(template.id)}
            aria-label="Supprimer"
            icon={<Trash2 size={16} className="text-gray-500 hover:text-red-500" />}
          />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowDetails(true)}
            aria-label="Voir la liste complète"
            icon={<Eye size={16} className="text-gray-500 hover:text-blue-500" />}
          />
        </div>
      </Card>
      
      <Modal 
        isOpen={showDetails} 
        onClose={() => setShowDetails(false)} 
        title={
          <div className="flex items-center">
            <List className="w-5 h-5 mr-2 text-blue-600" />
            <span>Liste complète : {template.name}</span>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Calendar size={14} className="mr-1" />
              <span>Créé le {formatDate(template.createdAt)}</span>
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
                  onLoad(template.id);
                  setShowDetails(false);
                }}
                size="sm"
              >
                Charger ce template
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TemplateCard;