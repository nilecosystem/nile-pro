<<<<<<< HEAD
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/79a27c1a-2620-4969-98fc-993f16c59dc5

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
=======
# 🐊 NILE INVESTMENT — Production-Grade Web3 Fintech Platform

> **Institutional Grade • Absolute Control**  
> An enterprise-ready Web3 multi-asset investment protocol, digital goods marketplace, and multi-wallet internal ledger platform.

---

## 🌟 Executive Overview & Key Features

- **Frontend:** React 18, Vite, Tailwind CSS, Glassmorphic Fintech UI (Dark mode).
- **Backend:** Node.js, Express, Prisma ORM, JWT Authentication with salted bcrypt hashing, 2FA support, rate-limiting, and Helmet security.
- **Internal Ledger Wallets:** 4 segregated wallets per user (`Internal Wallet`, `Investment Wallet`, `Referral Wallet`, `Shop Wallet`).
- **Investment Engine:**
  - **Plan 1 (Asset Based):** Flexible entry/exit daily algorithmic yield across USDT, ETH, and BTC.
  - **Plan 2 (Time Locked):** Fixed maturity rewards (30d: +25-50%, 50d: +55-110%, 100d: +140-280%).
  - **Plan 3 (Amount Tiers):** Scalable daily yield from 10 USDT (0.25% daily) up to 10,000 USDT (12.0% daily).
  - **🔥 NILE Token 2× Multiplier Rule:** When an investment is funded using NILE token, all calculated profits are automatically doubled!
  - **NILE Staking Pools:** 30 Days (+50%), 50 Days (+100%), 100 Days (+250%).
- **Withdrawal System:** 4 dedicated 3-hour cycles daily with manual compliance review and on-chain TXID recording.
- **10-Level Referral Engine:** Uncapped affiliate commissions (10% down to 1%), ranks (Bronze to Diamond), with mandatory reinvestment protection.
- **Web3 Marketplace & Token Creation:** 300+ digital items, virtual cards, and custom token generation across BEP20, ERC20, TRC20, Solana, and Sui.
- **Super Admin Panel & Audit Logging:** Every administrative action (balance adjustment, KYC approval, withdrawal approval, impersonation) is logged with before/after state and mandatory reason.
- **Internationalization (i18n):** Complete multilingual support across 7 languages including **English, Persian (فارسی), Arabic (العربية - RTL), French, Russian, Chinese, and Spanish**.
- **Global Offices Grounding:**
  - **UK Headquarters:** 47 Academy Street, Berwick Bassett, SN4 7DZ, UK
  - **UAE Office:** Dubai, Business Bay, UAE
  - **Support Hotline:** +44 7552 847468

---

## 🚀 Quick Start Guide

### 1. Running on Replit
1. Create a new Node.js Repl or import the repository.
2. The `.replit` configuration will automatically detect `backend/src/server.js`.
3. In the Shell, run:
   ```bash
   cd backend && npm install && npx prisma db push && node prisma/seed.js && npm start
   ```
4. To run the React frontend:
   ```bash
   cd frontend && npm install && npm run dev
   ```

### 2. Default Super Admin Credentials
- **Email:** `admin@nileecosystem.com`
- **Password:** `AdminNileSecure2026!`
- **Role:** `SUPER_ADMIN` (Full audit trail and balance control)

---

## 📁 Repository Directory Structure

```
nile-investment/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma         # Full Prisma schema with 13 relational models
│   │   └── seed.js               # Database seeder (Admin, Plans, Products, Academy)
│   ├── src/
│   │   ├── config/               # Environment, offices, and withdrawal cycle config
│   │   ├── middleware/           # JWT auth and role guards
│   │   ├── routes/               # Express routers (auth, wallets, investments, shop, etc.)
│   │   ├── services/             # Core engines (wallet ledger, profit engine, 10-tier referrals)
│   │   ├── utils/                # Prisma client and helper utilities
│   │   └── server.js             # Main server entry point
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/           # Navbar, Hero, Plans, Token, Marketplace, Offices, Modals
│   │   ├── context/              # Auth, i18n RTL/LTR, and wallet ledger state
│   │   ├── locales/              # 7 language translations (EN, FA, AR, FR, RU, ZH, ES)
│   │   ├── App.jsx               # Main SPA application
│   │   ├── main.jsx              # React DOM entry
│   │   └── index.css             # Tailwind and glassmorphism styling
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── .replit                       # Direct Replit execution setup
└── README.md
```

---

## 🔒 Security & Regulatory Compliance

- **Risk Warning:** Cryptocurrency trading and decentralized liquidity protocols involve financial risk.
- **MPC Architecture:** Multi-party computation ensures zero single-point-of-failure key exposure.
- **Immutable Audit Trail:** All administrative operations are logged with timestamps and operator reasons.
>>>>>>> c8e6a1d5158bca5c59da9cc43a8d83d4c1f2e507
