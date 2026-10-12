import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function InvestmentPlansSection() {
  const { t, user, setIsDashboardOpen, setIsAuthModalOpen, setAuthMode } = useAuth();
  const [useNileBooster, setUseNileBooster] = useState(false);
  const [calcAmount, setCalcAmount] = useState(1000);
  const [selectedPlanTab, setSelectedPlanTab] = useState('TIERS'); // 'ASSET', 'LOCKED', 'TIERS'
  
  // Real-time Live Yield Counter State
  const [liveStreamedProfit, setLiveStreamedProfit] = useState(14.85230);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // Amount tiers calculation
  const getTierRate = (amt) => {
    if (amt >= 10000) return 12.0;
    if (amt >= 1000) return 6.0;
    if (amt >= 500) return 3.0;
    if (amt >= 100) return 1.5;
    if (amt >= 50) return 0.75;
    if (amt >= 10) return 0.25;
    return 0.0;
  };


  // Live yield ticking engine: updates every 100ms
  useEffect(() => {
    const rate = getTierRate(calcAmount);
    const effRate = useNileBooster ? rate * 2 : rate;
    const dailyProfit = (calcAmount * effRate) / 100;
    const profitPer100Ms = dailyProfit / 864000; // 864,000 increments of 100ms in 24 hours

    const interval = setInterval(() => {
      setLiveStreamedProfit(prev => prev + profitPer100Ms);
      setSecondsElapsed(s => s + 0.1);
    }, 100);

    return () => clearInterval(interval);
  }, [calcAmount, useNileBooster]);

  const baseRate = getTierRate(calcAmount);
  const effectiveRate = useNileBooster ? baseRate * 2 : baseRate;
  const dailyReturn = (calcAmount * effectiveRate) / 100;
  const monthlyReturn = dailyReturn * 30;

  const handleAction = () => {
    if (user) {
      setIsDashboardOpen(true);
    } else {
      setAuthMode('register');
      setIsAuthModalOpen(true);
    }
  };

  return (
    <section id="plans" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            Yield Generation
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 mb-4 tracking-tight">
            {t.plans.title}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            {t.plans.subtitle}
          </p>
        </div>

        {/* Global NILE 2x Double Booster Banner */}
        <div className="mb-14 glass-panel p-5 sm:p-6 rounded-2xl border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-nile-accent to-emerald-400 text-nile-950 font-black text-2xl flex items-center justify-center shrink-0">
              2×
            </div>
            <div>
              <div className="text-base font-bold text-white flex items-center gap-2">
                <span>{t.plans.nileBoosterBanner}</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Funding source rule: When investment principal originates from NILE Token, all daily rates and maturity rewards double automatically.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/90 px-4 py-2.5 rounded-xl border border-white/10 shrink-0">
            <span className="text-xs font-semibold text-slate-300">Simulate NILE 2× Multiplier</span>
            <button
              onClick={() => setUseNileBooster(!useNileBooster)}
              className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${useNileBooster ? 'bg-nile-accent justify-end' : 'bg-slate-700 justify-start'}`}
            >
              <div className="w-4 h-4 rounded-full bg-slate-950 shadow-md" />
            </button>
          </div>
        </div>

        {/* 3 Visual Plan Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          
          {/* PLAN 1 — Asset Based */}
          <div className="glass-panel glass-panel-hover rounded-3xl p-7 flex flex-col justify-between border-t-2 border-t-cyan-500 relative">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider px-2.5 py-1 rounded bg-cyan-500/10">
                  Plan 1
                </span>
                <span className="text-xs text-slate-400 font-medium">Flexible Term</span>
              </div>
              <h3 className="text-xl font-extrabold text-white mb-2">{t.plans.plan1_title}</h3>
              <p className="text-xs text-slate-400 mb-6">{t.plans.plan1_desc}</p>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-xs py-2 border-b border-white/5">
                  <span className="text-slate-400">USDT Quantum Pool</span>
                  <span className="font-bold text-white">{useNileBooster ? '2.40%' : '1.20%'} / day</span>
                </div>
                <div className="flex justify-between text-xs py-2 border-b border-white/5">
                  <span className="text-slate-400">ETH Guardian Pool</span>
                  <span className="font-bold text-white">{useNileBooster ? '1.90%' : '0.95%'} / day</span>
                </div>
                <div className="flex justify-between text-xs py-2 border-b border-white/5">
                  <span className="text-slate-400">BTC Reserve Vault</span>
                  <span className="font-bold text-white">{useNileBooster ? '1.70%' : '0.85%'} / day</span>
                </div>
                <div className="flex justify-between text-xs py-2 border-b border-white/5">
                  <span className="text-slate-400">Entry / Exit Rules</span>
                  <span className="font-semibold text-emerald-400">Instant Daily Liquid</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleAction}
              className="w-full py-3 rounded-xl bg-slate-800 text-white hover:bg-slate-700 font-bold text-xs transition-colors border border-white/10"
            >
              Deploy Asset Plan
            </button>
          </div>

          {/* PLAN 2 — Time Locked */}
          <div className="glass-panel glass-panel-hover rounded-3xl p-7 flex flex-col justify-between border-t-2 border-t-amber-500 relative">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider px-2.5 py-1 rounded bg-amber-500/10">
                  Plan 2
                </span>
                <span className="text-xs text-slate-400 font-medium">30 / 50 / 100 Days</span>
              </div>
              <h3 className="text-xl font-extrabold text-white mb-2">{t.plans.plan2_title}</h3>
              <p className="text-xs text-slate-400 mb-6">{t.plans.plan2_desc}</p>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-xs py-2 border-b border-white/5">
                  <span className="text-slate-400">30-Day Lock Term</span>
                  <span className="font-bold text-amber-300">+{useNileBooster ? '50%' : '25%'} Reward</span>
                </div>
                <div className="flex justify-between text-xs py-2 border-b border-white/5">
                  <span className="text-slate-400">50-Day Strategic Lock</span>
                  <span className="font-bold text-amber-300">+{useNileBooster ? '110%' : '55%'} Reward</span>
                </div>
                <div className="flex justify-between text-xs py-2 border-b border-white/5">
                  <span className="text-slate-400">100-Day Dynasty Lock</span>
                  <span className="font-bold text-amber-300">+{useNileBooster ? '280%' : '140%'} Reward</span>
                </div>
                <div className="flex justify-between text-xs py-2 border-b border-white/5">
                  <span className="text-slate-400">Principal Rule</span>
                  <span className="font-semibold text-slate-300">Locked to Maturity</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleAction}
              className="w-full py-3 rounded-xl bg-slate-800 text-white hover:bg-slate-700 font-bold text-xs transition-colors border border-white/10"
            >
              Lock Capital
            </button>
          </div>

          {/* PLAN 3 — Amount Tiers (Featured) */}
          <div className="glass-panel glass-panel-hover rounded-3xl p-7 flex flex-col justify-between border-2 border-nile-accent/40 shadow-xl shadow-nile-accent/10 relative">
            <div className="absolute -top-3.5 right-6 px-3 py-1 bg-gradient-to-r from-nile-accent to-emerald-400 text-nile-950 text-[10px] font-extrabold uppercase rounded-full">
              Most Popular Tier
            </div>
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-nile-accent uppercase tracking-wider px-2.5 py-1 rounded bg-nile-accent/10">
                  Plan 3
                </span>
                <span className="text-xs text-emerald-400 font-medium">Daily Engine</span>
              </div>
              <h3 className="text-xl font-extrabold text-white mb-2">{t.plans.plan3_title}</h3>
              <p className="text-xs text-slate-400 mb-6">{t.plans.plan3_desc}</p>

              <div className="space-y-2 mb-6 text-xs">
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">10 USDT</span>
                  <span className="font-bold text-white">{useNileBooster ? '0.50%' : '0.25%'} / day</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">50 USDT</span>
                  <span className="font-bold text-white">{useNileBooster ? '1.50%' : '0.75%'} / day</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">100 USDT</span>
                  <span className="font-bold text-white">{useNileBooster ? '3.00%' : '1.50%'} / day</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">500 USDT</span>
                  <span className="font-bold text-white">{useNileBooster ? '6.00%' : '3.00%'} / day</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">1,000 USDT</span>
                  <span className="font-bold text-white">{useNileBooster ? '12.00%' : '6.00%'} / day</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400 font-bold text-emerald-400">10,000 USDT (Apex)</span>
                  <span className="font-extrabold text-emerald-400">{useNileBooster ? '24.00%' : '12.00%'} / day</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleAction}
              className="w-full py-3 rounded-xl bg-nile-accent text-nile-950 hover:bg-emerald-400 font-bold text-xs transition-colors shadow-lg shadow-nile-accent/20"
            >
              Start Tier Investment
            </button>
          </div>

        </div>

        {/* Interactive Return Calculator */}
        <div className="glass-panel p-8 rounded-3xl border border-white/10 max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <div>
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                <span>🧮</span>
                <span>{t.plans.calculator} (Amount Tiers)</span>
              </h4>
              <p className="text-xs text-slate-400">Test daily earnings with the algorithmic profit calculation engine.</p>
            </div>
            {useNileBooster && (
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                2× Double Booster Applied
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Deposit Principal: <span className="text-nile-accent font-extrabold text-base">${calcAmount} USDT</span>
              </label>
              <input
                type="range"
                min="10"
                max="10000"
                step="10"
                value={calcAmount}
                onChange={(e) => setCalcAmount(parseFloat(e.target.value))}
                className="w-full accent-nile-accent h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-mono">
                <span>$10</span>
                <span>$500</span>
                <span>$1,000</span>
                <span>$5,000</span>
                <span>$10,000</span>
              </div>
            </div>

            <div className="space-y-3">
              {/* LIVE YIELD TICKER BANNER */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-emerald-500/30 shadow-inner flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">جریان سود زنده (Live Yield Accrual)</span>
                    <span className="text-base font-mono font-black text-emerald-400">
                      ${liveStreamedProfit.toFixed(5)} USDT
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-2 py-1 rounded border border-white/5">
                  +${((calcAmount * effectiveRate / 100) / 86400).toFixed(6)}/ثانیه
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 bg-slate-900/90 p-4 rounded-2xl border border-white/5 text-center">
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Daily Rate</div>
                  <div className="text-lg font-black text-white mt-1">{effectiveRate.toFixed(2)}%</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Daily Payout</div>
                  <div className="text-lg font-black text-nile-accent mt-1">${dailyReturn.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Est. Monthly</div>
                  <div className="text-lg font-black text-emerald-400 mt-1">${monthlyReturn.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
