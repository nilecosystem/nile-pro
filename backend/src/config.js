// src/backend/main/config.js

module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'supersecretkey',
  referralRates: [0.10, 0.05, 0.03, 0.02, 0.01, 0.01, 0.005, 0.005, 0.0025, 0.0025], // 10-level structure
  withdrawalCycles: [
    { id: 1, name: 'Cycle 1', startHour: 0, endHour: 3 },
    { id: 2, name: 'Cycle 2', startHour: 6, endHour: 9 },
    { id: 3, name: 'Cycle 3', startHour: 12, endHour: 15 },
    { id: 4, name: 'Cycle 4', startHour: 18, endHour: 21 }
  ],
  treasuryWallets: {
    EVM: process.env.TREASURY_EVM || '0xYourEthereumTreasuryAddress',
    TRON: process.env.TREASURY_TRON || 'TYourTronTreasuryAddress',
    BTC: process.env.TREASURY_BTC || 'YourBitcoinTreasuryAddress'
  },
  usdtContracts: {
    ERC20: process.env.USDT_ERC20 || '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    BEP20: process.env.USDT_BEP20 || '0x55d398326f99059fF775485246999027B3197955',
    TRC20: process.env.USDT_TRC20 || 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
  }
};
