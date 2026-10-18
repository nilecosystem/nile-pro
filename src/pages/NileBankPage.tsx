import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { 
  Building2, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Send, 
  CreditCard, 
  ShieldCheck, 
  Download, 
  Copy, 
  Check, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { NileTokenCoin } from '../components/NileTokenCoin.tsx';

export const NileBankPage: React.FC = () => {
  const { 
    user, 
    balances, 
    cards, 
    transactions, 
    addTransaction, 
    depositWallets, 
    setActiveTab, 
    kycPermissions,
    showToast 
  } = useApp();

  const [activeCurrency, setActiveCurrency] = useState<'USD' | 'EUR' | 'GBP' | 'BTC' | 'ETH' | 'USDT'>('USD');
  const [modalType, setModalType] = useState<'withdraw' | 'deposit' | 'transfer' | null>(null);

  // Withdrawal form
  const [withdrawAmount, setWithdrawAmount] = useState<number>(20000);
  const [withdrawMethod, setWithdrawMethod] = useState<'Bank' | 'Crypto'>('Bank');
  const [bankName, setBankName] = useState('Barclays Bank UK');
  const [iban, setIban] = useState('GB82BARC20000084291647');
  const [swift, setSwift] = useState('BARCGB22');
  const [withdrawNote, setWithdrawNote] = useState('Corporate dividend payout');

  // Transfer form
  const [transferRecipient, setTransferRecipient] = useState('');
  const [transferAmount, setTransferAmount] = useState<number>(5000);
  const [transferCurrency, setTransferCurrency] = useState('USD');

  // Deposit form
  const [depositAsset, setDepositAsset] = useState<'BTC' | 'ETH' | 'USDT' | 'SOL'>('USDT');
  const [copied, setCopied] = useState(false);

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount <= 0) return;

    if (!kycPermissions.canWithdrawFiat && withdrawMethod === 'Bank') {
      showToast('Fiat bank withdrawals require verified KYC status. Please complete verification in the KYC Portal.', 'error');
      return;
    }

    if (withdrawAmount > kycPermissions.maxDailyWithdrawalUsd) {
      showToast(`Requested withdrawal exceeds your daily limit of $${kycPermissions.maxDailyWithdrawalUsd.toLocaleString()} USD based on your current KYC tier.`, 'error');
      return;
    }

    addTransaction({
      type: 'withdrawal',
      amount: withdrawAmount,
      currency: 'USD',
      status: 'pending',
      recipientOrDetails: withdrawMethod === 'Bank' ? `${bankName} (${iban.substring(0, 8)}••)` : 'External Crypto Wallet',
      fee: withdrawMethod === 'Bank' ? 15 : 5
    });

    setModalType(null);
    showToast(`Withdrawal request of $${withdrawAmount.toLocaleString()} submitted for compliance settlement.`, 'success');
  };

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (transferAmount <= 0 || !transferRecipient) return;

    addTransaction({
      type: 'transfer',
      amount: transferAmount,
      currency: transferCurrency,
      status: 'confirmed',
      recipientOrDetails: `Internal transfer to account ${transferRecipient}`
    });

    setModalType(null);
    showToast(`Transferred $${transferAmount.toLocaleString()} to ${transferRecipient} instantly.`, 'success');
  };

  const getDepositAddress = () => {
    switch (depositAsset) {
      case 'BTC': return depositWallets.BTC_1;
      case 'ETH': return depositWallets.ETH_BNB;
      case 'USDT': return depositWallets.TRON;
      case 'SOL': return depositWallets.SOLANA_1;
      default: return depositWallets.ETH_BNB;
    }
  };

  const copyDepositAddr = () => {
    navigator.clipboard.writeText(getDepositAddress());
    setCopied(true);
    showToast('Deposit address copied', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const exportStatementsCsv = () => {
    const headers = 'ID,Type,Amount,Currency,Status,Recipient/Details,Timestamp\n';
    const rows = transactions.map(t => 
      `"${t.id}","${t.type}","${t.amount}","${t.currency}","${t.status}","${t.recipientOrDetails || ''}","${t.timestamp}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NCB-Statement-${user.accountNumber}.csv`;
    a.click();
    showToast('Downloaded official account statement.', 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banking Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-[#091124] border border-slate-800 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#E5B842]/10 border border-[#E5B842]/40 flex items-center justify-center text-[#E5B842]">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">Nile Crypto Bank</h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                Tier 3 Verified
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Account Holder: <strong className="text-slate-200">{user.name}</strong> · Account No: <strong className="text-slate-200 font-mono">{user.accountNumber}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportStatementsCsv}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Statement</span>
          </button>
          <button
            onClick={() => setActiveTab('cards')}
            className="px-4 py-2 rounded-xl bg-[#E5B842] hover:bg-[#F3BA2F] text-[#070D1B] text-xs font-extrabold flex items-center gap-1.5 transition-colors shadow"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Manage Cards</span>
          </button>
        </div>
      </div>

      {/* Main Balance Canvas & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Balance Card (inspired by mobile banking video: $2,000,000 USD, Income $2.27M, Expenses $270k) */}
        <div className="lg:col-span-8 p-8 rounded-3xl bg-gradient-to-br from-[#0c1630] via-[#091124] to-[#060b17] border border-[#E5B842]/30 shadow-2xl space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Available Liquidity</span>
            <span className="font-mono text-emerald-400 font-semibold">Active Vault Reserve</span>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-5xl font-black text-white font-mono tracking-tight">
              ${balances.USD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              <span className="text-lg text-slate-400 font-sans font-bold ml-2">USD</span>
            </div>
            <div className="text-xs text-slate-400">
              Equivalent to ≈ {(balances.USD / 68420).toFixed(2)} BTC · {(balances.USD / 3580).toFixed(1)} ETH
            </div>
          </div>

          {/* 3 Prominent Quick Action Buttons */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <button
              onClick={() => setModalType('withdraw')}
              className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-[#E5B842] hover:bg-slate-800 transition-all flex flex-col items-center justify-center gap-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-[#E5B842] flex items-center justify-center group-hover:scale-110 transition-transform">
                <ArrowUpRight className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white">Withdraw</span>
            </button>

            <button
              onClick={() => setModalType('deposit')}
              className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500 hover:bg-slate-800 transition-all flex flex-col items-center justify-center gap-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ArrowDownLeft className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white">Deposit</span>
            </button>

            <button
              onClick={() => setModalType('transfer')}
              className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500 hover:bg-slate-800 transition-all flex flex-col items-center justify-center gap-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Send className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white">Transfer</span>
            </button>
          </div>

          {/* Income & Expense Metrics */}
          <div className="pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="text-xs text-slate-400">Total Income (LFY)</div>
              <div className="text-xl font-bold text-emerald-400 font-mono mt-1">$2.27M</div>
              <div className="text-[10px] text-emerald-500 mt-0.5">+4.5% vs previous quarter</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="text-xs text-slate-400">Total Expenses & Payouts</div>
              <div className="text-xl font-bold text-slate-200 font-mono mt-1">$270.0k</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Card spend & wire settlements</div>
            </div>
          </div>
        </div>

        {/* Currency & Digital Assets Breakdown */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-[#091124] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Multi-Asset Balances</h3>
            <span className="text-xs text-[#E5B842] font-semibold">Live Quotes</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-white">United States Dollar</div>
                <div className="text-[11px] text-slate-400">Fiat Primary Reserve</div>
              </div>
              <div className="text-right font-mono font-bold text-slate-100">
                ${balances.USD.toLocaleString()} USD
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-white">Euro Currency</div>
                <div className="text-[11px] text-slate-400">Schengen Settlement</div>
              </div>
              <div className="text-right font-mono font-bold text-slate-100">
                €{balances.EUR.toLocaleString()} EUR
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-white">British Pound Sterling</div>
                <div className="text-[11px] text-slate-400">UK Domestic Wire</div>
              </div>
              <div className="text-right font-mono font-bold text-slate-100">
                £{balances.GBP.toLocaleString()} GBP
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-white">Bitcoin (BTC)</div>
                <div className="text-[11px] text-slate-400">Native SegWit Reserve</div>
              </div>
              <div className="text-right font-mono font-bold text-amber-400">
                {balances.BTC} BTC
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-white">Ethereum (ETH)</div>
                <div className="text-[11px] text-slate-400">Layer 1 Collateral</div>
              </div>
              <div className="text-right font-mono font-bold text-blue-400">
                {balances.ETH} ETH
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <NileTokenCoin size="xs" />
                <div>
                  <div className="font-bold text-white">NILE Ecosystem Token</div>
                  <div className="text-[11px] text-slate-400">Governance & Multipliers</div>
                </div>
              </div>
              <div className="text-right font-mono font-bold text-[#E5B842]">
                {balances.NILE.toLocaleString()} NILE
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Linked Cards Quick Strip */}
      <div className="p-6 rounded-3xl bg-[#091124] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Active Payment Cards</h3>
            <p className="text-xs text-slate-400">3 cards linked to account holder Matin Parsa</p>
          </div>
          <button 
            onClick={() => setActiveTab('cards')}
            className="text-xs font-bold text-[#E5B842] hover:underline"
          >
            Order New Card / View All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cards.map(card => (
            <div key={card.id} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">{card.tier} {card.type.toUpperCase()}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${card.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  {card.status.toUpperCase()}
                </span>
              </div>
              <div className="font-mono text-sm tracking-widest text-slate-300 font-bold">
                {card.cardNumberMasked}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                <span>Balance: <strong className="text-white">${card.balance.toLocaleString()}</strong></span>
                <span className="text-emerald-400 font-semibold">{card.cashbackRate}% Cashback</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction History Ledger */}
      <div className="p-6 rounded-3xl bg-[#091124] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Recent Transactions & Ledger</h3>
          <span className="text-xs text-slate-400">Real-Time Audited Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Reference</th>
                <th className="p-3">Type</th>
                <th className="p-3">Details</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {transactions.map(t => (
                <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-mono font-bold text-white">{t.id}</td>
                  <td className="p-3 capitalize font-semibold">{t.type.replace('_', ' ')}</td>
                  <td className="p-3 text-slate-400 max-w-xs truncate">{t.recipientOrDetails || t.network || 'General Treasury'}</td>
                  <td className="p-3 font-mono font-bold text-slate-100">
                    {t.type === 'withdrawal' || t.type === 'marketplace_order' ? '-' : '+'}
                    {t.amount.toLocaleString()} {t.currency}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      t.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {t.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400">{t.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Withdrawal Request (Exact fields from user screenshot) */}
      {modalType === 'withdraw' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#091124] border border-[#E5B842]/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Withdrawal Request</h3>
              <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleWithdraw} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Amount (USD)</label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono font-bold focus:outline-none focus:border-[#E5B842]"
                />
                {/* Quick amount chips */}
                <div className="flex items-center gap-2 mt-2">
                  {[100, 200, 1000, 20000].map(amt => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => setWithdrawAmount(amt)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px]"
                    >
                      ${amt.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Withdrawal Method</label>
                <select
                  value={withdrawMethod}
                  onChange={(e) => setWithdrawMethod(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-[#E5B842]"
                >
                  <option value="Bank">Bank Wire Transfer (SWIFT / SEPA)</option>
                  <option value="Crypto">Cryptocurrency Payout (USDT / BTC / ETH)</option>
                </select>
              </div>

              {withdrawMethod === 'Bank' ? (
                <>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Bank Name</label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      required
                      placeholder="e.g. Barclays Bank UK"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-[#E5B842]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Account Number / IBAN</label>
                    <input
                      type="text"
                      value={iban}
                      onChange={(e) => setIban(e.target.value)}
                      required
                      placeholder="GB82BARC..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono focus:outline-none focus:border-[#E5B842]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">SWIFT / BIC Code</label>
                    <input
                      type="text"
                      value={swift}
                      onChange={(e) => setSwift(e.target.value)}
                      required
                      placeholder="BARCGB22"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono focus:outline-none focus:border-[#E5B842]"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Destination Crypto Address</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter destination wallet address"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono focus:outline-none focus:border-[#E5B842]"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Note (Optional)</label>
                <input
                  type="text"
                  value={withdrawNote}
                  onChange={(e) => setWithdrawNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-[#E5B842]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#E5B842] text-[#070D1B] font-bold text-xs hover:bg-[#F3BA2F] transition-colors shadow"
              >
                Confirm & Submit Withdrawal
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Deposit */}
      {modalType === 'deposit' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#091124] border border-emerald-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Deposit Digital Assets</h3>
              <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Select Asset</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['USDT', 'BTC', 'ETH', 'SOL'] as const).map(asset => (
                    <button
                      key={asset}
                      onClick={() => setDepositAsset(asset)}
                      className={`py-2 rounded-xl font-bold transition-colors ${
                        depositAsset === asset ? 'bg-[#E5B842] text-[#070D1B]' : 'bg-slate-900 text-slate-300'
                      }`}
                    >
                      {asset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#070D1B] border border-slate-800 space-y-2 text-center">
                <div className="text-[11px] text-slate-400">Your Official Receiving Address</div>
                <div className="p-2.5 rounded-xl bg-slate-900 font-mono text-xs text-[#E5B842] break-all border border-slate-800">
                  {getDepositAddress()}
                </div>
                <button
                  onClick={copyDepositAddr}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold flex items-center justify-center gap-1.5 mx-auto transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied' : 'Copy Address'}</span>
                </button>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] leading-relaxed">
                Ensure you send funds only over the correct matching network. Deposits credit automatically after required network confirmations.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Internal Transfer */}
      {modalType === 'transfer' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#091124] border border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Instant Internal Transfer</h3>
              <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleTransfer} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Recipient Account Number / Email</label>
                <input
                  type="text"
                  value={transferRecipient}
                  onChange={(e) => setTransferRecipient(e.target.value)}
                  required
                  placeholder="e.g. NCB-1647569269 or client@nileecosystem.com"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Amount</label>
                <input
                  type="number"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono font-bold focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px]">
                Internal transfers between Nile accounts settle instantly with 0.00% network commission.
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#070D1B] font-bold text-xs transition-colors shadow"
              >
                Execute Transfer Instantly
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
