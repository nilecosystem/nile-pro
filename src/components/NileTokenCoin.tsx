import React from 'react';

interface NileTokenCoinProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  animate?: boolean;
  showTicker?: boolean;
  className?: string;
}

export const NileTokenCoin: React.FC<NileTokenCoinProps> = ({
  size = 'md',
  animate = false,
  showTicker = false,
  className = ''
}) => {
  const sizeMap = {
    xs: {
      outer: 'w-5 h-5',
      inner: 'w-4 h-4',
      glow: 'blur-xs',
      ticker: 'text-[9px]'
    },
    sm: {
      outer: 'w-8 h-8',
      inner: 'w-7 h-7',
      glow: 'blur-sm',
      ticker: 'text-[10px]'
    },
    md: {
      outer: 'w-12 h-12',
      inner: 'w-10 h-10',
      glow: 'blur-md',
      ticker: 'text-xs'
    },
    lg: {
      outer: 'w-16 h-16',
      inner: 'w-14 h-14',
      glow: 'blur-lg',
      ticker: 'text-sm'
    },
    xl: {
      outer: 'w-24 h-24',
      inner: 'w-20 h-20',
      glow: 'blur-xl',
      ticker: 'text-base'
    },
    hero: {
      outer: 'w-36 h-36 sm:w-44 sm:h-44',
      inner: 'w-32 h-32 sm:w-40 sm:h-40',
      glow: 'blur-2xl',
      ticker: 'text-lg'
    }
  };

  const current = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      <div className={`relative ${current.outer} flex items-center justify-center shrink-0 group`}>
        {/* Ambient Gold Radial Glow */}
        <div 
          className={`absolute inset-0 rounded-full bg-gradient-to-tr from-[#E5B842]/40 via-[#F3BA2F]/30 to-cyan-400/20 ${current.glow} opacity-75 group-hover:opacity-100 transition-opacity`} 
        />

        {/* 3D Coin Outer Metallic Gold Rim */}
        <div className={`relative ${current.inner} rounded-full p-[2px] bg-gradient-to-b from-[#FFF2A3] via-[#E5B842] to-[#8C6200] shadow-xl shadow-[#E5B842]/20 flex items-center justify-center ${
          animate ? 'animate-bounce duration-[4000ms]' : ''
        }`}>
          {/* Inner Coin Trench & Dark Obsidian Core */}
          <div className="w-full h-full rounded-full bg-gradient-to-br from-[#0C152B] via-[#070D1B] to-[#040812] p-1 flex items-center justify-center overflow-hidden border border-[#E5B842]/40 relative">
            {/* Specular Diagonal Light Sheen */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-60 pointer-events-none" />

            {/* Official 3D Embossed Golden Emblem */}
            <img 
              src="/assets/branding/nile-token-coin.png" 
              alt="Official NILE Token Coin" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain rounded-full filter drop-shadow-[0_2px_8px_rgba(229,184,66,0.6)] transform group-hover:scale-105 transition-transform" 
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/assets/branding/nile-official-logo.png';
              }}
            />
          </div>
        </div>
      </div>

      {showTicker && (
        <span className={`${current.ticker} font-black text-white tracking-wider flex items-center gap-1`}>
          <span>NILE</span>
          <span className="text-[#E5B842] text-[10px] font-bold">TOKEN</span>
        </span>
      )}
    </div>
  );
};
