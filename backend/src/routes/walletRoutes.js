const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const walletService = require('../services/walletService');
const withdrawalService = require('../services/withdrawalService');
const prisma = require('../utils/prisma');

// Get all 4 wallets for current user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const wallets = await walletService.getUserWallets(req.user.id);
    res.json({ success: true, wallets });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Deposit request with TXID
router.post('/deposit', authenticateToken, async (req, res) => {
  const { walletType, amount, currency, txid, network } = req.body;
  try {
    const deposit = await walletService.createDepositRequest({
      userId: req.user.id,
      walletType: walletType || 'INTERNAL',
      amount: parseFloat(amount),
      currency: currency || 'USDT',
      txid,
      network: network || 'TRC20'
    });
    res.status(201).json({
      success: true,
      message: 'Deposit tracked successfully. Balance will be credited upon confirmation.',
      deposit
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Current withdrawal cycle status
router.get('/cycles', authenticateToken, (req, res) => {
  const status = withdrawalService.getCurrentCycleWindow();
  res.json({ success: true, ...status });
});

// Request withdrawal
router.post('/withdraw', authenticateToken, async (req, res) => {
  const { walletType, amount, currency, toAddress, network } = req.body;
  try {
    const withdrawal = await withdrawalService.requestWithdrawal({
      userId: req.user.id,
      walletType: walletType || 'INTERNAL',
      amount: parseFloat(amount),
      currency: currency || 'USDT',
      toAddress,
      network: network || 'TRC20'
    });
    res.status(201).json({
      success: true,
      message: 'Withdrawal request submitted successfully for approval.',
      withdrawal
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Transfer funds internally
router.post('/transfer', authenticateToken, async (req, res) => {
  const { fromType, toType, amount, currency } = req.body;
  try {
    const result = await walletService.transferBetweenWallets({
      userId: req.user.id,
      fromType,
      toType,
      amount: parseFloat(amount),
      currency: currency || 'USDT'
    });
    res.json({ success: true, message: 'Internal transfer completed.', ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// History of deposits and withdrawals
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const [deposits, withdrawals] = await Promise.all([
      prisma.deposit.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: 'desc' },
        take: 20
      }),
      prisma.withdrawal.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: 'desc' },
        take: 20
      })
    ]);
    res.json({ success: true, deposits, withdrawals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
