import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function HeroSection() {
  const { t, user, setIsDashboardOpen, setIsAuthModalOpen, setAuthMode } = useAuth();

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background Gradients & Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-nile-accent/20 via-cyan-500/15 to-transparent blur-[140px] pointer-events-none -z-10 rounded-full" />
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-emerald-600/10 blur-[120px] pointer-events-none -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline, Subtext, CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left rtl:text-right">
            
            {/* Institutional Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-nile-accent/30 text-nile-accent text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-nile-accent animate-ping" />
              <span>{t.hero.badge}</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15] mb-6">
              Nile Investment — <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-nile-accent via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                Build Your Digital Wealth Ecosystem
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl font-normal">
              {t.hero.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-12">
              <a
                href="#presale"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 via-nile-accent to-emerald-500 text-nile-950 hover:brightness-110 transition-all shadow-lg shadow-amber-400/20 hover:shadow-nile-accent/40 flex items-center justify-center gap-2"
              >
                <span>🔥</span>
                <span>پیش‌فروش توکن NILE ($0.005)</span>
              </a>

              <button
                onClick={() => {
                  if (user) {
                    setIsDashboardOpen(true);
                  } else {
                    setAuthMode('login');
                    setIsAuthModalOpen(true);
                  }
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm glass-panel text-slate-200 hover:text-white hover:border-nile-accent/40 transition-all flex items-center justify-center gap-2"
              >
                <span>📊</span>
                <span>{t.hero.ctaDashboard}</span>
              </button>

              <a
                href="#reserves"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm text-cyan-300 hover:text-white transition-colors flex items-center justify-center gap-1.5"
              >
                <span>🛡️</span>
                <span>پشتوانه‌ها و خزانه‌ها</span>
              </a>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-slate-800/80 w-full">
              <div>
                <div className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">$2.4B+</div>
                <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">{t.hero.statVolume}</div>
              </div>
              <div>
                <div className="text-2xl lg:text-3xl font-extrabold text-nile-accent tracking-tight">150+</div>
                <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">{t.hero.statInstitutions}</div>
              </div>
              <div>
                <div className="text-2xl lg:text-3xl font-extrabold text-cyan-400 tracking-tight">0.02s</div>
                <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">{t.hero.statExecution}</div>
              </div>
              <div>
                <div className="text-2xl lg:text-3xl font-extrabold text-emerald-400 tracking-tight">100%</div>
                <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">{t.hero.statAudited}</div>
              </div>
            </div>

          </div>

          {/* Right Column: Animated Dashboard Preview, Wallet Mockup & Mascot Emblem */}
          <div className="lg:col-span-5 relative">
            
            {/* Mascot Emblem Card */}
            <div className="glass-panel rounded-3xl p-6 shadow-2xl border border-white/10 relative overflow-hidden">
              
              {/* Mascot Image & Title Header */}
              <div className="flex items-center gap-4 pb-5 border-b border-white/10 mb-5">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-nile-accent/30 overflow-hidden shrink-0 shadow-lg shadow-nile-accent/20">
                  <img
                    src="/assets/branding/1000095276.jpg"
                    alt="NILE Crocodile Mascot"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">اکوسیستم نیل • ثروت دیجیتال</div>
                  <div className="text-xl font-black text-white tracking-tight">HUNT OPPORTUNITIES. BUILD WEALTH.</div>
                </div>
              </div>

              {/* Total Balance Snapshot */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/90 border border-white/5 mb-5">
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">ارزش کل دارایی‌ها (USDT + NILE)</div>
                  <div className="text-2xl font-black text-white tracking-tight mt-0.5">$1,245,892.50</div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  +12.4% این ماه
                </span>
              </div>

              {/* 4 Wallet Ledger Mini Cards */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-900/70 p-3.5 rounded-xl border border-white/5">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">کیف‌پول اصلی (Internal)</div>
                  <div className="text-sm font-bold text-white mt-1">$45,200.00 <span className="text-[10px] text-slate-400">USDT</span></div>
                </div>
                <div className="bg-slate-900/70 p-3.5 rounded-xl border border-white/5">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">توکن نیل (NILE Token)</div>
                  <div className="text-sm font-bold text-nile-accent mt-1">500,000 <span className="text-[10px] text-slate-400">NILE</span></div>
                </div>
              </div>

              {/* Action buttons mockup */}
              <div className="grid grid-cols-3 gap-2">
                <a
                  href="#presale"
                  className="py-2.5 text-xs font-bold bg-amber-400 text-nile-950 hover:bg-amber-300 rounded-xl text-center transition-colors shadow-md shadow-amber-400/20"
                >
                  پیش‌فروش BSC
                </a>
                <a
                  href="#reserves"
                  className="py-2.5 text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 rounded-xl text-center transition-colors border border-white/5"
                >
                  پشتوانه‌ها
                </a>
                <a
                  href="#plans"
                  className="py-2.5 text-xs font-semibold bg-nile-accent text-nile-950 hover:bg-emerald-400 rounded-xl text-center font-bold transition-colors"
                >
                  پلن‌های سرمایه
                </a>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
