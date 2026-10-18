import React, { useState, useMemo } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  Search, 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  Coins, 
  FileCheck, 
  ThumbsUp, 
  Copy, 
  Check, 
  ExternalLink, 
  MessageSquare, 
  ArrowRight,
  AlertCircle,
  Building2,
  RefreshCw,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';

export interface FaqItem {
  id: string;
  category: 'staking' | 'security' | 'withdrawals' | 'compliance';
  question: string;
  answer: string;
  highlights?: string[];
}

export const INVESTMENT_FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'security',
    question: 'How are my staked assets secured and where is the principal stored?',
    answer: 'All deposited and staked capital is secured in non-custodial, multi-signature cold storage vaults safeguarded by hardware cryptographic enclaves (HSMs) and institutional MPC (Multi-Party Computation) infrastructure. Smart contracts governing the vaults have undergone dual independent security audits by CertiK (Score: 98.4/100) and PeckShield with zero critical vulnerabilities reported. Operating under Nile Investment Ltd (UK Cardiff Registry #08253865), all holdings are 100% backed with segregated 4-ledger accounting.',
    highlights: [
      'Dual audits by CertiK (98.4/100) & PeckShield',
      'Institutional MPC & hardware multi-sig cold storage',
      'Segregated 4-ledger accounting with zero commingling'
    ]
  },
  {
    id: 'faq-2',
    category: 'staking',
    question: 'Where does the staking yield and APR come from?',
    answer: 'Yield is generated through a robust combination of diversified institutional activities: (1) automated algorithmic market-making across verified decentralized exchange liquidity pools, (2) validator node staking rewards on the Nile Smart Chain and proof-of-stake networks, (3) prime-brokerage overcollateralized institutional lending spreads (minimum 150% collateral ratio), and (4) token ecosystem transaction fees redistributed to long-term holders. No synthetic leverage or uncollateralized lending is ever employed.',
    highlights: [
      'Algorithmic liquidity provision & DEX market-making spreads',
      'Proof-of-stake validator node rewards on Nile Smart Chain',
      'Minimum 150% overcollateralized institutional lending spreads'
    ]
  },
  {
    id: 'faq-3',
    category: 'withdrawals',
    question: 'Can I unstake my tokens or withdraw early before the lock period expires?',
    answer: 'Yes. While fixed-horizon vaults (such as 30-day, 90-day, or 180-day plans) offer higher compounded APR, emergency early unstaking is supported across all pools subject to a standard 48-hour compliance cooldown window. In the event of early termination before maturity, your full principal is returned to your Liquid Wallet minus accrued interest and an early liquidation fee (typically 1.5% – 2.5% depending on tier). Flexible Daily and Weekly plans permit immediate withdrawal with zero penalty.',
    highlights: [
      '48-hour compliance cooldown on emergency early withdrawals',
      'Full principal returned directly to your spot Liquid Wallet',
      'Daily and Weekly horizons feature zero penalty unstaking'
    ]
  },
  {
    id: 'faq-4',
    category: 'staking',
    question: 'How frequently are staking returns paid and can I compound them?',
    answer: 'Returns accrue continuously via our real-time 100ms streaming engine (+0.0006944 USDT/sec) and are credited daily to your Investment Ledger. You have the flexibility to either auto-compound your returns to maximize your effective APY, or manually sweep accumulated rewards directly into your spot Liquid Wallet for instantaneous withdrawal, peer transfer, or zero-slippage swap into NILE or BTC.',
    highlights: [
      'Real-time 100ms streaming yield accumulation engine',
      'Daily automated compounding for maximum effective APY',
      'Instant sweeping into spot Liquid Wallet with zero gas fees'
    ]
  },
  {
    id: 'faq-5',
    category: 'security',
    question: 'Does Nile provide on-chain Proof of Reserves (PoR)?',
    answer: 'Yes. We publish real-time cryptographic Merkle-Tree Proof of Reserves verified by third-party auditors and verifiable on-chain. Nile maintains a minimum 115% reserve buffer across all treasury assets (USDT, BTC, ETH, and NILE), ensuring immediate liquidity for spot withdrawals and institutional disbursements at all times without exposure to bank-run risks.',
    highlights: [
      'Real-time cryptographic Merkle-Tree Proof of Reserves',
      'Minimum 115% reserve buffer maintained 24/7',
      'Publicly verifiable on-chain treasury addresses'
    ]
  },
  {
    id: 'faq-6',
    category: 'staking',
    question: 'What advantages do NILE token holders receive in staking pools?',
    answer: 'Holding and staking native NILE tokens unlocks exclusive tier multipliers (up to 2.0× APR boost), reduced protocol fees, higher daily withdrawal limits, and early access to Seed & Private presale allocations. Diamond and Platinum holders also receive dedicated private banking concierge support and fee waivers across virtual corporate card issuances.',
    highlights: [
      'Up to 2.0× APR multiplier boost on all asset vaults',
      'Priority access to Private & Seed presale allocation rounds',
      'Zero-fee virtual card issuance and dedicated concierge'
    ]
  },
  {
    id: 'faq-7',
    category: 'compliance',
    question: 'What KYC verification tier is required to start investing and staking?',
    answer: 'To comply with international AML (Anti-Money Laundering) regulations and UK FCA financial guidelines: Tier 1 (Email & Phone verification) allows staking up to $5,000 USD; Tier 2 (Government Photo ID) unlocks limits up to $25,000 USD; and Tier 3 (Proof of Address & Source of Funds) is required for institutional positions exceeding $25,000 USD. Verification is powered by our biometric compliance gateway and typically completes in under 2 minutes.',
    highlights: [
      'Tier 1 (Instant): Up to $5,000 USD staking',
      'Tier 2 (Photo ID): Up to $25,000 USD positions',
      'Tier 3 (Proof of Address): Institutional & Diamond tier access'
    ]
  },
  {
    id: 'faq-8',
    category: 'compliance',
    question: 'How can I obtain statements and tax reports for my earnings?',
    answer: 'You can download a complete CSV audit statement of all your deposits, withdrawals, and accrued staking yields anytime from the Transaction History tab in the User Dashboard. All records include on-chain transaction hashes (TXIDs), precise timestamps, and USD-pegged valuation for easy accounting and tax filing.',
    highlights: [
      '1-click CSV export with complete TXID verification',
      'USD-pegged accounting records for seamless tax compliance',
      'Full cryptographic ledger synchronization'
    ]
  },
  {
    id: 'faq-9',
    category: 'withdrawals',
    question: 'What happens automatically when my investment reaches its maturity date?',
    answer: 'Upon reaching the specified maturity date, your initial principal plus all accrued returns are automatically settled and unlocked into your Liquid Wallet. You will receive an instant push notification and email confirmation. You may then withdraw the funds, execute zero-slippage swaps, or re-stake into a new horizon with 1 click.',
    highlights: [
      'Automated settlement directly to spot Liquid Wallet',
      'Zero rollover lockup or mandatory reinvestment traps',
      'Instant on-chain confirmation & email receipt'
    ]
  },
  {
    id: 'faq-10',
    category: 'security',
    question: 'What is the difference between the 4 ledgers in the Nile Treasury?',
    answer: 'Nile implements segregated 4-ledger accounting to guarantee zero commingling of funds: (1) Liquid Wallet for spot trading and immediate withdrawals, (2) Investment Ledger for active yield-generating locked capital, (3) NILE Token Ledger for staked ecosystem governance assets, and (4) Affiliate Ledger for multi-tier network commission payouts.',
    highlights: [
      '1. Liquid Wallet: Spot trading & immediate outbound disbursements',
      '2. Investment Ledger: Active yielding principal & compounded returns',
      '3. NILE Token Ledger: Native staked governance & 2× multipliers',
      '4. Affiliate Ledger: 10-tier commission revenue stream'
    ]
  }
];

export const InvestmentFaqSection: React.FC = () => {
  const { showToast, setCertificateModalOpen } = useApp();

  const [activeCategory, setActiveCategory] = useState<'all' | 'staking' | 'security' | 'withdrawals' | 'compliance'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>('faq-1');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [helpfulMap, setHelpfulMap] = useState<Record<string, boolean>>({});

  const categories = [
    { id: 'all', label: 'All Questions', count: INVESTMENT_FAQS.length },
    { id: 'staking', label: 'Staking & Yield', count: INVESTMENT_FAQS.filter(f => f.category === 'staking').length },
    { id: 'security', label: 'Security & Custody', count: INVESTMENT_FAQS.filter(f => f.category === 'security').length },
    { id: 'withdrawals', label: 'Lockup & Withdrawals', count: INVESTMENT_FAQS.filter(f => f.category === 'withdrawals').length },
    { id: 'compliance', label: 'KYC & Compliance', count: INVESTMENT_FAQS.filter(f => f.category === 'compliance').length }
  ];

  const filteredFaqs = useMemo(() => {
    return INVESTMENT_FAQS.filter(faq => {
      const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
      if (!matchesCategory) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const inQuestion = faq.question.toLowerCase().includes(query);
        const inAnswer = faq.answer.toLowerCase().includes(query);
        const inHighlights = faq.highlights ? faq.highlights.some(h => h.toLowerCase().includes(query)) : false;
        return inQuestion || inAnswer || inHighlights;
      }
      return true;
    });
  }, [activeCategory, searchQuery]);

  const handleToggle = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const handleCopyAnswer = (e: React.MouseEvent, faq: FaqItem) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${faq.question}\n\n${faq.answer}`);
    setCopiedId(faq.id);
    showToast('FAQ guidance copied to clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleToggleHelpful = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const current = helpfulMap[id];
    setHelpfulMap(prev => ({ ...prev, [id]: !current }));
    if (!current) {
      showToast('Thank you for your feedback!', 'success');
    }
  };

  const scrollToCalculator = () => {
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  return (
    <section className="space-y-6 pt-4">
      {/* Section Header with Trust Metrics */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#091124] via-[#060B17] to-[#0A1633] border-2 border-slate-800 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5B842]/10 border border-[#E5B842]/30 text-[#E5B842] text-[11px] font-mono font-bold uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Institutional Knowledge Base</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
              Investment & Staking FAQ
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Transparent answers regarding non-custodial capital protection, yield mechanics, early unstaking rules, and regulatory compliance under UK corporate registration.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={scrollToCalculator}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-[#E5B842] text-xs font-bold text-slate-200 hover:text-white transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E5B842]" />
              <span>Simulate ROI</span>
            </button>
            <button
              type="button"
              onClick={() => setCertificateModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#E5B842] text-[#070D1B] text-xs font-extrabold hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>View Legal Certs</span>
            </button>
          </div>
        </div>

        {/* Trust Badges Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>100% Merkle PoR</span>
            </div>
            <div className="text-[11px] text-slate-400">Cryptographically verified proof of reserves with 115%+ backing.</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1">
            <div className="flex items-center gap-2 text-[#E5B842] text-xs font-bold">
              <Award className="w-4 h-4 shrink-0" />
              <span>CertiK Audited (98.4)</span>
            </div>
            <div className="text-[11px] text-slate-400">Dual security audit by CertiK and PeckShield with zero exploits.</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold">
              <Building2 className="w-4 h-4 shrink-0" />
              <span>UK Registered Entity</span>
            </div>
            <div className="text-[11px] text-slate-400">Nile Investment Ltd Cardiff Registry #08253865 compliance.</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1">
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold">
              <Lock className="w-4 h-4 shrink-0" />
              <span>Segregated 4-Ledger</span>
            </div>
            <div className="text-[11px] text-slate-400">Multi-sig institutional cold vaults with zero fund commingling.</div>
          </div>
        </div>

        {/* Search & Category Filter Tabs */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 p-1 rounded-2xl bg-[#060B17] border border-slate-800">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    activeCategory === cat.id
                      ? 'bg-[#E5B842] text-[#070D1B] shadow-md font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    activeCategory === cat.id ? 'bg-black/20 text-[#070D1B]' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search queries (e.g. PoR, APR, unstake)..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#E5B842] transition-colors font-mono"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Accordion Questions List */}
        <div className="space-y-3 pt-2">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => {
              const isOpen = expandedId === faq.id;
              const isHelpful = helpfulMap[faq.id];

              const categoryBadge = {
                staking: { label: 'Staking & Yield', color: 'text-[#E5B842] bg-[#E5B842]/10 border-[#E5B842]/30' },
                security: { label: 'Security & Custody', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
                withdrawals: { label: 'Lockup & Withdrawals', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
                compliance: { label: 'KYC & Compliance', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' }
              }[faq.category];

              return (
                <div 
                  key={faq.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen 
                      ? 'bg-slate-900/90 border-[#E5B842]/60 shadow-lg shadow-black/40' 
                      : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/70'
                  }`}
                >
                  {/* Question Button Header */}
                  <button
                    type="button"
                    onClick={() => handleToggle(faq.id)}
                    className="w-full p-4 sm:p-5 text-left flex items-start sm:items-center justify-between gap-4 cursor-pointer select-none group"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <span className="font-mono text-xs font-bold text-slate-500 group-hover:text-[#E5B842] shrink-0 mt-0.5 sm:mt-0">
                        {String(index + 1).padStart(2, '0')}.
                      </span>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider ${categoryBadge.color}`}>
                            {categoryBadge.label}
                          </span>
                        </div>
                        <h3 className={`text-sm sm:text-base font-bold transition-colors ${
                          isOpen ? 'text-white' : 'text-slate-200 group-hover:text-white'
                        }`}>
                          {faq.question}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                        isOpen ? 'bg-[#E5B842] text-[#070D1B]' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                      }`}>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                  </button>

                  {/* Expanded Answer Content */}
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 space-y-4 border-t border-slate-800/70 text-xs sm:text-sm text-slate-300 leading-relaxed animate-fade-in">
                      <p className="font-sans text-slate-300">
                        {faq.answer}
                      </p>

                      {/* Key Highlights Callouts */}
                      {faq.highlights && faq.highlights.length > 0 && (
                        <div className="p-3.5 rounded-xl bg-[#060B17] border border-slate-800/90 space-y-2">
                          <div className="text-[11px] font-mono font-bold text-[#E5B842] uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3" />
                            <span>Key Institutional Highlights:</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {faq.highlights.map((h, i) => (
                              <div key={i} className="flex items-start gap-2 text-slate-300">
                                <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                                <span>{h}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions Footer: Copy Answer & Helpful Feedback */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/50 text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => handleCopyAnswer(e, faq)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer text-[11px]"
                            title="Copy answer text"
                          >
                            {copiedId === faq.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Answer</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div className="flex items-center gap-2 text-slate-400">
                          <span className="text-[11px]">Was this helpful?</span>
                          <button
                            type="button"
                            onClick={(e) => handleToggleHelpful(e, faq.id)}
                            className={`p-1.5 rounded-lg border transition-all flex items-center gap-1 cursor-pointer text-[11px] ${
                              isHelpful
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border-transparent'
                            }`}
                          >
                            <ThumbsUp className="w-3 h-3" />
                            <span>{isHelpful ? 'Helpful' : 'Yes'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
              <div className="text-sm font-bold text-white">No questions matching "{searchQuery}"</div>
              <p className="text-xs text-slate-400">
                Try searching for keywords like "PoR", "APR", "unstake", "reserves", or reset category filters.
              </p>
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                className="px-4 py-2 rounded-xl bg-[#E5B842] text-[#070D1B] font-bold text-xs hover:brightness-110 cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Trust Banner & Direct Assistance Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0C1733] via-[#091124] to-[#0C1733] border border-[#E5B842]/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Need Bespoke Institutional Investment Terms?</span>
            </h4>
            <p className="text-xs text-slate-400 max-w-xl">
              Family offices, treasury allocators, and accredited investors with $100,000+ deployments can request segregated custodial contracts and custom staking durations with our UK compliance team.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('open-dashboard-modal'))}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Open Treasury
            </button>
            <button
              type="button"
              onClick={() => showToast('Connecting to 24/7 Institutional Support...', 'info')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] font-extrabold text-xs shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Contact Custody Desk</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
