import React from 'react';

interface TadjmeelLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'gold' | 'dark' | 'light';
  showText?: boolean;
  className?: string;
}

export const TadjmeelLogo: React.FC<TadjmeelLogoProps> = ({
  size = 'md',
  variant = 'gold',
  showText = true,
  className = ''
}) => {
  const sizeMap = {
    sm: { icon: 34, title: 'text-sm', sub: 'text-[9px]' },
    md: { icon: 44, title: 'text-base', sub: 'text-[10px]' },
    lg: { icon: 56, title: 'text-xl', sub: 'text-xs' },
    xl: { icon: 84, title: 'text-3xl', sub: 'text-sm' },
  };

  const { icon, title, sub } = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Visual Medallion Badge */}
      <div 
        style={{ width: icon, height: icon }}
        className="relative shrink-0 rounded-full p-[2px] bg-gradient-to-br from-[#f5dfb3] via-[#d4b06a] to-[#a8823b] shadow-sm flex items-center justify-center overflow-hidden"
      >
        <div className="w-full h-full rounded-full bg-[#181714] flex items-center justify-center relative overflow-hidden">
          {/* Subtle concentric rings */}
          <div className="absolute inset-[3px] rounded-full border border-[#d4b06a]/30" />
          <div className="absolute inset-[6px] rounded-full border border-dashed border-[#d4b06a]/20" />
          
          {/* Logo vector icon: profile with tiara/crown and radiance star */}
          <svg
            viewBox="0 0 100 100"
            className="w-[82%] h-[82%] drop-shadow-sm"
            fill="none"
            stroke="url(#medallionGold)"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <defs>
              <linearGradient id="medallionGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF2D4" />
                <stop offset="40%" stopColor="#E2C17D" />
                <stop offset="80%" stopColor="#C49B4B" />
                <stop offset="100%" stopColor="#9C752B" />
              </linearGradient>
            </defs>
            {/* Tiara/crown */}
            <path d="M38 31 L44 23 L50 30 L56 20 L62 30 L68 23 L74 31" strokeWidth="2.5" />
            <circle cx="56" cy="18" r="1.5" fill="#E2C17D" stroke="none" />
            <circle cx="44" cy="21" r="1.2" fill="#E2C17D" stroke="none" />
            <circle cx="68" cy="21" r="1.2" fill="#E2C17D" stroke="none" />
            
            {/* Profile curve */}
            <path d="M42 34 C47 37 54 40 59 47 C62 51 63 55 61 58 C59 60 56 61 57 64 C58 66 61 67 59 71 C58 74 54 75 52 79 C49 84 53 89 56 94" strokeWidth="2.5" />
            
            {/* Eye */}
            <path d="M50 49 C52 52 56 52 58 49" strokeWidth="1.8" />
            
            {/* Petal halo */}
            <path d="M32 45 C24 57 26 73 38 82 C46 88 58 89 68 82 C77 75 79 59 72 46" strokeWidth="2" strokeOpacity="0.75" />
            
            {/* Radiance sparkle */}
            <path d="M72 38 L72 46 M68 42 L76 42" strokeWidth="1.6" />
          </svg>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span 
            className={`font-['Cinzel',serif] font-bold tracking-[0.18em] uppercase ${title} ${
              variant === 'light' ? 'text-white' : 'text-[#1d1c18]'
            }`}
          >
            Tadjmeel
          </span>
          <span 
            className={`font-['Plus_Jakarta_Sans',sans-serif] tracking-[0.24em] uppercase font-semibold mt-1 ${sub} ${
              variant === 'light' ? 'text-[#d8c39e]' : 'text-[#9c7836]'
            }`}
          >
            Aesthetic Medicine & Laser
          </span>
        </div>
      )}
    </div>
  );
};
