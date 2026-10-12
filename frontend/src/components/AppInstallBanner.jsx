import React, { useState } from 'react';

export default function AppInstallBanner() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-cyan-950/60 border-y border-white/5 py-3 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-nile-accent/20 text-nile-accent flex items-center justify-center text-lg">
            📱
          </div>
          <div>
            <span className="font-bold text-white block">نرم‌افزار رسمی NILE INVESTMENT (PWA & Mobile App)</span>
            <span className="text-[11px] text-slate-400">قابلیت نصب مستقیم روی اندروید، آیفون (iOS) و ویندوز با سرعت بالا و دسترسی آفلاین.</span>
          </div>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-nile-accent text-nile-950 font-bold hover:bg-emerald-400 transition-colors shrink-0 shadow-md shadow-nile-accent/20"
        >
          راهنمای نصب نرم‌افزار ⬇
        </button>

      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-7 rounded-3xl border border-emerald-500/30 bg-slate-950 relative">
            <button onClick={() => setModalOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white">
              ✕
            </button>

            <div className="text-center mb-5">
              <span className="text-3xl block mb-2">📲</span>
              <h3 className="text-lg font-bold text-white">نصب نرم‌افزار پلتفرم نیل</h3>
              <p className="text-xs text-slate-400 mt-1">بدون نیاز به دانلود فایل‌های حجیم، مستقیماً به صفحه اصلی دستگاه اضافه کنید.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-white/5 space-y-1">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <span>🍏</span>
                  <span>کاربران آیفون و آیپد (iOS - Safari):</span>
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  ۱. سایت را در مرورگر Safari باز کنید.<br />
                  ۲. روی دکمه اشتراک‌گذاری (Share ⎋) در پایین صفحه بزنید.<br />
                  ۳. گزینه <strong>Add to Home Screen (افزودن به صفحه اصلی)</strong> را انتخاب کنید.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-white/5 space-y-1">
                <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                  <span>🤖</span>
                  <span>کاربران اندروید (Chrome / Samsung):</span>
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  ۱. روی منوی ۳ نقطه مرورگر کروم کلیک کنید.<br />
                  ۲. دکمه <strong>Install App (نصب برنامه)</strong> یا افزودن به صفحه اصلی را بزنید.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-white/5 space-y-1">
                <span className="font-bold text-purple-400 flex items-center gap-1.5">
                  <span>💻</span>
                  <span>کاربران کامپیوتر (Windows / Mac):</span>
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  روی آیکون نصب (Install) در نوار آدرس مرورگر کروم یا اج کلیک کنید تا به شکل نرم‌افزار دسکتاپ مستقل اجرا شود.
                </p>
              </div>
            </div>

            <div className="mt-5 text-center">
              <button
                onClick={() => setModalOpen(false)}
                className="w-full py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-700"
              >
                متوجه شدم
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
