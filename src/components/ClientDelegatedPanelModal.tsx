import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { RoiGrowthChart } from './RoiGrowthChart.tsx';
import { 
  Key, 
  ShieldCheck, 
  Sparkles, 
  CreditCard, 
  Coins, 
  ShoppingBag, 
  TrendingUp, 
  Award, 
  X, 
  Check, 
  Clock, 
  Layers, 
  Plus, 
  Zap, 
  CheckCircle,
  AlertCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

export const ClientDelegatedPanelModal: React.FC = () => {
  const { 
    user, 
    clientPanelModalOpen, 
    setClientPanelModalOpen, 
    requestClientPanelAccess, 
    isClientPanelApproved,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'vaults' | 'cards' | 'affiliates' | 'merchant' | 'roi_sim'>('vaults');

  // Request form state for non-approved clients
  const [requestReason, setRequestReason] = useState<string>('');
  const [submittingRequest, setSubmittingRequest] = useState<boolean>(false);

  // Custom Vault creation state (Module 1)
  const [customVaultName, setCustomVaultName] = useState<string>('Vance Private Treasury Alpha');
  const [customVaultAsset, setCustomVaultAsset] = useState<string>('USDT');
  const [customVaultApr, setCustomVaultApr] = useState<number>(24.5);
  const [customVaultLockDays, setCustomVaultLockDays] = useState<number>(60);
  const [customVaultCapacity, setCustomVaultCapacity] = useState<number>(2500000);

  // Corporate card issuing state (Module 2)
  const [cardholderName, setCardholderName] = useState<string>(user.name || 'Corporate Associate');
  const [cardTier, setCardTier] = useState<'Standard' | 'Gold' | 'Black Elite'>('Black Elite');
  const [cardLimit, setCardLimit] = useState<number>(50000);

  // ROI Simulator custom state (Module 5)
  const [simPrincipal, setSimPrincipal] = useState<number>(100000);
  const [simDuration, setSimDuration] = useState<string>('90d');
  const [simCustomRate, setSimCustomRate] = useState<number>(45);

  if (!clientPanelModalOpen) return null;

  const perms = user.delegatedPermissions;

  const handleCreateCustomVault = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Custom Vault "${customVaultName}" successfully provisioned on smart contract with ${customVaultApr}% APR target!`, 'success');
  };

  const handleIssueCorporateCard = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Virtual corporate card issued for ${cardholderName} with $${cardLimit.toLocaleString()} limit.`, 'success');
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestReason.trim()) {
      showToast('Please specify the rationale or intended use for Client Panel delegation', 'error');
      return;
    }
    setSubmittingRequest(true);
    requestClientPanelAccess(requestReason);
    setSubmittingRequest(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-4xl bg-[#080E1E] border-2 border-[#E5B842] rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="p-6 bg-gradient-to-r from-[#0C152B] via-[#091124] to-[#0C152B] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#E5B842]/20 border border-[#E5B842] flex items-center justify-center text-[#E5B842] shadow-lg shadow-[#E5B842]/20">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">
                  Client Delegated Management Panel
                </h2>
                {isClientPanelApproved ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 font-mono">
                    <CheckCircle className="w-3 h-3" />
                    <span>Owner Approved</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-bold uppercase font-mono">
                    Approval Required
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Client: <strong className="text-white">{user.name}</strong> · Acc: {user.accountNumber} · Level: <span className="text-[#E5B842] font-semibold">{perms?.panelAccessLevel || 'Standard Investor'}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setClientPanelModalOpen(false)}
            className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {isClientPanelApproved ? (
            <div className="space-y-6">
              {/* Permission Banner & Authorized Quota */}
              <div className="p-4 rounded-2xl bg-[#0C152B] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div>
                  <div className="text-slate-400">Owner Authorization Status:</div>
                  <div className="font-bold text-white text-sm mt-0.5 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Delegated Authority Active · Authorized Daily Quota:</span>
                    <span className="text-[#E5B842] font-mono">${(perms?.maxDelegatedDailyLimitUsd || 100000).toLocaleString()} USD</span>
                  </div>
                  {perms?.approvalNotes && (
                    <div className="text-[11px] text-slate-400 mt-1 italic">
                      Contract terms: "{perms.approvalNotes}"
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400 self-start sm:self-auto">
                  <span>Approved on: {perms?.approvedByOwnerAt || '2026-03-01'}</span>
                </div>
              </div>

              {/* Module Navigation Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                {perms?.canCreateCustomVaults && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('vaults')}
                    className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${
                      activeTab === 'vaults'
                        ? 'bg-[#E5B842] text-[#070D1B] shadow'
                        : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Coins className="w-4 h-4" />
                    <span>Custom Yield Vaults</span>
                  </button>
                )}

                {perms?.canIssueVirtualCards && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('cards')}
                    className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${
                      activeTab === 'cards'
                        ? 'bg-[#E5B842] text-[#070D1B] shadow'
                        : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Corporate Virtual Cards</span>
                  </button>
                )}

                {perms?.canManageSubAffiliates && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('affiliates')}
                    className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${
                      activeTab === 'affiliates'
                        ? 'bg-[#E5B842] text-[#070D1B] shadow'
                        : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Award className="w-4 h-4" />
                    <span>Downline Network</span>
                  </button>
                )}

                {perms?.canListMarketplaceProducts && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('merchant')}
                    className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${
                      activeTab === 'merchant'
                        ? 'bg-[#E5B842] text-[#070D1B] shadow'
                        : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Merchant Marketplace</span>
                  </button>
                )}

                {perms?.canAccessAdvancedRoiSim && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('roi_sim')}
                    className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${
                      activeTab === 'roi_sim'
                        ? 'bg-[#E5B842] text-[#070D1B] shadow'
                        : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span>Dynamic ROI Modeler (Recharts)</span>
                  </button>
                )}
              </div>

              {/* MODULE 1: CUSTOM YIELD VAULTS */}
              {activeTab === 'vaults' && perms?.canCreateCustomVaults && (
                <div className="p-6 rounded-3xl bg-[#091124] border border-slate-800 space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Coins className="w-5 h-5 text-[#E5B842]" />
                      <span>Custom Capital Vault Provisioning</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      As an authorized institutional client, you can provision private smart contract vaults for your treasury or syndicate.
                    </p>
                  </div>

                  <form onSubmit={handleCreateCustomVault} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Vault Syndicate Name</label>
                        <input
                          type="text"
                          value={customVaultName}
                          onChange={(e) => setCustomVaultName(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold focus:outline-none focus:border-[#E5B842]"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Target Asset</label>
                        <select
                          value={customVaultAsset}
                          onChange={(e) => setCustomVaultAsset(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold focus:outline-none focus:border-[#E5B842]"
                        >
                          <option value="USDT">USDT (Tether USD)</option>
                          <option value="NILE">NILE Token</option>
                          <option value="BTC">Bitcoin (BTC)</option>
                          <option value="ETH">Ethereum (ETH)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Target APR Percentage (%)</label>
                        <input
                          type="number"
                          step="0.5"
                          value={customVaultApr}
                          onChange={(e) => setCustomVaultApr(Number(e.target.value))}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold focus:outline-none focus:border-[#E5B842]"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Lock Duration (Days)</label>
                        <input
                          type="number"
                          value={customVaultLockDays}
                          onChange={(e) => setCustomVaultLockDays(Number(e.target.value))}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold focus:outline-none focus:border-[#E5B842]"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Total Vault Hard Cap ($ USD)</label>
                        <input
                          type="number"
                          value={customVaultCapacity}
                          onChange={(e) => setCustomVaultCapacity(Number(e.target.value))}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold focus:outline-none focus:border-[#E5B842]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] font-extrabold text-xs shadow hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Deploy Private Vault Contract</span>
                    </button>
                  </form>
                </div>
              )}

              {/* MODULE 2: CORPORATE VIRTUAL CARDS */}
              {activeTab === 'cards' && perms?.canIssueVirtualCards && (
                <div className="p-6 rounded-3xl bg-[#091124] border border-slate-800 space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-purple-400" />
                      <span>Corporate & Team Virtual Cards Controller</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Issue virtual Visa / Mastercard cards to your executives and fund balances from your delegated account balance.
                    </p>
                  </div>

                  <form onSubmit={handleIssueCorporateCard} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Cardholder Associate Name</label>
                        <input
                          type="text"
                          value={cardholderName}
                          onChange={(e) => setCardholderName(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold focus:outline-none focus:border-[#E5B842]"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Card Tier</label>
                        <select
                          value={cardTier}
                          onChange={(e) => setCardTier(e.target.value as any)}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold focus:outline-none focus:border-[#E5B842]"
                        >
                          <option value="Black Elite">Black Elite (5.0% Cashback)</option>
                          <option value="Gold">Gold Card (3.0% Cashback)</option>
                          <option value="Standard">Standard Card (1.5% Cashback)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Monthly Spending Limit (USD)</label>
                        <input
                          type="number"
                          value={cardLimit}
                          onChange={(e) => setCardLimit(Number(e.target.value))}
                          max={perms.maxDelegatedDailyLimitUsd}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold focus:outline-none focus:border-[#E5B842]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-extrabold text-xs shadow hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Issue Corporate Virtual Card</span>
                    </button>
                  </form>
                </div>
              )}

              {/* MODULE 3: DOWNLINE NETWORK */}
              {activeTab === 'affiliates' && perms?.canManageSubAffiliates && (
                <div className="p-6 rounded-3xl bg-[#091124] border border-slate-800 space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Award className="w-5 h-5 text-emerald-400" />
                      <span>Downline Affiliate Network & Commission Manager</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Review your sub-brokers, referral commission distributions, and downline volume.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                      <div className="text-xs text-slate-400">Direct Referrals</div>
                      <div className="text-2xl font-black text-white font-mono mt-1">{user.referralDirectCount || 14}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                      <div className="text-xs text-slate-400">Total Downline Volume</div>
                      <div className="text-2xl font-black text-[#E5B842] font-mono mt-1">${((user.referralEarningsUsd || 48900) * 10).toLocaleString()}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                      <div className="text-xs text-slate-400">Accrued Commissions</div>
                      <div className="text-2xl font-black text-emerald-400 font-mono mt-1">+${(user.referralEarningsUsd || 48900).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* MODULE 5: DYNAMIC ROI MODELER (POWERED BY RECHARTS) */}
              {activeTab === 'roi_sim' && perms?.canAccessAdvancedRoiSim && (
                <div className="p-6 rounded-3xl bg-[#091124] border border-slate-800 space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-[#E5B842]" />
                      <span>Advanced Institutional ROI Growth Modeler</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Dynamic Recharts projection engine for testing complex allocation scenarios and institutional treasury yields.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Simulated Principal (USDT)</label>
                      <input
                        type="number"
                        value={simPrincipal}
                        onChange={(e) => setSimPrincipal(Number(e.target.value))}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold focus:outline-none focus:border-[#E5B842]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Simulated Time Horizon</label>
                      <select
                        value={simDuration}
                        onChange={(e) => setSimDuration(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold focus:outline-none focus:border-[#E5B842]"
                      >
                        <option value="7d">7 Days (Weekly Alpha)</option>
                        <option value="30d">30 Days (Monthly Settlement)</option>
                        <option value="90d">90 Days (Quarterly Strategy)</option>
                        <option value="180d">180 Days (Half-Year Treasury)</option>
                        <option value="365d">365 Days (Annual Horizon)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Simulated Return Rate (%)</label>
                      <input
                        type="number"
                        value={simCustomRate}
                        onChange={(e) => setSimCustomRate(Number(e.target.value))}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold focus:outline-none focus:border-[#E5B842]"
                      />
                    </div>
                  </div>

                  {/* Recharts Dynamic Chart */}
                  <RoiGrowthChart
                    principal={simPrincipal}
                    durationKey={simDuration}
                    ratePercent={simCustomRate}
                    planType="custom"
                    planName="Client Custom Projection"
                    asset="USDT"
                    boosterActive={true}
                    height={260}
                  />
                </div>
              )}
            </div>
          ) : (
            /* NON-APPROVED CLIENT: SUBMIT APPLICATION FOR CLIENT PANEL CONTROL */
            <div className="p-8 rounded-3xl bg-[#091124] border border-slate-800 space-y-6 text-center max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-500 text-amber-400 mx-auto flex items-center justify-center">
                <Key className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black text-white">
                  Apply for Client Panel Control
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Platform operations are strictly controlled by the Platform Owner. To receive delegated management capabilities (Custom Yield Vaults, Corporate Cards, Affiliate Downline Management, and Institutional Modeler), your account must be approved by the Platform Owner.
                </p>
              </div>

              {user.clientPanelRequested ? (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs space-y-2">
                  <div className="font-bold flex items-center justify-center gap-1.5">
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>Application Submitted & Under Review</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    Your request was recorded on <strong className="text-white">{user.clientPanelRequestDate}</strong>. The Platform Owner will review your KYC verification status and grant appropriate panel modules.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitRequest} className="space-y-4 text-left text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Rationale & Intended Use of Client Panel:
                    </label>
                    <textarea
                      value={requestReason}
                      onChange={(e) => setRequestReason(e.target.value)}
                      placeholder="e.g. Applying as an institutional family office to manage $1M+ private staking vaults and issue virtual cards for partners..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#E5B842]"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingRequest}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] font-extrabold text-xs shadow-xl hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Submit Application to Platform Owner</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ClientDelegatedPanelModal;
