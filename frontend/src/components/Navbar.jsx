import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, language, setLanguage, t, setIsAuthModalOpen, setAuthMode, setIsDashboardOpen, setIsAdminOpen } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const languages = [
    { code: 'fa', label: 'فارسی', flag: '🇮🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'zh', label: '中文 (简体)', flag: '🇨🇳' },
    { code: 'es', label: 'Español', flag: '🇪🇸' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo with Real Branding Artwork */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-white/10 overflow-hidden flex items-center justify-center shadow-lg shadow-nile-accent/20 group-hover:scale-105 transition-transform p-0.5">
              <img
                src="/assets/branding/4116da31-c39a-4191-8e2c-2f956de17429-1_all_21543.jpg"
                alt="Nile Ecosystem Mascot Emblem"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg sm:text-xl tracking-wider text-white flex items-center gap-1.5">
                NILE <span className="text-nile-accent text-xs font-semibold px-2 py-0.5 rounded-full bg-nile-accent/10 border border-nile-accent/30">INVESTMENT</span>
              </span>
              <span className="text-[10px] text-slate-400 tracking-widest uppercase">Ecosystem • BSC BEP20</span>
            </div>
          </a>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs font-bold text-slate-300">
            <a href="#presale" className="text-amber-300 hover:text-white transition-colors flex items-center gap-1 bg-amber-500/10 px-2.5 py-1.5 rounded-lg border border-amber-500/30">
              <span>🔥</span>
              <span>پیش‌فروش توکن</span>
            </a>
            <a href="#reserves" className="text-cyan-300 hover:text-white transition-colors flex items-center gap-1">
              <span>🛡️</span>
              <span>پشتوانه‌ها و خزانه‌ها</span>
            </a>
            <a href="#plans" className="hover:text-nile-accent transition-colors">{t.nav.invest}</a>
            <a href="#token" className="hover:text-nile-accent transition-colors flex items-center gap-1">
              <span>{t.nav.token}</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold">2×</span>
            </a>
            <a href="#marketplace" className="hover:text-nile-accent transition-colors flex items-center gap-1">
              <span>{t.nav.marketplace}</span>
              <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-bold">-۵۰٪</span>
            </a>
            <a href="#crypto-software" className="hover:text-nile-accent transition-colors flex items-center gap-1 text-emerald-400">
              <span>💻</span>
              <span>نیل کریپتو سافت‌ویر</span>
            </a>
            <a href="#offices" className="hover:text-nile-accent transition-colors">{t.nav.offices}</a>
          </div>

          {/* Actions & Language Selector */}
          <div className="flex items-center gap-3">
            
            {/* Language Dropdown */}
            <div className="relative group">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-slate-900/90 text-slate-200 text-xs font-semibold px-2.5 py-2 rounded-lg border border-slate-700/80 focus:outline-none focus:border-nile-accent cursor-pointer hover:bg-slate-800 transition-colors"
              >
                {languages.map(l => (
                  <option key={l.code} value={l.code} className="bg-slate-900 text-white">
                    {l.flag} {l.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Auth Actions */}
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsDashboardOpen(true)}
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-nile-accent to-emerald-500 text-nile-950 hover:brightness-110 transition-all shadow-md shadow-nile-accent/20 flex items-center gap-1.5"
                >
                  <span>📊</span>
                  <span>داشبورد من</span>
                </button>
                {user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' ? (
                  <button
                    onClick={() => setIsAdminOpen(true)}
                    className="px-3 py-2 text-xs font-bold rounded-lg bg-purple-600/30 text-purple-300 border border-purple-500/40 hover:bg-purple-600/40 transition-colors flex items-center gap-1"
                  >
                    <span>🛡️</span>
                    <span>{t.nav.admin}</span>
                  </button>
                ) : null}
                <button
                  onClick={logout}
                  className="p-2 text-xs text-slate-400 hover:text-red-400 transition-colors"
                  title={t.nav.logout}
                >
                  🚪
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }}
                  className="px-3.5 py-2 text-xs font-semibold rounded-lg text-slate-200 hover:text-white hover:bg-slate-800/80 transition-colors"
                >
                  ورود
                </button>
                <button
                  onClick={() => { setAuthMode('register'); setIsAuthModalOpen(true); }}
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-nile-accent text-nile-950 hover:bg-emerald-400 transition-all shadow-lg shadow-nile-accent/20"
                >
                  افتتاح حساب
                </button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 pt-2 border-t border-slate-800 flex flex-col gap-3 text-xs font-bold text-slate-300">
            <a href="#presale" onClick={() => setMobileMenuOpen(false)} className="text-amber-400">🔥 پیش‌فروش توکن NILE (BSC)</a>
            <a href="#reserves" onClick={() => setMobileMenuOpen(false)} className="text-cyan-400">🛡️ پشتوانه‌ها و ذخایر پلتفرم</a>
            <a href="#plans" onClick={() => setMobileMenuOpen(false)} className="hover:text-nile-accent">{t.nav.invest}</a>
            <a href="#token" onClick={() => setMobileMenuOpen(false)} className="hover:text-nile-accent">{t.nav.token} (۲× بوستر)</a>
            <a href="#marketplace" onClick={() => setMobileMenuOpen(false)} className="hover:text-nile-accent">{t.nav.marketplace} (تخفیف ۱۰-۵۰٪)</a>
            <a href="#offices" onClick={() => setMobileMenuOpen(false)} className="hover:text-nile-accent">{t.nav.offices}</a>
          </div>
        )}
      </div>
    </nav>
  );
}
