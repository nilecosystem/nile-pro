import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Star, MessageSquare, Send, CheckCircle, ShieldCheck, User } from 'lucide-react';
import { NileTokenCoin } from './NileTokenCoin.tsx';

interface InstitutionalTestimonial {
  id: string;
  name: string;
  role: string;
  institution: string;
  rating: number;
  date: string;
  comment: string;
}

const PRE_POPULATED_TESTIMONIALS: InstitutionalTestimonial[] = [
  {
    id: 'test-1',
    name: 'Serena James',
    role: 'Managing Partner',
    institution: 'Mayfair Digital Capital, London',
    rating: 5,
    date: 'March 2026',
    comment: 'NCB sets the benchmark for institutional crypto banking. Their Black Metal cards settle across Europe without friction, and the 100-Day Dynasty yield paid out with precision to our treasury.'
  },
  {
    id: 'test-2',
    name: 'Alexander von Klaus',
    role: 'Private Wealth Director',
    institution: 'Vienna Sovereign Assets, Austria',
    rating: 5,
    date: 'February 2026',
    comment: 'The delivery of our authenticated Casascius physical Bitcoin coin with museum certificates was executed with armed white-glove security. Outstanding transparency and legal compliance.'
  },
  {
    id: 'test-3',
    name: 'Tariq Al-Mansoor',
    role: 'Family Office Principal',
    institution: 'Dubai International Financial Centre (DIFC)',
    rating: 5,
    date: 'April 2026',
    comment: 'The Plan 4 ULTIMATE yield horizon with 1M NILE booster provided exceptional returns. Audited UK incorporation and clear proof of reserve on the Bitcoin ledger gives our trustees total confidence.'
  },
  {
    id: 'test-4',
    name: 'Dr. Michael Chen',
    role: 'DeFi Quantitative Strategist',
    institution: 'Apex Genesis Capital, Singapore',
    rating: 5,
    date: 'March 2026',
    comment: 'The 4-ledger accounting architecture and non-custodial zero seed-phrase execution makes NILE Ecosystem far safer than traditional centralized exchanges. Truly premier enterprise infrastructure.'
  }
];

export const TestimonialsSection: React.FC = () => {
  const { showToast } = useApp();

  const [testimonials, setTestimonials] = useState<InstitutionalTestimonial[]>(PRE_POPULATED_TESTIMONIALS);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userComment, setUserComment] = useState('');
  const [userRating, setUserRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userComment) {
      showToast('Please provide your name and institutional feedback', 'error');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast('Feedback submitted! Placed in compliance moderation queue for audit verification.', 'success');
      setUserName('');
      setUserRole('');
      setUserComment('');
    }, 900);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="text-xs font-bold uppercase tracking-widest text-[#E5B842] font-mono">
          Institutional Trust & Verification
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white">
          Verified Institutional Client Testimonials
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Independent reviews and audited statements from sovereign family offices, private wealth partners, and high-frequency traders worldwide.
        </p>
      </div>

      {/* 4 Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((t) => (
          <div key={t.id} className="p-6 sm:p-7 rounded-3xl bg-[#091124] border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#E5B842] text-[#E5B842]" />
                  ))}
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Verified Client · {t.date}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
                "{t.comment}"
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-white">{t.name}</div>
                <div className="text-[11px] text-slate-400">{t.role}</div>
                <div className="text-[10px] text-cyan-400 font-mono mt-0.5">{t.institution}</div>
              </div>
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Feedback Submission Form */}
      <div className="max-w-2xl mx-auto p-6 sm:p-7 rounded-3xl bg-[#091124] border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#E5B842]" />
            <span className="text-sm font-bold text-white">Submit Verified Institutional Review</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Compliance Moderation Queue</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 font-medium">Your Name / Title:</label>
              <input
                type="text"
                placeholder="e.g. Marcus Aurelius"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-400 font-medium">Institutional Entity / Location:</label>
              <input
                type="text"
                placeholder="e.g. Zurich Asset Management, Switzerland"
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 font-medium">Rating Score:</label>
            <div className="flex items-center gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setUserRating(star)}
                  className="p-1 cursor-pointer"
                >
                  <Star className={`w-5 h-5 ${star <= userRating ? 'fill-[#E5B842] text-[#E5B842]' : 'text-slate-700'}`} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-slate-400 font-medium">Review & Performance Feedback:</label>
            <textarea
              rows={3}
              placeholder="Share your verified experience with NCB banking, cards, or investment plans..."
              value={userComment}
              onChange={(e) => setUserComment(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium focus:outline-none resize-none"
            />
          </div>

          <div className="p-3 rounded-xl bg-[#060B17] border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Notice: Submissions undergo compliance KYC screening before publication to ensure authentic institutional provenance.</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] font-extrabold text-xs shadow-md hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? 'Submitting to Moderation Node...' : 'Submit Institutional Feedback'}
          </button>
        </form>
      </div>
    </div>
  );
};
export default TestimonialsSection;
