import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { TransactionRecord } from '../types/index.ts';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Sparkles, 
  Lock, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Search, 
  Filter, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Coins, 
  TrendingUp, 
  Calendar,
  Layers,
  ChevronDown,
  RefreshCw,
  Eye
} from 'lucide-react';
import { NileTokenCoin } from './NileTokenCoin.tsx';

interface TransactionHistoryProps {
  initialFilter?: 'all' | 'deposits' | 'withdrawals' | 'staking_rewards';
  limit?: number;
  compact?: boolean;
  className?: string;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  initialFilter = 'all',
  limit,
  compact = false,
  className = ''
}) => {
  const { transactions, showToast } = useApp();

  const [activeCategory, setActiveCategory] = useState<'all' | 'deposits' | 'withdrawals' | 'staking_rewards'>(initialFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending' | 'failed'>('all');
  const [copiedTxid, setCopiedTxid] = useState<string | null>(null);
  const [selectedTxForModal, setSelectedTxForModal] = useState<TransactionRecord | null>(null);

  // Copy TXID to clipboard
  const handleCopyTxid = (txHash: string) => {
    navigator.clipboard.writeText(txHash);
    setCopiedTxid(txHash);
    showToast('Transaction Hash (TXID) copied to clipboard!', 'success');
    setTimeout(() => setCopiedTxid(null), 2500);
  };

  // Helper to categorize transaction records
  const isDeposit = (type: string) => type === 'deposit' || type === 'card_load';
  const isWithdrawal = (type: string) => type === 'withdrawal';
  const isStakingReward = (type: string) => 
    type === 'staking_claim' || 
    type === 'staking_unstake' || 
    type === 'investment_payout';

  // Calculate aggregated stats
  const stats = useMemo(() => {
    let totalDepositsUsd = 0;
    let totalWithdrawalsUsd = 0;
    let totalStakingRewardsNile = 0;
    let pendingCount = 0;

    transactions.forEach(tx => {
      if (tx.status === 'pending') {
        pendingCount++;
      }

      if (isDeposit(tx.type)) {
        if (tx.currency === 'USDT' || tx.currency === 'USD') {
          totalDepositsUsd += tx.amount;
        } else if (tx.currency === 'BTC') {
          totalDepositsUsd += tx.amount * 68000;
        } else if (tx.currency === 'ETH') {
          totalDepositsUsd += tx.amount * 3500;
        } else if (tx.currency === 'NILE') {
          totalDepositsUsd += tx.amount * 0.12;
        }
      } else if (isWithdrawal(tx.type)) {
        if (tx.currency === 'USDT' || tx.currency === 'USD') {
          totalWithdrawalsUsd += tx.amount;
        } else if (tx.currency === 'NILE') {
          totalWithdrawalsUsd += tx.amount * 0.12;
        }
      } else if (isStakingReward(tx.type)) {
        if (tx.currency === 'NILE') {
          totalStakingRewardsNile += tx.amount;
        }
      }
    });

    return {
      totalDepositsUsd,
      totalWithdrawalsUsd,
      totalStakingRewardsNile,
      pendingCount
    };
  }, [transactions]);

  // Filtered list of transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      // Category filter
      if (activeCategory === 'deposits' && !isDeposit(tx.type)) {
        return false;
      }
      if (activeCategory === 'withdrawals' && !isWithdrawal(tx.type)) {
        return false;
      }
      if (activeCategory === 'staking_rewards' && !isStakingReward(tx.type)) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'all' && tx.status !== statusFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchId = tx.id.toLowerCase().includes(query);
        const matchHash = tx.txHash ? tx.txHash.toLowerCase().includes(query) : false;
        const matchDetails = tx.recipientOrDetails ? tx.recipientOrDetails.toLowerCase().includes(query) : false;
        const matchCurrency = tx.currency.toLowerCase().includes(query);
        const matchType = tx.type.toLowerCase().includes(query);
        const matchNetwork = tx.network ? tx.network.toLowerCase().includes(query) : false;

        return matchId || matchHash || matchDetails || matchCurrency || matchType || matchNetwork;
      }

      return true;
    });
  }, [transactions, activeCategory, statusFilter, searchQuery]);

  // Display subset if limit specified
  const displayedTransactions = limit ? filteredTransactions.slice(0, limit) : filteredTransactions;

  // Export transactions as CSV
  const handleExportCsv = () => {
    if (!transactions.length) {
      showToast('No transaction records available to export', 'error');
      return;
    }

    const headers = ['ID', 'Date', 'Type', 'Amount', 'Currency', 'Status', 'Network', 'TX Hash', 'Details'];
    const rows = filteredTransactions.map(tx => [
      `"${tx.id}"`,
      `"${tx.timestamp}"`,
      `"${tx.type}"`,
      tx.amount,
      `"${tx.currency}"`,
      `"${tx.status}"`,
      `"${tx.network || 'Internal/Treasury'}"`,
      `"${tx.txHash || ''}"`,
      `"${(tx.recipientOrDetails || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NILE_Transactions_${activeCategory}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Transaction ledger exported to CSV successfully.', 'success');
  };

  // Type metadata helper
  const getTypeBadge = (type: TransactionRecord['type']) => {
    switch (type) {
      case 'deposit':
      case 'card_load':
        return {
          label: 'Deposit',
          icon: ArrowDownLeft,
          bg: 'bg-emerald-500/15',
          border: 'border-emerald-500/30',
          text: 'text-emerald-400',
          sign: '+',
          colorClass: 'text-emerald-400'
        };
      case 'withdrawal':
        return {
          label: 'Withdrawal',
          icon: ArrowUpRight,
          bg: 'bg-rose-500/15',
          border: 'border-rose-500/30',
          text: 'text-rose-400',
          sign: '-',
          colorClass: 'text-rose-400'
        };
      case 'staking_claim':
        return {
          label: 'Staking Reward',
          icon: Sparkles,
          bg: 'bg-amber-500/15',
          border: 'border-amber-500/30',
          text: 'text-[#E5B842]',
          sign: '+',
          colorClass: 'text-[#E5B842]'
        };
      case 'staking_unstake':
        return {
          label: 'Unstake / Return',
          icon: Coins,
          bg: 'bg-cyan-500/15',
          border: 'border-cyan-500/30',
          text: 'text-cyan-400',
          sign: '+',
          colorClass: 'text-cyan-400'
        };
      case 'staking_deposit':
        return {
          label: 'Staking Lock',
          icon: Lock,
          bg: 'bg-indigo-500/15',
          border: 'border-indigo-500/30',
          text: 'text-indigo-400',
          sign: '',
          colorClass: 'text-indigo-300'
        };
      case 'investment_payout':
        return {
          label: 'Yield Payout',
          icon: TrendingUp,
          bg: 'bg-emerald-500/15',
          border: 'border-emerald-500/30',
          text: 'text-emerald-400',
          sign: '+',
          colorClass: 'text-emerald-400'
        };
      default:
        return {
          label: type.replace('_', ' ').toUpperCase(),
          icon: Layers,
          bg: 'bg-slate-800',
          border: 'border-slate-700',
          text: 'text-slate-300',
          sign: '',
          colorClass: 'text-slate-200'
        };
    }
  };

  const getStatusBadge = (status: TransactionRecord['status']) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            <span>Confirmed</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse">
            <Clock className="w-3 h-3" />
            <span>Pending Review</span>
          </span>
        );
      case 'failed':
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <XCircle className="w-3 h-3" />
            <span>Failed</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Aggregated KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 rounded-2xl bg-[#060B17] border border-slate-800/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-mono">
            <span>Total Deposits</span>
            <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-sm sm:text-base font-black text-emerald-400 font-mono mt-1">
            +${stats.totalDepositsUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5 font-mono">Inflow settled</div>
        </div>

        <div className="p-3 rounded-2xl bg-[#060B17] border border-slate-800/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-mono">
            <span>Total Withdrawals</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-sm sm:text-base font-black text-rose-400 font-mono mt-1">
            -${stats.totalWithdrawalsUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5 font-mono">Disbursements paid</div>
        </div>

        <div className="p-3 rounded-2xl bg-[#060B17] border border-[#E5B842]/30 shadow-sm bg-gradient-to-br from-[#060B17] to-[#0A1224]">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-mono">
            <span>Staking Rewards</span>
            <Sparkles className="w-3.5 h-3.5 text-[#E5B842]" />
          </div>
          <div className="text-sm sm:text-base font-black text-[#E5B842] font-mono mt-1 flex items-center gap-1">
            <span>+{stats.totalStakingRewardsNile.toLocaleString()}</span>
            <span className="text-[10px] text-slate-400">NILE</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
            ≈ ${(stats.totalStakingRewardsNile * 0.12).toFixed(2)} USD
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-[#060B17] border border-slate-800/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-mono">
            <span>Compliance Queue</span>
            <Clock className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-sm sm:text-base font-black text-white font-mono mt-1">
            {stats.pendingCount} <span className="text-xs text-slate-400 font-normal">Pending</span>
          </div>
          <div className="text-[10px] text-emerald-400 mt-0.5 font-mono">Instant Audit Active</div>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-1">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1 rounded-2xl bg-[#060B17] border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-[#E5B842] text-[#070D1B] shadow font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All History ({transactions.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('deposits')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeCategory === 'deposits'
                ? 'bg-emerald-500 text-[#070D1B] shadow font-black'
                : 'text-slate-400 hover:text-emerald-400'
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>Deposits</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('withdrawals')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeCategory === 'withdrawals'
                ? 'bg-rose-500 text-white shadow font-black'
                : 'text-slate-400 hover:text-rose-400'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Withdrawals</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('staking_rewards')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeCategory === 'staking_rewards'
                ? 'bg-[#E5B842] text-[#070D1B] shadow font-black'
                : 'text-slate-400 hover:text-[#E5B842]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Staking Rewards</span>
          </button>
        </div>

        {/* Search & Export Buttons */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search TXID / Asset..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#E5B842]"
            />
          </div>

          <button
            type="button"
            onClick={handleExportCsv}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-[#E5B842] text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Download CSV Audit Statement"
          >
            <Download className="w-3.5 h-3.5 text-[#E5B842]" />
            <span className="hidden sm:inline">CSV</span>
          </button>
        </div>
      </div>

      {/* Transaction Records List */}
      <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
        {displayedTransactions.length > 0 ? (
          displayedTransactions.map((tx) => {
            const badge = getTypeBadge(tx.type);
            const Icon = badge.icon;
            const shortHash = tx.txHash 
              ? `${tx.txHash.substring(0, 8)}...${tx.txHash.substring(tx.txHash.length - 6)}`
              : null;

            return (
              <div
                key={tx.id}
                className="p-3.5 rounded-2xl bg-[#060B17] border border-slate-800 hover:border-slate-700 hover:bg-[#080E1E] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs group"
              >
                {/* Left: Icon, Type, Description, Date */}
                <div className="flex items-start sm:items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl ${badge.bg} border ${badge.border} flex items-center justify-center ${badge.text} shrink-0 mt-0.5 sm:mt-0`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-sans font-bold text-white text-xs">
                        {badge.label}
                      </span>
                      {tx.network && (
                        <span className="text-[10px] px-2 py-0.2 rounded-md bg-slate-800/90 text-slate-300 border border-slate-700 font-mono">
                          {tx.network}
                        </span>
                      )}
                      {getStatusBadge(tx.status)}
                    </div>

                    <div className="text-[11px] text-slate-400 font-sans line-clamp-1">
                      {tx.recipientOrDetails || `Treasury ${tx.type} operation`}
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                      <span>{tx.timestamp}</span>
                      <span>•</span>
                      <span>ID: {tx.id}</span>
                      {shortHash && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-slate-400">
                            <span>Hash: {shortHash}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyTxid(tx.txHash!);
                              }}
                              className="hover:text-[#E5B842] transition-colors cursor-pointer"
                              title="Copy full TX hash"
                            >
                              {copiedTxid === tx.txHash ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Amount, Status, and View Details Modal Button */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800/80 shrink-0">
                  <div className={`text-sm sm:text-base font-black ${badge.colorClass} flex items-center gap-1`}>
                    <span>{badge.sign}</span>
                    <span>{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 4 })}</span>
                    <span className="text-xs text-slate-400 font-bold">{tx.currency}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedTxForModal(tx)}
                    className="text-[10px] text-slate-400 hover:text-[#E5B842] flex items-center gap-1 cursor-pointer transition-colors mt-0.5"
                  >
                    <Eye className="w-3 h-3" />
                    <span>View Receipt</span>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center rounded-2xl bg-[#060B17] border border-slate-800/80 space-y-2">
            <Layers className="w-8 h-8 text-slate-600 mx-auto" />
            <div className="text-sm font-bold text-slate-300">No transactions found</div>
            <p className="text-xs text-slate-500">
              No matching records for {activeCategory.replace('_', ' ')} with the current filters.
            </p>
          </div>
        )}
      </div>

      {/* Transaction Detail Receipt Modal */}
      {selectedTxForModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-[#091124] border-2 border-[#E5B842] shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#E5B842]" />
                <h3 className="text-base font-black text-white">
                  Verified On-Chain Transaction Receipt
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTxForModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#060B17] border border-slate-800 text-center space-y-1">
              <div className="text-[10px] uppercase font-mono text-slate-400">Total Settled Amount</div>
              <div className="text-2xl font-black text-[#E5B842] font-mono">
                {selectedTxForModal.amount.toLocaleString()} {selectedTxForModal.currency}
              </div>
              <div className="pt-1">{getStatusBadge(selectedTxForModal.status)}</div>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400">Internal Reference ID:</span>
                <span className="text-white font-bold">{selectedTxForModal.id}</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400">Transaction Type:</span>
                <span className="text-emerald-400 uppercase font-bold">{selectedTxForModal.type}</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400">Timestamp:</span>
                <span className="text-slate-300">{selectedTxForModal.timestamp} UTC</span>
              </div>

              {selectedTxForModal.network && (
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400">Settlement Network:</span>
                  <span className="text-cyan-400 font-bold">{selectedTxForModal.network}</span>
                </div>
              )}

              {selectedTxForModal.txHash && (
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">On-Chain TXID Hash:</span>
                    <button
                      type="button"
                      onClick={() => handleCopyTxid(selectedTxForModal.txHash!)}
                      className="text-[#E5B842] hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </button>
                  </div>
                  <div className="p-1.5 rounded bg-black/60 text-cyan-400 break-all text-[10px]">
                    {selectedTxForModal.txHash}
                  </div>
                </div>
              )}

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-slate-400">Compliance & Ledger Notes:</span>
                <div className="text-slate-300 font-sans text-xs">
                  {selectedTxForModal.recipientOrDetails || 'Direct transaction recorded across Nile 4-Ledger System.'}
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedTxForModal(null)}
                className="w-full py-2.5 rounded-xl bg-[#E5B842] text-[#070D1B] font-extrabold text-xs shadow-md hover:brightness-110 cursor-pointer"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
