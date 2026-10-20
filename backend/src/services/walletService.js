const prisma = require('../utils/prisma');

const WALLET_TYPES = ['INTERNAL', 'INVESTMENT', 'REFERRAL', 'SHOP'];

/**
 * Initialize all 4 ledger wallets for a new user
 */
const initializeUserWallets = async (userId) => {
  const createdWallets = [];
  for (const type of WALLET_TYPES) {
    let wallet = await prisma.wallet.findUnique({
      where: { userId_type_currency: { userId, type, currency: 'USDT' } }
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: { userId, type, currency: 'USDT', balance: 0.0 }
      });
    }
    createdWallets.push(wallet);
  }

  // Dedicated NILE wallet
  let nileWallet = await prisma.wallet.findUnique({
    where: { userId_type_currency: { userId, type: 'INTERNAL', currency: 'NILE' } }
  });

  if (!nileWallet) {
    nileWallet = await prisma.wallet.create({
      data: { userId, type: 'INTERNAL', currency: 'NILE', balance: 0.0 }
    });
    createdWallets.push(nileWallet);
  }

  return createdWallets;
};

/**
 * Get user wallets with live balance summary
 */
const getUserWallets = async (userId) => {
  let wallets = await prisma.wallet.findMany({ where: { userId } });
  if (wallets.length === 0) {
    wallets = await initializeUserWallets(userId);
  }
  return wallets;
};

/**
 * Record a pending crypto deposit
 */
const createDepositRequest = async ({ userId, walletType = 'INTERNAL', amount, currency = 'USDT', txid, network }) => {
  if (!txid || !amount || amount <= 0) {
    throw new Error('Valid amount and TXID are required.');
  }

  const existingTx = await prisma.deposit.findUnique({ where: { txid } });
  if (existingTx) throw new Error('This TXID has already been submitted.');

  const wallet = await prisma.wallet.findUnique({
    where: { userId_type_currency: { userId, type: walletType, currency } }
  });
  if (!wallet) throw new Error(`Wallet ${walletType} for ${currency} not found.`);

  return prisma.deposit.create({
    data: { userId, walletId: wallet.id, amount, currency, txid, network: network || 'TRC20', status: 'PENDING' }
  });
};

/**
 * Confirm a crypto deposit by admin
 */
const confirmDeposit = async ({ depositId, adminId }) => {
  const deposit = await prisma.deposit.findUnique({ where: { id: depositId }, include: { wallet: true } });
  if (!deposit) throw new Error('Deposit not found.');
  if (deposit.status !== 'PENDING') throw new Error(`Deposit already marked as ${deposit.status}.`);

  const [walletUpdated, depositUpdated] = await prisma.$transaction([
    prisma.wallet.update({ where: { id: deposit.walletId }, data: { balance: { increment: deposit.amount } } }),
    prisma.deposit.update({
      where: { id: depositId },
      data: { status: 'CONFIRMED', confirmedBy: adminId, confirmedAt: new Date() }
    })
  ]);

  return { success: true, message: `Deposit of ${deposit.amount} ${deposit.currency} credited.`, wallet: walletUpdated, deposit: depositUpdated };
};

/**
 * Transfer funds internally
 */
const transferBetweenWallets = async ({ userId, fromType, toType, amount, currency = 'USDT' }) => {
  if (fromType === toType) throw new Error('Source and destination wallets must differ.');
  if (amount <= 0) throw new Error('Transfer amount must be positive.');

  const sourceWallet = await prisma.wallet.findUnique({ where: { userId_type_currency: { userId, type: fromType, currency } } });
  if (!sourceWallet || sourceWallet.balance < amount) throw new Error('Insufficient balance in source wallet.');

  const destWallet = await prisma.wallet.findUnique({ where: { userId_type_currency: { userId, type: toType, currency } } });
  if (!destWallet) throw new Error('Destination wallet not found.');

  const [srcUpdated, destUpdated] = await prisma.$transaction([
    prisma.wallet.update({ where: { id: sourceWallet.id }, data: { balance: { decrement: amount } } }),
    prisma.wallet.update({ where: { id: destWallet.id }, data: { balance: { increment: amount } } })
  ]);

  return { success: true, message: `Transferred ${amount} ${currency} from ${fromType} to ${toType}.`, sourceWallet: srcUpdated, destWallet: destUpdated };
};

module.exports = { initializeUserWallets, getUserWallets, createDepositRequest, confirmDeposit, transferBetweenWallets };
