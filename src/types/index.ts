export type Language = 'en' | 'de' | 'fr' | 'es' | 'ar' | 'ru' | 'zh' | 'fa';

export type UserRole = 'super_admin' | 'admin' | 'finance_operator' | 'support_manager' | 'content_manager' | 'auditor' | 'user';

export type KycStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export interface KycDocument {
  type: 'passport' | 'id_card' | 'drivers_license' | 'proof_of_address';
  fileName: string;
  fileUrl?: string;
  uploadedAt: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  category: 'referrals' | 'volume' | 'marketplace' | 'leadership' | 'community';
  criteria: string;
  rewardBonus: string;
  iconName: string;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface ReferralTierConfig {
  rank: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  minReferrals: number;
  minVolumeUsd: number;
  tier1CommissionPercent: number; // e.g. 5.0
  tier2CommissionPercent: number; // e.g. 2.5
  tier3CommissionPercent: number; // e.g. 1.0
  cashbackBonusPercent: number;   // e.g. 1.0
  perks: string[];
  color: string;
}

export interface KycFeaturePermissions {
  canWithdrawFiat: boolean;
  canOrderHighLimitCard: boolean; // enables $10k - $100k cards
  canInvestHighTier: boolean;     // enables Diamond & Platinum plans
  canParticipatePresale: boolean; // permits buys > $1,000
  maxDailyWithdrawalUsd: number;
  levelTitle: string;
}

export interface KycAmlProviderSession {
  sessionId: string;
  provider: 'Sumsub' | 'Onfido' | 'Jumio' | 'ShuftiPro';
  applicantId: string;
  status: 'initialized' | 'documents_submitted' | 'screening_in_progress' | 'approved' | 'rejected' | 'action_required';
  riskScore: 'LOW' | 'MEDIUM' | 'HIGH';
  pepSanctionResult: 'PASSED' | 'FLAGGED' | 'CLEARED';
  ipAddress: string;
  deviceFingerprint: string;
  webhookLog: Array<{
    eventId: string;
    event: string;
    timestamp: string;
    payloadSummary: string;
  }>;
}

export interface NileStakingPool {
  id: string;
  title: string;
  lockDays: number;
  baseAprPercent: number;
  multiplier: number;
  minStakeNile: number;
  totalStakedInPool: number;
  status: 'active' | 'paused';
  earlyUnstakePenaltyPercent: number;
}

export interface NileUserStake {
  id: string;
  poolId: string;
  stakedAmountNile: number;
  stakedAt: string;
  unlockDate: string;
  claimedRewardsNile: number;
  pendingRewardsNile: number;
  status: 'active' | 'unstaked';
}
export interface TokenomicsAllocation {
  category: string;
  percentage: number;
  amount: number;
  color: string;
  lockPeriod: string;
}

export interface VestingScheduleEvent {
  id: string;
  date: string;
  title: string;
  allocationTokens: number;
  category: string;
}

export interface ClientDelegatedPermissions {
  hasClientPanelAccess: boolean;
  panelAccessLevel: 'standard_investor' | 'approved_client' | 'vip_partner' | 'delegated_operator';
  approvedByOwnerAt?: string;
  approvalNotes?: string;
  canCreateCustomVaults: boolean;
  canIssueVirtualCards: boolean;
  canManageSubAffiliates: boolean;
  canListMarketplaceProducts: boolean;
  canAccessAdvancedRoiSim: boolean;
  canExecuteOtcTranches: boolean;
  canAccessApiKeys: boolean;
  maxDelegatedDailyLimitUsd: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  accountNumber: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  taxResidence?: string;
  kycStatus: KycStatus;
  kycTier: number; // 0, 1, 2, 3
  kycRejectionReason?: string;
  kycSubmittedAt?: string;
  kycApprovedAt?: string;
  kycDocuments?: KycDocument[];
  referralCode: string;
  referredBy?: string;
  rank: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  badges: string[]; // IDs of unlocked badges
  twoFactorEnabled: boolean;
  registeredAt: string;
  avatarUrl?: string;
  referralDirectCount?: number;
  referralNetworkCount?: number;
  referralEarningsUsd?: number;
  // Client Panel Control by Platform Owner
  delegatedPermissions?: ClientDelegatedPermissions;
  clientPanelRequested?: boolean;
  clientPanelRequestDate?: string;
  clientPanelRequestReason?: string;
  authProvider?: 'google' | 'wallet' | 'phone' | 'passkey' | 'email';
  walletAddress?: string;
  passkeyRegistered?: boolean;
  biometric2FAEnabled?: boolean;
  biometricType?: 'FaceID' | 'TouchID' | 'WindowsHello' | 'Biometric';
  biometricDeviceName?: string;
  biometricEnrolledAt?: string;
}

export type AuthProvider = 'google' | 'wallet' | 'phone' | 'passkey' | 'email';
export type AuthModalMode = 'login' | 'signup' | 'forgot_password';

export interface CryptoCard {
  id: string;
  type: 'visa' | 'mastercard';
  cardholderName: string;
  cardNumberMasked: string; // e.g. 4319 •••• •••• 3787
  fullCardNumber?: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  status: 'active' | 'frozen' | 'pending_delivery';
  balance: number; // $100 to $100,000
  tier: 'Standard' | 'Gold' | 'Black Elite';
  currency: 'USD' | 'EUR' | 'GBP';
  cashbackRate: number; // e.g. 2.5%
  isPhysical: boolean;
  shippingAddress?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
    schengenOrRegion: string;
  };
  limits: {
    dailySpending: number;
    monthlySpending: number;
    dailyAtm: number;
  };
}

export interface BankBalances {
  USD: number;
  EUR: number;
  GBP: number;
  BTC: number;
  ETH: number;
  USDT: number;
  NILE: number;
}

export interface TransactionRecord {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'presale_purchase' | 'card_load' | 'investment_deposit' | 'investment_payout' | 'marketplace_order' | 'staking_deposit' | 'staking_claim' | 'staking_unstake';
  amount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'failed' | 'rejected';
  network?: string;
  recipientOrDetails?: string;
  txHash?: string;
  timestamp: string;
  fee?: number;
}

export interface PresalePhase {
  id: number;
  name: string;
  tokenPriceUsd: number;
  totalAllocation: number; // in NILE
  soldAllocation: number; // in NILE
  minPurchaseUsd: number;
  maxPurchaseUsd: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'upcoming' | 'completed' | 'paused';
  vestingRule: string;
}

export interface PresalePurchase {
  id: string;
  phaseId: number;
  buyerWalletOrEmail: string;
  amountUsd: number;
  nileTokens: number;
  paymentAsset: 'ETH' | 'BNB' | 'USDT' | 'USDC' | 'BTC' | 'SOL' | 'TRX';
  network: string;
  txHash: string;
  claimedTokens: number;
  claimAvailableDate: string;
  timestamp: string;
  status: 'confirmed' | 'pending';
}

export interface InvestmentPlanCategory {
  id: 'asset' | 'time' | 'amount' | 'nile_benefits';
  title: string;
  description: string;
  riskNotice: string;
}

export interface InvestmentPosition {
  id: string;
  planCategoryId: 'asset' | 'time' | 'amount' | 'nile_benefits';
  planName: string;
  principalAmount: number;
  currency: string;
  aprPercent: number; // transparent, non-guaranteed projected rate
  durationDays: number;
  startDate: string;
  maturityDate: string;
  accruedReturn: number;
  status: 'active' | 'matured' | 'cancelled';
  autoReinvest: boolean;
}

export interface MarketplaceProduct {
  id: string;
  title: string;
  category: 'software' | 'cards' | 'giftcards' | 'esim' | 'token_creation' | 'collectibles';
  priceUsd: number;
  description: string;
  features: string[];
  inStock: boolean;
  stockCount?: number;
  isPhysical?: boolean;
  image?: string;
  specifications?: Record<string, string>;
  supportedNetworks?: string[];
  deliveryEstimate?: string;
}

export interface CartItem {
  product: MarketplaceProduct;
  quantity: number;
  selectedOption?: string;
}

export interface MarketplaceOrder {
  id: string;
  items: { product: MarketplaceProduct; quantity: number }[];
  totalUsd: number;
  paymentMethod: 'crypto' | 'bank_transfer' | 'nile_wallet';
  status: 'pending_payment' | 'processing' | 'shipped' | 'delivered' | 'completed';
  shippingDetails?: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    country: string;
  };
  trackingCode?: string;
  licenseKeys?: string[];
  createdAt: string;
}

export interface DexToken {
  symbol: string;
  name: string;
  priceUsd: number;
  change24h: number;
  iconBg: string;
  balance?: number;
}

export interface Testimonial {
  id: string;
  userName: string;
  userRoleOrLocation: string;
  rating: number; // 1-5
  comment: string;
  productUsed: 'NCB' | 'Nile Investment' | 'Marketplace' | 'Cards' | 'Presale';
  isApproved: boolean;
  submittedAt: string;
  avatar?: string;
}

export interface SupportTicket {
  id: string;
  userEmail: string;
  userName: string;
  subject: string;
  category: 'account' | 'deposit' | 'withdrawal' | 'cards' | 'marketplace' | 'presale' | 'technical';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  messages: {
    sender: 'user' | 'agent' | 'system';
    text: string;
    timestamp: string;
  }[];
  createdAt: string;
}

export interface DepositWalletsConfig {
  BTC_1: string;
  BTC_2: string;
  ETH_BNB: string;
  TRON: string;
  SOLANA_1: string;
  SOLANA_2: string;
  BCH: string;
  ETC: string;
  XRP: string;
}

export interface AdminAuditEntry {
  id: string;
  operator: string;
  action: string;
  target: string;
  details: string;
  timestamp: string;
}

export interface TokenomicsAllocation {
  category: string;
  percentage: number;
  amount: number;
  color: string;
  lockPeriod: string;
}

export interface VestingScheduleEvent {
  id: string;
  date: string;
  title: string;
  allocationTokens: number;
  category: string;
}

export interface InvestmentPlansAdminConfig {
  ultimatePlan: {
    minDepositUsd: number;
    maxDepositUsd: number;
    maxApyPercent: number;
    investorCapLimit: number;
    currentActiveInvestors: number;
    vaultTotalCapUsd: number;
    nileBoosterMultiplier: number;
    status: 'active' | 'capped' | 'paused';
  };
  surpriseCampaign: {
    weeklyPayoutPercent: number;
    monthlyPayoutPercent: number;
    threeMonthSettlementPercent: number;
    countdownDays: number;
    status: 'active' | 'paused' | 'concluded';
    participatingAssets: string[];
  };
  plan1AssetBased: {
    usdtDailyRate: number;
    ethDailyRate: number;
    btcDailyRate: number;
    status: 'active' | 'paused';
  };
  plan2TimeLocked: {
    lock30DaysRate: number;
    lock50DaysRate: number;
    lock100DaysRate: number;
    boosterMultiplier: number;
    status: 'active' | 'paused';
  };
  plan3AmountTiers: {
    microRate: number;
    growthRate: number;
    eliteRate: number;
    apexRate: number;
    apexThresholdUsd: number;
    status: 'active' | 'paused';
  };
  calculatorSettings: {
    defaultPrincipal: number;
    defaultDuration: string;
    compoundInterestEnabled: boolean;
    traditionalBenchmarkRate: number; // e.g. 5.2% US Treasury
    timeframeOptions: string[]; // e.g. ['7d', '30d', '90d', '180d', '365d']
  };
}

export interface AiOperationsAdminConfig {
  ammLiquidityRebalancer: {
    status: 'autonomous' | 'manual' | 'paused';
    slippageTolerancePercent: number;
    rebalanceFrequencySeconds: number;
    totalAutonomousVolume24h: number;
    preventedSlippageUsd: number;
  };
  crossBorderSettlementEngine: {
    status: 'autonomous' | 'monitoring' | 'failover';
    averageLatencyMs: number;
    activeRoutingGateways: string[];
    zeroLatencySettlementRate: number;
  };
  neuralFraudSanitizer: {
    status: 'active' | 'elevated' | 'lockdown';
    blockedMaliciousPayloads: number;
    automatedColdStorageTriggers: number;
    amlRiskThresholdScore: number;
  };
  regulatoryComplianceAi: {
    status: 'compliant' | 'auditing';
    lastAuditTimestamp: string;
    verifiedJurisdictions: string[];
    onChainProofTxid: string;
  };
}

export interface VideoAdAdminItem {
  id: string;
  title: string;
  badge: string;
  duration: string;
  views: string;
  category: string;
  summary: string;
  status: 'active' | 'unlisted' | 'featured';
  complianceTags: string[];
}
