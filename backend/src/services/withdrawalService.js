const prisma = require('../utils/prisma');
const config = require('../config');

/**
 * Identify the current active withdrawal cycle window
 */
const getCurrentCycleWindow = () => {
  const currentHour = new Date().getUTCHours();
  const cycles = config.withdrawalCycles;

  for (const cycle of cycles) {
    if (currentHour >= cycle.startHour && currentHour < cycle.endHour) {
      return { active: true, cycle: cycle.name, cycleId: cycle.id };
    }
  }

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
  if (amount <= 0) throw new Error('Withdrawal amount must be positive.');
  if (!toAddress) throw new Error('Destination wallet address is required.');

  const cycleInfo = getCurrentCycleWindow();
  const currentCycleTag = cycleInfo.active ? cycleInfo.cycle : `Off-cycle Request (Queued for ${cycleInfo.nextCycle.name})`;

  if (walletType === 'REFERRAL') {
    throw new Error('Referral wallet balances must be reinvested before withdrawal.');
  }

  const wallet = await prisma.wallet.findUnique({
    where: { userId_type_currency: { userId, type: walletType, currency } }
  });

  if (!wallet || wallet.balance < amount) {
    throw new Error(`Insufficient funds in ${walletType} wallet. Available: ${wallet ? wallet.balance : 0} ${currency}`);
  }

  const withdrawal = await prisma.$transaction(async (tx) => {
    await tx.wallet.update({ where: { id: wallet.id }, data: { balance: { decrement: amount } } });
    return tx.withdrawal.create({
      data: { userId, walletId: wallet.id, amount, currency, toAddress, network: network || 'TRC20', cycleWindow: currentCycleTag, status: 'PENDING' }
    });
  });

  return { success: true, message: 'Withdrawal request submitted.', withdrawal };
};

/**
 * Admin manual approval
 */
const approveWithdrawal = async ({ withdrawalId, adminId, payoutTxid, reason = 'Admin approved payout' }) => {
  if (!payoutTxid) throw new Error('Payout TXID is required.');

  const withdrawal = await prisma.withdrawal.findUnique({ where: { id: withdrawalId } });
  if (!withdrawal) throw new Error('Withdrawal not found.');
  if (withdrawal.status !== 'PENDING') throw new Error(`Already ${withdrawal.status}.`);

  const updated = await prisma.withdrawal.update({
    where: { id: withdrawalId },
    data: { status: 'APPROVED', payoutTxid, approvedBy: adminId, approvedAt: new Date(), approvalNotes: reason }
  });

  return { success: true, message: 'Withdrawal approved.', withdrawal: updated };
};

/**
 * Admin reject withdrawal and refund wallet
 */
const rejectWithdrawal = async ({ withdrawalId, adminId, rejectionReason = 'Rejected by compliance' }) => {
  const withdrawal = await prisma.withdrawal.findUnique({ where: { id: withdrawalId } });
  if (!withdrawal || withdrawal.status !== 'PENDING') throw new Error('Invalid or already processed withdrawal.');

  const [walletRefunded, withdrawalUpdated] = await prisma.$transaction([
    prisma.wallet.update({ where: { id: withdrawal.walletId }, data: { balance: { increment: withdrawal.amount } } }),
    prisma.withdrawal.update({
      where: { id: withdrawalId },
      data: { status: 'REJECTED', rejectionReason, approvedBy: adminId, approvedAt: new Date() }
    })
  ]);

  return { success: true, message: 'Withdrawal rejected and funds refunded.', wallet: walletRefunded, withdrawal: withdrawalUpdated };
};

module.exports = { getCurrentCycleWindow, requestWithdrawal, approveWithdrawal, rejectWithdrawal };
