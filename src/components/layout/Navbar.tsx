import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, ShoppingBag, Layout, BookOpen } from 'lucide-react';
import Button from '../ui/Button';
import { cn } from '../../utils/cn';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Gérer l'effet de scroll sur la navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer le menu mobile lors du resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { 
      to: '/', 
      label: 'Liste de courses', 
      icon: <ShoppingBag size={18} />,
      description: 'Gérer votre liste de courses'
    },
    { 
      to: '/templates', 
      label: 'Templates', 
      icon: <Layout size={18} />,
      description: 'Modèles prédéfinis'
    },
    { 
      to: '/recipes', 
      label: 'Recettes', 
      icon: <BookOpen size={18} />,
      description: 'Vos recettes favorites'
    },
  ];

  return (
    <>
      <header 
        className={cn(
          'navbar sticky top-0 z-40 transition-all duration-200',
          {
            'shadow-md': isScrolled,
          }
        )}
      >
        <div className="container-responsive">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo */}
            <div className="flex items-center">
              <NavLink 
                to="/" 
                className="flex items-center group focus-ring rounded-lg p-1 -m-1"
                onClick={closeMenu}
              >
                <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-primary-600 rounded-lg group-hover:bg-primary-700 transition-colors">
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="ml-2 sm:ml-3">
                  <h1 className="text-lg sm:text-xl font-bold text-primary-600 group-hover:text-primary-700 transition-colors">
                    TodoEat
                  </h1>
                  <p className="hidden sm:block text-xs text-neutral-500 -mt-1">
                    Gestion de courses
                  </p>
                </div>
              </NavLink>
            </div>

            {/* Navigation desktop */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'nav-link group',
                      isActive ? 'nav-link-active' : 'nav-link-inactive'
                    )
                  }
                  end
                >
                  <span className="flex-shrink-0 mr-2 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              ))}
            </nav>

            {/* Bouton menu mobile */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMenu}
                aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                aria-expanded={isMenuOpen}
                icon={
                  <div className="relative w-6 h-6">
                    <Menu 
                      className={cn(
                        'absolute inset-0 transition-all duration-200',
                        isMenuOpen ? 'rotate-180 opacity-0' : 'rotate-0 opacity-100'
                      )} 
                    />
                    <X 
                      className={cn(
                        'absolute inset-0 transition-all duration-200',
                        isMenuOpen ? 'rotate-0 opacity-100' : 'rotate-180 opacity-0'
                      )} 
                    />
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation mobile */}
      {isMenuOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-neutral-900/20 backdrop-blur-sm z-30 md:hidden animate-fade-in"
            onClick={closeMenu}
            aria-hidden="true"
          />
          
          {/* Menu mobile */}
          <div className="fixed top-[56px] sm:top-[64px] left-0 right-0 z-40 md:hidden navbar-mobile shadow-lg">
            <nav className="container-responsive py-4">
              <div className="space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        'nav-link group w-full p-4 rounded-xl',
                        isActive ? 'nav-link-active' : 'nav-link-inactive'
                      )
                    }
                    onClick={closeMenu}
                    end
                  >
                    <div className="flex items-center">
                      <span className="flex-shrink-0 mr-3 group-hover:scale-110 transition-transform">
                        {item.icon}
                      </span>
                      <div className="flex-1">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs text-neutral-500 mt-0.5">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </NavLink>
                ))}
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;