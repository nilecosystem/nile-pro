import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { 
  Users, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle, 
  XCircle, 
  Lock, 
  Key, 
  Sliders, 
  Sparkles, 
  CreditCard, 
  Coins, 
  ShoppingBag, 
  TrendingUp, 
  Award, 
  FileText, 
  ExternalLink, 
  Eye, 
  Check, 
  AlertCircle,
  Clock,
  Layers,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { UserProfile, ClientDelegatedPermissions } from '../../types/index.ts';

export const AdminClientsTab: React.FC = () => {
  const { 
    managedClients, 
    adminApproveClientPanel, 
    adminRevokeClientPanel, 
    adminUpdateClientPermissions,
    switchActiveClient,
    user,
    showToast 
  } = useApp();

  const [selectedClient, setSelectedClient] = useState<UserProfile | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'standard'>('all');

  // Modal edit form state
  const [accessLevel, setAccessLevel] = useState<ClientDelegatedPermissions['panelAccessLevel']>('approved_client');
  const [canCreateCustomVaults, setCanCreateCustomVaults] = useState<boolean>(true);
  const [canIssueVirtualCards, setCanIssueVirtualCards] = useState<boolean>(true);
  const [canManageSubAffiliates, setCanManageSubAffiliates] = useState<boolean>(true);
  const [canListMarketplaceProducts, setCanListMarketplaceProducts] = useState<boolean>(false);
  const [canAccessAdvancedRoiSim, setCanAccessAdvancedRoiSim] = useState<boolean>(true);
  const [canExecuteOtcTranches, setCanExecuteOtcTranches] = useState<boolean>(false);
  const [canAccessApiKeys, setCanAccessApiKeys] = useState<boolean>(false);
  const [maxDailyLimitUsd, setMaxDailyLimitUsd] = useState<number>(100000);
  const [approvalNotes, setApprovalNotes] = useState<string>('Accredited institutional partner approved by Platform Owner.');

  const openConfigModal = (client: UserProfile) => {
    setSelectedClient(client);
    const perms = client.delegatedPermissions;
    if (perms) {
      setAccessLevel(perms.panelAccessLevel || 'approved_client');
      setCanCreateCustomVaults(perms.canCreateCustomVaults);
      setCanIssueVirtualCards(perms.canIssueVirtualCards);
      setCanManageSubAffiliates(perms.canManageSubAffiliates);
      setCanListMarketplaceProducts(perms.canListMarketplaceProducts);
      setCanAccessAdvancedRoiSim(perms.canAccessAdvancedRoiSim);
      setCanExecuteOtcTranches(perms.canExecuteOtcTranches);
      setCanAccessApiKeys(perms.canAccessApiKeys);
      setMaxDailyLimitUsd(perms.maxDelegatedDailyLimitUsd || 100000);
      setApprovalNotes(perms.approvalNotes || 'Institutional governance approval granted by Platform Owner.');
    } else {
      setAccessLevel('approved_client');
      setCanCreateCustomVaults(true);
      setCanIssueVirtualCards(true);
      setCanManageSubAffiliates(true);
      setCanListMarketplaceProducts(false);
      setCanAccessAdvancedRoiSim(true);
      setCanExecuteOtcTranches(false);
      setCanAccessApiKeys(false);
      setMaxDailyLimitUsd(100000);
      setApprovalNotes('Client Panel access granted by Platform Owner following verification.');
    }
  };

  const handleGrantApproval = () => {
    if (!selectedClient) return;
    adminApproveClientPanel(
      selectedClient.id,
      {
        hasClientPanelAccess: true,
        panelAccessLevel: accessLevel,
        canCreateCustomVaults,
        canIssueVirtualCards,
        canManageSubAffiliates,
        canListMarketplaceProducts,
        canAccessAdvancedRoiSim,
        canExecuteOtcTranches,
        canAccessApiKeys,
        maxDelegatedDailyLimitUsd: maxDailyLimitUsd
      },
      approvalNotes
    );
    setSelectedClient(null);
  };

  const handleRevoke = () => {
    if (!selectedClient) return;
    adminRevokeClientPanel(selectedClient.id, 'Suspended by Platform Owner review');
    setSelectedClient(null);
  };

  const filteredClients = managedClients.filter(c => {
    if (filter === 'pending') return c.clientPanelRequested && !c.delegatedPermissions?.hasClientPanelAccess;
    if (filter === 'approved') return c.delegatedPermissions?.hasClientPanelAccess;
    if (filter === 'standard') return !c.delegatedPermissions?.hasClientPanelAccess && !c.clientPanelRequested;
    return true;
  });

  const totalClientsCount = managedClients.length;
  const approvedPanelsCount = managedClients.filter(c => c.delegatedPermissions?.hasClientPanelAccess).length;
  const pendingRequestsCount = managedClients.filter(c => c.clientPanelRequested && !c.delegatedPermissions?.hasClientPanelAccess).length;
  const totalDelegatedQuota = managedClients
    .filter(c => c.delegatedPermissions?.hasClientPanelAccess)
    .reduce((acc, c) => acc + (c.delegatedPermissions?.maxDelegatedDailyLimitUsd || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#091124] border border-[#E5B842]/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-[#E5B842] flex items-center gap-1.5 font-mono">
            <Key className="w-4 h-4" />
            <span>Platform Owner Master Governance</span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">
            Clients & Delegated Panel Controls
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            As the Platform Owner, you govern all system capabilities. When an investor or institutional client is accredited, you can selectively delegate modular control of custom yield vaults, corporate cards, affiliate structures, and merchant marketplaces.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Owner Authority Active</span>
          </span>
        </div>
      </div>

      {/* High-Level Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#091124] border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span>Total Managed Clients</span>
            <Users className="w-4 h-4 text-[#E5B842]" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{totalClientsCount}</div>
          <div className="text-[11px] text-slate-500">Accredited & KYC Investors</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#091124] border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span>Approved Client Panels</span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">{approvedPanelsCount}</div>
          <div className="text-[11px] text-slate-500">Active Delegated Controllers</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#091124] border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span>Pending Panel Requests</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">{pendingRequestsCount}</div>
          <div className="text-[11px] text-slate-500">Awaiting Owner Approval</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#091124] border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span>Delegated Daily Quota</span>
            <Sparkles className="w-4 h-4 text-[#E5B842]" />
          </div>
          <div className="text-2xl font-black text-[#E5B842] font-mono">${(totalDelegatedQuota / 1000).toFixed(0)}k</div>
          <div className="text-[11px] text-slate-500">Authorized Daily Limits</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { key: 'all', label: `All Clients (${totalClientsCount})` },
          { key: 'pending', label: `Pending Requests (${pendingRequestsCount})` },
          { key: 'approved', label: `Approved Panels (${approvedPanelsCount})` },
          { key: 'standard', label: `Standard Investors (${totalClientsCount - approvedPanelsCount})` }
        ].map(tab => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key as any)}
            className={`px-4 py-2 rounded-xl font-bold transition-colors ${
              filter === tab.key
                ? 'bg-[#E5B842] text-[#070D1B] shadow'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Clients Registry Table */}
      <div className="p-6 rounded-3xl bg-[#091124] border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-[#E5B842]" />
            <span>Platform Clients & Delegated Permissions Registry</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">{filteredClients.length} Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Client Entity & Contact</th>
                <th className="p-3">KYC & Tier</th>
                <th className="p-3">Delegated Panel Status</th>
                <th className="p-3">Granted Modules</th>
                <th className="p-3">Daily Limit</th>
                <th className="p-3 text-right">Owner Governance Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredClients.map(client => {
                const perms = client.delegatedPermissions;
                const isApproved = Boolean(perms?.hasClientPanelAccess);
                const isPending = Boolean(client.clientPanelRequested && !isApproved);

                return (
                  <tr key={client.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Entity Info */}
                    <td className="p-3">
                      <div className="font-bold text-white text-sm">{client.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{client.email}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{client.accountNumber} · {client.city || client.country}</div>
                    </td>

                    {/* KYC */}
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          client.kycStatus === 'verified'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          Tier {client.kycTier} {client.kycStatus.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#E5B842] font-semibold block mt-1">
                        Rank: {client.rank}
                      </span>
                    </td>

                    {/* Delegated Status */}
                    <td className="p-3">
                      {isApproved ? (
                        <div className="space-y-0.5">
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1 w-fit">
                            <CheckCircle className="w-3 h-3" />
                            <span>APPROVED: {perms?.panelAccessLevel.toUpperCase()}</span>
                          </span>
                          <div className="text-[10px] text-slate-500">Granted {perms?.approvedByOwnerAt}</div>
                        </div>
                      ) : isPending ? (
                        <div className="space-y-0.5">
                          <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-bold flex items-center gap-1 w-fit animate-pulse">
                            <Clock className="w-3 h-3" />
                            <span>REQUEST PENDING</span>
                          </span>
                          <div className="text-[10px] text-slate-400 max-w-xs truncate" title={client.clientPanelRequestReason}>
                            "{client.clientPanelRequestReason}"
                          </div>
                        </div>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">
                          Standard Investor
                        </span>
                      )}
                    </td>

                    {/* Granted Modules Badges */}
                    <td className="p-3">
                      {isApproved ? (
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {perms?.canCreateCustomVaults && (
                            <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[9px] font-mono">
                              Vaults
                            </span>
                          )}
                          {perms?.canIssueVirtualCards && (
                            <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 text-[9px] font-mono">
                              Cards
                            </span>
                          )}
                          {perms?.canManageSubAffiliates && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-mono">
                              Affiliates
                            </span>
                          )}
                          {perms?.canListMarketplaceProducts && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[9px] font-mono">
                              Merchant
                            </span>
                          )}
                          {perms?.canAccessAdvancedRoiSim && (
                            <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-[9px] font-mono">
                              ROI Sim
                            </span>
                          )}
                          {perms?.canExecuteOtcTranches && (
                            <span className="px-1.5 py-0.5 rounded bg-[#E5B842]/20 text-[#E5B842] text-[9px] font-mono">
                              OTC Desk
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-500 italic">None delegated</span>
                      )}
                    </td>

                    {/* Daily Limit */}
                    <td className="p-3 font-mono font-bold text-white">
                      {isApproved ? `$${(perms?.maxDelegatedDailyLimitUsd || 0).toLocaleString()}` : '—'}
                    </td>

                    {/* Actions */}
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openConfigModal(client)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1 cursor-pointer ${
                            isPending 
                              ? 'bg-amber-500 hover:bg-amber-600 text-[#070D1B] shadow'
                              : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                          }`}
                        >
                          <Sliders className="w-3.5 h-3.5" />
                          <span>{isApproved ? 'Edit Permissions' : isPending ? 'Review & Approve' : 'Grant Panel'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => switchActiveClient(client.id)}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-[#E5B842] text-slate-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-1"
                          title="Preview platform interface as this client"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#E5B842]" />
                          <span className="hidden sm:inline">Preview</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* OWNER MODAL: CONFIGURE & GRANT CLIENT PANEL CONTROLS */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-[#091124] border border-[#E5B842] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E5B842]/20 border border-[#E5B842] flex items-center justify-center text-[#E5B842]">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Delegate Platform Panel Controls
                  </h3>
                  <p className="text-xs text-slate-400">
                    Granting client: <strong className="text-white">{selectedClient.name}</strong> ({selectedClient.email})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedClient(null)}
                className="text-slate-400 hover:text-white p-2 rounded-lg bg-slate-900 border border-slate-800"
              >
                ✕
              </button>
            </div>

            {/* If Client requested, show their rationale */}
            {selectedClient.clientPanelRequestReason && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1 text-xs">
                <div className="font-bold text-amber-400 flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>Client's Application Rationale ({selectedClient.clientPanelRequestDate})</span>
                </div>
                <p className="text-slate-300 italic">
                  "{selectedClient.clientPanelRequestReason}"
                </p>
              </div>
            )}

            {/* Access Level & Tier */}
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Delegated Access Level & Contract Type:
                </label>
                <select
                  value={accessLevel}
                  onChange={(e) => setAccessLevel(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold focus:outline-none focus:border-[#E5B842]"
                >
                  <option value="approved_client">Approved Institutional Client (Custom Vaults & Sub-Cards)</option>
                  <option value="vip_partner">VIP Strategic Partner (Full Treasury & Affiliate Controls)</option>
                  <option value="delegated_operator">Delegated Regional Operator (Full Operator Quota)</option>
                </select>
              </div>

              {/* Modular Toggles */}
              <div className="space-y-2">
                <label className="block text-slate-300 font-semibold mb-1">
                  Select Permitted Functional Modules:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Module 1: Vaults */}
                  <label className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={canCreateCustomVaults}
                      onChange={(e) => setCanCreateCustomVaults(e.target.checked)}
                      className="mt-0.5 accent-[#E5B842] rounded"
                    />
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <Coins className="w-3.5 h-3.5 text-[#E5B842]" />
                        <span>Custom Yield Vaults</span>
                      </div>
                      <div className="text-[10px] text-slate-400">Permit client to create and configure private group vaults.</div>
                    </div>
                  </label>

                  {/* Module 2: Virtual Cards */}
                  <label className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={canIssueVirtualCards}
                      onChange={(e) => setCanIssueVirtualCards(e.target.checked)}
                      className="mt-0.5 accent-[#E5B842] rounded"
                    />
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-purple-400" />
                        <span>Virtual Card Issuing</span>
                      </div>
                      <div className="text-[10px] text-slate-400">Issue and manage corporate crypto cards for team members.</div>
                    </div>
                  </label>

                  {/* Module 3: Sub-Affiliates */}
                  <label className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={canManageSubAffiliates}
                      onChange={(e) => setCanManageSubAffiliates(e.target.checked)}
                      className="mt-0.5 accent-[#E5B842] rounded"
                    />
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Sub-Affiliate Network</span>
                      </div>
                      <div className="text-[10px] text-slate-400">Manage downline brokers and custom commission distributions.</div>
                    </div>
                  </label>

                  {/* Module 4: Merchant Marketplace */}
                  <label className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={canListMarketplaceProducts}
                      onChange={(e) => setCanListMarketplaceProducts(e.target.checked)}
                      className="mt-0.5 accent-[#E5B842] rounded"
                    />
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                        <span>Merchant Marketplace</span>
                      </div>
                      <div className="text-[10px] text-slate-400">Allow listing physical/digital goods with platform dispatch.</div>
                    </div>
                  </label>

                  {/* Module 5: ROI Modeler */}
                  <label className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={canAccessAdvancedRoiSim}
                      onChange={(e) => setCanAccessAdvancedRoiSim(e.target.checked)}
                      className="mt-0.5 accent-[#E5B842] rounded"
                    />
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Advanced Recharts ROI Modeler</span>
                      </div>
                      <div className="text-[10px] text-slate-400">Institutional projection curves and custom yield simulation.</div>
                    </div>
                  </label>

                  {/* Module 6: OTC Desk */}
                  <label className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={canExecuteOtcTranches}
                      onChange={(e) => setCanExecuteOtcTranches(e.target.checked)}
                      className="mt-0.5 accent-[#E5B842] rounded"
                    />
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-rose-400" />
                        <span>Dedicated OTC Liquidity Desk</span>
                      </div>
                      <div className="text-[10px] text-slate-400">Access large block liquidity tranches without DEX slippage.</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Max Daily Limit */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Authorized Maximum Daily Limit (USD):
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={maxDailyLimitUsd}
                    onChange={(e) => setMaxDailyLimitUsd(Number(e.target.value))}
                    step={10000}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold focus:outline-none focus:border-[#E5B842]"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-mono text-slate-400">USD</span>
                </div>
              </div>

              {/* Approval Notes */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Owner Governance Notes / Accreditation Contract Ref:
                </label>
                <textarea
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#E5B842]"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              {selectedClient.delegatedPermissions?.hasClientPanelAccess ? (
                <button
                  type="button"
                  onClick={handleRevoke}
                  className="px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Revoke Delegated Access</span>
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedClient(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleGrantApproval}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] font-extrabold text-xs shadow-xl hover:brightness-110 transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Grant & Activate Client Panel</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminClientsTab;
