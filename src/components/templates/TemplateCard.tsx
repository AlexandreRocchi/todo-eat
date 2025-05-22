import React from 'react';
import { Calendar, Copy, Trash2 } from 'lucide-react';
import { Template } from '../../types';
import { formatDate } from '../../utils/helpers';
import Card from '../ui/Card';
import Button from '../ui/Button';

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
  return (
    <Card className="h-full flex flex-col">
      <div className="flex-1">
        <h3 className="font-medium text-lg text-gray-800">{template.name}</h3>
        
        <div className="flex items-center mt-1 text-sm text-gray-500">
          <Calendar size={14} className="mr-1" />
          <span>{formatDate(template.createdAt)}</span>
        </div>
        
        <div className="mt-3">
          <p className="text-sm text-gray-600">
            {template.items.length} article{template.items.length > 1 ? 's' : ''}
          </p>
          
          <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
            {template.items.slice(0, 3).map(item => (
              <li key={item.id} className="truncate">
                {item.name} ({item.quantity} {item.unit})
              </li>
            ))}
            {template.items.length > 3 && (
              <li className="text-gray-400">
                Et {template.items.length - 3} autre{template.items.length - 3 > 1 ? 's' : ''}...
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
      </div>
    </Card>
  );
};

export default TemplateCard;