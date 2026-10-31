import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { HeroSection } from '../components/HeroSection.tsx';
import { VideoAdsSection } from '../components/VideoAdsSection.tsx';
import { InvestmentPlansSection } from '../components/InvestmentPlansSection.tsx';
import { MarketplaceSection } from '../components/MarketplaceSection.tsx';
import { ReferralSection } from '../components/ReferralSection.tsx';
import { TestimonialsSection } from '../components/TestimonialsSection.tsx';
import { NileTokenCoin } from '../components/NileTokenCoin.tsx';
import { 
  Building2, 
  TrendingUp, 
  ShoppingBag, 
  ArrowLeftRight, 
  Coins, 
  Flame, 
  CreditCard, 
  ShieldCheck, 
  Award, 
  ArrowRight, 
  ExternalLink,
  CheckCircle,
  FileCheck,
  Globe,
  Sparkles
} from 'lucide-react';
import { OFFICIAL_SUPPORT_CHANNELS } from '../data/paymentConfig.ts';

export const HomePage: React.FC = () => {
  const { setActiveTab, setCertificateModalOpen, setSelectedCertificate } = useApp();

  return (
    <div className="w-full space-y-16 pb-20">
      {/* 1. Hero Section & Live Spot Ticker & Grand Opening Spotlight */}
      <HeroSection />

      {/* 2. Official Video Broadcast & Commercial Spotlight */}
      <VideoAdsSection />

      {/* 3. Ecosystem Pillars Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="text-xs font-bold uppercase tracking-widest text-[#E5B842] font-mono">
            Ecosystem Architecture
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            Five Dedicated Pillars of Digital Wealth
          </h2>
          <p className="text-sm text-slate-400">
            Every product operates with transparent accounting, institutional compliance, and shared identity across web and mobile.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Pillar 1: Nile Crypto Bank */}
          <div 
            onClick={() => setActiveTab('bank')}
            className="group p-6 rounded-3xl bg-[#091124] border border-slate-800 hover:border-[#E5B842]/60 hover:bg-[#0C1630] transition-all cursor-pointer shadow-lg space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#E5B842]/10 border border-[#E5B842]/30 flex items-center justify-center text-[#E5B842] group-hover:scale-110 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-[#E5B842] transition-colors">
                Nile Crypto Bank (NCB)
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Multi-currency accounts supporting USD, EUR, GBP, BTC, ETH, and USDT. Instant internal settlement, statements download, and 3D-Secure card controls.
              </p>
            </div>
            <div className="pt-2 flex items-center text-xs font-bold text-[#E5B842] gap-1 group-hover:translate-x-1 transition-transform">
              <span>Access Banking Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Pillar 2: Nile Investment */}
          <div 
            onClick={() => setActiveTab('investment')}
            className="group p-6 rounded-3xl bg-[#091124] border border-slate-800 hover:border-emerald-500/60 hover:bg-[#0C1630] transition-all cursor-pointer shadow-lg space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                Nile Investment Management
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Five enterprise plan frameworks: Asset-Based, Time-Locked, Amount Tiers, Plan 4 ULTIMATE (up to 50,000%), and 90-Day Surprise Campaign.
              </p>
            </div>
            <div className="pt-2 flex items-center text-xs font-bold text-emerald-400 gap-1 group-hover:translate-x-1 transition-transform">
              <span>Explore Portfolios</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Pillar 3: Nile Marketplace */}
          <div 
            onClick={() => setActiveTab('marketplace')}
            className="group p-6 rounded-3xl bg-[#091124] border border-slate-800 hover:border-purple-500/60 hover:bg-[#0C1630] transition-all cursor-pointer shadow-lg space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">
                Nile Reserve Marketplace
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Rare physical Casascius Bitcoins (0.25 to 10 BTC), genuine certified US $1,000,000 banknotes with bullion bars, crypto packages, and worldwide eSIMs.
              </p>
            </div>
            <div className="pt-2 flex items-center text-xs font-bold text-purple-400 gap-1 group-hover:translate-x-1 transition-transform">
              <span>View Product Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Pillar 4: Nile DEX */}
          <div 
            onClick={() => setActiveTab('dex')}
            className="group p-6 rounded-3xl bg-[#091124] border border-slate-800 hover:border-cyan-500/60 hover:bg-[#0C1630] transition-all cursor-pointer shadow-lg space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <ArrowLeftRight className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                Nile Decentralized Exchange (DEX)
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Non-custodial automated market maker (AMM) swaps with live Recharts multi-timeframe price visualizer, slippage controls, and transparent liquidity pools.
              </p>
            </div>
            <div className="pt-2 flex items-center text-xs font-bold text-cyan-400 gap-1 group-hover:translate-x-1 transition-transform">
              <span>Launch Trading Terminal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Pillar 5: NILE Token & Presale */}
          <div 
            onClick={() => setActiveTab('presale')}
            className="group p-6 rounded-3xl bg-[#091124] border border-[#E5B842]/40 hover:border-[#E5B842] hover:bg-[#0C1630] transition-all cursor-pointer shadow-lg space-y-4 md:col-span-2 lg:col-span-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <NileTokenCoin size="sm" animate={true} />
                <div className="w-10 h-10 rounded-xl bg-[#E5B842]/20 border border-[#E5B842] flex items-center justify-center text-[#E5B842] group-hover:scale-110 transition-transform">
                  <Flame className="w-5 h-5" />
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#E5B842]/10 border border-[#E5B842]/30 text-[#E5B842] text-xs font-mono font-bold">
                Presale Active · $0.05 / NILE
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-[#E5B842] transition-colors">
                NILE Token & Multi-Round Presale
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Native utility token with 500,000,000 fixed supply. 15% unlock at TGE with 85% transparent linear vesting. Holding 1,000,000 NILE unlocks up to 5× yield multipliers.
              </p>
            </div>
            <div className="pt-2 flex items-center text-xs font-bold text-[#E5B842] gap-1 group-hover:translate-x-1 transition-transform">
              <span>Join Presale Allocation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Investment Frameworks Section */}
      <InvestmentPlansSection />

      {/* 4. Marketplace Section */}
      <MarketplaceSection />

      {/* 5. 10-Tier Affiliate Referral Engine */}
      <ReferralSection />

      {/* 6. Verified Institutional Client Testimonials */}
      <TestimonialsSection />

      {/* 7. Corporate Transparency Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#0C1630] via-[#091124] to-[#070D1B] border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Institutional Statutory Transparency & On-Chain Audit Proof</span>
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Nile Investment Ltd operates under English and Welsh law, incorporated at Companies House, Cardiff (CRN: 08253865, VAT: GB 853 3471 65), 
              Vienna Commercial Court (FN 674459 m), and Dubai FTA (TRN 100820028255333). 
              Verified Bitcoin blockchain treasury record: TXID 900d114ebb2cd6f9daae5f4474a0f7dce9292d51c5478810fa21939c19fb885f.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <button
              onClick={() => { setSelectedCertificate('incorporation'); setCertificateModalOpen(true); }}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 border border-slate-700 transition-colors cursor-pointer"
            >
              <Award className="w-4 h-4 text-[#E5B842]" />
              <span>Incorporation Doc</span>
            </button>
            <button
              onClick={() => { setSelectedCertificate('compliance'); setCertificateModalOpen(true); }}
              className="px-4 py-2.5 rounded-xl bg-[#E5B842] hover:bg-[#F3BA2F] text-[#070D1B] font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#070D1B]" />
              <span>Compliance Seal</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
export default HomePage;
