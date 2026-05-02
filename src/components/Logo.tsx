import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  color?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 48, color = '#1a1a1a' }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="256" cy="256" r="230" stroke={color} strokeWidth="20" />
      {/* Sun rays */}
      <line x1="256" y1="80" x2="256" y2="120" stroke={color} strokeWidth="15" strokeLinecap="round" />
      <line x1="334" y1="102" x2="310" y2="135" stroke={color} strokeWidth="15" strokeLinecap="round" />
      <line x1="395" y1="160" x2="360" y2="185" stroke={color} strokeWidth="15" strokeLinecap="round" />
      <line x1="178" y1="102" x2="202" y2="135" stroke={color} strokeWidth="15" strokeLinecap="round" />
      <line x1="117" y1="160" x2="152" y2="185" stroke={color} strokeWidth="15" strokeLinecap="round" />
      
      {/* Cocoa Bean 1 */}
      <path 
        d="M256 256C256 256 320 200 400 256C420 270 410 320 380 340C340 370 256 350 256 350C256 350 172 370 132 340C102 320 92 270 112 256C192 200 256 256 256 256Z" 
        stroke={color} 
        strokeWidth="15" 
        fill="transparent"
      />
      {/* Cocoa Detail */}
      <path 
        d="M180 280C220 250 292 250 332 280" 
        stroke={color} 
        strokeWidth="10" 
        strokeLinecap="round"
      />
      
      {/* Cocoa Bean 2 (Small overlay) */}
      <path 
        d="M256 300C256 300 290 270 340 300C355 310 350 340 330 350C300 370 256 360 256 360" 
        stroke={color} 
        strokeWidth="12" 
        fill="transparent"
      />
    </svg>
  );
};
