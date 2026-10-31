import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { NileTokenCoin } from './NileTokenCoin.tsx';
import { 
  ArrowRight, 
  Flame, 
  Building2, 
  Award, 
  TrendingUp, 
  Sparkles, 
  Zap, 
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';

interface TickerItem {
  symbol: string;
  name: string;
  price: string;
  change: string;
  isPositive: boolean;
  volume: string;
}

const LIVE_TICKERS: TickerItem[] = [
  { symbol: 'NILE', name: 'Nile Token', price: '$0.1200', change: '+8.4%', isPositive: true, volume: '$4.85M' },
  { symbol: 'BTC', name: 'Bitcoin', price: '$68,420.00', change: '+2.15%', isPositive: true, volume: '$28.5M' },
  { symbol: 'ETH', name: 'Ethereum', price: '$3,580.00', change: '+3.42%', isPositive: true, volume: '$18.2M' },
  { symbol: 'BNB', name: 'BNB Chain', price: '$590.00', change: '+1.20%', isPositive: true, volume: '$6.4M' },
  { symbol: 'SOL', name: 'Solana', price: '$178.00', change: '+5.60%', isPositive: true, volume: '$9.1M' },
  { symbol: 'TRX', name: 'TRON', price: '$0.1650', change: '+0.80%', isPositive: true, volume: '$2.3M' },
  { symbol: 'XRP', name: 'XRP Ledger', price: '$0.5840', change: '+1.90%', isPositive: true, volume: '$3.7M' }
];

interface LiquidityPayout {
  id: string;
  userMasked: string;
  amount: string;
  asset: string;
  type: string;
  timeAgo: string;
}

const INITIAL_PAYOUTS: LiquidityPayout[] = [
  { id: '1', userMasked: '0x71a...92b', amount: '+1,250.00', asset: 'USDT', type: 'Daily Yield Disbursement', timeAgo: '2s ago' },
  { id: '2', userMasked: '0x34e...8f1', amount: '+25,000', asset: 'NILE', type: 'Staking Multiplier Reward', timeAgo: '8s ago' },
  { id: '3', userMasked: 'bc1q...4f2', amount: '+0.125', asset: 'BTC', type: 'Plan 4 ULTIMATE Settlement', timeAgo: '15s ago' },
  { id: '4', userMasked: 'TE5Q...8za', amount: '+15,000', asset: 'TRX', type: 'Affiliate Tier 1 Commission', timeAgo: '22s ago' },
  { id: '5', userMasked: '0x9ad...399', amount: '+3,500.00', asset: 'USDT', type: 'Reserve Package Release', timeAgo: '29s ago' }
];

export const HeroSection: React.FC = () => {
  const { setActiveTab, presalePhases, setSelectedCertificate, setCertificateModalOpen } = useApp();
  const activePhase = presalePhases.find(p => p.status === 'active') || presalePhases[0];

  const [payouts, setPayouts] = useState<LiquidityPayout[]>(INITIAL_PAYOUTS);

  // Real-Time Liquidity Streamer updating every 7 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const assets = ['USDT', 'NILE', 'BTC', 'ETH', 'SOL', 'TRX'];
      const chosenAsset = assets[Math.floor(Math.random() * assets.length)];
      const types = [
        'Daily Yield Disbursement',
        'Staking Multiplier Reward',
        'Plan 4 ULTIMATE Settlement',
        'Reserve Package Release',
        '10-Tier Affiliate Payout'
      ];
      const randomHex = Math.random().toString(16).substring(2, 6);
      const randomAmount = chosenAsset === 'BTC' ? `+${(Math.random() * 0.2 + 0.05).toFixed(4)}`
        : chosenAsset === 'ETH' ? `+${(Math.random() * 1.5 + 0.3).toFixed(3)}`
        : chosenAsset === 'NILE' ? `+${Math.floor(Math.random() * 20000 + 5000).toLocaleString()}`
        : `+${(Math.random() * 2500 + 300).toFixed(2)}`;

      const newPayout: LiquidityPayout = {
        id: Date.now().toString(),
        userMasked: `0x${randomHex}...${Math.random().toString(16).substring(2, 5)}`,
        amount: randomAmount,
        asset: chosenAsset,
        type: types[Math.floor(Math.random() * types.length)],
        timeAgo: 'Just now'
      };

      setPayouts(prev => [newPayout, ...prev.slice(0, 4)]);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full space-y-8">
      {/* 1. Live Continuous Market Ticker Bar */}
      <div className="w-full bg-[#050914] border-y border-slate-800/80 py-2.5 overflow-x-auto scrollbar-none select-none">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-6 whitespace-nowrap min-w-max">
          <div className="flex items-center gap-2 pr-4 border-r border-slate-800 text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>NCB Live Spot Ticker</span>
          </div>

          <div className="flex items-center gap-8 text-xs font-mono">
            {LIVE_TICKERS.map((item) => (
              <div key={item.symbol} className="flex items-center gap-2">
                <span className="font-bold text-white">{item.symbol}</span>
                <span className="text-slate-200">{item.price}</span>
                <span className={`font-semibold ${item.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {item.change}
                </span>
                <span className="text-slate-500 text-[10px]">Vol {item.volume}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Main Hero Presentation Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-[#E5B842]/40 text-xs text-[#E5B842] font-semibold tracking-wide shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#E5B842] animate-pulse" />
              <span>UK INCORPORATED · REG #08253865</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-300">CARDIFF COMPANIES HOUSE</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight font-sans">
              Hunt Opportunities. <br />
              <span className="bg-gradient-to-r from-[#E5B842] via-[#FDE047] to-[#00E599] bg-clip-text text-transparent">
                Build Generational Wealth.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              The institutional digital finance ecosystem. Unified non-custodial swaps, high-tier multi-currency crypto banking, automated investment portfolios, rare physical bullion, and international cards with balances from $100 to $100,000.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => setActiveTab('presale')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] font-extrabold text-sm shadow-xl shadow-[#E5B842]/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Flame className="w-4 h-4 fill-[#070D1B]" />
                <span>Participate in Presale</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('bank')}
                className="px-6 py-3 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-[#E5B842]/60 text-white font-bold text-sm hover:bg-slate-800 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-[#E5B842]" />
                <span>Open Nile Crypto Bank</span>
              </button>

              <button
                onClick={() => { setSelectedCertificate('incorporation'); setCertificateModalOpen(true); }}
                className="px-4 py-3 rounded-xl text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Award className="w-4 h-4 text-[#E5B842]" />
                <span>UK Certificate</span>
              </button>
            </div>

            {/* Global Key Stats */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0">
              <div>
                <div className="text-xl sm:text-2xl font-black text-white font-mono">500,000,000</div>
                <div className="text-[11px] text-slate-400">Total NILE Supply</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">$100k</div>
                <div className="text-[11px] text-slate-400">Max Card Balance</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-[#E5B842] font-mono">29+</div>
                <div className="text-[11px] text-slate-400">Schengen & Global Shipping</div>
              </div>
            </div>
          </div>

          {/* Right Showcase: 3D Official Token Artwork Centerpiece */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0D1833] via-[#091124] to-[#040812] border-2 border-[#E5B842]/50 shadow-2xl shadow-[#E5B842]/20 w-full max-w-md group">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="py-2">
                  <NileTokenCoin size="hero" animate showTicker />
                </div>
                
                <div>
                  <h3 className="text-xl font-black text-white tracking-wider flex items-center justify-center gap-2">
                    <span>OFFICIAL NILE TOKEN</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E5B842]/20 text-[#E5B842] border border-[#E5B842]/40">
                      NILE
                    </span>
                  </h3>
                  <p className="text-xs text-[#E5B842] font-bold tracking-widest uppercase mt-1">
                    Native Utility & Wealth Reserve of NCB
                  </p>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Audited 3D Golden Horus & Pyramid utility coin powering zero-slippage AMM DEX liquidity, VIP private banking cashback, institutional staking multipliers, and guaranteed store-of-value.
                </p>

                <div className="w-full pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-left">
                    <div className="text-[10px] text-slate-400">Current Presale Phase</div>
                    <div className="font-bold text-white mt-0.5">{activePhase.name}</div>
                    <div className="text-xs text-emerald-400 font-bold mt-1">${activePhase.tokenPriceUsd} / NILE</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-left">
                    <div className="text-[10px] text-slate-400">Audited Incorporation</div>
                    <div className="font-bold text-white mt-0.5">Companies House</div>
                    <div className="text-xs text-[#E5B842] font-mono font-bold mt-1">#08253865</div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('presale')}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] font-extrabold text-xs shadow-lg shadow-[#E5B842]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Flame className="w-3.5 h-3.5 fill-[#070D1B]" />
                  <span>Participate in Token Presale (${activePhase.tokenPriceUsd} / NILE)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Grand Opening Promotional Spotlight Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0C152B] via-[#091124] to-[#0A1A33] border-2 border-[#E5B842]/40 shadow-2xl space-y-6 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#E5B842]/15 via-transparent to-transparent pointer-events-none" />

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Official Launch Celebration
                </span>
                <span className="text-xs text-slate-400">· Limited Quota Institutional Packages</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-white tracking-wide">
                NILE Crypto Bank (NCB) Grand Opening Spotlight
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                Unlock premier institutional reserve packages with up to 20% discount when settling with native NILE token, or 10% discount via verified crypto deposit & bank cards.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setActiveTab('marketplace')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] font-extrabold text-xs shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Visit Marketplace</span>
              </button>
              <button
                onClick={() => setActiveTab('investment')}
                className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-[#E5B842] text-white font-bold text-xs hover:bg-slate-800 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <TrendingUp className="w-4 h-4 text-[#E5B842]" />
                <span>Explore Yield Plans</span>
              </button>
            </div>
          </div>

          {/* Live Pricing Teaser Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10 text-xs">
            {/* Package 1: 0.5 BTC */}
            <div className="p-4 rounded-2xl bg-[#070D1B]/90 border border-slate-800 space-y-2 hover:border-[#E5B842]/50 transition-all">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-white text-sm">0.5 BTC Package</span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  Tier-1 Reserve
                </span>
              </div>
              <div className="space-y-1 pt-1 font-mono">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Crypto / Card:</span>
                  <span className="font-bold text-white">$40,252 (10% Off)</span>
                </div>
                <div className="flex items-center justify-between text-[#E5B842] font-bold">
                  <span>NILE Token:</span>
                  <span>$35,780 (20% Off)</span>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('marketplace')}
                className="w-full mt-2 py-1.5 rounded-lg bg-slate-800 hover:bg-[#E5B842] hover:text-[#070D1B] text-slate-200 text-[11px] font-bold transition-all text-center cursor-pointer"
              >
                Acquire 0.5 BTC ➔
              </button>
            </div>

            {/* Package 2: 1.0 BTC */}
            <div className="p-4 rounded-2xl bg-[#070D1B]/90 border border-slate-800 space-y-2 hover:border-[#E5B842]/50 transition-all">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-white text-sm">1.0 BTC Package</span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  Whale Vault
                </span>
              </div>
              <div className="space-y-1 pt-1 font-mono">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Crypto / Card:</span>
                  <span className="font-bold text-white">$80,505 (10% Off)</span>
                </div>
                <div className="flex items-center justify-between text-[#E5B842] font-bold">
                  <span>NILE Token:</span>
                  <span>$71,560 (20% Off)</span>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('marketplace')}
                className="w-full mt-2 py-1.5 rounded-lg bg-slate-800 hover:bg-[#E5B842] hover:text-[#070D1B] text-slate-200 text-[11px] font-bold transition-all text-center cursor-pointer"
              >
                Acquire 1.0 BTC ➔
              </button>
            </div>

            {/* Package 3: 1,000 USDT */}
            <div className="p-4 rounded-2xl bg-[#070D1B]/90 border border-slate-800 space-y-2 hover:border-emerald-500/50 transition-all">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-white text-sm">1,000 USDT Package</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                  Liquid Reserve
                </span>
              </div>
              <div className="space-y-1 pt-1 font-mono">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Crypto / Card:</span>
                  <span className="font-bold text-white">$900 (10% Off)</span>
                </div>
                <div className="flex items-center justify-between text-[#E5B842] font-bold">
                  <span>NILE Token:</span>
                  <span>$800 (20% Off)</span>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('marketplace')}
                className="w-full mt-2 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-500 hover:text-[#070D1B] text-slate-200 text-[11px] font-bold transition-all text-center cursor-pointer"
              >
                Acquire 1,000 USDT ➔
              </button>
            </div>

            {/* Package 4: 5,000 USDT */}
            <div className="p-4 rounded-2xl bg-[#070D1B]/90 border border-slate-800 space-y-2 hover:border-emerald-500/50 transition-all">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-white text-sm">5,000 USDT Package</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                  Prime Yield
                </span>
              </div>
              <div className="space-y-1 pt-1 font-mono">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Crypto / Card:</span>
                  <span className="font-bold text-white">$4,500 (10% Off)</span>
                </div>
                <div className="flex items-center justify-between text-[#E5B842] font-bold">
                  <span>NILE Token:</span>
                  <span>$4,000 (20% Off)</span>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('marketplace')}
                className="w-full mt-2 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-500 hover:text-[#070D1B] text-slate-200 text-[11px] font-bold transition-all text-center cursor-pointer"
              >
                Acquire 5,000 USDT ➔
              </button>
            </div>
          </div>

          {/* 4. Real-Time Liquidity Streamer Feed (Updates every 7 seconds) */}
          <div className="pt-2 border-t border-slate-800/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-400">
                <Zap className="w-3.5 h-3.5 text-[#E5B842] animate-bounce" />
                <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                  Real-Time Liquidity Streamer:
                </span>
                <span className="text-emerald-400 font-mono font-semibold animate-pulse">
                  {payouts[0]?.userMasked} received {payouts[0]?.amount} {payouts[0]?.asset} ({payouts[0]?.type})
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                Network Settlement Latency: 42ms · Non-Custodial
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HeroSection;
