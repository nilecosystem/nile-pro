import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { 
  Lock, 
  ShieldCheck, 
  Users, 
  DollarSign, 
  Flame, 
  Star, 
  Wallet, 
  FileText, 
  Download, 
  Check, 
  X, 
  AlertCircle,
  Sliders,
  Award,
  Coins,
  Percent,
  Clock,
  Plus,
  RefreshCw,
  Terminal,
  Code,
  Sparkles,
  PieChart,
  Calendar,
  Trash2,
  Layers,
  ShoppingBag,
  CreditCard,
  Cpu,
  PlaySquare,
  Key
} from 'lucide-react';
import { UserRole, NileStakingPool, ReferralTierConfig, AchievementBadge } from '../types/index.ts';
import { AdminPlansTab } from '../components/admin/AdminPlansTab.tsx';
import { AdminClientsTab } from '../components/admin/AdminClientsTab.tsx';
import { AdminMarketplaceTab } from '../components/admin/AdminMarketplaceTab.tsx';
import { AdminCardsTab } from '../components/admin/AdminCardsTab.tsx';
import { AdminAiOperationsTab } from '../components/admin/AdminAiOperationsTab.tsx';
import { AdminVideoAdsTab } from '../components/admin/AdminVideoAdsTab.tsx';

export const AdminPortalPage: React.FC = () => {
  const { 
    user, 
    updateUser, 
    balances, 
    adminAdjustBalance, 
    presalePhases, 
    updatePresalePhase, 
    testimonials, 
    adminApproveTestimonial, 
    depositWallets, 
    updateDepositWallets, 
    auditLogs, 
    adminReviewKyc,
    // Tokenomics & Vesting
    tokenomicsAllocations,
    updateTokenomicsAllocation,
    vestingEvents,
    addVestingEvent,
    updateVestingEvent,
    deleteVestingEvent,
    // Staking
    stakingPools,
    adminUpdateStakingPool,
    adminCreateStakingPool,
    // Referrals & Badges
    referralTiers,
    adminUpdateReferralTier,
    badges,
    adminUpdateBadge,
    claimBadge,
    // KYC/AML
    kycSession,
    simulateProviderWebhook,
    initiateKycSession,
    showToast 
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<
    | 'plans'
    | 'clients'
    | 'marketplace'
    | 'cards_admin'
    | 'ai_operations'
    | 'video_ads'
    | 'tokenomics'
    | 'staking'
    | 'referrals'
    | 'kyc_aml'
    | 'kyc'
    | 'ledger'
    | 'presale'
    | 'testimonials'
    | 'wallets'
    | 'audit'
  >('plans');

  // Staking admin edit state
  const [editingPoolId, setEditingPoolId] = useState<string>(stakingPools[0]?.id || 'pool-30d');
  const [editBaseApr, setEditBaseApr] = useState<number>(stakingPools[0]?.baseAprPercent || 12);
  const [editMultiplier, setEditMultiplier] = useState<number>(stakingPools[0]?.multiplier || 1.0);
  const [editLockDays, setEditLockDays] = useState<number>(stakingPools[0]?.lockDays || 30);
  const [editMinStake, setEditMinStake] = useState<number>(stakingPools[0]?.minStakeNile || 500);
  const [editPenalty, setEditPenalty] = useState<number>(stakingPools[0]?.earlyUnstakePenaltyPercent || 3.0);
  const [editStatus, setEditPoolStatus] = useState<'active' | 'paused'>('active');

  // New pool modal form
  const [showNewPoolModal, setShowNewPoolModal] = useState<boolean>(false);
  const [newPoolTitle, setNewPoolTitle] = useState<string>('60-Day Mid-Cap Pioneer Vault');
  const [newPoolLockDays, setNewPoolLockDays] = useState<number>(60);
  const [newPoolBaseApr, setNewPoolBaseApr] = useState<number>(15);
  const [newPoolMultiplier, setNewPoolMultiplier] = useState<number>(1.15);
  const [newPoolMinStake, setNewPoolMinStake] = useState<number>(1000);
  const [newPoolPenalty, setNewPoolPenalty] = useState<number>(4.0);

  // Referral tier admin edit state
  const [selectedRank, setSelectedRank] = useState<ReferralTierConfig['rank']>('Bronze');
  const currentTier = referralTiers.find(t => t.rank === selectedRank) || referralTiers[0];
  const [tierMinRefs, setTierMinRefs] = useState<number>(currentTier.minReferrals);
  const [tierMinVol, setTierMinVol] = useState<number>(currentTier.minVolumeUsd);
  const [tier1Comm, setTier1Comm] = useState<number>(currentTier.tier1CommissionPercent);
  const [tier2Comm, setTier2Comm] = useState<number>(currentTier.tier2CommissionPercent);
  const [tier3Comm, setTier3Comm] = useState<number>(currentTier.tier3CommissionPercent);
  const [cashbackBonus, setCashbackBonus] = useState<number>(currentTier.cashbackBonusPercent);

  // Balance adjustment state
  const [selectedCurrency, setSelectedCurrency] = useState<keyof typeof balances>('USD');
  const [adjAmount, setAdjAmount] = useState<number>(10000);
  const [adjReason, setAdjReason] = useState<string>('Capital contribution audit verification');

  // Wallet address edit state
  const [walletForm, setWalletForm] = useState({ ...depositWallets });
  const [walletChangeReason, setWalletChangeReason] = useState<string>('Routine institutional security key rotation');

  // Presale phase edit state
  const [editingPhaseId, setEditingPhaseId] = useState<number>(1);
  const [editPrice, setEditPrice] = useState<number>(0.05);
  const [editPresaleStatus, setEditPresaleStatus] = useState<'active' | 'upcoming' | 'completed' | 'paused'>('active');

  // Tokenomics Allocation Edit State
  const [selectedAllocIndex, setSelectedAllocIndex] = useState<number>(0);
  const currentAlloc = tokenomicsAllocations[selectedAllocIndex] || tokenomicsAllocations[0];
  const [allocCategory, setAllocCategory] = useState<string>(currentAlloc?.category || 'Public & Seed Presale');
  const [allocPercentage, setAllocPercentage] = useState<number>(currentAlloc?.percentage || 30);
  const [allocAmount, setAllocAmount] = useState<number>(currentAlloc?.amount || 150000000);
  const [allocLockPeriod, setAllocLockPeriod] = useState<string>(currentAlloc?.lockPeriod || '15% at TGE, 85% vested over 9 months');
  const [allocColor, setAllocColor] = useState<string>(currentAlloc?.color || '#E5B842');

  const handleSelectAllocToEdit = (idx: number) => {
    setSelectedAllocIndex(idx);
    const a = tokenomicsAllocations[idx];
    if (a) {
      setAllocCategory(a.category);
      setAllocPercentage(a.percentage);
      setAllocAmount(a.amount);
      setAllocLockPeriod(a.lockPeriod);
      setAllocColor(a.color);
    }
  };

  const handleSaveAllocConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateTokenomicsAllocation(selectedAllocIndex, {
      category: allocCategory,
      percentage: allocPercentage,
      amount: allocAmount,
      lockPeriod: allocLockPeriod,
      color: allocColor
    });
  };

  // Vesting Event Add State
  const [newVestingDate, setNewVestingDate] = useState<string>('Q3 2027');
  const [newVestingTitle, setNewVestingTitle] = useState<string>('Strategic Advisors Tranche 2');
  const [newVestingTokens, setNewVestingTokens] = useState<number>(12500000);
  const [newVestingCategory, setNewVestingCategory] = useState<string>('Advisors & Team');

  const handleAddVestingEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVestingTitle || newVestingTokens <= 0) return;
    addVestingEvent({
      date: newVestingDate,
      title: newVestingTitle,
      allocationTokens: newVestingTokens,
      category: newVestingCategory
    });
    setNewVestingTitle('');
  };

  // When changing pool selection in Staking admin
  const handleSelectPoolToEdit = (poolId: string) => {
    setEditingPoolId(poolId);
    const pool = stakingPools.find(p => p.id === poolId);
    if (pool) {
      setEditBaseApr(pool.baseAprPercent);
      setEditMultiplier(pool.multiplier);
      setEditLockDays(pool.lockDays);
      setEditMinStake(pool.minStakeNile);
      setEditPenalty(pool.earlyUnstakePenaltyPercent);
      setEditPoolStatus(pool.status);
    }
  };

  const handleSavePoolConfig = (e: React.FormEvent) => {
    e.preventDefault();
    adminUpdateStakingPool(editingPoolId, {
      baseAprPercent: editBaseApr,
      multiplier: editMultiplier,
      lockDays: editLockDays,
      minStakeNile: editMinStake,
      earlyUnstakePenaltyPercent: editPenalty,
      status: editStatus
    });
  };

  const handleCreateNewPool = (e: React.FormEvent) => {
    e.preventDefault();
    adminCreateStakingPool({
      title: newPoolTitle,
      lockDays: newPoolLockDays,
      baseAprPercent: newPoolBaseApr,
      multiplier: newPoolMultiplier,
      minStakeNile: newPoolMinStake,
      earlyUnstakePenaltyPercent: newPoolPenalty,
      status: 'active'
    });
    setShowNewPoolModal(false);
  };

  // When changing tier selection in Referrals admin
  const handleSelectRankToEdit = (rank: ReferralTierConfig['rank']) => {
    setSelectedRank(rank);
    const tier = referralTiers.find(t => t.rank === rank);
    if (tier) {
      setTierMinRefs(tier.minReferrals);
      setTierMinVol(tier.minVolumeUsd);
      setTier1Comm(tier.tier1CommissionPercent);
      setTier2Comm(tier.tier2CommissionPercent);
      setTier3Comm(tier.tier3CommissionPercent);
      setCashbackBonus(tier.cashbackBonusPercent);
    }
  };

  const handleSaveTierConfig = (e: React.FormEvent) => {
    e.preventDefault();
    adminUpdateReferralTier(selectedRank, {
      minReferrals: tierMinRefs,
      minVolumeUsd: tierMinVol,
      tier1CommissionPercent: tier1Comm,
      tier2CommissionPercent: tier2Comm,
      tier3CommissionPercent: tier3Comm,
      cashbackBonusPercent: cashbackBonus
    });
  };

  const handleBalanceAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    adminAdjustBalance(selectedCurrency, adjAmount, adjReason);
    setAdjAmount(0);
  };

  const handleWalletsUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateDepositWallets(walletForm, walletChangeReason);
  };

  const handlePresaleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePresalePhase(editingPhaseId, {
      tokenPriceUsd: editPrice,
      status: editPresaleStatus
    });
  };

  const exportAuditCsv = () => {
    const headers = 'ID,Operator,Action,Target,Details,Timestamp\n';
    const rows = auditLogs.map(l => 
      `"${l.id}","${l.operator}","${l.action}","${l.target}","${l.details}","${l.timestamp}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Nile-Audit-Ledger-${new Date().toISOString().substring(0, 10)}.csv`;
    a.click();
    showToast('Exported audit trail CSV.', 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Portal Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[#091124] border border-[#E5B842]/40 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#E5B842]/20 border border-[#E5B842] flex items-center justify-center text-[#E5B842]">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">Founder & Administration Portal</h1>
              <span className="px-2 py-0.5 rounded-full bg-[#E5B842]/20 text-[#E5B842] text-[10px] font-bold uppercase">
                {user.role.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Operator: <strong className="text-white">{user.name}</strong> ({user.email}) · UK Company #08253865
            </p>
          </div>
        </div>

        {/* Role Switcher for Testing / Demonstration */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Simulate Role:</span>
          <select
            value={user.role}
            onChange={(e) => updateUser({ role: e.target.value as UserRole })}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold focus:outline-none focus:border-[#E5B842]"
          >
            <option value="super_admin">Super Admin</option>
            <option value="finance_operator">Finance Operator</option>
            <option value="support_manager">Support Manager</option>
            <option value="auditor">Read-only Auditor</option>
          </select>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        {[
          { id: 'plans', label: 'Investment Plans & Yield Engine', icon: Layers },
          { id: 'clients', label: 'Clients & Delegated Controls', icon: Key },
          { id: 'marketplace', label: 'Marketplace & Orders Dispatch', icon: ShoppingBag },
          { id: 'cards_admin', label: 'Crypto Cards Administration', icon: CreditCard },
          { id: 'ai_operations', label: 'AI Autonomous Banking Engine', icon: Cpu },
          { id: 'video_ads', label: 'Video Ads & Media Broadcasts', icon: PlaySquare },
          { id: 'tokenomics', label: 'Tokenomics & Vesting Controls', icon: PieChart },
          { id: 'staking', label: 'NILE Staking & Vault Engine', icon: Coins },
          { id: 'referrals', label: 'Referral Ranks & Badges', icon: Award },
          { id: 'kyc_aml', label: 'KYC/AML Provider & Webhook Console', icon: Terminal },
          { id: 'kyc', label: 'KYC Verification Queue', icon: ShieldCheck },
          { id: 'ledger', label: 'Financial Ledger & Balances', icon: DollarSign },
          { id: 'presale', label: 'Presale Controls', icon: Flame },
          { id: 'testimonials', label: 'Testimonials Moderation', icon: Star },
          { id: 'wallets', label: 'Receiving Wallets Registry', icon: Wallet },
          { id: 'audit', label: 'Immutable Audit Trail', icon: FileText },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveAdminTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeAdminTab === tab.id
                ? 'bg-[#E5B842] text-[#070D1B] shadow-lg'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ======================================================== */}
      {/* 6 MASTER CONTROL TABS (PLANS, CLIENTS, MARKETPLACE, CARDS, AI, VIDEOS) */}
      {/* ======================================================== */}
      {activeAdminTab === 'plans' && <AdminPlansTab />}
      {activeAdminTab === 'clients' && <AdminClientsTab />}
      {activeAdminTab === 'marketplace' && <AdminMarketplaceTab />}
      {activeAdminTab === 'cards_admin' && <AdminCardsTab />}
      {activeAdminTab === 'ai_operations' && <AdminAiOperationsTab />}
      {activeAdminTab === 'video_ads' && <AdminVideoAdsTab />}

      {/* ======================================================== */}
      {/* TAB: TOKENOMICS ALLOCATION & VESTING SCHEDULE CONTROLS   */}
      {/* ======================================================== */}
      {activeAdminTab === 'tokenomics' && (
        <div className="space-y-6 animate-fade-in">
          {/* Section 1: Tokenomics Allocations Editor */}
          <div className="p-8 rounded-3xl bg-[#091124] border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-[#E5B842]" />
                  <span>Token Supply Allocations Registry</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Institutional backend configuration for the 500,000,000 NILE total supply distribution.
                </p>
              </div>
              <div className="text-xs font-mono text-[#E5B842] bg-[#E5B842]/10 border border-[#E5B842]/30 px-3 py-1.5 rounded-xl font-bold">
                Sum: {tokenomicsAllocations.reduce((sum, a) => sum + a.percentage, 0)}% of 500M NILE
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Category Selector Cards */}
              <div className="lg:col-span-5 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Select Allocation Category to Configure:
                </div>
                {tokenomicsAllocations.map((alloc, idx) => (
                  <div
                    key={alloc.category}
                    onClick={() => handleSelectAllocToEdit(idx)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedAllocIndex === idx
                        ? 'bg-slate-800 border-[#E5B842] shadow-md'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: alloc.color }} />
                        <span className="font-bold text-white">{alloc.category}</span>
                      </div>
                      <span className="font-mono text-emerald-400 font-bold">{alloc.percentage}%</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 pl-5">
                      {(alloc.amount / 1000000).toFixed(1)}M NILE · {alloc.lockPeriod}
                    </div>
                  </div>
                ))}
              </div>

              {/* Edit Form for Selected Category */}
              <form onSubmit={handleSaveAllocConfig} className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
                <div className="font-bold text-white text-sm pb-2 border-b border-slate-800 flex items-center justify-between">
                  <span>Edit Parameters: {allocCategory}</span>
                  <span className="text-[10px] text-slate-500 font-mono">Category #{selectedAllocIndex + 1}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Category Title</label>
                    <input
                      type="text"
                      value={allocCategory}
                      onChange={(e) => setAllocCategory(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-[#E5B842]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Allocation Percentage (%)</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={allocPercentage}
                      onChange={(e) => {
                        const pct = parseFloat(e.target.value) || 0;
                        setAllocPercentage(pct);
                        setAllocAmount(Math.floor((pct / 100) * 500000000));
                      }}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-[#E5B842]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Allocated Tokens (NILE)</label>
                    <input
                      type="number"
                      value={allocAmount}
                      onChange={(e) => setAllocAmount(parseInt(e.target.value) || 0)}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-[#E5B842]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Color Code (Hex)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={allocColor}
                        onChange={(e) => setAllocColor(e.target.value)}
                        className="w-10 h-9 rounded-lg bg-transparent border border-slate-700 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={allocColor}
                        onChange={(e) => setAllocColor(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono uppercase focus:outline-none focus:border-[#E5B842]"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-300 font-semibold mb-1">Vesting & Lock-up Terms</label>
                    <input
                      type="text"
                      value={allocLockPeriod}
                      onChange={(e) => setAllocLockPeriod(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-[#E5B842]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#E5B842] hover:bg-[#F3BA2F] text-[#070D1B] font-bold shadow transition-colors"
                  >
                    Save Allocation Parameters
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Section 2: Vesting Schedule & Unlock Timeline Events */}
          <div className="p-8 rounded-3xl bg-[#091124] border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  <span>Vesting Schedule Events & Unlock Timeline</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Manage emission tranches for founders, ecosystem treasury, advisors, and public presale participants.
                </p>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {vestingEvents.length} Events Scheduled
              </span>
            </div>

            {/* List of Vesting Events */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-semibold">Date / Period</th>
                    <th className="pb-3 font-semibold">Unlock Event Title</th>
                    <th className="pb-3 font-semibold">Category</th>
                    <th className="pb-3 font-semibold font-mono">Amount (NILE)</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {vestingEvents.map(event => (
                    <tr key={event.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3 font-mono font-bold text-[#E5B842]">{event.date}</td>
                      <td className="py-3 font-bold text-white">{event.title}</td>
                      <td className="py-3 text-cyan-400">{event.category}</td>
                      <td className="py-3 font-mono font-bold text-emerald-400">
                        {(event.allocationTokens / 1000000).toFixed(2)}M NILE
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => deleteVestingEvent(event.id)}
                          className="p-1.5 rounded-lg bg-red-950 hover:bg-red-900 text-red-400 transition-colors"
                          title="Delete unlock event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add New Vesting Event Form */}
            <form onSubmit={handleAddVestingEvent} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
              <div className="font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#E5B842]" />
                <span>Add Scheduled Unlock Event</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Release Date (e.g. Q4 2027)</label>
                  <input
                    type="text"
                    value={newVestingDate}
                    onChange={(e) => setNewVestingDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-[#E5B842]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Event Title</label>
                  <input
                    type="text"
                    value={newVestingTitle}
                    onChange={(e) => setNewVestingTitle(e.target.value)}
                    required
                    placeholder="e.g. Founders Final 24M Unlock"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-[#E5B842]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tokens Unlocked (NILE)</label>
                  <input
                    type="number"
                    value={newVestingTokens}
                    onChange={(e) => setNewVestingTokens(parseInt(e.target.value) || 0)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-[#E5B842]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={newVestingCategory}
                    onChange={(e) => setNewVestingCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-semibold focus:outline-none focus:border-[#E5B842]"
                  >
                    <option value="Team & Founders">Team & Founders</option>
                    <option value="Advisors & Team">Advisors & Team</option>
                    <option value="Ecosystem Fund">Ecosystem Fund</option>
                    <option value="Community & Staking">Community & Staking</option>
                    <option value="Presale Tranche">Presale Tranche</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#E5B842] hover:bg-[#F3BA2F] text-[#070D1B] font-bold shadow transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Unlock Event to Schedule</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB: NILE STAKING & VAULT ENGINE CONTROLS                */}
      {/* ======================================================== */}
      {activeAdminTab === 'staking' && (
        <div className="space-y-6">
          <div className="p-8 rounded-3xl bg-[#091124] border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Coins className="w-4 h-4 text-[#E5B842]" />
                  <span>NILE Staking Vault Administration & Multiplier Engine</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Set base APR rewards, lock-up periods, reward multipliers, and early unstake penalty deductions.
                </p>
              </div>

              <button
                onClick={() => setShowNewPoolModal(true)}
                className="px-4 py-2 rounded-xl bg-[#E5B842] text-[#070D1B] font-bold text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Staking Vault</span>
              </button>
            </div>

            {/* Current Pools Overview Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3">Vault Title</th>
                    <th className="p-3">Lock Period</th>
                    <th className="p-3">Base APR</th>
                    <th className="p-3">Multiplier</th>
                    <th className="p-3">Effective APY</th>
                    <th className="p-3">Early Penalty</th>
                    <th className="p-3">Min Stake</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Total Staked</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {stakingPools.map(pool => (
                    <tr 
                      key={pool.id} 
                      className={`hover:bg-slate-800/40 transition-colors ${editingPoolId === pool.id ? 'bg-[#E5B842]/5' : ''}`}
                    >
                      <td className="p-3 font-bold text-white flex items-center gap-2">
                        <span>{pool.title}</span>
                        {editingPoolId === pool.id && (
                          <span className="w-2 h-2 rounded-full bg-[#E5B842]" />
                        )}
                      </td>
                      <td className="p-3 font-mono">{pool.lockDays} Days</td>
                      <td className="p-3 font-mono text-cyan-400">{pool.baseAprPercent.toFixed(1)}%</td>
                      <td className="p-3 font-mono font-bold text-[#E5B842]">{pool.multiplier}x</td>
                      <td className="p-3 font-mono font-black text-emerald-400">
                        {(pool.baseAprPercent * pool.multiplier).toFixed(1)}%
                      </td>
                      <td className="p-3 font-mono text-amber-400">{pool.earlyUnstakePenaltyPercent}%</td>
                      <td className="p-3 font-mono">{pool.minStakeNile.toLocaleString()}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          pool.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {pool.status}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-slate-400">
                        {(pool.totalStakedInPool / 1000000).toFixed(2)}M NILE
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleSelectPoolToEdit(pool.id)}
                          className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Edit Staking Vault Form */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#E5B842]">
                  Edit Parameters for Selected Vault: {stakingPools.find(p => p.id === editingPoolId)?.title}
                </h4>
                <div className="text-xs text-slate-400 font-mono">
                  Calculated APY: <strong className="text-emerald-400 font-bold">{(editBaseApr * editMultiplier).toFixed(2)}% APY</strong>
                </div>
              </div>

              <form onSubmit={handleSavePoolConfig} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Base APR (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editBaseApr}
                    onChange={(e) => setEditBaseApr(parseFloat(e.target.value) || 0)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-[#E5B842]"
                  />
                  <span className="text-[10px] text-slate-500">Base annualized yield</span>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Reward Multiplier (x)</label>
                  <input
                    type="number"
                    step="0.05"
                    min="1.0"
                    max="5.0"
                    value={editMultiplier}
                    onChange={(e) => setEditMultiplier(parseFloat(e.target.value) || 1.0)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-[#E5B842]"
                  />
                  <span className="text-[10px] text-slate-500">Duration yield booster (e.g. 1.5x)</span>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Lock-Up Period (Days)</label>
                  <input
                    type="number"
                    value={editLockDays}
                    onChange={(e) => setEditLockDays(parseInt(e.target.value) || 1)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-[#E5B842]"
                  />
                  <span className="text-[10px] text-slate-500">Strict lock duration</span>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Min Stake Amount (NILE)</label>
                  <input
                    type="number"
                    value={editMinStake}
                    onChange={(e) => setEditMinStake(parseInt(e.target.value) || 0)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-[#E5B842]"
                  />
                  <span className="text-[10px] text-slate-500">Threshold to participate</span>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Early Unstake Penalty (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={editPenalty}
                    onChange={(e) => setEditPenalty(parseFloat(e.target.value) || 0)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-[#E5B842]"
                  />
                  <span className="text-[10px] text-slate-500">Deduction routed to burn vault</span>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Pool Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditPoolStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-[#E5B842]"
                  >
                    <option value="active">Active (Accepting Stakes)</option>
                    <option value="paused">Paused (Lock-In Only)</option>
                  </select>
                  <span className="text-[10px] text-slate-500">Emergency pause control</span>
                </div>

                <div className="sm:col-span-2 md:col-span-3 pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#E5B842] hover:bg-[#F3BA2F] text-[#070D1B] font-bold text-xs transition-colors flex items-center gap-2 shadow"
                  >
                    <Check className="w-4 h-4" />
                    <span>Apply Staking Parameters to Vault</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* New Pool Modal */}
          {showNewPoolModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
              <div className="max-w-md w-full bg-[#091124] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm">Create New Staking Vault</h4>
                  <button onClick={() => setShowNewPoolModal(false)} className="text-slate-400 hover:text-white">✕</button>
                </div>

                <form onSubmit={handleCreateNewPool} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Vault Title</label>
                    <input
                      type="text"
                      value={newPoolTitle}
                      onChange={(e) => setNewPoolTitle(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Lock Days</label>
                      <input
                        type="number"
                        value={newPoolLockDays}
                        onChange={(e) => setNewPoolLockDays(parseInt(e.target.value) || 1)}
                        required
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Base APR (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={newPoolBaseApr}
                        onChange={(e) => setNewPoolBaseApr(parseFloat(e.target.value) || 0)}
                        required
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Multiplier (x)</label>
                      <input
                        type="number"
                        step="0.05"
                        value={newPoolMultiplier}
                        onChange={(e) => setNewPoolMultiplier(parseFloat(e.target.value) || 1.0)}
                        required
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Min Stake (NILE)</label>
                      <input
                        type="number"
                        value={newPoolMinStake}
                        onChange={(e) => setNewPoolMinStake(parseInt(e.target.value) || 0)}
                        required
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Early Penalty (%)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={newPoolPenalty}
                      onChange={(e) => setNewPoolPenalty(parseFloat(e.target.value) || 0)}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowNewPoolModal(false)}
                      className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-[#E5B842] text-[#070D1B] font-bold"
                    >
                      Create Vault
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB: REFERRAL RANKS & ACHIEVEMENT BADGES                 */}
      {/* ======================================================== */}
      {activeAdminTab === 'referrals' && (
        <div className="p-8 rounded-3xl bg-[#091124] border border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-[#E5B842]" />
                <span>Referral Tiers, Ranks & Achievement Badge Configuration</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure eligibility criteria (referrals count, volume) and multi-tier commission rewards.
              </p>
            </div>
          </div>

          {/* Ranks selection strip */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {referralTiers.map(tier => (
              <button
                key={tier.rank}
                onClick={() => handleSelectRankToEdit(tier.rank)}
                className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                  selectedRank === tier.rank 
                    ? 'bg-[#E5B842] text-[#070D1B] shadow' 
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>{tier.rank} Rank</span>
                <span className="font-mono text-[10px] opacity-80">({tier.tier1CommissionPercent}%)</span>
              </button>
            ))}
          </div>

          {/* Edit Tier Form */}
          <form onSubmit={handleSaveTierConfig} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <span>Configuring: {selectedRank} Tier</span>
              <span className="text-xs font-normal text-slate-400">({currentTier.perks.join(' · ')})</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Min Direct Referrals Required</label>
                <input
                  type="number"
                  value={tierMinRefs}
                  onChange={(e) => setTierMinRefs(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Min Volume Required ($ USD)</label>
                <input
                  type="number"
                  value={tierMinVol}
                  onChange={(e) => setTierMinVol(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tier 1 Direct Commission (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={tier1Comm}
                  onChange={(e) => setTier1Comm(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tier 2 Network Commission (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={tier2Comm}
                  onChange={(e) => setTier2Comm(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tier 3 Deep Commission (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={tier3Comm}
                  onChange={(e) => setTier3Comm(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Card Cashback Bonus (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={cashbackBonus}
                  onChange={(e) => setCashbackBonus(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#E5B842] text-[#070D1B] font-bold text-xs transition-colors"
              >
                Save {selectedRank} Rank Parameters
              </button>
            </div>
          </form>

          {/* Badges List */}
          <div className="space-y-3 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Configured Achievement Badges ({badges.length})
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {badges.map(badge => (
                <div key={badge.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#E5B842]" />
                      <span>{badge.title}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-[#E5B842]">
                      {badge.category}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px]">{badge.description}</p>
                  <div className="flex items-center justify-between pt-2 text-[11px] text-slate-300 border-t border-slate-800/80">
                    <span>Criteria: <strong className="text-white">{badge.criteria}</strong></span>
                    <span className="text-emerald-400 font-semibold">{badge.rewardBonus}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB: KYC/AML PROVIDER & WEBHOOK CONSOLE                  */}
      {/* ======================================================== */}
      {activeAdminTab === 'kyc_aml' && (
        <div className="p-8 rounded-3xl bg-[#091124] border border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>KYC / AML Institutional Integration Console</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Simulate Sumsub/Onfido webhooks, test signature validation, and inspect real-time screening payloads.
              </p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold">
              Provider: {kycSession.provider}
            </span>
          </div>

          {/* Provider Session Status Banner */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-[10px] text-slate-500 font-sans uppercase">Applicant ID</div>
              <div className="font-bold text-white mt-1">{kycSession.applicantId}</div>
              <div className="text-[10px] text-slate-400 font-sans mt-0.5">Session: {kycSession.sessionId.substring(0, 15)}...</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-[10px] text-slate-500 font-sans uppercase">Screening Status</div>
              <div className="font-bold text-emerald-400 mt-1 uppercase">{kycSession.status}</div>
              <div className="text-[10px] text-slate-400 font-sans mt-0.5">Automated MLRO Rule</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-[10px] text-slate-500 font-sans uppercase">Risk Assessment Score</div>
              <div className="font-bold text-cyan-400 mt-1">{kycSession.riskScore} RISK</div>
              <div className="text-[10px] text-slate-400 font-sans mt-0.5">Biometrics & IP Verified</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-[10px] text-slate-500 font-sans uppercase">PEP & Sanctions Watchlist</div>
              <div className="font-bold text-emerald-400 mt-1">{kycSession.pepSanctionResult}</div>
              <div className="text-[10px] text-slate-400 font-sans mt-0.5">OFAC, EU, UK HMT Scanned</div>
            </div>
          </div>

          {/* Webhook Simulator Trigger Buttons */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="text-xs font-bold uppercase text-[#E5B842] flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Simulate Inbound KYC Provider Webhook Event</span>
            </div>
            <p className="text-xs text-slate-400">
              Dispatches authenticated webhook callbacks to test automated KYC feature gating and AML compliance states.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => simulateProviderWebhook('applicantReviewed')}
                className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs border border-emerald-500/40 transition-colors"
              >
                Send "applicantReviewed" (Green / Approved)
              </button>

              <button
                onClick={() => simulateProviderWebhook('applicantPending')}
                className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs border border-amber-500/40 transition-colors"
              >
                Send "applicantPending" (Under Manual Review)
              </button>

              <button
                onClick={() => simulateProviderWebhook('applicantRejected')}
                className="px-3.5 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold text-xs border border-red-500/40 transition-colors"
              >
                Send "applicantRejected" (Red / Declined)
              </button>

              <button
                onClick={() => simulateProviderWebhook('pepSanctionFlagged')}
                className="px-3.5 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-bold text-xs border border-purple-500/40 transition-colors"
              >
                Send "pepSanctionFlagged" (Watchlist Match)
              </button>
            </div>
          </div>

          {/* Webhook Event History Log */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Provider Webhook Exchange Log ({kycSession.webhookLog.length})
            </h4>

            <div className="space-y-2">
              {kycSession.webhookLog.map(wh => (
                <div key={wh.eventId} className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[#E5B842] font-bold">{wh.event}</span>
                    <span className="text-slate-500 text-[11px]">{wh.timestamp}</span>
                  </div>
                  <div className="text-slate-400 text-[11px] break-all">
                    {wh.payloadSummary}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 1: KYC Queue                                         */}
      {/* ======================================================== */}
      {activeAdminTab === 'kyc' && (
        <div className="p-8 rounded-3xl bg-[#091124] border border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Pending KYC Applications</h3>
              <p className="text-xs text-slate-400">Review submitted identity documents for institutional onboarding.</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg font-bold">
              Current User: {user.kycStatus.toUpperCase()} (Tier {user.kycTier})
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-[#E5B842]/50 shadow bg-[#070D1B] shrink-0">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#E5B842] text-[#070D1B] font-bold text-xs flex items-center justify-center">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-bold text-white text-sm">{user.name} ({user.email})</div>
                  <div className="text-slate-400 mt-0.5">Phone: {user.phone} · Account: {user.accountNumber}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => adminReviewKyc(user.id, true)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#070D1B] font-bold transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Approve Tier 3</span>
                </button>
                <button
                  onClick={() => adminReviewKyc(user.id, false, 'Proof of address document illegible')}
                  className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold transition-colors flex items-center gap-1.5 border border-red-500/40"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800 text-[11px] text-slate-300">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="font-semibold text-white">ID Document:</div>
                <div className="text-slate-400 mt-0.5">UK Passport #GB994821</div>
                <div className="text-emerald-400 mt-1 font-mono">Format: Validated</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="font-semibold text-white">Proof of Address:</div>
                <div className="text-slate-400 mt-0.5">Barclays Bank Statement (London)</div>
                <div className="text-emerald-400 mt-1 font-mono">Format: Certified</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: Financial Ledger Controls                         */}
      {/* ======================================================== */}
      {activeAdminTab === 'ledger' && (
        <div className="p-8 rounded-3xl bg-[#091124] border border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Ledger-Based Balance Adjustment</h3>
              <p className="text-xs text-slate-400">Strict policy: Adjustments require authorization and immutable audit logs.</p>
            </div>
            <span className="text-xs text-[#E5B842] font-semibold">Authorized Finance Operator</span>
          </div>

          <form onSubmit={handleBalanceAdjustment} className="max-w-xl space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Select Asset</label>
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-[#E5B842]"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="BTC">BTC</option>
                  <option value="ETH">ETH</option>
                  <option value="USDT">USDT</option>
                  <option value="NILE">NILE</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Adjustment Amount (+ or -)</label>
                <input
                  type="number"
                  step="any"
                  value={adjAmount}
                  onChange={(e) => setAdjAmount(parseFloat(e.target.value) || 0)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono focus:outline-none focus:border-[#E5B842]"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Formal Audit Authorization Reason</label>
              <input
                type="text"
                value={adjReason}
                onChange={(e) => setAdjReason(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-[#E5B842]"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#E5B842] text-[#070D1B] font-bold text-xs transition-colors shadow"
            >
              Post Ledger Entry
            </button>
          </form>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: Presale Controls                                  */}
      {/* ======================================================== */}
      {activeAdminTab === 'presale' && (
        <div className="p-8 rounded-3xl bg-[#091124] border border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Presale Phase Configuration</h3>
              <p className="text-xs text-slate-400">Control active round prices, status, and smart allocations.</p>
            </div>
          </div>

          <form onSubmit={handlePresaleSave} className="max-w-xl space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Select Presale Phase</label>
              <select
                value={editingPhaseId}
                onChange={(e) => setEditingPhaseId(parseInt(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-[#E5B842]"
              >
                {presalePhases.map(p => (
                  <option key={p.id} value={p.id}>{p.name} (Current: ${p.tokenPriceUsd})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Token Price (USD)</label>
                <input
                  type="number"
                  step="0.001"
                  value={editPrice}
                  onChange={(e) => setEditPrice(parseFloat(e.target.value))}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono focus:outline-none focus:border-[#E5B842]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Phase Status</label>
                <select
                  value={editPresaleStatus}
                  onChange={(e) => setEditPresaleStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-[#E5B842]"
                >
                  <option value="active">Active</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                  <option value="paused">Paused</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#E5B842] text-[#070D1B] font-bold text-xs transition-colors shadow"
            >
              Update Presale Parameters
            </button>
          </form>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: Testimonials Moderation                           */}
      {/* ======================================================== */}
      {activeAdminTab === 'testimonials' && (
        <div className="p-8 rounded-3xl bg-[#091124] border border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Testimonials Moderation Queue</h3>
              <p className="text-xs text-slate-400">Compliance moderation before feedback is published to landing page.</p>
            </div>
          </div>

          <div className="space-y-3">
            {testimonials.map(item => (
              <div key={item.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{item.userName}</span>
                    <span className="text-slate-400">({item.userRoleOrLocation})</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      item.isApproved ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {item.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-slate-300 mt-1 italic">"{item.comment}"</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => adminApproveTestimonial(item.id, !item.isApproved)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                      item.isApproved ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-emerald-500 text-[#070D1B]'
                    }`}
                  >
                    {item.isApproved ? 'Unpublish' : 'Approve & Publish'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: Receiving Wallets Registry                        */}
      {/* ======================================================== */}
      {activeAdminTab === 'wallets' && (
        <div className="p-8 rounded-3xl bg-[#091124] border border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Verified Receiving Wallets Registry</h3>
              <p className="text-xs text-slate-400">Addresses verified by project owner Matin Parsa for client deposits.</p>
            </div>
          </div>

          <form onSubmit={handleWalletsUpdate} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(walletForm).map(([key, val]) => (
                <div key={key}>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase font-mono text-[11px]">{key}</label>
                  <input
                    type="text"
                    value={val}
                    onChange={(e) => setWalletForm({ ...walletForm, [key]: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-[#E5B842]"
                  />
                </div>
              ))}
            </div>

            <div className="pt-2">
              <label className="block text-slate-300 font-semibold mb-1">Key Rotation Reason</label>
              <input
                type="text"
                value={walletChangeReason}
                onChange={(e) => setWalletChangeReason(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#E5B842] text-[#070D1B] font-bold text-xs transition-colors shadow"
            >
              Update Deposit Addresses
            </button>
          </form>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 6: Immutable Audit Trail                             */}
      {/* ======================================================== */}
      {activeAdminTab === 'audit' && (
        <div className="p-8 rounded-3xl bg-[#091124] border border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Immutable Administrative Audit Log</h3>
              <p className="text-xs text-slate-400">Timestamped ledger of all regulatory, KYC, and financial balance modifications.</p>
            </div>
            <button
              onClick={exportAuditCsv}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3">Log ID</th>
                  <th className="p-3">Operator</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Target</th>
                  <th className="p-3">Details</th>
                  <th className="p-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-mono font-bold text-white">{log.id}</td>
                    <td className="p-3 font-semibold text-slate-200">{log.operator}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-[#E5B842] font-mono">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300">{log.target}</td>
                    <td className="p-3 text-slate-400 max-w-sm truncate">{log.details}</td>
                    <td className="p-3 text-slate-400 font-mono text-[11px]">{log.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
