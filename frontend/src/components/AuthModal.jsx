import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, authMode, setAuthMode, login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    referralCode: '',
    twoFactorCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [requires2FA, setRequires2FA] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      if (authMode === 'login') {
        // Attempt API login or fallback demo login
        let res;
        try {
          const apiRes = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password,
              twoFactorCode: formData.twoFactorCode
            })
          });
          res = await apiRes.json();
        } catch {
          // Local demo fallback if backend is offline
          res = {
            success: true,
            token: 'demo-jwt-token-xyz',
            user: {
              id: 'demo-user-id',
              email: formData.email,
              firstName: formData.email.split('@')[0],
              lastName: 'Investor',
              role: formData.email.includes('admin') ? 'SUPER_ADMIN' : 'USER',
              referralCode: 'NILE-DEMO',
              referralRank: 'GOLD',
              kycStatus: 'APPROVED'
            }
          };
        }

        if (res.requires2FA) {
          setRequires2FA(true);
          setLoading(false);
          return;
        }

        if (res.success) {
          login(res.user, res.token);
          setIsAuthModalOpen(false);
        } else {
          setErrorMessage(res.message || 'Login failed.');
        }
      } else {
        // Register
        let res;
        try {
          const apiRes = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
          });
          res = await apiRes.json();
        } catch {
          // Demo fallback
          res = {
            success: true,
            token: 'demo-jwt-token-xyz',
            user: {
              id: 'demo-new-user',
              email: formData.email,
              firstName: formData.firstName,
              lastName: formData.lastName,
              role: 'USER',
              referralCode: 'NILE-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
              referralRank: 'BRONZE',
              kycStatus: 'UNVERIFIED'
            }
          };
        }

        if (res.success) {
          login(res.user, res.token);
          setIsAuthModalOpen(false);
        } else {
          setErrorMessage(res.message || 'Registration failed.');
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-md p-8 rounded-3xl border border-white/20 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-white"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-nile-accent to-emerald-400 text-2xl flex items-center justify-center mx-auto mb-3">
            🐊
          </div>
          <h3 className="text-2xl font-extrabold text-white">
            {authMode === 'login' ? 'Welcome Back' : 'Create an Account'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {authMode === 'login' ? 'Access your institutional wealth portfolio' : 'Join the NILE Web3 Investment Protocol'}
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {authMode === 'register' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">First Name</label>
                <input
                  type="text"
                  required
                  placeholder="Matin"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Last Name</label>
                <input
                  type="text"
                  required
                  placeholder="Parsa"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="investor@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
            />
          </div>

          {authMode === 'register' && (
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Referral Code (Optional)</label>
              <input
                type="text"
                placeholder="NILE-XXXXXX"
                value={formData.referralCode}
                onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white uppercase"
              />
            </div>
          )}

          {requires2FA && (
            <div>
              <label className="block text-emerald-400 font-semibold mb-1">2FA Security Code</label>
              <input
                type="text"
                required
                placeholder="6-digit authenticator code"
                value={formData.twoFactorCode}
                onChange={(e) => setFormData({ ...formData, twoFactorCode: e.target.value })}
                className="w-full bg-slate-900 border border-emerald-500 rounded-xl px-3 py-2.5 text-white text-center font-mono text-base"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold bg-gradient-to-r from-nile-accent to-emerald-500 text-nile-950 hover:brightness-110 transition-all text-xs shadow-lg shadow-nile-accent/20 mt-2"
          >
            {loading ? 'Processing...' : (authMode === 'login' ? 'Sign In to Account' : 'Create Account & Initialize Wallets')}
          </button>
        </form>

        <div className="text-center mt-5 text-xs text-slate-400">
          {authMode === 'login' ? (
            <span>
              Don't have an account?{' '}
              <button
                onClick={() => setAuthMode('register')}
                className="text-nile-accent font-bold hover:underline"
              >
                Sign Up
              </button>
            </span>
          ) : (
            <span>
              Already registered?{' '}
              <button
                onClick={() => setAuthMode('login')}
                className="text-nile-accent font-bold hover:underline"
              >
                Sign In
              </button>
            </span>
          )}
        </div>

      </div>
    </div>
  );
}
