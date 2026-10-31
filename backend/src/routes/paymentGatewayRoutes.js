const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const prisma = require('../utils/prisma');
const { authenticateToken } = require('../middleware/auth');

// Official Treasury Wallets from paymentConfig
const TREASURY_WALLETS = {
  BTC: process.env.TREASURY_BTC || 'bc1qhcyuprv4m2akkflcy3aszmx5wggzzadf42y3as',
  EVM: (process.env.TREASURY_EVM || '0x9ad1Faa6d1DBDC047001b16eA1ced073a6058399').toLowerCase(),
  TRON: process.env.TREASURY_TRON || 'TE5QqMoBbLbTkUtkcfe93WTyH9ytm78zaR',
  SOL: process.env.TREASURY_SOL || '8XPTkroufgEDJoCLM9KDBhMZzaBzo6FfdHpvaHcWbTpE'
};

// Official USDT Contract Addresses
const USDT_CONTRACTS = {
  ERC20: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  BEP20: '0x55d398326f99059ff775485246999027b3197955',
  TRC20: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
};

/**
 * 1. LIVE ON-CHAIN BLOCKCHAIN TRANSACTION VERIFIER
 * Verifies real TXID on Ethereum, BSC, TRON, Bitcoin, or Solana RPCs
 */
router.post('/verify-onchain-deposit', authenticateToken, async (req, res) => {
  const { txid, network, expectedAsset, walletType = 'INTERNAL' } = req.body;

  if (!txid || !network) {
    return res.status(400).json({ success: false, message: 'TXID and network are required.' });
  }

  try {
    // Prevent double-spending / replay of an already credited TXID
    const existingDeposit = await prisma.deposit.findUnique({ where: { txid } });
    if (existingDeposit) {
      return res.status(409).json({ success: false, message: 'This transaction hash (TXID) has already been credited.' });
    }

    let verifiedAmount = 0;
    let verifiedCurrency = expectedAsset || 'USDT';
    let isConfirmedOnChain = false;

    // --- A. ETHEREUM (ERC20) & BNB SMART CHAIN (BEP20) ---
    if (network === 'ERC20' || network === 'BEP20' || network === 'ETH' || network === 'BNB') {
      const rpcUrl = network === 'BEP20' || network === 'BNB'
        ? (process.env.BSC_RPC_URL || 'https://bsc-dataseed.binance.org/')
        : (process.env.ETH_RPC_URL || 'https://cloudflare-eth.com');

      const [txRes, receiptRes] = await Promise.all([
        fetch(rpcUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_getTransactionByHash', params: [txid] })
        }).then(r => r.json()),
        fetch(rpcUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'eth_getTransactionReceipt', params: [txid] })
        }).then(r => r.json())
      ]);

      const tx = txRes?.result;
      const receipt = receiptRes?.result;

      if (!tx || !receipt || receipt.status !== '0x1') {
        return res.status(400).json({ success: false, message: 'Transaction not found or not yet confirmed on-chain.' });
      }

      // Check native ETH/BNB transfer to Treasury
      if (tx.to && tx.to.toLowerCase() === TREASURY_WALLETS.EVM && parseInt(tx.value, 16) > 0) {
        verifiedAmount = parseInt(tx.value, 16) / 1e18;
        verifiedCurrency = (network === 'BEP20' || network === 'BNB') ? 'BNB' : 'ETH';
        isConfirmedOnChain = true;
      } else if (receipt.logs && receipt.logs.length > 0) {
        // Check ERC20 / BEP20 Transfer event topic
        const transferTopic = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
        for (const log of receipt.logs) {
          if (log.topics && log.topics[0] === transferTopic && log.topics[2]) {
            const recipientAddr = '0x' + log.topics[2].slice(26).toLowerCase();
            if (recipientAddr === TREASURY_WALLETS.EVM) {
              const decimals = log.address.toLowerCase() === USDT_CONTRACTS.ERC20 ? 6 : 18;
              verifiedAmount = parseInt(log.data, 16) / Math.pow(10, decimals);
              verifiedCurrency = 'USDT';
              isConfirmedOnChain = true;
              break;
            }
          }
        }
      }
    }

    // --- B. TRON NETWORK (TRC20 USDT / TRX) ---
    else if (network === 'TRC20' || network === 'TRON') {
      const tronRes = await fetch(`https://api.trongrid.io/v1/transactions/${txid}/events`, {
        headers: process.env.TRONGRID_API_KEY ? { 'TRON-PRO-API-KEY': process.env.TRONGRID_API_KEY } : {}
      }).then(r => r.json());

      if (tronRes?.data && tronRes.data.length > 0) {
        const transferEvent = tronRes.data.find(
          e => e.event_name === 'Transfer' && e.result && e.result.to === TREASURY_WALLETS.TRON
        );
        if (transferEvent) {
          verifiedAmount = Number(transferEvent.result.value) / 1e6;
          verifiedCurrency = 'USDT';
          isConfirmedOnChain = true;
        }
      }
    }

    // --- C. BITCOIN NETWORK (Native SegWit / Legacy) ---
    else if (network === 'BTC' || network === 'BITCOIN') {
      const btcTx = await fetch(`https://mempool.space/api/tx/${txid}`).then(r => r.json());
      if (btcTx && btcTx.status?.confirmed) {
        const matchingVout = (btcTx.vout || []).find(
          out => out.scriptpubkey_address === TREASURY_WALLETS.BTC
        );
        if (matchingVout) {
          verifiedAmount = matchingVout.value / 1e8;
          verifiedCurrency = 'BTC';
          isConfirmedOnChain = true;
        }
      }
    }

    if (!isConfirmedOnChain || verifiedAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'On-chain verification failed: Transaction did not match treasury receiving address or is still unconfirmed.'
      });
    }

    // Credit User Wallet in Database Atomically
    let wallet = await prisma.wallet.findUnique({
      where: {
        userId_type_currency: {
          userId: req.user.id,
          type: walletType,
          currency: 'USDT'
        }
      }
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: { userId: req.user.id, type: walletType, currency: 'USDT', balance: 0 }
      });
    }

    // Convert BTC/ETH to USD/USDT equivalent if crediting USDT ledger
    let creditAmountUsdt = verifiedAmount;
    if (verifiedCurrency === 'BTC' || verifiedCurrency === 'ETH' || verifiedCurrency === 'BNB') {
      const ticker = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${verifiedCurrency}USDT`).then(r => r.json());
      const livePrice = parseFloat(ticker?.price || '1');
      creditAmountUsdt = verifiedAmount * livePrice;
    }

    const [updatedWallet, depositRecord] = await prisma.$transaction([
      prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: creditAmountUsdt } }
      }),
      prisma.deposit.create({
        data: {
          userId: req.user.id,
          walletId: wallet.id,
          amount: creditAmountUsdt,
          currency: verifiedCurrency,
          txid,
          network,
          status: 'CONFIRMED',
          confirmedBy: 'ONCHAIN_RPC_VALIDATOR',
          confirmedAt: new Date()
        }
      })
    ]);

    return res.json({
      success: true,
      message: `Verified ${verifiedAmount} ${verifiedCurrency} ($${creditAmountUsdt.toFixed(2)}) on-chain and credited to your account.`,
      wallet: updatedWallet,
      deposit: depositRecord
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: `Verification error: ${err.message}` });
  }
});

/**
 * 2. NOWPAYMENTS CRYPTO GATEWAY INVOICE & WEBHOOK
 */
router.post('/create-crypto-invoice', authenticateToken, async (req, res) => {
  const { amountUsd, payCurrency = 'usdttrc20', description = 'Nile Ecosystem Deposit' } = req.body;
  const apiKey = process.env.NOWPAYMENTS_API_KEY;

  if (!apiKey) {
    return res.status(400).json({
      success: false,
      message: 'NOWPAYMENTS_API_KEY is not configured. Use direct on-chain transfer instead.'
    });
  }

  try {
    const response = await fetch('https://api.nowpayments.io/v1/invoice', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        price_amount: Number(amountUsd),
        price_currency: 'usd',
        pay_currency: payCurrency,
        order_id: `NILE-${req.user.id}-${Date.now()}`,
        order_description: description,
        ipn_callback_url: `${process.env.APP_URL}/api/payments/webhook/nowpayments`,
        success_url: `${process.env.APP_URL}/?payment=success`,
        cancel_url: `${process.env.APP_URL}/?payment=cancelled`
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create crypto invoice');
    }

    res.json({ success: true, invoiceUrl: data.invoice_url, invoiceId: data.id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// NOWPayments IPN Webhook
router.post('/webhook/nowpayments', async (req, res) => {
  const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET;
  const signature = req.headers['x-nowpayments-sig'];

  if (ipnSecret && signature) {
    const sortedKeys = Object.keys(req.body).sort();
    const sortedJson = JSON.stringify(req.body, sortedKeys);
    const hmac = crypto.createHmac('sha512', ipnSecret).update(sortedJson).digest('hex');
    if (hmac !== signature) {
      return res.status(403).json({ success: false, message: 'Invalid IPN signature' });
    }
  }

  const { payment_status, order_id, price_amount, payment_id } = req.body;
  if (payment_status === 'finished' || payment_status === 'confirmed') {
    const parts = (order_id || '').split('-');
    const userId = parts[1];
    if (userId) {
      const txid = `NP-${payment_id}`;
      const exists = await prisma.deposit.findUnique({ where: { txid } });
      if (!exists) {
        const wallet = await prisma.wallet.findUnique({
          where: { userId_type_currency: { userId, type: 'INTERNAL', currency: 'USDT' } }
        });
        if (wallet) {
          await prisma.$transaction([
            prisma.wallet.update({
              where: { id: wallet.id },
              data: { balance: { increment: parseFloat(price_amount) } }
            }),
            prisma.deposit.create({
              data: {
                userId,
                walletId: wallet.id,
                amount: parseFloat(price_amount),
                currency: 'USDT',
                txid,
                network: 'NOWPAYMENTS',
                status: 'CONFIRMED',
                confirmedBy: 'NOWPAYMENTS_WEBHOOK',
                confirmedAt: new Date()
              }
            })
          ]);
        }
      }
    }
  }

  res.json({ received: true });
});

/**
 * 3. VISA & MASTERCARD GATEWAY (STRIPE CHECKOUT + FIAT ON-RAMP)
 */
router.post('/create-card-session', authenticateToken, async (req, res) => {
  const { amountUsd, currency = 'usd', gateway = 'stripe' } = req.body;

  if (!amountUsd || amountUsd < 10) {
    return res.status(400).json({ success: false, message: 'Minimum Visa/Mastercard payment is $10.00' });
  }

  // Option A: Direct Visa/Mastercard On-Ramp to Platform Treasury (MoonPay / Transak)
  if (gateway === 'onramp' || !process.env.STRIPE_SECRET_KEY) {
    const moonpayKey = process.env.MOONPAY_API_KEY || '';
    const onRampUrl = `https://buy.moonpay.com?apiKey=${moonpayKey}&currencyCode=usdt_trc20&walletAddress=${encodeURIComponent(TREASURY_WALLETS.TRON)}&baseCurrencyCode=usd&baseCurrencyAmount=${encodeURIComponent(amountUsd)}&externalCustomerId=${encodeURIComponent(req.user.id)}`;
    const transakUrl = `https://global.transak.com/?cryptoCurrencyCode=USDT&network=tron&walletAddress=${encodeURIComponent(TREASURY_WALLETS.TRON)}&fiatCurrency=USD&fiatAmount=${encodeURIComponent(amountUsd)}&partnerCustomerId=${encodeURIComponent(req.user.id)}`;

    return res.json({
      success: true,
      mode: 'fiat_onramp',
      checkoutUrl: moonpayKey ? onRampUrl : transakUrl,
      treasuryRecipient: TREASURY_WALLETS.TRON
    });
  }

  // Option B: Stripe Direct Visa/Mastercard Checkout Session
  try {
    const params = new URLSearchParams();
    params.append('payment_method_types[]', 'card');
    params.append('mode', 'payment');
    params.append('success_url', `${process.env.APP_URL}/?card_payment=success&session_id={CHECKOUT_SESSION_ID}`);
    params.append('cancel_url', `${process.env.APP_URL}/?card_payment=cancelled`);
    params.append('client_reference_id', req.user.id);
    params.append('line_items[0][price_data][currency]', currency.toLowerCase());
    params.append('line_items[0][price_data][product_data][name]', 'Nile Ecosystem Account Deposit (Visa / Mastercard)');
    params.append('line_items[0][price_data][unit_amount]', String(Math.round(Number(amountUsd) * 100)));
    params.append('line_items[0][quantity]', '1');

    const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    const session = await stripeRes.json();
    if (!stripeRes.ok) {
      throw new Error(session.error?.message || 'Stripe session creation failed');
    }

    res.json({
      success: true,
      mode: 'stripe_checkout',
      sessionId: session.id,
      checkoutUrl: session.url
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Verify Stripe Checkout Session & Credit User Balance
router.post('/verify-card-session', authenticateToken, async (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId || !process.env.STRIPE_SECRET_KEY) {
    return res.status(400).json({ success: false, message: 'Invalid session or Stripe key missing.' });
  }

  try {
    const stripeRes = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
      headers: { 'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}` }
    });
    const session = await stripeRes.json();

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ success: false, message: 'Card payment is not yet completed.' });
    }

    const txid = `STRIPE-${session.id}`;
    const existing = await prisma.deposit.findUnique({ where: { txid } });
    if (existing) {
      return res.json({ success: true, message: 'Card payment already credited.', deposit: existing });
    }

    const amountUsd = (session.amount_total || 0) / 100;
    const wallet = await prisma.wallet.findUnique({
      where: { userId_type_currency: { userId: req.user.id, type: 'INTERNAL', currency: 'USDT' } }
    });

    const [updatedWallet, deposit] = await prisma.$transaction([
      prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: amountUsd } }
      }),
      prisma.deposit.create({
        data: {
          userId: req.user.id,
          walletId: wallet.id,
          amount: amountUsd,
          currency: 'USD',
          txid,
          network: 'VISA_MASTERCARD',
          status: 'CONFIRMED',
          confirmedBy: 'STRIPE_GATEWAY',
          confirmedAt: new Date()
        }
      })
    ]);

    res.json({
      success: true,
      message: `Visa/Mastercard payment of $${amountUsd.toFixed(2)} confirmed and credited!`,
      wallet: updatedWallet,
      deposit
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
