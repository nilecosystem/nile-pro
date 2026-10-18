import { 
  DepositWalletsConfig, 
  PresalePhase, 
  CryptoCard, 
  MarketplaceProduct, 
  Testimonial,
  DexToken,
  AdminAuditEntry,
  NileStakingPool,
  NileUserStake,
  AchievementBadge,
  ReferralTierConfig,
  TokenomicsAllocation,
  VestingScheduleEvent,
  KycAmlProviderSession,
  UserProfile
} from '../types/index.ts';

// Official Deposit Wallet Addresses specified by Project Owner
export const INITIAL_DEPOSIT_WALLETS: DepositWalletsConfig = {
  BTC_1: 'bc1qhcyuprv4m2akkflcy3aszmx5wggzzadf42y3as',
  BTC_2: '1KisoLQNGUZKSG3PZZcfGUn2RUTpBRfsZB',
  ETH_BNB: '0x9ad1Faa6d1DBDC047001b16eA1ced073a6058399',
  TRON: 'TE5QqMoBbLbTkUtkcfe93WTyH9ytm78zaR',
  SOLANA_1: '8XPTkroufgEDJoCLM9KDBhMZzaBzo6FfdHpvaHcWbTpE',
  SOLANA_2: 'FGucaYXLFpeFVAQP6cUW8vsVpjo55MjeBgqPrRuNLCfj',
  BCH: 'qqyvysrxd72yxa04kj703vd6tt63axnkdv7heyzc8l',
  ETC: '0x8Df46ed561dE2e92DB979ED1fbE183748F636250',
  XRP: 'rJ8MNvjZhSHShg3uwQLnZwbyaCRTmTXmSf'
};

// Official Support & Contact details
export const OFFICIAL_CONTACT_INFO = {
  ownerEmail: 'owner@nileecosystem.com',
  infoEmail: 'info@nileecosystem.com',
  supportEmail: 'support@nileecosystem.com',
  phone: '+447558847468',
  whatsapp: '+447552847468',
  telegram: 'https://t.me/Nile_support',
  twitter: 'https://x.com/nileecosystem',
  youtube: 'https://www.youtube.com/@Nilecosystem',
  website: 'https://nileecosystem.com',
  registeredCompany: 'NILE INVESTMENT LTD',
  companyNumber: '08253865',
  registryJurisdiction: 'Companies House, Cardiff, United Kingdom',
  complianceCertDate: '28.12.2025',
  incorporationDate: '11 October 2026'
};

export const SCHENGEN_COUNTRIES = [
  'Austria', 'Belgium', 'Croatia', 'Czech Republic', 'Denmark',
  'Estonia', 'Finland', 'France', 'Germany', 'Greece',
  'Hungary', 'Iceland', 'Italy', 'Latvia', 'Liechtenstein',
  'Lithuania', 'Luxembourg', 'Malta', 'Netherlands', 'Norway',
  'Poland', 'Portugal', 'Slovakia', 'Slovenia', 'Spain',
  'Sweden', 'Switzerland'
];

export const ALL_SHIPPING_REGIONS = [
  'United Kingdom',
  'United States of America',
  'Canada',
  'United Arab Emirates (UAE)',
  ...SCHENGEN_COUNTRIES
];

// Total Supply: 500,000,000 NILE
export const TOTAL_TOKEN_SUPPLY = 500000000;

export const TOKENOMICS_ALLOCATIONS: TokenomicsAllocation[] = [
  { category: 'Public & Seed Presale', percentage: 30, amount: 150000000, color: '#E5B842', lockPeriod: '15% at TGE, 85% vested over 9 months' },
  { category: 'Ecosystem & Treasury Fund', percentage: 25, amount: 125000000, color: '#00F0FF', lockPeriod: '6-month cliff, 36-month linear unlock' },
  { category: 'Staking & Community Rewards', percentage: 20, amount: 100000000, color: '#38BDF8', lockPeriod: 'Released per block/era according to staking participation' },
  { category: 'Founders & Core Contributors', percentage: 15, amount: 75000000, color: '#818CF8', lockPeriod: '12-month cliff, 24-month linear vesting' },
  { category: 'Liquidity & Exchange Listings', percentage: 10, amount: 50000000, color: '#34D399', lockPeriod: '100% unlocked at TGE locked in DEX liquidity pools' },
];

export const VESTING_SCHEDULE_EVENTS: VestingScheduleEvent[] = [
  { id: '1', date: 'Q1 2026', title: 'TGE Initial Liquidity & 15% Presale Unlock', allocationTokens: 72500000, category: 'Liquidity / Presale' },
  { id: '2', date: 'Q2 2026', title: 'Presale Tranche 2 & Staking Incentives Start', allocationTokens: 35000000, category: 'Community' },
  { id: '3', date: 'Q3 2026', title: 'Ecosystem Treasury Cliff End & Presale Tranche 3', allocationTokens: 45000000, category: 'Ecosystem' },
  { id: '4', date: 'Q4 2026', title: 'Presale Final Tranche & Marketplace Liquidity', allocationTokens: 50000000, category: 'Marketplace' },
  { id: '5', date: 'Q1 2027', title: 'Founders 12-Month Cliff Unlock Initiation', allocationTokens: 18750000, category: 'Team' },
  { id: '6', date: 'Q2 2027', title: 'Ecosystem Linear Unlock Year 2 Tranche', allocationTokens: 31250000, category: 'Ecosystem' },
];

export const INITIAL_PRESALE_PHASES: PresalePhase[] = [
  {
    id: 1,
    name: 'Phase 1: Seed Pioneer',
    tokenPriceUsd: 0.05,
    totalAllocation: 50000000,
    soldAllocation: 41250000,
    minPurchaseUsd: 50,
    maxPurchaseUsd: 25000,
    startDate: '2026-02-01',
    endDate: '2026-04-15',
    status: 'active',
    vestingRule: '15% at TGE, 85% released linearly across 9 months'
  },
  {
    id: 2,
    name: 'Phase 2: Strategic Ecosystem',
    tokenPriceUsd: 0.08,
    totalAllocation: 50000000,
    soldAllocation: 0,
    minPurchaseUsd: 100,
    maxPurchaseUsd: 50000,
    startDate: '2026-04-16',
    endDate: '2026-06-30',
    status: 'upcoming',
    vestingRule: '20% at TGE, 80% released linearly across 6 months'
  },
  {
    id: 3,
    name: 'Phase 3: Public Launchpad',
    tokenPriceUsd: 0.12,
    totalAllocation: 50000000,
    soldAllocation: 0,
    minPurchaseUsd: 25,
    maxPurchaseUsd: 100000,
    startDate: '2026-07-01',
    endDate: '2026-08-31',
    status: 'upcoming',
    vestingRule: '25% at TGE, 75% released linearly across 4 months'
  }
];

export const INITIAL_CRYPTO_CARDS: CryptoCard[] = [
  {
    id: 'card-1',
    type: 'visa',
    cardholderName: 'Matin Parsa',
    cardNumberMasked: '4319 •••• •••• 3787',
    fullCardNumber: '4319590004233787',
    expiryMonth: '08',
    expiryYear: '29',
    cvv: '842',
    status: 'active',
    balance: 25000,
    tier: 'Gold',
    currency: 'USD',
    cashbackRate: 3.5,
    isPhysical: true,
    limits: {
      dailySpending: 10000,
      monthlySpending: 50000,
      dailyAtm: 3000
    }
  },
  {
    id: 'card-2',
    type: 'mastercard',
    cardholderName: 'Matin Parsa',
    cardNumberMasked: '5205 •••• •••• 5546',
    fullCardNumber: '5205812310475546',
    expiryMonth: '11',
    expiryYear: '28',
    cvv: '193',
    status: 'active',
    balance: 50000,
    tier: 'Black Elite',
    currency: 'EUR',
    cashbackRate: 5.0,
    isPhysical: true,
    limits: {
      dailySpending: 25000,
      monthlySpending: 100000,
      dailyAtm: 5000
    }
  },
  {
    id: 'card-3',
    type: 'mastercard',
    cardholderName: 'Matin Parsa',
    cardNumberMasked: '5331 •••• •••• 8336',
    fullCardNumber: '5331714100448336',
    expiryMonth: '04',
    expiryYear: '30',
    cvv: '614',
    status: 'active',
    balance: 10000,
    tier: 'Standard',
    currency: 'GBP',
    cashbackRate: 2.0,
    isPhysical: false,
    limits: {
      dailySpending: 5000,
      monthlySpending: 20000,
      dailyAtm: 1500
    }
  }
];

export const INITIAL_MARKETPLACE_PRODUCTS: MarketplaceProduct[] = [
  // Collectibles explicitly specified by project owner
  {
    id: 'prod-million-note',
    title: 'Authentic US $1,000,000 Banknote & 6 Gold Bullion Bars',
    category: 'collectibles',
    priceUsd: 500000,
    image: '/assets/products/million-dollar-banknote-gold.png',
    description: 'Fully verifiable genuine museum-grade US One-Million-Dollar collector banknote accompanied by official certification documentation and six verified bullion bars. Secure insured international white-glove transport.',
    features: [
      'Authentic certified banknote with registered serial number',
      'Accompanying 6 bullion bars in tamper-evident security cases',
      'Full legal provenance documentation & certificates',
      'Complimentary insured courier delivery to USA, Canada, UK, UAE & Schengen',
      'Payment accepted via bank wire or major cryptocurrencies'
    ],
    inStock: true,
    stockCount: 2,
    isPhysical: true,
    deliveryEstimate: '1-3 weeks worldwide'
  },
  {
    id: 'prod-casascius-025',
    title: 'Physical Casascius Bitcoin (0.25 BTC Balance)',
    category: 'collectibles',
    priceUsd: 20000,
    image: '/assets/products/casascius-bitcoin-collectible.png',
    description: 'Original physical Casascius Bitcoin coin loaded with 0.25 BTC. Verifiable on-chain via public mini-key address. Sealed with holographic security sticker intact.',
    features: [
      'Unpeeled original security hologram',
      '0.25 BTC funded balance verifiable on Bitcoin blockchain',
      'Sealed acrylic archival case with serial authentication',
      'Trackable on public ledger'
    ],
    inStock: true,
    stockCount: 1,
    isPhysical: true,
    deliveryEstimate: '1-2 weeks'
  },
  {
    id: 'prod-casascius-05',
    title: 'Physical Casascius Bitcoin Coin (0.5 BTC Balance)',
    category: 'collectibles',
    priceUsd: 40000,
    image: '/assets/products/casascius-bitcoin-collectible.png',
    description: 'Rare collectible physical Casascius Bitcoin coin holding 0.5 BTC. Untampered holographic seal with original brass finish.',
    features: [
      'Verifiable 0.50 BTC balance',
      'Archival protective display case',
      'Tamper-evident hologram intact',
      'Complete blockchain provenance record'
    ],
    inStock: true,
    stockCount: 1,
    isPhysical: true,
    deliveryEstimate: '1-2 weeks'
  },
  {
    id: 'prod-casascius-1',
    title: 'Physical Casascius Bitcoin Coin (1.0 BTC Balance)',
    category: 'collectibles',
    priceUsd: 80000,
    image: '/assets/products/casascius-bitcoin-collectible.png',
    description: 'Iconic 1 BTC Casascius physical cryptocurrency coin. First-generation minting, flawless hologram, verified directly on the Bitcoin mainnet.',
    features: [
      '1.0 BTC funded and verifiable on-chain',
      'Series 1 vintage collectible coin',
      'Numbered certificate of authenticity',
      'High-security insured courier transport'
    ],
    inStock: true,
    stockCount: 5,
    isPhysical: true,
    deliveryEstimate: '1-2 weeks'
  },
  {
    id: 'prod-casascius-10',
    title: 'Rare Casascius Bitcoin Coin (10.0 BTC Balance)',
    category: 'collectibles',
    priceUsd: 80000,
    image: '/assets/products/casascius-bitcoin-collectible.png',
    description: 'Ultra-rare Casascius physical coin containing 10 BTC stored value. Vault stored, museum condition with untouched tamper seal.',
    features: [
      '10.0 BTC on-chain funded balance',
      'Ultra-exclusive collector piece',
      'Escrow or verified delivery protocol',
      'Full provenance and serial verification'
    ],
    inStock: true,
    stockCount: 2,
    isPhysical: true,
    deliveryEstimate: '1-2 weeks'
  },
  // Digital Software
  {
    id: 'prod-win11-pro',
    title: 'Windows 11 Professional — Genuine Retail License',
    category: 'software',
    priceUsd: 49,
    image: '/assets/products/software-license-box.png',
    description: 'Lifetime genuine digital activation key for Windows 11 Pro 64-Bit. Instant delivery with direct Microsoft verification.',
    features: ['100% Genuine Retail Key', 'Lifetime Online Activation', 'All Languages Supported', 'Direct from Microsoft Servers'],
    inStock: true,
    stockCount: 150,
    isPhysical: false,
    deliveryEstimate: 'Instant digital delivery'
  },
  {
    id: 'prod-office-2024',
    title: 'Microsoft Office 2024 Professional Plus',
    category: 'software',
    priceUsd: 69,
    image: '/assets/products/software-license-box.png',
    description: 'Full suite including Word, Excel, PowerPoint, Outlook, Access & Publisher. Permanent activation without recurring subscriptions.',
    features: ['Word, Excel, PowerPoint, Outlook', 'Lifetime License for 1 PC', 'Instant Electronic Key', '24/7 Activation Support'],
    inStock: true,
    stockCount: 200,
    isPhysical: false,
    deliveryEstimate: 'Instant digital delivery'
  },
  {
    id: 'prod-kaspersky-prem',
    title: 'Kaspersky Premium Total Security (1 Year / 3 Devices)',
    category: 'software',
    priceUsd: 35,
    image: '/assets/products/software-license-box.png',
    description: 'Next-generation antivirus, firewall, ransomware shielding, and password vault across PC, Mac, and mobile.',
    features: ['Real-time Antivirus & Anti-Phishing', 'Identity & Wallet Protection', 'Unlimited VPN Included', '3 Devices Supported'],
    inStock: true,
    stockCount: 80,
    isPhysical: false,
    deliveryEstimate: 'Instant digital delivery'
  },
  {
    id: 'prod-nordvpn-2y',
    title: 'NordVPN 2-Year Ultra Privacy Subscription',
    category: 'software',
    priceUsd: 89,
    image: '/assets/products/software-license-box.png',
    description: 'High-speed encrypted VPN with Threat Protection, Meshnet, and dedicated crypto-friendly IP options.',
    features: ['6,000+ Fast Global Servers', 'No-Logs Certified Policy', 'Double VPN & Onion Over VPN', '10 Devices Simultaneously'],
    inStock: true,
    stockCount: 95,
    isPhysical: false,
    deliveryEstimate: 'Instant digital delivery'
  },
  // Financial & Payment Cards
  {
    id: 'prod-card-virtual-visa',
    title: 'Virtual International Visa Card ($500 Balance)',
    category: 'cards',
    priceUsd: 525,
    image: '/assets/products/nile-cards-trio.png',
    description: 'Preloaded international virtual Visa card. Usable on any international merchant, SaaS subscription, Apple Pay, and Google Wallet.',
    features: ['Ready-to-use $500 balance', 'Instant issuance to account dashboard', '3D Secure (3DS) verified for online purchases', 'Supports global online merchants'],
    inStock: true,
    isPhysical: false,
    deliveryEstimate: 'Instant digital delivery'
  },
  {
    id: 'prod-card-physical-metal',
    title: 'Nile Black Elite Metal Crypto Card ($5,000 Tier)',
    category: 'cards',
    priceUsd: 5150,
    image: '/assets/products/nile-cards-trio.png',
    description: 'Custom heavy matte-black stainless steel card with gold edge engraving. 5% cashback on all crypto and fiat spending.',
    features: ['Heavyweight Stainless Steel Metal Card', '$5,000 initial card balance', '5.0% flat cashback in NILE or USDT', 'Free courier shipping to USA, Canada, UK, UAE & Schengen'],
    inStock: true,
    stockCount: 45,
    isPhysical: true,
    deliveryEstimate: '1-3 weeks worldwide'
  },
  // Gift Cards
  {
    id: 'prod-gift-amazon-100',
    title: 'Amazon E-Gift Card $100 USD',
    category: 'giftcards',
    priceUsd: 98,
    image: '/assets/products/giftcard-luxury-vault.png',
    description: 'Redeemable on Amazon.com for millions of items. No expiration date and zero redemption fees.',
    features: ['Official Amazon digital code', 'Valid on all Amazon.com departments', 'Instant activation pin code'],
    inStock: true,
    stockCount: 120,
    isPhysical: false,
    deliveryEstimate: 'Instant digital delivery'
  },
  {
    id: 'prod-gift-apple-100',
    title: 'Apple Gift Card $100 (Universal App Store & Hardware)',
    category: 'giftcards',
    priceUsd: 99,
    image: '/assets/products/giftcard-luxury-vault.png',
    description: 'Use for products, accessories, apps, games, music, movies, iCloud+, and subscriptions across the Apple ecosystem.',
    features: ['Universal Apple Code', 'Valid in Apple Store & App Store', 'Instant code delivered to email'],
    inStock: true,
    stockCount: 60,
    isPhysical: false,
    deliveryEstimate: 'Instant digital delivery'
  },
  // eSIM Data Plans
  {
    id: 'prod-esim-schengen',
    title: 'Europe Schengen eSIM (20GB High-Speed / 30 Days)',
    category: 'esim',
    priceUsd: 32,
    image: '/assets/products/digital-goods-esim.png',
    description: 'High-speed 5G/4G data coverage across all 27+ Schengen and EU member nations without roaming fees.',
    features: ['Instant QR code activation', 'Supports iPhone, Samsung, Pixel & all eSIM devices', 'High-speed 5G data with hotspot tethering', 'Automatic network handover between European telcos'],
    inStock: true,
    isPhysical: false,
    deliveryEstimate: 'Instant QR code delivery'
  },
  {
    id: 'prod-esim-global',
    title: 'Global Traveler eSIM (10GB / 130+ Countries / 30 Days)',
    category: 'esim',
    priceUsd: 45,
    image: '/assets/products/digital-goods-esim.png',
    description: 'One eSIM that works across the USA, UK, UAE, Europe, Asia, and the Americas without swapping SIM cards.',
    features: ['Covers 130+ countries globally', '5G / LTE multi-carrier coverage', 'Instant QR code setup in 60 seconds', 'Zero physical shipping required'],
    inStock: true,
    stockCount: 85,
    isPhysical: false,
    deliveryEstimate: 'Instant QR code delivery'
  },
  // Token Creation Services
  {
    id: 'prod-token-bep20',
    title: 'BEP20 Token Creation & Deployment Service (BNB Chain)',
    category: 'token_creation',
    priceUsd: 450,
    image: '/assets/products/smart-contract-audit.png',
    description: 'Complete smart contract development, compilation, verification on BscScan, liquidity pool setup consultation, and ownership transfer.',
    features: ['Custom Token Name & Symbol', 'Audited Solidity Contract', 'Verified on BscScan', 'Burnable, Mintable, or Fixed Supply Options', 'Deployment to Mainnet within 48 hours'],
    inStock: true,
    isPhysical: false,
    deliveryEstimate: '2-4 business days'
  },
  {
    id: 'prod-token-erc20',
    title: 'ERC20 Enterprise Token Architecture (Ethereum Mainnet/L2)',
    category: 'token_creation',
    priceUsd: 850,
    image: '/assets/products/smart-contract-audit.png',
    description: 'Institutional-grade OpenZeppelin compliant ERC20 token with role-based access control, fee-on-transfer capabilities, and Etherscan verification.',
    features: ['OpenZeppelin V5 Architecture', 'Deployment on Ethereum, Arbitrum, or Polygon', 'Full source code & ABI handover', 'Full Etherscan verification with license metadata'],
    inStock: true,
    isPhysical: false,
    deliveryEstimate: '3-5 business days'
  },
  {
    id: 'prod-token-solana',
    title: 'Solana SPL Token Minting & Metadata Registration',
    category: 'token_creation',
    priceUsd: 390,
    image: '/assets/products/smart-contract-audit.png',
    description: 'High-speed SPL token deployment with Metaplex metadata registration (logo, website, socials) on Solana mainnet-beta.',
    features: ['Metaplex Token Standard compliant', 'Decimals & Supply custom configuration', 'Solscan & Raydium ready', 'Revoke Mint / Freeze authority options'],
    inStock: true,
    isPhysical: false,
    deliveryEstimate: '1-2 business days'
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    userName: 'Serena James',
    userRoleOrLocation: 'Private Client, London, UK',
    rating: 5,
    comment: 'I have used several online banking and crypto platforms, but Nile stands out with top-tier security and intuitive design. The crypto card works seamlessly across Europe and transfers settle instantly.',
    productUsed: 'Cards',
    isApproved: true,
    submittedAt: '2026-03-12'
  },
  {
    id: 'test-2',
    userName: 'Boris Elbert',
    userRoleOrLocation: 'Fintech Entrepreneur, Zurich, Switzerland',
    rating: 5,
    comment: 'Opening the NCB account was fast and the compliance verification gave our team immense confidence. Transparent fee structure with no hidden surprises.',
    productUsed: 'NCB',
    isApproved: true,
    submittedAt: '2026-03-24'
  },
  {
    id: 'test-3',
    userName: 'Marcus Sterling',
    userRoleOrLocation: 'Private Collector, Dubai, UAE',
    rating: 5,
    comment: 'Acquired a physical Casascius Bitcoin through the marketplace. The provenance documentation was immaculate and delivery arrived via high-security courier in under 8 days.',
    productUsed: 'Marketplace',
    isApproved: true,
    submittedAt: '2026-04-02'
  },
  {
    id: 'test-4',
    userName: 'Elena Rostova',
    userRoleOrLocation: 'Early Presale Participant, Paris, France',
    rating: 5,
    comment: 'Participating in the NILE Token Presale was smooth. Connecting my wallet, seeing the exact calculation, and checking the vesting schedule on-chain was transparent from day one.',
    productUsed: 'Presale',
    isApproved: true,
    submittedAt: '2026-04-10'
  }
];

export const INITIAL_DEX_TOKENS: DexToken[] = [
  { symbol: 'NILE', name: 'Nile Token', priceUsd: 0.12, change24h: 8.4, iconBg: '#E5B842', balance: 12500 },
  { symbol: 'USDT', name: 'Tether USD', priceUsd: 1.00, change24h: 0.01, iconBg: '#26A17B', balance: 2500 },
  { symbol: 'BTC', name: 'Bitcoin', priceUsd: 68420, change24h: 2.15, iconBg: '#F7931A', balance: 0.45 },
  { symbol: 'ETH', name: 'Ethereum', priceUsd: 3580, change24h: 3.42, iconBg: '#627EEA', balance: 2.8 },
  { symbol: 'BNB', name: 'BNB', priceUsd: 590, change24h: 1.2, iconBg: '#F3BA2F', balance: 4.5 },
  { symbol: 'SOL', name: 'Solana', priceUsd: 178, change24h: 5.6, iconBg: '#9945FF', balance: 14.0 },
  { symbol: 'TRX', name: 'TRON', priceUsd: 0.165, change24h: 0.8, iconBg: '#FF0013', balance: 4200 }
];

export const INITIAL_ADMIN_AUDIT_LOGS: AdminAuditEntry[] = [
  {
    id: 'log-1',
    operator: 'Super Admin (nilecosystem@gmail.com)',
    action: 'SYSTEM_BOOTSTRAP',
    target: 'NILE ECOSYSTEM',
    details: 'Initial corporate verification certificates and multi-chain deposit addresses configured.',
    timestamp: '2026-10-13 18:22:36'
  },
  {
    id: 'log-2',
    operator: 'Finance Operator',
    action: 'PRESALE_INIT',
    target: 'Phase 1: Seed Pioneer',
    details: 'Presale Phase 1 active at $0.05/NILE. Allocation: 50,000,000 NILE.',
    timestamp: '2026-10-13 18:25:10'
  },
  {
    id: 'log-3',
    operator: 'Compliance Officer',
    action: 'KYC_POLICY_UPDATE',
    target: 'Tier 1 & Tier 2 Requirements',
    details: 'Standardized ID Card, Passport & Proof of Address verification workflows enforced.',
    timestamp: '2026-10-13 18:28:44'
  }
];

export const INITIAL_STAKING_POOLS: NileStakingPool[] = [
  {
    id: 'pool-30d',
    title: '30-Day Flexible Staking',
    lockDays: 30,
    baseAprPercent: 12.0,
    multiplier: 1.0,
    minStakeNile: 500,
    totalStakedInPool: 12450000,
    status: 'active',
    earlyUnstakePenaltyPercent: 3.0
  },
  {
    id: 'pool-90d',
    title: '90-Day Strategic Vault',
    lockDays: 90,
    baseAprPercent: 18.0,
    multiplier: 1.25,
    minStakeNile: 2500,
    totalStakedInPool: 28500000,
    status: 'active',
    earlyUnstakePenaltyPercent: 5.0
  },
  {
    id: 'pool-180d',
    title: '180-Day Institutional Reserve',
    lockDays: 180,
    baseAprPercent: 24.0,
    multiplier: 1.5,
    minStakeNile: 10000,
    totalStakedInPool: 45000000,
    status: 'active',
    earlyUnstakePenaltyPercent: 7.5
  },
  {
    id: 'pool-365d',
    title: '365-Day Diamond Multiplier Vault',
    lockDays: 365,
    baseAprPercent: 32.0,
    multiplier: 2.0,
    minStakeNile: 25000,
    totalStakedInPool: 64000000,
    status: 'active',
    earlyUnstakePenaltyPercent: 10.0
  }
];

export const INITIAL_USER_STAKES: NileUserStake[] = [
  {
    id: 'stake-01',
    poolId: 'pool-180d',
    stakedAmountNile: 100000,
    stakedAt: '2026-02-15',
    unlockDate: '2026-08-14',
    claimedRewardsNile: 1250,
    pendingRewardsNile: 3840,
    status: 'active'
  }
];

export const INITIAL_ACHIEVEMENT_BADGES: AchievementBadge[] = [
  {
    id: 'badge-pioneer',
    title: 'Pioneer Referrer',
    description: 'Directly referred 5 or more active KYC-verified participants to the platform.',
    category: 'referrals',
    criteria: '≥ 5 verified referrals',
    rewardBonus: '+0.5% referral commission tier boost',
    iconName: 'Users',
    isUnlocked: true,
    unlockedAt: '2026-02-01'
  },
  {
    id: 'badge-bullion',
    title: 'Bullion Collector',
    description: 'Facilitated or acquired a certified physical Casascius Bitcoin or gold bullion specimen.',
    category: 'marketplace',
    criteria: '1+ physical collectible transaction',
    rewardBonus: 'Zero insurance fee on courier deliveries',
    iconName: 'Award',
    isUnlocked: true,
    unlockedAt: '2026-03-10'
  },
  {
    id: 'badge-highroller',
    title: 'Institutional Whale',
    description: 'Maintained total portfolio or card balance exceeding $50,000 USD.',
    category: 'volume',
    criteria: '≥ $50,000 USD balance/volume',
    rewardBonus: 'Dedicated VIP Concierge desk priority',
    iconName: 'TrendingUp',
    isUnlocked: true,
    unlockedAt: '2026-03-25'
  },
  {
    id: 'badge-community',
    title: 'Community Pillar',
    description: 'Submitted an approved corporate review and shared verified platform insights.',
    category: 'community',
    criteria: '1 approved testimonial',
    rewardBonus: 'Featured badge on public profile',
    iconName: 'Crown',
    isUnlocked: true,
    unlockedAt: '2026-04-01'
  },
  {
    id: 'badge-diamond',
    title: 'Diamond Governance Council',
    description: 'Achieved Diamond rank with over 100 ecosystem referrals and 500,000 NILE staked.',
    category: 'leadership',
    criteria: 'Diamond rank + 500k NILE staked',
    rewardBonus: '5.0% flat cashback & revenue share tier',
    iconName: 'Shield',
    isUnlocked: true,
    unlockedAt: '2026-04-12'
  }
];

export const INITIAL_REFERRAL_TIERS: ReferralTierConfig[] = [
  {
    rank: 'Bronze',
    minReferrals: 0,
    minVolumeUsd: 0,
    tier1CommissionPercent: 3.0,
    tier2CommissionPercent: 1.0,
    tier3CommissionPercent: 0.5,
    cashbackBonusPercent: 0.5,
    perks: ['Standard card issuance', 'Community Discord access'],
    color: '#CD7F32'
  },
  {
    rank: 'Silver',
    minReferrals: 5,
    minVolumeUsd: 5000,
    tier1CommissionPercent: 4.0,
    tier2CommissionPercent: 1.5,
    tier3CommissionPercent: 0.75,
    cashbackBonusPercent: 1.0,
    perks: ['Express KYC priority', 'Reduced internal wire fees'],
    color: '#C0C0C0'
  },
  {
    rank: 'Gold',
    minReferrals: 20,
    minVolumeUsd: 25000,
    tier1CommissionPercent: 5.0,
    tier2CommissionPercent: 2.5,
    tier3CommissionPercent: 1.0,
    cashbackBonusPercent: 1.5,
    perks: ['Complimentary Gold Metal Card', 'Presale Phase priority allocation'],
    color: '#E5B842'
  },
  {
    rank: 'Platinum',
    minReferrals: 50,
    minVolumeUsd: 100000,
    tier1CommissionPercent: 6.5,
    tier2CommissionPercent: 3.0,
    tier3CommissionPercent: 1.5,
    cashbackBonusPercent: 2.0,
    perks: ['Dedicated Account Manager', 'Free insured courier to Schengen & UAE'],
    color: '#E5E4E2'
  },
  {
    rank: 'Diamond',
    minReferrals: 100,
    minVolumeUsd: 500000,
    tier1CommissionPercent: 8.0,
    tier2CommissionPercent: 4.0,
    tier3CommissionPercent: 2.0,
    cashbackBonusPercent: 3.0,
    perks: ['Black Metal Elite Card (Free)', 'Institutional OTC desk access', 'VIP Staking 2.0x Multiplier'],
    color: '#B9F2FF'
  }
];

export const INITIAL_KYC_AML_SESSION: KycAmlProviderSession = {
  sessionId: 'kyc-sess-889124',
  provider: 'Sumsub',
  applicantId: 'appl_6619a82c47f9a1',
  status: 'approved',
  riskScore: 'LOW',
  pepSanctionResult: 'CLEARED',
  ipAddress: '82.165.197.102 (London, UK)',
  deviceFingerprint: 'FP-SHA256-4b829c91f0923e',
  webhookLog: [
    {
      eventId: 'evt-1001',
      event: 'applicant.created',
      timestamp: '2026-01-15 14:10:02',
      payloadSummary: 'Applicant profile registered; Web SDK token issued for client-side document capture.'
    },
    {
      eventId: 'evt-1002',
      event: 'documents.submitted',
      timestamp: '2026-01-15 14:14:28',
      payloadSummary: 'Uploaded UK Passport & Barclays Bank statement. Automated OCR extracted name and DOB.'
    },
    {
      eventId: 'evt-1003',
      event: 'screening.completed',
      timestamp: '2026-01-15 14:15:45',
      payloadSummary: 'Sanctions list (OFAC, UK HMT, EU) screened clean. PEP check CLEARED. Risk Score: LOW.'
    },
    {
      eventId: 'evt-1004',
      event: 'applicant.reviewed',
      timestamp: '2026-01-16 09:00:12',
      payloadSummary: 'Manual compliance review completed. Status upgraded to APPROVED (Tier 3).'
    }
  ]
};

export const INITIAL_MANAGED_CLIENTS: UserProfile[] = [
  {
    id: 'usr-client-002',
    name: 'Alexander Vance',
    email: 'alexander@vance-holdings.ch',
    role: 'user',
    phone: '+41 44 211 4400',
    accountNumber: 'NCB-CH-992104',
    city: 'Zurich',
    country: 'Switzerland',
    kycStatus: 'verified',
    kycTier: 3,
    kycSubmittedAt: '2026-02-28',
    kycApprovedAt: '2026-03-01',
    referralCode: 'VANCE-ZURICH',
    rank: 'Diamond',
    badges: ['badge-pioneer', 'badge-bullion', 'badge-diamond'],
    twoFactorEnabled: true,
    registeredAt: '2026-01-20',
    referralDirectCount: 14,
    referralNetworkCount: 68,
    referralEarningsUsd: 48900,
    clientPanelRequested: true,
    clientPanelRequestDate: '2026-03-01',
    clientPanelRequestReason: 'Requesting Client Panel to configure private $2.5M treasury yield vaults and issue corporate virtual cards for Zurich associates.',
    delegatedPermissions: {
      hasClientPanelAccess: true,
      panelAccessLevel: 'vip_partner',
      approvedByOwnerAt: '2026-03-02',
      approvalNotes: 'Accredited Swiss family office approved by Platform Owner for custom yield vaults & virtual card issuing.',
      canCreateCustomVaults: true,
      canIssueVirtualCards: true,
      canManageSubAffiliates: true,
      canListMarketplaceProducts: false,
      canAccessAdvancedRoiSim: true,
      canExecuteOtcTranches: true,
      canAccessApiKeys: true,
      maxDelegatedDailyLimitUsd: 500000
    }
  },
  {
    id: 'usr-client-003',
    name: 'Elena Rostova',
    email: 'elena@apexcapital.ae',
    role: 'user',
    phone: '+971 4 388 9100',
    accountNumber: 'NCB-UAE-481902',
    city: 'Dubai (DIFC)',
    country: 'United Arab Emirates',
    kycStatus: 'verified',
    kycTier: 3,
    kycSubmittedAt: '2026-02-15',
    kycApprovedAt: '2026-02-18',
    referralCode: 'APEX-DUBAI-26',
    rank: 'Diamond',
    badges: ['badge-pioneer', 'badge-highroller', 'badge-community', 'badge-diamond'],
    twoFactorEnabled: true,
    registeredAt: '2026-01-18',
    referralDirectCount: 32,
    referralNetworkCount: 194,
    referralEarningsUsd: 124500,
    clientPanelRequested: true,
    clientPanelRequestDate: '2026-02-18',
    clientPanelRequestReason: 'Applying for full Delegated Operator permissions to manage regional downline brokers, OTC reserve tranches, and corporate crypto cards.',
    delegatedPermissions: {
      hasClientPanelAccess: true,
      panelAccessLevel: 'delegated_operator',
      approvedByOwnerAt: '2026-02-20',
      approvalNotes: 'Licensed regional UAE broker granted delegated operator controls by Platform Owner.',
      canCreateCustomVaults: true,
      canIssueVirtualCards: true,
      canManageSubAffiliates: true,
      canListMarketplaceProducts: true,
      canAccessAdvancedRoiSim: true,
      canExecuteOtcTranches: true,
      canAccessApiKeys: true,
      maxDelegatedDailyLimitUsd: 1000000
    }
  },
  {
    id: 'usr-client-004',
    name: 'Marcus Thorne',
    email: 'm.thorne@mayfairmerchants.co.uk',
    role: 'user',
    phone: '+44 20 7946 0912',
    accountNumber: 'NCB-UK-110293',
    city: 'London (Mayfair)',
    country: 'United Kingdom',
    kycStatus: 'verified',
    kycTier: 2,
    kycSubmittedAt: '2026-03-02',
    kycApprovedAt: '2026-03-04',
    referralCode: 'MAYFAIR-UK',
    rank: 'Gold',
    badges: ['badge-pioneer', 'badge-bullion'],
    twoFactorEnabled: true,
    registeredAt: '2026-02-01',
    referralDirectCount: 6,
    referralNetworkCount: 22,
    referralEarningsUsd: 14200,
    clientPanelRequested: true,
    clientPanelRequestDate: '2026-03-05',
    clientPanelRequestReason: 'Applying for Marketplace Merchant listing control to sell authenticated Casascius Bitcoins and physical bullion directly through Nile Marketplace.',
    delegatedPermissions: {
      hasClientPanelAccess: false,
      panelAccessLevel: 'standard_investor',
      canCreateCustomVaults: false,
      canIssueVirtualCards: false,
      canManageSubAffiliates: false,
      canListMarketplaceProducts: false,
      canAccessAdvancedRoiSim: true,
      canExecuteOtcTranches: false,
      canAccessApiKeys: false,
      maxDelegatedDailyLimitUsd: 50000
    }
  },
  {
    id: 'usr-client-005',
    name: 'Tariq Al-Mansoor',
    email: 'tariq@almansoor-invest.sa',
    role: 'user',
    phone: '+966 11 482 7700',
    accountNumber: 'NCB-SA-774120',
    city: 'Riyadh',
    country: 'Saudi Arabia',
    kycStatus: 'pending',
    kycTier: 1,
    kycSubmittedAt: '2026-03-10',
    referralCode: 'RIYADH-CAP',
    rank: 'Silver',
    badges: ['badge-pioneer'],
    twoFactorEnabled: false,
    registeredAt: '2026-03-08',
    referralDirectCount: 1,
    referralNetworkCount: 3,
    referralEarningsUsd: 850,
    clientPanelRequested: false,
    delegatedPermissions: {
      hasClientPanelAccess: false,
      panelAccessLevel: 'standard_investor',
      canCreateCustomVaults: false,
      canIssueVirtualCards: false,
      canManageSubAffiliates: false,
      canListMarketplaceProducts: false,
      canAccessAdvancedRoiSim: false,
      canExecuteOtcTranches: false,
      canAccessApiKeys: false,
      maxDelegatedDailyLimitUsd: 10000
    }
  }
];

