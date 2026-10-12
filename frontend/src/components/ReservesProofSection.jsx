import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function ReservesProofSection() {
  const { t } = useAuth();

  const ON_CHAIN_TX_URL = "https://www.blockchain.com/btc/tx/900d114ebb2cd6f9daae5f4474a0f7dce9292d51c5478810fa21939c19fb885f";
  const ON_CHAIN_TXID = "900d114ebb2cd6f9daae5f4474a0f7dce9292d51c5478810fa21939c19fb885f";

  const reservesData = [
    {
      name: "استیبل‌کوین‌های نقد (USDT / USDC)",
      share: "۶۰٪",
      percentVal: 60,
      role: "تضمین نقدشوندگی فوری و تسویه چرخه‌های ۴گانه برداشت",
      storage: "کیف‌پول‌های چندامضایی خزانه‌داری (Multi-Sig Warm Vaults)",
      color: "from-emerald-400 to-teal-500",
      icon: "💵"
    },
    {
      name: "ذخایر استراتژیک بیت‌کوین و اتریوم (BTC & ETH)",
      share: "۲۵٪",
      percentVal: 25,
      role: "پشتوانه بنیادین بلندمدت و حفظ ارزش سرمایه در برابر تورم",
      storage: "خزانه‌های کاملاً آفلاین و سرد سازمانی (Cold Storage MPC)",
      color: "from-amber-400 to-orange-500",
      icon: "🪙"
    },
    {
      name: "استخرهای نقدینگی نهادی و آربیتراژ (Quant Liquidity)",
      share: "۱۵٪",
      percentVal: 15,
      role: "تولید بازدهی الگوریتمی روزانه برای پرداخت سود سرمایه‌گذاران",
      storage: "قراردادهای هوشمند ممیزی‌شده (Audited Smart Contracts)",
      color: "from-cyan-400 to-blue-500",
      icon: "⚡"
    }
  ];

  return (
    <section id="reserves" className="py-24 relative overflow-hidden bg-slate-950/80 border-t border-white/10">
      
      {/* Background Lighting */}
      <div className="absolute top-1/2 left-1/3 w-[500px] h-[300px] bg-emerald-500/10 blur-[140px] pointer-events-none -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>شفافیت مالی و پشتوانه‌ها • Proof of Reserves</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            پشتوانه‌ها و خزانه‌های رسمی <span className="bg-gradient-to-r from-nile-accent to-cyan-300 bg-clip-text text-transparent">NILE INVESTMENT</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            امنیت سرمایه شما اولویت مطلق ماست. تمام تعهدات پلتفرم دارای نسبت پوشش ۱:۱ دارایی‌های واقعی با تفکیک کامل لجر و ذخایر مالی مستقل بر بستر بلاک‌چین است.
          </p>
        </div>

        {/* 🌟 PROOF OF RESERVES ON-CHAIN VERIFICATION CARD */}
        <div className="mb-12 glass-panel p-6 sm:p-7 rounded-3xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 font-black text-3xl flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
                ₿
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold text-white">سند و تراکنش رسمی پشتوانه بیت‌کوین (On-Chain Proof)</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    تاییدشده در بلاک‌چین
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                  تراکنش رسمی ذخیره دارایی خزانه‌داری پلتفرم به صورت عمومی و دائمی در دفترکل توزیع‌شده بیت‌کوین ثبت شده و توسط کلیه کاربران در بستر اکسپلورر بلاک‌چین قابل رهگیری است.
                </p>
                <div className="pt-2 font-mono text-[11px] text-slate-400 break-all select-all flex items-center gap-1.5">
                  <span className="text-amber-400 font-bold">TXID:</span>
                  <span>{ON_CHAIN_TXID}</span>
                </div>
              </div>
            </div>

            <div className="shrink-0 w-full lg:w-auto text-center">
              <a
                href={ON_CHAIN_TX_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-400 to-yellow-500 text-nile-950 hover:brightness-110 transition-all shadow-lg shadow-amber-400/20 w-full sm:w-auto"
              >
                <span>🔍</span>
                <span>مشاهده تراکنش در Blockchain.com</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* 100%+ Coverage Ratio & SAFU Assurance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 bg-slate-900/90 text-center">
            <div className="text-3xl font-black text-emerald-400 mb-1">۱:۱+</div>
            <div className="text-xs font-bold text-white uppercase tracking-wider mb-2">نسبت پوشش کامل ذخایر (100% Backed)</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              به ازای هر ۱ دلار واریزی کاربران، بیش از ۱ دلار دارایی در خزانه‌های رسمی نگهداری می‌شود.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-nile-accent/30 bg-slate-900/90 text-center">
            <div className="text-3xl font-black text-nile-accent mb-1">,000,000</div>
            <div className="text-xs font-bold text-white uppercase tracking-wider mb-2">صندوق بیمه اضطراری (NILE SAFU Fund)</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              صندوق احتیاطی مستقل برای بیمه دارایی‌ها و پوشش نوسانات شدید بازار در شرایط بحرانی.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 bg-slate-900/90 text-center">
            <div className="text-3xl font-black text-cyan-300 mb-1">تضمین نقدینگی</div>
            <div className="text-xs font-bold text-white uppercase tracking-wider mb-2">بازخرید آنی توکن NILE به USDT/BNB</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              تعهد رسمی به خرید مجدد توکن‌های پیش‌فروش در هر زمان با نرخ تضمین‌شده بدون نیاز به لیستینگ.
            </p>
          </div>

        </div>

        {/* Breakdown of Asset Reserves */}
        <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <span>📊</span>
            <span>تفکیک دقیق سبد پشتوانه‌ها و محل نگهداری دارایی‌ها</span>
          </h3>

          <div className="space-y-6">
            {reservesData.map((res, i) => (
              <div key={i} className="p-5 rounded-2xl bg-slate-900/80 border border-white/5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 rounded-xl bg-slate-950 border border-white/5">{res.icon}</span>
                    <div>
                      <h4 className="text-sm font-bold text-white">{res.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{res.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-white">{res.share}</span>
                    <span className="text-[10px] text-slate-400 block">سهم از کل ذخایر</span>
                  </div>
                </div>

                {/* Progress Visual Bar */}
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${res.color} rounded-full`} style={{ width: `${res.percentVal}%` }} />
                </div>

                <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
                  <span>سازوکار نگهداری: <strong className="text-slate-200">{res.storage}</strong></span>
                  <span className="text-emerald-400 font-semibold">✓ وضعیت: ایمن و فعال در بلاک‌چین</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
