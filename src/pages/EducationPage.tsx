import React, { useState } from 'react';
import { 
  GraduationCap, 
  Search, 
  BookOpen, 
  ShieldCheck, 
  AlertTriangle, 
  CreditCard, 
  HelpCircle, 
  ChevronDown, 
  ExternalLink 
} from 'lucide-react';

export const EducationPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const guides = [
    {
      title: 'Wallet Security: Hardware & Non-Custodial Integrity',
      category: 'Security',
      readTime: '4 min read',
      summary: 'Never share private keys or seed phrases with anyone. Nile representatives will never request private credentials.'
    },
    {
      title: 'Understanding Multi-Chain Networks & Avoiding Mismatches',
      category: 'Blockchain',
      readTime: '6 min read',
      summary: 'Distinguish between Ethereum (ERC20), BNB Smart Chain (BEP20), TRON (TRC20), and Solana SPL before transmitting digital assets.'
    },
    {
      title: 'Tokenomics Architecture: Vesting Schedules & Cliffs',
      category: 'Economics',
      readTime: '5 min read',
      summary: 'How linear unlock timelines safeguard long-term stability and prevent market dilution across the 500,000,000 NILE supply.'
    },
    {
      title: 'Nile Crypto Cards: Worldwide POS, ATM & Schengen Delivery',
      category: 'Banking',
      readTime: '4 min read',
      summary: 'Step-by-step activation of your Visa or Mastercard, setting spending limits, and delivery tracking across 29 Schengen countries.'
    }
  ];

  const faqs = [
    {
      q: 'Is Nile Investment Ltd a legally registered corporate entity?',
      a: 'Yes. Nile Investment Ltd is incorporated under the Companies Act 2006 at Companies House, Cardiff, United Kingdom (Company Number: 08253865). Our official certificates of incorporation and compliance are viewable on the platform.'
    },
    {
      q: 'Which countries are supported for physical crypto card delivery?',
      a: 'We ship physical cards directly via insured tracked courier to the United Kingdom, United States, Canada, United Arab Emirates (UAE), and all 29 Schengen Area countries (including France, Germany, Italy, Spain, Switzerland, etc.). Delivery takes 1 week to 1 month maximum.'
    },
    {
      q: 'What is the total supply of the NILE Token?',
      a: 'The total supply is strictly capped at 500,000,000 NILE. Allocations comprise 30% Presale, 25% Ecosystem Fund, 20% Staking & Community, 15% Founders & Core Contributors, and 10% Liquidity/DEX.'
    },
    {
      q: 'How does the platform ensure transparent investments without fake guarantees?',
      a: 'In accordance with international regulatory guidelines, Nile Investment does not advertise or promise guaranteed returns. All portfolio strategies operate under audited smart contract yield algorithms and verifiable treasury reserves.'
    },
    {
      q: 'How do I contact official customer support?',
      a: 'You can reach us 24/7 via phone (+447558847468), WhatsApp (+447552847468), Telegram (@Nile_support), or by opening a ticket directly in the platform concierge desk.'
    }
  ];

  const filteredGuides = guides.filter(g => 
    g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
          <GraduationCap className="w-4 h-4" />
          <span>Knowledge & Compliance Academy</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Nile Financial Education Center
        </h1>
        <p className="text-xs text-slate-400">
          Learn blockchain fundamentals, custody management, card security, and token mechanics.
        </p>
      </div>

      {/* Search Input */}
      <div className="max-w-md mx-auto relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search articles, wallet security, card delivery..."
          className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-[#E5B842]"
        />
      </div>

      {/* Featured Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGuides.map((guide, idx) => (
          <div key={idx} className="p-6 rounded-3xl bg-[#091124] border border-slate-800 space-y-3 hover:border-[#E5B842]/40 transition-all">
            <div className="flex items-center justify-between text-xs">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-[#E5B842] font-semibold text-[10px] uppercase">
                {guide.category}
              </span>
              <span className="text-slate-500 text-[11px]">{guide.readTime}</span>
            </div>

            <h3 className="text-base font-bold text-white hover:text-[#E5B842] transition-colors cursor-pointer">
              {guide.title}
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              {guide.summary}
            </p>

            <div className="pt-2 text-xs font-semibold text-[#E5B842] flex items-center gap-1 cursor-pointer hover:underline">
              <span>Read Full Documentation</span>
              <ExternalLink className="w-3 h-3" />
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Accordion */}
      <div className="p-8 rounded-3xl bg-[#091124] border border-slate-800 space-y-6">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#E5B842]" />
          <h2 className="text-lg font-bold text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 text-xs font-bold text-white hover:bg-slate-800/40 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-[#E5B842]' : ''}`} />
                </button>

                {isOpen && (
                  <div className="p-4 pt-0 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 mt-1">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
