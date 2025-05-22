import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  authenticate: (password: string) => boolean;
  showPasswordPrompt: boolean;
  setShowPasswordPrompt: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CORRECT_PASSWORD = 'lescarottessontcuites';
const AUTH_COOKIE_NAME = 'todoeat_auth';
const AUTH_COOKIE_EXPIRY = 30; // jours

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState<boolean>(false);

  // Vérifier si l'utilisateur est déjà authentifié via un cookie
  useEffect(() => {
    const checkAuthCookie = () => {
      const cookies = document.cookie.split(';').map(cookie => cookie.trim());
      const authCookie = cookies.find(cookie => cookie.startsWith(`${AUTH_COOKIE_NAME}=`));
      
      if (authCookie) {
        setIsAuthenticated(true);
      } else {
        setShowPasswordPrompt(true);
      }
    };
    
    checkAuthCookie();
  }, []);

  const authenticate = (password: string): boolean => {
    const isValid = password === CORRECT_PASSWORD;
    
    if (isValid) {
      setIsAuthenticated(true);
      setShowPasswordPrompt(false);
      
      // Définir un cookie pour se souvenir de l'authentification
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + AUTH_COOKIE_EXPIRY);
      document.cookie = `${AUTH_COOKIE_NAME}=true; expires=${expiryDate.toUTCString()}; path=/`;
    }
    
    return isValid;
  };

  const value: AuthContextType = {
    isAuthenticated,
    authenticate,
    showPasswordPrompt,
    setShowPasswordPrompt
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 