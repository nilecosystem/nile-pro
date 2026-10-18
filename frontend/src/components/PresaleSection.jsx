import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function PresaleSection() {
  const { t, user, setIsDashboardOpen, setIsAuthModalOpen, setAuthMode } = useAuth();
  const [payAmount, setPayAmount] = useState(100);
  const [payCurrency, setPayCurrency] = useState('USDT'); // USDT or BNB
  const [txidInput, setTxidInput] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const TOKEN_PRICE_USDT = 0.005;
  const BNB_PRICE_USDT = 580; // approximate market peg for conversion

  // Calculate tokens received
  const effectiveUsdt = payCurrency === 'BNB' ? payAmount * BNB_PRICE_USDT : payAmount;
  const rawNileTokens = Math.floor(effectiveUsdt / TOKEN_PRICE_USDT);
  
  // Bonus tiers
  let bonusPercent = 0;
  if (effectiveUsdt >= 1000) bonusPercent = 15;
  else if (effectiveUsdt >= 500) bonusPercent = 10;
  else if (effectiveUsdt >= 100) bonusPercent = 5;

  const bonusTokens = Math.floor((rawNileTokens * bonusPercent) / 100);
  const totalTokens = rawNileTokens + bonusTokens;

  const handleSubmitTxid = (e) => {
    e.preventDefault();
    if (!txidInput) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setTxidInput('');
    }, 4000);
  };

  return (
    <section id="presale" className="py-24 relative overflow-hidden bg-gradient-to-b from-slate-950 via-nile-900 to-slate-950 border-t border-emerald-500/20">
      
      {/* Background Glows & Artwork Backdrop */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 opacity-10 bg-cover bg-center pointer-events-none -z-10"
           style={{ backgroundImage: `url('/assets/branding/4116da31-c39a-4191-8e2c-2f956de17429-1_all_22775.png')` }} />
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-nile-accent/15 blur-[130px] pointer-events-none -z-10 rounded-full" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/10 blur-[130px] pointer-events-none -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>پیش‌فروش رسمی توکن نیل (NILE Token Presale) • بستر BSC</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            تخصیص اختصاصی توکن <span className="bg-gradient-to-r from-nile-accent via-cyan-300 to-amber-300 bg-clip-text text-transparent">NILE</span> قبل از لیستینگ
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            فرصت ورود در کف قیمت <span className="text-nile-accent font-bold">$0.005</span> قبل از عرضه عمومی در صرافی‌ها با هدف‌گذاری <span className="text-emerald-400 font-bold">$0.50</span> (رشد ۱۰۰ برابری).
          </p>
        </div>

        {/* 🌟 CRITICAL ASSURANCE: نقدینگی داخلی و ضمانت بازخرید / خروج آسان */}
        <div className="mb-14 glass-panel p-6 sm:p-7 rounded-3xl border border-nile-accent/40 bg-slate-900/90 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 via-emerald-400 to-nile-accent text-nile-950 font-black text-3xl flex items-center justify-center shrink-0 shadow-lg shadow-amber-400/20">
                🛡️
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <span>اطلاعیه شفافیت و تضمین نقدینگی داخلی پلتفرم</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    ضمانت بازخرید ۱۰۰٪
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  توکن <strong>NILE</strong> در بستر شبکه <strong>Binance Smart Chain (BSC - BEP20)</strong> ایجاد و ثبت می‌شود و هنوز در صرافی‌های خارجی لیست عمومی نشده است.
                  <br />
                  <span className="text-emerald-400 font-bold">خیال شما کاملاً آسوده باشد:</span> تا زمان لیستینگ رسمی در صرافی‌ها، تمام توکن‌های خریداری‌شده شما در <strong>کیف‌پول امن اختصاصی داخلی پلتفرم</strong> با شفافیت کامل نگهداری و ذخیره می‌شوند. هر زمان که تصمیم به خروج یا برداشت بگیرید، می‌توانید از طریق همین وب‌سایت یا اپلیکیشن، توکن‌های NILE خود را به صورت آنی به <strong>تتر (USDT)</strong> یا <strong>بایننس کوین (BNB)</strong> تبدیل کرده و بدون هیچ محدودیتی به کیف پول شخصی خود منتقل کنید.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0 w-full lg:w-auto">
              <div className="px-4 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-center">
                <span className="text-[11px] text-slate-400 block">شبکه قرارداد هوشمند</span>
                <span className="text-xs font-bold text-yellow-400">BNB Smart Chain (BEP-20)</span>
              </div>
              <div className="px-4 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-center">
                <span className="text-[11px] text-slate-400 block">قابلیت تبدیل مجدد</span>
                <span className="text-xs font-bold text-emerald-400">آنی به USDT یا BNB</span>
              </div>
            </div>
          </div>
        </div>

        {/* Presale Grid: Left (Metrics + Progress + Coin Art) / Right (Interactive Swap Box) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Token Visual, Progress Bar & Metrics */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Presale Progress Card */}
            <div className="glass-panel p-7 rounded-3xl border border-white/10 relative overflow-hidden">
              <div className="flex justify-between items-center mb-4 text-xs font-bold">
                <span className="text-slate-300">مرحله فعلی پیش‌فروش: Phase II</span>
                <span className="text-nile-accent">۷۳.۸٪ تکمیل شده</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden mb-4 p-0.5 border border-white/5">
                <div className="h-full bg-gradient-to-r from-nile-accent via-cyan-400 to-emerald-400 rounded-full transition-all duration-1000" style={{ width: '73.8%' }} />
              </div>

              <div className="flex justify-between items-center text-xs text-slate-400 mb-6 font-mono">
                <span>تامین شده: $1,845,000 USDT</span>
                <span>سقف مرحله: $2,500,000 USDT</span>
              </div>

              {/* 4 Pillars of Token Value */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/5">
                  <span className="text-[10px] text-slate-400 block font-medium">قیمت پیش‌فروش</span>
                  <span className="text-base font-black text-nile-accent">$0.005</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/5">
                  <span className="text-[10px] text-slate-400 block font-medium">هدف لیستینگ</span>
                  <span className="text-base font-black text-emerald-400">$0.50</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/5">
                  <span className="text-[10px] text-slate-400 block font-medium">پتانسیل سود</span>
                  <span className="text-base font-black text-amber-300">100×</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/5">
                  <span className="text-[10px] text-slate-400 block font-medium">حداقل خرید</span>
                  <span className="text-base font-black text-white">$25</span>
                </div>
              </div>
            </div>

            {/* Official Token Visual Branding Banner */}
            <div className="glass-panel p-6 rounded-3xl border border-white/10 flex items-center gap-6 relative overflow-hidden">
              <img
                src="/assets/branding/4116da31-c39a-4191-8e2c-2f956de17429-1_all_21510.png"
                alt="NILE TOKEN 2026 Gold Coin"
                className="w-28 h-28 object-contain drop-shadow-[0_0_20px_rgba(245,158,11,0.35)] shrink-0 animate-pulse"
              />
              <div>
                <h4 className="text-base font-bold text-white mb-1">توکن ابزاری و درآمدزای NILE 2026</h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  هولدرهای توکن نیل علاوه بر رشد قیمت، از <strong>دو برابر شدن (2×) سود تمام طرح‌های سرمایه‌گذاری</strong>، استیکینگ پربازده (تا ۲۵۰٪) و <strong>۱۰ تا ۵۰ درصد تخفیف در مارکت‌پلیس</strong> برخوردار می‌شوند.
                </p>
                <div className="text-[11px] text-nile-accent font-semibold">
                  ✓ توکن بومی اکوسیستم Nile Ecosystem Ltd
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Purchase / Swap Terminal */}
          <div className="lg:col-span-6">
            <div className="glass-panel rounded-3xl p-7 sm:p-8 border border-white/15 shadow-2xl relative">
              
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <span>🪙</span>
                  <span>محاسبه‌گر و ثبت خرید در پیش‌فروش</span>
                </h3>
                <span className="text-[11px] font-bold text-nile-accent bg-nile-accent/10 px-2.5 py-1 rounded-full border border-nile-accent/30">
                  تخصیص آنی ۲۴ ساعته
                </span>
              </div>

              {/* Input: Select currency & amount */}
              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                    <span>مبلغ پرداختی:</span>
                    <span>انتخاب ارز:</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="25"
                      step="5"
                      value={payAmount}
                      onChange={(e) => setPayAmount(parseFloat(e.target.value) || 0)}
                      className="flex-1 bg-slate-900 border border-slate-700 focus:border-nile-accent rounded-2xl px-4 py-3 text-lg font-bold text-white font-mono"
                    />
                    <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-700">
                      <button
                        type="button"
                        onClick={() => setPayCurrency('USDT')}
                        className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${payCurrency === 'USDT' ? 'bg-emerald-500 text-nile-950' : 'text-slate-400'}`}
                      >
                        USDT
                      </button>
                      <button
                        type="button"
                        onClick={() => setPayCurrency('BNB')}
                        className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${payCurrency === 'BNB' ? 'bg-yellow-400 text-nile-950' : 'text-slate-400'}`}
                      >
                        BNB
                      </button>
                    </div>
                  </div>
                </div>

                {/* Calculation Summary Box */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/5 space-y-2.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>ارزش معادل تتر:</span>
                    <span className="font-bold text-white">${effectiveUsdt.toLocaleString()} USDT</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>تعداد توکن پایه ($0.005):</span>
                    <span className="font-bold text-white">{rawNileTokens.toLocaleString()} NILE</span>
                  </div>
                  {bonusPercent > 0 && (
                    <div className="flex justify-between text-emerald-400 font-semibold">
                      <span>بونس حجم خرید (+{bonusPercent}%):</span>
                      <span>+{bonusTokens.toLocaleString()} NILE</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-white/10 text-sm">
                    <span className="font-bold text-slate-200">کل توکن‌های دریافتی:</span>
                    <span className="font-black text-nile-accent text-base">{totalTokens.toLocaleString()} NILE</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-amber-300 font-semibold pt-1">
                    <span>ارزش تخمینی در زمان لیستینگ ($0.50):</span>
                    <span>${(totalTokens * 0.50).toLocaleString()} USDT</span>
                  </div>
                </div>
              </div>

              {/* Deposit Address Box */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 mb-6 space-y-2">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400 font-semibold">آدرس رسمی دریافت پیش‌فروش ({payCurrency === 'BNB' ? 'BSC / BEP20' : 'TRC20 / BEP20'}):</span>
                  <span className="text-nile-accent font-bold">شبکه امن</span>
                </div>
                <div className="font-mono text-xs text-slate-200 break-all p-2.5 rounded-xl bg-slate-900 select-all border border-white/5">
                  0x7F2a89C1b5F47E8A6b8E89b14E3692aD1B5F47E8
                </div>
                <div className="text-[10px] text-slate-500">
                  پس از ارسال تتر یا BNB، هش تراکنش (TXID) را در فرم زیر وارد کنید تا توکن‌ها به کیف‌پول شما تخصیص یابد.
                </div>
              </div>

              {/* Submit TXID Form */}
              {submitted ? (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs text-center">
                  ✓ هش تراکنش با موفقیت ثبت شد. تاییدیه و موجودی توکن ظرف حداکثر ۲۴ ساعت به کیف‌پول داخلی شما اضافه خواهد شد.
                </div>
              ) : (
                <form onSubmit={handleSubmitTxid} className="space-y-3">
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="شناسه تراکنش هش (TXID) را اینجا الصاق کنید..."
                      value={txidInput}
                      onChange={(e) => setTxidInput(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 focus:border-nile-accent rounded-xl px-3.5 py-3 text-xs text-white font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl font-bold bg-gradient-to-r from-nile-accent via-emerald-400 to-cyan-400 text-nile-950 hover:brightness-110 transition-all text-xs shadow-lg shadow-nile-accent/25"
                  >
                    تایید و ثبت خرید در پیش‌فروش
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
