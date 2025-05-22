import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import AuthGuard from '../ui/AuthGuard';

const Layout: React.FC = () => {
  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen bg-bg text-text transition-colors duration-300">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-6">
          <div className="form-card max-w-2xl mx-auto">
            <Outlet />
          </div>
        </main>
        <footer className="py-4 text-center text-sm border-t" style={{ background: 'var(--color-footer)', color: 'var(--color-text)', borderColor: 'var(--color-border)' }}>
          <div className="container mx-auto px-4">
            TodoEat &copy; {new Date().getFullYear()} - Gestion de courses alimentaires
          </div>
        </footer>
      </div>
    </AuthGuard>
  );
};

export default Layout;