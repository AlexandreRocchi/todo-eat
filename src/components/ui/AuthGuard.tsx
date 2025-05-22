import React from 'react';
import { useAuth } from '../../context/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, showPasswordPrompt } = useAuth();
  
  // Si l'utilisateur est authentifié ou si le prompt de mot de passe n'est pas affiché,
  // on affiche le contenu normalement
  if (isAuthenticated || !showPasswordPrompt) {
    return <>{children}</>;
  }
  
  // Sinon, on affiche un écran de chargement ou rien
  return (
    <div className="hidden">
      {/* Le contenu est caché jusqu'à ce que l'authentification soit réussie */}
    </div>
  );
};

export default AuthGuard; 