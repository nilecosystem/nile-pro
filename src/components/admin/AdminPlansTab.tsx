import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { 
  Layers, 
  Flame, 
  DollarSign, 
  Clock, 
  Percent, 
  ShieldCheck, 
  ShieldAlert, 
  Save, 
  RefreshCw, 
  Sparkles, 
  CheckCircle, 
  Zap,
  TrendingUp,
  Sliders
} from 'lucide-react';
import { InvestmentPlansAdminConfig } from '../../types/index.ts';

export const AdminPlansTab: React.FC = () => {
  const { 
    investmentPlansConfig, 
    adminUpdateInvestmentPlansConfig, 
    investmentPositions,
    showToast 
  } = useApp();

  const [form, setForm] = useState<InvestmentPlansAdminConfig>(investmentPlansConfig);
  const [selectedSubTab, setSelectedSubTab] = useState<'ultimate' | 'surprise' | 'plan1' | 'plan2' | 'plan3'>('ultimate');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    adminUpdateInvestmentPlansConfig(form);
  };

  const handleTriggerSimulation = () => {
    showToast('Simulated daily yield settlement across ' + investmentPositions.length + ' active positions. Ledger synchronized.', 'success');
  };

  const handleToggleEmergencyHalt = () => {
    const isPaused = form.ultimatePlan.status === 'paused';
    const nextStatus = isPaused ? 'active' : 'paused';
    const updated: InvestmentPlansAdminConfig = {
      ...form,
      ultimatePlan: { ...form.ultimatePlan, status: nextStatus },
      surpriseCampaign: { ...form.surpriseCampaign, status: nextStatus as any },
      plan1AssetBased: { ...form.plan1AssetBased, status: nextStatus as any },
      plan2TimeLocked: { ...form.plan2TimeLocked, status: nextStatus as any },
      plan3AmountTiers: { ...form.plan3AmountTiers, status: nextStatus as any }
    };
    setForm(updated);
    adminUpdateInvestmentPlansConfig(updated);
    showToast(isPaused ? 'Yield payouts resumed across all vaults.' : 'EMERGENCY CIRCUIT BREAKER ACTIVATED: All yields paused.', isPaused ? 'success' : 'error');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner & Control Bar */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#091124] border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-[#E5B842] flex items-center gap-1.5">
            <Layers className="w-4 h-4" />
            <span>Yield & Capital Vaults Controller</span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">
            Investment Plans & Campaigns Engine
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            Live master control over institutional APYs, surprise campaign countdowns, asset limits, and daily liquid payouts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleTriggerSimulation}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-[#E5B842] text-white text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-[#E5B842]" />
            <span>Run 24h Yield Batch</span>
          </button>
          <button
            type="button"
            onClick={handleToggleEmergencyHalt}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              form.ultimatePlan.status === 'paused'
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                : 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{form.ultimatePlan.status === 'paused' ? 'Resume Distributions' : 'Circuit Breaker'}</span>
          </button>
        </div>
      </div>

      {/* Plan Selection Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        {[
          { key: 'ultimate', label: 'Plan 4: ULTIMATE Flagship (+50,000%)', icon: Sparkles },
          { key: 'surprise', label: '90-Day Surprise Campaign (+15,000%)', icon: Flame },
          { key: 'plan1', label: 'Plan 1: Asset-Based Daily Liquid', icon: DollarSign },
          { key: 'plan2', label: 'Plan 2: Time-Locked Horizons', icon: Clock },
          { key: 'plan3', label: 'Plan 3: Progressive Amount Tiers', icon: TrendingUp },
        ].map(tab => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setSelectedSubTab(tab.key as any)}
            className={`px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2 whitespace-nowrap transition-colors ${
              selectedSubTab === tab.key
                ? 'bg-[#E5B842] text-[#070D1B] shadow-lg'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* SUBTAB 1: ULTIMATE FLAGSHIP */}
        {selectedSubTab === 'ultimate' && (
          <div className="p-8 rounded-3xl bg-[#091124] border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#E5B842]" />
                  <span>Plan 4 — ULTIMATE Flagship Institutional Vault</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Institutional multi-chain treasury vault with hard capacity limits and booster multipliers.
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase ${
                form.ultimatePlan.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-400'
              }`}>
                Status: {form.ultimatePlan.status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Max APY Percentage (%)</label>
                <input
                  type="number"
                  value={form.ultimatePlan.maxApyPercent}
                  onChange={(e) => setForm({
                    ...form,
                    ultimatePlan: { ...form.ultimatePlan, maxApyPercent: parseFloat(e.target.value) || 0 }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono font-bold focus:outline-none focus:border-[#E5B842]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Minimum Allocation (USDT)</label>
                <input
                  type="number"
                  value={form.ultimatePlan.minDepositUsd}
                  onChange={(e) => setForm({
                    ...form,
                    ultimatePlan: { ...form.ultimatePlan, minDepositUsd: parseFloat(e.target.value) || 0 }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono font-bold focus:outline-none focus:border-[#E5B842]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Maximum Allocation (USDT)</label>
                <input
                  type="number"
                  value={form.ultimatePlan.maxDepositUsd}
                  onChange={(e) => setForm({
                    ...form,
                    ultimatePlan: { ...form.ultimatePlan, maxDepositUsd: parseFloat(e.target.value) || 0 }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono font-bold focus:outline-none focus:border-[#E5B842]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Vault Cap (USD Total)</label>
                <input
                  type="number"
                  value={form.ultimatePlan.vaultTotalCapUsd}
                  onChange={(e) => setForm({
                    ...form,
                    ultimatePlan: { ...form.ultimatePlan, vaultTotalCapUsd: parseFloat(e.target.value) || 0 }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono font-bold focus:outline-none focus:border-[#E5B842]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Max Investor Count Limit</label>
                <input
                  type="number"
                  value={form.ultimatePlan.investorCapLimit}
                  onChange={(e) => setForm({
                    ...form,
                    ultimatePlan: { ...form.ultimatePlan, investorCapLimit: parseInt(e.target.value) || 0 }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono font-bold focus:outline-none focus:border-[#E5B842]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Active Investors (Filled Slots)</label>
                <input
                  type="number"
                  value={form.ultimatePlan.currentActiveInvestors}
                  onChange={(e) => setForm({
                    ...form,
                    ultimatePlan: { ...form.ultimatePlan, currentActiveInvestors: parseInt(e.target.value) || 0 }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono font-bold focus:outline-none focus:border-[#E5B842]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">1M NILE Booster Multiplier</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.ultimatePlan.nileBoosterMultiplier}
                  onChange={(e) => setForm({
                    ...form,
                    ultimatePlan: { ...form.ultimatePlan, nileBoosterMultiplier: parseFloat(e.target.value) || 1 }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono font-bold focus:outline-none focus:border-[#E5B842]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Vault Status</label>
                <select
                  value={form.ultimatePlan.status}
                  onChange={(e) => setForm({
                    ...form,
                    ultimatePlan: { ...form.ultimatePlan, status: e.target.value as any }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-semibold focus:outline-none focus:border-[#E5B842]"
                >
                  <option value="active">Active (Open to allocations)</option>
                  <option value="capped">Capped (Filled capacity)</option>
                  <option value="paused">Paused</option>
                </select>
              </div>
            </div>

            {/* Capacity Visual Progress */}
            <div className="p-4 rounded-2xl bg-[#060B17] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">Current Capacity Deployment:</span>
                <span className="text-[#E5B842] font-mono font-bold">
                  {form.ultimatePlan.currentActiveInvestors} / {form.ultimatePlan.investorCapLimit} Investors ({Math.round((form.ultimatePlan.currentActiveInvestors / form.ultimatePlan.investorCapLimit) * 100)}%)
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#E5B842] to-emerald-400 rounded-full"
                  style={{ width: `${Math.min(100, (form.ultimatePlan.currentActiveInvestors / form.ultimatePlan.investorCapLimit) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 2: SURPRISE CAMPAIGN */}
        {selectedSubTab === 'surprise' && (
          <div className="p-8 rounded-3xl bg-[#091124] border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Flame className="w-5 h-5 text-purple-400" />
                  <span>NILE 90-Day Ultimate Surprise Campaign Parameters</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Dynamic 90-day timer and ultra-high tier settlements for designated campaign pools.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setForm({ ...form, surpriseCampaign: { ...form.surpriseCampaign, countdownDays: 90 } });
                    showToast('Surprise campaign countdown timer reset to 90 days.', 'info');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold hover:bg-purple-500/20 transition-all flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset 90d Timer</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Weekly Payout Rate (%)</label>
                <input
                  type="number"
                  value={form.surpriseCampaign.weeklyPayoutPercent}
                  onChange={(e) => setForm({
                    ...form,
                    surpriseCampaign: { ...form.surpriseCampaign, weeklyPayoutPercent: parseFloat(e.target.value) || 0 }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono font-bold focus:outline-none focus:border-[#E5B842]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Monthly Payout Rate (%)</label>
                <input
                  type="number"
                  value={form.surpriseCampaign.monthlyPayoutPercent}
                  onChange={(e) => setForm({
                    ...form,
                    surpriseCampaign: { ...form.surpriseCampaign, monthlyPayoutPercent: parseFloat(e.target.value) || 0 }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono font-bold focus:outline-none focus:border-[#E5B842]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">3-Month Settlement Rate (%)</label>
                <input
                  type="number"
                  value={form.surpriseCampaign.threeMonthSettlementPercent}
                  onChange={(e) => setForm({
                    ...form,
                    surpriseCampaign: { ...form.surpriseCampaign, threeMonthSettlementPercent: parseFloat(e.target.value) || 0 }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono font-bold focus:outline-none focus:border-[#E5B842]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Days Remaining in Timer</label>
                <input
                  type="number"
                  value={form.surpriseCampaign.countdownDays}
                  onChange={(e) => setForm({
                    ...form,
                    surpriseCampaign: { ...form.surpriseCampaign, countdownDays: parseInt(e.target.value) || 0 }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono font-bold focus:outline-none focus:border-[#E5B842]"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="text-slate-300 font-semibold">Participating Campaign Assets:</label>
              <div className="flex flex-wrap gap-2">
                {form.surpriseCampaign.participatingAssets.map((asset, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-xl bg-slate-900 border border-purple-500/40 text-purple-300 font-mono font-bold">
                    {asset}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 3: PLAN 1 ASSET BASED */}
        {selectedSubTab === 'plan1' && (
          <div className="p-8 rounded-3xl bg-[#091124] border border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  <span>Plan 1 — Asset-Based Daily Liquid Payouts</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Daily variable liquidity rewards automatically routed to investor ledger balances.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">USDT Daily Liquid Rate (%/day)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.plan1AssetBased.usdtDailyRate}
                  onChange={(e) => setForm({
                    ...form,
                    plan1AssetBased: { ...form.plan1AssetBased, usdtDailyRate: parseFloat(e.target.value) || 0 }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono font-bold focus:outline-none focus:border-[#E5B842]"
                />
                <span className="text-[10px] text-emerald-400 mt-1 block">Annualized: {(form.plan1AssetBased.usdtDailyRate * 365).toFixed(1)}% APR</span>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">ETH Daily Liquid Rate (%/day)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.plan1AssetBased.ethDailyRate}
                  onChange={(e) => setForm({
                    ...form,
                    plan1AssetBased: { ...form.plan1AssetBased, ethDailyRate: parseFloat(e.target.value) || 0 }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono font-bold focus:outline-none focus:border-[#E5B842]"
                />
                <span className="text-[10px] text-blue-400 mt-1 block">Annualized: {(form.plan1AssetBased.ethDailyRate * 365).toFixed(1)}% APR</span>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">BTC Daily Liquid Rate (%/day)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.plan1AssetBased.btcDailyRate}
                  onChange={(e) => setForm({
                    ...form,
                    plan1AssetBased: { ...form.plan1AssetBased, btcDailyRate: parseFloat(e.target.value) || 0 }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono font-bold focus:outline-none focus:border-[#E5B842]"
                />
                <span className="text-[10px] text-amber-400 mt-1 block">Annualized: {(form.plan1AssetBased.btcDailyRate * 365).toFixed(1)}% APR</span>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 4: PLAN 2 TIME LOCKED */}
        {selectedSubTab === 'plan2' && (
          <div className="p-8 rounded-3xl bg-[#091124] border border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-400" />
                  <span>Plan 2 — Time-Locked Term Yield Horizons</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pre-agreed lock horizons releasing 100% principal + compounded yields at maturity.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">30-Day Lock Horizon (%)</label>
                <input
                  type="number"
                  value={form.plan2TimeLocked.lock30DaysRate}
                  onChange={(e) => setForm({
                    ...form,
                    plan2TimeLocked: { ...form.plan2TimeLocked, lock30DaysRate: parseFloat(e.target.value) || 0 }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono font-bold focus:outline-none focus:border-[#E5B842]"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Booster: +{form.plan2TimeLocked.lock30DaysRate * form.plan2TimeLocked.boosterMultiplier}%</span>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">50-Day Lock Horizon (%)</label>
                <input
                  type="number"
                  value={form.plan2TimeLocked.lock50DaysRate}
                  onChange={(e) => setForm({
                    ...form,
                    plan2TimeLocked: { ...form.plan2TimeLocked, lock50DaysRate: parseFloat(e.target.value) || 0 }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono font-bold focus:outline-none focus:border-[#E5B842]"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Booster: +{form.plan2TimeLocked.lock50DaysRate * form.plan2TimeLocked.boosterMultiplier}%</span>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">100-Day Dynasty Horizon (%)</label>
                <input
                  type="number"
                  value={form.plan2TimeLocked.lock100DaysRate}
                  onChange={(e) => setForm({
                    ...form,
                    plan2TimeLocked: { ...form.plan2TimeLocked, lock100DaysRate: parseFloat(e.target.value) || 0 }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono font-bold focus:outline-none focus:border-[#E5B842]"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Booster: +{form.plan2TimeLocked.lock100DaysRate * form.plan2TimeLocked.boosterMultiplier}%</span>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Booster Multiplier (Factor)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.plan2TimeLocked.boosterMultiplier}
                  onChange={(e) => setForm({
                    ...form,
                    plan2TimeLocked: { ...form.plan2TimeLocked, boosterMultiplier: parseFloat(e.target.value) || 1 }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono font-bold focus:outline-none focus:border-[#E5B842]"
                />
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 5: PLAN 3 AMOUNT TIERS */}
        {selectedSubTab === 'plan3' && (
          <div className="p-8 rounded-3xl bg-[#091124] border border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                  <span>Plan 3 — Progressive Capital Amount Tiers</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Tiered scale rates ranging from micro entries to the institutional Apex tier ($10,000+).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Micro Tier (10-999$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.plan3AmountTiers.microRate}
                  onChange={(e) => setForm({
                    ...form,
                    plan3AmountTiers: { ...form.plan3AmountTiers, microRate: parseFloat(e.target.value) || 0 }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono font-bold focus:outline-none focus:border-[#E5B842]"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Daily %</span>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Growth (1k-4.9k$)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.plan3AmountTiers.growthRate}
                  onChange={(e) => setForm({
                    ...form,
                    plan3AmountTiers: { ...form.plan3AmountTiers, growthRate: parseFloat(e.target.value) || 0 }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono font-bold focus:outline-none focus:border-[#E5B842]"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Daily %</span>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Elite (5k-9.9k$)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.plan3AmountTiers.eliteRate}
                  onChange={(e) => setForm({
                    ...form,
                    plan3AmountTiers: { ...form.plan3AmountTiers, eliteRate: parseFloat(e.target.value) || 0 }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono font-bold focus:outline-none focus:border-[#E5B842]"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Daily %</span>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Apex Base Rate</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.plan3AmountTiers.apexRate}
                  onChange={(e) => setForm({
                    ...form,
                    plan3AmountTiers: { ...form.plan3AmountTiers, apexRate: parseFloat(e.target.value) || 0 }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono font-bold focus:outline-none focus:border-[#E5B842]"
                />
                <span className="text-[10px] text-[#E5B842] mt-1 block">2x with Booster: {form.plan3AmountTiers.apexRate * 2}%/d</span>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Apex Threshold ($)</label>
                <input
                  type="number"
                  value={form.plan3AmountTiers.apexThresholdUsd}
                  onChange={(e) => setForm({
                    ...form,
                    plan3AmountTiers: { ...form.plan3AmountTiers, apexThresholdUsd: parseFloat(e.target.value) || 0 }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono font-bold focus:outline-none focus:border-[#E5B842]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-[#E5B842] hover:bg-[#F3BA2F] text-[#070D1B] font-extrabold text-xs shadow-lg transition-transform active:scale-98 flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save &amp; Broadcast Plan Changes Live</span>
          </button>
        </div>
      </form>
    </div>
  );
};
