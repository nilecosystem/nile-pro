import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';

import { 
  Building2, 
  TrendingUp, 
  ShoppingBag, 
  ArrowLeftRight, 
  Coins, 
  Flame, 
  CreditCard, 
  ShieldCheck, 
  Users, 
  GraduationCap, 
  Lock, 
  Globe, 
  ShoppingCart, 
  Menu, 
  X, 
  PhoneCall,
  ChevronDown,
  Key,
  LogOut,
  LogIn,
  UserPlus,
  Clock
} from 'lucide-react';
import { Language } from '../types/index.ts';
import { PWAInstallButton } from './PWAInstallButton.tsx';

export const Header: React.FC = () => {
  const { 
    language, 
    setLanguage, 
    t, 
    activeTab, 
    setActiveTab, 
    user, 
    balances, 
    cart, 
    setSupportDrawerOpen,
    setCertificateModalOpen,
    setSelectedCertificate,
    setClientPanelModalOpen,
    isClientPanelApproved,
    isLoggedIn,
    setAuthModalOpen,
    logout
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { id: 'home', label: t.navHome, icon: Building2 },
    { id: 'bank', label: t.navBank, icon: Building2 },
    { id: 'investment', label: t.navInvestment, icon: TrendingUp },
    { id: 'marketplace', label: t.navMarketplace, icon: ShoppingBag },
    { id: 'dex', label: t.navDex, icon: ArrowLeftRight },
    { id: 'token', label: t.navToken, icon: Coins },
    { id: 'presale', label: t.navPresale, icon: Flame, highlight: true },
    { id: 'cards', label: t.navCards, icon: CreditCard },
    { id: 'kyc', label: t.navKyc, icon: ShieldCheck },
    { id: 'referrals', label: t.navReferrals, icon: Users },
    { id: 'education', label: t.navEducation, icon: GraduationCap },
    { id: 'admin', label: t.navAdmin, icon: Lock, adminOnly: true }
  ];

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'ar', label: 'العربية', flag: '🇦🇪' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'zh', label: '中文 (简体)', flag: '🇨🇳' },
    { code: 'fa', label: 'فارسی', flag: '🇮🇷' }
  ];

  const handleNav = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#070D1B]/95 backdrop-blur-md border-b border-slate-800/80 shadow-lg">
      {/* Top Corporate Status Ticker */}
      <div className="w-full bg-[#050914] px-4 py-1.5 border-b border-slate-900 text-[11px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap scrollbar-none py-0.5">
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            LIVE ECOSYSTEM
          </span>
          <span className="text-slate-600">·</span>
          <span>NILE INVESTMENT LTD (Reg #08253865)</span>
          <span className="text-slate-600">·</span>
          <button 
            onClick={() => { setSelectedCertificate('incorporation'); setCertificateModalOpen(true); }}
            className="text-[#E5B842] hover:underline"
          >
            Certificate of Incorporation
          </button>
          <span className="text-slate-600">·</span>
          <button 
            onClick={() => { setSelectedCertificate('compliance'); setCertificateModalOpen(true); }}
            className="text-cyan-400 hover:underline"
          >
            Compliance & Transparency
          </button>
          <span className="text-slate-600">·</span>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('open-whitepaper-modal'))}
            className="text-amber-300 hover:underline"
          >
            Whitepaper & Roadmap
          </button>
          <span className="text-slate-600">·</span>
          <span className="text-slate-300">Crypto Cards: $100 – $100,000</span>
        </div>

        <div className="hidden md:flex items-center gap-4 text-slate-400">
          <button 
            onClick={() => setSupportDrawerOpen(true)}
            className="hover:text-white flex items-center gap-1 transition-colors"
          >
            <PhoneCall className="w-3 h-3 text-[#E5B842]" />
            <span>24/7 Desk: +44 7558 847468</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo & PWA Icon */}
        <div 
          onClick={() => handleNav('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative w-10 h-10 rounded-2xl overflow-hidden shadow-lg shadow-[#E5B842]/30 border border-[#E5B842]/60 bg-[#070D1B] p-0.5 shrink-0 group-hover:scale-105 transition-transform">
            <img 
              src="/assets/branding/nile-official-logo.png" 
              alt="Nile Ecosystem Official Logo" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain rounded-xl"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/logo.png'; }}
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-[#E5B842]/20 via-transparent to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-wider text-white group-hover:text-[#E5B842] transition-colors font-sans">
                NILE
              </span>
              <span className="text-xs font-bold text-[#E5B842] tracking-widest uppercase">
                ECOSYSTEM
              </span>
            </div>
            <span className="text-[10px] text-slate-400 tracking-tight hidden sm:block">
              The Unified Digital Finance Ecosystem
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.slice(0, 8).map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`relative px-3 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  isActive 
                    ? 'text-white bg-slate-800/80 shadow-sm' 
                    : item.highlight 
                      ? 'text-[#E5B842] hover:bg-[#E5B842]/10' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                {item.highlight && <span className="w-1.5 h-1.5 rounded-full bg-[#E5B842] animate-ping" />}
                {item.label}
              </button>
            );
          })}

          {/* More Dropdown for remaining sections */}
          <div className="relative group">
            <button className="px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-lg flex items-center gap-1 transition-colors">
              <span>More</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform" />
            </button>
            <div className="absolute right-0 top-full mt-1 w-48 py-2 bg-[#0B132B] border border-slate-800 rounded-xl shadow-xl hidden group-hover:block animate-fade-in">
              {navItems.slice(8).map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center gap-2 hover:bg-slate-800 transition-colors ${
                    activeTab === item.id ? 'text-[#E5B842] font-bold' : 'text-slate-300'
                  }`}
                >
                  <item.icon className="w-3.5 h-3.5 text-slate-400" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Right Action Icons: Web3, Ledger, Install, Cart, Language, Account & Support */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Web3 Non-Custodial Wallet Connect */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-web3-modal'))}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-xs font-bold text-cyan-400 hover:bg-slate-800 transition-all cursor-pointer shadow-sm"
            title="Connect Web3 Wallet (MetaMask, Trust Wallet, Rabby, Coinbase)"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>Web3</span>
          </button>

          {/* 4-Ledger Treasury Dashboard */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-dashboard-modal'))}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] font-extrabold text-xs shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            title="Open 4-Ledger Accounting Dashboard & Live Profit Accrual"
          >
            <span>Ledger</span>
          </button>

          {/* Client Delegated Management Panel */}
          <button
            onClick={() => setClientPanelModalOpen(true)}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-sm ${
              isClientPanelApproved
                ? 'bg-[#E5B842]/15 border-[#E5B842] text-[#E5B842] hover:bg-[#E5B842]/25'
                : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white'
            }`}
            title="Institutional Client Delegated Panel (Vaults, Cards, Affiliates, ROI Sims)"
          >
            <Key className="w-3.5 h-3.5 text-[#E5B842]" />
            <span>Client Panel</span>
            {isClientPanelApproved && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            )}
          </button>

          {/* In-App PWA Install Button */}
          <PWAInstallButton variant="header" />

          {/* Cart Icon */}
          <button
            onClick={() => handleNav('marketplace')}
            className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            title="Cart"
          >
            <ShoppingCart className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E5B842] text-[#070D1B] text-[10px] font-black flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 text-xs text-slate-300 hover:text-white hover:border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-[#E5B842]" />
              <span className="font-semibold uppercase">{language}</span>
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 py-2 bg-[#0B132B] border border-slate-800 rounded-xl shadow-2xl z-50 animate-fade-in">
                {languages.map(l => (
                  <button
                    key={l.code}
                    onClick={() => { setLanguage(l.code); setLangMenuOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-800 transition-colors ${
                      language === l.code ? 'text-[#E5B842] font-bold bg-[#E5B842]/10' : 'text-slate-300'
                    }`}
                  >
                    <span>{l.label}</span>
                    <span className="text-sm">{l.flag}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Account Capsule with Custom Profile Photo or Login Buttons */}
          {!isLoggedIn ? (
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={() => setAuthModalOpen(true, 'login')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-slate-900 border border-slate-700 hover:border-[#E5B842] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                title="Sign in with Google, Wallet, Phone, or Passkey"
              >
                <LogIn className="w-3.5 h-3.5 text-[#E5B842]" />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => setAuthModalOpen(true, 'signup')}
                className="px-3 py-1.5 rounded-xl text-xs font-extrabold text-[#070D1B] bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] shadow hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                title="Create Verified Institutional Nile Account"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register</span>
              </button>
            </div>
          ) : (
            <div className="relative hidden sm:block">
              <div 
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-[#E5B842]/60 cursor-pointer transition-all shadow-sm group select-none"
                title="Account Menu & Options"
              >
                <div className="relative w-8 h-8 rounded-xl overflow-hidden border border-[#E5B842]/60 shadow bg-[#070D1B] shrink-0">
                  {user.avatarUrl ? (
                    <img 
                      src={user.avatarUrl} 
                      alt={user.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/default-avatar.jpg';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-[#E5B842] text-[#070D1B] font-bold text-xs flex items-center justify-center">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-white leading-tight group-hover:text-[#E5B842] transition-colors flex items-center gap-1">
                    <span className="max-w-[90px] truncate">{user.name}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-[#E5B842]" />
                  </span>
                  <span className="text-[10px] text-emerald-400 font-medium leading-tight">
                    ${balances.USD.toLocaleString()} USD
                  </span>
                </div>
              </div>

              {/* Account Menu Dropdown */}
              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 py-2 bg-[#091124] border border-slate-800 rounded-2xl shadow-2xl z-50 animate-fade-in font-sans text-xs">
                  <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                    <div className="font-bold text-white truncate">{user.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between mt-0.5">
                      <span>{user.accountNumber}</span>
                      <span className="text-[#E5B842] font-bold">{user.rank}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => { handleNav('profile'); setUserDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800/70 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#E5B842]" />
                    <span>Profile & KYC Verification</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { 
                      window.dispatchEvent(new CustomEvent('open-dashboard-modal', { detail: { tab: 'history' } }));
                      setUserDropdownOpen(false); 
                    }}
                    className="w-full text-left px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800/70 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span>Transaction History</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { 
                      setClientPanelModalOpen(true);
                      setUserDropdownOpen(false); 
                    }}
                    className="w-full text-left px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800/70 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Key className="w-4 h-4 text-[#E5B842]" />
                    <span>Client Delegated Panel</span>
                  </button>

                  <div className="my-1 border-t border-slate-800/80" />

                  <button
                    type="button"
                    onClick={() => { 
                      setAuthModalOpen(true, 'login'); 
                      setUserDropdownOpen(false); 
                    }}
                    className="w-full text-left px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800/70 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogIn className="w-4 h-4 text-emerald-400" />
                    <span>Switch Account / Sign In</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { 
                      logout(); 
                      setUserDropdownOpen(false); 
                    }}
                    className="w-full text-left px-3 py-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#070D1B] border-b border-slate-800 px-4 pt-3 pb-6 space-y-2 shadow-2xl animate-fade-in">
          {/* Mobile User Profile or Auth Action */}
          {!isLoggedIn ? (
            <div className="grid grid-cols-2 gap-2 p-1 pb-2 border-b border-slate-800">
              <button
                onClick={() => { setAuthModalOpen(true, 'login'); setMobileMenuOpen(false); }}
                className="py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <LogIn className="w-4 h-4 text-[#E5B842]" />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => { setAuthModalOpen(true, 'signup'); setMobileMenuOpen(false); }}
                className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div 
                onClick={() => handleNav('profile')}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/90 border border-slate-800 cursor-pointer hover:border-[#E5B842]/40"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-[#E5B842]/60 shadow bg-[#070D1B] shrink-0">
                    {user.avatarUrl ? (
                      <img 
                        src={user.avatarUrl} 
                        alt={user.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/default-avatar.jpg';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-[#E5B842] text-[#070D1B] font-bold text-xs flex items-center justify-center">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{user.name}</div>
                    <div className="text-[11px] text-slate-400">{user.accountNumber} · <span className="text-[#E5B842]">{user.rank}</span></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-emerald-400">${balances.USD.toLocaleString()}</div>
                  <div className="text-[10px] text-emerald-500 font-semibold uppercase">Tier {user.kycTier} Verified</div>
                </div>
              </div>

              {/* Quick Transaction History & Sign Out Buttons for Mobile */}
              <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('open-dashboard-modal', { detail: { tab: 'history' } }));
                    setMobileMenuOpen(false);
                  }}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Tx History</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:text-rose-300 flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}

          {/* Quick Client Panel Access */}
          <button
            onClick={() => { setClientPanelModalOpen(true); setMobileMenuOpen(false); }}
            className={`w-full p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-colors ${
              isClientPanelApproved
                ? 'bg-[#E5B842]/15 border-[#E5B842] text-[#E5B842]'
                : 'bg-slate-900 border-slate-700 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-[#E5B842]" />
              <span>Institutional Client Delegated Panel</span>
            </div>
            {isClientPanelApproved ? (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Approved
              </span>
            ) : (
              <span className="text-[10px] font-mono text-slate-400">Request Access &rarr;</span>
            )}
          </button>

          <div className="grid grid-cols-2 gap-1.5 pt-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`p-2.5 rounded-xl text-left text-xs font-semibold flex items-center gap-2 transition-colors ${
                    isActive 
                      ? 'bg-[#E5B842] text-[#070D1B]' 
                      : item.highlight
                        ? 'bg-[#E5B842]/10 text-[#E5B842] border border-[#E5B842]/30'
                        : 'bg-slate-900/40 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <button 
              onClick={() => { setSelectedCertificate('incorporation'); setCertificateModalOpen(true); setMobileMenuOpen(false); }}
              className="text-[#E5B842] hover:underline"
            >
              UK Reg: #08253865
            </button>
            <button 
              onClick={() => { setSupportDrawerOpen(true); setMobileMenuOpen(false); }}
              className="text-cyan-400 hover:underline"
            >
              24/7 Support Desk
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
