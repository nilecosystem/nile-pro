import React from 'react';

export default function LiveCryptoTicker() {
  const coins = [
    { symbol: 'NILE/USDT', price: '$0.0050', change: '+100× Target', up: true },
    { symbol: 'BTC/USDT', price: '$94,280.50', change: '+2.84%', up: true },
    { symbol: 'ETH/USDT', price: '$3,420.15', change: '+3.12%', up: true },
    { symbol: 'BNB/USDT', price: '$588.40', change: '+1.95%', up: true },
    { symbol: 'SOL/USDT', price: '$178.60', change: '+4.50%', up: true },
    { symbol: 'USDT/USD', price: '$1.0001', change: '+0.01%', up: true },
    { symbol: 'STAKING POOL APY', price: '22.50%', change: 'Live Yield', up: true }
  ];

  return (
    <div className="bg-slate-950 border-b border-white/5 py-1.5 px-4 text-[11px] overflow-hidden select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-bold uppercase text-slate-400">Live Markets</span>
        </div>

        {/* Scrolling horizontal list */}
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar scroll-smooth">
          {coins.map((c, i) => (
            <div key={i} className="flex items-center gap-1.5 shrink-0 font-mono">
              <span className="text-slate-300 font-semibold">{c.symbol}</span>
              <span className="text-white font-bold">{c.price}</span>
              <span className={`text-[10px] font-bold ${c.up ? 'text-emerald-400' : 'text-red-400'}`}>
                {c.change}
              </span>
            </div>
          ))}
        </div>

        <div className="hidden sm:flex items-center gap-2 shrink-0 text-slate-400 text-[10px]">
          <span>⚡ 0.02s Execution</span>
          <span>•</span>
          <span className="text-emerald-400 font-semibold">100% Backed</span>
        </div>

      </div>
    </div>
  );
}
