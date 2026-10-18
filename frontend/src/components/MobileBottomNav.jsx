import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function MobileBottomNav() {
  const { user, setIsDashboardOpen, setIsAuthModalOpen, setAuthMode } = useAuth();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-white/10 px-3 py-2">
      <div className="grid grid-cols-5 gap-1 text-center text-[10px] font-medium text-slate-400">
        
        <a href="#" className="flex flex-col items-center py-1 hover:text-white">
          <span className="text-lg">🏠</span>
          <span>صفحه اصلی</span>
        </a>

        <a href="#presale" className="flex flex-col items-center py-1 text-amber-400 font-bold">
          <span className="text-lg">🔥</span>
          <span>پیش‌فروش</span>
        </a>

        <a href="#plans" className="flex flex-col items-center py-1 hover:text-nile-accent">
          <span className="text-lg">📈</span>
          <span>سرمایه‌گذاری</span>
        </a>

        <button
          onClick={() => {
            if (user) setIsDashboardOpen(true);
            else { setAuthMode('login'); setIsAuthModalOpen(true); }
          }}
          className="flex flex-col items-center py-1 text-emerald-400 font-bold"
        >
          <span className="text-lg">💼</span>
          <span>کیف‌پول‌ها</span>
        </button>

        <a href="#marketplace" className="flex flex-col items-center py-1 hover:text-purple-400">
          <span className="text-lg">🛍️</span>
          <span>مارکت‌پلیس</span>
        </a>

      </div>
    </div>
  );
}
