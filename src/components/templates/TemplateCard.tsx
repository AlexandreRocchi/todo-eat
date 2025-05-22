import React, { useState } from 'react';
import { Calendar, Copy, Trash2, List } from 'lucide-react';
import { Template, TemplateItem } from '../../types';
import { formatDate } from '../../utils/helpers';
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
  
  // S'assurer que template.items est un tableau
  const items = Array.isArray(template.items) ? template.items : [];
  
  console.log('Items du template dans TemplateCard:', template.name, items);
  
  return (
    <>
      <Card className="h-full flex flex-col">
        <div className="flex-1 cursor-pointer" onClick={() => setShowDetails(true)}>
          <h3 className="font-medium text-lg text-gray-800">{template.name}</h3>
          
          <div className="flex items-center mt-1 text-sm text-gray-500">
            <Calendar size={14} className="mr-1" />
            <span>{formatDate(template.createdAt)}</span>
          </div>
          
          <div className="mt-3">
            <p className="text-sm text-gray-600">
              {items.length} article{items.length > 1 ? 's' : ''}
            </p>
            
            <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
              {items.slice(0, 3).map(item => (
                <li key={typeof item === 'string' ? item : item.id} className="truncate">
                  {typeof item === 'string' 
                    ? `Article ID: ${item}`
                    : `${item.name} (${item.quantity} ${item.unit})`
                  }
                </li>
              ))}
              {items.length > 3 && (
                <li className="text-gray-400">
                  Et {items.length - 3} autre{items.length - 3 > 1 ? 's' : ''}...
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
            onClick={(e) => {
              e.stopPropagation();
              setShowDetails(true);
            }}
            aria-label="Voir détails"
            icon={<List size={16} className="text-gray-500 hover:text-blue-500" />}
          />
        </div>
      </Card>
      
      <Modal 
        isOpen={showDetails} 
        onClose={() => setShowDetails(false)} 
        title={`Détails du template: ${template.name}`}
      >
        <div className="space-y-4">
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Calendar size={14} className="mr-1" />
            <span>{formatDate(template.createdAt)}</span>
          </div>
          
          <h4 className="font-medium text-gray-700 mb-2">Liste complète des articles ({items.length})</h4>
          
          {items.length === 0 ? (
            <p className="text-gray-500">Ce template ne contient aucun article.</p>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.map((item, index) => (
                    <tr key={typeof item === 'string' ? item : item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                        {typeof item === 'string' ? `Article ID: ${item}` : item.name}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                        {typeof item === 'string' ? '-' : `${item.quantity} ${item.unit}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button 
              variant="primary" 
              icon={<Copy size={16} />}
              onClick={() => {
                onLoad(template.id);
                setShowDetails(false);
              }}
            >
              Charger ce template
            </Button>
            <Button 
              variant="secondary"
              onClick={() => setShowDetails(false)}
            >
              Fermer
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TemplateCard;