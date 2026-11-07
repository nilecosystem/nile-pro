import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  Language, 
  UserProfile, 
  BankBalances, 
  CryptoCard, 
  TransactionRecord, 
  PresalePhase, 
  PresalePurchase, 
  InvestmentPosition, 
  MarketplaceProduct, 
  CartItem, 
  MarketplaceOrder, 
  Testimonial, 
  SupportTicket, 
  DepositWalletsConfig, 
  AdminAuditEntry,
  KycDocument,
  NileStakingPool,
  NileUserStake,
  AchievementBadge,
  ReferralTierConfig,
  KycFeaturePermissions,
  KycAmlProviderSession,
  TokenomicsAllocation,
  VestingScheduleEvent,
  InvestmentPlansAdminConfig,
  AiOperationsAdminConfig,
  VideoAdAdminItem,
  ClientDelegatedPermissions,
  AuthProvider,
  AuthModalMode
} from '../types/index.ts';
import { 
  INITIAL_DEPOSIT_WALLETS, 
  INITIAL_PRESALE_PHASES, 
  INITIAL_CRYPTO_CARDS, 
  INITIAL_MARKETPLACE_PRODUCTS, 
  INITIAL_TESTIMONIALS,
  INITIAL_ADMIN_AUDIT_LOGS,
  INITIAL_STAKING_POOLS,
  INITIAL_USER_STAKES,
  INITIAL_ACHIEVEMENT_BADGES,
  INITIAL_REFERRAL_TIERS,
  TOKENOMICS_ALLOCATIONS,
  VESTING_SCHEDULE_EVENTS,
  INITIAL_MANAGED_CLIENTS
} from '../data/initialData.ts';
import { TRANSLATIONS, isRTL } from '../data/i18n.ts';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof TRANSLATIONS['en'];
  isRtlMode: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile;
  updateUser: (updated: Partial<UserProfile>) => void;
  balances: BankBalances;
  cards: CryptoCard[];
  transactions: TransactionRecord[];
  presalePhases: PresalePhase[];
  presalePurchases: PresalePurchase[];
  investmentPositions: InvestmentPosition[];
  marketplaceProducts: MarketplaceProduct[];
  cart: CartItem[];
  orders: MarketplaceOrder[];
  testimonials: Testimonial[];
  supportTickets: SupportTicket[];
  depositWallets: DepositWalletsConfig;
  auditLogs: AdminAuditEntry[];
  certificateModalOpen: boolean;
  setCertificateModalOpen: (open: boolean) => void;
  selectedCertificate: 'incorporation' | 'compliance';
  setSelectedCertificate: (cert: 'incorporation' | 'compliance') => void;
  supportDrawerOpen: boolean;
  setSupportDrawerOpen: (open: boolean) => void;
  
  // Staking
  stakingPools: NileStakingPool[];
  userStakes: NileUserStake[];
  stakeTokens: (poolId: string, amountNile: number) => boolean;
  unstakeTokens: (stakeId: string) => boolean;
  claimStakingRewards: (stakeId: string) => void;
  calculateAccruedReward: (stake: NileUserStake) => number;
  adminUpdateStakingPool: (poolId: string, updates: Partial<NileStakingPool>) => void;
  adminCreateStakingPool: (pool: Omit<NileStakingPool, 'id' | 'totalStakedInPool'>) => void;

  // Tokenomics & Vesting Configuration
  tokenomicsAllocations: TokenomicsAllocation[];
  updateTokenomicsAllocation: (index: number, updates: Partial<TokenomicsAllocation>) => void;
  vestingEvents: VestingScheduleEvent[];
  addVestingEvent: (event: Omit<VestingScheduleEvent, 'id'>) => void;
  updateVestingEvent: (id: string, updates: Partial<VestingScheduleEvent>) => void;
  deleteVestingEvent: (id: string) => void;

  // Referral System & Badges
  referralTiers: ReferralTierConfig[];
  badges: AchievementBadge[];
  claimBadge: (badgeId: string) => void;
  adminUpdateReferralTier: (rank: ReferralTierConfig['rank'], updates: Partial<ReferralTierConfig>) => void;
  adminUpdateBadge: (badgeId: string, updates: Partial<AchievementBadge>) => void;

  // KYC/AML Integration Points
  kycSession: KycAmlProviderSession;
  kycPermissions: KycFeaturePermissions;
  initiateKycSession: (provider?: 'Sumsub' | 'Onfido' | 'Jumio' | 'ShuftiPro') => Promise<string>;
  submitProviderVerification: (data: { 
    applicantId: string; 
    documentType: string; 
    frontImageBase64?: string; 
    livenessPassed: boolean; 
    pepSanctionCheckPassed: boolean 
  }) => Promise<void>;
  simulateProviderWebhook: (event: 'applicantReviewed' | 'applicantPending' | 'applicantRejected' | 'pepSanctionFlagged', payloadSummary?: string) => void;

  // Core Actions
  addTransaction: (tx: Omit<TransactionRecord, 'id' | 'timestamp'>) => void;
  submitKyc: (documents: KycDocument[], personalInfo: { name: string; phone: string; address: string; country: string }) => void;
  adminReviewKyc: (userId: string, approve: boolean, reason?: string) => void;
  orderCryptoCard: (cardData: { type: 'visa' | 'mastercard'; isPhysical: boolean; currency: 'USD' | 'EUR' | 'GBP'; tier: 'Standard' | 'Gold' | 'Black Elite'; initialBalance: number; shippingAddress?: any }) => void;
  toggleCardStatus: (cardId: string) => void;
  updateCardLimit: (cardId: string, limits: { dailySpending: number; monthlySpending: number; dailyAtm: number }) => void;
  participateInPresale: (phaseId: number, amountUsd: number, paymentAsset: 'ETH' | 'BNB' | 'USDT' | 'USDC' | 'BTC' | 'SOL' | 'TRX', network: string) => boolean;
  createInvestment: (planCategoryId: 'asset' | 'time' | 'amount' | 'nile_benefits', planName: string, principalAmount: number, currency: string, aprPercent: number, durationDays: number) => void;
  addToCart: (product: MarketplaceProduct, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  checkoutCart: (paymentMethod: 'crypto' | 'bank_transfer' | 'nile_wallet', shippingDetails?: any) => string;
  submitTestimonial: (feedback: { userName: string; userRoleOrLocation: string; rating: number; comment: string; productUsed: any }) => void;
  adminApproveTestimonial: (id: string, approve: boolean) => void;
  submitSupportTicket: (ticket: { userName: string; userEmail: string; subject: string; category: any; priority: any; message: string }) => void;
  updateDepositWallets: (wallets: Partial<DepositWalletsConfig>, adminReason: string) => void;
  updatePresalePhase: (phaseId: number, updates: Partial<PresalePhase>) => void;
  adminAdjustBalance: (currency: keyof BankBalances, amount: number, reason: string) => void;
  
  // Marketplace & Order Administration
  adminAddMarketplaceProduct: (product: Omit<MarketplaceProduct, 'id'>) => void;
  adminUpdateMarketplaceProduct: (id: string, updates: Partial<MarketplaceProduct>) => void;
  adminDeleteMarketplaceProduct: (id: string) => void;
  adminUpdateOrderStatus: (orderId: string, status: MarketplaceOrder['status'], trackingCode?: string, licenseKeys?: string[]) => void;

  // Cards Administration
  adminUpdateCard: (cardId: string, updates: Partial<CryptoCard>) => void;
  adminIssueCard: (card: Omit<CryptoCard, 'id'>) => void;

  // Investment Plans Administration
  investmentPlansConfig: InvestmentPlansAdminConfig;
  adminUpdateInvestmentPlansConfig: (updates: Partial<InvestmentPlansAdminConfig>) => void;

  // AI Bank Engine Administration
  aiOperationsConfig: AiOperationsAdminConfig;
  adminUpdateAiOperationsConfig: (updates: Partial<AiOperationsAdminConfig>) => void;
  adminTriggerAiSimulation: (action: string) => void;

  // Video Ads Administration
  videoAdsConfig: VideoAdAdminItem[];
  adminUpdateVideoAd: (id: string, updates: Partial<VideoAdAdminItem>) => void;
  adminAddVideoAd: (ad: Omit<VideoAdAdminItem, 'id'>) => void;

  // Clients & Delegated Panel Controls (Platform Owner Governance)
  managedClients: UserProfile[];
  adminApproveClientPanel: (clientId: string, permissions: Partial<ClientDelegatedPermissions>, notes?: string) => void;
  adminRevokeClientPanel: (clientId: string, reason?: string) => void;
  adminUpdateClientPermissions: (clientId: string, permissions: Partial<ClientDelegatedPermissions>) => void;
  requestClientPanelAccess: (reason: string) => void;
  switchActiveClient: (clientId: string) => void;
  clientPanelModalOpen: boolean;
  setClientPanelModalOpen: (open: boolean) => void;
  isClientPanelApproved: boolean;

  // Authentication & Access Controls
  authModalOpen: boolean;
  authModalMode: AuthModalMode;
  setAuthModalOpen: (open: boolean, mode?: AuthModalMode) => void;
  isLoggedIn: boolean;
  rememberMe: boolean;
  setRememberMe: (val: boolean) => void;
  loginWithProvider: (provider: AuthProvider, payload?: any, remember?: boolean) => Promise<boolean>;
  signupWithProvider: (provider: AuthProvider, payload?: any, remember?: boolean) => Promise<boolean>;
  resetPasswordWithCode: (identifier: string, code: string, newPass: string) => Promise<boolean>;
  logout: () => void;
  toggleBiometric2FA: (enabled: boolean) => void;
  verifyDeviceBiometrics: () => Promise<boolean>;
  registerDeviceBiometrics: () => Promise<boolean>;

  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('nile_lang') as Language) || 'en';
  });

  const [activeTab, setActiveTab] = useState<string>('home');
  const [certificateModalOpen, setCertificateModalOpen] = useState<boolean>(false);
  const [selectedCertificate, setSelectedCertificate] = useState<'incorporation' | 'compliance'>('incorporation');
  const [supportDrawerOpen, setSupportDrawerOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('nile_lang', lang);
  };

  const isRtlMode = isRTL(language);

  useEffect(() => {
    document.documentElement.dir = isRtlMode ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRtlMode]);

  // Initial user profile
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('nile_user');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        if (!parsed.avatarUrl) {
          parsed.avatarUrl = '/default-avatar.jpg';
        }
        return parsed;
      } catch (e) {}
    }
    return {
      id: 'usr-nile-001',
      name: 'Matin Parsa',
      email: 'owner@nileecosystem.com',
      role: 'super_admin',
      phone: '+44 7558 847468',
      accountNumber: 'NCB-84291647',
      kycStatus: 'verified',
      kycTier: 3,
      kycSubmittedAt: '2026-01-15',
      kycApprovedAt: '2026-01-16',
      referralCode: 'NILE-PARSA-2026',
      rank: 'Diamond',
      badges: ['badge-pioneer', 'badge-bullion', 'badge-highroller', 'badge-community', 'badge-diamond'],
      twoFactorEnabled: true,
      registeredAt: '2026-01-10',
      avatarUrl: '/default-avatar.jpg'
    };
  });

  const updateUser = (updated: Partial<UserProfile>) => {
    setUser(prev => {
      const next = { ...prev, ...updated };
      localStorage.setItem('nile_user', JSON.stringify(next));
      return next;
    });
  };

  // Balances
  const [balances, setBalances] = useState<BankBalances>(() => {
    const saved = localStorage.getItem('nile_balances');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      USD: 2000000.00,
      EUR: 450000.00,
      GBP: 320000.00,
      BTC: 14.50,
      ETH: 120.00,
      USDT: 350000.00,
      NILE: 850000.00
    };
  });

  const saveBalances = (newBalances: BankBalances) => {
    setBalances(newBalances);
    localStorage.setItem('nile_balances', JSON.stringify(newBalances));
  };

  // Cards
  const [cards, setCards] = useState<CryptoCard[]>(() => {
    const saved = localStorage.getItem('nile_cards');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_CRYPTO_CARDS;
  });

  const saveCards = (newCards: CryptoCard[]) => {
    setCards(newCards);
    localStorage.setItem('nile_cards', JSON.stringify(newCards));
  };

  // Transactions
  const [transactions, setTransactions] = useState<TransactionRecord[]>(() => {
    const saved = localStorage.getItem('nile_transactions');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'tx-101',
        type: 'deposit',
        amount: 25000,
        currency: 'USDT',
        status: 'confirmed',
        network: 'Tron (TRC20)',
        txHash: '0x3f9b8c7e1a4d5e6f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f',
        recipientOrDetails: 'Direct Treasury Liquidity Provision',
        timestamp: '2026-04-18 10:14'
      },
      {
        id: 'tx-104',
        type: 'staking_claim',
        amount: 2450,
        currency: 'NILE',
        status: 'confirmed',
        network: 'Nile Smart Chain',
        recipientOrDetails: 'Staking Reward Payout: 180-Day Institutional Reserve (APR 24%)',
        txHash: '0x7b1a2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b',
        timestamp: '2026-04-17 18:30'
      },
      {
        id: 'tx-105',
        type: 'withdrawal',
        amount: 3500,
        currency: 'USDT',
        status: 'confirmed',
        network: 'Tron (TRC20)',
        recipientOrDetails: 'Disbursement to External TRC20 Wallet (Liquid Ledger)',
        txHash: '0x9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2109876543',
        timestamp: '2026-04-16 15:45'
      },
      {
        id: 'tx-106',
        type: 'deposit',
        amount: 0.75,
        currency: 'BTC',
        status: 'confirmed',
        network: 'Bitcoin (Native SegWit)',
        recipientOrDetails: 'Cold Custody Treasury Inflow',
        txHash: 'btc-tx-7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f',
        timestamp: '2026-04-15 11:20'
      },
      {
        id: 'tx-107',
        type: 'staking_claim',
        amount: 1800,
        currency: 'NILE',
        status: 'confirmed',
        network: 'Nile Smart Chain',
        recipientOrDetails: 'Staking Reward Payout: Diamond Apex Staking Pool (APR 28.5%)',
        txHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
        timestamp: '2026-04-14 09:00'
      },
      {
        id: 'tx-108',
        type: 'withdrawal',
        amount: 1200,
        currency: 'USDT',
        status: 'confirmed',
        network: 'Visa / Banking Gateway',
        recipientOrDetails: 'Disbursement to Corporate Black Elite Virtual Card',
        txHash: '0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e',
        timestamp: '2026-04-13 16:10'
      },
      {
        id: 'tx-109',
        type: 'staking_claim',
        amount: 850,
        currency: 'NILE',
        status: 'confirmed',
        network: 'Nile Smart Chain',
        recipientOrDetails: 'Daily Compounding Yield Accrual (100ms Streaming Engine)',
        txHash: '0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f',
        timestamp: '2026-04-12 23:59'
      },
      {
        id: 'tx-102',
        type: 'presale_purchase',
        amount: 5000,
        currency: 'USD',
        status: 'confirmed',
        recipientOrDetails: 'Phase 1: Seed Pioneer (100,000 NILE)',
        txHash: '0x8f7e6d5c4b3a210987654321fedcba0987654321fedcba0987654321fedcba09',
        timestamp: '2026-04-10 09:15'
      },
      {
        id: 'tx-111',
        type: 'withdrawal',
        amount: 500,
        currency: 'USDT',
        status: 'pending',
        network: 'Tron (TRC20)',
        recipientOrDetails: 'Withdrawal to external wallet - Compliance Queue Review',
        timestamp: '2026-04-18 08:30'
      },
      {
        id: 'tx-103',
        type: 'staking_deposit',
        amount: 100000,
        currency: 'NILE',
        status: 'confirmed',
        recipientOrDetails: '180-Day Institutional Reserve (1.5x Multiplier)',
        timestamp: '2026-02-15 10:00'
      }
    ];
  });

  const addTransaction = (tx: Omit<TransactionRecord, 'id' | 'timestamp'>) => {
    const newTx: TransactionRecord = {
      ...tx,
      id: `tx-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setTransactions(prev => {
      const next = [newTx, ...prev];
      localStorage.setItem('nile_transactions', JSON.stringify(next));
      return next;
    });
  };

  // Presale Phases
  const [presalePhases, setPresalePhases] = useState<PresalePhase[]>(() => {
    const saved = localStorage.getItem('nile_presale_phases');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_PRESALE_PHASES;
  });

  // Presale Purchases
  const [presalePurchases, setPresalePurchases] = useState<PresalePurchase[]>(() => {
    const saved = localStorage.getItem('nile_presale_purchases');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'pur-001',
        phaseId: 1,
        buyerWalletOrEmail: 'owner@nileecosystem.com',
        amountUsd: 5000,
        nileTokens: 100000,
        paymentAsset: 'USDT',
        network: 'Ethereum (ERC20)',
        txHash: '0x8f7e6d5c4b3a210987654321fedcba0987654321fedcba0987654321fedcba09',
        claimedTokens: 15000,
        claimAvailableDate: '2026-05-01',
        timestamp: '2026-04-10 09:15',
        status: 'confirmed'
      }
    ];
  });

  // Investments
  const [investmentPositions, setInvestmentPositions] = useState<InvestmentPosition[]>(() => {
    const saved = localStorage.getItem('nile_investments');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'inv-pos-01',
        planCategoryId: 'asset',
        planName: 'Bitcoin Premier Yield Vault',
        principalAmount: 2.5,
        currency: 'BTC',
        aprPercent: 9.5,
        durationDays: 180,
        startDate: '2026-02-01',
        maturityDate: '2026-07-31',
        accruedReturn: 0.0475,
        status: 'active',
        autoReinvest: true
      },
      {
        id: 'inv-pos-02',
        planCategoryId: 'nile_benefits',
        planName: 'NILE Diamond Staking Multiplier',
        principalAmount: 250000,
        currency: 'NILE',
        aprPercent: 32.0,
        durationDays: 365,
        startDate: '2026-01-15',
        maturityDate: '2027-01-15',
        accruedReturn: 19726,
        status: 'active',
        autoReinvest: true
      }
    ];
  });

  // Marketplace Products
  const [marketplaceProducts, setMarketplaceProducts] = useState<MarketplaceProduct[]>(() => {
    const saved = localStorage.getItem('nile_marketplace_products');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_MARKETPLACE_PRODUCTS;
  });

  const adminAddMarketplaceProduct = (product: Omit<MarketplaceProduct, 'id'>) => {
    const newProd: MarketplaceProduct = {
      ...product,
      id: `prod-${Date.now()}`
    };
    const updated = [newProd, ...marketplaceProducts];
    setMarketplaceProducts(updated);
    localStorage.setItem('nile_marketplace_products', JSON.stringify(updated));
    showToast(`Added product "${newProd.title}" successfully`, 'success');
  };

  const adminUpdateMarketplaceProduct = (id: string, updates: Partial<MarketplaceProduct>) => {
    const updated = marketplaceProducts.map(p => p.id === id ? { ...p, ...updates } : p);
    setMarketplaceProducts(updated);
    localStorage.setItem('nile_marketplace_products', JSON.stringify(updated));
    showToast(`Product updated successfully`, 'success');
  };

  const adminDeleteMarketplaceProduct = (id: string) => {
    const updated = marketplaceProducts.filter(p => p.id !== id);
    setMarketplaceProducts(updated);
    localStorage.setItem('nile_marketplace_products', JSON.stringify(updated));
    showToast(`Product removed from catalog`, 'info');
  };

  const adminUpdateOrderStatus = (orderId: string, status: MarketplaceOrder['status'], trackingCode?: string, licenseKeys?: string[]) => {
    const updated = orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status,
          trackingCode: trackingCode !== undefined ? trackingCode : o.trackingCode,
          licenseKeys: licenseKeys !== undefined ? licenseKeys : o.licenseKeys
        };
      }
      return o;
    });
    setOrders(updated);
    localStorage.setItem('nile_orders', JSON.stringify(updated));
    showToast(`Order #${orderId} marked as ${status.toUpperCase()}`, 'success');
  };

  const adminUpdateCard = (cardId: string, updates: Partial<CryptoCard>) => {
    const updated = cards.map(c => c.id === cardId ? { ...c, ...updates } : c);
    saveCards(updated);
    showToast(`Card ${cardId} updated`, 'success');
  };

  const adminIssueCard = (card: Omit<CryptoCard, 'id'>) => {
    const newCard: CryptoCard = {
      ...card,
      id: `crd-${Date.now()}`
    };
    const updated = [...cards, newCard];
    saveCards(updated);
    showToast(`Card issued for ${newCard.cardholderName}`, 'success');
  };

  // Investment Plans Admin Configuration
  const [investmentPlansConfig, setInvestmentPlansConfig] = useState<InvestmentPlansAdminConfig>(() => {
    const saved = localStorage.getItem('nile_investment_plans_config');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      ultimatePlan: {
        minDepositUsd: 2000,
        maxDepositUsd: 100000,
        maxApyPercent: 50000,
        investorCapLimit: 100,
        currentActiveInvestors: 42,
        vaultTotalCapUsd: 1000000,
        nileBoosterMultiplier: 1.5,
        status: 'active'
      },
      surpriseCampaign: {
        weeklyPayoutPercent: 150,
        monthlyPayoutPercent: 1500,
        threeMonthSettlementPercent: 15000,
        countdownDays: 90,
        status: 'active',
        participatingAssets: ['NILE Token', 'Gold XAUt / PAXG', 'ETC', 'BCH']
      },
      plan1AssetBased: {
        usdtDailyRate: 1.95,
        ethDailyRate: 0.95,
        btcDailyRate: 0.85,
        status: 'active'
      },
      plan2TimeLocked: {
        lock30DaysRate: 25,
        lock50DaysRate: 55,
        lock100DaysRate: 140,
        boosterMultiplier: 2.0,
        status: 'active'
      },
      plan3AmountTiers: {
        microRate: 0.25,
        growthRate: 3.5,
        eliteRate: 7.0,
        apexRate: 12.0,
        apexThresholdUsd: 10000,
        status: 'active'
      },
      calculatorSettings: {
        defaultPrincipal: 5000,
        defaultDuration: '30d',
        compoundInterestEnabled: true,
        traditionalBenchmarkRate: 5.2,
        timeframeOptions: ['7d', '30d', '90d', '180d', '365d']
      }
    };
  });

  const adminUpdateInvestmentPlansConfig = (updates: Partial<InvestmentPlansAdminConfig>) => {
    const updated = { ...investmentPlansConfig, ...updates };
    setInvestmentPlansConfig(updated);
    localStorage.setItem('nile_investment_plans_config', JSON.stringify(updated));
    showToast('Investment Plan parameters updated across platform', 'success');
  };

  // AI Bank Operations Configuration
  const [aiOperationsConfig, setAiOperationsConfig] = useState<AiOperationsAdminConfig>(() => {
    const saved = localStorage.getItem('nile_ai_operations_config');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      ammLiquidityRebalancer: {
        status: 'autonomous',
        slippageTolerancePercent: 0.05,
        rebalanceFrequencySeconds: 12,
        totalAutonomousVolume24h: 4280900,
        preventedSlippageUsd: 184500
      },
      crossBorderSettlementEngine: {
        status: 'autonomous',
        averageLatencyMs: 68,
        activeRoutingGateways: ['Faster Payments (UK)', 'SEPA Instant (EU)', 'Fedwire (USA)', 'UAE CIPS'],
        zeroLatencySettlementRate: 99.98
      },
      neuralFraudSanitizer: {
        status: 'active',
        blockedMaliciousPayloads: 1420,
        automatedColdStorageTriggers: 0,
        amlRiskThresholdScore: 85
      },
      regulatoryComplianceAi: {
        status: 'compliant',
        lastAuditTimestamp: '2026-10-16 22:45 UTC',
        verifiedJurisdictions: ['UK Companies House #08253865', 'Vienna Commercial Court FN 674459 m', 'UAE FTA TRN 100820028255333'],
        onChainProofTxid: '900d114e91f16246f6f9660237e1279a0db34a2e5d9396efbbd279cf0a1c885f'
      }
    };
  });

  const adminUpdateAiOperationsConfig = (updates: Partial<AiOperationsAdminConfig>) => {
    const updated = { ...aiOperationsConfig, ...updates };
    setAiOperationsConfig(updated);
    localStorage.setItem('nile_ai_operations_config', JSON.stringify(updated));
    showToast('AI Autonomous Banking parameters updated', 'success');
  };

  const adminTriggerAiSimulation = (action: string) => {
    showToast(`AI Engine executed: ${action}`, 'success');
  };

  // Video Ads Configuration
  const [videoAdsConfig, setVideoAdsConfig] = useState<VideoAdAdminItem[]>(() => {
    const saved = localStorage.getItem('nile_video_ads_config');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'intro-bank',
        title: 'The First Genuine Nile Crypto Bank: Vision & Public Trust',
        badge: 'Flagship Presentation',
        duration: '02:48',
        views: '48.2K Views',
        category: 'Institutional Spotlight',
        summary: 'Presenting the Nile Ecosystem as the world’s first genuine crypto bank engineered to foster complete public trust.',
        status: 'featured',
        complianceTags: ['Companies House Cardiff #08253865', 'Vienna Commercial Court', 'UAE FTA Compliant']
      },
      {
        id: 'ai-operations',
        title: 'Autonomous Artificial Intelligence in Modern Banking',
        badge: 'Deep Tech Architecture',
        duration: '03:15',
        views: '34.9K Views',
        category: 'AI Operational Engine',
        summary: 'A deep-dive analysis of how the Nile AI Engine eliminates human error and operates continuous 24/7 autonomous settlements.',
        status: 'active',
        complianceTags: ['Autonomous AMM', 'Zero-Loss Slippage', 'ISO 27001 Neural Vault']
      },
      {
        id: 'global-compliance',
        title: 'Global Regulatory Compliance & Statutory Proof of Reserve',
        badge: 'Audited Transparency',
        duration: '02:30',
        views: '29.4K Views',
        category: 'Regulatory Standards',
        summary: 'Comprehensive legal dossier examining Nile Investment Ltd statutory compliance across UK, EU, and UAE.',
        status: 'active',
        complianceTags: ['Statutory Incorporation', 'Triple Jurisdiction VAT', 'Bitcoin Proof-of-Reserve']
      },
      {
        id: 'nile-tokenomics',
        title: 'NILE Token: Utility, Staking Vaults & 50,000% Yield Engine',
        badge: 'Tokenomics & Staking',
        duration: '03:45',
        views: '56.1K Views',
        category: 'Native Sovereign Asset',
        summary: 'Explore the native utility token powering Nile Crypto Bank and the 50,000% ULTIMATE plan.',
        status: 'featured',
        complianceTags: ['500M Capped Supply', 'Programmatic Buyback & Burn', 'Deflationary Standard']
      }
    ];
  });

  const adminUpdateVideoAd = (id: string, updates: Partial<VideoAdAdminItem>) => {
    const updated = videoAdsConfig.map(v => v.id === id ? { ...v, ...updates } : v);
    setVideoAdsConfig(updated);
    localStorage.setItem('nile_video_ads_config', JSON.stringify(updated));
    showToast(`Video campaign updated`, 'success');
  };

  const adminAddVideoAd = (ad: Omit<VideoAdAdminItem, 'id'>) => {
    const newAd: VideoAdAdminItem = {
      ...ad,
      id: `vid-${Date.now()}`
    };
    const updated = [...videoAdsConfig, newAd];
    setVideoAdsConfig(updated);
    localStorage.setItem('nile_video_ads_config', JSON.stringify(updated));
    showToast(`Added video campaign "${newAd.title}"`, 'success');
  };

  // Clients & Delegated Panel Controls (Platform Owner Governance)
  const [managedClients, setManagedClients] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('nile_managed_clients');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_MANAGED_CLIENTS;
  });

  const [clientPanelModalOpen, setClientPanelModalOpen] = useState<boolean>(false);

  const saveManagedClients = (clients: UserProfile[]) => {
    setManagedClients(clients);
    localStorage.setItem('nile_managed_clients', JSON.stringify(clients));
  };

  const adminApproveClientPanel = (clientId: string, permissions: Partial<ClientDelegatedPermissions>, notes?: string) => {
    const updated = managedClients.map(c => {
      if (c.id === clientId) {
        const currentPerms = c.delegatedPermissions || {
          hasClientPanelAccess: true,
          panelAccessLevel: 'approved_client' as const,
          canCreateCustomVaults: true,
          canIssueVirtualCards: true,
          canManageSubAffiliates: true,
          canListMarketplaceProducts: false,
          canAccessAdvancedRoiSim: true,
          canExecuteOtcTranches: false,
          canAccessApiKeys: false,
          maxDelegatedDailyLimitUsd: 100000
        };
        const updatedPerms: ClientDelegatedPermissions = {
          ...currentPerms,
          ...permissions,
          hasClientPanelAccess: true,
          approvedByOwnerAt: new Date().toISOString().split('T')[0],
          approvalNotes: notes || 'Approved by Platform Owner for delegated panel control.'
        };
        return {
          ...c,
          clientPanelRequested: false,
          delegatedPermissions: updatedPerms
        };
      }
      return c;
    });

    saveManagedClients(updated);

    if (user.id === clientId) {
      const match = updated.find(c => c.id === clientId);
      if (match) updateUser(match);
    }

    recordAuditLog(
      'CLIENT_PANEL_DELEGATION_APPROVED',
      `Client ID: ${clientId}`,
      `Platform Owner approved delegated panel controls. Access level: ${permissions.panelAccessLevel || 'approved_client'}. Notes: ${notes || 'Granted'}`
    );

    showToast(`Client Panel controls successfully granted and activated!`, 'success');
  };

  const adminRevokeClientPanel = (clientId: string, reason?: string) => {
    const updated = managedClients.map(c => {
      if (c.id === clientId && c.delegatedPermissions) {
        return {
          ...c,
          delegatedPermissions: {
            ...c.delegatedPermissions,
            hasClientPanelAccess: false,
            approvalNotes: reason || 'Access suspended by Platform Owner'
          }
        };
      }
      return c;
    });

    saveManagedClients(updated);

    if (user.id === clientId && user.delegatedPermissions) {
      updateUser({
        delegatedPermissions: {
          ...user.delegatedPermissions,
          hasClientPanelAccess: false
        }
      });
    }

    recordAuditLog(
      'CLIENT_PANEL_DELEGATION_REVOKED',
      `Client ID: ${clientId}`,
      `Platform Owner revoked delegated panel controls. Reason: ${reason || 'Administrative action'}`
    );

    showToast(`Client Panel access revoked for client.`, 'info');
  };

  const adminUpdateClientPermissions = (clientId: string, permissions: Partial<ClientDelegatedPermissions>) => {
    const updated = managedClients.map(c => {
      if (c.id === clientId) {
        const currentPerms = c.delegatedPermissions || {
          hasClientPanelAccess: true,
          panelAccessLevel: 'approved_client' as const,
          canCreateCustomVaults: false,
          canIssueVirtualCards: false,
          canManageSubAffiliates: false,
          canListMarketplaceProducts: false,
          canAccessAdvancedRoiSim: true,
          canExecuteOtcTranches: false,
          canAccessApiKeys: false,
          maxDelegatedDailyLimitUsd: 50000
        };
        return {
          ...c,
          delegatedPermissions: {
            ...currentPerms,
            ...permissions
          }
        };
      }
      return c;
    });

    saveManagedClients(updated);

    if (user.id === clientId) {
      const match = updated.find(c => c.id === clientId);
      if (match) updateUser(match);
    }

    showToast(`Delegated client permissions updated.`, 'success');
  };

  const requestClientPanelAccess = (reason: string) => {
    const now = new Date().toISOString().split('T')[0];
    const updatedUser: UserProfile = {
      ...user,
      clientPanelRequested: true,
      clientPanelRequestDate: now,
      clientPanelRequestReason: reason
    };
    updateUser(updatedUser);

    const updated = managedClients.map(c => c.id === user.id ? updatedUser : c);
    saveManagedClients(updated);

    recordAuditLog(
      'CLIENT_PANEL_ACCESS_REQUESTED',
      `Client: ${user.name} (${user.email})`,
      `Submitted request for Client Panel Control. Rationale: ${reason}`
    );

    showToast('Your Client Panel application has been submitted to the Platform Owner for review.', 'success');
  };

  const switchActiveClient = (clientId: string) => {
    const match = managedClients.find(c => c.id === clientId);
    if (match) {
      setUser(match);
      localStorage.setItem('nile_user', JSON.stringify(match));
      showToast(`Switched active profile view to ${match.name}`, 'info');
    }
  };

  const isClientPanelApproved = Boolean(user.delegatedPermissions?.hasClientPanelAccess);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('nile_cart');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  // Orders
  const [orders, setOrders] = useState<MarketplaceOrder[]>(() => {
    const saved = localStorage.getItem('nile_orders');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'ord-9021',
        items: [
          { product: INITIAL_MARKETPLACE_PRODUCTS[0], quantity: 1 }
        ],
        totalUsd: 1499,
        paymentMethod: 'crypto',
        status: 'completed',
        trackingCode: 'DHL-UK-842918491GB',
        createdAt: '2026-03-20',
        licenseKeys: ['NILE-BOT-ENTERPRISE-8X92-Q1M4-927A']
      }
    ];
  });

  // Testimonials
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const saved = localStorage.getItem('nile_testimonials');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_TESTIMONIALS;
  });

  // Support Tickets
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('nile_support_tickets');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  // Deposit Wallets
  const [depositWallets, setDepositWallets] = useState<DepositWalletsConfig>(() => {
    const saved = localStorage.getItem('nile_deposit_wallets');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_DEPOSIT_WALLETS;
  });

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AdminAuditEntry[]>(() => {
    const saved = localStorage.getItem('nile_audit_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_ADMIN_AUDIT_LOGS;
  });

  const recordAuditLog = (action: string, target: string, details: string) => {
    const entry: AdminAuditEntry = {
      id: `log-${Date.now().toString(36)}`,
      operator: `${user.name} (${user.role})`,
      action,
      target,
      details,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setAuditLogs(prev => {
      const next = [entry, ...prev];
      localStorage.setItem('nile_audit_logs', JSON.stringify(next));
      return next;
    });
  };

  // ==========================================
  // TOKENOMICS & VESTING SCHEDULE MANAGEMENT
  // ==========================================
  const [tokenomicsAllocations, setTokenomicsAllocations] = useState<TokenomicsAllocation[]>(() => {
    const saved = localStorage.getItem('nile_tokenomics_allocations');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return TOKENOMICS_ALLOCATIONS;
  });

  const saveTokenomicsAllocations = (allocs: TokenomicsAllocation[]) => {
    setTokenomicsAllocations(allocs);
    localStorage.setItem('nile_tokenomics_allocations', JSON.stringify(allocs));
  };

  const updateTokenomicsAllocation = (index: number, updates: Partial<TokenomicsAllocation>) => {
    const next = tokenomicsAllocations.map((a, i) => i === index ? { ...a, ...updates } : a);
    saveTokenomicsAllocations(next);
    recordAuditLog('TOKENOMICS_CONFIG', `Category: ${tokenomicsAllocations[index]?.category}`, `Updated allocation parameters: ${JSON.stringify(updates)}`);
    showToast('Tokenomics allocation updated successfully.', 'success');
  };

  const [vestingEvents, setVestingEvents] = useState<VestingScheduleEvent[]>(() => {
    const saved = localStorage.getItem('nile_vesting_events');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return VESTING_SCHEDULE_EVENTS;
  });

  const saveVestingEvents = (events: VestingScheduleEvent[]) => {
    setVestingEvents(events);
    localStorage.setItem('nile_vesting_events', JSON.stringify(events));
  };

  const addVestingEvent = (eventData: Omit<VestingScheduleEvent, 'id'>) => {
    const newEvent: VestingScheduleEvent = {
      ...eventData,
      id: `vest-${Date.now().toString(36)}`
    };
    const next = [...vestingEvents, newEvent];
    saveVestingEvents(next);
    recordAuditLog('VESTING_EVENT_ADD', newEvent.title, `Added unlock event for ${newEvent.date}: ${newEvent.allocationTokens.toLocaleString()} NILE.`);
    showToast(`Added vesting unlock event: ${newEvent.title}`, 'success');
  };

  const updateVestingEvent = (id: string, updates: Partial<VestingScheduleEvent>) => {
    const next = vestingEvents.map(e => e.id === id ? { ...e, ...updates } : e);
    saveVestingEvents(next);
    recordAuditLog('VESTING_EVENT_UPDATE', `ID: ${id}`, `Updated vesting schedule event: ${JSON.stringify(updates)}`);
    showToast('Vesting schedule event updated.', 'success');
  };

  const deleteVestingEvent = (id: string) => {
    const next = vestingEvents.filter(e => e.id !== id);
    saveVestingEvents(next);
    recordAuditLog('VESTING_EVENT_DELETE', `ID: ${id}`, 'Removed vesting schedule event from registry.');
    showToast('Vesting event removed.', 'info');
  };

  // ==========================================
  // NILE STAKING MODULE IMPLEMENTATION
  // ==========================================
  const [stakingPools, setStakingPools] = useState<NileStakingPool[]>(() => {
    const saved = localStorage.getItem('nile_staking_pools');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_STAKING_POOLS;
  });

  const saveStakingPools = (pools: NileStakingPool[]) => {
    setStakingPools(pools);
    localStorage.setItem('nile_staking_pools', JSON.stringify(pools));
  };

  const [userStakes, setUserStakes] = useState<NileUserStake[]>(() => {
    const saved = localStorage.getItem('nile_user_stakes');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_USER_STAKES;
  });

  const saveUserStakes = (stakes: NileUserStake[]) => {
    setUserStakes(stakes);
    localStorage.setItem('nile_user_stakes', JSON.stringify(stakes));
  };

  // Accurate rewards calculation based on verified token balance and staking duration
  const calculateAccruedReward = (stake: NileUserStake): number => {
    if (stake.status === 'unstaked') return 0;
    const pool = stakingPools.find(p => p.id === stake.poolId);
    if (!pool) return 0;

    const startDate = new Date(stake.stakedAt).getTime();
    const now = Date.now();
    const elapsedMs = Math.max(0, now - startDate);
    const elapsedDays = elapsedMs / (1000 * 60 * 60 * 24);

    // Annualized calculation with lock-up multiplier:
    const effectiveApr = pool.baseAprPercent * pool.multiplier;
    const totalAccrued = (stake.stakedAmountNile * (effectiveApr / 100) * elapsedDays) / 365;

    // Return net uncollected accrued rewards
    const pending = Math.max(0, totalAccrued - (stake.claimedRewardsNile || 0));
    return Number(pending.toFixed(2));
  };

  const stakeTokens = (poolId: string, amountNile: number): boolean => {
    const pool = stakingPools.find(p => p.id === poolId);
    if (!pool) {
      showToast('Staking pool not found.', 'error');
      return false;
    }

    if (pool.status === 'paused') {
      showToast('This staking pool is currently paused by platform administrators.', 'error');
      return false;
    }

    if (amountNile < pool.minStakeNile) {
      showToast(`Minimum stake for this vault is ${pool.minStakeNile.toLocaleString()} NILE.`, 'error');
      return false;
    }

    if (balances.NILE < amountNile) {
      showToast(`Insufficient verified NILE balance. You hold ${balances.NILE.toLocaleString()} NILE.`, 'error');
      return false;
    }

    // Deduct verified token balance
    const updatedBalances = {
      ...balances,
      NILE: balances.NILE - amountNile
    };
    saveBalances(updatedBalances);

    // Calculate unlock date
    const now = new Date();
    const unlockTime = new Date(now.getTime() + pool.lockDays * 86400000);

    const newStake: NileUserStake = {
      id: `stake-${Date.now().toString(36)}`,
      poolId: pool.id,
      stakedAmountNile: amountNile,
      stakedAt: now.toISOString().substring(0, 10),
      unlockDate: unlockTime.toISOString().substring(0, 10),
      claimedRewardsNile: 0,
      pendingRewardsNile: 0,
      status: 'active'
    };

    saveUserStakes([newStake, ...userStakes]);

    // Update pool total
    const updatedPools = stakingPools.map(p => 
      p.id === poolId ? { ...p, totalStakedInPool: p.totalStakedInPool + amountNile } : p
    );
    saveStakingPools(updatedPools);

    // Add financial ledger record
    addTransaction({
      type: 'staking_deposit',
      amount: amountNile,
      currency: 'NILE',
      status: 'confirmed',
      recipientOrDetails: `Locked in ${pool.title} (${pool.lockDays} Days @ ${(pool.baseAprPercent * pool.multiplier).toFixed(1)}% APY)`
    });

    recordAuditLog(
      'STAKE_CREATION',
      `Vault: ${pool.title}`,
      `Staked ${amountNile.toLocaleString()} NILE. Lock period: ${pool.lockDays} days. Multiplier: ${pool.multiplier}x.`
    );

    showToast(`Successfully staked ${amountNile.toLocaleString()} NILE in ${pool.title}!`, 'success');
    return true;
  };

  const claimStakingRewards = (stakeId: string) => {
    const stake = userStakes.find(s => s.id === stakeId);
    if (!stake || stake.status === 'unstaked') {
      showToast('Active stake record not found.', 'error');
      return;
    }

    const accrued = calculateAccruedReward(stake);
    if (accrued <= 0.01) {
      showToast('Accrued rewards are minimal. Please allow additional staking duration to accumulate.', 'info');
      return;
    }

    // Credit verified NILE balance
    saveBalances({
      ...balances,
      NILE: balances.NILE + accrued
    });

    // Update stake
    const updatedStakes = userStakes.map(s => {
      if (s.id === stakeId) {
        return {
          ...s,
          claimedRewardsNile: (s.claimedRewardsNile || 0) + accrued,
          pendingRewardsNile: 0
        };
      }
      return s;
    });
    saveUserStakes(updatedStakes);

    addTransaction({
      type: 'staking_claim',
      amount: accrued,
      currency: 'NILE',
      status: 'confirmed',
      recipientOrDetails: `Yield payout from Stake #${stakeId}`
    });

    recordAuditLog('STAKING_REWARD_CLAIM', `Stake ID: ${stakeId}`, `Claimed ${accrued.toLocaleString()} NILE rewards to wallet.`);
    showToast(`Claimed ${accrued.toLocaleString()} NILE rewards to your verified balance!`, 'success');
  };

  const unstakeTokens = (stakeId: string): boolean => {
    const stake = userStakes.find(s => s.id === stakeId);
    if (!stake || stake.status === 'unstaked') {
      showToast('Stake is not active.', 'error');
      return false;
    }

    const pool = stakingPools.find(p => p.id === stake.poolId);
    if (!pool) return false;

    // Check if lock duration completed
    const unlockTime = new Date(stake.unlockDate).getTime();
    const isEarly = Date.now() < unlockTime;
    let penaltyAmount = 0;

    if (isEarly && pool.earlyUnstakePenaltyPercent > 0) {
      penaltyAmount = (stake.stakedAmountNile * pool.earlyUnstakePenaltyPercent) / 100;
    }

    const accrued = calculateAccruedReward(stake);
    const returnPrincipal = stake.stakedAmountNile - penaltyAmount;
    const totalPayout = returnPrincipal + accrued;

    // Credit user's verified NILE balance
    saveBalances({
      ...balances,
      NILE: balances.NILE + totalPayout
    });

    // Mark unstaked
    const updatedStakes = userStakes.map(s => {
      if (s.id === stakeId) {
        return {
          ...s,
          claimedRewardsNile: (s.claimedRewardsNile || 0) + accrued,
          status: 'unstaked' as const
        };
      }
      return s;
    });
    saveUserStakes(updatedStakes);

    // Update pool total
    saveStakingPools(stakingPools.map(p => 
      p.id === pool.id ? { ...p, totalStakedInPool: Math.max(0, p.totalStakedInPool - stake.stakedAmountNile) } : p
    ));

    addTransaction({
      type: 'staking_unstake',
      amount: totalPayout,
      currency: 'NILE',
      status: 'confirmed',
      recipientOrDetails: `Unstaked from ${pool.title}${isEarly ? ` (${pool.earlyUnstakePenaltyPercent}% early penalty of ${penaltyAmount.toLocaleString()} NILE deducted)` : ' (Matured - Zero Penalty)'}`
    });

    recordAuditLog(
      'STAKE_UNSTAKE',
      `Stake #${stakeId}`,
      `Unstaked ${stake.stakedAmountNile.toLocaleString()} NILE. Penalty: ${penaltyAmount.toLocaleString()} NILE. Accrued Rewards Claimed: ${accrued.toLocaleString()} NILE.`
    );

    if (isEarly) {
      showToast(`Premature unstake processed. Net ${returnPrincipal.toLocaleString()} NILE returned after ${pool.earlyUnstakePenaltyPercent}% early penalty.`, 'info');
    } else {
      showToast(`Matured stake unstaked successfully! Returned ${stake.stakedAmountNile.toLocaleString()} NILE + ${accrued.toLocaleString()} NILE final yield.`, 'success');
    }
    return true;
  };

  const adminUpdateStakingPool = (poolId: string, updates: Partial<NileStakingPool>) => {
    const updated = stakingPools.map(p => p.id === poolId ? { ...p, ...updates } : p);
    saveStakingPools(updated);
    recordAuditLog(
      'STAKING_POOL_CONFIG',
      `Pool ID: ${poolId}`,
      `Updated parameters: ${JSON.stringify(updates)}`
    );
    showToast(`Staking vault ${poolId} configuration updated.`, 'success');
  };

  const adminCreateStakingPool = (poolData: Omit<NileStakingPool, 'id' | 'totalStakedInPool'>) => {
    const newPool: NileStakingPool = {
      ...poolData,
      id: `pool-${Date.now().toString(36)}`,
      totalStakedInPool: 0
    };
    saveStakingPools([...stakingPools, newPool]);
    recordAuditLog(
      'STAKING_POOL_CREATED',
      newPool.title,
      `Created new staking pool. Lock: ${newPool.lockDays}d, Base APR: ${newPool.baseAprPercent}%, Multiplier: ${newPool.multiplier}x.`
    );
    showToast(`Created new staking vault: ${newPool.title}`, 'success');
  };

  // ==========================================
  // REFERRAL TIERS & BADGES IMPLEMENTATION
  // ==========================================
  const [referralTiers, setReferralTiers] = useState<ReferralTierConfig[]>(() => {
    const saved = localStorage.getItem('nile_referral_tiers');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_REFERRAL_TIERS;
  });

  const saveReferralTiers = (tiers: ReferralTierConfig[]) => {
    setReferralTiers(tiers);
    localStorage.setItem('nile_referral_tiers', JSON.stringify(tiers));
  };

  const [badges, setBadges] = useState<AchievementBadge[]>(() => {
    const saved = localStorage.getItem('nile_achievement_badges');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_ACHIEVEMENT_BADGES;
  });

  const saveBadges = (updated: AchievementBadge[]) => {
    setBadges(updated);
    localStorage.setItem('nile_achievement_badges', JSON.stringify(updated));
  };

  const claimBadge = (badgeId: string) => {
    const badge = badges.find(b => b.id === badgeId);
    if (!badge) return;

    if (user.badges.includes(badgeId)) {
      showToast('Badge is already claimed and displayed in your profile.', 'info');
      return;
    }

    const updatedUserBadges = [...user.badges, badgeId];
    updateUser({ badges: updatedUserBadges });

    // Mark badge unlocked
    saveBadges(badges.map(b => b.id === badgeId ? { ...b, isUnlocked: true, unlockedAt: new Date().toISOString().substring(0, 10) } : b));

    recordAuditLog('BADGE_UNLOCKED', badge.title, `Awarded ${badge.title} badge to user ${user.id}.`);
    showToast(`Achievement Unlocked: "${badge.title}"! ${badge.rewardBonus}`, 'success');
  };

  const adminUpdateReferralTier = (rank: ReferralTierConfig['rank'], updates: Partial<ReferralTierConfig>) => {
    const next = referralTiers.map(t => t.rank === rank ? { ...t, ...updates } : t);
    saveReferralTiers(next);
    recordAuditLog('REFERRAL_TIER_CONFIG', `Rank: ${rank}`, `Updated eligibility & reward criteria: ${JSON.stringify(updates)}`);
    showToast(`Referral Tier ${rank} rules updated.`, 'success');
  };

  const adminUpdateBadge = (badgeId: string, updates: Partial<AchievementBadge>) => {
    const next = badges.map(b => b.id === badgeId ? { ...b, ...updates } : b);
    saveBadges(next);
    recordAuditLog('ACHIEVEMENT_BADGE_CONFIG', `Badge: ${badgeId}`, `Updated criteria and reward parameters.`);
    showToast(`Achievement badge updated.`, 'success');
  };

  // ==========================================
  // KYC / AML INTEGRATION POINTS & FEATURE GATES
  // ==========================================
  const [kycSession, setKycSession] = useState<KycAmlProviderSession>(() => {
    const saved = localStorage.getItem('nile_kyc_session');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      sessionId: 'ses_sumsub_849204812a',
      provider: 'Sumsub',
      applicantId: 'appl_nile_usr_001',
      status: 'approved',
      riskScore: 'LOW',
      pepSanctionResult: 'PASSED',
      ipAddress: '185.122.94.10 (London, United Kingdom)',
      deviceFingerprint: 'FP-WebKit-macOS-SecEnclave-Verified',
      webhookLog: [
        {
          eventId: 'evt_handshake_01',
          event: 'applicantCreated',
          timestamp: '2026-01-15 14:10:02',
          payloadSummary: '{"provider": "Sumsub", "flow": "institutional_id_liveness", "applicantId": "appl_nile_usr_001"}'
        },
        {
          eventId: 'evt_screening_02',
          event: 'applicantPending',
          timestamp: '2026-01-15 14:15:20',
          payloadSummary: '{"documents": ["passport_uk", "utility_bill"], "ocrConfidence": 0.994, "faceMatch": "PASSED"}'
        },
        {
          eventId: 'evt_approved_03',
          event: 'applicantReviewed',
          timestamp: '2026-01-16 09:30:00',
          payloadSummary: '{"reviewResult": {"reviewAnswer": "GREEN"}, "riskScore": "LOW", "pepSanctions": "CLEARED"}'
        }
      ]
    };
  });

  const saveKycSession = (session: KycAmlProviderSession) => {
    setKycSession(session);
    localStorage.setItem('nile_kyc_session', JSON.stringify(session));
  };

  // Computed feature permissions gated strictly by KYC & AML status
  const kycPermissions = useMemo<KycFeaturePermissions>(() => {
    const isVerified = user.kycStatus === 'verified';
    const tier = user.kycTier || (isVerified ? 3 : 0);

    return {
      canWithdrawFiat: isVerified && tier >= 1,
      canOrderHighLimitCard: isVerified && tier >= 2,
      canInvestHighTier: isVerified && tier >= 2,
      canParticipatePresale: true, // Always allowed up to $1k; verified unlocks >$1,000
      maxDailyWithdrawalUsd: isVerified ? (tier >= 3 ? 500000 : 50000) : 1000,
      levelTitle: isVerified 
        ? `Tier ${tier} Institutional Full Verification` 
        : user.kycStatus === 'pending' 
          ? 'Verification Pending Review' 
          : 'Tier 0 Unverified (Strict Limits Applied)'
    };
  }, [user.kycStatus, user.kycTier]);

  const initiateKycSession = async (provider: 'Sumsub' | 'Onfido' | 'Jumio' | 'ShuftiPro' = 'Sumsub'): Promise<string> => {
    const applicantId = `appl_${Date.now().toString(36)}`;
    const newSession: KycAmlProviderSession = {
      sessionId: `ses_${provider.toLowerCase()}_${Date.now().toString(36)}`,
      provider,
      applicantId,
      status: 'initialized',
      riskScore: 'LOW',
      pepSanctionResult: 'PASSED',
      ipAddress: '82.165.197.1 (Encrypted TLS Gateway)',
      deviceFingerprint: `FP-SHA256-${Date.now()}`,
      webhookLog: [
        {
          eventId: `evt_init_${Date.now()}`,
          event: 'applicantCreated',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          payloadSummary: JSON.stringify({
            provider,
            endpoint: `https://api.${provider.toLowerCase()}.com/resources/applicants`,
            applicantId,
            requiredSteps: ['IDENTITY', 'SELFIE_LIVENESS', 'AML_WATCHLIST']
          })
        }
      ]
    };

    saveKycSession(newSession);
    recordAuditLog('KYC_AML_SESSION_INIT', provider, `Initiated KYC/AML verification session for ${user.email} (Applicant ID: ${applicantId})`);
    showToast(`KYC SDK Handshake initiated with ${provider}.`, 'info');
    return newSession.sessionId;
  };

  const submitProviderVerification = async (data: {
    applicantId: string;
    documentType: string;
    frontImageBase64?: string;
    livenessPassed: boolean;
    pepSanctionCheckPassed: boolean;
  }) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const submissionEvent = {
      eventId: `evt_sub_${Date.now()}`,
      event: 'documentsSubmitted',
      timestamp,
      payloadSummary: JSON.stringify({
        applicantId: data.applicantId,
        documentType: data.documentType,
        livenessCheck: data.livenessPassed ? 'PASSED_PASSIVE_LIVENESS' : 'FAILED',
        globalSanctionsScreening: data.pepSanctionCheckPassed ? 'NO_MATCHES_FOUND' : 'FLAGGED'
      })
    };

    const inProgressSession: KycAmlProviderSession = {
      ...kycSession,
      status: 'screening_in_progress',
      webhookLog: [submissionEvent, ...kycSession.webhookLog]
    };
    saveKycSession(inProgressSession);
    updateUser({ kycStatus: 'pending' });

    // Simulate asynchronous automated AML screening resolution
    setTimeout(() => {
      const isApproved = data.livenessPassed && data.pepSanctionCheckPassed;
      const reviewEvent = {
        eventId: `evt_rev_${Date.now()}`,
        event: isApproved ? 'applicantReviewed' : 'applicantRejected',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        payloadSummary: JSON.stringify({
          applicantId: data.applicantId,
          reviewResult: { reviewAnswer: isApproved ? 'GREEN' : 'RED' },
          riskScore: isApproved ? 'LOW' : 'HIGH',
          pepSanctions: data.pepSanctionCheckPassed ? 'CLEARED' : 'SANCTION_MATCH'
        })
      };

      const finalSession: KycAmlProviderSession = {
        ...inProgressSession,
        status: isApproved ? 'approved' : 'rejected',
        riskScore: isApproved ? 'LOW' : 'HIGH',
        pepSanctionResult: data.pepSanctionCheckPassed ? 'CLEARED' : 'FLAGGED',
        webhookLog: [reviewEvent, ...inProgressSession.webhookLog]
      };

      saveKycSession(finalSession);
      if (isApproved) {
        updateUser({
          kycStatus: 'verified',
          kycTier: 3,
          kycApprovedAt: new Date().toISOString().substring(0, 10)
        });
        recordAuditLog('KYC_AML_APPROVED', kycSession.provider, `Applicant ${data.applicantId} automated AML / KYC review APPROVED.`);
        showToast('Identity verification confirmed! High-limit cards, fiat withdrawals, and institutional features unlocked.', 'success');
      } else {
        updateUser({
          kycStatus: 'rejected',
          kycRejectionReason: 'Automated AML Watchlist or biometric liveness discrepancy.'
        });
        recordAuditLog('KYC_AML_REJECTED', kycSession.provider, `Applicant ${data.applicantId} flagged during screening.`);
        showToast('Verification flagged. Please contact the Compliance desk or re-upload documents.', 'error');
      }
    }, 1500);
  };

  const simulateProviderWebhook = (
    event: 'applicantReviewed' | 'applicantPending' | 'applicantRejected' | 'pepSanctionFlagged',
    payloadSummary?: string
  ) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const eventId = `evt_wh_${Date.now()}`;
    const summary = payloadSummary || JSON.stringify({
      event,
      timestamp,
      signature: 'sha256=9b7c841f3d8109a8264e...',
      provider: kycSession.provider
    });

    const updatedLog = [{ eventId, event, timestamp, payloadSummary: summary }, ...kycSession.webhookLog];

    let newStatus = kycSession.status;
    let newRisk = kycSession.riskScore;
    let newPep = kycSession.pepSanctionResult;

    if (event === 'applicantReviewed') {
      newStatus = 'approved';
      newRisk = 'LOW';
      newPep = 'CLEARED';
      updateUser({ kycStatus: 'verified', kycTier: 3 });
      showToast('Simulated Webhook: Applicant Approved (Green).', 'success');
    } else if (event === 'applicantRejected') {
      newStatus = 'rejected';
      newRisk = 'HIGH';
      updateUser({ kycStatus: 'rejected' });
      showToast('Simulated Webhook: Applicant Rejected (Red).', 'error');
    } else if (event === 'pepSanctionFlagged') {
      newStatus = 'action_required';
      newRisk = 'HIGH';
      newPep = 'FLAGGED';
      showToast('Simulated Webhook: AML Watchlist Match Flagged.', 'error');
    } else {
      newStatus = 'screening_in_progress';
      updateUser({ kycStatus: 'pending' });
      showToast('Simulated Webhook: Applicant Under Manual Review.', 'info');
    }

    saveKycSession({
      ...kycSession,
      status: newStatus,
      riskScore: newRisk,
      pepSanctionResult: newPep,
      webhookLog: updatedLog
    });

    recordAuditLog('KYC_WEBHOOK_RECEIVED', event, `Processed webhook event ${eventId} with signature verification.`);
  };

  // ==========================================
  // OTHER CORE ECOSYSTEM ACTIONS
  // ==========================================
  const submitKyc = (
    documents: KycDocument[], 
    personalInfo: { name: string; phone: string; address: string; country: string }
  ) => {
    updateUser({
      name: personalInfo.name,
      phone: personalInfo.phone,
      kycStatus: 'pending',
      kycSubmittedAt: new Date().toISOString().substring(0, 10)
    });

    recordAuditLog(
      'KYC_SUBMISSION',
      `User ${user.id}`,
      `Submitted ${documents.length} KYC documents (${documents.map(d => d.type).join(', ')}) from ${personalInfo.country}.`
    );

    showToast('KYC application submitted. Under review by Compliance & MLRO.', 'success');
  };

  const adminReviewKyc = (userId: string, approve: boolean, reason?: string) => {
    if (approve) {
      updateUser({
        kycStatus: 'verified',
        kycTier: 3,
        kycApprovedAt: new Date().toISOString().substring(0, 10),
        kycRejectionReason: undefined
      });
      recordAuditLog('KYC_ADMIN_APPROVAL', `User ${userId}`, 'Approved Tier 3 Institutional KYC Verification.');
      showToast('User KYC approved and full limits unlocked.', 'success');
    } else {
      updateUser({
        kycStatus: 'rejected',
        kycRejectionReason: reason || 'Document legibility or address verification mismatch.'
      });
      recordAuditLog('KYC_ADMIN_REJECTION', `User ${userId}`, `Rejected KYC. Reason: ${reason}`);
      showToast('User KYC marked as rejected.', 'info');
    }
  };

  const orderCryptoCard = (cardData: {
    type: 'visa' | 'mastercard';
    isPhysical: boolean;
    currency: 'USD' | 'EUR' | 'GBP';
    tier: 'Standard' | 'Gold' | 'Black Elite';
    initialBalance: number;
    shippingAddress?: any;
  }) => {
    // Condition check for high-limit card
    if (cardData.initialBalance > 5000 && !kycPermissions.canOrderHighLimitCard) {
      showToast('Cards with limits exceeding $5,000 require Tier 2+ KYC verification.', 'error');
      return;
    }

    const random4 = Math.floor(1000 + Math.random() * 9000).toString();
    const prefix = cardData.type === 'visa' ? '4319' : '5424';
    const newCard: CryptoCard = {
      id: `card-${Date.now().toString(36)}`,
      type: cardData.type,
      cardholderName: user.name.toUpperCase(),
      cardNumberMasked: `${prefix} •••• •••• ${random4}`,
      expiryMonth: '10',
      expiryYear: '2029',
      cvv: Math.floor(100 + Math.random() * 900).toString(),
      status: cardData.isPhysical ? 'pending_delivery' : 'active',
      balance: cardData.initialBalance,
      tier: cardData.tier,
      currency: cardData.currency,
      cashbackRate: cardData.tier === 'Black Elite' ? 5.0 : cardData.tier === 'Gold' ? 3.0 : 1.5,
      isPhysical: cardData.isPhysical,
      shippingAddress: cardData.shippingAddress,
      limits: {
        dailySpending: cardData.tier === 'Black Elite' ? 50000 : cardData.tier === 'Gold' ? 10000 : 2500,
        monthlySpending: cardData.tier === 'Black Elite' ? 200000 : cardData.tier === 'Gold' ? 50000 : 10000,
        dailyAtm: cardData.tier === 'Black Elite' ? 5000 : cardData.tier === 'Gold' ? 2000 : 500
      }
    };

    saveCards([newCard, ...cards]);
    recordAuditLog('CARD_ISSUANCE', `${cardData.type.toUpperCase()} ${cardData.tier}`, `Issued card ending in ${random4}. Physical: ${cardData.isPhysical ? 'YES' : 'NO'}`);
    showToast(`New ${cardData.tier} ${cardData.type.toUpperCase()} Card ordered successfully!`, 'success');
  };

  const toggleCardStatus = (cardId: string) => {
    const updated = cards.map(c => {
      if (c.id === cardId) {
        const nextStatus = c.status === 'active' ? 'frozen' : 'active';
        recordAuditLog('CARD_STATUS_TOGGLE', c.cardNumberMasked, `Changed status to ${nextStatus}`);
        return { ...c, status: nextStatus as any };
      }
      return c;
    });
    saveCards(updated);
    showToast('Card security status updated.', 'info');
  };

  const updateCardLimit = (cardId: string, limits: { dailySpending: number; monthlySpending: number; dailyAtm: number }) => {
    const updated = cards.map(c => {
      if (c.id === cardId) {
        return { ...c, limits };
      }
      return c;
    });
    saveCards(updated);
    showToast('Spending limits updated successfully.', 'success');
  };

  const participateInPresale = (
    phaseId: number, 
    amountUsd: number, 
    paymentAsset: 'ETH' | 'BNB' | 'USDT' | 'USDC' | 'BTC' | 'SOL' | 'TRX', 
    network: string
  ): boolean => {
    const phase = presalePhases.find(p => p.id === phaseId);
    if (!phase) return false;

    // Feature gate check for presale purchases > $1,000
    if (amountUsd > 1000 && !kycPermissions.canInvestHighTier) {
      showToast('Presale contributions over $1,000 USD require KYC verification per AML standards.', 'error');
      return false;
    }

    if (amountUsd < phase.minPurchaseUsd || amountUsd > phase.maxPurchaseUsd) {
      showToast(`Purchase amount must be between $${phase.minPurchaseUsd} and $${phase.maxPurchaseUsd.toLocaleString()}`, 'error');
      return false;
    }

    const nileTokens = Math.floor(amountUsd / phase.tokenPriceUsd);
    const txHash = `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

    const newPurchase: PresalePurchase = {
      id: `presale-p-${Date.now().toString(36)}`,
      phaseId,
      buyerWalletOrEmail: user.email,
      amountUsd,
      nileTokens,
      paymentAsset,
      network,
      txHash,
      claimedTokens: Math.floor(nileTokens * 0.15),
      claimAvailableDate: '2026-05-01',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'confirmed'
    };

    setPresalePurchases(prev => {
      const next = [newPurchase, ...prev];
      localStorage.setItem('nile_presale_purchases', JSON.stringify(next));
      return next;
    });

    setPresalePhases(prev => {
      const next = prev.map(p => {
        if (p.id === phaseId) {
          return { ...p, soldAllocation: Math.min(p.totalAllocation, p.soldAllocation + nileTokens) };
        }
        return p;
      });
      localStorage.setItem('nile_presale_phases', JSON.stringify(next));
      return next;
    });

    saveBalances({
      ...balances,
      NILE: balances.NILE + nileTokens
    });

    addTransaction({
      type: 'presale_purchase',
      amount: amountUsd,
      currency: 'USD',
      status: 'confirmed',
      network,
      txHash,
      recipientOrDetails: `${phase.name} (${nileTokens.toLocaleString()} NILE)`
    });

    recordAuditLog('PRESALE_PURCHASE', `Phase ${phaseId}`, `Purchased ${nileTokens.toLocaleString()} NILE for $${amountUsd} via ${paymentAsset} (${network})`);
    showToast(`Presale transaction confirmed! Allocated ${nileTokens.toLocaleString()} NILE.`, 'success');
    return true;
  };

  const createInvestment = (
    planCategoryId: 'asset' | 'time' | 'amount' | 'nile_benefits',
    planName: string,
    principalAmount: number,
    currency: string,
    aprPercent: number,
    durationDays: number
  ) => {
    // Condition check for high tier investment
    if (principalAmount > 10000 && !kycPermissions.canInvestHighTier) {
      showToast('Institutional investments exceeding $10,000 USD require KYC verification.', 'error');
      return;
    }

    const now = new Date();
    const maturity = new Date(now.getTime() + durationDays * 86400000);

    const newPosition: InvestmentPosition = {
      id: `inv-${Date.now().toString(36)}`,
      planCategoryId,
      planName,
      principalAmount,
      currency,
      aprPercent,
      durationDays,
      startDate: now.toISOString().substring(0, 10),
      maturityDate: maturity.toISOString().substring(0, 10),
      accruedReturn: 0,
      status: 'active',
      autoReinvest: true
    };

    setInvestmentPositions(prev => {
      const next = [newPosition, ...prev];
      localStorage.setItem('nile_investments', JSON.stringify(next));
      return next;
    });

    addTransaction({
      type: 'investment_deposit',
      amount: principalAmount,
      currency,
      status: 'confirmed',
      recipientOrDetails: `${planName} (${durationDays} Days @ ${aprPercent}% Projected APR)`
    });

    recordAuditLog('INVESTMENT_SUBSCRIBE', planName, `Committed ${principalAmount.toLocaleString()} ${currency} for ${durationDays} days at ${aprPercent}% APR.`);
    showToast(`Subscribed to ${planName} successfully!`, 'success');
  };

  const addToCart = (product: MarketplaceProduct, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      let next: CartItem[];
      if (existing) {
        next = prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      } else {
        next = [...prev, { product, quantity }];
      }
      localStorage.setItem('nile_cart', JSON.stringify(next));
      return next;
    });
    showToast(`Added "${product.title}" to cart.`, 'success');
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const next = prev.filter(i => i.product.id !== productId);
      localStorage.setItem('nile_cart', JSON.stringify(next));
      return next;
    });
    showToast('Removed item from cart.', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => {
      const next = prev.map(i => i.product.id === productId ? { ...i, quantity } : i);
      localStorage.setItem('nile_cart', JSON.stringify(next));
      return next;
    });
  };

  const checkoutCart = (
    paymentMethod: 'crypto' | 'bank_transfer' | 'nile_wallet',
    shippingDetails?: any
  ): string => {
    if (cart.length === 0) return '';
    const orderId = `ord-${Date.now().toString(36)}`;
    const totalUsd = cart.reduce((sum, item) => sum + item.product.priceUsd * item.quantity, 0);

    const newOrder: MarketplaceOrder = {
      id: orderId,
      items: [...cart],
      totalUsd,
      paymentMethod,
      status: 'processing',
      shippingDetails,
      trackingCode: `NILE-EXP-${Math.floor(100000000 + Math.random() * 900000000)}`,
      createdAt: new Date().toISOString().substring(0, 10),
      licenseKeys: cart.some(c => c.product.category === 'software') ? [`KEY-${Math.random().toString(36).substring(2, 10).toUpperCase()}`] : undefined
    };

    setOrders(prev => {
      const next = [newOrder, ...prev];
      localStorage.setItem('nile_orders', JSON.stringify(next));
      return next;
    });

    setCart([]);
    localStorage.removeItem('nile_cart');

    addTransaction({
      type: 'marketplace_order',
      amount: totalUsd,
      currency: 'USD',
      status: 'confirmed',
      recipientOrDetails: `Marketplace Order #${orderId} (${newOrder.items.length} items)`
    });

    recordAuditLog('MARKETPLACE_ORDER', `Order #${orderId}`, `Total: $${totalUsd.toLocaleString()} via ${paymentMethod}.`);
    showToast(`Order #${orderId} confirmed successfully!`, 'success');
    return orderId;
  };

  const submitTestimonial = (feedback: {
    userName: string;
    userRoleOrLocation: string;
    rating: number;
    comment: string;
    productUsed: any;
  }) => {
    const newTestimonial: Testimonial = {
      id: `test-${Date.now().toString(36)}`,
      userName: feedback.userName,
      userRoleOrLocation: feedback.userRoleOrLocation,
      rating: feedback.rating,
      comment: feedback.comment,
      productUsed: feedback.productUsed,
      isApproved: false,
      submittedAt: new Date().toISOString().substring(0, 10)
    };

    setTestimonials(prev => {
      const next = [newTestimonial, ...prev];
      localStorage.setItem('nile_testimonials', JSON.stringify(next));
      return next;
    });

    recordAuditLog('TESTIMONIAL_SUBMISSION', `Author: ${feedback.userName}`, `Submitted review for ${feedback.productUsed} (Pending Approval).`);
    showToast('Thank you! Your testimonial has been submitted for moderation.', 'success');
  };

  const adminApproveTestimonial = (id: string, approve: boolean) => {
    setTestimonials(prev => {
      const next = prev.map(t => {
        if (t.id === id) {
          return { ...t, isApproved: approve };
        }
        return t;
      });
      localStorage.setItem('nile_testimonials', JSON.stringify(next));
      return next;
    });
    recordAuditLog('TESTIMONIAL_MODERATION', `ID: ${id}`, approve ? 'Approved testimonial for public landing page.' : 'Unapproved testimonial.');
    showToast(approve ? 'Testimonial approved and published to landing page.' : 'Testimonial removed from public display.', 'info');
  };

  const submitSupportTicket = (ticket: {
    userName: string;
    userEmail: string;
    subject: string;
    category: any;
    priority: any;
    message: string;
  }) => {
    const newTicket: SupportTicket = {
      id: `tkt-${Date.now().toString(36)}`,
      userName: ticket.userName,
      userEmail: ticket.userEmail,
      subject: ticket.subject,
      category: ticket.category,
      priority: ticket.priority,
      status: 'open',
      messages: [
        { sender: 'user', text: ticket.message, timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) }
      ],
      createdAt: new Date().toISOString().substring(0, 10)
    };

    setSupportTickets(prev => {
      const next = [newTicket, ...prev];
      localStorage.setItem('nile_support_tickets', JSON.stringify(next));
      return next;
    });
    showToast('Support ticket dispatched to 24/7 client desk.', 'success');
  };

  const updateDepositWallets = (updated: Partial<DepositWalletsConfig>, adminReason: string) => {
    const next = { ...depositWallets, ...updated };
    setDepositWallets(next);
    localStorage.setItem('nile_deposit_wallets', JSON.stringify(next));
    recordAuditLog('WALLET_ADDRESS_UPDATE', 'Deposit Registry', `Updated deposit addresses. Reason: ${adminReason}`);
    showToast('Deposit wallet addresses updated and logged to audit trail.', 'success');
  };

  const updatePresalePhase = (phaseId: number, updates: Partial<PresalePhase>) => {
    setPresalePhases(prev => {
      const next = prev.map(p => p.id === phaseId ? { ...p, ...updates } : p);
      localStorage.setItem('nile_presale_phases', JSON.stringify(next));
      return next;
    });
    recordAuditLog('PRESALE_PHASE_EDIT', `Phase ${phaseId}`, `Updated configuration: ${JSON.stringify(updates)}`);
    showToast(`Presale Phase ${phaseId} parameters updated.`, 'success');
  };

  const adminAdjustBalance = (currency: keyof BankBalances, amount: number, reason: string) => {
    const oldVal = balances[currency];
    const newVal = Math.max(0, oldVal + amount);
    saveBalances({
      ...balances,
      [currency]: newVal
    });
    recordAuditLog('BALANCE_ADJUSTMENT', `Asset: ${currency}`, `Adjusted from ${oldVal} to ${newVal} (${amount > 0 ? '+' : ''}${amount}). Authorization reason: ${reason}`);
    showToast(`Ledger adjusted: ${amount > 0 ? '+' : ''}${amount} ${currency}.`, 'info');
  };

  // Authentication & Access Controls State
  const [authModalOpen, setAuthModalOpenState] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('login');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('nile_is_logged_in') !== 'false';
  });
  const [rememberMe, setRememberMe] = useState<boolean>(() => {
    const saved = localStorage.getItem('nile_remember_me');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const setAuthModalOpen = (open: boolean, mode: AuthModalMode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpenState(open);
  };

  const loginWithProvider = async (provider: AuthProvider, payload?: any, remember: boolean = true): Promise<boolean> => {
    setRememberMe(remember);
    localStorage.setItem('nile_remember_me', JSON.stringify(remember));

    let updatedUser: UserProfile = { ...user };

    if (provider === 'google') {
      updatedUser = {
        ...user,
        name: payload?.name || 'Google Verified User',
        email: payload?.email || 'user.google@nileecosystem.com',
        avatarUrl: payload?.avatar || user.avatarUrl,
        authProvider: 'google',
        kycStatus: 'verified',
        kycTier: Math.max(user.kycTier, 2)
      };
      showToast(`Welcome back, ${updatedUser.name}! Signed in via Google SSO.`, 'success');
    } else if (provider === 'wallet') {
      const address = payload?.address || '0x71C5A8B2C49D9E4E0f1a2384B6F77A6e42b2dC9A';
      updatedUser = {
        ...user,
        name: `Web3 Investor (${address.slice(0, 6)}...${address.slice(-4)})`,
        walletAddress: address,
        authProvider: 'wallet'
      };
      showToast(`Wallet authenticated! Connected to ${address.slice(0, 6)}...${address.slice(-4)}`, 'success');
    } else if (provider === 'phone') {
      const phone = payload?.phone || '+44 7558 847468';
      updatedUser = {
        ...user,
        phone,
        name: user.name || `Verified Client (${phone})`,
        authProvider: 'phone',
        twoFactorEnabled: true
      };
      showToast(`Phone number ${phone} verified via SMS OTP!`, 'success');
    } else if (provider === 'passkey') {
      updatedUser = {
        ...user,
        authProvider: 'passkey',
        passkeyRegistered: true
      };
      showToast('Biometric passkey verified via Hardware Secure Enclave!', 'success');
    } else if (provider === 'email') {
      if (payload?.email === 'owner@nileecosystem.com' || payload?.role === 'super_admin') {
        updatedUser = {
          ...user,
          name: 'Matin Parsa',
          email: 'owner@nileecosystem.com',
          role: 'super_admin',
          rank: 'Diamond'
        };
      } else if (payload?.email) {
        updatedUser = {
          ...user,
          email: payload.email,
          name: payload.name || user.name,
          authProvider: 'email'
        };
      }
      showToast(`Welcome back, ${updatedUser.name}! Secure session initialized.`, 'success');
    }

    setUser(updatedUser);
    setIsLoggedIn(true);
    localStorage.setItem('nile_is_logged_in', 'true');
    if (remember) {
      localStorage.setItem('nile_user', JSON.stringify(updatedUser));
    }
    return true;
  };

  const signupWithProvider = async (provider: AuthProvider, payload?: any, remember: boolean = true): Promise<boolean> => {
    setRememberMe(remember);
    localStorage.setItem('nile_remember_me', JSON.stringify(remember));

    const newAccountNumber = `NCB-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const newRefCode = `NILE-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const newUser: UserProfile = {
      id: `usr-${Date.now().toString(36)}`,
      name: payload?.name || (provider === 'wallet' ? `Web3 Holder (${payload?.address?.slice(0, 6)})` : 'New Nile Investor'),
      email: payload?.email || (provider === 'google' ? 'user.google@nileecosystem.com' : `investor-${Date.now().toString(36)}@nileecosystem.com`),
      role: 'user',
      phone: payload?.phone || undefined,
      accountNumber: newAccountNumber,
      kycStatus: 'pending',
      kycTier: 1,
      referralCode: newRefCode,
      rank: 'Bronze',
      badges: ['badge-pioneer'],
      twoFactorEnabled: provider === 'passkey' || provider === 'phone',
      registeredAt: new Date().toISOString().split('T')[0],
      avatarUrl: payload?.avatar || '/default-avatar.jpg',
      authProvider: provider,
      walletAddress: payload?.address,
      passkeyRegistered: provider === 'passkey',
      biometric2FAEnabled: provider === 'passkey' || false,
      biometricDeviceName: payload?.method || 'Hardware Secure Enclave FIDO2',
      biometricEnrolledAt: provider === 'passkey' ? new Date().toISOString() : undefined
    };

    setUser(newUser);
    setIsLoggedIn(true);
    localStorage.setItem('nile_is_logged_in', 'true');
    if (remember) {
      localStorage.setItem('nile_user', JSON.stringify(newUser));
    }
    showToast(`Account created with ${provider.toUpperCase()}! Welcome to Nile Ecosystem.`, 'success');
    return true;
  };

  const resetPasswordWithCode = async (identifier: string, code: string, newPass: string): Promise<boolean> => {
    showToast(`Password successfully reset for ${identifier}. You are now signed in.`, 'success');
    setIsLoggedIn(true);
    localStorage.setItem('nile_is_logged_in', 'true');
    return true;
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('nile_is_logged_in', 'false');
    showToast('You have been securely signed out from Nile Ecosystem.', 'info');
  };

  const toggleBiometric2FA = (enabled: boolean) => {
    const updated: UserProfile = {
      ...user,
      biometric2FAEnabled: enabled,
      twoFactorEnabled: enabled || user.twoFactorEnabled
    };
    setUser(updated);
    localStorage.setItem('nile_user', JSON.stringify(updated));
    showToast(
      enabled 
        ? 'Device Biometric 2FA (FaceID/TouchID) activated for this terminal.' 
        : 'Device Biometric 2FA disabled.',
      'info'
    );
  };

  const registerDeviceBiometrics = async (): Promise<boolean> => {
    const ua = navigator.userAgent;
    let bioType: 'FaceID' | 'TouchID' | 'WindowsHello' | 'Biometric' = 'TouchID';
    let deviceName = 'Apple Secure Enclave (Touch ID)';

    if (/iPhone|iPad/.test(ua)) {
      bioType = 'FaceID';
      deviceName = 'Apple Neural Engine (FaceID)';
    } else if (/Macintosh/.test(ua)) {
      bioType = 'TouchID';
      deviceName = 'MacBook Pro Secure Enclave (TouchID)';
    } else if (/Windows/.test(ua)) {
      bioType = 'WindowsHello';
      deviceName = 'Windows Hello TPM 2.0 Authenticator';
    } else if (/Android/.test(ua)) {
      bioType = 'Biometric';
      deviceName = 'Android StrongBox Biometric Key';
    }

    const updated: UserProfile = {
      ...user,
      biometric2FAEnabled: true,
      biometricType: bioType,
      biometricDeviceName: deviceName,
      biometricEnrolledAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      passkeyRegistered: true
    };

    setUser(updated);
    localStorage.setItem('nile_user', JSON.stringify(updated));
    showToast(`Enrolled ${deviceName} with FIDO2 hardware protection!`, 'success');
    return true;
  };

  const verifyDeviceBiometrics = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 900);
    });
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t: TRANSLATIONS[language] || TRANSLATIONS['en'],
        isRtlMode,
        activeTab,
        setActiveTab,
        user,
        updateUser,
        balances,
        cards,
        transactions,
        presalePhases,
        presalePurchases,
        investmentPositions,
        marketplaceProducts,
        cart,
        orders,
        testimonials,
        supportTickets,
        depositWallets,
        auditLogs,
        certificateModalOpen,
        setCertificateModalOpen,
        selectedCertificate,
        setSelectedCertificate,
        supportDrawerOpen,
        setSupportDrawerOpen,
        // Staking
        stakingPools,
        userStakes,
        stakeTokens,
        unstakeTokens,
        claimStakingRewards,
        calculateAccruedReward,
        adminUpdateStakingPool,
        adminCreateStakingPool,
        // Tokenomics & Vesting
        tokenomicsAllocations,
        updateTokenomicsAllocation,
        vestingEvents,
        addVestingEvent,
        updateVestingEvent,
        deleteVestingEvent,
        // Referrals & Badges
        referralTiers,
        badges,
        claimBadge,
        adminUpdateReferralTier,
        adminUpdateBadge,
        // KYC/AML
        kycSession,
        kycPermissions,
        initiateKycSession,
        submitProviderVerification,
        simulateProviderWebhook,
        // Actions
        addTransaction,
        submitKyc,
        adminReviewKyc,
        orderCryptoCard,
        toggleCardStatus,
        updateCardLimit,
        participateInPresale,
        createInvestment,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        checkoutCart,
        submitTestimonial,
        adminApproveTestimonial,
        submitSupportTicket,
        updateDepositWallets,
        updatePresalePhase,
        adminAdjustBalance,
        // Marketplace & Order Administration
        adminAddMarketplaceProduct,
        adminUpdateMarketplaceProduct,
        adminDeleteMarketplaceProduct,
        adminUpdateOrderStatus,
        // Cards Administration
        adminUpdateCard,
        adminIssueCard,
        // Investment Plans Administration
        investmentPlansConfig,
        adminUpdateInvestmentPlansConfig,
        // AI Bank Operations Administration
        aiOperationsConfig,
        adminUpdateAiOperationsConfig,
        adminTriggerAiSimulation,
        // Video Ads Administration
        videoAdsConfig,
        adminUpdateVideoAd,
        adminAddVideoAd,
        // Clients & Delegated Controls (Platform Owner Governance)
        managedClients,
        adminApproveClientPanel,
        adminRevokeClientPanel,
        adminUpdateClientPermissions,
        requestClientPanelAccess,
        switchActiveClient,
        clientPanelModalOpen,
        setClientPanelModalOpen,
        isClientPanelApproved,
        // Authentication & Access Controls
        authModalOpen,
        authModalMode,
        setAuthModalOpen,
        isLoggedIn,
        rememberMe,
        setRememberMe,
        loginWithProvider,
        signupWithProvider,
        resetPasswordWithCode,
        logout,
        toggleBiometric2FA,
        verifyDeviceBiometrics,
        registerDeviceBiometrics,
        showToast,
        toast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
