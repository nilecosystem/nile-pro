import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { 
  TrendingUp, 
  Clock, 
  ShieldAlert, 
  Coins, 
  PlusCircle, 
  CheckCircle, 
  ArrowRight, 
  Calendar, 
  Sparkles,
  Award,
  Layers
} from 'lucide-react';
import { RoiGrowthChart } from '../components/RoiGrowthChart.tsx';
import { InvestmentFaqSection } from '../components/InvestmentFaqSection.tsx';

export const NileInvestmentPage: React.FC = () => {
  const { 
    balances, 
    investmentPositions, 
    createInvestment,
    kycPermissions,
    user,
    setActiveTab, 
    showToast 
  } = useApp();

  const [activePlanTab, setActivePlanTab] = useState<'asset' | 'time' | 'amount' | 'nile_benefits'>('asset');
  
  // Enrollment form state
  const [selectedAsset, setSelectedAsset] = useState<'BTC' | 'ETH' | 'USDT' | 'SOL' | 'BNB'>('USDT');
  const [selectedDuration, setSelectedDuration] = useState<number>(90);
  const [investmentAmount, setInvestmentAmount] = useState<number>(5000);

  // Time-based durations
  const timeDurations = [
    { label: 'Daily (24h)', days: 1, baseApr: 4.5, minUsd: 100 },
    { label: 'Weekly (7 Days)', days: 7, baseApr: 6.0, minUsd: 250 },
    { label: '15 Days Lock', days: 15, baseApr: 7.5, minUsd: 500 },
    { label: '30 Days Standard', days: 30, baseApr: 9.0, minUsd: 1000 },
    { label: '90 Days Strategic', days: 90, baseApr: 12.0, minUsd: 2500 },
    { label: '180 Days Institutional', days: 180, baseApr: 14.5, minUsd: 5000 },
    { label: '365 Days Annual Yield', days: 365, baseApr: 17.5, minUsd: 10000 },
  ];

  // Amount tiers
  const amountTiers = [
    { name: 'Bronze Tier', range: '$500 – $4,999', apr: 6.5, min: 500 },
    { name: 'Silver Tier', range: '$5,000 – $24,999', apr: 9.5, min: 5000 },
    { name: 'Gold Tier', range: '$25,000 – $99,999', apr: 13.0, min: 25000 },
    { name: 'Platinum Tier', range: '$100,000 – $499,999', apr: 16.5, min: 100000 },
    { name: 'Diamond Institutional', range: '$500,000+', apr: 20.0, min: 500000 },
  ];

  // Calculate projected return
  const currentDurationObj = timeDurations.find(d => d.days === selectedDuration) || timeDurations[4];
  const aprRate = activePlanTab === 'nile_benefits' 
    ? 22.0 
    : activePlanTab === 'amount' 
      ? (investmentAmount >= 100000 ? 16.5 : investmentAmount >= 25000 ? 13.0 : 9.5)
      : currentDurationObj.baseApr;

  const projectedInterest = (investmentAmount * (aprRate / 100) * (selectedDuration / 365)).toFixed(2);

  const handleEnroll = (e: React.FormEvent) => {
    e.preventDefault();
    if (investmentAmount <= 0) return;

    if ((investmentAmount >= 25000 || activePlanTab === 'nile_benefits') && !kycPermissions.canInvestHighTier) {
      showToast('Institutional yield positions and Diamond plans require verified KYC Tier 2+ compliance.', 'error');
      return;
    }

    let planName = '';
    let currency = 'USD';

    if (activePlanTab === 'asset') {
      planName = `${selectedAsset} Asset-Backed Yield Vault`;
      currency = selectedAsset;
    } else if (activePlanTab === 'time') {
      planName = `${currentDurationObj.label} Time Vault`;
      currency = 'USDT';
    } else if (activePlanTab === 'amount') {
      const tier = amountTiers.find(t => investmentAmount >= t.min) || amountTiers[0];
      planName = `${tier.name} Capital Strategy`;
      currency = 'USD';
    } else {
      planName = 'NILE Token Staking Diamond Multiplier';
      currency = 'NILE';
    }

    createInvestment(
      activePlanTab,
      planName,
      investmentAmount,
      currency,
      aprRate,
      selectedDuration
    );
  };

  const totalPrincipal = investmentPositions.reduce((acc, pos) => {
    const factor = pos.currency === 'BTC' ? 68420 : pos.currency === 'ETH' ? 3580 : pos.currency === 'NILE' ? 0.12 : 1;
    return acc + (pos.principalAmount * factor);
  }, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title & Regulatory Risk Disclosure */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Institutional Asset Management
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white mt-1">
              Nile Investment Portfolios
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Transparent yield generation strategies governed by strict capital protection limits. Real calculations with complete on-chain and ledger traceability.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs max-w-md flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>Regulatory Notice:</strong> Product yields reflect algorithmic liquidity provision and lending market parameters. No speculative guaranteed outcomes are claimed. Early withdrawals are subject to terms.
            </p>
          </div>
        </div>

        {/* Portfolio Metric Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#091124] border border-slate-800">
            <div className="text-xs text-slate-400">Total Active Principal</div>
            <div className="text-2xl font-black text-white font-mono mt-1">
              ${totalPrincipal.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </div>
            <div className="text-[10px] text-emerald-400 mt-1">Across {investmentPositions.length} open positions</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#091124] border border-slate-800">
            <div className="text-xs text-slate-400">Liquid Account Reserves</div>
            <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
              ${balances.USD.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Available for deployment</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#091124] border border-slate-800">
            <div className="text-xs text-slate-400">NILE Staking Bonus Multiplier</div>
            <div className="text-2xl font-black text-[#E5B842] font-mono mt-1">
              +4.5% APR
            </div>
            <div className="text-[10px] text-[#E5B842] mt-1">Diamond Tier Enabled</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#091124] border border-slate-800">
            <div className="text-xs text-slate-400">Compliance & Audit Status</div>
            <div className="text-lg font-bold text-white mt-1">
              Audited Contract
            </div>
            <div className="text-[10px] text-slate-400 mt-1">ISO & Companies House compliant</div>
          </div>
        </div>
      </div>

      {/* Plan Selection Tabs */}
      <div className="p-1.5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap gap-1">
        <button
          onClick={() => setActivePlanTab('asset')}
          className={`flex-1 min-w-[140px] py-3 rounded-xl text-xs font-bold transition-all ${
            activePlanTab === 'asset' 
              ? 'bg-[#E5B842] text-[#070D1B] shadow-md' 
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          Plan 1: Asset-Based
        </button>

        <button
          onClick={() => setActivePlanTab('time')}
          className={`flex-1 min-w-[140px] py-3 rounded-xl text-xs font-bold transition-all ${
            activePlanTab === 'time' 
              ? 'bg-[#E5B842] text-[#070D1B] shadow-md' 
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          Plan 2: Time-Based
        </button>

        <button
          onClick={() => setActivePlanTab('amount')}
          className={`flex-1 min-w-[140px] py-3 rounded-xl text-xs font-bold transition-all ${
            activePlanTab === 'amount' 
              ? 'bg-[#E5B842] text-[#070D1B] shadow-md' 
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          Plan 3: Capital Tiers
        </button>

        <button
          onClick={() => setActivePlanTab('nile_benefits')}
          className={`flex-1 min-w-[140px] py-3 rounded-xl text-xs font-bold transition-all ${
            activePlanTab === 'nile_benefits' 
              ? 'bg-[#E5B842] text-[#070D1B] shadow-md' 
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          Plan 4: NILE Token Staking
        </button>
      </div>

      {/* Interactive Plan Configuration & Enrollment */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Configuration Form */}
        <div className="lg:col-span-7 p-8 rounded-3xl bg-[#091124] border border-slate-800 space-y-6">
          {/* Plan Photography Banner with Finance Background */}
          <div className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden border border-[#E5B842]/40 shadow-xl group bg-[#02050E]">
            <img 
              src={
                activePlanTab === 'asset' 
                  ? '/assets/plans/plan-asset-based.png'
                  : activePlanTab === 'time'
                    ? '/assets/plans/plan-time-locked.png'
                    : activePlanTab === 'amount'
                      ? '/assets/plans/plan-amount-tiers.png'
                      : '/assets/plans/plan-nile-staking.png'
              } 
              alt="Plan Architecture" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#091124] via-transparent to-transparent opacity-75" />
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-[#E5B842]/40 text-[#E5B842] font-mono font-bold">
                {activePlanTab === 'asset' && 'Daily Liquid Yields · 1.95%/d'}
                {activePlanTab === 'time' && 'Predictable Maturity · Up to +280%'}
                {activePlanTab === 'amount' && 'Progressive Tiers · Up to 24.0%/d'}
                {activePlanTab === 'nile_benefits' && 'Diamond Multipliers · 22.0% APR'}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-emerald-400 font-mono font-bold">
                Audited &amp; Capital-Secured
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white">
                {activePlanTab === 'asset' && 'Asset-Based Flexible Strategy'}
                {activePlanTab === 'time' && 'Time-Locked Structured Yield'}
                {activePlanTab === 'amount' && 'Capital Amount-Tiered Strategy'}
                {activePlanTab === 'nile_benefits' && 'NILE Native Staking & Ecosystem Multipliers'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Configure parameters to calculate projected earnings.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
              {aprRate}% Projected APR
            </span>
          </div>

          {activePlanTab === 'nile_benefits' && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#E5B842]/20 to-amber-500/10 border border-[#E5B842]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#E5B842]" />
                  <span>Dedicated NILE Token Staking Module Available</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Lock tokens into 30d, 90d, 180d, or 365d Diamond Vaults with up to 64.0% effective APY, live rewards ticking, and automated unstaking.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('token')}
                className="px-4 py-2 rounded-xl bg-[#E5B842] hover:bg-[#F3BA2F] text-[#070D1B] font-bold whitespace-nowrap self-start sm:self-auto transition-colors shadow"
              >
                Open Staking Vaults
              </button>
            </div>
          )}

          <form onSubmit={handleEnroll} className="space-y-5 text-xs">
            {/* Asset Selection (for Plan 1) */}
            {activePlanTab === 'asset' && (
              <div>
                <label className="block text-slate-300 font-semibold mb-2">Select Digital Asset</label>
                <div className="grid grid-cols-5 gap-2">
                  {(['USDT', 'BTC', 'ETH', 'SOL', 'BNB'] as const).map(asset => (
                    <button
                      type="button"
                      key={asset}
                      onClick={() => setSelectedAsset(asset)}
                      className={`py-2.5 rounded-xl font-bold transition-colors ${
                        selectedAsset === asset 
                          ? 'bg-[#E5B842] text-[#070D1B]' 
                          : 'bg-slate-900 border border-slate-800 text-slate-300'
                      }`}
                    >
                      {asset}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Time Duration Selection (for Plan 2) */}
            {(activePlanTab === 'time' || activePlanTab === 'asset') && (
              <div>
                <label className="block text-slate-300 font-semibold mb-2">Duration & Lock Period</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {timeDurations.map(dur => (
                    <button
                      type="button"
                      key={dur.days}
                      onClick={() => setSelectedDuration(dur.days)}
                      className={`p-2.5 rounded-xl text-left border transition-colors ${
                        selectedDuration === dur.days 
                          ? 'border-[#E5B842] bg-[#E5B842]/10 text-white' 
                          : 'border-slate-800 bg-slate-900 text-slate-400'
                      }`}
                    >
                      <div className="font-bold text-xs">{dur.label}</div>
                      <div className="text-[10px] text-emerald-400 mt-0.5">{dur.baseApr}% APR</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Capital Amount Tiers Display (for Plan 3) */}
            {activePlanTab === 'amount' && (
              <div className="space-y-2">
                <label className="block text-slate-300 font-semibold mb-1">Available Capital Tiers</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {amountTiers.map(tier => (
                    <div 
                      key={tier.name}
                      onClick={() => setInvestmentAmount(tier.min)}
                      className={`p-3 rounded-xl border cursor-pointer transition-colors ${
                        investmentAmount >= tier.min 
                          ? 'border-[#E5B842] bg-[#E5B842]/10' 
                          : 'border-slate-800 bg-slate-900/60'
                      }`}
                    >
                      <div className="font-bold text-white">{tier.name}</div>
                      <div className="text-[11px] text-slate-400">{tier.range}</div>
                      <div className="text-xs font-mono font-bold text-emerald-400 mt-1">{tier.apr}% APR</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Principal Amount Input */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Principal Amount to Deposit ({activePlanTab === 'nile_benefits' ? 'NILE' : activePlanTab === 'asset' ? selectedAsset : 'USD'})
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                  min={100}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-base font-bold focus:outline-none focus:border-[#E5B842]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] font-extrabold text-sm shadow-xl hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Confirm & Enroll Position</span>
            </button>
          </form>
        </div>

        {/* Right: Real-time Projection & Terms */}
        <div className="lg:col-span-5 p-8 rounded-3xl bg-gradient-to-b from-[#0c1630] to-[#070D1B] border border-slate-800 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#E5B842]" />
              <span>Investment Performance Projection</span>
            </h4>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Principal Deposit:</span>
                <span className="font-mono font-bold text-white">{investmentAmount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Duration Period:</span>
                <span className="font-semibold text-slate-200">{selectedDuration} Days</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Projected APR:</span>
                <span className="font-mono font-bold text-emerald-400">{aprRate}%</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">Estimated Yield:</span>
                <span className="text-lg font-black text-[#E5B842] font-mono">
                  +${projectedInterest}
                </span>
              </div>
            </div>

            {/* Dynamic Recharts Projected Trajectory */}
            <RoiGrowthChart 
              principal={investmentAmount}
              durationKey={`${selectedDuration}d`}
              ratePercent={(aprRate * selectedDuration) / 365}
              planType={activePlanTab === 'asset' ? 'plan1' : activePlanTab === 'time' ? 'plan2' : activePlanTab === 'amount' ? 'plan3' : 'ultimate'}
              planName={activePlanTab === 'asset' ? 'Asset-Based Strategy' : activePlanTab === 'time' ? 'Time-Locked Horizon' : activePlanTab === 'amount' ? 'Amount-Tiered Strategy' : 'Native Staking Multipliers'}
              asset={activePlanTab === 'nile_benefits' ? 'NILE' : activePlanTab === 'asset' ? selectedAsset : 'USD'}
              boosterActive={user.rank === 'Diamond' || user.rank === 'Platinum'}
              height={200}
              compact
            />

            <div className="space-y-2 text-[11px] text-slate-400">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>Yield accrues daily to available balance under smart contract terms.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>Early withdrawal allowed subject to standard 48-hour compliance unstaking notice.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>NILE token holders enjoy automatic reward multiplier boost on all assets.</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[10px] text-slate-500">
            Strategy managed by Nile Investment Ltd (Cardiff UK Registry #08253865).
          </div>
        </div>
      </div>

      {/* Active Positions Table */}
      <div className="p-6 rounded-3xl bg-[#091124] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Your Active Investment Positions</h3>
          <span className="text-xs text-slate-400 font-mono">{investmentPositions.length} Positions Open</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Position Plan</th>
                <th className="p-3">Principal</th>
                <th className="p-3">APR</th>
                <th className="p-3">Start Date</th>
                <th className="p-3">Maturity Date</th>
                <th className="p-3">Accrued Return</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {investmentPositions.map(pos => (
                <tr key={pos.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-semibold text-white">{pos.planName}</td>
                  <td className="p-3 font-mono font-bold text-slate-100">
                    {pos.principalAmount.toLocaleString()} {pos.currency}
                  </td>
                  <td className="p-3 font-mono font-bold text-emerald-400">{pos.aprPercent}%</td>
                  <td className="p-3 text-slate-400">{pos.startDate}</td>
                  <td className="p-3 text-slate-400">{pos.maturityDate}</td>
                  <td className="p-3 font-mono font-bold text-[#E5B842]">
                    +{pos.accruedReturn.toLocaleString()} {pos.currency}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                      {pos.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Investment & Staking FAQ Section to address common queries and build trust */}
      <InvestmentFaqSection />
    </div>
  );
};
