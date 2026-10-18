import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { INITIAL_DEX_TOKENS } from '../data/initialData.ts';
import { DexToken } from '../types/index.ts';
import { DexPriceChart } from '../components/DexPriceChart.tsx';
import { NileTokenCoin } from '../components/NileTokenCoin.tsx';
import { 
  ArrowDownUp, 
  Settings, 
  TrendingUp, 
  ExternalLink, 
  ShieldCheck, 
  Layers, 
  CheckCircle,
  AlertCircle,
  Zap,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Wallet
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const NileDexPage: React.FC = () => {
  const { balances, addTransaction, showToast } = useApp();

  const [fromToken, setFromToken] = useState<DexToken>(INITIAL_DEX_TOKENS[1]); // USDT
  const [toToken, setToToken] = useState<DexToken>(INITIAL_DEX_TOKENS[0]); // NILE
  const [fromAmount, setFromAmount] = useState<number>(500);
  const [slippage, setSlippage] = useState<number>(0.5);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [latestTxHash, setLatestTxHash] = useState<string | null>(null);

  // Synchronized chart token (defaults to NILE)
  const [chartToken, setChartToken] = useState<DexToken>(() => {
    return INITIAL_DEX_TOKENS.find(t => t.symbol === 'NILE') || INITIAL_DEX_TOKENS[0];
  });

  // Conversion math
  const exchangeRate = fromToken.priceUsd / toToken.priceUsd;
  const toAmount = (fromAmount * exchangeRate).toFixed(4);
  const minReceived = (Number(toAmount) * (1 - slippage / 100)).toFixed(4);
  const priceImpact = '0.04%';

  const handleSwapDirection = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    // Keep chart token in sync with the primary non-stable token
    if (temp.symbol !== 'USDT') {
      setChartToken(temp);
    } else if (fromToken.symbol !== 'USDT') {
      setChartToken(fromToken);
    }
  };

  const handleSelectChartToken = (token: DexToken) => {
    setChartToken(token);
    // If not already in the pair, set as toToken
    if (toToken.symbol !== token.symbol && fromToken.symbol !== token.symbol) {
      setToToken(token);
    }
  };

  const handleSelectPair = (baseSymbol: string, quoteSymbol: string) => {
    const base = INITIAL_DEX_TOKENS.find(t => t.symbol === baseSymbol);
    const quote = INITIAL_DEX_TOKENS.find(t => t.symbol === quoteSymbol);
    if (base && quote) {
      setFromToken(quote);
      setToToken(base);
      setChartToken(base);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const setQuickAmount = (usdValue: number) => {
    const amount = fromToken.priceUsd > 0 ? usdValue / fromToken.priceUsd : usdValue;
    setFromAmount(Number(amount.toFixed(fromToken.priceUsd < 1 ? 2 : 4)));
  };

  const executeSwap = () => {
    if (fromAmount <= 0) {
      showToast('Please enter an amount greater than 0', 'error');
      return;
    }
    setIsSwapping(true);

    setTimeout(() => {
      setIsSwapping(false);
      const txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      setLatestTxHash(txHash);

      addTransaction({
        type: 'transfer',
        amount: fromAmount,
        currency: fromToken.symbol,
        status: 'confirmed',
        recipientOrDetails: `DEX Swap: ${fromAmount} ${fromToken.symbol} ➔ ${toAmount} ${toToken.symbol}`,
        txHash
      });

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });

      showToast(`Swapped ${fromAmount} ${fromToken.symbol} for ${toAmount} ${toToken.symbol}!`, 'success');
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* DEX Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              Decentralized AMM Terminal
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <span>Nile DEX Trading & Liquidity</span>
            <NileTokenCoin size="sm" animate />
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Trade native NILE, USDT, BTC, ETH, SOL, and TRX with zero gas slippage bottlenecks, 
            transparent liquidity pools, live interactive Recharts price feeds, and non-custodial settlement.
          </p>
        </div>

        {/* Global DEX Stats ticker */}
        <div className="flex items-center gap-4 bg-[#091124] border border-slate-800 px-4 py-2.5 rounded-2xl text-xs shrink-0">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-mono">Total Volume 24h</div>
            <div className="font-mono font-black text-[#E5B842]">$4,852,190 USD</div>
          </div>
          <div className="w-[1px] h-8 bg-slate-800" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-mono">NILE TVL</div>
            <div className="font-mono font-black text-emerald-400">$18,450,000</div>
          </div>
        </div>
      </div>

      {/* Main Trading Area: 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Chart & Market Stats): 7 or 8 cols */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {/* Recharts Price History Visualizer */}
          <DexPriceChart
            selectedToken={chartToken}
            onSelectToken={handleSelectChartToken}
            availableTokens={INITIAL_DEX_TOKENS.filter(t => t.symbol !== 'USDT')}
          />

          {/* Real-time Order Book & Recent Swaps Activity Feed */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#091124] border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin-slow" />
                <h3 className="text-sm font-bold text-white">Live On-Chain AMM Swaps Activity</h3>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Network Block #19842104
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase font-mono">
                    <th className="pb-2.5">Pair</th>
                    <th className="pb-2.5">Type</th>
                    <th className="pb-2.5">Order Size</th>
                    <th className="pb-2.5">Execution Price</th>
                    <th className="pb-2.5 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  <tr className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-2.5 font-bold text-white flex items-center gap-1.5">
                      <NileTokenCoin size="xs" />
                      <span>NILE/USDT</span>
                    </td>
                    <td className="py-2.5 text-emerald-400 font-bold">BUY</td>
                    <td className="py-2.5 text-slate-200">25,000 NILE ($3,000)</td>
                    <td className="py-2.5 text-[#E5B842] font-bold">$0.1200</td>
                    <td className="py-2.5 text-right text-slate-400">12s ago</td>
                  </tr>
                  <tr className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-2.5 font-bold text-white">ETH/USDT</td>
                    <td className="py-2.5 text-emerald-400 font-bold">BUY</td>
                    <td className="py-2.5 text-slate-200">1.85 ETH ($6,623)</td>
                    <td className="py-2.5 text-blue-400 font-bold">$3,580.00</td>
                    <td className="py-2.5 text-right text-slate-400">38s ago</td>
                  </tr>
                  <tr className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-2.5 font-bold text-white flex items-center gap-1.5">
                      <NileTokenCoin size="xs" />
                      <span>NILE/USDT</span>
                    </td>
                    <td className="py-2.5 text-emerald-400 font-bold">BUY</td>
                    <td className="py-2.5 text-slate-200">50,000 NILE ($6,000)</td>
                    <td className="py-2.5 text-[#E5B842] font-bold">$0.1200</td>
                    <td className="py-2.5 text-right text-slate-400">1m ago</td>
                  </tr>
                  <tr className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-2.5 font-bold text-white">BTC/USDT</td>
                    <td className="py-2.5 text-rose-400 font-bold">SELL</td>
                    <td className="py-2.5 text-slate-200">0.25 BTC ($17,105)</td>
                    <td className="py-2.5 text-amber-400 font-bold">$68,420.00</td>
                    <td className="py-2.5 text-right text-slate-400">2m ago</td>
                  </tr>
                  <tr className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-2.5 font-bold text-white">SOL/USDT</td>
                    <td className="py-2.5 text-emerald-400 font-bold">BUY</td>
                    <td className="py-2.5 text-slate-200">42 SOL ($7,476)</td>
                    <td className="py-2.5 text-purple-400 font-bold">$178.00</td>
                    <td className="py-2.5 text-right text-slate-400">3m ago</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (Instant Swap Execution Card): 5 or 4 cols */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4">
          <div className="relative p-6 sm:p-7 rounded-3xl bg-[#091124] border border-slate-800 shadow-2xl space-y-4">
            {/* Top Controls */}
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-white">Instant AMM Swap</span>
                <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Fast 0.05s
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">Slip: {slippage}%</span>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  aria-label="Swap Settings"
                  className={`p-1.5 rounded-lg transition-colors ${
                    showSettings ? 'bg-[#E5B842] text-[#070D1B]' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Slippage Settings Panel */}
            {showSettings && (
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                <div className="font-semibold text-slate-300">Slippage Tolerance</div>
                <div className="flex items-center gap-2">
                  {[0.1, 0.5, 1.0].map(s => (
                    <button
                      key={s}
                      onClick={() => setSlippage(s)}
                      className={`px-3 py-1 rounded-lg font-mono font-bold transition-colors ${
                        slippage === s ? 'bg-[#E5B842] text-[#070D1B]' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {s}%
                    </button>
                  ))}
                  <input
                    type="number"
                    step="0.1"
                    value={slippage}
                    onChange={(e) => setSlippage(Number(e.target.value))}
                    className="w-16 px-2 py-1 rounded-lg bg-slate-800 text-white font-mono text-center focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Quick Amount Presets */}
            <div className="flex items-center gap-1.5 pb-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold mr-1">Quick:</span>
              {[100, 250, 500, 1000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setQuickAmount(amt)}
                  className="px-2.5 py-0.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-[11px] font-mono text-slate-300 font-semibold transition-colors"
                >
                  ${amt}
                </button>
              ))}
            </div>

            {/* Pay Box */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 focus-within:border-cyan-500/50 transition-colors">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-medium">You Pay</span>
                <span className="font-mono text-[11px]">
                  Balance: {fromToken.balance || 0} {fromToken.symbol}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <input
                  type="number"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(Number(e.target.value))}
                  className="w-full bg-transparent text-2xl font-black text-white font-mono focus:outline-none"
                  placeholder="0.0"
                />

                <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl shrink-0">
                  {fromToken.symbol === 'NILE' ? (
                    <NileTokenCoin size="xs" />
                  ) : (
                    <div 
                      className="w-4 h-4 rounded-full flex items-center justify-center font-bold text-[9px] text-white"
                      style={{ backgroundColor: fromToken.iconBg || '#2563EB' }}
                    >
                      {fromToken.symbol.slice(0, 1)}
                    </div>
                  )}
                  <select
                    value={fromToken.symbol}
                    onChange={(e) => {
                      const token = INITIAL_DEX_TOKENS.find(t => t.symbol === e.target.value) || fromToken;
                      setFromToken(token);
                      if (token.symbol !== 'USDT') setChartToken(token);
                    }}
                    className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
                  >
                    {INITIAL_DEX_TOKENS.map(t => (
                      <option key={t.symbol} value={t.symbol} className="bg-slate-900 text-white">
                        {t.symbol}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 font-mono">
                ≈ ${(fromAmount * fromToken.priceUsd).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
              </div>
            </div>

            {/* Switch Direction Button */}
            <div className="flex justify-center -my-2 relative z-10">
              <button
                onClick={handleSwapDirection}
                aria-label="Switch swap direction"
                className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-[#E5B842] hover:scale-110 active:scale-95 transition-all shadow-lg hover:border-[#E5B842]/50"
              >
                <ArrowDownUp className="w-4 h-4" />
              </button>
            </div>

            {/* Receive Box */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 focus-within:border-[#E5B842]/50 transition-colors">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-medium">You Receive (Estimated)</span>
                <span className="font-mono text-[11px]">
                  Balance: {toToken.balance || 0} {toToken.symbol}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <input
                  type="text"
                  readOnly
                  value={toAmount}
                  className="w-full bg-transparent text-2xl font-black text-[#E5B842] font-mono focus:outline-none"
                />

                <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl shrink-0">
                  {toToken.symbol === 'NILE' ? (
                    <NileTokenCoin size="xs" />
                  ) : (
                    <div 
                      className="w-4 h-4 rounded-full flex items-center justify-center font-bold text-[9px] text-white"
                      style={{ backgroundColor: toToken.iconBg || '#2563EB' }}
                    >
                      {toToken.symbol.slice(0, 1)}
                    </div>
                  )}
                  <select
                    value={toToken.symbol}
                    onChange={(e) => {
                      const token = INITIAL_DEX_TOKENS.find(t => t.symbol === e.target.value) || toToken;
                      setToToken(token);
                      if (token.symbol !== 'USDT') setChartToken(token);
                    }}
                    className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
                  >
                    {INITIAL_DEX_TOKENS.map(t => (
                      <option key={t.symbol} value={t.symbol} className="bg-slate-900 text-white">
                        {t.symbol}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 font-mono">
                ≈ ${(Number(toAmount) * toToken.priceUsd).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
              </div>
            </div>

            {/* Trade Details Breakdown */}
            <div className="p-3.5 rounded-2xl bg-[#070D1B] border border-slate-800/80 space-y-1.5 text-xs text-slate-400">
              <div className="flex items-center justify-between">
                <span>Exchange Rate:</span>
                <span className="font-mono text-slate-200">
                  1 {fromToken.symbol} = {exchangeRate < 1 ? exchangeRate.toFixed(6) : exchangeRate.toFixed(4)} {toToken.symbol}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Minimum Received:</span>
                <span className="font-mono text-slate-200">{minReceived} {toToken.symbol}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Estimated Price Impact:</span>
                <span className="font-mono text-emerald-400">{priceImpact}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Network Routing:</span>
                <span className="text-cyan-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Nile Direct AMM Pool</span>
                </span>
              </div>
            </div>

            {/* Swap Action Button */}
            <button
              onClick={executeSwap}
              disabled={isSwapping}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] font-extrabold text-sm shadow-xl hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSwapping ? (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#070D1B] border-t-transparent rounded-full animate-spin" />
                  <span>Routing Liquidity...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span>Execute Swap</span>
                </div>
              )}
            </button>

            {/* Success Transaction Hash Bar */}
            {latestTxHash && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between animate-fade-in">
                <div className="truncate max-w-[220px]">
                  <span className="font-bold">Swap Settled: </span>
                  <span className="font-mono text-[11px]">{latestTxHash}</span>
                </div>
                <a
                  href={`https://etherscan.io/tx/${latestTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E5B842] hover:underline flex items-center gap-1 shrink-0 font-bold ml-2"
                >
                  <span>Explorer</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          {/* Quick Info Box */}
          <div className="p-4 rounded-2xl bg-[#091124] border border-slate-800 text-xs space-y-2 text-slate-400">
            <div className="flex items-center gap-2 text-white font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Non-Custodial Multi-Chain Liquidity</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Swaps are routed directly through audited smart contracts. Your private keys never leave your custody.
            </p>
          </div>
        </div>
      </div>

      {/* Verified Liquidity Pools Registry */}
      <div className="p-6 rounded-3xl bg-[#091124] border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Verified Nile Liquidity Pairs</span>
              <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-mono bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                Low 0.15% AMM Fee
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Click any pair to immediately load its price chart and populate the swap terminal.
            </p>
          </div>
          <span className="text-xs text-emerald-400 font-mono font-bold bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20 shrink-0">
            24h Total DEX Volume: $4.8M
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* NILE / USDT Pair */}
          <div 
            onClick={() => handleSelectPair('NILE', 'USDT')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
              chartToken.symbol === 'NILE' 
                ? 'bg-slate-900 border-[#E5B842]/50 shadow-lg shadow-[#E5B842]/10' 
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="font-bold text-white flex items-center justify-between">
              <span className="flex items-center gap-1.5 group-hover:text-[#E5B842] transition-colors">
                <NileTokenCoin size="xs" />
                <span>NILE / USDT</span>
              </span>
              <span className="text-emerald-400 font-mono">+8.4%</span>
            </div>
            <div className="text-slate-400 text-[11px] mt-1">Pool Liquidity: $2,450,000</div>
            <div className="text-[#E5B842] font-mono font-bold text-sm mt-0.5">$0.120 / NILE</div>
            <div className="text-[10px] text-cyan-400 font-semibold mt-2 flex items-center gap-1">
              <span>Trade this pair</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* ETH / USDT Pair */}
          <div 
            onClick={() => handleSelectPair('ETH', 'USDT')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
              chartToken.symbol === 'ETH' 
                ? 'bg-slate-900 border-blue-500/50 shadow-lg shadow-blue-500/10' 
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="font-bold text-white flex items-center justify-between">
              <span className="flex items-center gap-1.5 group-hover:text-blue-400 transition-colors">
                <span className="w-4 h-4 rounded-full bg-[#627EEA] text-white flex items-center justify-center text-[9px] font-bold">Ξ</span>
                <span>ETH / USDT</span>
              </span>
              <span className="text-emerald-400 font-mono">+3.4%</span>
            </div>
            <div className="text-slate-400 text-[11px] mt-1">Pool Liquidity: $12,800,000</div>
            <div className="text-blue-400 font-mono font-bold text-sm mt-0.5">$3,580.00 / ETH</div>
            <div className="text-[10px] text-cyan-400 font-semibold mt-2 flex items-center gap-1">
              <span>Trade this pair</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* BTC / USDT Pair */}
          <div 
            onClick={() => handleSelectPair('BTC', 'USDT')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
              chartToken.symbol === 'BTC' 
                ? 'bg-slate-900 border-amber-500/50 shadow-lg shadow-amber-500/10' 
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="font-bold text-white flex items-center justify-between">
              <span className="flex items-center gap-1.5 group-hover:text-amber-400 transition-colors">
                <span className="w-4 h-4 rounded-full bg-[#F7931A] text-white flex items-center justify-center text-[9px] font-bold">₿</span>
                <span>BTC / USDT</span>
              </span>
              <span className="text-emerald-400 font-mono">+2.1%</span>
            </div>
            <div className="text-slate-400 text-[11px] mt-1">Pool Liquidity: $28,500,000</div>
            <div className="text-amber-400 font-mono font-bold text-sm mt-0.5">$68,420.00 / BTC</div>
            <div className="text-[10px] text-cyan-400 font-semibold mt-2 flex items-center gap-1">
              <span>Trade this pair</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
