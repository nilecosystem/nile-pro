import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../locales/i18n';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('nile_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('nile_token') || null);
  const [language, setLanguage] = useState(() => localStorage.getItem('nile_lang') || 'en');
  const [wallets, setWallets] = useState([
    { type: 'INTERNAL', currency: 'USDT', balance: 12450.00 },
    { type: 'INTERNAL', currency: 'NILE', balance: 250000.00 },
    { type: 'INVESTMENT', currency: 'USDT', balance: 5000.00 },
    { type: 'REFERRAL', currency: 'USDT', balance: 1840.50 },
    { type: 'SHOP', currency: 'USDT', balance: 450.00 }
  ]);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Sync RTL / LTR direction with language
  useEffect(() => {
    localStorage.setItem('nile_lang', language);
    const isRtl = language === 'fa' || language === 'ar';
    document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('nile_user', JSON.stringify(userData));
    localStorage.setItem('nile_token', userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('nile_user');
    localStorage.removeItem('nile_token');
    setIsDashboardOpen(false);
    setIsAdminOpen(false);
  };

  const t = translations[language] || translations.en;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        language,
        setLanguage,
        isRtl: language === 'fa' || language === 'ar',
        t,
        wallets,
        setWallets,
        isDepositOpen,
        setIsDepositOpen,
        isWithdrawOpen,
        setIsWithdrawOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
        isDashboardOpen,
        setIsDashboardOpen,
        isAdminOpen,
        setIsAdminOpen
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
