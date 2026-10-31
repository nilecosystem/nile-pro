# Implementation Plan: NILE Ecosystem Visual Asset Overhaul

Deploy the official **3D Glowing Gold Horus Coin with Pyramid Emblem** across all token presale banners, tokenomics, staking pools, and ecosystem branding touchpoints, while designating the **Executive Founder Portrait** as the default user profile photo throughout the platform.

---

## 1. User Alignment & Synthesized Requirements
Based on your direct clarifications:
- **Scope of Logo & Token Artwork**: Update all token presale banners, token coin badges, staking vaults, DEX pairs, bank asset cards, and official logo locations.
- **Token Presale Visual Style**: 3D glowing gold Horus coin with geometric pyramid emblem on deep obsidian navy.
- **User Profile Picture Configuration**: Set the generated executive founder portrait (`/default-avatar.jpg`) as the platform default across all account capsules, headers, profiles, leaderboards, and KYC reviewers, while retaining the client-side "Upload My Pic" file uploader.

---

## 2. Architecture & Component Blueprint

### A. Reusable 3D Token Coin Component (`src/components/NileTokenCoin.tsx`)
Create a high-impact, reusable token coin component:
- **Visuals**: Incorporates the 3D golden Horus pyramid emblem (`/logo.png` / `/public/pwa-512x512.png`), surrounded by a multi-layered metallic gold ring, ambient radial glow, dynamic reflection highlight, and subtle floating animation.
- **Props**: Size variants (`xs`, `sm`, `md`, `lg`, `xl`, `hero`), optional animated spin/float state, and optional companion ticker text (`NILE`).
- **Resilience**: Automatic fallback to SVG vector path (`/icon.svg`) if image fails.

### B. Token Presale Page (`src/pages/NilePresalePage.tsx`)
- **Hero Banner Showcase**: Replace the plain text badge with a 3D NILE Token Presale centerpiece featuring the floating golden Horus coin, live round phase indicator, and linear vesting guarantee badge.
- **Phase Cards**: Display the golden token coin inside each presale round card (Seed, Strategic, Public Round).
- **Allocation Output**: Show the 3D coin next to the calculated token allocation counter.

### C. NILE Token & Staking Page (`src/pages/NileTokenPage.tsx`)
- **Header Showcase**: Add the 3D gold token coin as the flagship graphic of the tokenomics and staking dashboard.
- **Staking Pool Vaults**: Embed the golden Horus emblem into each lockup vault card (30-day, 90-day, 180-day, 365-day Diamond).
- **Tokenomics Donut Center**: Place the golden coin at the center of the dynamic SVG tokenomics distribution donut.

### D. Homepage & Navigation Touchpoints (`src/pages/HomePage.tsx`)
- **Presale Feature Card**: Upgrade the homepage Presale product card with the 3D coin graphic and allocation tracker.
- **Hero Ecosystem Visual**: Feature the golden Horus emblem alongside the incorporation certificates and banking highlights.

### E. Banking & DEX Asset Cards
- **`NileBankPage.tsx`**: Update the NILE holding balance card with the official 3D gold coin icon.
- **`NileDexPage.tsx`**: Update the NILE swap token icon in the AMM swap interface and liquidity pool rows.
- **`NileInvestmentPage.tsx`**: Add the 3D coin badge to Staking Multiplier yield plans.

### F. User Profile Default & Photo Management
- **AppContext & initialData**: Ensure `user.avatarUrl` defaults to `/default-avatar.jpg` for all new and existing sessions.
- **Header & Mobile Drawer**: Display the executive founder portrait with gold border, linking directly to profile and photo manager.
- **Profile Page & Admin Reviewer**: Ensure the portrait renders crisply with the "Change My Pic" overlay.

---

## 3. Implementation Steps & Verification Plan

1. **Build `NileTokenCoin.tsx`**: Implement multi-size 3D coin with ambient gold lighting and CSS float animation.
2. **Revamp `NilePresalePage.tsx`**: Integrate hero 3D coin banner and round badges.
3. **Enhance `NileTokenPage.tsx`**: Integrate the coin into the hero banner, dynamic donut chart, and staking vault cards.
4. **Update Ecosystem Pages**: Apply the coin to `HomePage.tsx`, `NileBankPage.tsx`, `NileDexPage.tsx`, and `NileInvestmentPage.tsx`.
5. **Enforce Executive Profile Default**: Confirm default avatar in `AppContext.tsx` and `initialData.ts`.
6. **Compile & Lint**: Run `compile_applet` and `lint_applet` to guarantee zero build errors.
