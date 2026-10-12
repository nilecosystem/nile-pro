const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const investmentEngine = require('../services/investmentEngine');
const { distributeReferralCommissions } = require('../services/referralEngine');
const prisma = require('../utils/prisma');

// Get all available investment plans
router.get('/plans', async (req, res) => {
  try {
    const plans = await prisma.investmentPlan.findMany({
      where: { isActive: true },
      orderBy: { minDeposit: 'asc' }
    });
    res.json({ success: true, plans, amountTiers: investmentEngine.AMOUNT_TIERS });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Profit simulator / preview
router.post('/simulate', (req, res) => {
  const { planType, amount, lockDays, isNileFunded } = req.body;
  const numAmount = parseFloat(amount) || 0;

  let baseDailyRate = 0;
  if (planType === 'AMOUNT_TIER') {
    baseDailyRate = investmentEngine.calculateProfitRate('AMOUNT_TIER', numAmount);
  } else if (planType === 'TIME_LOCKED') {
    const lockMap = { 30: 50, 50: 100, 100: 250 };
    const fixedRewardPercent = lockMap[lockDays] || 0;
    const finalRewardPercent = isNileFunded ? (fixedRewardPercent * 2) : fixedRewardPercent;
    return res.json({
      success: true,
      amount: numAmount,
      lockDays,
      isNileFunded: !!isNileFunded,
      fixedRewardPercent: finalRewardPercent,
      estimatedTotalReward: (numAmount * finalRewardPercent) / 100,
      totalMaturityPayout: numAmount + ((numAmount * finalRewardPercent) / 100)
    });
  } else {
    baseDailyRate = 1.0;
  }

  const effectiveDailyRate = isNileFunded ? (baseDailyRate * 2) : baseDailyRate;
  const dailyProfit = (numAmount * effectiveDailyRate) / 100;
  const monthlyProfit = dailyProfit * 30;

  res.json({
    success: true,
    amount: numAmount,
    isNileFunded: !!isNileFunded,
    baseDailyRate,
    effectiveDailyRate,
    dailyProfit,
    monthlyProfit,
    annualEstimatedYieldPercent: effectiveDailyRate * 365
  });
});

// Create new investment
router.post('/', authenticateToken, async (req, res) => {
  const { planId, amount, paymentSource } = req.body;
  try {
    const investment = await investmentEngine.createInvestment({
      userId: req.user.id,
      planId,
      amount: parseFloat(amount),
      paymentSource: paymentSource || 'INTERNAL_WALLET'
    });

    // Automatically trigger multi-level referral commission distribution
    try {
      await distributeReferralCommissions({
        investorUserId: req.user.id,
        investmentId: investment.id,
        amountUsdt: investment.amount
      });
    } catch (refErr) {
      console.warn('Referral distribution notice:', refErr.message);
    }

    res.status(201).json({
      success: true,
      message: investment.fundedWithNile 
        ? 'Investment active! Funded with NILE: 2x Double Profit Booster enabled!' 
        : 'Investment created successfully.',
      investment
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Get user's investments
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const investments = await prisma.userInvestment.findMany({
      where: { userId: req.user.id },
      include: { plan: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, investments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Stake NILE Tokens
router.post('/stake', authenticateToken, async (req, res) => {
  const { amount, lockDays } = req.body;
  try {
    const staking = await investmentEngine.stakeNileTokens({
      userId: req.user.id,
      amount: parseFloat(amount),
      lockDays: parseInt(lockDays, 10)
    });
    res.status(201).json({
      success: true,
      message: `Successfully staked ${staking.amountNile} NILE for ${staking.lockDays} days (+${staking.bonusPercent}% bonus reward).`,
      staking
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Get user's NILE stakings
router.get('/stakes', authenticateToken, async (req, res) => {
  try {
    const stakings = await prisma.nileStaking.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, stakings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
