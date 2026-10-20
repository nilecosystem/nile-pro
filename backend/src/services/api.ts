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
  register: (payload: { email: string; password: string; firstName: string; lastName: string; phone?: string; referralCode?: string }) =>
    apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),

  login: (payload: { email: string; password: string; twoFactorCode?: string }) =>
    apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),

  getProfile: () => apiRequest('/auth/profile'),

  submitKYC: (payload: { idType: string; idNumber: string; frontImageUrl: string; backImageUrl: string; selfieUrl: string }) =>
    apiRequest('/auth/kyc', { method: 'POST', body: JSON.stringify(payload) }),

  web3Login: (payload: { address: string; signature: string; message: string; network?: string }) =>
    apiRequest('/auth/web3-login', { method: 'POST', body: JSON.stringify(payload) }),

  getWallets: () => apiRequest('/wallets'),
  getInvestments: () => apiRequest('/investments'),
  getReferrals: () => apiRequest('/referrals'),
  getShopItems: () => apiRequest('/shop'),
  getAcademyCourses: () => apiRequest('/academy'),
  getAdminDashboard: () => apiRequest('/admin/dashboard'),
  processPayment: (payload: { amountUsd: number; currency: string; method: string }) =>
    apiRequest('/payments/process', { method: 'POST', body: JSON.stringify(payload) })
};
