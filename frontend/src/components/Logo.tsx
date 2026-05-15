import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  color?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 48 }) => {
  return (
    <img 
      src="/logo.png" 
      alt="ChainCacao Logo" 
      width={size} 
      height={size} 
      className={`object-contain ${className}`}
    />
  );
};
