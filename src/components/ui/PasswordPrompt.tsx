import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const PasswordPrompt: React.FC = () => {
  const { authenticate, showPasswordPrompt } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (authenticate(password)) {
      setError('');
    } else {
      setError('Mot de passe incorrect');
      setPassword('');
    }
  };
  
  if (!showPasswordPrompt) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="form-card max-w-md w-full shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Accès protégé</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Veuillez entrer le mot de passe pour accéder au site
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2"
              placeholder="Mot de passe"
              autoFocus
            />
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full btn-primary py-2 px-4"
          >
            Valider
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordPrompt; 