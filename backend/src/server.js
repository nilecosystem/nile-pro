const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const config = require('./config');

const authRoutes = require('./routes/authRoutes');
const walletRoutes = require('./routes/walletRoutes');
const investmentRoutes = require('./routes/investmentRoutes');
const referralRoutes = require('./routes/referralRoutes');
const shopRoutes = require('./routes/shopRoutes');
const academyRoutes = require('./routes/academyRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { runDailyProfitDistribution } = require('./services/investmentEngine');
const paymentGatewayRoutes = require('./routes/paymentGatewayRoutes');
// ...
app.use('/api/payments', paymentGatewayRoutes);

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: config.corsOrigin === '*' ? '*' : config.corsOrigin.split(','),
  credentials: true
}));

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, message: 'Too many requests from this IP, please try again later.' }
});
app.use('/api/', limiter);

// Logging & Body Parsers
if (config.nodeEnv !== 'test') {
  app.use(morgan('combined'));
}
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'NILE INVESTMENT',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    offices: config.offices
  });
});

// Mount Platform Routers
app.use('/api/auth', authRoutes);
app.use('/api/wallets', walletRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/academy', academyRoutes);
app.use('/api/admin', adminRoutes);

// Daily Profit Engine Runner (Runs every 24 hours in production background)
setInterval(async () => {
  try {
    const res = await runDailyProfitDistribution();
    console.log(`[DAILY PROFIT ENGINE] Successfully distributed profits: ${res.processed} investments credited.`);
  } catch (err) {
    console.error('[DAILY PROFIT ENGINE ERROR]', err.message);
  }
}, 24 * 60 * 60 * 1000);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error occurred.'
  });
});

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(config.port, () => {
    console.log(`=======================================================`);
    console.log(`🚀 NILE INVESTMENT BACKEND ONLINE ON PORT ${config.port}`);
    console.log(`🌍 UK Office: ${config.offices.uk.address}`);
    console.log(`🏢 UAE Office: ${config.offices.uae.address}`);
    console.log(`=======================================================`);
  });
}

module.exports = app;
