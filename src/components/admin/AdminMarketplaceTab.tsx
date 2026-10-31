import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { 
  ShoppingBag, 
  Plus, 
  Trash2, 
  Edit3, 
  Truck, 
  Key, 
  Check, 
  X, 
  Search, 
  Package, 
  CreditCard, 
  Coins, 
  ShieldCheck, 
  ExternalLink,
  Save,
  Send,
  Sparkles
} from 'lucide-react';
import { MarketplaceProduct, MarketplaceOrder } from '../../types/index.ts';

export const AdminMarketplaceTab: React.FC = () => {
  const { 
    marketplaceProducts, 
    adminAddMarketplaceProduct, 
    adminUpdateMarketplaceProduct, 
    adminDeleteMarketplaceProduct,
    orders,
    adminUpdateOrderStatus,
    showToast 
  } = useApp();

  const [activeSubView, setActiveSubView] = useState<'catalog' | 'orders'>('catalog');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Add Product Modal State
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MarketplaceProduct['category']>('collectibles');
  const [priceUsd, setPriceUsd] = useState<number>(1000);
  const [stockCount, setStockCount] = useState<number>(5);
  const [isPhysical, setIsPhysical] = useState<boolean>(true);
  const [image, setImage] = useState<string>('/assets/products/million-dollar-banknote-gold.png');
  const [description, setDescription] = useState('');
  const [featuresText, setFeaturesText] = useState('Certified Serial Number, Insured Courier Delivery, Blockchain Provenance');

  // Edit Product State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);

  // Order Fulfillment State
  const [selectedOrder, setSelectedOrder] = useState<MarketplaceOrder | null>(null);
  const [newStatus, setNewStatus] = useState<MarketplaceOrder['status']>('shipped');
  const [trackingInput, setTrackingInput] = useState<string>('');
  const [licenseKeyInput, setLicenseKeyInput] = useState<string>('');

  const filteredProducts = marketplaceProducts.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    adminAddMarketplaceProduct({
      title,
      category,
      priceUsd,
      stockCount,
      inStock: stockCount > 0,
      isPhysical,
      image,
      description: description || `${title} available through Nile Ecosystem institutional marketplace with certified provenance.`,
      features: featuresText.split(',').map(f => f.trim()).filter(Boolean),
      deliveryEstimate: isPhysical ? '1-3 weeks worldwide' : 'Instant digital delivery'
    });

    setShowAddModal(false);
    setTitle('');
    setDescription('');
  };

  const handleStartEdit = (product: MarketplaceProduct) => {
    setEditingId(product.id);
    setEditPrice(product.priceUsd);
    setEditStock(product.stockCount || 0);
  };

  const handleSaveEdit = (id: string) => {
    adminUpdateMarketplaceProduct(id, {
      priceUsd: editPrice,
      stockCount: editStock,
      inStock: editStock > 0
    });
    setEditingId(null);
  };

  const handleOpenFulfillment = (order: MarketplaceOrder) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setTrackingInput(order.trackingCode || `DHL-UK-${Math.floor(100000000 + Math.random() * 900000000)}GB`);
    setLicenseKeyInput(order.licenseKeys?.[0] || `NILE-GENUINE-KEY-${Math.random().toString(36).substring(2, 10).toUpperCase()}`);
  };

  const handleSaveFulfillment = () => {
    if (!selectedOrder) return;
    adminUpdateOrderStatus(
      selectedOrder.id,
      newStatus,
      trackingInput,
      licenseKeyInput ? [licenseKeyInput] : undefined
    );
    setSelectedOrder(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#091124] border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-[#E5B842] flex items-center gap-1.5">
            <ShoppingBag className="w-4 h-4" />
            <span>Commerce &amp; Dispatch Desk</span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">
            Marketplace Products &amp; Order Fulfillment
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            Control the catalog of Casascius coins, million-dollar banknotes, international crypto cards, and software licenses. Dispatch orders with courier tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveSubView('catalog')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === 'catalog'
                ? 'bg-[#E5B842] text-[#070D1B] shadow-md'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Product Catalog ({marketplaceProducts.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubView('orders')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === 'orders'
                ? 'bg-[#E5B842] text-[#070D1B] shadow-md'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Customer Orders ({orders.length})</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: PRODUCT CATALOG */}
      {activeSubView === 'catalog' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#091124] border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by title or category..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-[#E5B842]"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] text-xs font-bold shadow-md hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Marketplace SKU</span>
            </button>
          </div>

          {/* Table of SKUs */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] font-mono text-slate-400 uppercase bg-slate-900/60 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Photo</th>
                  <th className="py-3 px-4">Title &amp; Category</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Price (USD)</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="w-14 h-11 rounded-lg overflow-hidden border border-slate-700 bg-black/60 shrink-0">
                        {prod.image ? (
                          <img src={prod.image} alt={prod.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-500">
                            <Package className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-bold text-white truncate">{prod.title}</div>
                      <div className="text-[10px] font-mono text-[#E5B842] uppercase">{prod.category}</div>
                    </td>

                    <td className="py-3 px-4">
                      {prod.isPhysical ? (
                        <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-mono text-[10px]">
                          Physical Courier
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-[10px]">
                          Digital Instant
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      {editingId === prod.id ? (
                        <input
                          type="number"
                          value={editPrice}
                          onChange={(e) => setEditPrice(parseFloat(e.target.value) || 0)}
                          className="w-24 px-2 py-1 rounded bg-slate-800 border border-slate-700 text-white font-mono font-bold"
                        />
                      ) : (
                        <span className="font-mono font-bold text-white">${prod.priceUsd.toLocaleString()}</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      {editingId === prod.id ? (
                        <input
                          type="number"
                          value={editStock}
                          onChange={(e) => setEditStock(parseInt(e.target.value) || 0)}
                          className="w-20 px-2 py-1 rounded bg-slate-800 border border-slate-700 text-white font-mono font-bold"
                        />
                      ) : (
                        <span className={`font-mono text-xs ${prod.inStock ? 'text-emerald-400 font-bold' : 'text-red-400'}`}>
                          {prod.stockCount !== undefined ? `${prod.stockCount} in stock` : (prod.inStock ? 'In Stock' : 'Out of Stock')}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {editingId === prod.id ? (
                          <button
                            onClick={() => handleSaveEdit(prod.id)}
                            className="p-1.5 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                            title="Save changes"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStartEdit(prod)}
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                            title="Quick edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => adminDeleteMarketplaceProduct(prod.id)}
                          className="p-1.5 rounded-lg bg-slate-800 text-red-400 hover:bg-red-500/20 transition-colors"
                          title="Delete SKU"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: CUSTOMER ORDERS */}
      {activeSubView === 'orders' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#091124] border border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#E5B842]" />
                <span>Customer Orders &amp; Global Dispatch Console</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage status, issue high-security courier tracking codes, and deliver license keys.
              </p>
            </div>
            <span className="text-xs font-mono text-[#E5B842] font-bold">
              {orders.length} Total Orders Registered
            </span>
          </div>

          <div className="space-y-4">
            {orders.map((ord) => (
              <div 
                key={ord.id}
                className="p-5 rounded-2xl bg-[#060B17] border border-slate-800/80 hover:border-slate-700 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800 text-xs">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold text-white">Order #{ord.id}</span>
                    <span className="text-slate-400">· {ord.createdAt}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-[#E5B842] font-bold uppercase text-[10px]">
                      {ord.paymentMethod} Gateway
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase ${
                      ord.status === 'completed' || ord.status === 'delivered'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : ord.status === 'shipped'
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {ord.status}
                    </span>

                    <button
                      onClick={() => handleOpenFulfillment(ord)}
                      className="px-3 py-1 rounded-xl bg-[#E5B842] hover:bg-[#F3BA2F] text-[#070D1B] font-bold text-[11px] shadow transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Truck className="w-3 h-3" />
                      <span>Fulfill / Dispatch</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                  {/* Items list: 6 cols */}
                  <div className="md:col-span-6 space-y-1.5">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Items Ordered:</div>
                    {ord.items.map((it, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800/70">
                        <span className="text-slate-200 font-semibold">{it.quantity}x {it.product.title}</span>
                        <span className="font-mono text-white font-bold">${(it.product.priceUsd * it.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  {/* Destination & Tracking: 6 cols */}
                  <div className="md:col-span-6 space-y-1.5">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Shipping Destination &amp; Logistics:</div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/70 space-y-1">
                      <div className="text-slate-300">
                        Customer: <strong className="text-white">{ord.shippingDetails?.fullName || 'Institutional Client'}</strong>
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        Address: {ord.shippingDetails?.address || 'Cardiff Head Office'}, {ord.shippingDetails?.country || 'United Kingdom'}
                      </div>
                      {ord.trackingCode && (
                        <div className="text-cyan-400 font-mono text-[11px] pt-1 border-t border-slate-800">
                          Tracking: <strong className="text-white">{ord.trackingCode}</strong>
                        </div>
                      )}
                      {ord.licenseKeys && ord.licenseKeys.length > 0 && (
                        <div className="text-emerald-400 font-mono text-[11px]">
                          Key: <strong className="text-white">{ord.licenseKeys[0]}</strong>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: ADD PRODUCT */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="w-full max-w-lg bg-[#091124] border border-[#E5B842]/40 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#E5B842]" />
                <span>Add Marketplace Product SKU</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Product Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 100g Pure Gold Bullion Bar with Certicard"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-[#E5B842]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-[#E5B842]"
                  >
                    <option value="collectibles">Collectibles &amp; Bullion</option>
                    <option value="cards">Crypto Cards</option>
                    <option value="software">Software Licenses</option>
                    <option value="esim">eSIM Data</option>
                    <option value="giftcards">Gift Cards</option>
                    <option value="token_creation">Token Development</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Price (USD)</label>
                  <input
                    type="number"
                    value={priceUsd}
                    onChange={(e) => setPriceUsd(parseFloat(e.target.value) || 0)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono font-bold focus:outline-none focus:border-[#E5B842]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Stock Count</label>
                  <input
                    type="number"
                    value={stockCount}
                    onChange={(e) => setStockCount(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono font-bold focus:outline-none focus:border-[#E5B842]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Fulfillment Mode</label>
                  <select
                    value={isPhysical ? 'true' : 'false'}
                    onChange={(e) => setIsPhysical(e.target.value === 'true')}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-[#E5B842]"
                  >
                    <option value="true">Physical Insured Courier</option>
                    <option value="false">Digital Key / Instant QR</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Finance Photography Preset</label>
                <select
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-[#E5B842]"
                >
                  <option value="/assets/products/million-dollar-banknote-gold.png">Banknote &amp; Gold Bullion</option>
                  <option value="/assets/products/casascius-bitcoin-collectible.png">Physical Casascius Bitcoin</option>
                  <option value="/assets/products/crypto-reserve-vault.png">NCB Crypto Reserve Vault</option>
                  <option value="/assets/products/nile-cards-trio.png">Crypto Cards Trio</option>
                  <option value="/assets/products/digital-goods-esim.png">5G eSIM Connectivity</option>
                  <option value="/assets/products/software-license-box.png">Software Licenses Box</option>
                  <option value="/assets/products/giftcard-luxury-vault.png">Luxury Giftcards Vault</option>
                  <option value="/assets/products/smart-contract-audit.png">Smart Contract &amp; Token Dev</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Key Features (comma-separated)</label>
                <input
                  type="text"
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-[#E5B842]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Official specifications, provenance documentation..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-[#E5B842]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] font-extrabold text-xs shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create &amp; Publish Marketplace SKU</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ORDER FULFILLMENT */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-[#091124] border border-[#E5B842]/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#E5B842]" />
                <span>Dispatch Order #{selectedOrder.id}</span>
              </h3>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Order Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold focus:outline-none focus:border-[#E5B842]"
                >
                  <option value="pending_payment">Pending Payment</option>
                  <option value="processing">Processing Order</option>
                  <option value="shipped">Shipped (In Transit)</option>
                  <option value="delivered">Delivered to Address</option>
                  <option value="completed">Completed &amp; Settled</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Courier Tracking Number</label>
                <input
                  type="text"
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  placeholder="e.g. DHL-UK-849201991GB"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono font-bold focus:outline-none focus:border-[#E5B842]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Digital License Key / Activation Code</label>
                <input
                  type="text"
                  value={licenseKeyInput}
                  onChange={(e) => setLicenseKeyInput(e.target.value)}
                  placeholder="e.g. NILE-KEY-8X92-Q1M4"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono font-bold focus:outline-none focus:border-[#E5B842]"
                />
              </div>

              <button
                type="button"
                onClick={handleSaveFulfillment}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] font-extrabold text-xs shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Save Logistics &amp; Notify Customer</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
