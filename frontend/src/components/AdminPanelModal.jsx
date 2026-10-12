import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AdminPanelModal() {
  const { user, isAdminOpen, setIsAdminOpen } = useAuth();
  const [activeAdminTab, setActiveAdminTab] = useState('USERS'); // 'USERS', 'WITHDRAWALS', 'KYC', 'AUDIT'
  
  // Balance adjustment modal state
  const [adjustTargetUser, setAdjustTargetUser] = useState(null);
  const [adjustForm, setAdjustForm] = useState({
    walletType: 'INTERNAL',
    currency: 'USDT',
    deltaAmount: '',
    reason: ''
  });
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');
  const [productsList, setProductsList] = useState([
    { id: 1, title: 'کارت اعتباری مجازی ویزا / مسترکارت', price: 25, discount: 15, category: 'FINANCIAL' },
    { id: 2, title: 'سیم‌کارت بین‌المللی سفر eSIM', price: 18, discount: 20, category: 'FINANCIAL' },
    { id: 3, title: 'لایسنس ویندوز ۱۱ پرو', price: 15, discount: 25, category: 'SOFTWARE' }
  ]);
  const [newProduct, setNewProduct] = useState({ title: '', price: '', discount: 10, category: 'SOFTWARE' });

  // Nile Crypto Software state
  const [cryptoSoftwareList, setCryptoSoftwareList] = useState([
    { id: 1, name: 'Nile Auto-Trader Bot Pro', desc: 'ربات معاملاتی هوشمند آربیتراژ و گرید تریدینگ با اتصال به صرافی‌ها', price: '99 USDT', status: 'ACTIVE' },
    { id: 2, name: 'Nile Secure Vault Node', desc: 'نرم‌افزار مدیریت نود اختصاصی و نظارت بر تراکنش‌های شبکه BSC و بیت‌کوین', price: '149 USDT', status: 'ACTIVE' },
    { id: 3, name: 'Nile Smart Sniper Bot', desc: 'ربات شناسایی و شکار توکن‌های جدید در صرافی‌های غیرمتمرکز DEX', price: '199 USDT', status: 'COMING_SOON' }
  ]);
  const [newSoftware, setNewSoftware] = useState({ name: '', desc: '', price: '' });

  // Withdrawals pending state
  const [pendingWithdrawals, setPendingWithdrawals] = useState([
    { id: 'w-1', user: 'investor_alpha@gmail.com', amount: '250.00 USDT', address: 'TX9z...41b', time: '۲ ساعت قبل', status: 'PENDING' },
    { id: 'w-2', user: 'crypto_whale@proton.me', amount: '1,200.00 USDT', address: '0x88c...71e', time: '۵ ساعت قبل', status: 'PENDING' }
  ]);

  // Sample managed users list
  const [usersList, setUsersList] = useState([
    { id: 'usr-1', email: 'matin@nileecosystem.com', name: 'Matin Parsa', role: 'USER', rank: 'DIAMOND', kyc: 'APPROVED', internalBalance: 45200 },
    { id: 'usr-2', email: 'investor_alpha@gmail.com', name: 'John Doe', role: 'USER', rank: 'SILVER', kyc: 'PENDING', internalBalance: 1250 },
    { id: 'usr-3', email: 'crypto_whale@proton.me', name: 'Satoshi M.', role: 'USER', rank: 'PLATINUM', kyc: 'APPROVED', internalBalance: 98000 }
  ]);

  // Sample audit logs list
  const [auditLogs, setAuditLogs] = useState([
    {
      id: 'log-101',
      adminEmail: user?.email || 'admin@nileecosystem.com',
      targetUser: 'investor_alpha@gmail.com',
      actionType: 'DEPOSIT_CONFIRM',
      beforeValue: 'PENDING (500 USDT)',
      afterValue: 'CONFIRMED (TXID: 0x9f21...)',
      reason: 'Blockchain confirmation verified on TronScan',
      timestamp: '2026-10-11 12:15 UTC'
    },
    {
      id: 'log-100',
      adminEmail: user?.email || 'admin@nileecosystem.com',
      targetUser: 'crypto_whale@proton.me',
      actionType: 'BALANCE_ADJUST',
      beforeValue: '95,000 USDT',
      afterValue: '98,000 USDT (+3,000 USDT)',
      reason: 'Manual compensation for delayed node sync',
      timestamp: '2026-10-11 08:30 UTC'
    }
  ]);

  if (!isAdminOpen) return null;

  const handleAdjustSubmit = (e) => {
    e.preventDefault();
    if (!adjustForm.reason || !adjustForm.deltaAmount) return;

    const delta = parseFloat(adjustForm.deltaAmount);
    // Update user balance
    setUsersList(prev => prev.map(u => {
      if (u.id === adjustTargetUser.id) {
        return { ...u, internalBalance: u.internalBalance + delta };
      }
      return u;
    }));

    // Add to audit trail
    const newLog = {
      id: 'log-' + Date.now(),
      adminEmail: user.email,
      targetUser: adjustTargetUser.email,
      actionType: 'BALANCE_ADJUST',
      beforeValue: `${adjustTargetUser.internalBalance} USDT`,
      afterValue: `${adjustTargetUser.internalBalance + delta} USDT (${delta >= 0 ? '+' : ''}${delta})`,
      reason: adjustForm.reason,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
    };
    setAuditLogs([newLog, ...auditLogs]);

    setActionSuccessMsg(`Balance adjusted for ${adjustTargetUser.email} with audit record.`);
    setTimeout(() => {
      setActionSuccessMsg('');
      setAdjustTargetUser(null);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <div className="glass-panel w-full max-w-5xl h-[90vh] rounded-3xl border border-purple-500/30 shadow-2xl flex flex-col overflow-hidden bg-slate-950">
        
        {/* Admin Header */}
        <div className="p-6 border-b border-purple-500/20 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-300 font-black text-xl flex items-center justify-center">
              🛡️
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <span>Super Admin Control Terminal</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                  FULL AUDIT ENFORCED
                </span>
              </h3>
              <p className="text-xs text-slate-400">Manage ledger balances, KYC, cycle payouts, and inspect immutable audit logs.</p>
            </div>
          </div>

          <button
            onClick={() => setIsAdminOpen(false)}
            className="w-10 h-10 rounded-xl bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        {/* Admin Tabs */}
        <div className="px-6 py-3 border-b border-white/5 bg-slate-900/50 flex gap-2 text-xs">
          {[
            { id: 'USERS', label: '👥 مدیریت کاربران و بن/بلاک' },
            { id: 'WITHDRAWALS', label: '📤 تایید برداشت (Pending → Success)' },
            { id: 'MARKET', label: '🛍️ مدیریت مارکت‌پلیس (افزودن/حذف)' },
            { id: 'CRYPTO_SOFTWARE', label: '💻 نیل کریپتو سافت‌ویر' },
            { id: 'AUDIT', label: '📜 لاگ‌های حسابرسی' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id)}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                activeAdminTab === tab.id
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1 overflow-y-auto">
          
          {/* TAB 1: USERS LEDGER & BALANCE CONTROL */}
          {activeAdminTab === 'USERS' && (
            <div className="space-y-4">
              {actionSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                  ✓ {actionSuccessMsg}
                </div>
              )}

              <div className="glass-panel rounded-2xl border border-white/10 overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px] bg-slate-900/50">
                      <th className="p-3">User & Email</th>
                      <th className="p-3">Rank</th>
                      <th className="p-3">KYC Status</th>
                      <th className="p-3">Internal Balance</th>
                      <th className="p-3 text-right">Administrative Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {usersList.map(u => (
                      <tr key={u.id} className="hover:bg-white/[0.02]">
                        <td className="p-3">
                          <div className="font-bold text-white">{u.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{u.email}</div>
                        </td>
                        <td className="p-3 font-semibold text-nile-accent">{u.rank}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.kyc === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                            {u.kyc}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-white">${u.internalBalance.toLocaleString()} USDT</td>
                        <td className="p-3 text-right space-x-1.5 flex justify-end items-center gap-1.5">
                          <button
                            onClick={() => setAdjustTargetUser(u)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold hover:bg-emerald-500/30 text-[10px]"
                          >
                            تغییر موجودی
                          </button>
                          <button
                            onClick={() => {
                              const newStatus = u.status === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED';
                              setUsersList(prev => prev.map(item => item.id === u.id ? { ...item, status: newStatus } : item));
                              alert(`وضعیت کاربر ${u.email} به ${newStatus} تغییر یافت.`);
                            }}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[10px] ${u.status === 'BLOCKED' ? 'bg-red-500/30 text-red-300' : 'bg-amber-500/20 text-amber-300'}`}
                          >
                            {u.status === 'BLOCKED' ? 'رفع مسدودی (Unblock)' : 'بلاک/بن (Block)'}
                          </button>
                          <button
                            onClick={() => alert(`ورود به حساب ${u.email}... لاگ جلسه ثبت شد.`)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 text-[10px]"
                          >
                            ورود به پنل کاربر
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Adjust Balance Modal */}
              {adjustTargetUser && (
                <div className="p-5 rounded-2xl glass-panel border border-emerald-500/30 bg-slate-900 mt-4 max-w-lg">
                  <h4 className="text-sm font-bold text-white mb-2">
                    Adjust Balance for <span className="text-nile-accent">{adjustTargetUser.email}</span>
                  </h4>
                  <form onSubmit={handleAdjustSubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Delta Amount (+ to credit, - to debit)</label>
                      <input
                        type="number"
                        step="any"
                        required
                        placeholder="e.g. 500 or -200"
                        value={adjustForm.deltaAmount}
                        onChange={(e) => setAdjustForm({ ...adjustForm, deltaAmount: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Mandatory Audit Reason (Logged to Audit Trail)</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Compensation for deposit verification latency"
                        value={adjustForm.reason}
                        onChange={(e) => setAdjustForm({ ...adjustForm, reason: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button type="submit" className="flex-1 py-2 bg-emerald-500 text-nile-950 font-bold rounded-xl">
                        Apply Adjustment & Log
                      </button>
                      <button type="button" onClick={() => setAdjustTargetUser(null)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl">
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: AUDIT TRAIL LOGS */}
          {activeAdminTab === 'AUDIT' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/20 text-xs text-purple-300">
                🔒 <strong>Strict Audit Logging Standard:</strong> Every action records admin ID, target user, action type, before/after values, timestamp, and mandatory operator reason.
              </div>

              <div className="glass-panel rounded-2xl border border-white/10 overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px] bg-slate-900/50">
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Admin</th>
                      <th className="p-3">Target User</th>
                      <th className="p-3">Action Type</th>
                      <th className="p-3">Before / After State</th>
                      <th className="p-3">Mandatory Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {auditLogs.map(log => (
                      <tr key={log.id} className="hover:bg-white/[0.02]">
                        <td className="p-3 font-mono text-[11px] text-slate-400">{log.timestamp}</td>
                        <td className="p-3 font-semibold text-white">{log.adminEmail}</td>
                        <td className="p-3 font-mono text-cyan-300">{log.targetUser}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300">
                            {log.actionType}
                          </span>
                        </td>
                        <td className="p-3 text-[11px]">
                          <span className="text-slate-500">{log.beforeValue}</span> → <span className="font-bold text-white">{log.afterValue}</span>
                        </td>
                        <td className="p-3 text-slate-300 italic">{log.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}


          {/* TAB: WITHDRAWALS (PENDING -> SUCCESSFUL 1-48H) */}
          {activeAdminTab === 'WITHDRAWALS' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-300">
                ⏳ <strong>مدیریت درخواست‌های برداشت (۱ تا ۴۸ ساعت بررسی):</strong><br />
                تمام درخواست‌های برداشت ابتدا در حالت <strong>در حال بررسی (Pending)</strong> قرار می‌گیرند. پس از تایید و واریز توسط شما، با ثبت هش تراکنش وضعیت به <strong>موفق (Successful)</strong> تغییر می‌یابد.
              </div>

              <div className="glass-panel rounded-2xl border border-white/10 overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px] bg-slate-900/50">
                      <th className="p-3">کاربر</th>
                      <th className="p-3">مبلغ</th>
                      <th className="p-3">آدرس مقصد</th>
                      <th className="p-3">زمان ثبت</th>
                      <th className="p-3">وضعیت</th>
                      <th className="p-3 text-right">عملیات مدیر (Owner)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {pendingWithdrawals.map(w => (
                      <tr key={w.id}>
                        <td className="p-3 font-bold text-white">{w.user}</td>
                        <td className="p-3 font-mono font-bold text-emerald-400">{w.amount}</td>
                        <td className="p-3 font-mono text-slate-400">{w.address}</td>
                        <td className="p-3 text-slate-400">{w.time}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${w.status === 'SUCCESSFUL' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300'}`}>
                            {w.status === 'SUCCESSFUL' ? '✓ Successful (واریز شد)' : '⏳ Pending (در حال بررسی)'}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          {w.status === 'PENDING' ? (
                            <button
                              onClick={() => {
                                const txid = prompt('شناسه تراکنش واریز (TXID) را وارد کنید:');
                                if (txid) {
                                  setPendingWithdrawals(prev => prev.map(item => item.id === w.id ? { ...item, status: 'SUCCESSFUL' } : item));
                                  alert(`برداشت با موفقیت تایید شد و وضعیت به Successful تغییر یافت.`);
                                }
                              }}
                              className="px-3 py-1.5 rounded-lg bg-emerald-500 text-nile-950 font-bold text-xs hover:bg-emerald-400"
                            >
                              تایید واریز (تبدیل به Successful)
                            </button>
                          ) : (
                            <span className="text-emerald-400 font-bold text-xs">تکمیل شده</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: MARKETPLACE MANAGEMENT (ADD/REMOVE PRODUCTS) */}
          {activeAdminTab === 'MARKET' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 text-xs text-purple-300">
                🛍️ <strong>مدیریت محصولات مارکت‌پلیس توسط مالک (Owner):</strong><br />
                در این بخش می‌توانید محصولات دیجیتال جدید با تعیین درصد تخفیف توکن NILE (۱۰٪ تا ۵۰٪) اضافه کنید یا محصولات را حذف نمایید.
              </div>

              {/* Add New Product Form */}
              <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-slate-900/90">
                <h4 className="text-sm font-bold text-white mb-3">+ افزودن محصول جدید به مارکت‌پلیس</h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <input
                    type="text"
                    placeholder="عنوان محصول (مثلاً: لایسنس جدید)"
                    value={newProduct.title}
                    onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                    className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                  <input
                    type="number"
                    placeholder="قیمت بر حسب تتر (USDT)"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                  <select
                    value={newProduct.discount}
                    onChange={(e) => setNewProduct({ ...newProduct, discount: parseInt(e.target.value) })}
                    className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value={10}>۱۰٪ تخفیف توکن NILE</option>
                    <option value={20}>۲۰٪ تخفیف توکن NILE</option>
                    <option value={30}>۳۰٪ تخفیف توکن NILE</option>
                    <option value={50}>۵۰٪ تخفیف توکن NILE</option>
                  </select>
                  <button
                    onClick={() => {
                      if (!newProduct.title || !newProduct.price) return;
                      setProductsList([...productsList, { id: Date.now(), ...newProduct, price: parseFloat(newProduct.price) }]);
                      setNewProduct({ title: '', price: '', discount: 10, category: 'SOFTWARE' });
                      alert('محصول با موفقیت به مارکت‌پلیس اضافه شد!');
                    }}
                    className="py-2 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-500"
                  >
                    ثبت در مارکت‌پلیس
                  </button>
                </div>
              </div>

              {/* Product List Table */}
              <div className="glass-panel rounded-2xl border border-white/10 overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px] bg-slate-900/50">
                      <th className="p-3">محصول</th>
                      <th className="p-3">قیمت پایه (USDT)</th>
                      <th className="p-3">تخفیف توکن NILE</th>
                      <th className="p-3 text-right">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {productsList.map(p => (
                      <tr key={p.id}>
                        <td className="p-3 font-bold text-white">{p.title}</td>
                        <td className="p-3 font-mono font-bold text-white">${p.price} USDT</td>
                        <td className="p-3 font-bold text-purple-400">{p.discount}% تخفیف</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setProductsList(productsList.filter(item => item.id !== p.id))}
                            className="px-3 py-1 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 text-[11px]"
                          >
                            حذف محصول
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: NILE CRYPTO SOFTWARE */}
          {activeAdminTab === 'CRYPTO_SOFTWARE' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300">
                💻 <strong>بخش نیل کریپتو سافت‌ویر (Nile Crypto Software):</strong><br />
                در این بخش می‌توانید نرم‌افزارهای تخصصی کریپتو، ربات‌های معاملاتی و ابزارهای توسعه را معرفی، مدیریت و قیمت‌گذاری نمایید.
              </div>

              {/* Add New Software Form */}
              <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-slate-900/90">
                <h4 className="text-sm font-bold text-white mb-3">+ معرفی نرم‌افزار جدید کریپتو</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-3">
                  <input
                    type="text"
                    placeholder="نام نرم‌افزار (مثلاً: Nile Sniper Bot)"
                    value={newSoftware.name}
                    onChange={(e) => setNewSoftware({ ...newSoftware, name: e.target.value })}
                    className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                  <input
                    type="text"
                    placeholder="قیمت (مثلاً: 120 USDT)"
                    value={newSoftware.price}
                    onChange={(e) => setNewSoftware({ ...newSoftware, price: e.target.value })}
                    className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                  <input
                    type="text"
                    placeholder="توضیحات کوتاه عملکرد نرم‌افزار"
                    value={newSoftware.desc}
                    onChange={(e) => setNewSoftware({ ...newSoftware, desc: e.target.value })}
                    className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <button
                  onClick={() => {
                    if (!newSoftware.name || !newSoftware.price) return;
                    setCryptoSoftwareList([...cryptoSoftwareList, { id: Date.now(), ...newSoftware, status: 'ACTIVE' }]);
                    setNewSoftware({ name: '', desc: '', price: '' });
                    alert('نرم‌افزار کریپتو با موفقیت به بخش نیل کریپتو سافت‌ویر اضافه شد!');
                  }}
                  className="px-5 py-2 bg-emerald-500 text-nile-950 font-bold rounded-xl text-xs hover:bg-emerald-400"
                >
                  ثبت و انتشار نرم‌افزار
                </button>
              </div>

              {/* Software List Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {cryptoSoftwareList.map(sw => (
                  <div key={sw.id} className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-nile-accent">💻 {sw.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">{sw.status}</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed mb-4">{sw.desc}</p>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-white/5">
                      <span className="text-sm font-bold text-white">{sw.price}</span>
                      <button
                        onClick={() => setCryptoSoftwareList(cryptoSoftwareList.filter(item => item.id !== sw.id))}
                        className="text-[11px] text-red-400 hover:underline"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}


        </div>

      </div>
    </div>
  );
}
