const prisma = require('../utils/prisma');
const config = require('../config');

// 10 Level commission structure
const REFERRAL_RATES = config.referralRates;

/**
 * Distribute multi-level referral commissions upon a verified investment
 * Commissions are stored in Referral Wallet and MUST be reinvested before withdrawal
 */
const distributeReferralCommissions = async ({ investorUserId, investmentId, amountUsdt }) => {
  if (!prisma) return [];

  const createdEarnings = [];
  let currentUserId = investorUserId;

  for (let level = 1; level <= 10; level++) {
    // Lookup parent referrer
    const user = await prisma.user.findUnique({
      where: { id: currentUserId },
      select: { referredById: true }
    });

    if (!user || !user.referredById) break; // Reached tree root

    const referrerId = user.referredById;
    const rate = REFERRAL_RATES[level - 1] || 0.01;
    const commissionAmount = amountUsdt * rate;

    // Credit Referral Wallet of referrer
    await prisma.$transaction([
      prisma.wallet.update({
        where: {
          userId_type_currency: {
            userId: referrerId,
            type: 'REFERRAL',
            currency: 'USDT'
          }
        },
        data: { balance: { increment: commissionAmount } }
      }),
      prisma.referralEarning.create({
        data: {
          referrerId,
          refereeId: investorUserId,
          investmentId,
          level,
          percent: rate * 100,
          amount: commissionAmount,
          reinvested: false
        }
      })
    ]);

    // Check rank progression for referrer
    await updateReferralRank(referrerId);

    createdEarnings.push({ referrerId, level, amount: commissionAmount });
    currentUserId = referrerId;
  }

  return createdEarnings;
};

/**
 * Update user referral rank based on team volume, active referees, and personal investment
 * Ranks: Bronze -> Silver -> Gold -> Platinum -> Diamond
 */
const updateReferralRank = async (userId) => {
  if (!prisma) return;

  const [directReferrals, personalInvestments, teamEarnings] = await Promise.all([
    prisma.user.count({ where: { referredById: userId } }),
    prisma.userInvestment.aggregate({
      where: { userId, status: 'ACTIVE' },
      _sum: { amount: true }
    }),
    prisma.referralEarning.aggregate({
      where: { referrerId: userId },
      _sum: { amount: true }
    })
  ]);

  const activeReferees = directReferrals;
  const personalVolume = personalInvestments._sum.amount || 0;
  const teamVolume = (teamEarnings._sum.amount || 0) * 10; // Estimated team turnover

  let newRank = 'BRONZE';
  if (teamVolume >= 500000 && activeReferees >= 50 && personalVolume >= 10000) {
    newRank = 'DIAMOND';
  } else if (teamVolume >= 100000 && activeReferees >= 25 && personalVolume >= 5000) {
    newRank = 'PLATINUM';
  } else if (teamVolume >= 25000 && activeReferees >= 10 && personalVolume >= 1000) {
    newRank = 'GOLD';
  } else if (teamVolume >= 5000 && activeReferees >= 5 && personalVolume >= 250) {
    newRank = 'SILVER';
  }

  await prisma.user.update({
    where: { id: userId },
    data: { referralRank: newRank }
  });
};

/**
 * Reinvest referral earnings rule:
 * Users MUST reinvest funds from Referral Wallet into an active investment plan before they can be withdrawn
 */
const reinvestReferralBalance = async ({ userId, planId, amount }) => {
  if (!prisma) throw new Error('Database unavailable');
  if (amount <= 0) throw new Error('Reinvestment amount must be positive.');

  const refWallet = await prisma.wallet.findUnique({
    where: { userId_type_currency: { userId, type: 'REFERRAL', currency: 'USDT' } }
  });

  if (!refWallet || refWallet.balance < amount) {
    throw new Error('Insufficient balance in Referral Wallet.');
  }

  // Deduct from Referral wallet and credit Internal wallet or directly create investment
  await prisma.wallet.update({
    where: { id: refWallet.id },
    data: { balance: { decrement: amount } }
  });

  await prisma.wallet.update({
    where: { userId_type_currency: { userId, type: 'INTERNAL', currency: 'USDT' } },
    data: { balance: { increment: amount } }
  });

  // Mark pending referral earnings as reinvested
  await prisma.referralEarning.updateMany({
    where: { referrerId: userId, reinvested: false },
    data: { reinvested: true }
  });

  return { success: true, message: 'Referral funds successfully converted and unlocked for investment.' };
};

module.exports = {
  REFERRAL_RATES,
  distributeReferralCommissions,
  updateReferralRank,
  reinvestReferralBalance
};
