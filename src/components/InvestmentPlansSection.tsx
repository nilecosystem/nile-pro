import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { NileTokenCoin } from './NileTokenCoin.tsx';
import { RoiGrowthChart } from './RoiGrowthChart.tsx';
import { 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Calculator, 
  Flame, 
  Lock, 
  CheckCircle, 
  AlertCircle,
  Zap,
  ArrowRight,
  Percent,
  Layers,
  Coins,
  BarChart3
} from 'lucide-react';

export const InvestmentPlansSection: React.FC = () => {
  const { showToast, addTransaction, investmentPlansConfig } = useApp();

  const [activeTab, setActiveTab] = useState<'plan1' | 'plan2' | 'plan3' | 'ultimate' | 'surprise'>('ultimate');
  const [hasNileBooster, setHasNileBooster] = useState(false); // 1,000,000 NILE Staking Multiplier

  // Calculator State
  const [calcPlan, setCalcPlan] = useState<'plan1' | 'plan2' | 'plan3' | 'ultimate' | 'surprise'>('ultimate');
  const [calcAsset, setCalcAsset] = useState<string>('USDT');
  const [calcPrincipal, setCalcPrincipal] = useState<number>(5000);
  const [calcDuration, setCalcDuration] = useState<string>('30d');
  const [streamingProfit, setStreamingProfit] = useState<number>(0);

  // Live 100ms Streaming Profit Counter (+0.006944 USDT / sec => +0.0006944 per 100ms)
  useEffect(() => {
    const timer = setInterval(() => {
      setStreamingProfit(prev => prev + 0.0006944);
    }, 100);
    return () => clearInterval(timer);
  }, []);

  // Ultimate Plan Horizons
  const ULTIMATE_HORIZONS = [
    { key: 'daily', label: 'Daily Liquidity', rate: 5.0, days: 1, desc: 'Immediate daily liquidity' },
    { key: 'monthly', label: 'Monthly (30 Days)', rate: 50.0, days: 30, desc: 'Compounded 30-day settlement' },
    { key: '3m', label: '3 Months (90 Days)', rate: 500.0, days: 90, desc: 'Apex quarterly growth' },
    { key: '6m', label: '6 Months (180 Days)', rate: 5000.0, days: 180, desc: 'Locked for allocations ≥ $2,000 USDT' },
    { key: '1y', label: '1 Year (365 Days)', rate: 50000.0, days: 365, desc: 'Institutional treasury lock ≥ $2,000 USDT' }
  ];

  // Calculate projected return rate from Admin config
  const getPlanRatePercent = () => {
    if (calcPlan === 'plan1') {
      const cfg = investmentPlansConfig.plan1AssetBased;
      const dailyRate = calcAsset === 'USDT' ? cfg.usdtDailyRate : calcAsset === 'ETH' ? cfg.ethDailyRate : cfg.btcDailyRate;
      const days = calcDuration === 'daily' ? 1 : calcDuration === '30d' ? 30 : calcDuration === '3m' ? 90 : calcDuration === '6m' ? 180 : 365;
      return dailyRate * days;
    } else if (calcPlan === 'plan2') {
      const cfg = investmentPlansConfig.plan2TimeLocked;
      return calcDuration === '30d' ? cfg.lock30DaysRate : calcDuration === '50d' ? cfg.lock50DaysRate : cfg.lock100DaysRate;
    } else if (calcPlan === 'plan3') {
      const cfg = investmentPlansConfig.plan3AmountTiers;
      const dailyRate = calcPrincipal >= cfg.apexThresholdUsd ? cfg.apexRate : calcPrincipal >= 5000 ? cfg.eliteRate : calcPrincipal >= 1000 ? cfg.growthRate : cfg.microRate;
      const days = calcDuration === 'daily' ? 1 : calcDuration === '30d' ? 30 : calcDuration === '3m' ? 90 : calcDuration === '6m' ? 180 : 365;
      return dailyRate * days;
    } else if (calcPlan === 'ultimate') {
      const match = ULTIMATE_HORIZONS.find(h => h.key === calcDuration) || ULTIMATE_HORIZONS[1];
      return match.rate;
    } else {
      // 90-Day Surprise Campaign
      const cfg = investmentPlansConfig.surpriseCampaign;
      return calcDuration === 'weekly' ? cfg.weeklyPayoutPercent : calcDuration === 'monthly' ? cfg.monthlyPayoutPercent : cfg.threeMonthSettlementPercent;
    }
  };

  const planBaseRatePercent = getPlanRatePercent();
  const boosterMultiplier = hasNileBooster ? (calcPlan === 'ultimate' ? (investmentPlansConfig.ultimatePlan.nileBoosterMultiplier || 1.5) : (investmentPlansConfig.plan2TimeLocked.boosterMultiplier || 2.0)) : 1.0;
  const netReturn = calcPrincipal * (planBaseRatePercent / 100) * boosterMultiplier;
  const totalPayout = calcPrincipal + netReturn;

  const handleCommitCapital = () => {
    if (calcPlan === 'ultimate' && calcPrincipal < (investmentPlansConfig.ultimatePlan.minDepositUsd || 2000)) {
      showToast(`Minimum allocation for the ULTIMATE plan is $${investmentPlansConfig.ultimatePlan.minDepositUsd || 2000} USDT equivalent`, 'error');
      return;
    }
    if (calcPlan === 'ultimate' && calcPrincipal > (investmentPlansConfig.ultimatePlan.maxDepositUsd || 100000)) {
      showToast(`Maximum allocation for the ULTIMATE plan is $${investmentPlansConfig.ultimatePlan.maxDepositUsd || 100000} USDT per investor`, 'error');
      return;
    }
    showToast(`Successfully registered commitment for $${calcPrincipal.toLocaleString()} ${calcAsset}!`, 'success');
  };

  return (
    <div id="plans" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#E5B842] font-mono">
              Institutional Yield Engine
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            NILE Investment Frameworks
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Choose from five enterprise investment frameworks backed by the 100% Institutional Guarantee of NILE Ecosystem Ltd. 
            Activate the 1,000,000 NILE Staking Multiplier for up to 5× yield boosts.
          </p>
        </div>

        {/* 1,000,000 NILE Booster Toggle Capsule */}
        <div 
          onClick={() => setHasNileBooster(!hasNileBooster)}
          className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 shrink-0 ${
            hasNileBooster 
              ? 'bg-[#E5B842]/10 border-[#E5B842] shadow-lg shadow-[#E5B842]/20' 
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <NileTokenCoin size="sm" animate={hasNileBooster} />
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>1,000,000 NILE Multiplier</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                hasNileBooster ? 'bg-[#E5B842] text-[#070D1B]' : 'bg-slate-800 text-slate-400'
              }`}>
                {hasNileBooster ? 'ACTIVE 1.5× - 5×' : 'INACTIVE'}
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              {hasNileBooster ? 'Boost enabled across all plans' : 'Click to simulate 1M NILE booster'}
            </div>
          </div>
        </div>
      </div>

      {/* Plan Framework Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { key: 'ultimate', label: 'Plan 4: ULTIMATE Plan', tag: 'Flagship 50,000%' },
          { key: 'surprise', label: 'NILE 90-Day Campaign', tag: 'Surprise Yields' },
          { key: 'plan1', label: 'Plan 1: Asset Based', tag: 'Liquid Daily' },
          { key: 'plan2', label: 'Plan 2: Time Locked', tag: '30d - 100d' },
          { key: 'plan3', label: 'Plan 3: Amount Tiers', tag: 'Up to 24%/day' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key as any);
              setCalcPlan(tab.key as any);
            }}
            className={`px-4 py-3 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 border cursor-pointer ${
              activeTab === tab.key
                ? 'bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] border-[#E5B842] shadow-lg shadow-[#E5B842]/20 font-black'
                : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
              activeTab === tab.key ? 'bg-[#070D1B]/20 text-[#070D1B]' : 'bg-slate-800 text-[#E5B842]'
            }`}>
              {tab.tag}
            </span>
          </button>
        ))}
      </div>

      {/* Plan Details & Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Plan Showcase Cards): 7 Cols */}
        <div className="lg:col-span-7 space-y-6">
          {activeTab === 'ultimate' && (
            <div className="p-6 sm:p-7 rounded-3xl bg-[#091124]/90 backdrop-blur-md border-2 border-[#E5B842]/50 shadow-2xl space-y-5">
              {/* Plan 4 Flagship 3D Finance Photography */}
              <div className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden border border-[#E5B842]/40 shadow-xl group">
                <img 
                  src="/assets/plans/plan-ultimate-flagship.png" 
                  alt="Plan 4 ULTIMATE Flagship Vault" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#091124] via-transparent to-transparent opacity-75" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-[#E5B842]/40 text-[#E5B842] font-mono font-bold">
                    Vault Capacity: $1M Cap / 100 Investors
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-emerald-400 font-mono font-bold">
                    Max +50,000% APY
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-bold uppercase tracking-wider">
                    Institutional Tier-1
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                    Plan 4 — ULTIMATE Plan
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    High-conviction structured liquidity deployed across verified multi-chain treasury vaults.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Capacity Limit</span>
                  <div className="text-xs font-bold text-amber-400 font-mono">100 Investors / $1M Cap</div>
                </div>
              </div>

              {/* Supported Assets Badges */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-400 font-bold uppercase">Supported Assets:</span>
                <div className="flex flex-wrap gap-1.5">
                  {['BTC', 'TRON (TRC20/BEP20)', 'ETH (ERC20/ARB/BEP20)', 'XRP', 'SOL', 'BNB', 'USDT', 'BCH'].map(asset => (
                    <span key={asset} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono font-bold text-slate-200">
                      {asset}
                    </span>
                  ))}
                </div>
              </div>

              {/* Yield Horizons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {ULTIMATE_HORIZONS.map((h) => (
                  <div 
                    key={h.key}
                    onClick={() => setCalcDuration(h.key)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      calcDuration === h.key
                        ? 'bg-slate-900 border-[#E5B842] shadow-md shadow-[#E5B842]/10'
                        : 'bg-[#070D1B] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{h.label}</span>
                      <span className="text-[#E5B842] font-mono font-black text-sm">
                        +{h.rate.toLocaleString()}%
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">{h.desc}</div>
                  </div>
                ))}
              </div>

              {/* Rules & Guarantees */}
              <div className="p-4 rounded-2xl bg-[#060B17] border border-slate-800/80 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2 font-bold text-white">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>100% Institutional Guarantee by NILE Ecosystem Ltd</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                  <div>Min Allocation: <strong className="text-white">$2,000 USDT</strong></div>
                  <div>Max Allocation: <strong className="text-white">$100,000 USDT</strong></div>
                  <div>Max Plans per User: <strong className="text-white">2 Active Plans</strong></div>
                  <div>1M NILE Multiplier: <strong className="text-[#E5B842]">1.5× Boost</strong></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'surprise' && (
            <div className="p-6 sm:p-7 rounded-3xl bg-[#091124] border-2 border-purple-500/50 shadow-2xl space-y-5">
              {/* Surprise Campaign 3D Finance Photography */}
              <div className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden border border-purple-500/40 shadow-xl group">
                <img 
                  src="/assets/plans/plan-surprise-campaign.png" 
                  alt="NILE 90-Day Ultimate Surprise Campaign" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#091124] via-transparent to-transparent opacity-75" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-purple-500/40 text-purple-300 font-mono font-bold">
                    Countdown: 90 Days Dynamic
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 backdrop-blur-md border border-purple-500/40 text-purple-300 font-mono font-bold">
                    Max +15,000% Yield
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20 font-bold uppercase tracking-wider">
                    Surprise Campaign
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                    NILE 90-Day Ultimate Surprise Campaign
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    90-day countdown timer begins strictly upon the first investor's confirmed deposit into each pool.
                  </p>
                </div>
                <Flame className="w-8 h-8 text-purple-400 animate-bounce" />
              </div>

              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Weekly Payout</div>
                  <div className="text-lg font-black text-purple-400 font-mono mt-1">+150%</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Monthly Payout</div>
                  <div className="text-lg font-black text-purple-400 font-mono mt-1">+1,500%</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400">3-Month Settlement</div>
                  <div className="text-lg font-black text-purple-400 font-mono mt-1">+15,000%</div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="font-bold text-white">5 Participating Campaign Assets & Caps:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-slate-300">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">NILE Token (Min $2K, No Max)</div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">Gold XAUt / PAXG (0.5 to 1,000 oz)</div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">ETC (30 to 1,000 ETC, 1M Cap)</div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">BCH (10 to 1,000 BCH, 1M Cap)</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'plan1' && (
            <div className="p-6 sm:p-7 rounded-3xl bg-[#091124] border border-slate-800 shadow-xl space-y-4">
              {/* Plan 1 3D Finance Photography */}
              <div className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden border border-emerald-500/40 shadow-xl group">
                <img 
                  src="/assets/plans/plan-asset-based.png" 
                  alt="Plan 1 Asset Based Yield Strategy" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#091124] via-transparent to-transparent opacity-75" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-emerald-500/40 text-emerald-300 font-mono font-bold">
                    Daily Liquid Settlement
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-emerald-400 font-mono font-bold">
                    USDT 1.95% / day
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-black text-white">Plan 1 — Asset Based</h3>
              <p className="text-xs text-slate-300">Liquid entry/exit with automatic daily payouts deposited to your liquid ledger.</p>
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="font-bold text-white">USDT</span>
                  <div className="text-lg font-black text-emerald-400 font-mono mt-1">1.95% / day</div>
                  <span className="text-[10px] text-slate-400">Daily Liquid</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="font-bold text-white">ETH</span>
                  <div className="text-lg font-black text-blue-400 font-mono mt-1">0.95% / day</div>
                  <span className="text-[10px] text-slate-400">Daily Liquid</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="font-bold text-white">BTC</span>
                  <div className="text-lg font-black text-amber-400 font-mono mt-1">0.85% / day</div>
                  <span className="text-[10px] text-slate-400">Daily Liquid</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'plan2' && (
            <div className="p-6 sm:p-7 rounded-3xl bg-[#091124] border border-slate-800 shadow-xl space-y-4">
              {/* Plan 2 3D Finance Photography */}
              <div className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden border border-amber-500/40 shadow-xl group">
                <img 
                  src="/assets/plans/plan-time-locked.png" 
                  alt="Plan 2 Time Locked Capital Vault" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#091124] via-transparent to-transparent opacity-75" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-amber-500/40 text-amber-300 font-mono font-bold">
                    Lock Horizons: 30D - 100D
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-[#E5B842] font-mono font-bold">
                    Up to +280% with Booster
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-black text-white">Plan 2 — Time Locked</h3>
              <p className="text-xs text-slate-300">Higher yields for predictable lock periods. Principal returned at maturity.</p>
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="font-bold text-white">30-Day Lock</span>
                  <div className="text-lg font-black text-[#E5B842] font-mono mt-1">+25%</div>
                  <span className="text-[10px] text-emerald-400">+50% with booster</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="font-bold text-white">50-Day Lock</span>
                  <div className="text-lg font-black text-[#E5B842] font-mono mt-1">+55%</div>
                  <span className="text-[10px] text-emerald-400">+110% with booster</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="font-bold text-white">100-Day Dynasty</span>
                  <div className="text-lg font-black text-[#E5B842] font-mono mt-1">+140%</div>
                  <span className="text-[10px] text-emerald-400">+280% with booster</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'plan3' && (
            <div className="p-6 sm:p-7 rounded-3xl bg-[#091124] border border-slate-800 shadow-xl space-y-4">
              {/* Plan 3 3D Finance Photography */}
              <div className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden border border-[#E5B842]/40 shadow-xl group">
                <img 
                  src="/assets/plans/plan-amount-tiers.png" 
                  alt="Plan 3 Progressive Amount Tiers" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#091124] via-transparent to-transparent opacity-75" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-[#E5B842]/40 text-[#E5B842] font-mono font-bold">
                    Apex Tier: ≥ 10,000 USDT
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-emerald-400 font-mono font-bold">
                    Up to 24.0% / day
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-black text-white">Plan 3 — Progressive Amount Tiers</h3>
              <p className="text-xs text-slate-300">Scaling daily yields based on capital size.</p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span>Micro Tier (10 - 999 USDT):</span>
                  <span className="font-mono font-bold text-white">0.25% / day</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span>Growth Tier (1,000 - 4,999 USDT):</span>
                  <span className="font-mono font-bold text-emerald-400">3.5% / day</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span>Elite Tier (5,000 - 9,999 USDT):</span>
                  <span className="font-mono font-bold text-cyan-400">7.0% / day</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-[#E5B842]/50">
                  <span className="font-bold text-white">Apex Tier (≥ 10,000 USDT):</span>
                  <span className="font-mono font-bold text-[#E5B842]">12.0% / day (24.0% with booster)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (Multi-Plan Interactive Yield Calculator): 5 Cols */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 sm:p-7 rounded-3xl bg-[#091124] border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[#E5B842]" />
                <span className="text-sm font-black text-white">Interactive Yield Calculator</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Live Math
              </span>
            </div>

            {/* Continuous Streaming Profit Counter */}
            <div className="p-3.5 rounded-2xl bg-[#060B17] border border-slate-800/90 text-center space-y-1">
              <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                Real-Time Streaming Profit Accrual (+0.006944 USDT/sec)
              </div>
              <div className="text-xl font-black text-emerald-400 font-mono animate-pulse">
                +{streamingProfit.toFixed(6)} USDT
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-medium">Selected Plan Framework:</label>
                <select
                  value={calcPlan}
                  onChange={(e) => setCalcPlan(e.target.value as any)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-xs focus:outline-none"
                >
                  <option value="ultimate">Plan 4 — ULTIMATE Plan (Up to 50,000%)</option>
                  <option value="surprise">NILE 90-Day Surprise Campaign</option>
                  <option value="plan1">Plan 1 — Asset Based (Daily Liquid)</option>
                  <option value="plan2">Plan 2 — Time Locked (30d - 100d)</option>
                  <option value="plan3">Plan 3 — Amount Tiers (Up to 24%/day)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-medium">Allocation Principal:</label>
                <div className="relative mt-1">
                  <input
                    type="number"
                    value={calcPrincipal}
                    onChange={(e) => setCalcPrincipal(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold text-sm focus:outline-none"
                  />
                  <span className="absolute right-3 top-2 text-xs font-mono text-slate-400">USDT</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 font-medium">Asset:</label>
                  <select
                    value={calcAsset}
                    onChange={(e) => setCalcAsset(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-xs focus:outline-none"
                  >
                    <option value="USDT">USDT</option>
                    <option value="NILE">NILE</option>
                    <option value="BTC">BTC</option>
                    <option value="ETH">ETH</option>
                    <option value="SOL">SOL</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 font-medium">Duration:</label>
                  <select
                    value={calcDuration}
                    onChange={(e) => setCalcDuration(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-xs focus:outline-none"
                  >
                    <option value="daily">Daily Liquid</option>
                    <option value="30d">30 Days</option>
                    <option value="3m">3 Months (90d)</option>
                    <option value="6m">6 Months (180d)</option>
                    <option value="1y">1 Year (365d)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Circuit Breaker Pause Banner if Admin paused */}
            {((calcPlan === 'ultimate' && investmentPlansConfig.ultimatePlan.status === 'paused') ||
              (calcPlan === 'surprise' && investmentPlansConfig.surpriseCampaign.status === 'paused') ||
              (calcPlan === 'plan1' && investmentPlansConfig.plan1AssetBased.status === 'paused') ||
              (calcPlan === 'plan2' && investmentPlansConfig.plan2TimeLocked.status === 'paused') ||
              (calcPlan === 'plan3' && investmentPlansConfig.plan3AmountTiers.status === 'paused')) && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Notice: Payouts for this plan framework are currently paused by Platform Owner circuit breaker.</span>
              </div>
            )}

            {/* Dynamic Recharts Growth Curve */}
            <div className="pt-1">
              <RoiGrowthChart
                principal={calcPrincipal}
                durationKey={calcDuration}
                ratePercent={planBaseRatePercent * boosterMultiplier}
                planType={calcPlan}
                planName={calcPlan === 'ultimate' ? 'Plan 4 ULTIMATE' : calcPlan === 'surprise' ? '90-Day Surprise Campaign' : `Plan ${calcPlan}`}
                asset={calcAsset}
                boosterActive={hasNileBooster}
                height={195}
                compact
              />
            </div>

            {/* Calculations Breakdown */}
            <div className="p-4 rounded-2xl bg-[#070D1B] border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Estimated Net Profit:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  +${netReturn.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center justify-between text-white border-t border-slate-800 pt-2 font-bold">
                <span>Total Maturity Payout:</span>
                <span className="font-mono text-[#E5B842] text-base">
                  ${totalPayout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Commit Button */}
            <button
              onClick={handleCommitCapital}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] font-extrabold text-xs shadow-xl hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>Commit Allocation & Activate Plan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default InvestmentPlansSection;
