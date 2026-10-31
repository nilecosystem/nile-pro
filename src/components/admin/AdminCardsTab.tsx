import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { 
  CreditCard, 
  Plus, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Truck, 
  Check, 
  X, 
  Sliders, 
  DollarSign, 
  Percent, 
  Save, 
  Sparkles 
} from 'lucide-react';
import { CryptoCard } from '../../types/index.ts';
import { NileTokenCoin } from '../NileTokenCoin.tsx';

export const AdminCardsTab: React.FC = () => {
  const { 
    cards, 
    adminUpdateCard, 
    adminIssueCard, 
    toggleCardStatus,
    showToast 
  } = useApp();

  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editLimit, setEditLimit] = useState<number>(5000);
  const [editCashback, setEditCashback] = useState<number>(3.0);
  const [editTracking, setEditTracking] = useState<string>('');

  // Issue Card Modal
  const [showIssueModal, setShowIssueModal] = useState<boolean>(false);
  const [cardholderName, setCardholderName] = useState('Matin Parsa');
  const [type, setType] = useState<'visa' | 'mastercard'>('visa');
  const [tier, setTier] = useState<CryptoCard['tier']>('Black Elite');
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'GBP'>('USD');
  const [initialBalance, setInitialBalance] = useState<number>(10000);
  const [isPhysical, setIsPhysical] = useState<boolean>(true);
  const [shippingCountry, setShippingCountry] = useState('United Kingdom');

  const handleStartEdit = (card: CryptoCard) => {
    setEditingCardId(card.id);
    setEditLimit(card.limits?.dailySpending || 5000);
    setEditCashback(card.tier === 'Black Elite' ? 5.0 : card.tier === 'Gold' ? 3.0 : 1.5);
    setEditTracking(card.shippingAddress?.street ? `DHL-CARD-${Math.floor(100000 + Math.random() * 900000)}GB` : '');
  };

  const handleSaveEdit = (id: string) => {
    adminUpdateCard(id, {
      limits: {
        dailySpending: editLimit,
        monthlySpending: editLimit * 10,
        dailyAtm: Math.min(2500, editLimit * 0.5)
      }
    });
    setEditingCardId(null);
    showToast(`Card limits and preferences saved`, 'success');
  };

  const handleIssueCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const last4 = Math.floor(1000 + Math.random() * 9000).toString();
    const newCard: Omit<CryptoCard, 'id'> = {
      cardNumberMasked: `•••• •••• •••• ${last4}`,
      cardholderName,
      expiryMonth: '12',
      expiryYear: '29',
      cvv: Math.floor(100 + Math.random() * 900).toString(),
      type,
      tier,
      currency,
      cashbackRate: tier === 'Black Elite' ? 5.0 : tier === 'Gold' ? 3.0 : 1.5,
      balance: initialBalance,
      status: 'active',
      isPhysical,
      limits: {
        dailySpending: initialBalance,
        monthlySpending: initialBalance * 10,
        dailyAtm: 2500
      },
      shippingAddress: isPhysical ? {
        street: '10 Downing Street, Westminster',
        city: 'London',
        postalCode: 'SW1A 2AA',
        country: shippingCountry,
        schengenOrRegion: 'United Kingdom'
      } : undefined
    };

    adminIssueCard(newCard);
    setShowIssueModal(false);
  };

  const totalCardLiquidity = cards.reduce((sum, c) => sum + c.balance, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#091124] border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-[#E5B842] flex items-center gap-1.5">
            <CreditCard className="w-4 h-4" />
            <span>Card Program Administration</span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">
            Visa &amp; Mastercard Crypto Cards Console
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            Control customer card spending limits, manage instant freeze/unfreeze security protocols, and dispatch physical metal cards to Schengen, UK, UAE, and USA.
          </p>
        </div>

        <button
          onClick={() => setShowIssueModal(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] font-extrabold text-xs shadow-lg hover:scale-105 transition-all flex items-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Provision New Card</span>
        </button>
      </div>

      {/* Overview Metric Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#091124] border border-slate-800">
          <div className="text-xs text-slate-400">Total Issued Cards</div>
          <div className="text-2xl font-black text-white font-mono mt-1">{cards.length} Active Cards</div>
          <div className="text-[10px] text-emerald-400 mt-1">Apple Pay &amp; Google Pay Enabled</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#091124] border border-slate-800">
          <div className="text-xs text-slate-400">Total Program Liquidity</div>
          <div className="text-2xl font-black text-[#E5B842] font-mono mt-1">
            ${totalCardLiquidity.toLocaleString()} USD
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Preloaded on-chain balances</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#091124] border border-slate-800">
          <div className="text-xs text-slate-400">Delivery Coverage</div>
          <div className="text-lg font-bold text-white mt-1">Schengen &amp; International</div>
          <div className="text-[10px] text-cyan-400 mt-1">Insured Courier with Tracking</div>
        </div>
      </div>

      {/* Cards List Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#091124] border border-slate-800 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#E5B842]" />
            <span>Active Cardholders &amp; Limits Registry</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">Showing {cards.length} cards</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((c) => (
            <div 
              key={c.id}
              className="p-6 rounded-3xl bg-[#060B17] border border-slate-800 hover:border-[#E5B842]/40 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Visual Mini Card */}
                <div className={`p-4 rounded-2xl border shadow-lg flex flex-col justify-between aspect-[1.586] ${
                  c.tier === 'Black Elite'
                    ? 'bg-gradient-to-tr from-[#05070e] to-[#151D2F] border-amber-400/50'
                    : c.tier === 'Gold'
                      ? 'bg-gradient-to-tr from-[#2b2005] to-[#453609] border-yellow-500/60'
                      : 'bg-gradient-to-tr from-[#0B1528] to-[#152342] border-cyan-500/40'
                }`}>
                  <div className="flex items-center justify-between text-xs">
                    <NileTokenCoin size="xs" />
                    <span className="font-mono text-[10px] font-bold text-[#E5B842] uppercase">
                      {c.tier}
                    </span>
                  </div>
                  <div className="font-mono text-sm tracking-widest text-white font-bold">
                    {c.cardNumberMasked}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-300">
                    <span className="font-semibold uppercase">{c.cardholderName}</span>
                    <span className="font-bold italic">{c.type.toUpperCase()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Available Balance</span>
                    <div className="text-base font-black text-white font-mono">
                      ${c.balance.toLocaleString()} {c.currency}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleCardStatus(c.id)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase transition-colors ${
                      c.status === 'active'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {c.status === 'active' ? 'ACTIVE' : 'FROZEN'}
                  </button>
                </div>

                {/* Edit Form or Display */}
                {editingCardId === c.id ? (
                  <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">Daily Limit ($)</label>
                      <input
                        type="number"
                        value={editLimit}
                        onChange={(e) => setEditLimit(parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                      />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handleSaveEdit(c.id)}
                        className="flex-1 py-1.5 rounded-lg bg-emerald-500 text-white font-bold text-xs"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingCardId(null)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1 text-xs font-mono text-slate-300 pt-2 border-t border-slate-800/80">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Daily Limit:</span>
                      <span className="text-white font-bold">${(c.limits?.dailySpending || 5000).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Card Form:</span>
                      <span className="text-cyan-400">{c.isPhysical ? 'Physical Metal' : 'Instant Virtual'}</span>
                    </div>
                  </div>
                )}
              </div>

              {editingCardId !== c.id && (
                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => handleStartEdit(c)}
                    className="w-full py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-[#E5B842] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Sliders className="w-3.5 h-3.5 text-[#E5B842]" />
                    <span>Adjust Limits &amp; Security</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: PROVISION NEW CARD */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-[#091124] border border-[#E5B842]/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#E5B842]" />
                <span>Issue &amp; Provision New Crypto Card</span>
              </h3>
              <button onClick={() => setShowIssueModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleIssueCardSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Cardholder Legal Name</label>
                <input
                  type="text"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-semibold focus:outline-none focus:border-[#E5B842]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Card Network</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-semibold focus:outline-none focus:border-[#E5B842]"
                  >
                    <option value="visa">Visa Network</option>
                    <option value="mastercard">Mastercard Network</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Card Tier</label>
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-semibold focus:outline-none focus:border-[#E5B842]"
                  >
                    <option value="Standard">Standard Silver ($100 - $5k)</option>
                    <option value="Gold">Gold Metal Elite ($5k - $25k)</option>
                    <option value="Black Elite">Black Sovereign VIP ($25k - $100k)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Initial Preloaded Balance</label>
                  <input
                    type="number"
                    value={initialBalance}
                    onChange={(e) => setInitialBalance(parseFloat(e.target.value) || 0)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono font-bold focus:outline-none focus:border-[#E5B842]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-semibold focus:outline-none focus:border-[#E5B842]"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Card Medium</label>
                  <select
                    value={isPhysical ? 'true' : 'false'}
                    onChange={(e) => setIsPhysical(e.target.value === 'true')}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-semibold focus:outline-none focus:border-[#E5B842]"
                  >
                    <option value="true">Physical Heavy Metal Card</option>
                    <option value="false">Instant Virtual Card</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Destination Country</label>
                  <input
                    type="text"
                    value={shippingCountry}
                    onChange={(e) => setShippingCountry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-[#E5B842]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] font-extrabold text-xs shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Issue &amp; Authorize Card</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
