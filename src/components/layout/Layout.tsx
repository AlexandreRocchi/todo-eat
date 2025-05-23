import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      <Navbar />
      
      {/* Contenu principal avec responsive design */}
      <main className="flex-1 safe-area-inset-top">
        <div className="container-responsive py-4 sm:py-6 lg:py-8">
          <div className="form-card max-w-none sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
      
      {/* Footer moderne et responsive */}
      <footer className="footer safe-area-inset-bottom">
        <div className="container-responsive py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="text-sm text-center sm:text-left">
              <span className="font-semibold text-primary-600">TodoEat</span>
              <span className="mx-2 hidden sm:inline">•</span>
              <span className="block sm:inline">Gestion de courses alimentaires</span>
            </div>
            <div className="text-xs text-neutral-500">
              © {new Date().getFullYear()} - Tous droits réservés
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;