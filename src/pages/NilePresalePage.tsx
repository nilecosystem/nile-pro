import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { 
  Flame, 
  Wallet, 
  Coins, 
  ShieldCheck, 
  ExternalLink, 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  AlertTriangle,
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { NileTokenCoin } from '../components/NileTokenCoin.tsx';

export const NilePresalePage: React.FC = () => {
  const { 
    presalePhases, 
    presalePurchases, 
    participateInPresale, 
    user, 
    depositWallets 
  } = useApp();

  const [selectedPhaseId, setSelectedPhaseId] = useState<number>(1);
  const [purchaseAmountUsd, setPurchaseAmountUsd] = useState<number>(1000);
  const [paymentAsset, setPaymentAsset] = useState<'ETH' | 'BNB' | 'USDT' | 'USDC' | 'BTC' | 'SOL' | 'TRX'>('USDT');
  const [walletConnected, setWalletConnected] = useState<boolean>(true);
  const [connectedAddress, setConnectedAddress] = useState<string>('0x9ad1Faa6d1DBDC047001b16eA1ced073a6058399');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const selectedPhase = presalePhases.find(p => p.id === selectedPhaseId) || presalePhases[0];
  const percentSold = ((selectedPhase.soldAllocation / selectedPhase.totalAllocation) * 100).toFixed(1);
  const tokenAmount = Math.floor(purchaseAmountUsd / selectedPhase.tokenPriceUsd);

  const handleBuy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletConnected) {
      setWalletConnected(true);
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const network = paymentAsset === 'TRX' ? 'TRON (TRC20)' : paymentAsset === 'SOL' ? 'Solana SPL' : paymentAsset === 'BNB' ? 'BNB Chain' : 'Ethereum (ERC20)';
      const success = participateInPresale(selectedPhase.id, purchaseAmountUsd, paymentAsset, network);
      if (success) {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Presale Header with 3D Glowing Gold Horus Coin */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-[#0c1630] via-[#091124] to-[#040814] border border-[#E5B842]/50 shadow-2xl relative overflow-hidden text-center max-w-4xl mx-auto">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#E5B842]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center space-y-4">
          {/* Floating 3D Gold Horus Coin Centerpiece */}
          <div className="p-2 rounded-full bg-gradient-to-tr from-[#E5B842]/30 via-transparent to-cyan-400/20 shadow-2xl">
            <NileTokenCoin size="hero" animate={true} />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>PHASE 1 PUBLIC SEED ACTIVE</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-300 font-mono">15% TGE UNLOCK</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Official <span className="bg-gradient-to-r from-[#FFF2A3] via-[#E5B842] to-[#F3BA2F] bg-clip-text text-transparent">NILE</span> Token Presale
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
            Participate directly in the foundation round. Confirmed smart contract allocations with automated 15% TGE claim and transparent linear vesting on-chain.
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-2 grid grid-cols-3 gap-6 sm:gap-12 border-t border-slate-800/80 w-full max-w-md">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Native Token</div>
              <div className="text-sm sm:text-base font-black text-white font-mono mt-0.5">NILE (BEP-20 / ERC-20)</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Current Price</div>
              <div className="text-sm sm:text-base font-black text-emerald-400 font-mono mt-0.5">${selectedPhase.tokenPriceUsd}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Supply</div>
              <div className="text-sm sm:text-base font-black text-[#E5B842] font-mono mt-0.5">500,000,000</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Presale Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Purchase Card */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#091124] border border-[#E5B842]/40 shadow-2xl space-y-6">
          {/* Phase Selector Tabs */}
          <div className="grid grid-cols-3 gap-2">
            {presalePhases.map(phase => (
              <button
                key={phase.id}
                onClick={() => setSelectedPhaseId(phase.id)}
                className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                  selectedPhaseId === phase.id
                    ? 'border-[#E5B842] bg-[#E5B842]/10 text-white shadow-md'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <div className="font-bold text-xs truncate">{phase.name.split(':')[0]}</div>
                  <NileTokenCoin size="xs" />
                </div>
                <div className="text-emerald-400 font-mono font-bold text-sm">${phase.tokenPriceUsd}</div>
                <div className="text-[10px] text-slate-500 capitalize">{phase.status}</div>
              </button>
            ))}
          </div>

          {/* Phase Progress details */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Total Round Allocation:</span>
              <span className="font-mono font-bold text-white">{selectedPhase.totalAllocation.toLocaleString()} NILE</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Confirmed Sold:</span>
              <span className="font-mono font-bold text-[#E5B842]">{selectedPhase.soldAllocation.toLocaleString()} NILE ({percentSold}%)</span>
            </div>

            <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
              <div 
                className="h-full bg-gradient-to-r from-[#E5B842] to-[#00F0FF] rounded-full transition-all duration-700"
                style={{ width: `${percentSold}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Remaining: {(selectedPhase.totalAllocation - selectedPhase.soldAllocation).toLocaleString()} NILE</span>
              <span>Ends: {selectedPhase.endDate}</span>
            </div>
          </div>

          {/* Purchase Form */}
          <form onSubmit={handleBuy} className="space-y-4 text-xs">
            {/* Payment Asset Selector */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Select Payment Asset</label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                {(['USDT', 'ETH', 'BNB', 'SOL', 'BTC', 'USDC', 'TRX'] as const).map(asset => (
                  <button
                    type="button"
                    key={asset}
                    onClick={() => setPaymentAsset(asset)}
                    className={`py-2 rounded-xl font-bold transition-colors ${
                      paymentAsset === asset 
                        ? 'bg-[#E5B842] text-[#070D1B]' 
                        : 'bg-slate-900 border border-slate-800 text-slate-300'
                    }`}
                  >
                    {asset}
                  </button>
                ))}
              </div>
            </div>

            {/* USD Amount Input */}
            <div>
              <div className="flex items-center justify-between text-slate-300 font-semibold mb-1">
                <span>Enter Amount in USD</span>
                <span className="text-slate-500 font-normal">Min: ${selectedPhase.minPurchaseUsd} · Max: ${selectedPhase.maxPurchaseUsd.toLocaleString()}</span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-3 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  value={purchaseAmountUsd}
                  onChange={(e) => setPurchaseAmountUsd(Number(e.target.value))}
                  min={selectedPhase.minPurchaseUsd}
                  max={selectedPhase.maxPurchaseUsd}
                  required
                  className="w-full pl-8 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-base font-bold focus:outline-none focus:border-[#E5B842]"
                />
              </div>
            </div>

            {/* Calculation Output with 3D Coin Badge */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#070D1B] border border-[#E5B842]/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <NileTokenCoin size="sm" animate={true} />
                  <div>
                    <span className="text-xs text-slate-300 font-semibold block">Total Allocation:</span>
                    <span className="text-[10px] text-slate-500">Official Smart Contract Token</span>
                  </div>
                </div>
                <span className="text-xl sm:text-2xl font-black text-[#E5B842] font-mono">
                  {tokenAmount.toLocaleString()} NILE
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                <span>Immediate Claim at TGE (15%):</span>
                <span className="font-mono text-emerald-400 font-bold">{Math.floor(tokenAmount * 0.15).toLocaleString()} NILE</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Linear Vesting over 9 months (85%):</span>
                <span className="font-mono text-white font-semibold">{Math.floor(tokenAmount * 0.85).toLocaleString()} NILE</span>
              </div>
            </div>

            {/* Wallet Status */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-[#E5B842]" />
                <span className="text-slate-300">Connected Wallet:</span>
              </div>
              <span className="font-mono text-slate-200 font-semibold">{connectedAddress.substring(0, 8)}...{connectedAddress.substring(36)}</span>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] font-extrabold text-sm shadow-xl hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#070D1B] border-t-transparent rounded-full animate-spin" />
                  <span>Validating Chain Transaction...</span>
                </div>
              ) : (
                <span>Confirm Purchase & Allocate NILE</span>
              )}
            </button>
          </form>
        </div>

        {/* Right: Terms, Purchase History & Vesting */}
        <div className="lg:col-span-5 space-y-6">
          {/* Sale Terms & Protection */}
          <div className="p-6 rounded-3xl bg-[#091124] border border-slate-800 space-y-3 text-xs">
            <h4 className="font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Smart Contract Security & Terms</span>
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Audited OpenZeppelin token standard with reentrancy shielding.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>No private key or seed phrase storage in frontend; non-custodial Web3 signing.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Idempotent transaction handlers preventing double claims or allocation desync.</span>
              </li>
            </ul>
          </div>

          {/* Your Confirmed Presale Holdings */}
          <div className="p-6 rounded-3xl bg-[#091124] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white">Your Confirmed Presale Purchases</h4>
              <span className="text-xs text-[#E5B842] font-mono">{presalePurchases.length} Records</span>
            </div>

            {presalePurchases.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500">
                No presale purchases recorded yet on this account.
              </div>
            ) : (
              <div className="space-y-3">
                {presalePurchases.map(p => (
                  <div key={p.id} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">Phase {p.phaseId} Purchase</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                        CONFIRMED
                      </span>
                    </div>
                    <div className="flex items-center justify-between font-mono">
                      <span className="text-slate-400">Paid ${p.amountUsd} ({p.paymentAsset})</span>
                      <span className="text-[#E5B842] font-bold flex items-center gap-1.5">
                        <NileTokenCoin size="xs" />
                        <span>+{p.nileTokens.toLocaleString()} NILE</span>
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 truncate font-mono">
                      Tx: {p.txHash}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
