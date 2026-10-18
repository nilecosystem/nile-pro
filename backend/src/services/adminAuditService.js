const prisma = require('../utils/prisma');

/**
 * Log all administrative actions with complete audit trail
 * Fields: adminId, targetUserId, actionType, beforeValue, afterValue, timestamp, reason
 */
const logAdminAction = async ({
  adminId,
  targetUserId = null,
  actionType,
  beforeValue = null,
  afterValue = null,
  reason,
  ipAddress = null,
  userAgent = null
}) => {
  if (!reason || !actionType) {
    throw new Error('Audit logging error: reason and actionType are strictly mandatory.');
  }

  const payload = {
    adminId,
    targetUserId,
    actionType,
    beforeValue: beforeValue ? (typeof beforeValue === 'string' ? beforeValue : JSON.stringify(beforeValue)) : null,
    afterValue: afterValue ? (typeof afterValue === 'string' ? afterValue : JSON.stringify(afterValue)) : null,
    reason,
    ipAddress,
    userAgent,
    createdAt: new Date()
  };

  if (prisma) {
    try {
      return await prisma.adminAuditLog.create({
        data: payload
      });
    } catch (err) {
      console.error('Failed to persist admin audit log to database:', err.message);
    }
  }

  console.log(`[ADMIN AUDIT LOG - ${new Date().toISOString()}]`, payload);
  return payload;
};

module.exports = {
  logAdminAction
};
