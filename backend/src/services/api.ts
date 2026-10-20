// src/backend/main/services/api.ts
const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const getAuthToken = (): string | null => localStorage.getItem('nile_jwt_token');

export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('nile_jwt_token', token);
  } else {
    localStorage.removeItem('nile_jwt_token');
  }
};

export async function apiRequest<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();
  if (!response.ok || data.success === false) {
    throw new Error(data.message || `API Error (${response.status})`);
  }
  return data;
}

export const NileApi = {
  register: (payload: { email?: string; phone?: string; password?: string; firstName?: string; lastName?: string; referralCode?: string }) =>
    apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),

  login: (payload: { email?: string; phone?: string; password?: string; twoFactorCode?: string }) =>
    apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),

  loginWithGoogle: (payload: { googleToken: string }) =>
    apiRequest('/auth/login/google', { method: 'POST', body: JSON.stringify(payload) }),

  web3Login: (payload: { address: string; signature: string; message: string; network: string }) =>
    apiRequest('/auth/web3-login', { method: 'POST', body: JSON.stringify(payload) }),

  getProfile: () => apiRequest('/auth/me'),

  getWallets: () => apiRequest('/wallets'),
  getHistory: () => apiRequest('/wallets/history'),
  requestWithdrawal: (payload: { walletType?: string; amount: number; currency: string; toAddress: string; network: string }) =>
    apiRequest('/wallets/withdraw', { method: 'POST', body: JSON.stringify(payload) }),

  verifyOnChainDeposit: (payload: { txid: string; network: string; expectedAsset: string; walletType?: string }) =>
    apiRequest('/payments/verify-onchain-deposit', { method: 'POST', body: JSON.stringify(payload) }),

  createCryptoInvoice: (payload: { amountUsd: number; payCurrency: string; description?: string }) =>
    apiRequest('/payments/create-crypto-invoice', { method: 'POST', body: JSON.stringify(payload) }),

  createCardSession: (payload: { amountUsd: number; currency?: string; gateway?: 'stripe' | 'onramp' }) =>
    apiRequest('/payments/create-card-session', { method: 'POST', body: JSON.stringify(payload) }),

  verifyCardSession: (sessionId: string) =>
    apiRequest('/payments/verify-card-session', { method: 'POST', body: JSON.stringify({ sessionId }) })
};
