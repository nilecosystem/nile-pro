const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const referralEngine = require('../services/referralEngine');
const prisma = require('../utils/prisma');

// Get referral overview and rank
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { referralCode: true, referralRank: true }
    });

    const [directCount, totalEarnings, refWallet] = await Promise.all([
      prisma.user.count({ where: { referredById: req.user.id } }),
      prisma.referralEarning.aggregate({
        where: { referrerId: req.user.id },
        _sum: { amount: true }
      }),
      prisma.wallet.findUnique({
        where: {
          userId_type_currency: {
            userId: req.user.id,
            type: 'REFERRAL',
            currency: 'USDT'
          }
        }
      })
    ]);

    res.json({
      success: true,
      referralCode: user.referralCode,
      referralRank: user.referralRank,
      directReferralsCount: directCount,
      totalEarnedUsdt: totalEarnings._sum.amount || 0.0,
      referralWalletBalance: refWallet ? refWallet.balance : 0.0,
      commissionRates: referralEngine.REFERRAL_RATES
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get 10-level referral breakdown
router.get('/tree', authenticateToken, async (req, res) => {
  try {
    const earningsByLevel = await prisma.referralEarning.groupBy({
      by: ['level'],
      where: { referrerId: req.user.id },
      _sum: { amount: true },
      _count: { id: true }
    });

    const recentEarnings = await prisma.referralEarning.findMany({
      where: { referrerId: req.user.id },
      include: {
        referee: { select: { firstName: true, email: true, createdAt: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 25
    });

    res.json({
      success: true,
      levels: earningsByLevel,
      recentTransactions: recentEarnings
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Reinvest referral balance into investment
router.post('/reinvest', authenticateToken, async (req, res) => {
  const { amount, planId } = req.body;
  try {
    const result = await referralEngine.reinvestReferralBalance({
      userId: req.user.id,
      planId,
      amount: parseFloat(amount)
    });
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
