import React from 'react';
import { useApp } from '../context/AppContext';
import TemplateCard from '../components/templates/TemplateCard';
import Modal from '../components/ui/Modal';

const TemplatesPage: React.FC = () => {
  const { templates, addTemplateToList, deleteTemplate } = useApp();
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [selectedTemplate, setSelectedTemplate] = React.useState<string | null>(null);

  const handleLoad = (templateId: string) => {
    setSelectedTemplate(templateId);
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    if (selectedTemplate) {
      addTemplateToList(selectedTemplate);
    }
    setShowConfirm(false);
    setSelectedTemplate(null);
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setSelectedTemplate(null);
  };

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
            <div key={template.id || `template-${Math.random()}`}>
              <TemplateCard
                template={template}
                onLoad={handleLoad}
                onDelete={deleteTemplate}
              />
            </div>
          ))}
        </div>
      )}
      <Modal isOpen={showConfirm} onClose={handleCancel} title="Ajouter le template à la liste ?">
        <div className="space-y-4">
          <p>Les articles du template seront ajoutés à votre liste de courses actuelle.</p>
          <div className="flex space-x-2">
            <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleConfirm}>Oui, ajouter</button>
            <button className="bg-gray-200 px-4 py-2 rounded" onClick={handleCancel}>Annuler</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TemplatesPage;