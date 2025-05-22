import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>
      <footer className="py-4 bg-white border-t text-center text-sm text-gray-500">
        <div className="container mx-auto px-4">
          TodoEat &copy; {new Date().getFullYear()} - Gestion de courses alimentaires
        </div>
      </footer>
    </div>
  );
};

export default Layout;