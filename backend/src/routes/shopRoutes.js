const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const prisma = require('../utils/prisma');

// List shop products by category
router.get('/products', async (req, res) => {
  const { category } = req.query;
  try {
    const where = { isAvailable: true };
    if (category) where.category = category;

    const products = await prisma.shopProduct.findMany({
      where,
      orderBy: { priceUsdt: 'asc' }
    });
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Purchase a product from the shop
router.post('/orders', authenticateToken, async (req, res) => {
  const { productId, walletType = 'SHOP' } = req.body;

  try {
    const product = await prisma.shopProduct.findUnique({ where: { id: productId } });
    if (!product || !product.isAvailable) {
      return res.status(404).json({ success: false, message: 'Product not available.' });
    }

    const wallet = await prisma.wallet.findUnique({
      where: {
        userId_type_currency: {
          userId: req.user.id,
          type: walletType,
          currency: 'USDT'
        }
      }
    });

    if (!wallet || wallet.balance < product.priceUsdt) {
      return res.status(400).json({
        success: false,
        message: `Insufficient balance in ${walletType} wallet. Required: ${product.priceUsdt} USDT, available: ${wallet ? wallet.balance : 0} USDT.`
      });
    }

    // Deduct wallet and create order
    const order = await prisma.$transaction(async (tx) => {
      await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: product.priceUsdt } }
      });

      return await tx.shopOrder.create({
        data: {
          userId: req.user.id,
          productId: product.id,
          amountPaidUsdt: product.priceUsdt,
          status: 'PENDING',
          deliveryNotes: 'Order received. Digital license / virtual card details will be delivered within 2 hours.'
        }
      });
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully. Digital goods will be delivered to your account.',
      order
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Request Token Creation Service (BEP20, ERC20, TRC20, Solana, Sui)
router.post('/token-creation', authenticateToken, async (req, res) => {
  const { tokenName, tokenSymbol, network, decimals, totalSupply, extraFeatures } = req.body;

  const validNetworks = ['BEP20', 'ERC20', 'TRC20', 'SOLANA', 'SUI'];
  if (!validNetworks.includes(network)) {
    return res.status(400).json({
      success: false,
      message: `Invalid blockchain network. Supported: ${validNetworks.join(', ')}.`
    });
  }

  try {
    const tokenRequest = await prisma.tokenCreationRequest.create({
      data: {
        userId: req.user.id,
        tokenName,
        tokenSymbol: tokenSymbol.toUpperCase(),
        network,
        decimals: parseInt(decimals, 10) || 18,
        totalSupply: parseFloat(totalSupply),
        extraFeatures: extraFeatures || 'Standard OpenZeppelin / Verified Contract',
        status: 'PENDING',
        priceQuotedUsdt: 499.0
      }
    });

    res.status(201).json({
      success: true,
      message: 'Token creation request submitted. Our quantitative smart contract team will initiate deployment.',
      tokenRequest
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get user orders and token requests
router.get('/my-orders', authenticateToken, async (req, res) => {
  try {
    const [orders, tokenRequests] = await Promise.all([
      prisma.shopOrder.findMany({
        where: { userId: req.user.id },
        include: { product: true },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.tokenCreationRequest.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    res.json({ success: true, orders, tokenRequests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
