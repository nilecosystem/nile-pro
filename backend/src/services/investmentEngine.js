const prisma = require('../utils/prisma');

// Plan 3 Amount-based tiers
const AMOUNT_TIERS = [
  { min: 10000, dailyPercent: 12.0 },
  { min: 1000, dailyPercent: 6.0 },
  { min: 500, dailyPercent: 3.0 },
  { min: 100, dailyPercent: 1.5 },
  { min: 50, dailyPercent: 0.75 },
  { min: 10, dailyPercent: 0.25 },
];

/**
 * Determine daily profit percent
 */
const calculateProfitRate = (planType, amount, customPercent = 0.0) => {
  if (planType === 'AMOUNT_TIER') {
    const tier = AMOUNT_TIERS.find(t => amount >= t.min);
    return tier ? tier.dailyPercent : 0.0;
  }
  return customPercent;
};

/**
 * Create a new investment
 */
const createInvestment = async ({ userId, planId, amount, paymentSource = 'INTERNAL_WALLET' }) => {
  if (amount <= 0) throw new Error('Investment amount must be positive.');

  const plan = await prisma.investmentPlan.findUnique({ where: { id: planId } });
  if (!plan || !plan.isActive) throw new Error('Invalid or inactive plan.');
  if (amount < plan.minDeposit) throw new Error(`Minimum investment is ${plan.minDeposit} USDT.`);
  if (plan.maxDeposit && amount > plan.maxDeposit) throw new Error(`Maximum investment is ${plan.maxDeposit} USDT.`);

  const isNileFunding = (paymentSource === 'NILE_TOKEN');
  const currencyToDeduct = isNileFunding ? 'NILE' : 'USDT';

  const userWallet = await prisma.wallet.findUnique({
    where: { userId_type_currency: { userId, type: 'INTERNAL', currency: currencyToDeduct } }
  });
  if (!userWallet || userWallet.balance < amount) throw new Error(`Insufficient ${currencyToDeduct} balance.`);

  let baseDailyPercent = plan.planType === 'AMOUNT_TIER'
    ? calculateProfitRate('AMOUNT_TIER', amount)
    : plan.dailyProfitPercent || 0;

  const effectiveDailyPercent = isNileFunding ? (baseDailyPercent * 2) : baseDailyPercent;
  const dailyProfitAmount = (amount * effectiveDailyPercent) / 100;

  let maturityDate = null;
  if (plan.lockDays > 0) {
    maturityDate = new Date();
    maturityDate.setDate(maturityDate.getDate() + plan.lockDays);
  }

  const investment = await prisma.$transaction(async (tx) => {
    await tx.wallet.update({ where: { id: userWallet.id }, data: { balance: { decrement: amount } } });
    await tx.wallet.update({
      where: { userId_type_currency: { userId, type: 'INVESTMENT', currency: currencyToDeduct } },
      data: { balance: { increment: amount } }
    });

    return tx.userInvestment.create({
      data: {
        userId, planId, amount, currency: currencyToDeduct,
        paymentSource, fundedWithNile: isNileFunding,
        dailyProfitPercent: effectiveDailyPercent,
        dailyProfitAmount, maturityDate, status: 'ACTIVE'
      }
    });
  });

  return { success: true, message: 'Investment created successfully.', investment };
};

/**
 * Daily Profit Distribution Engine
 */
const runDailyProfitDistribution = async () => {
  const now = new Date();
  const activeInvestments = await prisma.userInvestment.findMany({ where: { status: 'ACTIVE' }, include: { plan: true } });

  let count = 0, totalDistributed = 0;

  for (const inv of activeInvestments) {
    if (inv.maturityDate && now >= inv.maturityDate && inv.plan.planType === 'TIME_LOCKED') {
      let rewardMultiplier = inv.plan.fixedRewardPercent / 100;
      if (inv.fundedWithNile) rewardMultiplier *= 2;
      const reward = inv.amount * rewardMultiplier;

      await prisma.$transaction([
        prisma.wallet.update({
          where: { userId_type_currency: { userId: inv.userId, type: 'INTERNAL', currency: inv.currency } },
          data: { balance: { increment: inv.amount + reward } }
        }),
        prisma.userInvestment.update({
          where: { id: inv.id },
          data: { status: 'MATURED', totalProfitAccrued: { increment: reward } }
        })
      ]);
      continue;
    }

    if (inv.dailyProfitAmount > 0) {
      await prisma.$transaction([
        prisma.wallet.update({
          where: { userId_type_currency: { userId: inv.userId, type: 'INTERNAL', currency: inv.currency } },
          data: { balance: { increment: inv.dailyProfitAmount } }
        }),
        prisma.userInvestment.update({
          where: { id: inv.id },
          data: { totalProfitAccrued: { increment: inv.dailyProfitAmount }, lastProfitRun: now }
        })
      ]);
      count++;
      totalDistributed += inv.dailyProfitAmount;
    }
  }

  return { success: true, message: 'Daily profit run completed.', processed: count, totalProfitDistributed: totalDistributed };
};

/**
 * NILE Staking System
 */
const stakeNileTokens = async ({ userId, amount, lockDays }) => {
  if (amount <= 0) throw new Error('Staking amount must be positive.');

  const STAKING_CONFIG = { 30: 50.0, 50: 100.0, 100: 250.0 };
  const bonusPercent = STAKING_CONFIG[lockDays];
  if (!bonusPercent) throw new Error('Valid lock periods: 30, 50, 100 days.');

  const nileWallet = await prisma.wallet.findUnique({ where: { userId_type_currency: { userId, type: 'INTERNAL', currency: 'NILE' } } });
  if (!nileWallet || nileWallet.balance < amount) throw new Error('Insufficient NILE tokens.');

  const rewardNile = (amount * bonusPercent) / 100;
  const maturityDate = new Date(); maturityDate.setDate(maturityDate.getDate() + lockDays);

  const staking = await prisma.$transaction(async (tx) => {
    await tx.wallet.update({ where: { id: nileWallet.id }, data: { balance: { decrement: amount } } });
    return tx.nileStaking.create({ data: { userId, amountNile: amount, lockDays, bonusPercent, rewardNile, maturityDate, status: 'ACTIVE' } });
  });

  return { success: true, message: `Successfully staked ${amount} NILE for ${lockDays} days.`, staking };
};

module.exports = { AMOUNT_TIERS, calculateProfitRate, createInvestment, runDailyProfitDistribution, stakeNileTokens };
