// OFFICIAL REAL TREASURY WALLETS & BANK CARDS CONFIGURATION
// NILE Investment Platform & NILE Crypto Bank (NCB)

export interface TreasuryCryptoWallets {
  BTC_NATIVE: string;
  BTC_LEGACY: string;
  ETH_BNB: string;
  TRON: string;
  SOLANA_PRIMARY: string;
  SOLANA_SECONDARY: string;
  BCH: string;
  ETC: string;
  XRP: string;
}

export interface TreasuryBankCard {
  id: string;
  title: string;
  cardholderName: string;
  cardNumber: string;
  network: 'visa' | 'mastercard';
  tier: string;
  currenciesAccepted: string[];
}

export interface OfficialSupportDesk {
  ownerEmail: string;
  infoEmail: string;
  supportEmail: string;
  phoneDesk: string;
  whatsappDesk: string;
  whatsappUrl: string;
  telegramDesk: string;
  telegramUrl: string;
  twitterUrl: string;
  youtubeUrl: string;
  website: string;
  registeredCompanyUK: string;
  companyNumberUK: string;
  vatUK: string;
  commercialCourtVienna: string;
  vatAustria: string;
  taxAuthorityDubai: string;
  trnDubai: string;
  onChainTreasuryBtcTxid: string;
}

export const TREASURY_CRYPTO_WALLETS: TreasuryCryptoWallets = {
  // Bitcoin (BTC Native SegWit)
  BTC_NATIVE: 'bc1qhcyuprv4m2akkflcy3aszmx5wggzzadf42y3as',
  // Bitcoin (BTC Legacy Standard)
  BTC_LEGACY: '1KisoLQNGUZKSG3PZZcfGUn2RUTpBRfsZB',
  // Ethereum & BNB Smart Chain (All ERC20 / BEP20 tokens)
  ETH_BNB: '0x9ad1Faa6d1DBDC047001b16eA1ced073a6058399',
  // TRON Network (TRX & USDT-TRC20)
  TRON: 'TE5QqMoBbLbTkUtkcfe93WTyH9ytm78zaR',
  // Solana Primary Vault (SOL & SPL tokens)
  SOLANA_PRIMARY: '8XPTkroufgEDJoCLM9KDBhMZzaBzo6FfdHpvaHcWbTpE',
  // Solana Secondary Vault
  SOLANA_SECONDARY: 'FGucaYXLFpeFVAQP6cUW8vsVpjo55MjeBgqPrRuNLCfj',
  // Bitcoin Cash (BCH)
  BCH: 'qqyvysrxd72yxa04kj703vd6tt63axnkdv7heyzc8l',
  // Ethereum Classic (ETC)
  ETC: '0x8Df46ed561dE2e92DB979ED1fbE183748F636250',
  // XRP Ledger (XRP)
  XRP: 'rJ8MNvjZhSHShg3uwQLnZwbyaCRTmTXmSf'
};

export const TREASURY_BANK_CARDS: TreasuryBankCard[] = [
  {
    id: 'card-visa-plat',
    title: 'VISA Platinum International',
    cardholderName: 'Matin Parsa',
    cardNumber: '4319590004233787',
    network: 'visa',
    tier: 'Platinum International',
    currenciesAccepted: ['USD', 'EUR', 'GBP']
  },
  {
    id: 'card-mc-black',
    title: 'Mastercard World Black',
    cardholderName: 'Matin Parsa',
    cardNumber: '5205812310475546',
    network: 'mastercard',
    tier: 'World Black Elite',
    currenciesAccepted: ['USD', 'EUR', 'GBP']
  },
  {
    id: 'card-mc-commercial',
    title: 'Mastercard Commercial Elite',
    cardholderName: 'Matin Parsa',
    cardNumber: '5331714100448336',
    network: 'mastercard',
    tier: 'Commercial Elite',
    currenciesAccepted: ['USD', 'EUR', 'GBP']
  }
];

export const OFFICIAL_SUPPORT_CHANNELS: OfficialSupportDesk = {
  ownerEmail: 'owner@nileecosystem.com',
  infoEmail: 'info@nileecosystem.com',
  supportEmail: 'support@nileecosystem.com',
  phoneDesk: '+447558847468',
  whatsappDesk: '+447552847468',
  whatsappUrl: 'https://wa.me/447552847468',
  telegramDesk: '@Nile_support',
  telegramUrl: 'https://t.me/Nile_support',
  twitterUrl: 'https://x.com/nileecosystem',
  youtubeUrl: 'https://www.youtube.com/@Nilecosystem',
  website: 'https://nileecosystem.com',
  registeredCompanyUK: 'NILE INVESTMENT LTD',
  companyNumberUK: '08253865',
  vatUK: 'GB 853 3471 65',
  commercialCourtVienna: 'FN 674459 m',
  vatAustria: 'ATU-69250650',
  taxAuthorityDubai: 'Federal Tax Authority (FTA), Dubai, UAE',
  trnDubai: 'TRN 100820028255333',
  onChainTreasuryBtcTxid: '900d114ebb2cd6f9daae5f4474a0f7dce9292d51c5478810fa21939c19fb885f'
};

export default {
  wallets: TREASURY_CRYPTO_WALLETS,
  cards: TREASURY_BANK_CARDS,
  support: OFFICIAL_SUPPORT_CHANNELS
};
