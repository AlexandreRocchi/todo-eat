import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  onClick,
  interactive = false 
}) => {
  const baseClasses = 'bg-white rounded-lg shadow-sm p-4 transition-all duration-200';
  const interactiveClasses = interactive 
    ? 'hover:shadow-md cursor-pointer hover:translate-y-[-2px]' 
    : '';
  
  return (
    <div 
      className={`${baseClasses} ${interactiveClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;