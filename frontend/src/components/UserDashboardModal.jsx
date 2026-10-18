import React, { useState, useEffect } from 'react';
import KycVerificationModal from './KycVerificationModal';
import { useAuth } from '../context/AuthContext';

export default function UserDashboardModal() {
  const { user, isDashboardOpen, setIsDashboardOpen, wallets, setWallets } = useAuth();
  const [activeTab, setActiveTab] = useState('WALLETS');
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);
  const [liveInvestmentEarnings, setLiveInvestmentEarnings] = useState(6000.4520); // 'WALLETS', 'DEPOSIT', 'WITHDRAW', 'INVESTMENTS', 'REFERRALS'
  
  // Deposit form state
  const [depositData, setDepositData] = useState({
    walletType: 'INTERNAL',
    amount: '',
    currency: 'USDT',
    network: 'TRC20',
    txid: ''
  });
  const [depositMsg, setDepositMsg] = useState('');

  // Withdrawal form state
  const [withdrawData, setWithdrawData] = useState({
    walletType: 'INTERNAL',
    amount: '',
    currency: 'USDT',
    network: 'TRC20',
    toAddress: ''
  });
  const [withdrawMsg, setWithdrawMsg] = useState('');


  // Live ticker for user active investment yield
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveInvestmentEarnings(prev => prev + 0.006944); // 600 USDT / 86400 seconds
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isDashboardOpen || !user) return null;

  const handleDepositSubmit = (e) => {
    e.preventDefault();
    if (!depositData.txid || !depositData.amount) return;
    setDepositMsg('Deposit recorded with TXID. Will be credited to ledger upon blockchain verification.');
    setTimeout(() => {
      setDepositMsg('');
      setActiveTab('WALLETS');
    }, 2500);
  };

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    if (!withdrawData.toAddress || !withdrawData.amount) return;
    setWithdrawMsg('درخواست برداشت شما با موفقیت ثبت شد و در حال بررسی امنیتی است. این فرآیند ممکن است از ۱ ساعت تا ۴۸ ساعت زمان ببرد. پس از تایید نهایی مدیریت، وضعیت تراکنش به Successful تغییر خواهد یافت.');
    setTimeout(() => {
      setWithdrawMsg('');
      setActiveTab('WALLETS');
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <div className="glass-panel w-full max-w-5xl h-[90vh] rounded-3xl border border-white/20 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Dashboard Top Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-nile-accent to-emerald-400 text-nile-950 font-black text-2xl flex items-center justify-center">
              🐊
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-white">{user.firstName} {user.lastName}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {user.referralRank || 'BRONZE'} RANK
                </span>
                <button onClick={() => setIsKycModalOpen(true)} className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 transition-colors">
                  KYC {user.kycStatus || 'VERIFIED'} (تکمیل مدارک ↗)
                </button>
              </div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">
                Ref Code: <span className="text-nile-accent font-bold">{user.referralCode || 'NILE-PARSA'}</span> • {user.email}
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsDashboardOpen(false)}
            className="w-10 h-10 rounded-xl bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="px-6 py-3 border-b border-white/5 bg-slate-950/60 flex flex-wrap items-center gap-2 text-xs">
          {[
            { id: 'WALLETS', label: '💼 4 Wallets Ledger' },
            { id: 'DEPOSIT', label: '📥 Deposit Crypto (TXID)' },
            { id: 'WITHDRAW', label: '📤 Withdraw (4 Cycles/Day)' },
            { id: 'INVESTMENTS', label: '📈 Active Investments & Staking' },
            { id: 'REFERRALS', label: '👥 10-Level Referral Tree' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-nile-accent text-nile-950 shadow-md shadow-nile-accent/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="p-6 flex-1 overflow-y-auto">
          
          {/* TAB 1: 4 WALLETS LEDGER */}
          {activeTab === 'WALLETS' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* 1. Internal Wallet (Main) */}
                <div className="glass-panel p-5 rounded-2xl border-emerald-500/30 bg-slate-900/90">
                  <div className="text-xs text-slate-400 font-medium">1. Internal Wallet (Main)</div>
                  <div className="text-2xl font-black text-white mt-2">$12,450.00 <span className="text-xs font-normal text-slate-400">USDT</span></div>
                  <div className="text-xs text-nile-accent font-semibold mt-1">250,000 NILE Tokens</div>
                  <div className="mt-4 pt-3 border-t border-white/5 flex gap-2">
                    <button onClick={() => setActiveTab('DEPOSIT')} className="flex-1 py-1.5 text-[11px] font-bold bg-emerald-500/20 text-emerald-400 rounded-lg">Deposit</button>
                    <button onClick={() => setActiveTab('WITHDRAW')} className="flex-1 py-1.5 text-[11px] font-bold bg-slate-800 text-slate-300 rounded-lg">Withdraw</button>
                  </div>
                </div>

                {/* 2. Investment Wallet */}
                <div className="glass-panel p-5 rounded-2xl border-cyan-500/30 bg-slate-900/90">
                  <div className="text-xs text-slate-400 font-medium">2. Investment Wallet</div>
                  <div className="text-2xl font-black text-cyan-400 mt-2">$5,000.00 <span className="text-xs font-normal text-slate-400">USDT</span></div>
                  <div className="text-xs text-slate-400 mt-1">Active in Plan 3 (Apex Tier)</div>
                  <div className="mt-4 pt-3 border-t border-white/5">
                    <span className="text-[11px] text-emerald-400 font-bold">Daily Earnings: +$600.00/day</span>
                  </div>
                </div>

                {/* 3. Referral Wallet */}
                <div className="glass-panel p-5 rounded-2xl border-amber-500/30 bg-slate-900/90">
                  <div className="text-xs text-slate-400 font-medium">3. Referral Wallet</div>
                  <div className="text-2xl font-black text-amber-400 mt-2">$1,840.50 <span className="text-xs font-normal text-slate-400">USDT</span></div>
                  <div className="text-xs text-amber-300/80 mt-1">🔒 Must reinvest to withdraw</div>
                  <div className="mt-4 pt-3 border-t border-white/5">
                    <button onClick={() => setActiveTab('REFERRALS')} className="w-full py-1.5 text-[11px] font-bold bg-amber-500/20 text-amber-300 rounded-lg">Reinvest to Unlock</button>
                  </div>
                </div>

                {/* 4. Shop Wallet */}
                <div className="glass-panel p-5 rounded-2xl border-purple-500/30 bg-slate-900/90">
                  <div className="text-xs text-slate-400 font-medium">4. Shop Wallet</div>
                  <div className="text-2xl font-black text-purple-400 mt-2">$450.00 <span className="text-xs font-normal text-slate-400">USDT</span></div>
                  <div className="text-xs text-slate-400 mt-1">For Digital Goods & Cards</div>
                  <div className="mt-4 pt-3 border-t border-white/5">
                    <a href="#marketplace" onClick={() => setIsDashboardOpen(false)} className="block text-center py-1.5 text-[11px] font-bold bg-purple-500/20 text-purple-300 rounded-lg">Browse Shop</a>
                  </div>
                </div>

              </div>

              {/* Recent Ledger Logs Mockup */}
              <div className="glass-panel rounded-2xl p-5 border border-white/5">
                <h4 className="text-sm font-bold text-white mb-3">Recent Ledger Activity</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <div>
                      <span className="font-bold text-emerald-400">Daily Profit Credit (Plan 3 Apex)</span>
                      <span className="text-slate-500 text-[10px] block">2026-10-11 00:00 UTC • Automated Engine</span>
                    </div>
                    <span className="font-bold text-emerald-400">+$600.00 USDT</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <div>
                      <span className="font-bold text-amber-400">Referral Level 1 Commission</span>
                      <span className="text-slate-500 text-[10px] block">2026-10-10 18:42 UTC • User #4912</span>
                    </div>
                    <span className="font-bold text-amber-400">+$100.00 USDT</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <div>
                      <span className="font-bold text-cyan-400">Crypto Deposit (TRC20)</span>
                      <span className="text-slate-500 text-[10px] block">TXID: 8fa92b... confirmed by admin</span>
                    </div>
                    <span className="font-bold text-white">+$5,000.00 USDT</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DEPOSIT CRYPTO (TXID) */}
          {activeTab === 'DEPOSIT' && (
            <div className="max-w-xl mx-auto space-y-6">
              <div className="glass-panel p-6 rounded-3xl border border-white/10">
                <h4 className="text-base font-bold text-white mb-2">Deposit Crypto to Platform Wallets</h4>
                <p className="text-xs text-slate-400 mb-6">
                  Send your cryptocurrency to our cold institutional address and submit your transaction hash (TXID).
                </p>

                {depositMsg && (
                  <div className="p-3 mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                    ✓ {depositMsg}
                  </div>
                )}

                <form onSubmit={handleDepositSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Destination Ledger Wallet</label>
                    <select
                      value={depositData.walletType}
                      onChange={(e) => setDepositData({ ...depositData, walletType: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                    >
                      <option value="INTERNAL">Internal Wallet (Main Balance)</option>
                      <option value="SHOP">Shop Wallet (Digital Goods)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Currency</label>
                      <select
                        value={depositData.currency}
                        onChange={(e) => setDepositData({ ...depositData, currency: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                      >
                        <option value="USDT">USDT</option>
                        <option value="NILE">NILE Token</option>
                        <option value="BTC">Bitcoin (BTC)</option>
                        <option value="ETH">Ethereum (ETH)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Network</label>
                      <select
                        value={depositData.network}
                        onChange={(e) => setDepositData({ ...depositData, network: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                      >
                        <option value="TRC20">TRON (TRC20) — Recommended</option>
                        <option value="BEP20">BNB Chain (BEP20)</option>
                        <option value="ERC20">Ethereum (ERC20)</option>
                        <option value="SOLANA">Solana Network</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/90 border border-white/5 space-y-2">
                    <span className="text-[11px] text-slate-400 block font-semibold">Official Deposit Receiving Address ({depositData.network}):</span>
                    <div className="font-mono text-xs text-nile-accent break-all p-2 rounded bg-slate-950 select-all border border-nile-accent/20">
                      TXn9Z8NileInvestmentTreasuryTRC20Vault77xx
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Amount Deposited</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 500"
                      value={depositData.amount}
                      onChange={(e) => setDepositData({ ...depositData, amount: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">On-Chain Transaction Hash (TXID)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a..."
                      value={depositData.txid}
                      onChange={(e) => setDepositData({ ...depositData, txid: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl font-bold bg-nile-accent text-nile-950 hover:bg-emerald-400 transition-colors"
                  >
                    Submit TXID for Verification
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 3: WITHDRAWAL (4 CYCLES/DAY) */}
          {activeTab === 'WITHDRAW' && (
            <div className="max-w-xl mx-auto space-y-6">
              <div className="glass-panel p-6 rounded-3xl border border-white/10">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-base font-bold text-white">Withdrawal System</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    4 Cycles Daily (Every 3h)
                  </span>
                </div>
                
                <p className="text-xs text-slate-400 mb-4">
                  Payouts are verified manually by compliance officers and broadcast to blockchain during 4 scheduled cycles.
                </p>

                {/* 4 Cycles Schedule Bar */}
                <div className="grid grid-cols-4 gap-2 mb-6 text-[10px] text-center">
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                    Cycle 1<br />00:00 - 03:00
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-white/5 text-slate-400">
                    Cycle 2<br />06:00 - 09:00
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-white/5 text-slate-400">
                    Cycle 3<br />12:00 - 15:00
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-white/5 text-slate-400">
                    Cycle 4<br />18:00 - 21:00
                  </div>
                </div>

                {withdrawMsg && (
                  <div className="p-3 mb-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
                    ✓ {withdrawMsg}
                  </div>
                )}

                <form onSubmit={handleWithdrawSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Source Wallet</label>
                    <select
                      value={withdrawData.walletType}
                      onChange={(e) => setWithdrawData({ ...withdrawData, walletType: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                    >
                      <option value="INTERNAL">Internal Wallet (Available: $12,450 USDT)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Recipient Crypto Address</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Txyz... (Your external wallet address)"
                      value={withdrawData.toAddress}
                      onChange={(e) => setWithdrawData({ ...withdrawData, toAddress: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Amount (USDT)</label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 250"
                        value={withdrawData.amount}
                        onChange={(e) => setWithdrawData({ ...withdrawData, amount: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Network</label>
                      <select
                        value={withdrawData.network}
                        onChange={(e) => setWithdrawData({ ...withdrawData, network: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                      >
                        <option value="TRC20">TRC20 (Fee: 1 USDT)</option>
                        <option value="BEP20">BEP20 (Fee: 0.5 USDT)</option>
                        <option value="ERC20">ERC20 (Fee: 5 USDT)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:brightness-110 transition-colors"
                  >
                    Request Payout in Next Cycle
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 4: ACTIVE INVESTMENTS & STAKING */}
          {activeTab === 'INVESTMENTS' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h4 className="text-base font-bold text-white">Active Deployments</h4>
                <a href="#plans" onClick={() => setIsDashboardOpen(false)} className="text-xs font-bold text-nile-accent hover:underline">
                  + Add New Investment Plan
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-panel p-5 rounded-2xl border border-nile-accent/30 bg-slate-900/90">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-bold text-nile-accent">Plan 3: Apex Tier ($10,000)</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">ACTIVE</span>
                  </div>
                  <div className="text-xl font-black text-white">$5,000.00 USDT</div>
                  <div className="text-xs text-slate-400 mt-1">Daily Yield: 12.0% ($600.00/day)</div>
                  <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-slate-400 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span>تاریخ شروع: ۲۰۲۶/۱۰/۰۱</span>
                      <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                        سود لایو: +${liveInvestmentEarnings.toFixed(4)} USDT
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 flex justify-between">
                      <span>نرخ سود لحظه‌ای: +۰.۰۰۶۹ تتر / ثانیه</span>
                      <span className="text-emerald-400 font-semibold">● در حال شمارش زنده</span>
                    </div>
                  </div>
                </div>

                <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 bg-slate-900/90">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-bold text-cyan-400">NILE Staking (50 Days)</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400">ACTIVE</span>
                  </div>
                  <div className="text-xl font-black text-white">250,000 NILE</div>
                  <div className="text-xs text-slate-400 mt-1">Bonus: +100% (+250,000 NILE at maturity)</div>
                  <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-slate-400 flex justify-between">
                    <span>Maturity: 2026-11-20</span>
                    <span className="text-cyan-300 font-bold">Total Return: 500,000 NILE</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: 10-LEVEL REFERRAL TREE */}
          {activeTab === 'REFERRALS' && (
            <div className="space-y-6">
              <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-bold text-white">Your Affiliate Link & Rank</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Share with partners to earn 10% down to 1% across 10 referral levels.</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-white/10 text-xs font-mono select-all">
                  <span>https://nileinvestment.com/r/{user.referralCode}</span>
                </div>
              </div>

              {/* 10 Level Breakdown Table */}
              <div className="glass-panel rounded-2xl p-5 border border-white/5 overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px]">
                      <th className="pb-3">Level</th>
                      <th className="pb-3">Commission Rate</th>
                      <th className="pb-3">Team Members</th>
                      <th className="pb-3">Total Earned</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <tr>
                      <td className="py-2.5 font-bold text-white">Level 1 (Direct)</td>
                      <td className="py-2.5 text-emerald-400 font-bold">10%</td>
                      <td className="py-2.5 text-slate-300">8 Members</td>
                      <td className="py-2.5 font-bold text-white">$1,200.00 USDT</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold text-white">Level 2</td>
                      <td className="py-2.5 text-emerald-400 font-bold">8%</td>
                      <td className="py-2.5 text-slate-300">14 Members</td>
                      <td className="py-2.5 font-bold text-white">$450.00 USDT</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold text-white">Level 3</td>
                      <td className="py-2.5 text-emerald-400 font-bold">6%</td>
                      <td className="py-2.5 text-slate-300">22 Members</td>
                      <td className="py-2.5 font-bold text-white">$190.50 USDT</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold text-white">Levels 4 – 10</td>
                      <td className="py-2.5 text-cyan-400 font-bold">5% down to 1%</td>
                      <td className="py-2.5 text-slate-300">65 Members</td>
                      <td className="py-2.5 font-bold text-white">Tracking active</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      </div>
      <KycVerificationModal isOpen={isKycModalOpen} onClose={() => setIsKycModalOpen(false)} />
    </div>
  );
}
