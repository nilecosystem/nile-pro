try { require('dotenv').config(); } catch (e) {}

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'nile_super_secure_production_jwt_secret_key_2026_xyz',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@nileecosystem.com',
  adminDefaultPassword: process.env.ADMIN_DEFAULT_PASSWORD || 'AdminNileSecure2026!',
  withdrawalCycles: [
    { id: 1, name: 'Cycle 1 (00:00 - 03:00 UTC)', startHour: 0, endHour: 3 },
    { id: 2, name: 'Cycle 2 (06:00 - 09:00 UTC)', startHour: 6, endHour: 9 },
    { id: 3, name: 'Cycle 3 (12:00 - 15:00 UTC)', startHour: 12, endHour: 15 },
    { id: 4, name: 'Cycle 4 (18:00 - 21:00 UTC)', startHour: 18, endHour: 21 },
  ],
  referralRates: [
    0.10, // Level 1: 10%
    0.08, // Level 2: 8%
    0.06, // Level 3: 6%
    0.05, // Level 4: 5%
    0.04, // Level 5: 4%
    0.03, // Level 6: 3%
    0.02, // Level 7: 2%
    0.015, // Level 8: 1.5%
    0.01,  // Level 9: 1%
    0.01   // Level 10: 1%
  ],
  offices: {
    uk: {
      address: '47 Academy Street, Berwick Bassett, SN4 7DZ, UK',
      phone: '+44 7552 847468',
      email: 'support@nileecosystem.com'
    },
    uae: {
      address: 'Dubai, Business Bay, UAE',
      phone: '+44 7552 847468',
      email: 'dubai@nileecosystem.com'
    }
  }
};
