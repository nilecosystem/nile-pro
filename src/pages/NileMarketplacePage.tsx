import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  ShoppingCart, 
  Trash2, 
  Check, 
  X, 
  Truck, 
  ShieldCheck, 
  CreditCard, 
  Key, 
  Globe, 
  ArrowRight,
  ExternalLink,
  Award
} from 'lucide-react';
import { SCHENGEN_COUNTRIES, ALL_SHIPPING_REGIONS } from '../data/initialData.ts';
import { MarketplaceProduct } from '../types/index.ts';

export const NileMarketplacePage: React.FC = () => {
  const { 
    marketplaceProducts, 
    cart, 
    orders, 
    addToCart, 
    removeFromCart, 
    updateCartQuantity, 
    checkoutCart,
    user 
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<MarketplaceProduct | null>(null);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState<boolean>(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState<boolean>(false);

  // Checkout form state
  const [fullName, setFullName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || '+44 7558 847468');
  const [shippingCountry, setShippingCountry] = useState('United Kingdom');
  const [shippingAddress, setShippingAddress] = useState('10 Downing Street, Westminster');
  const [postalCode, setPostalCode] = useState('SW1A 2AA');
  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'bank_transfer' | 'nile_wallet'>('nile_wallet');

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'collectibles', label: 'Rare Bullion & Physical Bitcoins' },
    { id: 'cards', label: 'Crypto & Virtual Cards' },
    { id: 'software', label: 'Software Licenses' },
    { id: 'esim', label: 'eSIM Data' },
    { id: 'giftcards', label: 'Gift Cards' },
    { id: 'token_creation', label: 'Token Development' },
  ];

  const filteredProducts = marketplaceProducts.filter(p => {
    const matchesCat = activeCategory === 'all' || p.category === activeCategory;
    const matchesQuery = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const cartTotal = cart.reduce((sum, item) => sum + item.product.priceUsd * item.quantity, 0);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    checkoutCart(paymentMethod, {
      fullName,
      email,
      phone,
      address: `${shippingAddress}, ${postalCode}`,
      country: shippingCountry
    });

    setCheckoutModalOpen(false);
    setCartDrawerOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Marketplace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[#091124] border border-slate-800 shadow-xl">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-[#E5B842]">
            Curated Digital & Physical Commerce
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white mt-1">
            Nile Marketplace
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Insured physical delivery of authentic Casascius Bitcoins, historic million-dollar banknotes with bullion, global eSIMs, and genuine software.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCartDrawerOpen(true)}
            className="relative px-5 py-2.5 rounded-xl bg-[#E5B842] hover:bg-[#F3BA2F] text-[#070D1B] font-extrabold text-xs flex items-center gap-2 transition-colors shadow"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Cart ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
            {cart.length > 0 && (
              <span className="font-mono ml-1 font-black">· ${cartTotal.toLocaleString()}</span>
            )}
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none text-xs">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-colors ${
                activeCategory === cat.id 
                  ? 'bg-[#E5B842] text-[#070D1B]' 
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products, Casascius, eSIM..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-[#E5B842]"
          />
        </div>
      </div>

      {/* Product Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <div 
            key={product.id}
            className="p-6 rounded-3xl bg-[#091124] border border-slate-800 hover:border-[#E5B842]/50 hover:bg-[#0C1630] transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              {/* Product Photo with Finance Background */}
              {product.image && (
                <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-slate-800 group-hover:border-[#E5B842]/40 transition-colors bg-[#030611] shrink-0">
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/assets/backgrounds/luxury-finance-bg.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#091124] via-transparent to-transparent opacity-60" />
                  <div className="absolute top-2.5 right-2.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-black/75 backdrop-blur-md border border-[#E5B842]/40 text-[#E5B842]">
                      Certified Authentic
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-[#E5B842]">
                  {product.category.replace('_', ' ')}
                </span>
                {product.isPhysical ? (
                  <span className="text-[10px] text-cyan-400 font-semibold flex items-center gap-1">
                    <Truck className="w-3 h-3" />
                    Physical Insured Courier
                  </span>
                ) : (
                  <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                    <Key className="w-3 h-3" />
                    Instant Digital Delivery
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-[#E5B842] transition-colors line-clamp-2">
                {product.title}
              </h3>

              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {product.description}
              </p>

              {/* Bullet Features */}
              <ul className="space-y-1 text-[11px] text-slate-300 pt-1">
                {product.features.slice(0, 3).map((f, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-[#E5B842] shrink-0" />
                    <span className="truncate">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 block">Price</span>
                <span className="text-xl font-black text-white font-mono">
                  ${product.priceUsd.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedProduct(product)}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
                >
                  Details
                </button>
                <button
                  onClick={() => addToCart(product)}
                  className="px-4 py-2 rounded-xl bg-[#E5B842] hover:bg-[#F3BA2F] text-[#070D1B] text-xs font-bold transition-colors shadow"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Drawer */}
      {cartDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md h-full bg-[#091124] border-l border-slate-800 p-6 flex flex-col justify-between shadow-2xl">
            <div className="space-y-4 flex-1 overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-[#E5B842]" />
                  <h3 className="text-base font-bold text-white">Your Shopping Cart</h3>
                </div>
                <button onClick={() => setCartDrawerOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  Your shopping cart is currently empty.
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item.product.id} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 text-xs">
                      <div className="space-y-0.5 flex-1">
                        <div className="font-bold text-white line-clamp-1">{item.product.title}</div>
                        <div className="font-mono text-[#E5B842]">${item.product.priceUsd.toLocaleString()} each</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-slate-700 rounded-lg overflow-hidden bg-slate-800">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="px-2 py-0.5 text-slate-300 hover:bg-slate-700"
                          >
                            -
                          </button>
                          <span className="px-2 font-mono font-bold text-white text-xs">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="px-2 py-0.5 text-slate-300 hover:bg-slate-700"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="pt-4 border-t border-slate-800 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Total Order Amount:</span>
                  <span className="text-xl font-black text-[#E5B842] font-mono">
                    ${cartTotal.toLocaleString()} USD
                  </span>
                </div>

                <button
                  onClick={() => { setCartDrawerOpen(false); setCheckoutModalOpen(true); }}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] font-extrabold text-xs shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
                >
                  <span>Proceed to Insured Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal (Includes all Schengen countries selector & delivery info) */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="w-full max-w-xl bg-[#091124] border border-[#E5B842]/40 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white">Insured Checkout & Dispatch</h3>
                <p className="text-xs text-slate-400">Shipping to USA, Canada, UK, UAE & All 29 Schengen Countries</p>
              </div>
              <button onClick={() => setCheckoutModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCheckout} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-[#E5B842]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-[#E5B842]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Contact Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-[#E5B842]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Shipping Destination Country</label>
                  <select
                    value={shippingCountry}
                    onChange={(e) => setShippingCountry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-[#E5B842]"
                  >
                    {ALL_SHIPPING_REGIONS.map(country => (
                      <option key={country} value={country}>
                        {country} {SCHENGEN_COUNTRIES.includes(country) ? '(Schengen)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Street Address</label>
                <input
                  type="text"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  required
                  placeholder="Street name, suite or vault box"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-[#E5B842]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('nile_wallet')}
                    className={`p-2.5 rounded-xl border font-bold text-center transition-colors ${
                      paymentMethod === 'nile_wallet' ? 'border-[#E5B842] bg-[#E5B842]/10 text-white' : 'border-slate-800 bg-slate-900 text-slate-400'
                    }`}
                  >
                    Nile Balance
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('crypto')}
                    className={`p-2.5 rounded-xl border font-bold text-center transition-colors ${
                      paymentMethod === 'crypto' ? 'border-[#E5B842] bg-[#E5B842]/10 text-white' : 'border-slate-800 bg-slate-900 text-slate-400'
                    }`}
                  >
                    Crypto Transfer
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`p-2.5 rounded-xl border font-bold text-center transition-colors ${
                      paymentMethod === 'bank_transfer' ? 'border-[#E5B842] bg-[#E5B842]/10 text-white' : 'border-slate-800 bg-slate-900 text-slate-400'
                    }`}
                  >
                    Bank Wire
                  </button>
                </div>
              </div>

              {/* Delivery Speed Notice */}
              <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-800/60 text-cyan-200 text-[11px] leading-relaxed">
                <strong>Delivery Notice:</strong> Physical products (including Casascius Bitcoins, bullion, and cards) are shipped via insured high-security courier. Estimated delivery: <strong>1 week to 1 month maximum</strong> across USA, Canada, UK, UAE, and Schengen countries.
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Total Payable:</span>
                <span className="text-xl font-black text-[#E5B842] font-mono">
                  ${cartTotal.toLocaleString()} USD
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] font-extrabold text-xs shadow-lg hover:brightness-110 transition-all"
              >
                Confirm Order & Authorize Payment
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-[#091124] border border-[#E5B842]/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-[#E5B842]">
                {selectedProduct.category.replace('_', ' ')}
              </span>
              <button onClick={() => setSelectedProduct(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Product Photo Showcase */}
            {selectedProduct.image && (
              <div className="relative w-full h-52 rounded-2xl overflow-hidden border border-[#E5B842]/40 bg-[#030611] shadow-xl">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.title} 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/assets/backgrounds/luxury-finance-bg.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#091124] via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-3 left-4">
                  <span className="px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-[#E5B842]/50 text-[#E5B842] text-[11px] font-mono font-bold">
                    Official NCB Registry
                  </span>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-bold text-white">{selectedProduct.title}</h3>
              <div className="text-2xl font-black text-[#E5B842] font-mono mt-1">
                ${selectedProduct.priceUsd.toLocaleString()} USD
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedProduct.description}
            </p>

            <div className="space-y-2 text-xs">
              <div className="font-semibold text-white">Full Feature Specifications:</div>
              <ul className="space-y-1 text-slate-300">
                {selectedProduct.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                className="w-full py-3 rounded-xl bg-[#E5B842] text-[#070D1B] font-extrabold text-xs hover:bg-[#F3BA2F] transition-colors shadow"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
