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
 * Determine daily profit percent based on plan type and amount
 */
const calculateProfitRate = (planType, amount, customPercent = 0.0) => {
  if (planType === 'AMOUNT_TIER') {
    const tier = AMOUNT_TIERS.find(t => amount >= t.min);
    return tier ? tier.dailyPercent : 0.0;
  }
  return customPercent;
};

/**
 * Create a new user investment with support for NILE 2x multiplier
 */
const createInvestment = async ({ userId, planId, amount, paymentSource = 'INTERNAL_WALLET' }) => {
  if (!prisma) throw new Error('Database unavailable');
  if (amount <= 0) throw new Error('Investment amount must be positive.');

  const plan = await prisma.investmentPlan.findUnique({ where: { id: planId } });
  if (!plan || !plan.isActive) throw new Error('Invalid or inactive investment plan.');

  if (amount < plan.minDeposit) {
    throw new Error(`Minimum investment for this plan is ${plan.minDeposit} USDT.`);
  }
  if (plan.maxDeposit && amount > plan.maxDeposit) {
    throw new Error(`Maximum investment for this plan is ${plan.maxDeposit} USDT.`);
  }

  // Deduct from appropriate user wallet
  const isNileFunding = (paymentSource === 'NILE_TOKEN');
  const currencyToDeduct = isNileFunding ? 'NILE' : 'USDT';
  const walletType = isNileFunding ? 'INTERNAL' : 'INTERNAL';

  const userWallet = await prisma.wallet.findUnique({
    where: {
      userId_type_currency: {
        userId,
        type: walletType,
        currency: currencyToDeduct
      }
    }
  });

  if (!userWallet || userWallet.balance < amount) {
    throw new Error(`Insufficient ${currencyToDeduct} balance in wallet.`);
  }

  // Base daily percentage
  let baseDailyPercent = 0;
  if (plan.planType === 'AMOUNT_TIER') {
    baseDailyPercent = calculateProfitRate('AMOUNT_TIER', amount);
  } else {
    baseDailyPercent = plan.dailyProfitPercent || 0;
  }

  // NILE TOKEN DOUBLE RULE: If funded with NILE token -> ALL investment profits are doubled!
  const effectiveDailyPercent = isNileFunding ? (baseDailyPercent * 2) : baseDailyPercent;
  const dailyProfitAmount = (amount * effectiveDailyPercent) / 100;

  // Compute maturity date for Time-Locked plans
  let maturityDate = null;
  if (plan.lockDays > 0) {
    maturityDate = new Date();
    maturityDate.setDate(maturityDate.getDate() + plan.lockDays);
  }

  // Transactionally debit wallet, credit investment wallet record, and distribute referral rewards
  const result = await prisma.$transaction(async (tx) => {
    // 1. Debit funding wallet
    await tx.wallet.update({
      where: { id: userWallet.id },
      data: { balance: { decrement: amount } }
    });

    // 2. Increment Investment Wallet balance ledger
    await tx.wallet.update({
      where: {
        userId_type_currency: {
          userId,
          type: 'INVESTMENT',
          currency: currencyToDeduct
        }
      },
      data: { balance: { increment: amount } }
    });

    // 3. Create Investment record
    const investment = await tx.userInvestment.create({
      data: {
        userId,
        planId,
        amount,
        currency: currencyToDeduct,
        paymentSource,
        fundedWithNile: isNileFunding,
        dailyProfitPercent: effectiveDailyPercent,
        dailyProfitAmount,
        maturityDate,
        status: 'ACTIVE'
      }
    });

    return investment;
  });

  return result;
};

/**
 * Daily Profit Calculation Engine
 * Calculates and credits profits to users, respecting plan rules and NILE double bonus
 */
const runDailyProfitDistribution = async () => {
  if (!prisma) return { processed: 0, totalProfitDistributed: 0 };

  const now = new Date();
  const activeInvestments = await prisma.userInvestment.findMany({
    where: { status: 'ACTIVE' },
    include: { plan: true, user: true }
  });

  let count = 0;
  let totalDistributed = 0;

  for (const inv of activeInvestments) {
    // Check if time-locked plan has reached maturity
    if (inv.maturityDate && now >= inv.maturityDate) {
      if (inv.plan.planType === 'TIME_LOCKED' && inv.plan.fixedRewardPercent > 0) {
        // Apply fixed reward at maturity
        let rewardMultiplier = inv.plan.fixedRewardPercent / 100;
        if (inv.fundedWithNile) rewardMultiplier *= 2; // NILE 2x
        const reward = inv.amount * rewardMultiplier;

        await prisma.$transaction([
          // Return principal + reward to Internal wallet
          prisma.wallet.update({
            where: {
              userId_type_currency: {
                userId: inv.userId,
                type: 'INTERNAL',
                currency: inv.currency
              }
            },
            data: { balance: { increment: inv.amount + reward } }
          }),
          prisma.userInvestment.update({
            where: { id: inv.id },
            data: {
              status: 'MATURED',
              totalProfitAccrued: { increment: reward }
            }
          })
        ]);
        continue;
      }
    }

    // Daily profit distribution for ongoing investments
    if (inv.dailyProfitAmount > 0) {
      await prisma.$transaction([
        prisma.wallet.update({
          where: {
            userId_type_currency: {
              userId: inv.userId,
              type: 'INTERNAL',
              currency: inv.currency
            }
          },
          data: { balance: { increment: inv.dailyProfitAmount } }
        }),
        prisma.userInvestment.update({
          where: { id: inv.id },
          data: {
            totalProfitAccrued: { increment: inv.dailyProfitAmount },
            lastProfitRun: now
          }
        })
      ]);
      count++;
      totalDistributed += inv.dailyProfitAmount;
    }
  }

  return { processed: count, totalProfitDistributed: totalDistributed };
};

/**
 * NILE Staking System:
 * 30 days -> +50%
 * 50 days -> +100%
 * 100 days -> +250%
 */
const stakeNileTokens = async ({ userId, amount, lockDays }) => {
  if (!prisma) throw new Error('Database unavailable');
  if (amount <= 0) throw new Error('Staking amount must be positive.');

  const STAKING_CONFIG = {
    30: 50.0,   // +50%
    50: 100.0,  // +100%
    100: 250.0  // +250%
  };

  const bonusPercent = STAKING_CONFIG[lockDays];
  if (!bonusPercent) {
    throw new Error('Valid staking lock periods are strictly 30, 50, or 100 days.');
  }

  // Deduct NILE tokens from internal wallet
  const nileWallet = await prisma.wallet.findUnique({
    where: {
      userId_type_currency: {
        userId,
        type: 'INTERNAL',
        currency: 'NILE'
      }
    }
  });

  if (!nileWallet || nileWallet.balance < amount) {
    throw new Error('Insufficient NILE tokens in wallet for staking.');
  }

  const rewardNile = (amount * bonusPercent) / 100;
  const maturityDate = new Date();
  maturityDate.setDate(maturityDate.getDate() + lockDays);

  return await prisma.$transaction(async (tx) => {
    await tx.wallet.update({
      where: { id: nileWallet.id },
      data: { balance: { decrement: amount } }
    });

    return await tx.nileStaking.create({
      data: {
        userId,
        amountNile: amount,
        lockDays,
        bonusPercent,
        rewardNile,
        maturityDate,
        status: 'ACTIVE'
      }
    });
  });
};

module.exports = {
  AMOUNT_TIERS,
  calculateProfitRate,
  createInvestment,
  runDailyProfitDistribution,
  stakeNileTokens
};
