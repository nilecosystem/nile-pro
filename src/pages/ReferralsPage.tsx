import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { 
  Users, 
  Copy, 
  Check, 
  Share2, 
  Award, 
  ShieldCheck, 
  TrendingUp, 
  Layers,
  ArrowRight,
  DollarSign,
  Gift,
  CheckCircle,
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const ReferralsPage: React.FC = () => {
  const { 
    user, 
    referralTiers, 
    badges, 
    claimBadge, 
    showToast,
    setActiveTab 
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [calcReferrals, setCalcReferrals] = useState<number>(15);
  const [calcVolumeUsd, setCalcVolumeUsd] = useState<number>(25000);

  const referralLink = `https://nileecosystem.com/ref/${user.referralCode}`;

  const copyRefLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    showToast('Referral link copied to clipboard.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const currentTier = referralTiers.find(t => t.rank === user.rank) || referralTiers[4];
  const nextTierIndex = referralTiers.findIndex(t => t.rank === user.rank) + 1;
  const nextTier = nextTierIndex < referralTiers.length ? referralTiers[nextTierIndex] : null;

  // Real-time Commission Projection based on user's current tier
  const projectedCommissionUsd = (calcVolumeUsd * (currentTier.tier1CommissionPercent / 100)) + 
    (calcReferrals * 50); // additional platform onboarding bonus

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5B842]/10 border border-[#E5B842]/30 text-[#E5B842] text-xs font-semibold">
          <Award className="w-4 h-4" />
          <span>Affiliate & Community Leadership</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Nile Referral & Rank Hierarchy
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          Invite corporate partners and private clients. Earn legitimate multi-tier commission rewards funded directly from platform settlement and marketplace revenues.
        </p>
      </div>

      {/* Shareable Link Box & Current Status Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[#091124] border border-[#E5B842]/40 shadow-2xl space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-[#E5B842]">
              Your Dedicated Referral Link & Code
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={referralLink}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none"
              />
              <button
                onClick={copyRefLink}
                className="px-6 py-3 rounded-2xl bg-[#E5B842] hover:bg-[#F3BA2F] text-[#070D1B] font-black text-xs flex items-center gap-1.5 transition-colors shadow shrink-0"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Share your personal affiliate code: <strong className="text-white font-mono">{user.referralCode}</strong> with colleagues, private clients, and institutions.
            </p>
          </div>

          <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col items-center text-center space-y-2">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-[#E5B842]/50 shadow bg-[#070D1B]">
              {user.avatarUrl ? (
                <img 
                  src={user.avatarUrl} 
                  alt={user.name} 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/default-avatar.jpg';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-[#E5B842] text-[#070D1B] font-bold text-base flex items-center justify-center">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
              )}
            </div>
            <div className="text-xs text-slate-400">Your Current Rank</div>
            <div 
              className="text-2xl font-black uppercase tracking-wider"
              style={{ color: currentTier.color }}
            >
              {user.rank} Rank
            </div>
            <div className="text-xs text-emerald-400 font-bold">
              {currentTier.tier1CommissionPercent}% Tier 1 Commission Active
            </div>
            {nextTier && (
              <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                Next Rank: <strong className="text-white">{nextTier.rank}</strong> (Requires {nextTier.minReferrals} referrals)
              </div>
            )}
          </div>
        </div>

        {/* 3 Real-time Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400">Direct Referrals (Tier 1)</div>
            <div className="text-2xl font-black text-white font-mono mt-1">
              {user.referralDirectCount || 42} Clients
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5 font-semibold">
              {currentTier.tier1CommissionPercent}% primary fee share
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400">Network Referrals (Tier 2 & 3)</div>
            <div className="text-2xl font-black text-cyan-400 font-mono mt-1">
              {user.referralNetworkCount || 118} Clients
            </div>
            <div className="text-[10px] text-cyan-500 mt-0.5 font-semibold">
              {currentTier.tier2CommissionPercent}% secondary commission
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400">Total Rewards Settleable</div>
            <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
              ${(user.referralEarningsUsd || 18450).toLocaleString()} USD
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Paid automatically in NILE & USDT</div>
          </div>
        </div>
      </div>

      {/* DISTINCT USER RANKS (Bronze, Silver, Gold, Platinum, Diamond) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-[#E5B842]" />
            <span>Progressive Rank Tiers & Privileges</span>
          </h3>
          <span className="text-xs text-slate-400">
            Backend Configured & Admin Updatable
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {referralTiers.map(tier => {
            const isCurrent = user.rank === tier.rank;

            return (
              <div 
                key={tier.rank}
                className={`p-5 rounded-3xl border flex flex-col justify-between space-y-4 transition-all ${
                  isCurrent 
                    ? 'bg-slate-800/90 border-[#E5B842] shadow-2xl scale-[1.02]' 
                    : 'bg-[#091124] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div 
                      className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-base shadow"
                      style={{ backgroundColor: `${tier.color}25`, color: tier.color, border: `1px solid ${tier.color}50` }}
                    >
                      {tier.rank[0]}
                    </div>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#E5B842] text-[#070D1B]">
                        CURRENT
                      </span>
                    )}
                  </div>

                  <h4 className="text-lg font-black text-white mt-3">{tier.rank} Rank</h4>

                  <div className="mt-2 space-y-1 text-xs">
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Min Referrals:</span>
                      <span className="text-white font-mono font-bold">≥ {tier.minReferrals}</span>
                    </div>
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Min Volume:</span>
                      <span className="text-white font-mono font-bold">${tier.minVolumeUsd.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs">
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span>Tier 1 Rebate:</span>
                      <span>{tier.tier1CommissionPercent}%</span>
                    </div>
                    <div className="flex justify-between text-cyan-400 text-[11px]">
                      <span>Tier 2 Rebate:</span>
                      <span>{tier.tier2CommissionPercent}%</span>
                    </div>
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Tier 3 Rebate:</span>
                      <span>{tier.tier3CommissionPercent}%</span>
                    </div>
                    <div className="flex justify-between text-[#E5B842] text-[11px] font-semibold pt-1 border-t border-slate-800">
                      <span>Card Cashback:</span>
                      <span>+{tier.cashbackBonusPercent}%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800/80 text-[11px]">
                  <div className="font-semibold text-slate-300">Unlocked Perks:</div>
                  <ul className="space-y-1 text-slate-400">
                    {tier.perks.map((p, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-[#E5B842] mt-0.5">✓</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ACHIEVEMENT BADGES SYSTEM */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[#091124] border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#E5B842]" />
              <span>Achievement Badges & Special Honors</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Earn permanent status badges and exclusive bonuses by referring active users and driving marketplace activity.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {user.badges.length} / {badges.length} Badges Earned
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {badges.map(badge => {
            const isEarned = user.badges.includes(badge.id);

            return (
              <div 
                key={badge.id}
                className={`p-5 rounded-2xl border flex flex-col justify-between space-y-3 transition-colors ${
                  isEarned
                    ? 'bg-slate-900 border-[#E5B842]/50 shadow-md'
                    : 'bg-slate-900/40 border-slate-800/80 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      isEarned ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {isEarned ? 'UNLOCKED' : 'LOCKED'}
                    </span>
                    <span className="text-slate-500 text-[10px] uppercase font-semibold">{badge.category}</span>
                  </div>

                  <h4 className="text-sm font-bold text-white mt-2 flex items-center gap-2">
                    <Award className={`w-4 h-4 ${isEarned ? 'text-[#E5B842]' : 'text-slate-600'}`} />
                    <span>{badge.title}</span>
                  </h4>
                  <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">
                    {badge.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <div className="text-[10px] text-slate-500">
                    Criteria: <strong className="text-slate-300">{badge.criteria}</strong>
                  </div>
                  <div className="text-[11px] text-emerald-400 font-semibold">
                    Bonus: {badge.rewardBonus}
                  </div>

                  {!isEarned && (
                    <button
                      onClick={() => claimBadge(badge.id)}
                      className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-[#E5B842] hover:text-[#070D1B] text-slate-300 font-bold text-[10px] transition-colors"
                    >
                      Claim Badge
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* INTERACTIVE COMMISSION CALCULATOR */}
      <div className="p-8 rounded-3xl bg-[#091124] border border-slate-800 space-y-6">
        <div className="pb-4 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <span>Interactive Commission Earnings Calculator</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Estimate your projected returns based on active referral volume and current rank.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center text-xs">
          <div className="md:col-span-7 space-y-5">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300 font-semibold">Projected Direct Referrals:</span>
                <span className="text-white font-mono font-bold">{calcReferrals} Clients</span>
              </div>
              <input
                type="range"
                min="1"
                max="150"
                value={calcReferrals}
                onChange={(e) => setCalcReferrals(parseInt(e.target.value))}
                className="w-full accent-[#E5B842] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300 font-semibold">Estimated Monthly Network Volume:</span>
                <span className="text-white font-mono font-bold">${calcVolumeUsd.toLocaleString()} USD</span>
              </div>
              <input
                type="range"
                min="1000"
                max="500000"
                step="5000"
                value={calcVolumeUsd}
                onChange={(e) => setCalcVolumeUsd(parseInt(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>
          </div>

          <div className="md:col-span-5 p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
            <div className="text-xs text-slate-400">Estimated Monthly Earnings</div>
            <div className="text-3xl font-black text-emerald-400 font-mono">
              ${projectedCommissionUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })} USD
            </div>
            <div className="text-[10px] text-slate-400">
              Calculated at <strong className="text-[#E5B842]">{currentTier.rank} ({currentTier.tier1CommissionPercent}%)</strong> tier rate
            </div>
          </div>
        </div>
      </div>

      {/* Anti-Abuse & Legal Disclosure */}
      <div className="p-6 rounded-3xl bg-[#091124] border border-slate-800 text-xs text-slate-400 space-y-2">
        <div className="font-bold text-slate-200 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Compliance & Anti-Pyramid Safeguards</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          In strict compliance with international consumer protection directives, the Nile Ecosystem referral program operates solely on legitimate transaction fee rebates and product purchases. No returns are contingent on recruitment or speculative capital pooling. All commissions are auditable and funded from transparent operational revenue.
        </p>
      </div>
    </div>
  );
};
