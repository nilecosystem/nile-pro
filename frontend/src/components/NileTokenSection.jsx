import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function NileTokenSection() {
  const { t, user, setIsDashboardOpen, setIsAuthModalOpen, setAuthMode } = useAuth();
  const [stakeAmount, setStakeAmount] = useState(5000);
  const [selectedLock, setSelectedLock] = useState(50); // 30, 50, 100

  const lockMultipliers = {
    30: { bonus: 50, label: '30 Days' },
    50: { bonus: 100, label: '50 Days' },
    100: { bonus: 250, label: '100 Days' }
  };

  const selectedTier = lockMultipliers[selectedLock];
  const bonusReward = (stakeAmount * selectedTier.bonus) / 100;
  const totalMaturityPayout = stakeAmount + bonusReward;

  const handleAction = () => {
    if (user) {
      setIsDashboardOpen(true);
    } else {
      setAuthMode('register');
      setIsAuthModalOpen(true);
    }
  };

  return (
    <section id="token" className="py-24 relative border-t border-slate-800/80 bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-nile-accent px-3 py-1 rounded-full bg-nile-accent/10 border border-nile-accent/20">
            Native Utility Token
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 mb-4 tracking-tight">
            {t.token.title}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            {t.token.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left: 2x Double Reward Mechanism & Tokenomics */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="glass-panel p-7 rounded-3xl border border-nile-accent/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-nile-accent/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">⚡</span>
                <h3 className="text-xl font-extrabold text-white">{t.token.doubleRuleTitle}</h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed font-normal mb-5">
                {t.token.doubleRuleDesc}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs">
                <div>
                  <span className="text-slate-400">Token Symbol:</span>
                  <div className="text-base font-bold text-white mt-0.5">NILE (ERC20 / BEP20)</div>
                </div>
                <div>
                  <span className="text-slate-400">Presale Value:</span>
                  <div className="text-base font-bold text-nile-accent mt-0.5">$0.005 USDT</div>
                </div>
                <div>
                  <span className="text-slate-400">Listing Target:</span>
                  <div className="text-base font-bold text-emerald-400 mt-0.5">$0.50 (100× Target)</div>
                </div>
                <div>
                  <span className="text-slate-400">Marketplace Utility:</span>
                  <div className="text-base font-bold text-white mt-0.5">2% – 5% Discount</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="glass-panel p-4 rounded-2xl">
                <div className="text-lg font-black text-nile-accent">0%</div>
                <div className="text-[11px] text-slate-400 mt-1">Platform Gas Fees</div>
              </div>
              <div className="glass-panel p-4 rounded-2xl">
                <div className="text-lg font-black text-white">DAO</div>
                <div className="text-[11px] text-slate-400 mt-1">Governance Rights</div>
              </div>
              <div className="glass-panel p-4 rounded-2xl">
                <div className="text-lg font-black text-emerald-400">100%</div>
                <div className="text-[11px] text-slate-400 mt-1">Audited Liquidity</div>
              </div>
            </div>

          </div>

          {/* Right: Interactive Staking Pools Preview */}
          <div className="lg:col-span-6">
            <div className="glass-panel rounded-3xl p-8 border border-white/10 shadow-2xl relative">
              <h3 className="text-xl font-extrabold text-white mb-2">{t.token.stakingTitle}</h3>
              <p className="text-xs text-slate-400 mb-6">
                Commit NILE tokens into high-yield algorithmic staking smart contracts with guaranteed maturity returns.
              </p>

              {/* Staking Lock Days Selector (30 / 50 / 100) */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[30, 50, 100].map((days) => (
                  <button
                    key={days}
                    onClick={() => setSelectedLock(days)}
                    className={`py-3 px-2 rounded-xl text-xs font-bold transition-all border ${
                      selectedLock === days
                        ? 'bg-nile-accent text-nile-950 border-nile-accent shadow-lg shadow-nile-accent/20'
                        : 'bg-slate-900/80 text-slate-300 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div>{days} Days</div>
                    <div className="text-[11px] opacity-90 mt-0.5">+{lockMultipliers[days].bonus}% Bonus</div>
                  </button>
                ))}
              </div>

              {/* Stake Amount Slider */}
              <div className="mb-6">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-slate-300 font-semibold">Staking Amount:</span>
                  <span className="text-nile-accent font-extrabold text-sm">{stakeAmount.toLocaleString()} NILE</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="100000"
                  step="1000"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(parseFloat(e.target.value))}
                  className="w-full accent-nile-accent h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Projected Yield Summary */}
              <div className="bg-slate-900/90 rounded-2xl p-4 border border-white/5 mb-6 space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Lock Period:</span>
                  <span className="font-bold text-white">{selectedTier.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Bonus Percentage:</span>
                  <span className="font-bold text-emerald-400">+{selectedTier.bonus}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Reward Yield:</span>
                  <span className="font-bold text-nile-accent">+{bonusReward.toLocaleString()} NILE</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/10 text-sm">
                  <span className="font-bold text-slate-200">Total Return at Maturity:</span>
                  <span className="font-extrabold text-white">{totalMaturityPayout.toLocaleString()} NILE</span>
                </div>
              </div>

              <button
                onClick={handleAction}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-nile-accent to-emerald-500 text-nile-950 font-bold text-xs hover:brightness-110 transition-all shadow-lg shadow-nile-accent/25"
              >
                {t.token.btnStake}
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
