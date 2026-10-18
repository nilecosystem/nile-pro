import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { OFFICIAL_CONTACT_INFO } from '../data/initialData.ts';
import { 
  MessageSquare, 
  X, 
  Send, 
  Phone, 
  Mail, 
  ExternalLink, 
  Star, 
  HelpCircle, 
  CheckCircle,
  FileText
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

export const LiveSupportWidget: React.FC = () => {
  const { 
    supportDrawerOpen, 
    setSupportDrawerOpen, 
    user, 
    submitSupportTicket, 
    submitTestimonial,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'chat' | 'ticket' | 'testimonial' | 'contacts'>('chat');
  
  // Live Chat state
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'agent'; text: string; time: string }>>([
    { 
      sender: 'agent', 
      text: 'Hello Mr. Parsa! Welcome to Nile Ecosystem Concierge. How can our financial operations desk assist you today?', 
      time: 'Just now' 
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Ticket Form state
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState<'account' | 'deposit' | 'withdrawal' | 'cards' | 'marketplace' | 'presale' | 'technical'>('cards');
  const [ticketPriority, setTicketPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [ticketMessage, setTicketMessage] = useState('');

  // Testimonial Form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewProduct, setReviewProduct] = useState<'NCB' | 'Nile Investment' | 'Marketplace' | 'Cards' | 'Presale'>('Cards');
  const [reviewLocation, setReviewLocation] = useState('London, UK');
  const [reviewComment, setReviewComment] = useState('');

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { sender: 'user', text: userText, time: nowTime }]);
    setChatInput('');
    setIsTyping(true);

    // Call Gemini API if GEMINI_API_KEY is available, or fallback to instant smart concierge logic
    let agentReply = '';
    const apiKey = typeof process !== 'undefined' && process.env ? process.env.GEMINI_API_KEY : '';

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `You are the official Senior Concierge & Financial Support Officer for Nile Ecosystem (NILE INVESTMENT LTD, UK Company #08253865).
Ecosystem features:
- Nile Crypto Bank (NCB): Multi-currency accounts (USD, EUR, GBP, BTC, ETH, USDT).
- Crypto Cards: $100 to $100,000 limits, Visa & Mastercard, cashback up to 5%, physical card delivery to USA, Canada, UK, UAE, and all Schengen countries (1 week - 1 month).
- NILE Token & Presale: 500,000,000 total supply, Phase 1 price $0.05.
- Marketplace: Physical Casascius Bitcoins (0.25, 0.5, 1, 10 BTC), authentic $1,000,000 banknote with 6 bullion bars ($500k), Windows 11 & Office genuine licenses, eSIMs.
- Support Phone: +447558847468, WhatsApp: +447552847468, Telegram: https://t.me/Nile_support.

Respond professionally, concisely (1-3 sentences), warmly and helpfully.
User query: ${userText}`
        });
        agentReply = response.text || '';
      } catch (err) {
        // Fallback gracefully
        agentReply = getLocalAgentReply(userText);
      }
    } else {
      agentReply = getLocalAgentReply(userText);
    }

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev, 
        { 
          sender: 'agent', 
          text: agentReply, 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        }
      ]);
    }, 600);
  };

  const getLocalAgentReply = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('card') || q.includes('visa') || q.includes('mastercard') || q.includes('delivery')) {
      return 'Nile Crypto Cards offer balances from $100 to $100,000 with up to 5% cashback. Physical cards are dispatched via secure courier to USA, Canada, UK, UAE, and all Schengen countries with delivery taking 1 to 4 weeks.';
    }
    if (q.includes('presale') || q.includes('token') || q.includes('price')) {
      return 'The NILE Token Presale Phase 1 is active at $0.05 per NILE (500M total token supply). You can participate directly with ETH, BNB, USDT, SOL, or BTC in the Presale section.';
    }
    if (q.includes('deposit') || q.includes('address') || q.includes('wallet')) {
      return 'You can deposit securely to your verified multi-chain addresses located in the Bank & Deposit section. We support Bitcoin, Ethereum, BNB Chain, Solana, and TRON.';
    }
    if (q.includes('kyc') || q.includes('verify')) {
      return 'Identity verification is handled via our secure KYC portal. Tier 1 covers personal details, Tier 2 requires government photo ID, and Tier 3 unlocks high-limit crypto cards and bullion ordering.';
    }
    if (q.includes('contact') || q.includes('phone') || q.includes('call')) {
      return `You can reach our compliance team directly at ${OFFICIAL_CONTACT_INFO.phone} or via WhatsApp at ${OFFICIAL_CONTACT_INFO.whatsapp}.`;
    }
    return `Thank you for your inquiry. Our operations team at Nile Investment Ltd (Company #08253865) has recorded your message. You can also contact us 24/7 on WhatsApp (${OFFICIAL_CONTACT_INFO.whatsapp}) or Telegram (@Nile_support).`;
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;

    submitSupportTicket({
      userName: user.name,
      userEmail: user.email,
      subject: ticketSubject,
      category: ticketCategory,
      priority: ticketPriority,
      message: ticketMessage
    });

    setTicketSubject('');
    setTicketMessage('');
    setActiveTab('chat');
  };

  const handleTestimonialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    submitTestimonial({
      userName: user.name,
      userRoleOrLocation: reviewLocation,
      rating: reviewRating,
      comment: reviewComment,
      productUsed: reviewProduct
    });

    setReviewComment('');
    setActiveTab('chat');
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setSupportDrawerOpen(true)}
        className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-full bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] font-extrabold text-xs shadow-2xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all border border-amber-300"
        aria-label="Open Live Concierge"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#070D1B] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#070D1B]"></span>
        </span>
        <MessageSquare className="w-4 h-4" />
        <span>Nile Concierge</span>
      </button>

      {/* Support Drawer Modal */}
      {supportDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md h-full bg-[#091124] border-l border-slate-800 shadow-2xl flex flex-col">
            {/* Header */}
            <div className="p-4 bg-[#050914] border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E5B842] to-[#B48316] text-[#070D1B] font-black text-sm flex items-center justify-center shadow">
                  JP
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">Johnson Philip</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">Online</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Senior Financial Concierge · Nile Support
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSupportDrawerOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Segmented Tabs */}
            <div className="flex items-center p-2 bg-[#070D1B] border-b border-slate-800 gap-1 text-xs">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition-colors ${
                  activeTab === 'chat' ? 'bg-[#E5B842] text-[#070D1B]' : 'text-slate-400 hover:text-white'
                }`}
              >
                Live Chat
              </button>
              <button
                onClick={() => setActiveTab('ticket')}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition-colors ${
                  activeTab === 'ticket' ? 'bg-[#E5B842] text-[#070D1B]' : 'text-slate-400 hover:text-white'
                }`}
              >
                New Ticket
              </button>
              <button
                onClick={() => setActiveTab('testimonial')}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition-colors ${
                  activeTab === 'testimonial' ? 'bg-[#E5B842] text-[#070D1B]' : 'text-slate-400 hover:text-white'
                }`}
              >
                Testimonial
              </button>
              <button
                onClick={() => setActiveTab('contacts')}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition-colors ${
                  activeTab === 'contacts' ? 'bg-[#E5B842] text-[#070D1B]' : 'text-slate-400 hover:text-white'
                }`}
              >
                Contacts
              </button>
            </div>

            {/* Tab 1: Live Chat */}
            {activeTab === 'chat' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  {messages.map((m, idx) => (
                    <div 
                      key={idx}
                      className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div 
                        className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                          m.sender === 'user' 
                            ? 'bg-[#E5B842] text-[#070D1B] font-medium rounded-br-none' 
                            : 'bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700/80'
                        }`}
                      >
                        {m.text}
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1 px-1">{m.time}</span>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 p-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#E5B842] animate-bounce" />
                      <div className="w-1.5 h-1.5 rounded-full bg-[#E5B842] animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 rounded-full bg-[#E5B842] animate-bounce [animation-delay:0.4s]" />
                      <span className="text-[11px] ml-1">Johnson is typing...</span>
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <form onSubmit={handleSendChat} className="p-3 bg-[#050914] border-t border-slate-800 flex items-center gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about cards, presale, deposits..."
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-[#E5B842]"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-[#E5B842] text-[#070D1B] hover:bg-[#F3BA2F] transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {/* Tab 2: New Ticket */}
            {activeTab === 'ticket' && (
              <form onSubmit={handleTicketSubmit} className="flex-1 p-5 overflow-y-auto space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Subject</label>
                  <input
                    type="text"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    required
                    placeholder="e.g. Card tracking status to France"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-[#E5B842]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Category</label>
                    <select
                      value={ticketCategory}
                      onChange={(e) => setTicketCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-[#E5B842]"
                    >
                      <option value="cards">Crypto Cards</option>
                      <option value="deposit">Deposit & Wallets</option>
                      <option value="withdrawal">Withdrawal Request</option>
                      <option value="marketplace">Marketplace Order</option>
                      <option value="presale">Token Presale</option>
                      <option value="account">KYC & Account</option>
                      <option value="technical">Technical Support</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Priority</label>
                    <select
                      value={ticketPriority}
                      onChange={(e) => setTicketPriority(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-[#E5B842]"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Standard / Medium</option>
                      <option value="high">High Priority</option>
                      <option value="urgent">Urgent Escalation</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Details & Documentation</label>
                  <textarea
                    rows={5}
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    required
                    placeholder="Please specify account reference, transaction hash, or shipment details..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-[#E5B842]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#E5B842] text-[#070D1B] font-bold hover:bg-[#F3BA2F] transition-colors shadow"
                >
                  Submit Official Ticket
                </button>
              </form>
            )}

            {/* Tab 3: Testimonial Submission */}
            {activeTab === 'testimonial' && (
              <form onSubmit={handleTestimonialSubmit} className="flex-1 p-5 overflow-y-auto space-y-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 text-[11px] leading-relaxed">
                  Your feedback helps maintain exceptional quality across the ecosystem. Submitted reviews are reviewed by our compliance officer and published to the landing page.
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Product Evaluated</label>
                  <select
                    value={reviewProduct}
                    onChange={(e) => setReviewProduct(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-[#E5B842]"
                  >
                    <option value="Cards">Nile Crypto Cards</option>
                    <option value="NCB">Nile Crypto Bank (NCB)</option>
                    <option value="Nile Investment">Nile Investment Management</option>
                    <option value="Presale">NILE Token Presale</option>
                    <option value="Marketplace">Nile Marketplace</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Your Location / Title</label>
                  <input
                    type="text"
                    value={reviewLocation}
                    onChange={(e) => setReviewLocation(e.target.value)}
                    placeholder="e.g. Zurich, Switzerland / Private Client"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-[#E5B842]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Overall Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="p-1 text-slate-600 hover:text-[#E5B842]"
                      >
                        <Star className={`w-5 h-5 ${star <= reviewRating ? 'fill-[#E5B842] text-[#E5B842]' : ''}`} />
                      </button>
                    ))}
                    <span className="text-slate-400 font-semibold ml-2">{reviewRating} / 5 Stars</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Your Feedback & Experience</label>
                  <textarea
                    rows={4}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                    placeholder="Share your experience regarding card delivery, presale transparency, or banking operations..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-[#E5B842]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#E5B842] text-[#070D1B] font-bold hover:bg-[#F3BA2F] transition-colors shadow"
                >
                  Send for Verification & Approval
                </button>
              </form>
            )}

            {/* Tab 4: Direct Contacts */}
            {activeTab === 'contacts' && (
              <div className="flex-1 p-5 overflow-y-auto space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-[11px] font-bold text-[#E5B842] uppercase tracking-wider">
                    Official Head Office Desk
                  </div>
                  <div className="font-semibold text-white">NILE INVESTMENT LTD</div>
                  <div className="text-slate-400">Cardiff, Wales, United Kingdom</div>
                </div>

                <a
                  href={`tel:${OFFICIAL_CONTACT_INFO.phone}`}
                  className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="font-semibold">Direct Telephone</div>
                      <div className="text-slate-400 text-[11px]">{OFFICIAL_CONTACT_INFO.phone}</div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-500" />
                </a>

                <a
                  href={`https://wa.me/${OFFICIAL_CONTACT_INFO.whatsapp.replace('+', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="font-semibold">Official WhatsApp</div>
                      <div className="text-slate-400 text-[11px]">{OFFICIAL_CONTACT_INFO.whatsapp}</div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-500" />
                </a>

                <a
                  href={OFFICIAL_CONTACT_INFO.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-4 h-4 text-cyan-400" />
                    <div>
                      <div className="font-semibold">Official Telegram</div>
                      <div className="text-slate-400 text-[11px]">@Nile_support</div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-500" />
                </a>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="font-semibold text-white flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#E5B842]" />
                    <span>Official Email Registry</span>
                  </div>
                  <div className="space-y-1 text-slate-400 text-[11px]">
                    <div>Owner: <span className="text-slate-200">{OFFICIAL_CONTACT_INFO.ownerEmail}</span></div>
                    <div>General: <span className="text-slate-200">{OFFICIAL_CONTACT_INFO.infoEmail}</span></div>
                    <div>Desk: <span className="text-slate-200">{OFFICIAL_CONTACT_INFO.supportEmail}</span></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
