import React from 'react';

interface ScorecerLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
}

export const SoccerBallO: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    aria-hidden="true"
  >
    {/* Outer White Ball Circle */}
    <circle cx="32" cy="32" r="29.5" fill="#F8FAFC" stroke="#050D08" strokeWidth="3" />
    {/* Center Pentagon */}
    <polygon points="32,18 45,27.5 40,43 24,43 19,27.5" fill="#050D08" />
    {/* Seam Lines from Pentagon Vertices */}
    <line x1="32" y1="18" x2="32" y2="6" stroke="#050D08" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="45" y1="27.5" x2="57" y2="22" stroke="#050D08" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="40" y1="43" x2="50" y2="54" stroke="#050D08" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="24" y1="43" x2="14" y2="54" stroke="#050D08" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="19" y1="27.5" x2="7" y2="22" stroke="#050D08" strokeWidth="3.5" strokeLinecap="round" />
    {/* Outer Edge Panels */}
    <path d="M22 4.5 L32 8.5 L42 4.5" fill="#050D08" />
    <path d="M55.5 15 L54.5 24.5 L61 30" fill="#050D08" />
    <path d="M54.5 49.5 L46 51.5 L43 59.5" fill="#050D08" />
    <path d="M9.5 49.5 L18 51.5 L21 59.5" fill="#050D08" />
    <path d="M8.5 15 L9.5 24.5 L3 30" fill="#050D08" />
  </svg>
);

export const ScorecerLogo: React.FC<ScorecerLogoProps> = ({ size = 'md', className = '' }) => {
  const sizeStyles = {
    sm: {
      text: 'text-base tracking-tight',
      ball: 'w-4 h-4 mx-[1px] -mt-0.5',
    },
    md: {
      text: 'text-xl sm:text-2xl tracking-tight',
      ball: 'w-5 h-5 sm:w-6 sm:h-6 mx-[1px] -mt-0.5',
    },
    lg: {
      text: 'text-3xl sm:text-4xl tracking-tight',
      ball: 'w-8 h-8 mx-0.5 -mt-1',
    },
    hero: {
      text: 'text-5xl sm:text-7xl md:text-[5.4rem] tracking-tight leading-none',
      ball: 'w-11 h-11 sm:w-16 sm:h-16 md:w-[4.5rem] md:h-[4.5rem] mx-1 -mt-1.5',
    },
  }[size];

  return (
    <span
      className={`inline-flex items-center font-wide font-black text-white select-none ${sizeStyles.text} ${className}`}
    >
      <span>Sc</span>
      <SoccerBallO className={sizeStyles.ball} />
      <span>recer</span>
    </span>
  );
};
