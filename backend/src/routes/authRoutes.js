const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const prisma = require('../utils/prisma');
const config = require('../config');
const { authenticateToken } = require('../middleware/auth');
const { initializeUserWallets } = require('../services/walletService');

/**
 * Generate unique 8-character referral code
 */
const generateReferralCode = () => {
  return 'NILE-' + Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Register
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').notEmpty(),
  body('lastName').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { email, password, firstName, lastName, phone, referralCode, preferredLanguage } = req.body;

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email address already registered.' });
    }

    let referredById = null;
    if (referralCode) {
      const referrer = await prisma.user.findUnique({ where: { referralCode } });
      if (referrer) referredById = referrer.id;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        phone: phone || null,
        referralCode: generateReferralCode(),
        referredById,
        preferredLanguage: preferredLanguage || 'en',
        role: 'USER',
        kycStatus: 'UNVERIFIED'
      }
    });

    // Initialize all 4 ledger wallets
    await initializeUserWallets(user.id);

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        referralCode: user.referralCode,
        kycStatus: user.kycStatus
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  const { email, password, twoFactorCode } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password credentials.' });
    }

    if (user.twoFactorEnabled && !twoFactorCode) {
      return res.status(200).json({
        success: false,
        requires2FA: true,
        message: 'Two-factor authentication code required.'
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        referralCode: user.referralCode,
        referralRank: user.referralRank,
        kycStatus: user.kycStatus
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        wallets: true,
        _count: {
          select: {
            investments: true,
            referrals: true
          }
        }
      }
    });

    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    const { passwordHash, twoFactorSecret, ...sanitized } = user;
    res.json({ success: true, user: sanitized });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// KYC submission
router.post('/kyc', authenticateToken, async (req, res) => {
  const { idType, idNumber, frontImageUrl, backImageUrl, selfieUrl } = req.body;

  try {
    const kycDoc = await prisma.kycDocument.create({
      data: {
        userId: req.user.id,
        idType,
        idNumber,
        frontImageUrl,
        backImageUrl,
        selfieUrl,
        status: 'PENDING'
      }
    });

    await prisma.user.update({
      where: { id: req.user.id },
      data: { kycStatus: 'PENDING' }
    });

    res.json({ success: true, message: 'KYC documents submitted for review.', kycDoc });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
