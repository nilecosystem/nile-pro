import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function GlobalOfficesSection() {
  const { t } = useAuth();
  const [activeOffice, setActiveOffice] = useState('UK');

  return (
    <section id="offices" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
            Global Presence
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 mb-4 tracking-tight">
            {t.offices.title}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            {t.offices.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Office Cards */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* European Corporate Registration Card */}
            <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 bg-slate-900/90 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <span>🇦🇹</span>
                  <span>ثبت رسمی شرکتی و مالیاتی در اتحادیه اروپا (Austria, EU)</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                  شناسه تاییدشده
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs mt-2 font-mono">
                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-white/5">
                  <span className="text-[10px] text-slate-400 font-sans block">شماره ثبت تجاری (FN):</span>
                  <span className="text-emerald-400 font-bold">FN 674459 m</span>
                </div>
                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-white/5">
                  <span className="text-[10px] text-slate-400 font-sans block">شناسه مالیاتی اروپایی (VAT):</span>
                  <span className="text-cyan-400 font-bold">ATU-69250650</span>
                </div>
              </div>
            </div>

            {/* UK Office Card */}
            <div
              onClick={() => setActiveOffice('UK')}
              className={`p-6 rounded-2xl cursor-pointer transition-all border ${
                activeOffice === 'UK'
                  ? 'glass-panel border-nile-accent/40 bg-slate-900/90 shadow-lg shadow-nile-accent/15'
                  : 'bg-slate-950/60 border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <span>🇬🇧</span>
                  <span>{t.offices.ukTitle}</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10">
                  Global HQ
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-2">
                {t.offices.ukAddr}
              </p>
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/5 grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400 mb-3">
                <div>CRN: <span className="text-amber-400 font-bold">08253865</span></div>
                <div>VAT: <span className="text-cyan-400 font-bold">GB 853 3471 65</span></div>
                <div>EORI: <span className="text-emerald-400 font-bold">GB 271 210 166 000</span></div>
                <div>UTR: <span className="text-purple-400 font-bold">67894 78276</span></div>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-4">
                <span>📞 {t.offices.phone}</span>
                <span>✉️ {t.offices.email}</span>
              </div>
            </div>

            {/* UAE Office Card */}
            <div
              onClick={() => setActiveOffice('UAE')}
              className={`p-6 rounded-2xl cursor-pointer transition-all border ${
                activeOffice === 'UAE'
                  ? 'glass-panel border-cyan-400/40 bg-slate-900/90 shadow-lg shadow-cyan-400/15'
                  : 'bg-slate-950/60 border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <span>🇦🇪</span>
                  <span>{t.offices.uaeTitle}</span>
                </span>
                <span className="text-[10px] font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10">
                  MENA Operations
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-2">
                {t.offices.uaeAddr}
              </p>
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/5 text-[10px] font-mono text-slate-400 mb-3">
                <div>UAE TRN: <span className="text-cyan-400 font-bold">100820028255333</span></div>
                <div className="text-[9px] text-slate-500">Ref: 100-0393-1478-6833 • FTA Registered</div>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-4">
                <span>📞 {t.offices.phone}</span>
                <span>✉️ dubai@nileecosystem.com</span>
              </div>
            </div>

            {/* Instant Support Hotline Callout */}
            <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-lg">
                  📞
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Direct Client Desk</div>
                  <div className="text-xs text-slate-400">{t.offices.phone}</div>
                </div>
              </div>
              <a
                href={`tel:${t.offices.phone.replace(/\s+/g, '')}`}
                className="px-4 py-2 text-xs font-bold bg-nile-accent text-nile-950 rounded-lg hover:bg-emerald-400 transition-colors"
              >
                Call Support
              </a>
            </div>

          </div>

          {/* Interactive World Map Style Graphic */}
          <div className="lg:col-span-7">
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden">
              <div className="flex justify-between items-center mb-4 text-xs">
                <span className="text-slate-400 font-semibold uppercase">Global Telemetry Map</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Both Hubs Active 24/7
                </span>
              </div>

              {/* Styled Vector Map Canvas with glowing ping nodes */}
              <div className="h-64 sm:h-72 w-full bg-slate-950 rounded-2xl border border-white/5 relative flex items-center justify-center overflow-hidden">
                
                {/* World Grid Lines */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25" />

                {/* UK Hub Node */}
                <div className="absolute top-1/4 left-[46%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center group cursor-pointer" onClick={() => setActiveOffice('UK')}>
                  <div className="relative">
                    <div className="w-5 h-5 rounded-full bg-nile-accent/30 animate-ping absolute -inset-1" />
                    <div className="w-3.5 h-3.5 rounded-full bg-nile-accent border-2 border-nile-950 shadow-lg shadow-nile-accent" />
                  </div>
                  <div className="mt-1 px-2 py-0.5 rounded bg-slate-900/90 text-[10px] font-bold text-white border border-nile-accent/40 shadow">
                    UK Headquarters (SN4 7DZ)
                  </div>
                </div>

                {/* UAE Hub Node */}
                <div className="absolute top-[48%] left-[62%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center group cursor-pointer" onClick={() => setActiveOffice('UAE')}>
                  <div className="relative">
                    <div className="w-5 h-5 rounded-full bg-cyan-400/30 animate-ping absolute -inset-1" />
                    <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-nile-950 shadow-lg shadow-cyan-400" />
                  </div>
                  <div className="mt-1 px-2 py-0.5 rounded bg-slate-900/90 text-[10px] font-bold text-white border border-cyan-400/40 shadow">
                    Dubai Business Bay
                  </div>
                </div>

                {/* Connecting Arc SVG */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path
                    d="M 46 25 Q 54 15 62 48"
                    fill="none"
                    stroke="#00E599"
                    strokeWidth="0.8"
                    strokeDasharray="2,2"
                  />
                </svg>

                <div className="absolute bottom-3 left-4 text-[10px] text-slate-500 font-mono">
                  Coordinates: Lat 51.48° N (UK) • Lat 25.18° N (Dubai)
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
