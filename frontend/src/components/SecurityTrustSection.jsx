import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function SecurityTrustSection() {
  const { t } = useAuth();

  const securityFeatures = [
    {
      icon: "🛡️",
      title: t.security.audited,
      desc: "Smart contracts audited for algorithmic reentrancy, overflow safety, and strict multi-sig execution limits."
    },
    {
      icon: "🔐",
      title: t.security.mpc,
      desc: "Multi-party computation (MPC) key shards eliminate single points of failure across cold and warm reserves."
    },
    {
      icon: "🪪",
      title: t.security.kyc,
      desc: "Tiered KYC/AML compliance engine satisfying international regulatory fintech and FATF requirements."
    },
    {
      icon: "🔍",
      title: t.security.antiFraud,
      desc: "Behavioral anomaly detection, device fingerprinting, and automated withdrawal review triggers."
    }
  ];

  return (
    <section id="security" className="py-24 relative border-t border-slate-800/80 bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            Institutional Trust Center
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 mb-4 tracking-tight">
            {t.security.title}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            {t.security.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {securityFeatures.map((sec, idx) => (
            <div key={idx} className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-2xl mb-4 border border-white/10">
                  {sec.icon}
                </div>
                <h3 className="text-base font-bold text-white mb-2">{sec.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">{sec.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold uppercase">
                <span>✓ Verified Standard</span>
              </div>
            </div>
          ))}
        </div>

        {/* Security Seals & Assurance Bar */}
        <div className="mt-12 glass-panel p-6 rounded-2xl border border-white/10 flex flex-wrap items-center justify-around gap-6 text-center text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold text-base">✓</span>
            <span>256-Bit TLS End-to-End Encryption</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold text-base">✓</span>
            <span>2FA Authenticator Support</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold text-base">✓</span>
            <span>Non-Custodial Ledger Segregation</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold text-base">✓</span>
            <span>Manual Admin Payout Verification</span>
          </div>
        </div>

      </div>
    </section>
  );
}
