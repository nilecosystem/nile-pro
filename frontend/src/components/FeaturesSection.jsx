import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function FeaturesSection() {
  const { t } = useAuth();

  const featuresList = [
    {
      icon: "📈",
      title: t.features.f1_title,
      desc: t.features.f1_desc,
      color: "from-emerald-500/20 to-teal-500/5",
      badge: "3 Flexible Frameworks"
    },
    {
      icon: "⚡",
      title: t.features.f2_title,
      desc: t.features.f2_desc,
      color: "from-cyan-500/20 to-blue-500/5",
      badge: "TRC20 • ERC20 • SOL"
    },
    {
      icon: "👥",
      title: t.features.f3_title,
      desc: t.features.f3_desc,
      color: "from-amber-500/20 to-yellow-500/5",
      badge: "10-Level Tree (10% → 1%)"
    },
    {
      icon: "💎",
      title: t.features.f4_title,
      desc: t.features.f4_desc,
      color: "from-emerald-400/25 to-green-500/10",
      badge: "2× Double Return Booster"
    },
    {
      icon: "🛍️",
      title: t.features.f5_title,
      desc: t.features.f5_desc,
      color: "from-purple-500/20 to-indigo-500/5",
      badge: "300+ Digital Products"
    }
  ];

  return (
    <section id="features" className="py-24 relative border-t border-slate-800/80 bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-nile-accent px-3 py-1 rounded-full bg-nile-accent/10 border border-nile-accent/20">
            Platform Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 mb-4 tracking-tight">
            {t.features.title}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            {t.features.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresList.map((f, i) => (
            <div
              key={i}
              className="glass-panel glass-panel-hover p-7 rounded-2xl relative overflow-hidden group"
            >
              <div className={`absolute -right-12 -top-12 w-32 h-32 rounded-full bg-gradient-to-br ${f.color} blur-2xl group-hover:scale-150 transition-transform duration-500`} />
              
              <div className="flex items-center justify-between mb-5">
                <span className="text-3xl">{f.icon}</span>
                <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-md bg-white/5 text-slate-300 border border-white/10">
                  {f.badge}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-nile-accent transition-colors">
                {f.title}
              </h3>

              <p className="text-sm text-slate-400 leading-relaxed font-normal">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
