import React, { useState, useEffect } from 'react';

export default function LivePayoutStream() {
  const [feed, setFeed] = useState([
    { id: 1, user: '0x71a...8e4', type: 'سود روزانه Apex', amount: '+600.00 USDT', time: 'همین الان' },
    { id: 2, user: '0x94f...21c', type: 'برداشت تاییدشده Cycle 2', amount: '350.00 USDT', time: '۲ دقیقه قبل' },
    { id: 3, user: '0x32b...69a', type: 'پاداش استیکینگ NILE', amount: '+2,500 NILE', time: '۴ دقیقه قبل' },
    { id: 4, user: '0x88c...41e', type: 'کمیسیون رفرال سطح ۱', amount: '+100.00 USDT', time: '۷ دقیقه قبل' }
  ]);

  return (
    <div className="glass-panel p-4 rounded-2xl border border-white/5 max-w-7xl mx-auto my-8 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs mb-3 pb-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-bold text-white">جریان زنده تسویه‌ها و تراکنش‌های پلتفرم (Live Payouts Stream)</span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">شفافیت لجر • پردازش خودکار</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {feed.map(item => (
          <div key={item.id} className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between">
            <div>
              <span className="font-mono text-slate-400 text-[10px] block">{item.user}</span>
              <span className="text-white text-[11px] font-semibold">{item.type}</span>
            </div>
            <div className="text-right">
              <span className="text-emerald-400 font-mono font-bold block">{item.amount}</span>
              <span className="text-slate-500 text-[9px]">{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
