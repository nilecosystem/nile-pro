import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { 
  CreditCard, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  Plus, 
  Truck, 
  CheckCircle, 
  Sliders, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { SCHENGEN_COUNTRIES, ALL_SHIPPING_REGIONS } from '../data/initialData.ts';

export const CardsPage: React.FC = () => {
  const { 
    cards, 
    toggleCardStatus, 
    updateCardLimit, 
    orderCryptoCard, 
    user 
  } = useApp();

  const [activeCardId, setActiveCardId] = useState<string>(cards[0]?.id || '');
  const [showCvv, setShowCvv] = useState<boolean>(false);
  const [orderModalOpen, setOrderModalOpen] = useState<boolean>(false);

  // New Card Form State
  const [newCardType, setNewCardType] = useState<'visa' | 'mastercard'>('visa');
  const [newCardTier, setNewCardTier] = useState<'Standard' | 'Gold' | 'Black Elite'>('Gold');
  const [newCardCurrency, setNewCardCurrency] = useState<'USD' | 'EUR' | 'GBP'>('USD');
  const [newCardBalance, setNewCardBalance] = useState<number>(5000);
  const [isPhysical, setIsPhysical] = useState<boolean>(true);
  const [shippingCountry, setShippingCountry] = useState<string>('United Kingdom');
  const [shippingStreet, setShippingStreet] = useState<string>('10 Downing Street');
  const [shippingCity, setShippingCity] = useState<string>('London');
  const [shippingPostal, setShippingPostal] = useState<string>('SW1A 2AA');

  const currentCard = cards.find(c => c.id === activeCardId) || cards[0];

  const handleOrderCard = (e: React.FormEvent) => {
    e.preventDefault();
    orderCryptoCard({
      type: newCardType,
      tier: newCardTier,
      currency: newCardCurrency,
      initialBalance: newCardBalance,
      isPhysical,
      shippingAddress: isPhysical ? {
        street: shippingStreet,
        city: shippingCity,
        postalCode: shippingPostal,
        country: shippingCountry,
        schengenOrRegion: SCHENGEN_COUNTRIES.includes(shippingCountry) ? 'Schengen Area' : 'International'
      } : undefined
    });
    setOrderModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[#091124] border border-slate-800 shadow-xl">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-[#E5B842]">
            International Payment Cards
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white mt-1">
            Nile Visa & Mastercard Crypto Cards
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Preloaded digital asset cards with balances from $100 to $100,000. Delivered to USA, Canada, UK, UAE, and all Schengen countries.
          </p>
        </div>

        <button
          onClick={() => setOrderModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] font-extrabold text-xs shadow-lg hover:scale-105 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Apply for New Card</span>
        </button>
      </div>

      {/* 3D Crypto Cards Trio Photography Showcase with Finance Background */}
      <div className="relative w-full h-48 sm:h-64 rounded-3xl overflow-hidden border border-[#E5B842]/40 shadow-2xl bg-[#030611] group">
        <img 
          src="/assets/products/nile-cards-trio.png" 
          alt="Nile Visa & Mastercard Crypto Cards" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#091124] via-transparent to-transparent opacity-75" />
        <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs">
          <span className="px-3 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-[#E5B842]/50 text-[#E5B842] font-mono font-bold">
            Standard Silver · Gold Metal Elite · Black Sovereign VIP
          </span>
          <span className="px-3 py-1 rounded-xl bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-emerald-400 font-mono font-bold">
            Instant Virtual + Insured Worldwide Physical Courier
          </span>
        </div>
      </div>

      {/* Main Card Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Card Visual & Quick Controls */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card Visual Presentation */}
          <div className={`relative w-full aspect-[1.586] rounded-3xl p-7 shadow-2xl flex flex-col justify-between overflow-hidden transition-all duration-500 border ${
            currentCard.tier === 'Black Elite' 
              ? 'bg-gradient-to-tr from-[#05070e] via-[#111827] to-[#0A0F1D] border-amber-400/50' 
              : currentCard.tier === 'Gold'
                ? 'bg-gradient-to-tr from-[#2b2005] via-[#453609] to-[#1a1403] border-yellow-500/60'
                : 'bg-gradient-to-tr from-[#0B1528] via-[#152342] to-[#0A1020] border-cyan-500/40'
          }`}>
            {/* Background sheen */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-white/10 via-transparent to-transparent rounded-bl-full pointer-events-none" />

            {/* Top Bar: Nile Logo + Tier */}
            <div className="flex items-center justify-between relative z-10">
              <span className="text-xs font-black tracking-widest text-[#E5B842] uppercase font-sans">
                NILE {currentCard.tier.toUpperCase()}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                currentCard.status === 'active' 
                  ? 'bg-emerald-500/20 text-emerald-400' 
                  : 'bg-amber-500/20 text-amber-400'
              }`}>
                {currentCard.status.toUpperCase()}
              </span>
            </div>

            {/* EMV Chip & Contactless */}
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-11 h-8 rounded bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-700 p-0.5 shadow flex items-center justify-center">
                <div className="w-8 h-5 border border-amber-950/40 rounded-sm" />
              </div>
              <span className="text-slate-400 font-mono text-sm rotate-90">))))</span>
            </div>

            {/* Card Number */}
            <div className="relative z-10 space-y-1">
              <div className="font-mono text-lg sm:text-xl tracking-widest text-white font-bold drop-shadow">
                {showCvv ? currentCard.fullCardNumber || currentCard.cardNumberMasked : currentCard.cardNumberMasked}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-semibold uppercase tracking-wider">{currentCard.cardholderName}</span>
                <span className="font-mono">EXP: {currentCard.expiryMonth}/{currentCard.expiryYear}</span>
                <span className="font-mono">CVV: {showCvv ? currentCard.cvv : '•••'}</span>
              </div>
            </div>

            {/* Bottom: Balance & Network Logo */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10 relative z-10">
              <div>
                <span className="text-[10px] text-slate-400 block">Available Balance</span>
                <span className="text-lg font-black text-white font-mono">
                  ${currentCard.balance.toLocaleString()} {currentCard.currency}
                </span>
              </div>
              <span className="text-xl font-black italic tracking-wider text-white">
                {currentCard.type.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Quick Actions for Selected Card */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <button
              onClick={() => toggleCardStatus(currentCard.id)}
              className={`p-3 rounded-2xl border font-bold flex items-center justify-center gap-2 transition-colors ${
                currentCard.status === 'active'
                  ? 'border-amber-500/40 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                  : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
              }`}
            >
              {currentCard.status === 'active' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              <span>{currentCard.status === 'active' ? 'Freeze Card' : 'Unfreeze Card'}</span>
            </button>

            <button
              onClick={() => setShowCvv(!showCvv)}
              className="p-3 rounded-2xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center justify-center gap-2 transition-colors"
            >
              {showCvv ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{showCvv ? 'Hide Credentials' : 'Show Full Card'}</span>
            </button>
          </div>

          {/* Card Selector List */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Switch Cardholder Profile
            </div>
            {cards.map(c => (
              <div
                key={c.id}
                onClick={() => { setActiveCardId(c.id); setShowCvv(false); }}
                className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between text-xs transition-colors ${
                  activeCardId === c.id 
                    ? 'border-[#E5B842] bg-[#E5B842]/10 text-white' 
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#E5B842]" />
                  <span className="font-bold">{c.tier} {c.type.toUpperCase()}</span>
                  <span className="font-mono text-slate-400">({c.cardNumberMasked.slice(-4)})</span>
                </div>
                <span className="font-mono font-bold text-emerald-400">${c.balance.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Spending Limits & Schengen Shipping Policy */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card Settings & Limits */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#091124] border border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#E5B842]" />
                <span>Security & Spending Controls</span>
              </h3>
              <span className="text-xs text-emerald-400 font-bold">
                Cashback: {currentCard.cashbackRate}%
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex items-center justify-between text-slate-300 font-semibold mb-1">
                  <span>Daily Online & POS Spending Limit</span>
                  <span className="font-mono text-white">${currentCard.limits.dailySpending.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min={500}
                  max={50000}
                  step={500}
                  value={currentCard.limits.dailySpending}
                  onChange={(e) => updateCardLimit(currentCard.id, {
                    ...currentCard.limits,
                    dailySpending: Number(e.target.value)
                  })}
                  className="w-full accent-[#E5B842]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-slate-300 font-semibold mb-1">
                  <span>Monthly Total Transaction Limit</span>
                  <span className="font-mono text-white">${currentCard.limits.monthlySpending.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min={2000}
                  max={100000}
                  step={1000}
                  value={currentCard.limits.monthlySpending}
                  onChange={(e) => updateCardLimit(currentCard.id, {
                    ...currentCard.limits,
                    monthlySpending: Number(e.target.value)
                  })}
                  className="w-full accent-[#E5B842]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-slate-300 font-semibold mb-1">
                  <span>Daily ATM Withdrawal Limit</span>
                  <span className="font-mono text-white">${currentCard.limits.dailyAtm.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min={200}
                  max={10000}
                  step={100}
                  value={currentCard.limits.dailyAtm}
                  onChange={(e) => updateCardLimit(currentCard.id, {
                    ...currentCard.limits,
                    dailyAtm: Number(e.target.value)
                  })}
                  className="w-full accent-[#E5B842]"
                />
              </div>
            </div>
          </div>

          {/* Shipping & Schengen Policy Breakdown */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#091124] border border-slate-800 space-y-4 text-xs">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-cyan-400" />
              <span>Physical Card Global Shipping Coverage</span>
            </h3>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-slate-300 text-xs">
              <div className="font-semibold text-white">Specific Schengen Area Covered Countries:</div>
              <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-400">
                {SCHENGEN_COUNTRIES.map(country => (
                  <span key={country} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {country}
                  </span>
                ))}
              </div>
              <div className="pt-2 text-slate-400 text-[11px] leading-relaxed">
                Also shipping to: <strong>United Kingdom, United States, Canada, and United Arab Emirates (UAE)</strong>.
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-800 text-cyan-200 text-[11px]">
              <strong>Courier Delivery Timeline:</strong> Standard dispatch via insured tracked courier taking a <strong>minimum of 1 week to a maximum of 1 month</strong> across all designated regions.
            </div>
          </div>
        </div>
      </div>

      {/* Order New Card Modal */}
      {orderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="w-full max-w-lg bg-[#091124] border border-[#E5B842]/40 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Order Nile Crypto Card</h3>
              <button onClick={() => setOrderModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleOrderCard} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Network</label>
                  <select
                    value={newCardType}
                    onChange={(e) => setNewCardType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-[#E5B842]"
                  >
                    <option value="visa">Visa International</option>
                    <option value="mastercard">Mastercard Worldwide</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Card Tier</label>
                  <select
                    value={newCardTier}
                    onChange={(e) => setNewCardTier(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-[#E5B842]"
                  >
                    <option value="Standard">Standard (2.0% Cashback)</option>
                    <option value="Gold">Gold Elite (3.5% Cashback)</option>
                    <option value="Black Elite">Black Metal Elite (5.0% Cashback)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Currency</label>
                  <select
                    value={newCardCurrency}
                    onChange={(e) => setNewCardCurrency(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-[#E5B842]"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Initial Balance ($100 – $100k)</label>
                  <input
                    type="number"
                    min={100}
                    max={100000}
                    value={newCardBalance}
                    onChange={(e) => setNewCardBalance(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono font-bold focus:outline-none focus:border-[#E5B842]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Format</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPhysical(false)}
                    className={`p-2.5 rounded-xl border font-bold transition-colors ${
                      !isPhysical ? 'border-[#E5B842] bg-[#E5B842]/10 text-white' : 'border-slate-800 bg-slate-900 text-slate-400'
                    }`}
                  >
                    Virtual Instant Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPhysical(true)}
                    className={`p-2.5 rounded-xl border font-bold transition-colors ${
                      isPhysical ? 'border-[#E5B842] bg-[#E5B842]/10 text-white' : 'border-slate-800 bg-slate-900 text-slate-400'
                    }`}
                  >
                    Physical Metal Card
                  </button>
                </div>
              </div>

              {isPhysical && (
                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <div className="font-semibold text-white">Courier Shipping Destination</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-400 text-[11px] mb-1">Country</label>
                      <select
                        value={shippingCountry}
                        onChange={(e) => setShippingCountry(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none"
                      >
                        {ALL_SHIPPING_REGIONS.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 text-[11px] mb-1">City</label>
                      <input
                        type="text"
                        value={shippingCity}
                        onChange={(e) => setShippingCity(e.target.value)}
                        required
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Street Address & Postal Code</label>
                    <input
                      type="text"
                      value={shippingStreet}
                      onChange={(e) => setShippingStreet(e.target.value)}
                      required
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] font-extrabold text-xs shadow-lg hover:brightness-110 transition-all"
              >
                Issue Card & Allocate Balance
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
