const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { logAdminAction } = require('../services/adminAuditService');
const { confirmDeposit } = require('../services/walletService');
const { approveWithdrawal, rejectWithdrawal } = require('../services/withdrawalService');
const { runDailyProfitDistribution } = require('../services/investmentEngine');
const prisma = require('../utils/prisma');
const config = require('../config');

// All endpoints in this router require Admin or Super Admin role
router.use(authenticateToken, requireAdmin);

// 1. Get all users with wallet balances and status
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        wallets: true,
        _count: {
          select: { investments: true, deposits: true, withdrawals: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. Login As User (Impersonation) with strict audit logging
router.post('/users/:userId/impersonate', async (req, res) => {
  const { reason } = req.body;
  if (!reason) {
    return res.status(400).json({ success: false, message: 'Mandatory reason required for audit trail.' });
  }

  try {
    const targetUser = await prisma.user.findUnique({ where: { id: req.params.userId } });
    if (!targetUser) return res.status(404).json({ success: false, message: 'Target user not found.' });

    await logAdminAction({
      adminId: req.user.id,
      targetUserId: targetUser.id,
      actionType: 'LOGIN_AS_USER',
      beforeValue: { originalAdmin: req.user.email },
      afterValue: { impersonatedUser: targetUser.email },
      reason,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    const impersonationToken = jwt.sign(
      { id: targetUser.id, email: targetUser.email, role: targetUser.role, impersonatedBy: req.user.id },
      config.jwtSecret,
      { expiresIn: '2h' }
    );

    res.json({
      success: true,
      message: `Impersonation session created for ${targetUser.email}.`,
      token: impersonationToken,
      user: targetUser
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. Add or Remove User Wallet Balance
router.post('/users/:userId/adjust-balance', async (req, res) => {
  const { walletType, currency = 'USDT', deltaAmount, reason } = req.body;
  if (!reason || deltaAmount === undefined) {
    return res.status(400).json({ success: false, message: 'Reason and deltaAmount are strictly required.' });
  }

  const delta = parseFloat(deltaAmount);

  try {
    const wallet = await prisma.wallet.findUnique({
      where: {
        userId_type_currency: {
          userId: req.params.userId,
          type: walletType,
          currency
        }
      }
    });

    if (!wallet) return res.status(404).json({ success: false, message: 'Wallet not found.' });

    const beforeBalance = wallet.balance;
    const afterBalance = beforeBalance + delta;

    if (afterBalance < 0) {
      return res.status(400).json({ success: false, message: 'Adjustment would result in negative balance.' });
    }

    const updated = await prisma.wallet.update({
      where: { id: wallet.id },
      data: { balance: afterBalance }
    });

    await logAdminAction({
      adminId: req.user.id,
      targetUserId: req.params.userId,
      actionType: 'BALANCE_ADJUST',
      beforeValue: { walletType, currency, balance: beforeBalance },
      afterValue: { walletType, currency, balance: afterBalance, delta },
      reason,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.json({
      success: true,
      message: `Balance adjusted. New balance: ${afterBalance} ${currency}.`,
      wallet: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 4. Approve/Reject KYC Verification
router.post('/users/:userId/kyc-decision', async (req, res) => {
  const { status, reason, adminNotes } = req.body;
  if (!['APPROVED', 'REJECTED'].includes(status) || !reason) {
    return res.status(400).json({ success: false, message: 'Status must be APPROVED or REJECTED with reason.' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.userId } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    const beforeStatus = user.kycStatus;

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { kycStatus: status }
      }),
      prisma.kycDocument.updateMany({
        where: { userId: user.id, status: 'PENDING' },
        data: {
          status,
          adminNotes,
          reviewedAt: new Date()
        }
      })
    ]);

    await logAdminAction({
      adminId: req.user.id,
      targetUserId: user.id,
      actionType: 'KYC_DECISION',
      beforeValue: { kycStatus: beforeStatus },
      afterValue: { kycStatus: status, adminNotes },
      reason,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.json({ success: true, message: `KYC status set to ${status}.` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 5. Manage Deposits (Confirm Deposit)
router.post('/deposits/:depositId/confirm', async (req, res) => {
  const { reason } = req.body;
  try {
    const deposit = await prisma.deposit.findUnique({ where: { id: req.params.depositId } });
    if (!deposit) return res.status(404).json({ success: false, message: 'Deposit not found.' });

    const result = await confirmDeposit({ depositId: deposit.id, adminId: req.user.id });

    await logAdminAction({
      adminId: req.user.id,
      targetUserId: deposit.userId,
      actionType: 'DEPOSIT_CONFIRM',
      beforeValue: { status: 'PENDING', amount: deposit.amount, txid: deposit.txid },
      afterValue: { status: 'CONFIRMED' },
      reason: reason || 'Blockchain confirmation verified',
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// 6. Manage Withdrawals (Approve with TXID or Reject)
router.post('/withdrawals/:withdrawalId/payout', async (req, res) => {
  const { action, payoutTxid, reason } = req.body; // action: 'APPROVE' or 'REJECT'
  try {
    const withdrawal = await prisma.withdrawal.findUnique({ where: { id: req.params.withdrawalId } });
    if (!withdrawal) return res.status(404).json({ success: false, message: 'Withdrawal not found.' });

    let updated;
    if (action === 'APPROVE') {
      if (!payoutTxid) return res.status(400).json({ success: false, message: 'Payout TXID is mandatory for approval.' });
      updated = await approveWithdrawal({
        withdrawalId: withdrawal.id,
        adminId: req.user.id,
        payoutTxid,
        reason: reason || 'Approved during cycle'
      });
    } else {
      updated = await rejectWithdrawal({
        withdrawalId: withdrawal.id,
        adminId: req.user.id,
        rejectionReason: reason || 'Rejected by compliance'
      });
    }

    await logAdminAction({
      adminId: req.user.id,
      targetUserId: withdrawal.userId,
      actionType: `WITHDRAWAL_${action}`,
      beforeValue: { status: withdrawal.status, amount: withdrawal.amount },
      afterValue: { status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED', payoutTxid },
      reason: reason || `Admin ${action}`,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.json({ success: true, message: `Withdrawal successfully ${action}D.`, withdrawal: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// 7. Trigger Daily Profit Calculation Engine manually
router.post('/trigger-profit-run', async (req, res) => {
  const { reason } = req.body;
  try {
    const result = await runDailyProfitDistribution();

    await logAdminAction({
      adminId: req.user.id,
      actionType: 'MANUAL_PROFIT_RUN',
      beforeValue: null,
      afterValue: result,
      reason: reason || 'Scheduled / manual batch daily profit calculation',
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.json({ success: true, message: 'Daily profit calculation engine executed.', ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 8. View Complete Admin Audit Trail
router.get('/audit-logs', async (req, res) => {
  try {
    const logs = await prisma.adminAuditLog.findMany({
      include: {
        admin: { select: { email: true, firstName: true } },
        targetUser: { select: { email: true, firstName: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    });
    res.json({ success: true, logs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
