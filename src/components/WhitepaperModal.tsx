import React, { useState } from 'react';
import { NileTokenCoin } from './NileTokenCoin.tsx';
import { 
  FileText, 
  Download, 
  ShieldCheck, 
  ExternalLink, 
  X, 
  CheckCircle,
  BookOpen,
  Layers,
  Coins,
  Cpu,
  TrendingUp,
  Building2,
  Calendar,
  ArrowRight,
  GitCommit,
  Check,
  Award,
  Sparkles,
  Lock,
  RefreshCw,
  Zap,
  Globe
} from 'lucide-react';
import { OFFICIAL_SUPPORT_CHANNELS } from '../data/paymentConfig.ts';

interface WhitepaperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SectionItem {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  isVisual?: boolean;
  content: string;
}

const SECTIONS: SectionItem[] = [
  {
    id: 'executive',
    title: '1. Executive Vision & Public Trust: The First Genuine Nile Crypto Bank',
    subtitle: 'Restoring Institutional Trust Through Autonomous AI Governance & Legal Authority',
    tag: 'Executive Vision',
    content: `The global cryptocurrency and decentralized finance (DeFi) landscapes have long struggled with counterparty hazards, opaque custody schemes, unverified solvency, and fragmented legal structures. NILE Investment Platform & NILE Crypto Bank (NCB) were founded to resolve this crisis of confidence.

NCB is established as the world's first genuine, legally incorporated "Nile Crypto Bank" engineered specifically to cultivate unwavering public and institutional trust. Unlike unregulated protocols or closed-source offshore exchanges, Nile Ecosystem unites:
1. Sovereign statutory corporate identity under English and Welsh law (Companies House Cardiff, Reg #08253865) and European Union commercial registration (Vienna Commercial Court, FN 674459 m).
2. Autonomous, 100% Artificial Intelligence-managed banking and investment infrastructure that removes human intermediaries, subjective delays, emotional biases, and operational errors.
3. Cryptographically transparent on-chain reserves, verifiable on public ledgers (including permanent Bitcoin blockchain transaction proofs).
4. Full liquidity interoperability spanning traditional fiat currency settlement (USD, EUR, GBP) and audited multi-chain cryptocurrency networks (Bitcoin, Ethereum, BNB Chain, TRON, Solana, and XRP Ledger).`
  },
  {
    id: 'ai-architecture',
    title: '2. Autonomous Artificial Intelligence Operational Architecture',
    subtitle: '100% of Platform Operations Managed by Autonomous Algorithmic Systems',
    tag: 'AI Operations',
    content: `A central pillar of the Nile Crypto Bank ethos is that human discretion in financial custody introduces risk. Consequently, 100% of platform operations are governed by autonomous artificial intelligence agents operating continuously across distributed nodes.

Key AI Operational Protocols:
• Predictive Liquidity & Capital Routing: The Nile AI Engine monitors real-time depth across verified automated market makers (AMMs) and institutional OTC order books, executing liquidity rebalancing with zero slippage and instantaneous arbitrage mitigation.
• Autonomous Real-Time AML & KYC Compliance: Biometric validation and continuous sanctions-watchlist screening occur in sub-80 millisecond response windows, ensuring full alignment with FATF, UK FCA, and EU AMLD6 directives without bureaucratic stagnation.
• Algorithmic Treasury Risk Neutralization: In volatile market conditions, the AI Treasury Controller dynamically hedges reserve assets into algorithmic stablecoins, tokenized gold (XAUt/PAXG), and segregated cold vaults to ensure 100% capital preservation for all deposit liabilities.
• Autonomous Yield Engine: Yield accruals across Asset-Based, Time-Locked, Amount Tiers, and Plan 4 ULTIMATE frameworks are calculated, balanced, and disbursed programmatically per second via immutable smart contracts with zero human manual intervention.`
  },
  {
    id: 'compliance',
    title: '3. International Regulatory Compliance & Fiduciary Proofs',
    subtitle: 'Triple-Jurisdiction Corporate Registration & On-Chain Audit Proof',
    tag: 'Statutory Compliance',
    content: `NILE Ecosystem Ltd and its operating subsidiaries function within strict statutory boundaries to provide legal certainty to high-net-worth individuals, institutional partners, and retail clients worldwide.

Statutory Registrations:
• United Kingdom (Primary Sovereign Entity): NILE INVESTMENT LTD incorporated at Companies House, Crown Way, Cardiff, CF14 3UZ under English & Welsh company law. Company Registration Number (CRN): 08253865. VAT Registration: GB 853 3471 65.
• Republic of Austria / European Union: Registered at the Commercial Court of Vienna (Handelsgericht Wien) under FN 674459 m. Tax Authority Identification / UID: ATU-69250650.
• United Arab Emirates (Middle East Operations): Registered under Dubai Federal Tax Authority (FTA). Tax Registration Number (TRN): 100820028255333.
• Immutable On-Chain Bitcoin Proof of Reserve: TXID 900d114ebb2cd6f9daae5f4474a0f7dce9292d51c5478810fa21939c19fb885f permanently inscribed on the Bitcoin blockchain as statutory proof of capitalization.`
  },
  {
    id: 'platform-workflow',
    title: '4. Platform Operational Workflow (Visual System Architecture)',
    subtitle: 'End-to-End Operational Lifecycle: Client Ingestion to Real-Time AI Settlement',
    tag: 'Visual Workflow',
    isVisual: true,
    content: `The Nile Ecosystem operational workflow is architected into 5 distinct, synchronized layers. Every transaction is authenticated, routed, and settled without manual delay.`
  },
  {
    id: 'platform-roadmap',
    title: '5. Platform Strategic Roadmap (2026 – 2028+)',
    subtitle: 'Comprehensive Timeline for Global Expansion, Banking Licenses & Sovereign Layer-1',
    tag: 'Visual Roadmap',
    isVisual: true,
    content: `The strategic multi-year development roadmap for the overarching Nile Ecosystem and Nile Crypto Bank infrastructure.`
  },
  {
    id: 'token-workflow',
    title: '6. NILE Token: Dedicated Architecture & Operational Workflow',
    subtitle: 'Separate Token Operational Lifecycle, Dynamic Burn & Staking Multipliers',
    tag: 'Token Workflow',
    isVisual: true,
    content: `A dedicated breakdown of the economic and computational workflow specifically governing the native NILE utility token.`
  },
  {
    id: 'token-roadmap',
    title: '7. NILE Token: Dedicated Multi-Year Strategic Roadmap',
    subtitle: 'Targeted Milestone Roadmap: Presale, Exchange Listings, Bridges & Sovereign Gas',
    tag: 'Token Roadmap',
    isVisual: true,
    content: `A dedicated milestone roadmap exclusively tracking the evolution, listings, bridge deployments, and utility rollouts of the NILE Token.`
  },
  {
    id: 'tokenomics',
    title: '8. NILE Tokenomics & Treasury Reserve Distribution',
    subtitle: '500,000,000 Fixed Cap with Programmatic On-Chain Linear Vesting',
    tag: 'Tokenomics',
    content: `The native NILE token serves as the governance, utility, and settlement asset across all ecosystem branches.
• Total Fixed Supply: Exactly 500,000,000 NILE (Mint function permanently revoked in smart contract).
• Distribution Architecture:
  - 30% Public Seed & Strategic Presale (15% unlocked at TGE, 85% vested linearly over 9 months)
  - 25% Ecosystem Treasury & Reserve Fund (6-month initial cliff, 36-month linear distribution)
  - 20% Staking & Yield Multiplier Vaults (Programmatic liquidity disbursements per block)
  - 15% Core Contributors & Founders (12-month cliff, 24-month linear vesting)
  - 10% Nile DEX Automated Liquidity Pools (Permanently locked liquidity pairs on BNB & Ethereum)
• The 1,000,000 NILE Multiplier Rule: Holding and staking 1,000,000 NILE unlocks an immediate 1.5× yield boost on the ULTIMATE Plan and up to 5× boosts on all other portfolio tiers.`
  },
  {
    id: 'yield-engine',
    title: '9. Investment Engine & Mathematical Proofs',
    subtitle: 'Five Verified Portfolio Frameworks Powered by Algorithmic Compounding',
    tag: 'Yield Engine',
    content: `NCB operates five distinct institutional portfolio frameworks backed by the 100% Institutional Guarantee of Nile Ecosystem Ltd:
1. Plan 1 — Asset Based: High-liquidity daily disbursements: USDT (1.95%/day), ETH (0.95%/day), BTC (0.85%/day).
2. Plan 2 — Time Locked: Maturity locks: 30-Day (+25% / +50% boosted), 50-Day (+55% / +110% boosted), 100-Day Dynasty (+140% / +280% boosted).
3. Plan 3 — Progressive Amount Tiers: Micro capital (0.25%/day) scaling dynamically up to Apex (12.0%/day base, 24.0%/day with 1M NILE booster).
4. Plan 4 — ULTIMATE Plan: Flagship framework capped at 100 investors / $1,000,000 per asset pool. Horizons: Daily (5.0%/day), Monthly (50.0%), 3 Months (500.0%), 6 Months (5,000.0%), and 1 Year (50,000.0%).
5. NILE 90-Day Ultimate Surprise Campaign: Fixed pool triggers for Gold (XAUt/PAXG), ETC, BCH, EURI, and NILE offering returns of 150% (weekly), 1,500% (monthly), and 15,000% (3 months).`
  },
  {
    id: 'banking-cards',
    title: '10. Nile Crypto Bank (NCB) & Card Infrastructure',
    subtitle: 'Private Wealth Multi-Currency Accounts & International 3D-Secure Cards',
    tag: 'Banking & Cards',
    content: `NCB provides private client and institutional corporate accounts supporting USD, EUR, and GBP alongside native cryptocurrencies with instant internal cross-asset settlement.

Cardholder Specifications:
• All official cards issued under the verified account of Matin Parsa (Official Cardholder):
  - VISA Platinum International: 4319 5900 0423 3787
  - Mastercard World Black: 5205 8123 1047 5546
  - Mastercard Commercial Elite: 5331 7141 0044 8336
• Card Limits & Perks: Balances from $100 to $100,000 with 1% to 5% instant cashback in NILE token, zero foreign exchange conversion surcharges, and worldwide contactless acceptance across 180+ countries.`
  }
];

export const WhitepaperModal: React.FC<WhitepaperModalProps> = ({ isOpen, onClose }) => {
  const [activeSectionId, setActiveSectionId] = useState<string>('executive');

  if (!isOpen) return null;

  const currentSection = SECTIONS.find(s => s.id === activeSectionId) || SECTIONS[0];

  const handleDownloadPdf = () => {
    const textOutput = `NILE INVESTMENT PLATFORM & NILE CRYPTO BANK (NCB)
OFFICIAL TECHNICAL DUAL WHITEPAPER & REGULATORY DOSSIER (2026 - 2028)
================================================================================
CORPORATE JURISDICTION & REGULATORY IDENTIFIERS:
• United Kingdom: NILE INVESTMENT LTD (Cardiff Companies House CRN: 08253865 | VAT: GB 853 3471 65)
• Austria / European Union: Handelsgericht Wien (FN 674459 m | UID: ATU-69250650)
• United Arab Emirates: Dubai Federal Tax Authority (TRN: 100820028255333)
• On-Chain Bitcoin Treasury Proof: TXID 900d114ebb2cd6f9daae5f4474a0f7dce9292d51c5478810fa21939c19fb885f
• Official Domain & Channels: https://nileecosystem.com | YouTube: @Nilecosystem
================================================================================

` + SECTIONS.map(s => `
[${s.title.toUpperCase()}]
${s.subtitle}
--------------------------------------------------------------------------------
${s.content}
`).join('\n\n') + `
================================================================================
END OF OFFICIAL DOSSIER · ISSUED BY NILE ECOSYSTEM STATUTORY COMPLIANCE DESK
`;

    const blob = new Blob([textOutput], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'NILE_Crypto_Bank_Official_Whitepaper_Dossier_2026.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-6xl p-5 sm:p-8 rounded-3xl bg-[#070D1B] border-2 border-[#E5B842]/40 shadow-2xl space-y-6 my-6 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <NileTokenCoin size="sm" animate />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white">NILE Ecosystem Dual Whitepaper</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold">
                  v2.8 Audited
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Autonomous AI Banking Architecture · Statutory Compliance · Dedicated Token Roadmap
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] font-extrabold text-xs flex items-center gap-1.5 shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Full Dossier</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main 2-Column Split: Navigation Sidebar (4 cols) & Content/Visual Viewer (8 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start overflow-hidden flex-1 min-h-0">
          {/* Section Navigation Tabs List */}
          <div className="lg:col-span-4 space-y-1.5 overflow-y-auto max-h-[70vh] pr-1 scrollbar-thin">
            {SECTIONS.map((sec) => {
              const isSelected = sec.id === activeSectionId;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSectionId(sec.id)}
                  className={`w-full p-3 rounded-2xl text-left transition-all border cursor-pointer flex flex-col space-y-1 ${
                    isSelected
                      ? 'bg-slate-900 border-[#E5B842] shadow-lg shadow-[#E5B842]/10 scale-[1.01]'
                      : 'bg-[#050914] border-slate-800/80 text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      isSelected ? 'bg-[#E5B842] text-[#070D1B]' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {sec.tag}
                    </span>
                    {sec.isVisual && (
                      <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/30">
                        Visual
                      </span>
                    )}
                  </div>
                  <div className={`text-xs font-bold leading-snug line-clamp-2 ${
                    isSelected ? 'text-white' : 'text-slate-300'
                  }`}>
                    {sec.title}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Section Detail & Interactive Visual Renderer (8 cols) */}
          <div className="lg:col-span-8 p-5 sm:p-7 rounded-3xl bg-[#040812] border border-slate-800 space-y-6 overflow-y-auto max-h-[70vh] scrollbar-thin">
            {/* Active Section Header */}
            <div className="space-y-1.5 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#E5B842] uppercase tracking-wider">
                  {currentSection.tag}
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-[11px] text-emerald-400 font-mono">Fiduciary Spec 2026</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
                {currentSection.title}
              </h3>
              <p className="text-xs text-slate-400">
                {currentSection.subtitle}
              </p>
            </div>

            {/* Standard Text Content */}
            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line space-y-4">
              {currentSection.content}
            </div>

            {/* ========================================================= */}
            {/* DEDICATED VISUAL COMPONENT 1: PLATFORM WORKFLOW */}
            {/* ========================================================= */}
            {currentSection.id === 'platform-workflow' && (
              <div className="pt-4 space-y-6 border-t border-slate-800/80">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#E5B842]" />
                    <span>Nile Ecosystem Platform Architecture Workflow</span>
                  </h4>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    Autonomous AI Pipeline
                  </span>
                </div>

                {/* Interactive Workflow Node Diagram */}
                <div className="space-y-3">
                  {[
                    {
                      step: '01',
                      title: 'Multi-Asset Client Ingestion',
                      actor: 'User & Institutional Depositor',
                      desc: 'Supports direct deposit via 9 Treasury Crypto Vaults (BTC, ETH, SOL, TRX, XRP, BNB, BCH, ETC) & 3 International Bank Cards in USD, EUR, GBP.',
                      color: 'border-blue-500/40 bg-blue-500/5',
                      badge: 'Multi-Currency Gateway'
                    },
                    {
                      step: '02',
                      title: 'Autonomous AI AML & Sanctions Scanner',
                      actor: 'Neural Compliance Agent',
                      desc: 'Instant < 80ms scan against global PEP and sanctions watchlists. Fully compliant with UK FCA, Austrian FMA, and UAE regulatory standards.',
                      color: 'border-emerald-500/40 bg-emerald-500/5',
                      badge: '100% AI Compliance'
                    },
                    {
                      step: '03',
                      title: 'Algorithmic Smart Contract Liquidity Router',
                      actor: 'Nile DEX AMM & Order Routing Engine',
                      desc: 'Directs capital dynamically between liquid AMM pools, institutional OTC desks, and zero-slippage conversion paths with real-time volatility mitigation.',
                      color: 'border-[#E5B842]/40 bg-[#E5B842]/5',
                      badge: 'Zero-Loss Routing'
                    },
                    {
                      step: '04',
                      title: 'Segregated Cold Storage & Reserve Capitalization',
                      actor: 'Deep Institutional Vaults & Bullion Depository',
                      desc: 'Funds distributed into multisig cold storage, tokenized gold reserves (XAUt), and physical Casascius Bitcoin vaults with on-chain cryptographic proofs.',
                      color: 'border-purple-500/40 bg-purple-500/5',
                      badge: 'Audited Reserves'
                    },
                    {
                      step: '05',
                      title: 'Real-Time Payouts, Card Settlement & Yield Streams',
                      actor: 'Automated Banking & Yield Engine',
                      desc: 'Daily liquid yields, instant card swipes with up to 5% cashback, and automated wire settlement released directly to account holders without human delay.',
                      color: 'border-cyan-500/40 bg-cyan-500/5',
                      badge: 'Instant Liquidity'
                    }
                  ].map((node, idx) => (
                    <div key={node.step} className="relative group">
                      <div className={`p-4 rounded-2xl border ${node.color} space-y-2 transition-all hover:scale-[1.01]`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded-xl bg-slate-900 font-mono text-xs font-black text-[#E5B842] flex items-center justify-center border border-slate-700">
                              {node.step}
                            </span>
                            <span className="font-bold text-white text-xs sm:text-sm">{node.title}</span>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                            {node.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 pl-9 leading-relaxed">
                          {node.desc}
                        </p>
                        <div className="text-[10px] font-mono text-slate-500 pl-9">
                          Managed by: <span className="text-slate-400 font-semibold">{node.actor}</span>
                        </div>
                      </div>
                      {idx < 4 && (
                        <div className="flex justify-center -my-1 py-1">
                          <div className="w-0.5 h-3 bg-slate-700" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* DEDICATED VISUAL COMPONENT 2: PLATFORM STRATEGIC ROADMAP */}
            {/* ========================================================= */}
            {currentSection.id === 'platform-roadmap' && (
              <div className="pt-4 space-y-6 border-t border-slate-800/80">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#E5B842]" />
                    <span>Nile Ecosystem Multi-Year Platform Roadmap (2026 – 2028+)</span>
                  </h4>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    Phased Execution
                  </span>
                </div>

                <div className="relative border-l-2 border-slate-800 ml-4 pl-6 space-y-6">
                  {[
                    {
                      phase: 'Phase 1: Foundation & Genesis',
                      timeline: 'Q1 – Q2 2026',
                      status: 'COMPLETED / ACTIVE',
                      statusColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
                      milestones: [
                        'UK Companies House incorporation (CRN: 08253865) and Austrian EU branch registration',
                        'Launch of Nile Crypto Bank (NCB) multi-currency accounts and treasury deposit addresses',
                        'Deployment of 5 core investment frameworks including Plan 4 ULTIMATE',
                        'Integration of Recharts live DEX trading terminal and AMM liquidity pairs',
                        'Public Seed Presale rollout at $0.05 / NILE with automated 15% TGE unlock'
                      ]
                    },
                    {
                      phase: 'Phase 2: Global Card Issuance & Autonomous AI Scaling',
                      timeline: 'Q3 – Q4 2026',
                      status: 'IN PROGRESS',
                      statusColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
                      milestones: [
                        'Physical delivery of VISA Platinum & Mastercard World Black cards across 29+ Schengen countries',
                        'Full activation of the Autonomous AI Fraud Scanner and sub-second settlement engine',
                        'Expansion of physical reserve marketplace (1,000,000 banknote bullion & Casascius coins)',
                        'Opening of institutional OTC desks in Vienna, London, and Dubai'
                      ]
                    },
                    {
                      phase: 'Phase 3: Cross-Border Banking & Cross-Chain Alliances',
                      timeline: '2027',
                      status: 'PLANNED',
                      statusColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
                      milestones: [
                        'Direct SEPA Instant, Fedwire, and UK Faster Payments autonomous settlement bridges',
                        'Cross-chain liquidity pools with Solana, TRON, and Ethereum Layer-2 rollups',
                        'Launch of the 90-Day Surprise Campaign Phase 2 across tokenized precious metals',
                        'Institutional custody partnerships with audited Tier-1 Swiss vault depositories'
                      ]
                    },
                    {
                      phase: 'Phase 4: Sovereign Nile Layer-1 Blockchain Mainnet',
                      timeline: '2028+',
                      status: 'VISIONARY',
                      statusColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
                      milestones: [
                        'Genesis block deployment of the dedicated high-throughput Nile L1 Blockchain',
                        'Migration of NILE Token to native sovereign gas and validator staking asset',
                        'Decentralized autonomous banking consortium spanning European, MENA, and Asian markets',
                        'Permanent immutable dynasty reserves backing 100% of ecosystem liabilities'
                      ]
                    }
                  ].map((phaseItem) => (
                    <div key={phaseItem.phase} className="relative space-y-2">
                      <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-[#E5B842] border-2 border-[#070D1B]" />
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-bold text-white text-xs sm:text-sm">{phaseItem.phase}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-[#E5B842]">{phaseItem.timeline}</span>
                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded border font-bold uppercase ${phaseItem.statusColor}`}>
                            {phaseItem.status}
                          </span>
                        </div>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                        {phaseItem.milestones.map((m, mIdx) => (
                          <div key={mIdx} className="flex items-start gap-2 text-xs text-slate-300">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{m}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* DEDICATED VISUAL COMPONENT 3: NILE TOKEN DEDICATED WORKFLOW */}
            {/* ========================================================= */}
            {currentSection.id === 'token-workflow' && (
              <div className="pt-4 space-y-6 border-t border-slate-800/80">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Coins className="w-4 h-4 text-[#E5B842]" />
                    <span>NILE Token Dedicated Lifecycle & Operational Workflow</span>
                  </h4>
                  <span className="text-[10px] font-mono text-[#E5B842] bg-[#E5B842]/10 px-2 py-0.5 rounded border border-[#E5B842]/30">
                    500M Fixed Token Cap
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      step: 'Token Phase 1',
                      title: 'Smart Contract Genesis & Fixed Supply Lock',
                      desc: 'Exactly 500,000,000 NILE tokens minted at contract genesis. All minting and balance alteration keys permanently renounced.'
                    },
                    {
                      step: 'Token Phase 2',
                      title: 'Presale Allocation & Linear Vesting Vaults',
                      desc: '15% instant unlock at TGE with remaining 85% stream-released across 9 months via verified on-chain smart contracts.'
                    },
                    {
                      step: 'Token Phase 3',
                      title: 'DEX AMM Liquidity & Pair Seeding',
                      desc: 'Permanent NILE/USDT, NILE/BTC, and NILE/ETH liquidity pools seeded on BNB Smart Chain and Ethereum DEX.'
                    },
                    {
                      step: 'Token Phase 4',
                      title: '1,000,000 NILE Staking Multiplier Boost',
                      desc: 'Holding and staking 1,000,000 tokens unlocks 1.5× yield multipliers on Plan 4 ULTIMATE and up to 5× boosts on all other tiers.'
                    },
                    {
                      step: 'Token Phase 5',
                      title: 'Banking Utility & Card Fee Reductions',
                      desc: 'Staking NILE waives international ATM fees, reduces foreign exchange conversion spreads, and unlocks 5% card cashback.'
                    },
                    {
                      step: 'Token Phase 6',
                      title: 'Deflationary Buyback & Burn Engine',
                      desc: '20% of net platform banking commissions programmatically repurchase NILE tokens on open markets and send them to the dead burn address.'
                    }
                  ].map((tStep) => (
                    <div key={tStep.step} className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[#E5B842] font-bold uppercase">{tStep.step}</span>
                        <NileTokenCoin size="xs" />
                      </div>
                      <div className="font-bold text-white text-xs">{tStep.title}</div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{tStep.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* DEDICATED VISUAL COMPONENT 4: NILE TOKEN DEDICATED ROADMAP */}
            {/* ========================================================= */}
            {currentSection.id === 'token-roadmap' && (
              <div className="pt-4 space-y-6 border-t border-slate-800/80">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#E5B842]" />
                    <span>NILE Token Dedicated Multi-Year Strategic Roadmap</span>
                  </h4>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    Token Milestones
                  </span>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      epoch: 'T-Epoch 1: Genesis & Seed Pioneer Round',
                      period: 'Q1 – Q2 2026',
                      badge: 'CURRENTLY ACTIVE',
                      color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
                      points: [
                        'Token Presale Phase 1 live at $0.05 / NILE (Seed pioneer allocation: 50,000,000 tokens)',
                        'Smart contract security audit completed with 100% test coverage and zero critical vulnerabilities',
                        'Integration of 3D Gold Horus Coin numismatic branding across all mobile & web dApps',
                        'Initial DEX listing on PancakeSwap (BEP-20) and Uniswap (ERC-20)'
                      ]
                    },
                    {
                      epoch: 'T-Epoch 2: Tier-1 Exchange Listings & Staking Vaults',
                      period: 'Q3 – Q4 2026',
                      badge: 'IN PIPELINE',
                      color: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
                      points: [
                        'Listings on Tier-1 centralized cryptocurrency exchanges (CEXs) including Bitget, MEXC, and Gate.io',
                        'Launch of the 30-day, 90-day, 180-day, and 365-day Diamond Staking Pools with up to 32% APR',
                        'Implementation of the 1,000,000 NILE Multiplier across all NCB institutional investment accounts',
                        'Marketplace integration unlocking 20% discount on all crypto reserve packages when settling with NILE'
                      ]
                    },
                    {
                      epoch: 'T-Epoch 3: Cross-Chain Bridges & Institutional Settlement',
                      period: '2027',
                      badge: 'DEVELOPMENT',
                      color: 'border-blue-500/40 bg-blue-500/10 text-blue-300',
                      points: [
                        'Bi-directional cross-chain bridges connecting BNB Chain, Ethereum, Solana, and TRON networks',
                        'Integration into high-limit Black Metal cards for direct POS real-world merchant spend',
                        'First quarterly programmatic buyback and token burn execution using 20% of banking profits',
                        'Institutional liquidity underwriting by European private wealth desks'
                      ]
                    },
                    {
                      epoch: 'T-Epoch 4: Sovereign Nile Layer-1 Blockchain Gas Migration',
                      period: '2028+',
                      badge: 'DYNASTY ERA',
                      color: 'border-purple-500/40 bg-purple-500/10 text-purple-300',
                      points: [
                        '1:1 native migration from ERC-20/BEP-20 to the sovereign Nile Layer-1 Blockchain native gas coin',
                        'Validator node staking rewards and decentralized governance DAO activation',
                        'Sovereign wealth fund reserve allocations and cross-border commercial bank clearing integration',
                        'Permanent hard cap preservation: 500M fixed supply across all historical and future ledgers'
                      ]
                    }
                  ].map((epoch) => (
                    <div key={epoch.epoch} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                        <div className="flex items-center gap-2">
                          <NileTokenCoin size="xs" />
                          <span className="font-bold text-white text-xs sm:text-sm">{epoch.epoch}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-[#E5B842]">{epoch.period}</span>
                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded border font-bold uppercase ${epoch.color}`}>
                            {epoch.badge}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1.5 pl-2">
                        {epoch.points.map((pt, pIdx) => (
                          <div key={pIdx} className="flex items-start gap-2 text-xs text-slate-300">
                            <CheckCircle className="w-3.5 h-3.5 text-[#E5B842] shrink-0 mt-0.5" />
                            <span>{pt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Audit Notice */}
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 font-mono gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>UK Companies House CRN: #08253865 · Vienna FN 674459m · Dubai TRN 100820028255333</span>
          </div>
          <span className="text-emerald-400 font-bold">100% Institutional Guarantee · Autonomous AI Managed</span>
        </div>
      </div>
    </div>
  );
};
export default WhitepaperModal;
