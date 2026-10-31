import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall.ts';
import { Download, Smartphone, Check, X, Shield, Sparkles } from 'lucide-react';

export const PWAInstallButton: React.FC<{ variant?: 'header' | 'banner' | 'pill' }> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);

  // If already running as an installed PWA in standalone mode
  if (isInstalled) {
    return (
      <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
        <Check className="w-3.5 h-3.5" />
        <span>App Installed</span>
      </div>
    );
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (!accepted) {
        setShowGuideModal(true);
      }
    } else {
      setShowGuideModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        className={`flex items-center gap-1.5 rounded-xl transition-all shadow-md active:scale-95 group ${
          variant === 'banner'
            ? 'px-4 py-2 bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] font-bold text-xs hover:shadow-[#E5B842]/20'
            : 'px-3 py-1.5 bg-[#E5B842]/10 border border-[#E5B842]/40 text-[#E5B842] hover:bg-[#E5B842] hover:text-[#070D1B] font-semibold text-xs'
        }`}
        title="Install Nile Ecosystem Web App on your device"
      >
        <Download className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" />
        <span>Install App</span>
      </button>

      {/* Install Guidance Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[#091124] border border-[#E5B842]/50 p-6 sm:p-7 shadow-2xl relative text-slate-100">
            <button
              onClick={() => setShowGuideModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {/* App Icon & Header */}
            <div className="flex items-center gap-4 mb-5">
              <img 
                src="/pwa-192x192.png" 
                alt="Nile Logo" 
                className="w-16 h-16 rounded-2xl shadow-xl border border-[#E5B842]/40 bg-[#070D1B] p-0.5" 
              />
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                  Install Nile Ecosystem
                  <Sparkles className="w-4 h-4 text-[#E5B842]" />
                </h3>
                <p className="text-xs text-slate-400">Fast, secure & standalone digital finance experience</p>
              </div>
            </div>

            {/* Steps based on platform */}
            <div className="space-y-3.5 bg-slate-900/80 rounded-2xl p-4 border border-slate-800 text-xs">
              {isIOS ? (
                <>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-[#E5B842]/20 text-[#E5B842] font-black flex items-center justify-center shrink-0">1</span>
                    <p className="text-slate-300">Tap the <strong className="text-white">Share</strong> button (box with upward arrow) at the bottom toolbar of Safari.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-[#E5B842]/20 text-[#E5B842] font-black flex items-center justify-center shrink-0">2</span>
                    <p className="text-slate-300">Scroll down and tap <strong className="text-[#E5B842]">"Add to Home Screen"</strong>.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-[#E5B842]/20 text-[#E5B842] font-black flex items-center justify-center shrink-0">3</span>
                    <p className="text-slate-300">Tap <strong className="text-white">Add</strong> in the top-right corner to launch directly from your home screen!</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-[#E5B842]/20 text-[#E5B842] font-black flex items-center justify-center shrink-0">1</span>
                    <p className="text-slate-300">In Chrome, Edge, or Android browser, look for the <strong className="text-white">Install</strong> icon in the address bar or tap browser menu (three dots).</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-[#E5B842]/20 text-[#E5B842] font-black flex items-center justify-center shrink-0">2</span>
                    <p className="text-slate-300">Select <strong className="text-[#E5B842]">"Install Nile Ecosystem"</strong> or <strong className="text-[#E5B842]">"Install App"</strong>.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-[#E5B842]/20 text-[#E5B842] font-black flex items-center justify-center shrink-0">3</span>
                    <p className="text-slate-300">Enjoy offline access, ultra-low latency, and full native screen space without address bars.</p>
                  </div>
                </>
              )}
            </div>

            {/* Quick action button if prompt is available */}
            {isInstallable && (
              <button
                onClick={async () => {
                  await install();
                  setShowGuideModal(false);
                }}
                className="mt-5 w-full py-2.5 rounded-xl bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] font-bold text-xs flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-[#E5B842]/20"
              >
                <Smartphone className="w-4 h-4" />
                Prompt Install Now
              </button>
            )}

            <button
              onClick={() => setShowGuideModal(false)}
              className="mt-3 w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
