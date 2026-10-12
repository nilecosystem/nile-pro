import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function MarketplaceSection() {
  const { t, user, setIsDashboardOpen, setIsAuthModalOpen, setAuthMode } = useAuth();
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [payWithNile, setPayWithNile] = useState(true); // Default to showing NILE discounts!
  const [tokenModalOpen, setTokenModalOpen] = useState(false);
  const [tokenFormData, setTokenFormData] = useState({
    tokenName: '',
    tokenSymbol: '',
    network: 'BSC (BEP20)',
    totalSupply: '1000000',
    extraFeatures: 'Burnable, Mintable, Anti-Whale'
  });
  const [tokenSuccess, setTokenSuccess] = useState(false);
  const [purchaseModalProduct, setPurchaseModalProduct] = useState(null);
  const [customerEmail, setCustomerEmail] = useState('');
  const [orderSentSuccess, setOrderSentSuccess] = useState(false);

  // Products with specific 10% to 50% discounts when paid with NILE token
  const products = [
    {
      id: 1,
      category: 'FINANCIAL',
      title: 'کارت اعتباری مجازی ویزا / مسترکارت (Virtual Card Platinum)',
      desc: 'کارت مجازی ۳DS قابل شارژ آنی با اتصال به Apple Pay و خرید از کلیه سایت‌های بین‌المللی.',
      priceUsdt: 25,
      discountPercent: 15, // 15% discount with NILE
      tag: 'تحویل آنی ۲ ساعته',
      icon: '💳'
    },
    {
      id: 2,
      category: 'FINANCIAL',
      title: 'سیم‌کارت بین‌المللی سفر (eSIM Roaming 10GB)',
      desc: 'اینترنت پرسرعت 5G بدون نیاز به سیم‌کارت فیزیکی در بیش از ۱۶۰ کشور دنیا.',
      priceUsdt: 18,
      discountPercent: 20, // 20% discount with NILE
      tag: 'فعالسازی خودکار QR',
      icon: '📶'
    },
    {
      id: 3,
      category: 'FINANCIAL',
      title: 'اکانت ارزیابی پراپ تریدینگ (FTMO / Topstep Challenge)',
      desc: 'اکانت‌های چالش فاندد برای تریدرهای حرفه‌ای با تخفیف ویژه پلتفرم نیل.',
      priceUsdt: 145,
      discountPercent: 10, // 10% discount with NILE
      tag: '۳۰+ نوع حساب پراپ',
      icon: '📊'
    },
    {
      id: 4,
      category: 'SOFTWARE',
      title: 'لایسنس قانونی مادام‌العمر ویندوز ۱۱ پرو (Windows 11 Pro Retail)',
      desc: 'کد فعال‌سازی رسمی مادام‌العمر اورجینال مایکروسافت همراه با پشتیبانی آنلاین.',
      priceUsdt: 15,
      discountPercent: 25, // 25% discount with NILE
      tag: 'لایسنس مادام‌العمر',
      icon: '🪟'
    },
    {
      id: 5,
      category: 'SOFTWARE',
      title: 'اشتراک ۱ ساله اختصاصی NordVPN / ExpressVPN',
      desc: 'رمزنگاری دوگانه و سرورهای فوق سریع بدون ثبت گزارش فعالیت (Strict No-Log).',
      priceUsdt: 39,
      discountPercent: 30, // 30% discount with NILE
      tag: 'امنیت و آی‌پی ثابت',
      icon: '🛡️'
    },
    {
      id: 6,
      category: 'AI_TOOLS',
      title: 'ووچر اشتراک یک‌ماهه هوش مصنوعی Claude Pro / ChatGPT Plus',
      desc: 'فعال‌سازی سریع اشتراک پیشرفته‌ترین مدل‌های هوش مصنوعی بدون نیاز به کارت خارجی.',
      priceUsdt: 22,
      discountPercent: 35, // 35% discount with NILE
      tag: 'اکانت پرمیوم هوش مصنوعی',
      icon: '🤖'
    },
    {
      id: 7,
      category: 'TOKEN_SERVICE',
      title: 'پکیج ساخت و استقرار توکن اختصاصی (Token Deployment Service)',
      desc: 'طراحی، کدنویسی، ممیزی و استقرار توکن استاندارد روی شبکه‌های BEP20، ERC20، TRC20 یا Solana.',
      priceUsdt: 499,
      discountPercent: 50, // 50% discount with NILE!
      tag: '۵۰٪ تخفیف با توکن نیل',
      icon: '🪙'
    }
  ];

  const filteredProducts = activeCategory === 'ALL'
    ? products
    : products.filter(p => p.category === activeCategory);

  const handleOrder = (product) => {
    setPurchaseModalProduct(product);
  };

  const handleTokenSubmit = (e) => {
    e.preventDefault();
    setTokenSuccess(true);
    setTimeout(() => {
      setTokenSuccess(false);
      setTokenModalOpen(false);
    }, 2500);
  };

  return (
    <section id="marketplace" className="py-24 relative overflow-hidden bg-slate-950/60 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
            Web3 Marketplace & Digital Services
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 mb-4 tracking-tight">
            مرکز خرید خدمات مالی و کالاهای دیجیتال نیل
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            بیش از ۳۰۰ محصول، کارت‌های ویزا/مسترکارت مجازی، ابزارهای هوش مصنوعی و سرویس ایجاد توکن اختصاصی.
          </p>
        </div>

        {/* 🌟 10% to 50% NILE TOKEN DISCOUNT BANNER & TOGGLE */}
        <div className="mb-12 glass-panel p-5 sm:p-6 rounded-2xl border-purple-500/30 bg-gradient-to-r from-purple-950/30 via-slate-900 to-indigo-950/30 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xl">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏷️</span>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>تخفیف ویژه ۱۰٪ تا ۵۰٪ با پرداخت توسط توکن NILE</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  ۱۰٪ تا ۵۰٪ تخفیف
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                با پرداخت موجودی Shop Wallet توسط توکن نیل، بسته به نوع محصول تا سقف ۵۰٪ از قیمت کسر خواهد شد.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-xl border border-white/10 shrink-0">
            <span className="text-xs font-semibold text-slate-300">نمایش قیمت‌ها با تخفیف NILE:</span>
            <button
              onClick={() => setPayWithNile(!payWithNile)}
              className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${payWithNile ? 'bg-purple-500 justify-end' : 'bg-slate-700 justify-start'}`}
            >
              <div className="w-4 h-4 rounded-full bg-slate-950 shadow-md" />
            </button>
          </div>
        </div>

        {/* Category Tabs & Token Creation Trigger */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-4 border-b border-white/10">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'ALL', label: 'همه محصولات (300+)' },
              { id: 'FINANCIAL', label: 'کارت‌های اعتباری و مالی' },
              { id: 'SOFTWARE', label: 'لایسنس نرم‌افزارها' },
              { id: 'AI_TOOLS', label: 'ابزارهای هوش مصنوعی' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
                  activeCategory === tab.id
                    ? 'bg-nile-accent text-nile-950 shadow-md shadow-nile-accent/20'
                    : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setTokenModalOpen(true)}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:brightness-110 transition-all flex items-center gap-2 shadow-lg shadow-purple-500/20"
          >
            <span>✨</span>
            <span>سفارش ساخت توکن (BEP20 / ERC20)</span>
          </button>
        </div>

        {/* Product Cards Grid with 10% to 50% discount logic */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => {
            const finalPriceUsdt = payWithNile
              ? product.priceUsdt * (1 - product.discountPercent / 100)
              : product.priceUsdt;

            return (
              <div key={product.id} className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col justify-between group">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-3xl p-2.5 rounded-xl bg-slate-900/90 border border-white/5">{product.icon}</span>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] font-bold text-nile-accent uppercase px-2.5 py-0.5 rounded bg-nile-accent/10 border border-nile-accent/20">
                        {product.tag}
                      </span>
                      {payWithNile && (
                        <span className="text-[10px] font-extrabold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/30">
                          {product.discountPercent}% تخفیف توکن NILE
                        </span>
                      )}
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-normal mb-6">
                    {product.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div>
                    <span className="text-[10px] text-slate-400 block">قیمت نهایی:</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-black text-white">
                        ${finalPriceUsdt.toFixed(2)} USDT
                      </span>
                      {payWithNile && (
                        <span className="text-xs text-slate-500 line-through">
                          ${product.priceUsdt}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleOrder(product)}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-nile-accent hover:text-nile-950 text-slate-200 text-xs font-bold transition-all border border-white/10"
                  >
                    خرید مستقیم
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Token Creation Service Modal */}
        {tokenModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="glass-panel w-full max-w-lg p-7 rounded-3xl border border-purple-500/30 relative">
              <button
                onClick={() => setTokenModalOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white"
              >
                ✕
              </button>

              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🪙</span>
                <h3 className="text-xl font-extrabold text-white">سفارش ساخت قرارداد هوشمند و توکن</h3>
              </div>
              <p className="text-xs text-slate-400 mb-6">
                استقرار قراردادهای هوشمند استاندارد و ممیزی‌شده روی شبکه‌های BSC, Ethereum, TRON, Solana یا Sui.
              </p>

              {tokenSuccess ? (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center text-emerald-400 font-bold text-sm">
                  ✓ درخواست ساخت توکن شما با موفقیت ثبت شد. تیم فنی بلاک‌چین ظرف ۲ ساعت جهت ارائه پیش‌نویس با شما ارتباط خواهند گرفت.
                </div>
              ) : (
                <form onSubmit={handleTokenSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">شبکه بلاک‌چین هدف</label>
                    <select
                      value={tokenFormData.network}
                      onChange={(e) => setTokenFormData({ ...tokenFormData, network: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                    >
                      <option value="BSC (BEP20)">Binance Smart Chain (BEP20) — توصیه شده</option>
                      <option value="ERC20">Ethereum (ERC20)</option>
                      <option value="TRC20">TRON Network (TRC20)</option>
                      <option value="SOLANA">Solana (SPL Token)</option>
                      <option value="SUI">Sui Network (Move)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">نام توکن (Token Name)</label>
                      <input
                        type="text"
                        required
                        placeholder="مثال: Nile Diamond"
                        value={tokenFormData.tokenName}
                        onChange={(e) => setTokenFormData({ ...tokenFormData, tokenName: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">نماد توکن (Symbol)</label>
                      <input
                        type="text"
                        required
                        placeholder="مثال: NLD"
                        value={tokenFormData.tokenSymbol}
                        onChange={(e) => setTokenFormData({ ...tokenFormData, tokenSymbol: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">کل موجودی توکن (Total Supply)</label>
                    <input
                      type="number"
                      required
                      value={tokenFormData.totalSupply}
                      onChange={(e) => setTokenFormData({ ...tokenFormData, totalSupply: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                    />
                  </div>

                  <div className="p-3.5 rounded-xl bg-purple-900/30 border border-purple-500/30 text-purple-200 text-[11px] flex justify-between items-center">
                    <span>هزینه استقرار استاندارد: $499 USDT</span>
                    <span className="font-extrabold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
                      با توکن NILE: فقط $249.50 (۵۰٪ تخفیف)
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:brightness-110 transition-all text-xs"
                  >
                    ثبت سفارش ساخت توکن
                  </button>
                </form>
              )}
            </div>
          </div>
        )}


        {/* Customer Email & Delivery Modal */}
        {purchaseModalProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="glass-panel w-full max-w-md p-7 rounded-3xl border border-nile-accent/30 bg-slate-950 relative">
              <button onClick={() => setPurchaseModalProduct(null)} className="absolute top-5 right-5 text-slate-400 hover:text-white">✕</button>
              
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <span>🛍️</span>
                <span>ثبت سفارش و ارسال لایسنس / محصول</span>
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                محصول انتخابی: <strong className="text-white">{purchaseModalProduct.title}</strong>
              </p>

              {orderSentSuccess ? (
                <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold text-center">
                  ✓ سفارش شما ثبت شد و اعلان خرید برای مدیریت (Owner) ارسال گردید. جزئیات محصول و لایسنس ظرف حداکثر ۲ ساعت به ایمیل شما ارسال خواهد شد.
                </div>
              ) : (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!customerEmail) return;
                  setOrderSentSuccess(true);
                  setTimeout(() => {
                    setOrderSentSuccess(false);
                    setPurchaseModalProduct(null);
                    setCustomerEmail('');
                  }, 3500);
                }} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">ایمیل شما جهت دریافت محصول / لایسنس:</label>
                    <input
                      type="email"
                      required
                      placeholder="yourname@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-white/5 text-[11px] text-slate-400">
                    قیمت: <strong className="text-white">${(payWithNile ? purchaseModalProduct.priceUsdt * (1 - purchaseModalProduct.discountPercent / 100) : purchaseModalProduct.priceUsdt).toFixed(2)} USDT</strong> • اعلان خودکار به مدیر صادر می‌شود.
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl font-bold bg-nile-accent text-nile-950 hover:bg-emerald-400 text-xs"
                  >
                    تایید و ثبت سفارش
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
