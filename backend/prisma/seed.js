const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Nile Investment Platform database...');

  // 1. Seed Super Admin
  const adminPasswordHash = await bcrypt.hash('AdminNileSecure2026!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@nileecosystem.com' },
    update: {},
    create: {
      email: 'admin@nileecosystem.com',
      passwordHash: adminPasswordHash,
      firstName: 'Super',
      lastName: 'Administrator',
      role: 'SUPER_ADMIN',
      referralCode: 'NILE-FOUNDER',
      kycStatus: 'APPROVED'
    }
  });
  console.log('Admin user created:', admin.email);

  // 2. Seed Investment Plans
  // PLAN 1: Asset-Based
  await prisma.investmentPlan.createMany({
    data: [
      {
        planType: 'ASSET_BASED',
        name: 'USDT Quantum Vault',
        minDeposit: 25.0,
        dailyProfitPercent: 1.2,
        lockDays: 0,
        description: 'Flexible principal entry/exit. Daily algorithmic yield credited in USDT.'
      },
      {
        planType: 'ASSET_BASED',
        name: 'ETH Guardian Yield',
        minDeposit: 100.0,
        dailyProfitPercent: 0.95,
        lockDays: 0,
        description: 'Institutional Ethereum staking with daily compound liquidity.'
      },
      {
        planType: 'ASSET_BASED',
        name: 'BTC Reserve Vault',
        minDeposit: 250.0,
        dailyProfitPercent: 0.85,
        lockDays: 0,
        description: 'Secured Bitcoin treasury yield with quantitative hedging.'
      },
      // PLAN 2: Time-Locked (30, 50, 100 days)
      {
        planType: 'TIME_LOCKED',
        name: '30-Day Growth Lock',
        minDeposit: 50.0,
        lockDays: 30,
        fixedRewardPercent: 25.0,
        description: 'Principal locked for 30 days. Fixed 25% reward at maturity (50% if funded with NILE).'
      },
      {
        planType: 'TIME_LOCKED',
        name: '50-Day Strategic Lock',
        minDeposit: 100.0,
        lockDays: 50,
        fixedRewardPercent: 55.0,
        description: 'Principal locked for 50 days. Fixed 55% reward at maturity (110% if funded with NILE).'
      },
      {
        planType: 'TIME_LOCKED',
        name: '100-Day Dynasty Lock',
        minDeposit: 250.0,
        lockDays: 100,
        fixedRewardPercent: 140.0,
        description: 'Principal locked for 100 days. Fixed 140% reward at maturity (280% if funded with NILE).'
      },
      // PLAN 3: Amount-Based Tiers
      {
        planType: 'AMOUNT_TIER',
        name: 'Tier Alpha (10 USDT)',
        minDeposit: 10.0,
        maxDeposit: 49.99,
        dailyProfitPercent: 0.25,
        lockDays: 0,
        description: 'Entry tier: 0.25% daily profit (0.50% daily if funded with NILE).'
      },
      {
        planType: 'AMOUNT_TIER',
        name: 'Tier Beta (50 USDT)',
        minDeposit: 50.0,
        maxDeposit: 99.99,
        dailyProfitPercent: 0.75,
        lockDays: 0,
        description: 'Starter tier: 0.75% daily profit (1.50% daily if funded with NILE).'
      },
      {
        planType: 'AMOUNT_TIER',
        name: 'Tier Gamma (100 USDT)',
        minDeposit: 100.0,
        maxDeposit: 499.99,
        dailyProfitPercent: 1.5,
        lockDays: 0,
        description: 'Core tier: 1.5% daily profit (3.0% daily if funded with NILE).'
      },
      {
        planType: 'AMOUNT_TIER',
        name: 'Tier Delta (500 USDT)',
        minDeposit: 500.0,
        maxDeposit: 999.99,
        dailyProfitPercent: 3.0,
        lockDays: 0,
        description: 'Advanced tier: 3.0% daily profit (6.0% daily if funded with NILE).'
      },
      {
        planType: 'AMOUNT_TIER',
        name: 'Tier Epsilon (1,000 USDT)',
        minDeposit: 1000.0,
        maxDeposit: 9999.99,
        dailyProfitPercent: 6.0,
        lockDays: 0,
        description: 'Pro tier: 6.0% daily profit (12.0% daily if funded with NILE).'
      },
      {
        planType: 'AMOUNT_TIER',
        name: 'Tier Apex (10,000 USDT)',
        minDeposit: 10000.0,
        dailyProfitPercent: 12.0,
        lockDays: 0,
        description: 'Institutional Apex tier: 12.0% daily profit (24.0% daily if funded with NILE).'
      }
    ]
  });
  console.log('Investment plans created.');

  // 3. Seed Shop Products
  await prisma.shopProduct.createMany({
    data: [
      {
        category: 'FINANCIAL_SERVICES',
        title: 'Virtual Visa / Mastercard (Platinum)',
        description: 'Instant reloadable 3D Secure virtual card for international Web3 & e-commerce payments.',
        priceUsdt: 25.0
      },
      {
        category: 'FINANCIAL_SERVICES',
        title: 'Global Travel eSIM (10GB Data)',
        description: 'High-speed roaming eSIM valid across 160+ countries for digital nomads.',
        priceUsdt: 18.0
      },
      {
        category: 'SOFTWARE',
        title: 'Windows 11 Pro Retail License Key',
        description: 'Lifetime authentic digital activation key for Windows 11 Professional.',
        priceUsdt: 15.0
      },
      {
        category: 'SOFTWARE',
        title: 'Microsoft Office 2024 Professional Plus',
        description: 'Full suite lifetime license key for Word, Excel, PowerPoint, Outlook & Access.',
        priceUsdt: 29.0
      },
      {
        category: 'SOFTWARE',
        title: 'NordVPN / ExpressVPN 1-Year Dedicated Access',
        description: 'Premium obfuscated VPN servers with double encryption and strict no-log policy.',
        priceUsdt: 39.0
      },
      {
        category: 'AI_TOOLS',
        title: 'ChatGPT Plus / Claude Pro 1-Month Voucher',
        description: 'Direct activation code for frontier AI intelligence subscriptions.',
        priceUsdt: 22.0
      }
    ]
  });
  console.log('Shop products created.');

  // 4. Seed Academy Articles
  await prisma.academyArticle.createMany({
    data: [
      {
        title: 'Understanding the NILE 2x Profit Multiplier Mechanism',
        slug: 'nile-2x-profit-multiplier',
        category: 'INVESTMENT',
        language: 'en',
        summary: 'How funding your staking and tier investments using NILE doubles all daily returns.',
        contentMarkdown: '# Maximizing Returns with the NILE Ecosystem Token\n\nWhen deploying capital across NILE Investment, selecting NILE as your payment source grants an immediate 2× booster on all calculated profits.',
        readTimeMinutes: 4
      },
      {
        title: 'راهنمای جامع برداشت و چرخه‌های ۴ گانه روزانه',
        slug: 'fa-withdrawal-cycles-guide',
        category: 'GUIDES',
        language: 'fa',
        summary: 'بررسی دقیق زمان‌بندی چرخه‌های ۳ ساعته برداشت، تایید دستی امنیتی و ثبت شناسه تراکنش (TXID).',
        contentMarkdown: '# چرخه‌های برداشت پلتفرم نیل\n\nجهت حفظ حداکثر امنیت دارایی‌ها، درخواست‌های برداشت در ۴ بازه مشخص در طول شبانه‌روز پردازش و تایید می‌شوند.',
        readTimeMinutes: 5
      }
    ]
  });
  console.log('Academy articles seeded.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
