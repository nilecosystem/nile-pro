const prisma = require('../utils/prisma');
const config = require('../config');

/**
 * Identify the current active withdrawal cycle window
 * 4 cycles per day, 3 hours open window each
 */
const getCurrentCycleWindow = () => {
  const currentHour = new Date().getUTCHours();
  const cycles = config.withdrawalCycles;
  
  for (const cycle of cycles) {
    if (currentHour >= cycle.startHour && currentHour < cycle.endHour) {
      return { active: true, cycle: cycle.name, cycleId: cycle.id };
    }
  }

  // Find next upcoming cycle
  const nextCycle = cycles.find(c => c.startHour > currentHour) || cycles[0];
  return {
    active: false,
    message: `Withdrawal window closed. Next cycle opens at ${nextCycle.startHour}:00 UTC (${nextCycle.name}).`,
    nextCycle
  };
};

/**
 * Submit withdrawal request
 */
const requestWithdrawal = async ({ userId, walletType = 'INTERNAL', amount, currency = 'USDT', toAddress, network }) => {
  if (!prisma) throw new Error('Database unavailable');
  if (amount <= 0) throw new Error('Withdrawal amount must be positive.');
  if (!toAddress) throw new Error('Destination wallet address is required.');

  // Check 4 daily cycles window
  const cycleInfo = getCurrentCycleWindow();
  const currentCycleTag = cycleInfo.active ? cycleInfo.cycle : `Off-cycle Request (Queued for ${cycleInfo.nextCycle.name})`;

  // Referral wallet rule: Cannot withdraw directly from Referral wallet without reinvesting
  if (walletType === 'REFERRAL') {
    throw new Error('Referral wallet balances must be reinvested into active plans before withdrawal.');
  }

  const wallet = await prisma.wallet.findUnique({
    where: { userId_type_currency: { userId, type: walletType, currency } }
  });

  if (!wallet || wallet.balance < amount) {
    throw new Error(`Insufficient funds in ${walletType} wallet. Available balance: ${wallet ? wallet.balance : 0} ${currency}`);
  }

  // Deduct balance and create PENDING withdrawal request
  return await prisma.$transaction(async (tx) => {
    await tx.wallet.update({
      where: { id: wallet.id },
      data: { balance: { decrement: amount } }
    });

    return await tx.withdrawal.create({
      data: {
        userId,
        walletId: wallet.id,
        amount,
        currency,
        toAddress,
        network: network || 'TRC20',
        cycleWindow: currentCycleTag,
        status: 'PENDING'
      }
    });
  });
};

/**
 * Admin manual approval with TXID recording
 */
const approveWithdrawal = async ({ withdrawalId, adminId, payoutTxid, reason = 'Admin approved payout' }) => {
  if (!prisma) throw new Error('Database unavailable');
  if (!payoutTxid) throw new Error('Recorded payout TXID is required for approval.');

  const withdrawal = await prisma.withdrawal.findUnique({
    where: { id: withdrawalId }
  });

  if (!withdrawal) throw new Error('Withdrawal request not found.');
  if (withdrawal.status !== 'PENDING') throw new Error(`Withdrawal already ${withdrawal.status}.`);

  return await prisma.withdrawal.update({
    where: { id: withdrawalId },
    data: {
      status: 'APPROVED',
      payoutTxid,
      approvedBy: adminId,
      approvedAt: new Date()
    }
  });
};

/**
 * Admin reject withdrawal and refund wallet balance
 */
const rejectWithdrawal = async ({ withdrawalId, adminId, rejectionReason = 'Rejected by compliance' }) => {
  if (!prisma) throw new Error('Database unavailable');

  const withdrawal = await prisma.withdrawal.findUnique({
    where: { id: withdrawalId }
  });

  if (!withdrawal || withdrawal.status !== 'PENDING') {
    throw new Error('Invalid or already processed withdrawal.');
  }

  return await prisma.$transaction([
    prisma.wallet.update({
      where: { id: withdrawal.walletId },
      data: { balance: { increment: withdrawal.amount } }
    }),
    prisma.withdrawal.update({
      where: { id: withdrawalId },
      data: {
        status: 'REJECTED',
        rejectionReason,
        approvedBy: adminId,
        approvedAt: new Date()
      }
    })
  ]);
};

module.exports = {
  getCurrentCycleWindow,
  requestWithdrawal,
  approveWithdrawal,
  rejectWithdrawal
};
