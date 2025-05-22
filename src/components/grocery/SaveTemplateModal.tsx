import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface SaveTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
}

const SaveTemplateModal: React.FC<SaveTemplateModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Veuillez saisir un nom');
      return;
    }
    
    onSave(name.trim());
    setName('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Enregistrer comme template"
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Enregistrez votre liste de courses actuelle comme template pour la réutiliser facilement.
          </p>
          
          <Input
            label="Nom du template"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Courses hebdo"
            fullWidth
            error={error}
          />
          
          <div className="flex space-x-3 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              fullWidth
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              fullWidth
            >
              Enregistrer
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default SaveTemplateModal;