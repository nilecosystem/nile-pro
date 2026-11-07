// main/src/services/api.ts
import axios from 'axios';

const API_BASE = process.env.APP_URL || 'http://localhost:3000/api';

// ✅ Register new user
export const register = async (payload: { email: string; password: string; phone?: string }) => {
  return axios.post(`${API_BASE}/auth/register`, payload);
};

// ✅ Login with email/password
export const login = async (payload: { email: string; password: string }) => {
  return axios.post(`${API_BASE}/auth/login`, payload);
};

// ✅ Login with Google OAuth
export const loginWithGoogle = async (token: string) => {
  return axios.post(`${API_BASE}/auth/google`, { token });
};

// ✅ Web3 wallet login
export const web3Login = async (payload: { address: string; signature: string }) => {
  return axios.post(`${API_BASE}/auth/web3`, payload);
};

// ✅ Get user profile
export const getProfile = async (token: string) => {
  return axios.get(`${API_BASE}/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
