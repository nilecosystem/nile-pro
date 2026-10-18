import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { NileTokenCoin } from './NileTokenCoin.tsx';
import { OFFICIAL_CONTACT_INFO } from '../data/initialData.ts';
import { 
  Mail, 
  Phone, 
  MessageSquare, 
  ExternalLink, 
  ShieldCheck, 
  Award, 
  FileText, 
  ArrowUpRight,
  Globe,
  Youtube
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { 
    t, 
    setActiveTab, 
    setCertificateModalOpen, 
    setSelectedCertificate,
    setSupportDrawerOpen 
  } = useApp();

  return (
    <footer className="w-full bg-[#050914] border-t border-slate-800/80 text-slate-400 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/60">
          {/* Col 1: Brand & Mascot & Legal Entity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <NileTokenCoin size="sm" animate />
              <div>
                <div className="text-xl font-black text-white tracking-wider">
                  NILE <span className="text-[#E5B842]">ECOSYSTEM</span>
                </div>
                <div className="text-xs text-[#E5B842] font-semibold tracking-widest uppercase">
                  Hunt Opportunities. Build Wealth.
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The unified digital finance ecosystem integrating decentralized liquidity (Nile DEX), institutional digital banking (NCB), structured multi-plan investments, international crypto cards, and rare physical collectibles.
            </p>

            {/* Corporate Registration Box */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5 max-w-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-200">
                  {OFFICIAL_CONTACT_INFO.registeredCompany}
                </span>
                <span className="text-[10px] font-mono font-semibold text-emerald-400">
                  Active UK Registry
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Company Number: <span className="text-white font-mono font-semibold">{OFFICIAL_CONTACT_INFO.companyNumber}</span>
              </div>
              <div className="text-[10px] text-slate-500">
                Registered at {OFFICIAL_CONTACT_INFO.registryJurisdiction}
              </div>
              <div className="pt-2 flex items-center gap-3 text-xs">
                <button
                  onClick={() => { setSelectedCertificate('incorporation'); setCertificateModalOpen(true); }}
                  className="text-[#E5B842] hover:underline flex items-center gap-1 font-semibold"
                >
                  <Award className="w-3.5 h-3.5" />
                  View Certificate
                </button>
                <span className="text-slate-700">|</span>
                <button
                  onClick={() => { setSelectedCertificate('compliance'); setCertificateModalOpen(true); }}
                  className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Compliance Seal
                </button>
              </div>
            </div>
          </div>

          {/* Col 2: Products */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Ecosystem Products
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => { setActiveTab('bank'); window.scrollTo(0, 0); }} className="hover:text-[#E5B842] transition-colors">
                  Nile Crypto Bank (NCB)
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('investment'); window.scrollTo(0, 0); }} className="hover:text-[#E5B842] transition-colors">
                  Nile Investment Management
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('marketplace'); window.scrollTo(0, 0); }} className="hover:text-[#E5B842] transition-colors">
                  Digital & Physical Marketplace
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('dex'); window.scrollTo(0, 0); }} className="hover:text-[#E5B842] transition-colors">
                  Nile DEX Swaps & Liquidity
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('token'); window.scrollTo(0, 0); }} className="hover:text-[#E5B842] transition-colors">
                  NILE Token & Tokenomics
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('presale'); window.scrollTo(0, 0); }} className="text-[#E5B842] font-semibold hover:underline flex items-center gap-1">
                  NILE Token Presale
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('cards'); window.scrollTo(0, 0); }} className="hover:text-[#E5B842] transition-colors">
                  International Crypto Cards
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Resources & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Compliance & Education
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('open-kyc-modal'))} 
                  className="hover:text-[#E5B842] transition-colors text-left cursor-pointer"
                >
                  KYC 3-Tier Verification
                </button>
              </li>
              <li>
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('open-whitepaper-modal'))} 
                  className="hover:text-[#E5B842] transition-colors text-left cursor-pointer font-bold text-white flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5 text-[#E5B842]" />
                  <span>Dual Technical Whitepaper</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('open-security-modal'))} 
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Statutory Security & Proof of Reserve</span>
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('referrals'); window.scrollTo(0, 0); }} className="hover:text-[#E5B842] transition-colors text-left cursor-pointer">
                  10-Tier Affiliate Program
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('education'); window.scrollTo(0, 0); }} className="hover:text-[#E5B842] transition-colors text-left cursor-pointer">
                  Education & Blockchain Guides
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('admin'); window.scrollTo(0, 0); }} className="hover:text-[#E5B842] transition-colors flex items-center gap-1 text-slate-500 hover:text-slate-300 text-left cursor-pointer">
                  Founder & Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Verified Contacts & Channels */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Official Channels
            </h4>
            <div className="space-y-2 text-xs">
              <a 
                href={`mailto:${OFFICIAL_CONTACT_INFO.supportEmail}`} 
                className="flex items-center gap-2 hover:text-[#E5B842] transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#E5B842]" />
                <span>{OFFICIAL_CONTACT_INFO.supportEmail}</span>
              </a>

              <a 
                href={`mailto:${OFFICIAL_CONTACT_INFO.infoEmail}`} 
                className="flex items-center gap-2 hover:text-[#E5B842] transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>{OFFICIAL_CONTACT_INFO.infoEmail}</span>
              </a>

              <a 
                href={`tel:${OFFICIAL_CONTACT_INFO.phone}`} 
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{OFFICIAL_CONTACT_INFO.phone}</span>
              </a>

              <a 
                href={`https://wa.me/${OFFICIAL_CONTACT_INFO.whatsapp.replace('+', '')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp: {OFFICIAL_CONTACT_INFO.whatsapp}</span>
              </a>

              <a 
                href={OFFICIAL_CONTACT_INFO.telegram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Telegram: @Nile_support</span>
              </a>

              <a 
                href={OFFICIAL_CONTACT_INFO.twitter} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-sky-400" />
                <span>X: @nileecosystem</span>
              </a>

              <a 
                href={OFFICIAL_CONTACT_INFO.youtube} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-red-400 transition-colors"
              >
                <Youtube className="w-3.5 h-3.5 text-red-500" />
                <span>YouTube: @Nilecosystem</span>
              </a>
            </div>
          </div>
        </div>

        {/* Legal Disclosures & Risk Notices */}
        <div className="pt-8 space-y-4 text-[11px] text-slate-500 leading-relaxed">
          <p>
            <strong className="text-slate-400">Risk Disclosure:</strong> Digital asset values fluctuate rapidly and past performance is no guarantee of future returns. Financial operations in Nile Investment and Nile Crypto Bank operate under transparent contractual parameters without unverified or fabricated guarantees. All card issuances, physical bullion shipments, and token presale allocations are executed subject to completed identity verification (KYC/AML) and international compliance laws.
          </p>
          <p>
            <strong className="text-slate-400">Custodial Distinction:</strong> Non-custodial operations (such as Nile DEX swaps and direct Web3 presale interactions) occur directly between user wallets and audited smart contracts. Custodial account services, payment cards, and physical vault deliveries are administered by Nile Investment Ltd and licensed partner financial institutions.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-900 text-xs">
            <div>
              © 2026 NILE INVESTMENT LTD. All rights reserved. Registered in Cardiff, UK #08253865.
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span className="hover:text-slate-200 cursor-pointer">Privacy Policy</span>
              <span>·</span>
              <span className="hover:text-slate-200 cursor-pointer">Terms of Service</span>
              <span>·</span>
              <span className="hover:text-slate-200 cursor-pointer">AML & Sanctions Policy</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
