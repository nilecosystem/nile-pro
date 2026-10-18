const express = require('express');
const router = express.Router();
const prisma = require('../utils/prisma');

// Get academy articles with language and category filters
router.get('/articles', async (req, res) => {
  const { category, language = 'en' } = req.query;
  try {
    const where = { isPublished: true, language };
    if (category) where.category = category;

    const articles = await prisma.academyArticle.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, articles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get article by slug
router.get('/articles/:slug', async (req, res) => {
  try {
    const article = await prisma.academyArticle.findUnique({
      where: { slug: req.params.slug }
    });
    if (!article) return res.status(404).json({ success: false, message: 'Article not found.' });
    res.json({ success: true, article });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// FAQ system
router.get('/faqs', (req, res) => {
  const faqs = [
    {
      q: 'How does the NILE Token double profit booster work?',
      a: 'If your investment plan is funded using NILE tokens as the primary source of funds, all daily profits or maturity rewards are automatically doubled (2×) compared to standard USDT funding.'
    },
    {
      q: 'What are the withdrawal cycles and rules?',
      a: 'Withdrawals are processed across 4 daily 3-hour cycles (00:00–03:00, 06:00–09:00, 12:00–15:00, 18:00–21:00 UTC). Once submitted, our security compliance team reviews and broadcasts the payout, recording the on-chain TXID in your portal.'
    },
    {
      q: 'Can I withdraw my Referral Wallet earnings immediately?',
      a: 'Referral rewards are generated exclusively from verified team investments. Under platform rules, referral earnings are stored in your Referral Wallet and must be reinvested into any active plan before principal/profit withdrawal.'
    },
    {
      q: 'What is the minimum deposit for Plan 3 Amount Tiers?',
      a: 'Plan 3 starts at only 10 USDT (0.25% daily), scaling up to 10,000 USDT (12.0% daily) with automated daily calculation.'
    },
    {
      q: 'Where are NILE Investment global offices located?',
      a: 'Our registered headquarters is at 47 Academy Street, Berwick Bassett, SN4 7DZ, UK, with our Middle East operations in Business Bay, Dubai, UAE.'
    }
  ];
  res.json({ success: true, faqs });
});

module.exports = router;
