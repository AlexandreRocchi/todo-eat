import { useState } from 'react';

interface ConfirmState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  variant: 'default' | 'danger';
  onConfirm: () => void;
}

const initialState: ConfirmState = {
  isOpen: false,
  title: '',
  message: '',
  confirmText: 'Confirmer',
  cancelText: 'Annuler',
  variant: 'default',
  onConfirm: () => {},
};

export const useConfirm = () => {
  const [confirmState, setConfirmState] = useState<ConfirmState>(initialState);

  const confirm = (options: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'default' | 'danger';
  }) => {
    return new Promise<boolean>((resolve) => {
      setConfirmState({
        isOpen: true,
        title: options.title,
        message: options.message,
        confirmText: options.confirmText || 'Confirmer',
        cancelText: options.cancelText || 'Annuler',
        variant: options.variant || 'default',
        onConfirm: () => {
          resolve(true);
          setConfirmState(initialState);
        },
      });
    });
  };

  const handleClose = () => {
    setConfirmState(initialState);
  };

  return {
    confirmState,
    confirm,
    handleClose,
  };
}; 