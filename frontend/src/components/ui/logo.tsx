import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  color?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 48 }) => {
  return (
    <div 
      className={`flex items-center justify-center overflow-hidden ${className}`} 
      style={{ width: size, height: size }}
    >
      <img 
        src="/logo.png" 
        alt="ChainCacao Logo" 
        referrerPolicy="no-referrer"
        className="w-full h-full object-contain"
      />
    </div>
  );
};
