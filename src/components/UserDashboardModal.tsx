import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { NileTokenCoin } from './NileTokenCoin.tsx';
import { 
  Wallet, 
  ArrowLeftRight, 
  ArrowDownLeft, 
  ArrowUpRight, 
  ShieldCheck, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Copy,
  ExternalLink,
  Lock,
  Layers,
  Sparkles,
  TrendingUp,
  X
} from 'lucide-react';
import { TREASURY_CRYPTO_WALLETS, TREASURY_BANK_CARDS } from '../data/paymentConfig.ts';
import { TransactionHistory } from './TransactionHistory.tsx';

interface UserDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'overview' | 'history' | 'deposit' | 'withdraw' | 'swap';
}

export const UserDashboardModal: React.FC<UserDashboardModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'overview'
}) => {
  const { 
    user, 
    balances, 
    transactions, 
    addTransaction, 
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'deposit' | 'withdraw' | 'swap'>(defaultTab);

  // Sync activeTab when defaultTab prop updates or when opened
  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab, isOpen]);

  // Listen directly for open-dashboard-modal custom events
  useEffect(() => {
    const handleOpen = (e: any) => {
      if (e?.detail?.tab) {
        setActiveTab(e.detail.tab);
      }
    };
    window.addEventListener('open-dashboard-modal', handleOpen);
    return () => window.removeEventListener('open-dashboard-modal', handleOpen);
  }, []);

  // 4-Ledger Accounting Balances
  const [liquidUsdt, setLiquidUsdt] = useState<number>(balances.USDT || 5000);
  const [investmentUsdt, setInvestmentUsdt] = useState<number>(25000);
  const [nileTokens, setNileTokens] = useState<number>(balances.NILE || 12500);
  const [affiliateUsdt, setAffiliateUsdt] = useState<number>(1450);

  // 100ms Live Profit Accrual Counter (+0.006944 USDT/sec)
  const [liveProfitAccrual, setLiveProfitAccrual] = useState<number>(184.250000);

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveProfitAccrual(prev => prev + 0.0006944);
    }, 100);
    return () => clearInterval(timer);
  }, []);

  // Deposit Form
  const [depositAsset, setDepositAsset] = useState<string>('USDT-TRC20');
  const [depositAmount, setDepositAmount] = useState<number>(1000);
  const [depositTxid, setDepositTxid] = useState<string>('');
  const [isSubmittingDeposit, setIsSubmittingDeposit] = useState(false);

  // Withdraw Form
  const [withdrawAsset, setWithdrawAsset] = useState<string>('USDT');
  const [withdrawAmount, setWithdrawAmount] = useState<number>(500);
  const [withdrawAddress, setWithdrawAddress] = useState<string>('');
  const [withdrawSource, setWithdrawSource] = useState<'liquid' | 'investment'>('liquid');
  const [isSubmittingWithdraw, setIsSubmittingWithdraw] = useState(false);

  // Swap Form
  const [swapFrom, setSwapFrom] = useState<string>('USDT');
  const [swapTo, setSwapTo] = useState<string>('NILE');
  const [swapAmount, setSwapAmount] = useState<number>(500);

  if (!isOpen) return null;

  const handleDepositSubmit = () => {
    if (!depositTxid || depositTxid.length < 10) {
      showToast('Please enter a valid on-chain TXID or transaction reference', 'error');
      return;
    }
    setIsSubmittingDeposit(true);
    setTimeout(() => {
      setIsSubmittingDeposit(false);
      addTransaction({
        type: 'deposit',
        amount: depositAmount,
        currency: depositAsset,
        status: 'pending',
        recipientOrDetails: `Deposit (Pending Verification) via TXID: ${depositTxid}`,
        txHash: depositTxid
      });
      showToast(`Deposit of ${depositAmount} ${depositAsset} submitted! Under compliance review.`, 'success');
      setDepositTxid('');
    }, 1000);
  };

  const handleWithdrawSubmit = () => {
    if (withdrawAmount <= 0) {
      showToast('Please enter a valid withdrawal amount', 'error');
      return;
    }
    if (!withdrawAddress) {
      showToast('Please enter a receiving wallet address', 'error');
      return;
    }

    // Check KYC Tier 3 for Investment Ledger withdrawals
    if (withdrawSource === 'investment' && user.kycStatus !== 'verified') {
      showToast('Investment Ledger disbursements strictly mandate KYC Tier 3 (Proof of Address)', 'error');
      return;
    }

    if (withdrawSource === 'liquid' && withdrawAmount > liquidUsdt) {
      showToast('Insufficient balance in Liquid Wallet', 'error');
      return;
    }

    setIsSubmittingWithdraw(true);
    setTimeout(() => {
      setIsSubmittingWithdraw(false);
      if (withdrawSource === 'liquid') {
        setLiquidUsdt(prev => prev - withdrawAmount);
      } else {
        setInvestmentUsdt(prev => prev - withdrawAmount);
      }

      addTransaction({
        type: 'withdrawal',
        amount: withdrawAmount,
        currency: withdrawAsset,
        status: 'pending',
        recipientOrDetails: `Withdrawal (${withdrawSource.toUpperCase()} Ledger) to ${withdrawAddress} - Under Compliance Review`,
      });

      showToast(`Withdrawal of $${withdrawAmount} requested. Status: Pending Compliance Review.`, 'info');
    }, 1000);
  };

  const handleExecuteSwap = () => {
    if (swapAmount <= 0) return;
    const rate = swapTo === 'NILE' ? 1 / 0.12 : 0.12;
    const received = (swapAmount * rate).toFixed(2);
    setLiquidUsdt(prev => prev - swapAmount);
    setNileTokens(prev => prev + Number(received));

    addTransaction({
      type: 'transfer',
      amount: swapAmount,
      currency: swapFrom,
      status: 'confirmed',
      recipientOrDetails: `Zero-Slippage Swap: ${swapAmount} ${swapFrom} ➔ ${received} ${swapTo}`
    });

    showToast(`Swapped ${swapAmount} ${swapFrom} for ${received} ${swapTo}!`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl p-6 sm:p-8 rounded-3xl bg-[#091124] border-2 border-slate-800 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E5B842]/10 border border-[#E5B842]/30 flex items-center justify-center text-[#E5B842]">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <span>NILE Institutional Ledger & Treasury</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  4-Ledger Accounting
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Non-custodial spot custody, streaming yield accumulation, and verified settlements.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live 100ms Profit Accrual Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#060B17] via-[#09152B] to-[#060B17] border border-[#E5B842]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-[#E5B842] animate-bounce" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                100ms Live Profit Accrual Counter (+0.006944 USDT / sec)
              </div>
              <div className="text-lg font-black text-emerald-400 font-mono mt-0.5">
                +${liveProfitAccrual.toFixed(6)} USDT Real-Time Yield
              </div>
            </div>
          </div>
          <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-xl border border-cyan-500/20">
            Active Multiplier: {user.rank || 'Gold Elite'}
          </span>
        </div>

        {/* 4-Ledger Accounting Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          {/* Ledger 1: Liquid Wallet */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] uppercase">1. Liquid Wallet</span>
              <span className="text-emerald-400 text-[10px]">Spot Ready</span>
            </div>
            <div className="text-xl font-black text-white">
              ${liquidUsdt.toLocaleString()} <span className="text-xs text-slate-400">USDT</span>
            </div>
            <div className="text-[10px] text-slate-500">Available for spot trade & payout</div>
          </div>

          {/* Ledger 2: Investment Ledger */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] uppercase">2. Investment Ledger</span>
              <span className="text-cyan-400 text-[10px]">Locked & Yielding</span>
            </div>
            <div className="text-xl font-black text-cyan-400">
              ${investmentUsdt.toLocaleString()} <span className="text-xs text-slate-400">USDT</span>
            </div>
            <div className="text-[10px] text-slate-500">Earning compounded returns</div>
          </div>

          {/* Ledger 3: NILE Token Ledger */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] uppercase">3. NILE Token Ledger</span>
              <span className="text-[#E5B842] text-[10px]">Multiplier 2×</span>
            </div>
            <div className="text-xl font-black text-[#E5B842] flex items-center gap-1">
              <NileTokenCoin size="xs" />
              <span>{nileTokens.toLocaleString()} NILE</span>
            </div>
            <div className="text-[10px] text-slate-500">Staked governance & utility</div>
          </div>

          {/* Ledger 4: Affiliate Commissions Ledger */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] uppercase">4. Affiliate Ledger</span>
              <span className="text-purple-400 text-[10px]">10-Tier Tree</span>
            </div>
            <div className="text-xl font-black text-purple-400">
              ${affiliateUsdt.toLocaleString()} <span className="text-xs text-slate-400">USDT</span>
            </div>
            <div className="text-[10px] text-slate-500">Network commission earnings</div>
          </div>
        </div>

        {/* Tab Controls: Overview, History, Deposit, Withdraw, Swap */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'Treasury & Accrual', icon: Layers },
            { id: 'history', label: 'Transaction History', icon: Clock },
            { id: 'deposit', label: 'Deposit to Treasury', icon: ArrowDownLeft },
            { id: 'withdraw', label: 'Withdrawal Governance', icon: ArrowUpRight },
            { id: 'swap', label: 'Instant Zero-Slippage Swap', icon: ArrowLeftRight }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#E5B842] text-[#070D1B] border-[#E5B842] shadow-md font-black'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content 1: Deposit */}
        {activeTab === 'deposit' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#060B17] border border-slate-800 space-y-3">
              <div className="font-bold text-white text-sm">Official Treasury Deposit Addresses:</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-[11px]">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400">USDT / TRX (TRC20):</span>
                  <div className="p-1 rounded bg-slate-950 text-cyan-400 break-all select-all">
                    {TREASURY_CRYPTO_WALLETS.TRON}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400">BTC (Native SegWit):</span>
                  <div className="p-1 rounded bg-slate-950 text-amber-400 break-all select-all">
                    {TREASURY_CRYPTO_WALLETS.BTC_NATIVE}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="font-bold text-white">Submit Proof of On-Chain Transfer (TXID):</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400">Asset & Network:</label>
                  <select
                    value={depositAsset}
                    onChange={(e) => setDepositAsset(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs focus:outline-none"
                  >
                    <option value="USDT-TRC20">USDT (TRC20)</option>
                    <option value="USDT-BEP20">USDT (BEP20)</option>
                    <option value="BTC">BTC (Native SegWit)</option>
                    <option value="ETH">ETH (ERC20 / ARB)</option>
                    <option value="SOL">SOL (Solana)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400">Deposit Amount:</label>
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400">Blockchain Transaction Hash (TXID):</label>
                <input
                  type="text"
                  placeholder="Paste on-chain transaction hash (e.g. 0x... or btc txid)"
                  value={depositTxid}
                  onChange={(e) => setDepositTxid(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs focus:outline-none"
                />
              </div>

              <button
                onClick={handleDepositSubmit}
                disabled={isSubmittingDeposit}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] font-extrabold text-xs shadow-md hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmittingDeposit ? 'Verifying Blockchain State...' : 'Submit Deposit for Verification'}
              </button>
            </div>
          </div>
        )}

        {/* Tab Content 2: Withdraw */}
        {activeTab === 'withdraw' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
              <span>
                Withdrawal Governance: Liquid withdrawals up to $5,000/day require KYC Tier 2. 
                Investment Ledger disbursements strictly mandate KYC Tier 3 (Proof of Address).
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400">Disbursement Ledger Source:</label>
                  <select
                    value={withdrawSource}
                    onChange={(e) => setWithdrawSource(e.target.value as any)}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs focus:outline-none"
                  >
                    <option value="liquid">Liquid Wallet (Balance: ${liquidUsdt.toLocaleString()} USDT)</option>
                    <option value="investment">Investment Ledger (Balance: ${investmentUsdt.toLocaleString()} USDT - KYC 3 Req)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400">Amount:</label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400">Destination Receiving Address:</label>
                <input
                  type="text"
                  placeholder="Paste your verified external wallet address"
                  value={withdrawAddress}
                  onChange={(e) => setWithdrawAddress(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs focus:outline-none"
                />
              </div>

              <button
                onClick={handleWithdrawSubmit}
                disabled={isSubmittingWithdraw}
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmittingWithdraw ? 'Submitting to Compliance Queue...' : 'Request Disbursement & Audit'}
              </button>
            </div>
          </div>
        )}

        {/* Tab Content 3: Swap */}
        {activeTab === 'swap' && (
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
            <div className="font-bold text-white text-sm">Instant Cross-Asset In-Wallet Swap Engine</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400">From Asset:</span>
                <input
                  type="number"
                  value={swapAmount}
                  onChange={(e) => setSwapAmount(Number(e.target.value))}
                  className="w-full text-lg font-black text-white font-mono bg-transparent focus:outline-none"
                />
                <span className="text-[11px] text-slate-500">Liquid Balance: ${liquidUsdt} USDT</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400">To Asset (Estimated):</span>
                <div className="text-lg font-black text-[#E5B842] font-mono">
                  {(swapAmount / 0.12).toFixed(2)} NILE
                </div>
                <span className="text-[11px] text-emerald-400">Rate: $0.1200 / NILE · Zero Slippage</span>
              </div>
            </div>

            <button
              onClick={handleExecuteSwap}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] font-extrabold text-xs shadow-md hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>Execute Zero-Slippage Swap</span>
            </button>
          </div>
        )}

        {/* Tab Content: Dedicated Transaction History */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Ledger Transaction History</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E5B842]/15 text-[#E5B842] border border-[#E5B842]/30">
                    Live 4-Ledger Sync
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Verifiable real-time record of all deposits, outbound withdrawals, and staking yield distributions.
                </p>
              </div>
            </div>

            <TransactionHistory initialFilter="all" />
          </div>
        )}

        {/* Tab Content 4: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between pt-1">
              <div className="font-bold text-white text-sm flex items-center gap-2">
                <span>Recent Ledger Activity & Verification Log</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Live
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className="text-xs text-[#E5B842] hover:underline font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Full Transaction Ledger ({transactions.length}) &rarr;</span>
              </button>
            </div>

            <TransactionHistory limit={4} compact />
          </div>
        )}
      </div>
    </div>
  );
};
export default UserDashboardModal;
