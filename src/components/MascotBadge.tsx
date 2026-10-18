import React from 'react';

interface MascotBadgeProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

export const MascotBadge: React.FC<MascotBadgeProps> = ({ 
  size = 'md', 
  showTagline = false,
  className = '' 
}) => {
  const sizeMap = {
    sm: { container: 'w-10 h-10', text: 'text-xs', crown: 'w-3 h-3' },
    md: { container: 'w-14 h-14', text: 'text-sm', crown: 'w-4 h-4' },
    lg: { container: 'w-24 h-24', text: 'text-lg', crown: 'w-6 h-6' },
    xl: { container: 'w-36 h-36', text: 'text-xl', crown: 'w-8 h-8' }
  };

  const current = sizeMap[size];

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <div className={`relative ${current.container} flex items-center justify-center rounded-2xl bg-[#091124] p-0.5 border border-[#E5B842]/50 shadow-xl shadow-[#E5B842]/20 overflow-hidden group`}>
        {/* Outer glowing ring */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#E5B842]/20 via-transparent to-[#00F0FF]/20 opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none" />
        
        {/* Official Nile Mascot Logo Image */}
        <img 
          src="/assets/branding/nile-official-logo.png" 
          alt="Nile Official Mascot Emblem" 
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain rounded-xl relative z-10 transition-transform group-hover:scale-105"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/logo.png';
          }}
        />
        {/* Mini Gold crown top pin */}
        <div className="absolute -top-1.5 -right-1 px-1.5 py-0.5 rounded-full bg-[#E5B842] text-[#070D1B] text-[9px] font-black tracking-wider uppercase shadow">
          N
        </div>
      </div>

      {showTagline && (
        <div className="mt-2 text-center">
          <div className="text-[11px] font-bold tracking-widest text-[#E5B842] uppercase">
            NILE ECOSYSTEM
          </div>
          <div className="text-[9px] text-slate-400 tracking-wider">
            HUNT OPPORTUNITIES. BUILD WEALTH.
          </div>
        </div>
      )}
    </div>
  );
};
