import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { NileTokenCoin } from './NileTokenCoin.tsx';
import { 
  ShoppingBag, 
  Coins, 
  CreditCard, 
  Award, 
  FileText, 
  ExternalLink, 
  Check, 
  ShieldCheck, 
  Truck, 
  Globe, 
  Lock,
  ArrowRight,
  Sparkles,
  Zap
} from 'lucide-react';
import { TREASURY_CRYPTO_WALLETS, TREASURY_BANK_CARDS } from '../data/paymentConfig.ts';

interface CryptoReservePackage {
  id: string;
  symbol: string;
  network: string;
  name: string;
  allocation: string;
  marketPriceUsd: number;
  contract?: string;
}

const CRYPTO_RESERVE_PACKAGES: CryptoReservePackage[] = [
  // BTC
  { id: 'btc-0.5', symbol: 'BTC', network: 'Native SegWit', name: '0.5 Bitcoin Treasury Lot', allocation: '0.5 BTC', marketPriceUsd: 44724 },
  { id: 'btc-1.0', symbol: 'BTC', network: 'Native SegWit', name: '1.0 Bitcoin Institutional Lot', allocation: '1.0 BTC', marketPriceUsd: 89450 },
  { id: 'btc-5.0', symbol: 'BTC', network: 'Native SegWit', name: '5.0 Bitcoin Sovereign Lot', allocation: '5.0 BTC', marketPriceUsd: 447250 },
  { id: 'btc-10.0', symbol: 'BTC', network: 'Native SegWit', name: '10.0 Bitcoin Whale Lot', allocation: '10.0 BTC', marketPriceUsd: 894500 },
  { id: 'btc-20.0', symbol: 'BTC', network: 'Native SegWit', name: '20.0 Bitcoin Apex Lot', allocation: '20.0 BTC', marketPriceUsd: 1789000 },
  { id: 'btc-25.0', symbol: 'BTC', network: 'Native SegWit', name: '25.0 Bitcoin Sovereign Reserve', allocation: '25.0 BTC', marketPriceUsd: 2236250 },

  // USDT
  { id: 'usdt-1k', symbol: 'USDT', network: 'TRC20 / BEP20', name: '1,000 USDT Liquid Reserve', allocation: '1,000 USDT', marketPriceUsd: 1000 },
  { id: 'usdt-5k', symbol: 'USDT', network: 'TRC20 / BEP20', name: '5,000 USDT Vault Block', allocation: '5,000 USDT', marketPriceUsd: 5000 },
  { id: 'usdt-10k', symbol: 'USDT', network: 'TRC20 / BEP20', name: '10,000 USDT Strategic Reserve', allocation: '10,000 USDT', marketPriceUsd: 10000 },
  { id: 'usdt-20k', symbol: 'USDT', network: 'TRC20 / BEP20', name: '20,000 USDT Enterprise Block', allocation: '20,000 USDT', marketPriceUsd: 20000 },
  { id: 'usdt-50k', symbol: 'USDT', network: 'TRC20 / BEP20', name: '50,000 USDT Capital Vault', allocation: '50,000 USDT', marketPriceUsd: 50000 },
  { id: 'usdt-100k', symbol: 'USDT', network: 'TRC20 / BEP20', name: '100,000 USDT Sovereign Reserve', allocation: '100,000 USDT', marketPriceUsd: 100000 },

  // TRX
  { id: 'trx-10k', symbol: 'TRX', network: 'TRC20 / BEP20', name: '10,000 TRX Bandwidth Node', allocation: '10,000 TRX', marketPriceUsd: 1650 },
  { id: 'trx-50k', symbol: 'TRX', network: 'TRC20 / BEP20', name: '50,000 TRX Validator Node', allocation: '50,000 TRX', marketPriceUsd: 8250 },
  { id: 'trx-1m', symbol: 'TRX', network: 'TRC20 / BEP20', name: '1,000,000 TRX Super Representative Block', allocation: '1,000,000 TRX', marketPriceUsd: 165000 },

  // ETH
  { id: 'eth-10', symbol: 'ETH', network: 'ARB / ETH / Base', name: '10.0 Ethereum Validator Tranche', allocation: '10.0 ETH', marketPriceUsd: 35800 },
  { id: 'eth-50', symbol: 'ETH', network: 'ARB / ETH / Base', name: '50.0 Ethereum Staking Block', allocation: '50.0 ETH', marketPriceUsd: 179000 },
  { id: 'eth-100', symbol: 'ETH', network: 'ARB / ETH / Base', name: '100.0 Ethereum Sovereign Cluster', allocation: '100.0 ETH', marketPriceUsd: 358000 },

  // Special Contracts & Solana / Fantom
  { id: 'wusdt-1m', symbol: 'wUSDT', network: 'Solana SPL', name: '1M wUSDT Solana Whale Lot', allocation: '1,000,000 wUSDT', marketPriceUsd: 50000, contract: 'BQcdHdAQW1hczDbBi9hiegXAR7A98Q9jx3X3iBBBDiq4' },
  { id: 'wusdt-100k', symbol: 'wUSDT', network: 'Solana SPL', name: '100K wUSDT Solana Tranche', allocation: '100,000 wUSDT', marketPriceUsd: 25000, contract: 'BQcdHdAQW1hczDbBi9hiegXAR7A98Q9jx3X3iBBBDiq4' },

  { id: 'ftm-btc-100k', symbol: 'BTC', network: 'Fantom Opera', name: '100K Fantom BTC Reserve', allocation: '100,000 Units', marketPriceUsd: 150000, contract: '0x321162cd933e2be498cd2267a90534a804051b11' },
  { id: 'ftm-fusdt-1m', symbol: 'fUSDT', network: 'Fantom / BEP20', name: '1M fUSDT Liquidity Block', allocation: '1,000,000 Units', marketPriceUsd: 15000, contract: '0x049d68029688eabf473097a2fc38ef61633a3c7a' },
  { id: 'ftm-dai-1m', symbol: 'DAI', network: 'Fantom Opera', name: '1M DAI Stable Vault', allocation: '1,000,000 Units', marketPriceUsd: 15000, contract: '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e' },
  { id: 'ftm-usdc-1m', symbol: 'USDC', network: 'Fantom Opera', name: '1M USDC Institutional Tranche', allocation: '1,000,000 Units', marketPriceUsd: 30000, contract: '0x04068da6c83afcfa0e13ba15a6696662335d5b75' },

  { id: 'btcbr-20d', symbol: 'BTCBR', network: 'BEP20 (BNB)', name: 'BTCBR 20-Digit Reserve Vault', allocation: '20-Digit Supply', marketPriceUsd: 1000, contract: '0x0cf8e180350253271f4b917ccfb0accc4862f262' },
  { id: 'shib-10d', symbol: 'SHIB', network: 'BEP20 (BNB)', name: 'SHIB 10-Digit Mega Reserve', allocation: '10-Digit Supply', marketPriceUsd: 1000, contract: '0x2859e4544c4bb03966803b044a93563bd2d0dd4d' },
  { id: 'bnbtiger-20d', symbol: 'BNBTIGER', network: 'BEP20 (BNB)', name: 'BNBTIGER 20-Digit Alpha Block', allocation: '20-Digit Supply', marketPriceUsd: 100000, contract: '0xf8584516b7d2c156c763c874d6813e06b57e4cb5' },
  { id: 'jefe-25d', symbol: 'JEFE', network: 'Fantom Opera', name: 'JEFE 25-Digit Strategic Lot', allocation: '25-Digit Supply', marketPriceUsd: 100000, contract: '0x5b2af7fd27e2ea14945c82dd254c79d3ed34685e' },
  { id: 'ham-15d', symbol: 'HAM', network: 'BEP20 (BNB)', name: 'HAM 15-Digit Community Tranche', allocation: '15-Digit Supply', marketPriceUsd: 1000, contract: '0x679d5b2d94f454c950d683d159b87aa8eae37c9e' },
  { id: 'zaru-15d', symbol: 'ZARU', network: 'Solana SPL', name: 'ZARU 15-Digit Sovereign Lot', allocation: '15-Digit Supply', marketPriceUsd: 5000000, contract: '7rJVyzChxjXkQCbXRSP69YxMRcwTTCRZjYZtCXh7pump' }
];

interface CollectibleItem {
  id: string;
  title: string;
  priceUsd: number;
  stock: number;
  description: string;
  specs: string[];
}

const PHYSICAL_COLLECTIBLES: CollectibleItem[] = [
  {
    id: 'million-note-bullion',
    title: 'Genuine $1,000,000 USD Banknote with Certificate & 6 Gold Bullion Bars',
    priceUsd: 500000,
    stock: 2,
    description: 'Museum-grade collector banknote registered with US Treasury provenance, accompanied by 6 certified fine gold bullion bars in security cases.',
    specs: ['Authentic certified banknote', '6 fine bullion bars with serial registries', 'Full legal certificates of authenticity', 'Armored insured courier delivery']
  },
  {
    id: 'casascius-025',
    title: 'Casascius Physical Bitcoin (0.25 BTC Funded)',
    priceUsd: 20000,
    stock: 1,
    description: 'Genuine Casascius brass coin minted in 2013 with untampered holographic private key seal loaded with 0.25 BTC on-chain.',
    specs: ['Verifiable on Bitcoin blockchain', 'Intact original tamper-evident hologram', 'Acrylic protective archival slab', 'Insured delivery']
  },
  {
    id: 'casascius-050',
    title: 'Casascius Physical Bitcoin (0.50 BTC Funded)',
    priceUsd: 40000,
    stock: 1,
    description: 'Rare collectible physical Bitcoin holding 0.50 BTC. Flawless original hologram and provenance tracking.',
    specs: ['0.50 BTC on-chain funded balance', 'Original tamper-evident security foil', 'Vault storage archival case', 'Insured armored shipping']
  },
  {
    id: 'casascius-100',
    title: 'Casascius Physical Bitcoin (1.00 BTC Funded)',
    priceUsd: 80000,
    stock: 5,
    description: 'Flagship series 1 BTC Casascius collector coin. Sealed with private mini-key underneath the security hologram.',
    specs: ['1.00 BTC funded balance', 'Series 2 brass minting', 'Blockchain verified', 'Archival museum grade display']
  },
  {
    id: 'casascius-1000',
    title: 'Casascius Physical Bitcoin (10.00 BTC Funded Sovereign Vault)',
    priceUsd: 800000,
    stock: 2,
    description: 'Ultra-rare sovereign grade 10 BTC Casascius coin with pure gold plating and holographic security seal.',
    specs: ['10.00 BTC funded balance', 'Pure gold-plated edition', 'Museum provenance certificate', 'Armed courier white-glove delivery']
  }
];

export const MarketplaceSection: React.FC = () => {
  const { showToast, addTransaction } = useApp();

  const [activeTab, setActiveTab] = useState<'crypto' | 'collectibles' | 'cards' | 'digital'>('crypto');
  const [selectedPaymentModal, setSelectedPaymentModal] = useState<{
    itemTitle: string;
    gateway: 'nile' | 'crypto' | 'card';
    priceUsd: number;
  } | null>(null);

  const handleInitiatePayment = (itemTitle: string, gateway: 'nile' | 'crypto' | 'card', basePriceUsd: number) => {
    const finalPrice = gateway === 'nile' ? basePriceUsd * 0.8 : basePriceUsd * 0.9;
    setSelectedPaymentModal({
      itemTitle,
      gateway,
      priceUsd: finalPrice
    });
  };

  const handleConfirmOrder = () => {
    if (!selectedPaymentModal) return;
    const { itemTitle, gateway, priceUsd } = selectedPaymentModal;
    addTransaction({
      type: 'marketplace_order',
      amount: priceUsd,
      currency: gateway === 'nile' ? 'NILE' : gateway === 'card' ? 'USD' : 'USDT',
      status: 'pending',
      recipientOrDetails: `Marketplace Order: ${itemTitle} (${gateway.toUpperCase()} Gateway)`
    });
    showToast(`Order initiated for ${itemTitle}! Check instructions in invoice.`, 'success');
    setSelectedPaymentModal(null);
  };

  return (
    <div id="marketplace" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#E5B842] font-mono">
              Institutional Trade Desk
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            NILE Reserve Marketplace
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Acquire audited crypto reserve packages, rare physical Casascius Bitcoins, museum banknotes, international cards, and enterprise digital licenses.
          </p>
        </div>

        {/* Worldwide Shipping Coverage Pill */}
        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3 text-xs shrink-0">
          <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <div className="font-bold text-white">Armored Worldwide Shipping</div>
            <div className="text-[11px] text-slate-400">All 29 Schengen Nations + USA, UK, Canada, UAE (7-30 Days)</div>
          </div>
        </div>
      </div>

      {/* 4-Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('crypto')}
          className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer shrink-0 ${
            activeTab === 'crypto'
              ? 'bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] border-[#E5B842] shadow-lg shadow-[#E5B842]/20 font-black'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>NCB Crypto Reserve Packages</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#070D1B]/20 font-mono">Default</span>
        </button>

        <button
          onClick={() => setActiveTab('collectibles')}
          className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer shrink-0 ${
            activeTab === 'collectibles'
              ? 'bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] border-[#E5B842] shadow-lg shadow-[#E5B842]/20 font-black'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Physical Collectibles & Gold Bullion</span>
        </button>

        <button
          onClick={() => setActiveTab('cards')}
          className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer shrink-0 ${
            activeTab === 'cards'
              ? 'bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] border-[#E5B842] shadow-lg shadow-[#E5B842]/20 font-black'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>International Crypto Cards</span>
        </button>

        <button
          onClick={() => setActiveTab('digital')}
          className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer shrink-0 ${
            activeTab === 'digital'
              ? 'bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] border-[#E5B842] shadow-lg shadow-[#E5B842]/20 font-black'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Digital Goods & Licenses (300+)</span>
        </button>
      </div>

      {/* Tab 1: NCB Crypto Reserve Packages (Primary Default First View) */}
      {activeTab === 'crypto' && (
        <div className="space-y-6">
          {/* Hero Photography Banner with Finance Background */}
          <div className="relative w-full h-48 sm:h-60 rounded-3xl overflow-hidden border border-[#E5B842]/40 shadow-2xl bg-[#030611] group">
            <img 
              src="/assets/products/crypto-reserve-vault.png" 
              alt="NCB Crypto Reserve Packages" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#091124] via-transparent to-transparent opacity-75" />
            <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs">
              <span className="px-3 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-[#E5B842]/50 text-[#E5B842] font-mono font-bold">
                Treasury Reserve Allocations · Up to 20% Discount with NILE
              </span>
              <span className="px-3 py-1 rounded-xl bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-emerald-400 font-mono font-bold">
                On-Chain Verifiable Custody
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CRYPTO_RESERVE_PACKAGES.map((pkg) => {
              const cryptoCardPrice = pkg.marketPriceUsd * 0.9;
              const nileTokenPrice = pkg.marketPriceUsd * 0.8;

              return (
                <div 
                  key={pkg.id} 
                  className="p-6 rounded-3xl bg-[#091124] border border-slate-800 shadow-xl space-y-4 hover:border-[#E5B842]/50 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                        {pkg.network}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">Spot Verified</span>
                    </div>

                    <div>
                      <h3 className="text-base font-black text-white">{pkg.name}</h3>
                      <div className="text-sm font-mono font-bold text-emerald-400 mt-0.5">
                        Allocation: {pkg.allocation}
                      </div>
                      {pkg.contract && (
                        <div className="text-[10px] text-slate-400 font-mono truncate mt-1">
                          Contract: {pkg.contract}
                        </div>
                      )}
                    </div>

                    {/* Pricing Box */}
                    <div className="p-3.5 rounded-2xl bg-[#060B17] border border-slate-800/80 space-y-1.5 font-mono text-xs">
                      <div className="flex items-center justify-between text-slate-400 text-[11px]">
                        <span>Standard Spot:</span>
                        <span className="line-through">${pkg.marketPriceUsd.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-white font-semibold">
                        <span>Crypto / Card (10% OFF):</span>
                        <span className="text-emerald-400">${cryptoCardPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-[#E5B842] font-black border-t border-slate-800 pt-1">
                        <span>NILE Settlement (20% OFF):</span>
                        <span>${nileTokenPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* 3 Dedicated Payment Gateway Buttons */}
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => handleInitiatePayment(pkg.name, 'nile', pkg.marketPriceUsd)}
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] font-extrabold text-xs shadow-md hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <NileTokenCoin size="xs" />
                      <span>Pay with NILE Token (20% OFF)</span>
                    </button>

                    <button
                      onClick={() => handleInitiatePayment(pkg.name, 'crypto', pkg.marketPriceUsd)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500 text-white font-bold text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Coins className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Pay with Crypto (10% OFF - BTC / USDT TRC20)</span>
                    </button>

                    <button
                      onClick={() => handleInitiatePayment(pkg.name, 'card', pkg.marketPriceUsd)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500 text-white font-bold text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Pay with Card (10% OFF - USD / EUR / GBP)</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Physical Collectibles & Gold Bullion */}
      {activeTab === 'collectibles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PHYSICAL_COLLECTIBLES.map((col) => (
            <div key={col.id} className="p-7 rounded-3xl bg-[#091124] border border-slate-800 shadow-xl space-y-5 flex flex-col justify-between group hover:border-[#E5B842]/50 transition-all">
              <div className="space-y-4">
                {/* 3D Finance Photography Showcase */}
                <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden border border-[#E5B842]/40 bg-[#030611] shadow-xl">
                  <img 
                    src={
                      col.id === 'million-dollar-note' 
                        ? '/assets/products/million-dollar-banknote-gold.png'
                        : '/assets/products/casascius-bitcoin-collectible.png'
                    } 
                    alt={col.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#091124] via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs">
                    <span className="px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-[#E5B842]/50 text-[#E5B842] font-mono font-bold">
                      {col.id === 'million-dollar-note' ? 'US Treasury Provenance' : 'On-Chain Funded Balance'}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-emerald-400 font-mono font-bold">
                      Tamper-Sealed
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                    In Stock: {col.stock} Units
                  </span>
                  <span className="text-xs text-emerald-400 font-mono font-bold">Armored Courier Worldwide</span>
                </div>

                <h3 className="text-lg sm:text-xl font-black text-white">{col.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{col.description}</p>

                <div className="space-y-1.5 text-xs text-slate-300">
                  {col.specs.map((s, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>

                {/* Price Display */}
                <div className="p-4 rounded-2xl bg-[#060B17] border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Certified Value</span>
                    <div className="text-2xl font-black text-[#E5B842] font-mono">
                      ${col.priceUsd.toLocaleString()} USD
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <span className="text-emerald-400 font-mono font-bold">20% Off NILE:</span>
                    <div className="text-white font-mono font-bold">${(col.priceUsd * 0.8).toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => handleInitiatePayment(col.title, 'nile', col.priceUsd)}
                  className="py-2.5 rounded-xl bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] font-extrabold text-xs shadow-md hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <NileTokenCoin size="xs" />
                  <span>Settle with NILE (20% OFF)</span>
                </button>
                <button
                  onClick={() => handleInitiatePayment(col.title, 'crypto', col.priceUsd)}
                  className="py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500 text-white font-bold text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Coins className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Settle with Crypto / Wire</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: International Crypto Cards ($100 to $100,000) */}
      {activeTab === 'cards' && (
        <div className="space-y-6">
          {/* 3D Crypto Cards Trio Photography Banner with Finance Background */}
          <div className="relative w-full h-48 sm:h-60 rounded-3xl overflow-hidden border border-[#E5B842]/40 shadow-2xl bg-[#030611] group">
            <img 
              src="/assets/products/nile-cards-trio.png" 
              alt="International Crypto Cards" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#091124] via-transparent to-transparent opacity-75" />
            <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs">
              <span className="px-3 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-[#E5B842]/50 text-[#E5B842] font-mono font-bold">
                Visa &amp; Mastercard · Global Apple Pay &amp; Google Wallet
              </span>
              <span className="px-3 py-1 rounded-xl bg-cyan-500/20 backdrop-blur-md border border-cyan-500/40 text-cyan-300 font-mono font-bold">
                Preloaded Balances $100 to $100,000
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Standard Silver Card', limit: '$100 - $5,000', cashback: '1.0% - 2.0%', fee: '$0 Issuance', bg: 'from-slate-800 to-slate-900' },
            { title: 'Gold Metal Elite', limit: '$5,000 - $25,000', cashback: '3.0%', fee: 'Free with 10k NILE', bg: 'from-amber-900/60 to-slate-950' },
            { title: 'Black Sovereign VIP', limit: '$25,000 - $100,000', cashback: '5.0%', fee: 'Private Wealth Desk', bg: 'from-slate-950 to-black' }
          ].map((c, i) => (
            <div key={i} className="p-6 rounded-3xl bg-[#091124] border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="relative aspect-[1.586] rounded-2xl bg-gradient-to-tr p-4 border border-slate-700 shadow-xl flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <NileTokenCoin size="xs" />
                    <span className="text-[10px] font-mono text-[#E5B842] uppercase font-bold">{c.title}</span>
                  </div>
                  <div className="font-mono text-sm tracking-widest text-slate-300">•••• •••• •••• 5546</div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Matin Parsa</span>
                    <span>11/28</span>
                  </div>
                </div>

                <h3 className="text-base font-black text-white">{c.title}</h3>
                <div className="space-y-1 text-xs font-mono text-slate-300">
                  <div>Limit: <strong className="text-white">{c.limit}</strong></div>
                  <div>Instant Cashback: <strong className="text-emerald-400">{c.cashback}</strong></div>
                  <div>Apple Pay & Google Pay Supported</div>
                </div>
              </div>

              <button
                onClick={() => showToast(`Opening application for ${c.title}... Complete KYC Tier 2 first.`, 'info')}
                className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-[#E5B842] text-white font-bold text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5 text-[#E5B842]" />
                <span>Apply for Card</span>
              </button>
            </div>
          ))}
          </div>
        </div>
      )}

      {/* Tab 4: Digital Goods & Licenses (300+ items) */}
      {activeTab === 'digital' && (
        <div className="space-y-6">
          {/* Digital Goods & 5G Global Connectivity Photography Banner */}
          <div className="relative w-full h-48 sm:h-60 rounded-3xl overflow-hidden border border-cyan-500/40 shadow-2xl bg-[#030611] group">
            <img 
              src="/assets/products/digital-goods-esim.png" 
              alt="Digital Goods & 5G eSIMs" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#091124] via-transparent to-transparent opacity-75" />
            <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs">
              <span className="px-3 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-cyan-500/50 text-cyan-300 font-mono font-bold">
                Global 5G Connectivity in 180+ Countries · Instant QR Delivery
              </span>
              <span className="px-3 py-1 rounded-xl bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-emerald-400 font-mono font-bold">
                300+ Verified Digital Licenses
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Global 130+ Country eSIM (10GB / 30 Days)', price: 45, category: 'Connectivity' },
            { title: 'Europe Schengen High-Speed 5G eSIM (20GB)', price: 32, category: 'Connectivity' },
            { title: 'Audited Smart Contract Deployment Suite (BEP20)', price: 450, category: 'Developer Tools' },
            { title: 'Enterprise ERC20 Security Standard Package', price: 850, category: 'Developer Tools' },
            { title: 'Amazon Universal Digital Gift Card $100', price: 98, category: 'Digital Voucher' },
            { title: 'Apple Universal Store Gift Card $100', price: 99, category: 'Digital Voucher' }
          ].map((item, i) => (
            <div key={i} className="p-5 rounded-2xl bg-[#091124] border border-slate-800 shadow-md space-y-3">
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                {item.category}
              </span>
              <h4 className="font-bold text-white text-sm">{item.title}</h4>
              <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-slate-800">
                <span className="text-slate-400">Price:</span>
                <span className="text-emerald-400 font-bold">${item.price} USD</span>
              </div>
              <button
                onClick={() => handleInitiatePayment(item.title, 'crypto', item.price)}
                className="w-full py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-[#E5B842] text-white font-bold text-xs hover:bg-slate-800 transition-all text-center cursor-pointer"
              >
                Instant Purchase ➔
              </button>
            </div>
          ))}
          </div>
        </div>
      )}

      {/* Payment Instructions Modal */}
      {selectedPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg p-6 sm:p-7 rounded-3xl bg-[#091124] border-2 border-[#E5B842]/50 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-black text-white text-base">Confirm Institutional Settlement</h3>
              </div>
              <button
                onClick={() => setSelectedPaymentModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#060B17] border border-slate-800 space-y-1">
                <div className="text-slate-400">Order Target:</div>
                <div className="text-sm font-bold text-white">{selectedPaymentModal.itemTitle}</div>
                <div className="text-emerald-400 font-mono font-bold text-base mt-1">
                  Settlement Total: ${selectedPaymentModal.priceUsd.toLocaleString()} USD
                </div>
              </div>

              {selectedPaymentModal.gateway === 'nile' && (
                <div className="p-3 rounded-xl bg-[#E5B842]/10 border border-[#E5B842]/30 text-amber-200 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <NileTokenCoin size="xs" />
                    <span>20% Discount Activated via NILE Token</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Tokens will be debited from your in-app NILE ledger or transfer to the treasury address.
                  </p>
                </div>
              )}

              {selectedPaymentModal.gateway === 'crypto' && (
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <div className="font-bold text-white">Deposit to Official Treasury Wallet:</div>
                  <div className="space-y-1 font-mono text-[11px]">
                    <div className="text-slate-400">USDT (TRC20):</div>
                    <div className="p-1.5 rounded bg-slate-950 text-cyan-400 break-all select-all">
                      {TREASURY_CRYPTO_WALLETS.TRON}
                    </div>
                    <div className="text-slate-400 mt-2">BTC (Native SegWit):</div>
                    <div className="p-1.5 rounded bg-slate-950 text-amber-400 break-all select-all">
                      {TREASURY_CRYPTO_WALLETS.BTC_NATIVE}
                    </div>
                  </div>
                </div>
              )}

              {selectedPaymentModal.gateway === 'card' && (
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <div className="font-bold text-white">Official Bank Card Account (Cardholder: Matin Parsa):</div>
                  <div className="space-y-1 font-mono text-[11px]">
                    <div className="text-slate-400">VISA Platinum International:</div>
                    <div className="p-1.5 rounded bg-slate-950 text-[#E5B842] select-all font-bold">
                      {TREASURY_BANK_CARDS[0].cardNumber} ({TREASURY_BANK_CARDS[0].cardholderName})
                    </div>
                    <div className="text-slate-400 mt-1">Currencies: USD, EUR, GBP</div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setSelectedPaymentModal(null)}
                className="w-1/2 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmOrder}
                className="w-1/2 py-2.5 rounded-xl bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] font-extrabold text-xs shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                Confirm & Submit Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default MarketplaceSection;
