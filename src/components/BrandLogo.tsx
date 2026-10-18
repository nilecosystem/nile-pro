import React from 'react';

interface BrandLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = false,
  className = ''
}) => {
  const sizeMap = {
    xs: { img: 'w-6 h-6', text: 'text-sm' },
    sm: { img: 'w-8 h-8', text: 'text-base' },
    md: { img: 'w-10 h-10', text: 'text-lg' },
    lg: { img: 'w-14 h-14', text: 'text-xl' },
    xl: { img: 'w-20 h-20', text: 'text-2xl' }
  };

  const current = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div className={`relative ${current.img} rounded-xl overflow-hidden shadow-md shadow-[#E5B842]/10 border border-[#E5B842]/40 bg-[#070D1B] shrink-0`}>
        <img 
          src="/assets/branding/nile-official-logo.png" 
          alt="Nile Ecosystem Official Logo" 
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain p-0.5 rounded-lg" 
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/logo.png';
          }}
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`${current.text} font-black tracking-wider text-white font-sans`}>
              NILE
            </span>
            <span className="text-[10px] font-bold text-[#E5B842] tracking-widest uppercase">
              ECOSYSTEM
            </span>
          </div>
          <span className="text-[10px] text-slate-400 tracking-tight hidden sm:block">
            The Unified Digital Finance Ecosystem
          </span>
        </div>
      )}
    </div>
  );
};
