const sharp = require('sharp');

const financeDefs = `
  <defs>
    <radialGradient id="finance-bg" cx="50%" cy="40%" r="70%">
      <stop offset="0%" stop-color="#111C38"/>
      <stop offset="45%" stop-color="#081022"/>
      <stop offset="80%" stop-color="#030611"/>
      <stop offset="100%" stop-color="#010309"/>
    </radialGradient>
    <radialGradient id="gold-spot" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#F5D061" stop-opacity="0.35"/>
      <stop offset="50%" stop-color="#D4AF37" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#030611" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="cyan-spot" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#00E599" stop-opacity="0.25"/>
      <stop offset="50%" stop-color="#0077B6" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#030611" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="gold-metal" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF8D6"/>
      <stop offset="25%" stop-color="#F3DF79"/>
      <stop offset="50%" stop-color="#D4AF37"/>
      <stop offset="75%" stop-color="#8C6200"/>
      <stop offset="100%" stop-color="#E5B842"/>
    </linearGradient>
    <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.85"/>
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#E5B842" flood-opacity="0.3"/>
    </filter>
    <filter id="neon-glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>
`;

function renderCandlesticks(w, h) {
  const sticks = [
    { x: 80, o: 280, c: 230, h: 200, l: 300, up: true },
    { x: 180, o: 230, c: 170, h: 150, l: 250, up: true },
    { x: 280, o: 170, c: 200, h: 160, l: 220, up: false },
    { x: 380, o: 200, c: 130, h: 110, l: 210, up: true },
    { x: 480, o: 130, c: 90, h: 70, l: 150, up: true },
    { x: 580, o: 90, c: 120, h: 80, l: 140, up: false },
    { x: 680, o: 120, c: 60, h: 50, l: 130, up: true }
  ];
  return `
    <g opacity="0.18">
      ${sticks.map(s => {
        const color = s.up ? '#00E599' : '#F43F5E';
        const top = Math.min(s.o, s.c);
        const height = Math.max(8, Math.abs(s.o - s.c));
        return `
          <line x1="${s.x}" y1="${s.h}" x2="${s.x}" y2="${s.l}" stroke="${color}" stroke-width="2"/>
          <rect x="${s.x - 14}" y="${top}" width="28" height="${height}" fill="${color}" rx="2"/>
        `;
      }).join('\n')}
    </g>
  `;
}

// Plan 1: Asset Based (USDT, ETH, BTC Liquid Daily)
const planAssetBasedSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  ${financeDefs}
  <rect width="800" height="500" fill="url(#finance-bg)"/>
  ${renderCandlesticks(800, 500)}
  <circle cx="400" cy="240" r="260" fill="url(#cyan-spot)"/>

  <!-- Three Floating Asset Coins (USDT, BTC, ETH) with Liquid Streaming Payout HUD -->
  <!-- Left: Tether Coin -->
  <g transform="translate(180, 180)" filter="url(#soft-shadow)">
    <circle cx="50" cy="50" r="65" fill="#26A17B" stroke="#00E599" stroke-width="4"/>
    <circle cx="50" cy="50" r="54" fill="#0D1E24"/>
    <text x="50" y="70" font-family="sans-serif" font-weight="900" font-size="52" fill="#00E599" text-anchor="middle">₮</text>
    <rect x="-10" y="125" width="120" height="28" rx="8" fill="#060C18" stroke="#00E599" stroke-width="1.5"/>
    <text x="50" y="144" font-family="monospace" font-size="11" font-weight="bold" fill="#00E599" text-anchor="middle">+1.95% / DAY</text>
  </g>

  <!-- Center: Bitcoin Sovereign Coin -->
  <g transform="translate(350, 140)" filter="url(#soft-shadow)">
    <circle cx="50" cy="50" r="75" fill="url(#gold-metal)" stroke="#5A3A00" stroke-width="4"/>
    <circle cx="50" cy="50" r="64" fill="#0E1629"/>
    <text x="50" y="74" font-family="sans-serif" font-weight="900" font-size="62" fill="url(#gold-metal)" text-anchor="middle">₿</text>
    <rect x="-10" y="135" width="120" height="28" rx="8" fill="#060C18" stroke="#E5B842" stroke-width="1.5"/>
    <text x="50" y="154" font-family="monospace" font-size="11" font-weight="bold" fill="#F59E0B" text-anchor="middle">+0.85% / DAY</text>
  </g>

  <!-- Right: Ethereum Staking Coin -->
  <g transform="translate(520, 180)" filter="url(#soft-shadow)">
    <circle cx="50" cy="50" r="65" fill="#627EEA" stroke="#93C5FD" stroke-width="4"/>
    <circle cx="50" cy="50" r="54" fill="#0D1629"/>
    <text x="50" y="70" font-family="sans-serif" font-weight="900" font-size="46" fill="#93C5FD" text-anchor="middle">Ξ</text>
    <rect x="-10" y="125" width="120" height="28" rx="8" fill="#060C18" stroke="#627EEA" stroke-width="1.5"/>
    <text x="50" y="144" font-family="monospace" font-size="11" font-weight="bold" fill="#93C5FD" text-anchor="middle">+0.95% / DAY</text>
  </g>

  <text x="400" y="440" font-family="monospace" font-weight="bold" font-size="14" fill="#E2E8F0" text-anchor="middle" letter-spacing="2">
    ★ PLAN 1: LIQUID ENTRY &amp; EXIT · REAL-TIME STREAMING YIELD ACCRUAL ★
  </text>
</svg>
`;

// Plan 2: Time Locked (30d, 50d, 100d Dynasty)
const planTimeLockedSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  ${financeDefs}
  <rect width="800" height="500" fill="url(#finance-bg)"/>
  ${renderCandlesticks(800, 500)}
  <circle cx="400" cy="230" r="260" fill="url(#gold-spot)"/>

  <!-- High-Precision Chronometer Time Vault Mechanism -->
  <g transform="translate(400, 220)" filter="url(#soft-shadow)">
    <!-- Outer Gear Wheel -->
    <circle cx="0" cy="0" r="160" fill="#091426" stroke="url(#gold-metal)" stroke-width="6"/>
    <circle cx="0" cy="0" r="145" fill="#050A14" stroke="#4A3400" stroke-width="3"/>

    <!-- Clock / Lock Dial Arcs -->
    <circle cx="0" cy="0" r="120" fill="none" stroke="#E5B842" stroke-width="4" stroke-dasharray="12,6"/>
    
    <!-- 3 Lock Milestones Badges Around Dial -->
    <!-- 30d -->
    <g transform="translate(-80, -40)">
      <circle cx="0" cy="0" r="26" fill="url(#gold-metal)"/>
      <circle cx="0" cy="0" r="22" fill="#070D1B"/>
      <text x="0" y="4" font-family="sans-serif" font-weight="900" font-size="12" fill="#FFF2A3" text-anchor="middle">30D</text>
      <text x="0" y="16" font-family="monospace" font-size="8" fill="#00E599" text-anchor="middle">+25%</text>
    </g>

    <!-- 50d -->
    <g transform="translate(80, -40)">
      <circle cx="0" cy="0" r="26" fill="url(#gold-metal)"/>
      <circle cx="0" cy="0" r="22" fill="#070D1B"/>
      <text x="0" y="4" font-family="sans-serif" font-weight="900" font-size="12" fill="#FFF2A3" text-anchor="middle">50D</text>
      <text x="0" y="16" font-family="monospace" font-size="8" fill="#00E599" text-anchor="middle">+55%</text>
    </g>

    <!-- 100d Dynasty -->
    <g transform="translate(0, 60)">
      <circle cx="0" cy="0" r="32" fill="url(#gold-metal)" stroke="#5A3A00" stroke-width="2"/>
      <circle cx="0" cy="0" r="27" fill="#070D1B"/>
      <text x="0" y="4" font-family="sans-serif" font-weight="900" font-size="13" fill="#E5B842" text-anchor="middle">100D</text>
      <text x="0" y="18" font-family="monospace" font-size="9" font-weight="bold" fill="#F59E0B" text-anchor="middle">+140%</text>
    </g>

    <!-- Center Key / Titanium Lock Core -->
    <circle cx="0" cy="0" r="30" fill="url(#gold-metal)"/>
    <circle cx="0" cy="0" r="24" fill="#02050D"/>
    <text x="0" y="7" font-family="sans-serif" font-size="20" fill="#E5B842" text-anchor="middle">🔒</text>
  </g>

  <text x="400" y="430" font-family="monospace" font-weight="bold" font-size="14" fill="#E2E8F0" text-anchor="middle" letter-spacing="2">
    ★ PLAN 2: TIME LOCKED · PRINCIPAL RELEASED 100% AT MATURITY ★
  </text>
</svg>
`;

// Plan 3: Progressive Amount Tiers (10 USDT to 10k Apex 24%/day)
const planAmountTiersSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  ${financeDefs}
  <rect width="800" height="500" fill="url(#finance-bg)"/>
  ${renderCandlesticks(800, 500)}
  <circle cx="400" cy="230" r="260" fill="url(#gold-spot)"/>

  <!-- Ascending Tier Pyramids / Steps (Gold &amp; Cyan Glass) -->
  <g transform="translate(100, 120)" filter="url(#soft-shadow)">
    <!-- Tier 1 -->
    <rect x="20" y="200" width="100" height="60" rx="8" fill="#091326" stroke="#00E599" stroke-width="2"/>
    <text x="70" y="225" font-family="sans-serif" font-weight="bold" font-size="11" fill="#FFFFFF" text-anchor="middle">Tier 1: 10$</text>
    <text x="70" y="245" font-family="monospace" font-size="12" font-weight="bold" fill="#00E599" text-anchor="middle">0.25%/d</text>

    <!-- Tier 2 -->
    <rect x="140" y="160" width="100" height="100" rx="8" fill="#0B172E" stroke="#00E599" stroke-width="2"/>
    <text x="190" y="190" font-family="sans-serif" font-weight="bold" font-size="11" fill="#FFFFFF" text-anchor="middle">Tier 2: 100$</text>
    <text x="190" y="215" font-family="monospace" font-size="12" font-weight="bold" fill="#00E599" text-anchor="middle">0.50%/d</text>

    <!-- Tier 3 -->
    <rect x="260" y="120" width="100" height="140" rx="8" fill="#0E1D3A" stroke="#E5B842" stroke-width="2"/>
    <text x="310" y="150" font-family="sans-serif" font-weight="bold" font-size="11" fill="#FFFFFF" text-anchor="middle">Tier 3: 1k$</text>
    <text x="310" y="175" font-family="monospace" font-size="12" font-weight="bold" fill="#E5B842" text-anchor="middle">2.00%/d</text>

    <!-- Tier 4 -->
    <rect x="380" y="70" width="100" height="190" rx="8" fill="#13264B" stroke="#E5B842" stroke-width="2.5"/>
    <text x="430" y="105" font-family="sans-serif" font-weight="bold" font-size="11" fill="#FFFFFF" text-anchor="middle">Tier 4: 5k$</text>
    <text x="430" y="130" font-family="monospace" font-size="13" font-weight="bold" fill="#E5B842" text-anchor="middle">5.00%/d</text>

    <!-- Tier 5: APEX 10K$ (Highest &amp; Glow) -->
    <rect x="500" y="20" width="100" height="240" rx="12" fill="url(#gold-metal)" stroke="#FFFFFF" stroke-width="3" filter="url(#neon-glow)"/>
    <rect x="506" y="26" width="88" height="228" rx="8" fill="#0A1326"/>
    <text x="550" y="60" font-family="sans-serif" font-weight="900" font-size="12" fill="#E5B842" text-anchor="middle">APEX</text>
    <text x="550" y="80" font-family="sans-serif" font-weight="bold" font-size="10" fill="#FFFFFF" text-anchor="middle">10,000$</text>
    <text x="550" y="115" font-family="sans-serif" font-weight="900" font-size="16" fill="#00E599" text-anchor="middle">24.0%</text>
    <text x="550" y="130" font-family="monospace" font-size="9" fill="#00E599" text-anchor="middle">BOOSTED / D</text>
  </g>

  <text x="400" y="440" font-family="monospace" font-weight="bold" font-size="14" fill="#E2E8F0" text-anchor="middle" letter-spacing="2">
    ★ PLAN 3: PROGRESSIVE AMOUNT TIERS · UP TO 24.0% / DAY WITH 1M NILE BOOSTER ★
  </text>
</svg>
`;

// Digital Goods &amp; eSIM 5G
const digitalGoodsSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  ${financeDefs}
  <rect width="800" height="500" fill="url(#finance-bg)"/>
  ${renderCandlesticks(800, 500)}
  <circle cx="400" cy="240" r="260" fill="url(#cyan-spot)"/>

  <!-- Holographic Globe &amp; 5G Connectivity Mobile Terminal -->
  <g transform="translate(400, 220)" filter="url(#soft-shadow)">
    <!-- Holographic Earth Sphere -->
    <circle cx="0" cy="0" r="140" fill="#061226" stroke="#00E599" stroke-width="3"/>
    <circle cx="0" cy="0" r="140" fill="none" stroke="#38BDF8" stroke-width="1.5" stroke-dasharray="8,6"/>
    
    <!-- Longitude / Latitude Rings -->
    <ellipse cx="0" cy="0" rx="140" ry="50" fill="none" stroke="#00E599" stroke-width="1.5" opacity="0.6"/>
    <ellipse cx="0" cy="0" rx="140" ry="100" fill="none" stroke="#00E599" stroke-width="1.5" opacity="0.6"/>
    <ellipse cx="0" cy="0" rx="60" ry="140" fill="none" stroke="#00E599" stroke-width="1.5" opacity="0.6"/>

    <!-- Central 5G Hologram Badge -->
    <circle cx="0" cy="0" r="50" fill="#030814" stroke="url(#gold-metal)" stroke-width="3"/>
    <text x="0" y="8" font-family="sans-serif" font-weight="900" font-size="28" fill="#00E599" text-anchor="middle" filter="url(#neon-glow)">5G</text>
    <text x="0" y="25" font-family="monospace" font-size="9" font-weight="bold" fill="#E5B842" text-anchor="middle">eSIM GLOBAL</text>
  </g>

  <!-- Surrounding Perks Badges -->
  <rect x="80" y="380" width="180" height="40" rx="12" fill="#081022" stroke="#00E599" stroke-width="1.5"/>
  <text x="170" y="405" font-family="sans-serif" font-weight="bold" font-size="11" fill="#00E599" text-anchor="middle">180+ COUNTRIES</text>

  <rect x="310" y="380" width="180" height="40" rx="12" fill="#081022" stroke="#E5B842" stroke-width="1.5"/>
  <text x="400" y="405" font-family="sans-serif" font-weight="bold" font-size="11" fill="#E5B842" text-anchor="middle">INSTANT QR DELIVERY</text>

  <rect x="540" y="380" width="180" height="40" rx="12" fill="#081022" stroke="#38BDF8" stroke-width="1.5"/>
  <text x="630" y="405" font-family="sans-serif" font-weight="bold" font-size="11" fill="#38BDF8" text-anchor="middle">UNLIMITED DATA</text>
</svg>
`;

async function generateMore() {
  const tasks = [
    { svg: planAssetBasedSvg, out: 'public/assets/plans/plan-asset-based.png' },
    { svg: planTimeLockedSvg, out: 'public/assets/plans/plan-time-locked.png' },
    { svg: planAmountTiersSvg, out: 'public/assets/plans/plan-amount-tiers.png' },
    { svg: digitalGoodsSvg, out: 'public/assets/products/digital-goods-esim.png' }
  ];

  for (const t of tasks) {
    await sharp(Buffer.from(t.svg)).png({ compressionLevel: 8 }).toFile(t.out);
    console.log(`Rendered: ${t.out}`);
  }
  console.log('All additional plan and product photos generated successfully!');
}

generateMore().catch(err => {
  console.error(err);
  process.exit(1);
});
