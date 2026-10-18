import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { NileTokenCoin } from './NileTokenCoin.tsx';
import { 
  Users, 
  Share2, 
  Copy, 
  Check, 
  Award, 
  TrendingUp, 
  Calculator, 
  Percent, 
  ShieldCheck,
  ChevronRight,
  Layers,
  Sparkles
} from 'lucide-react';

export const ReferralSection: React.FC = () => {
  const { user, showToast } = useApp();

  const [copied, setCopied] = useState(false);
  const [calcTier1Volume, setCalcTier1Volume] = useState<number>(25000);
  const [calcDirectReferrals, setCalcDirectReferrals] = useState<number>(10);
  const [selectedRank, setSelectedRank] = useState<string>('Diamond');

  const referralLink = `https://nileecosystem.com/ref/${user.referralCode || 'NILE-FOUNDER-77'}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    showToast('Affiliate invite link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  const LEVELS = [
    { level: 1, percent: 10, title: 'Direct Referrals', count: '12 active' },
    { level: 2, percent: 5, title: 'Second Line Tree', count: '28 active' },
    { level: 3, percent: 3, title: 'Third Line Network', count: '45 active' },
    { level: 4, percent: 2, title: 'Fourth Line Expansion', count: '80 active' },
    { level: 5, percent: 1.5, title: 'Fifth Line Nodes', count: '120 active' },
    { level: 6, percent: 1.1, title: 'Sixth Line Nodes', count: '190 active' },
    { level: 7, percent: 1.1, title: 'Seventh Line Nodes', count: '310 active' },
    { level: 8, percent: 1.1, title: 'Eighth Line Nodes', count: '480 active' },
    { level: 9, percent: 1.1, title: 'Ninth Line Nodes', count: '650 active' },
    { level: 10, percent: 1.1, title: 'Tenth Line Apex', count: '920 active' }
  ];

  const RANKS = [
    { rank: 'Bronze', override: '+0%', desc: 'Base 10% on Level 1 direct', minVol: '$0' },
    { rank: 'Silver', override: '+2%', desc: 'Level 2 unlocked +2% override', minVol: '$5,000' },
    { rank: 'Gold', override: '+3%', desc: 'Levels 1-4 unlocked +3% override', minVol: '$25,000' },
    { rank: 'Platinum', override: '+5%', desc: 'Levels 1-7 unlocked +5% override', minVol: '$100,000' },
    { rank: 'Diamond', override: '+7%', desc: 'Full 10-tier tree + 1.5× Staking Multiplier', minVol: '$500,000' }
  ];

  // Estimated Commission math
  const estimatedCommission = (calcTier1Volume * 0.10) + (calcTier1Volume * 0.05 * 0.8) + (calcTier1Volume * 0.03 * 0.5);

  return (
    <div id="referrals" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#E5B842] font-mono">
              Global Institutional Affiliate Architecture
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            10-Tier Affiliate Referral Engine
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Earn aggregate 27% commissions across 10 network depths, unlock 5 progressive partner ranks, 
            and activate the Diamond 1.5× staking multiplier boost.
          </p>
        </div>

        {/* 1-Click Invitation Copy Box */}
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5 shrink-0">
          <span className="text-[10px] text-slate-400 uppercase font-mono">Your Exclusive Invitation Link</span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-400 w-56 sm:w-64 focus:outline-none select-all"
            />
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] font-extrabold text-xs flex items-center gap-1 shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: 10 Levels & 5 Partner Ranks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: 10 Network Levels (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-6 rounded-3xl bg-[#091124] border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                <span>10 Network Referral Levels (27% Total Distribution)</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-bold">
                Instant Automatic Settlement
              </span>
            </div>

            <div className="space-y-2">
              {LEVELS.map((lvl) => (
                <div 
                  key={lvl.level}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-800 text-white font-mono font-bold flex items-center justify-center text-[11px]">
                      L{lvl.level}
                    </span>
                    <div>
                      <div className="font-bold text-white">{lvl.title}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{lvl.count} in tree</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-black text-emerald-400 text-sm">
                      {lvl.percent}%
                    </span>
                    <div className="text-[10px] text-slate-400">Commission</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: 5 Partner Ranks & Calculator (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Partner Ranks */}
          <div className="p-6 rounded-3xl bg-[#091124] border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-[#E5B842]" />
                <span>5 Partner Ranks & Bonuses</span>
              </h3>
              <span className="text-[10px] font-mono text-[#E5B842]">Tier Overrides</span>
            </div>

            <div className="space-y-2">
              {RANKS.map((r) => (
                <div 
                  key={r.rank}
                  onClick={() => setSelectedRank(r.rank)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedRank === r.rank
                      ? 'bg-slate-900 border-[#E5B842] shadow-md shadow-[#E5B842]/10'
                      : 'bg-[#070D1B] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{r.rank} Partner</span>
                    <span className="font-mono font-bold text-[#E5B842]">{r.override} Override</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">{r.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Calculator */}
          <div className="p-6 rounded-3xl bg-[#091124] border border-slate-800 shadow-xl space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-[#E5B842]" />
                <span>Commission Projection Calculator</span>
              </span>
              <span className="text-[10px] font-mono text-cyan-400">Monthly Est.</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-slate-400">Total Network Investment Volume (USD):</label>
                <input
                  type="number"
                  value={calcTier1Volume}
                  onChange={(e) => setCalcTier1Volume(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400">Active Direct Referrals:</label>
                <input
                  type="number"
                  value={calcDirectReferrals}
                  onChange={(e) => setCalcDirectReferrals(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold focus:outline-none"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#070D1B] border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono">Projected Monthly Earnings</span>
                <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">
                  +${estimatedCommission.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT
                </div>
              </div>
              <NileTokenCoin size="sm" animate />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ReferralSection;
