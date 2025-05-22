import React from 'react';
import { useApp } from '../context/AppContext';
import TemplateCard from '../components/templates/TemplateCard';

const TemplatesPage: React.FC = () => {
  const { templates, loadTemplate, deleteTemplate } = useApp();

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mes templates</h1>

      {templates.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Vous n'avez pas encore de template. Sauvegardez une liste pour créer votre premier template !
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onLoad={loadTemplate}
              onDelete={deleteTemplate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplatesPage;