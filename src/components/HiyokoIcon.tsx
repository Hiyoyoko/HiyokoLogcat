import React from "react";

interface HiyokoIconProps {
  size?: number;
  className?: string;
}

const HiyokoIcon: React.FC<HiyokoIconProps> = ({ size = 20, className = "" }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Body: Round & Fluffy */}
      <circle cx="50" cy="50" r="45" fill="#FFD700" />
      
      {/* Blushed Cheeks */}
      <circle cx="30" cy="55" r="8" fill="#FFB6C1" fillOpacity="0.6" />
      <circle cx="70" cy="55" r="8" fill="#FFB6C1" fillOpacity="0.6" />
      
      {/* Eyes: Simple Dot Eyes */}
      <circle cx="35" cy="45" r="4" fill="#333333" />
      <circle cx="65" cy="45" r="4" fill="#333333" />
      
      {/* Beak: Tiny Triangle */}
      <path d="M45 52 L55 52 L50 62 Z" fill="#FF8C00" />
      
      {/* Subtle Shine */}
      <circle cx="25" cy="25" r="5" fill="white" fillOpacity="0.3" />
    </svg>
  );
};

export default HiyokoIcon;
