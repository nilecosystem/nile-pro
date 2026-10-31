const fs = require('fs');
const path = require('path');
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
      <stop offset="0%" stop-color="#F5D061" stop-opacity="0.4"/>
      <stop offset="50%" stop-color="#D4AF37" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#030611" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="cyan-spot" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#00E599" stop-opacity="0.3"/>
      <stop offset="50%" stop-color="#0077B6" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="#030611" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="purple-spot" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#A855F7" stop-opacity="0.35"/>
      <stop offset="50%" stop-color="#6366F1" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="#030611" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="gold-metal" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF8D6"/>
      <stop offset="25%" stop-color="#F3DF79"/>
      <stop offset="50%" stop-color="#D4AF37"/>
      <stop offset="75%" stop-color="#8C6200"/>
      <stop offset="100%" stop-color="#E5B842"/>
    </linearGradient>
    <linearGradient id="cyber-blue" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="50%" stop-color="#0284C7"/>
      <stop offset="100%" stop-color="#0369A1"/>
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
    { x: 50, o: 330, c: 270, h: 240, l: 350, up: true },
    { x: 100, o: 270, c: 300, h: 250, l: 320, up: false },
    { x: 150, o: 300, c: 220, h: 200, l: 310, up: true },
    { x: 200, o: 220, c: 180, h: 160, l: 240, up: true },
    { x: 250, o: 180, c: 210, h: 170, l: 230, up: false },
    { x: 300, o: 210, c: 150, h: 130, l: 220, up: true },
    { x: 500, o: 150, c: 110, h: 90, l: 160, up: true },
    { x: 550, o: 110, c: 140, h: 100, l: 150, up: false },
    { x: 600, o: 140, c: 80, h: 60, l: 150, up: true },
    { x: 650, o: 80, c: 50, h: 40, l: 90, up: true },
    { x: 700, o: 50, c: 70, h: 40, l: 80, up: false },
    { x: 750, o: 70, c: 30, h: 20, l: 80, up: true },
  ];

  let svg = '<g opacity="0.32">';
  for (let s of sticks) {
    const color = s.up ? '#00E599' : '#EF4444';
    svg += `<line x1="${s.x}" y1="${s.h}" x2="${s.x}" y2="${s.l}" stroke="${color}" stroke-width="2"/>`;
    const yTop = Math.min(s.o, s.c);
    const boxHeight = Math.max(Math.abs(s.o - s.c), 8);
    svg += `<rect x="${s.x - 7}" y="${yTop}" width="14" height="${boxHeight}" fill="${color}" rx="2"/>`;
  }
  svg += '<path d="M 50 300 Q 200 240, 350 160 T 600 70 T 750 30" fill="none" stroke="#E5B842" stroke-width="2.5" stroke-dasharray="6,4" opacity="0.8"/>';
  svg += '<path d="M 50 340 L 200 280 L 350 200 L 600 110 L 750 60" fill="none" stroke="#00E599" stroke-width="2" opacity="0.5"/>';
  svg += '</g>';
  return svg;
}

// 1. Software Licenses Box & Security Suite
const softwareLicenseSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  ${financeDefs}
  <rect width="800" height="500" fill="url(#finance-bg)"/>
  ${renderCandlesticks(800, 500)}
  <circle cx="400" cy="230" r="260" fill="url(#cyan-spot)"/>

  <!-- 3D Software Holographic License Box -->
  <g transform="translate(400, 220)" filter="url(#soft-shadow)">
    <!-- Back Glow Plate -->
    <rect x="-160" y="-130" width="320" height="230" rx="18" fill="#071224" stroke="url(#cyber-blue)" stroke-width="2.5"/>
    
    <!-- Top Header Bar -->
    <rect x="-160" y="-130" width="320" height="42" rx="18" fill="#0B1A33" stroke="none"/>
    <circle cx="-135" cy="-110" r="5" fill="#EF4444"/>
    <circle cx="-118" cy="-110" r="5" fill="#E5B842"/>
    <circle cx="-101" cy="-110" r="5" fill="#00E599"/>
    <text x="0" y="-105" font-family="monospace" font-size="11" font-weight="bold" fill="#38BDF8" text-anchor="middle">VERIFIED SOFTWARE LICENSING · GENUINE RETAIL</text>

    <!-- Holographic Security Key Emblem -->
    <circle cx="0" cy="-25" r="50" fill="#0A1830" stroke="url(#gold-metal)" stroke-width="3" filter="url(#neon-glow)"/>
    <text x="0" y="-16" font-family="sans-serif" font-size="34" fill="#E5B842" text-anchor="middle">🔑</text>

    <!-- Product Badges Grid -->
    <g transform="translate(-140, 40)">
      <rect x="0" y="0" width="85" height="36" rx="8" fill="#0A162C" stroke="#38BDF8" stroke-width="1.5"/>
      <text x="42.5" y="16" font-family="sans-serif" font-size="9" font-weight="bold" fill="#FFFFFF" text-anchor="middle">WINDOWS 11</text>
      <text x="42.5" y="28" font-family="monospace" font-size="8" fill="#00E599" text-anchor="middle">LIFETIME PRO</text>

      <rect x="95" y="0" width="85" height="36" rx="8" fill="#0A162C" stroke="#E5B842" stroke-width="1.5"/>
      <text x="137.5" y="16" font-family="sans-serif" font-size="9" font-weight="bold" fill="#FFFFFF" text-anchor="middle">OFFICE 2024</text>
      <text x="137.5" y="28" font-family="monospace" font-size="8" fill="#E5B842" text-anchor="middle">PRO PLUS</text>

      <rect x="190" y="0" width="90" height="36" rx="8" fill="#0A162C" stroke="#00E599" stroke-width="1.5"/>
      <text x="235" y="16" font-family="sans-serif" font-size="9" font-weight="bold" fill="#FFFFFF" text-anchor="middle">KASPERSKY</text>
      <text x="235" y="28" font-family="monospace" font-size="8" fill="#00E599" text-anchor="middle">PREMIUM TOTAL</text>
    </g>
  </g>

  <!-- Bottom Certificate Banner -->
  <text x="400" y="440" font-family="monospace" font-weight="bold" font-size="13" fill="#E2E8F0" text-anchor="middle" letter-spacing="2">
    ★ 100% GENUINE OEM / RETAIL DIGITAL KEYS · DIRECT SERVER ACTIVATION ★
  </text>
</svg>
`;

// 2. Luxury Gift Cards & Universal Vouchers
const giftcardSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  ${financeDefs}
  <rect width="800" height="500" fill="url(#finance-bg)"/>
  ${renderCandlesticks(800, 500)}
  <circle cx="400" cy="220" r="260" fill="url(#gold-spot)"/>

  <!-- Stacked 3D Luxury Gift Cards -->
  <g transform="translate(400, 220)" filter="url(#soft-shadow)">
    <!-- Back Card: Apple Universal -->
    <g transform="translate(-80, -40) rotate(-10)">
      <rect x="-120" y="-75" width="240" height="150" rx="14" fill="#0B1322" stroke="#64748B" stroke-width="2"/>
      <text x="0" y="-30" font-family="sans-serif" font-size="28" fill="#FFFFFF" text-anchor="middle"></text>
      <text x="0" y="5" font-family="sans-serif" font-weight="bold" font-size="13" fill="#FFFFFF" text-anchor="middle">Apple Store &amp; iTunes</text>
      <text x="0" y="30" font-family="monospace" font-size="11" fill="#E5B842" text-anchor="middle">$100 · $250 · $500</text>
    </g>

    <!-- Middle Card: Steam Gaming -->
    <g transform="translate(80, -30) rotate(12)">
      <rect x="-120" y="-75" width="240" height="150" rx="14" fill="#08101E" stroke="#00E599" stroke-width="2"/>
      <text x="0" y="-25" font-family="sans-serif" font-weight="900" font-size="16" fill="#00E599" text-anchor="middle">STEAM WALLET</text>
      <text x="0" y="5" font-family="sans-serif" font-size="11" fill="#94A3B8" text-anchor="middle">Global Currency Redemption</text>
      <text x="0" y="30" font-family="monospace" font-size="11" fill="#00E599" text-anchor="middle">Instant Code Reveal</text>
    </g>

    <!-- Front Hero Card: Amazon Sovereign Gold -->
    <g transform="translate(0, 15)">
      <rect x="-140" y="-85" width="280" height="170" rx="16" fill="url(#gold-metal)" stroke="#FFFFFF" stroke-width="2"/>
      <rect x="-135" y="-80" width="270" height="160" rx="13" fill="#060C19"/>
      
      <circle cx="-95" cy="-45" r="16" fill="url(#gold-metal)"/>
      <text x="-95" y="-39" font-family="sans-serif" font-weight="900" font-size="12" fill="#060C19" text-anchor="middle">a</text>
      <text x="15" y="-40" font-family="sans-serif" font-weight="900" font-size="16" fill="#FFFFFF" text-anchor="middle">amazon.com</text>
      <text x="95" y="-40" font-family="monospace" font-weight="bold" font-size="12" fill="#00E599" text-anchor="middle">$100 USD</text>

      <path d="M -90 10 Q 0 35, 90 10" fill="none" stroke="#E5B842" stroke-width="4" stroke-linecap="round"/>
      <polygon points="90,10 82,4 84,14" fill="#E5B842"/>

      <text x="0" y="55" font-family="monospace" font-size="10" font-weight="bold" fill="#E2E8F0" text-anchor="middle">GLOBAL DIGITAL REDEMPTION · ZERO EXPIRATION</text>
    </g>
  </g>

  <text x="400" y="440" font-family="monospace" font-weight="bold" font-size="13" fill="#E2E8F0" text-anchor="middle" letter-spacing="2">
    ★ INSTANT ENCRYPTED VOUCHER DELIVERY · ACCEPTED WORLDWIDE ★
  </text>
</svg>
`;

// 3. Smart Contract Audit & Token Development Suite
const tokenDevSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  ${financeDefs}
  <rect width="800" height="500" fill="url(#finance-bg)"/>
  ${renderCandlesticks(800, 500)}
  <circle cx="400" cy="220" r="260" fill="url(#purple-spot)"/>

  <!-- Holographic Smart Contract Shield & Compiler Core -->
  <g transform="translate(400, 220)" filter="url(#soft-shadow)">
    <!-- Shield Outline -->
    <path d="M 0 -130 L 140 -80 L 140 30 Q 140 120, 0 160 Q -140 120, -140 30 L -140 -80 Z" fill="#070E1E" stroke="url(#gold-metal)" stroke-width="4"/>
    <path d="M 0 -115 L 122 -72 L 122 25 Q 122 105, 0 142 Q -122 105, -122 25 L -122 -72 Z" fill="#040813" stroke="#8B5CF6" stroke-width="1.5"/>

    <!-- Central Code & Audit Hexagon -->
    <polygon points="0,-50 45,-25 45,25 0,50 -45,25 -45,-25" fill="#0C1B36" stroke="#00E599" stroke-width="3" filter="url(#neon-glow)"/>
    <text x="0" y="8" font-family="monospace" font-weight="900" font-size="22" fill="#00E599" text-anchor="middle">&lt;/&gt;</text>

    <!-- Verified Badge -->
    <circle cx="0" cy="85" r="22" fill="url(#gold-metal)"/>
    <circle cx="0" cy="85" r="18" fill="#070D1B"/>
    <text x="0" y="91" font-family="sans-serif" font-size="14" fill="#00E599" text-anchor="middle">✓</text>
    <text x="0" y="118" font-family="monospace" font-size="9" font-weight="bold" fill="#E5B842" text-anchor="middle">AUDITED 100%</text>

    <!-- Floating Network Nodes -->
    <g transform="translate(-105, -15)">
      <circle cx="0" cy="0" r="18" fill="#081428" stroke="#38BDF8" stroke-width="2"/>
      <text x="0" y="4" font-family="monospace" font-size="9" font-weight="bold" fill="#38BDF8" text-anchor="middle">EVM</text>
    </g>
    <g transform="translate(105, -15)">
      <circle cx="0" cy="0" r="18" fill="#081428" stroke="#F59E0B" stroke-width="2"/>
      <text x="0" y="4" font-family="monospace" font-size="9" font-weight="bold" fill="#F59E0B" text-anchor="middle">BEP</text>
    </g>
  </g>

  <text x="400" y="440" font-family="monospace" font-weight="bold" font-size="13" fill="#E2E8F0" text-anchor="middle" letter-spacing="2">
    ★ ENTERPRISE SMART CONTRACT DEPLOYMENT · ZERO EXPLOIT AUDIT SUITE ★
  </text>
</svg>
`;

// 4. Plan 4: NILE Native Staking & Ecosystem Multipliers
const nileStakingSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  ${financeDefs}
  <rect width="800" height="500" fill="url(#finance-bg)"/>
  ${renderCandlesticks(800, 500)}
  <circle cx="400" cy="220" r="260" fill="url(#gold-spot)"/>

  <!-- 3D Staking Vault with Radiant Gold NILE Coin Center -->
  <g transform="translate(400, 220)" filter="url(#soft-shadow)">
    <!-- Outer Vault Ring -->
    <circle cx="0" cy="0" r="150" fill="#060C1B" stroke="url(#gold-metal)" stroke-width="6"/>
    <circle cx="0" cy="0" r="135" fill="#020610" stroke="#78350F" stroke-width="2"/>

    <!-- Dynamic Orbiting Energy Rings -->
    <ellipse cx="0" cy="0" rx="140" ry="60" fill="none" stroke="#00E599" stroke-width="2" stroke-dasharray="10,6" opacity="0.8"/>
    <ellipse cx="0" cy="0" rx="60" ry="140" fill="none" stroke="#E5B842" stroke-width="2" stroke-dasharray="10,6" opacity="0.8"/>

    <!-- Central Gold Horus Medallion Core -->
    <circle cx="0" cy="0" r="75" fill="url(#gold-metal)" stroke="#FFFFFF" stroke-width="2" filter="url(#neon-glow)"/>
    <circle cx="0" cy="0" r="68" fill="#070D1B"/>
    
    <!-- Pyramid Graphic -->
    <polygon points="0,-40 38,25 -38,25" fill="url(#gold-metal)" opacity="0.95"/>
    <polygon points="0,-40 0,25 38,25" fill="#92400E" opacity="0.4"/>
    <circle cx="0" cy="-6" r="8" fill="#070D1B"/>
    <circle cx="0" cy="-6" r="4" fill="#00E599" filter="url(#neon-glow)"/>

    <text x="0" y="48" font-family="sans-serif" font-weight="900" font-size="12" fill="#E5B842" text-anchor="middle" letter-spacing="1">NILE STAKING</text>

    <!-- Yield Multiplier Badges -->
    <g transform="translate(-160, 0)">
      <rect x="-45" y="-20" width="90" height="40" rx="10" fill="#081328" stroke="#00E599" stroke-width="2"/>
      <text x="0" y="-3" font-family="sans-serif" font-weight="bold" font-size="10" fill="#94A3B8" text-anchor="middle">DIAMOND</text>
      <text x="0" y="12" font-family="monospace" font-weight="900" font-size="13" fill="#00E599" text-anchor="middle">22.0% APR</text>
    </g>

    <g transform="translate(160, 0)">
      <rect x="-45" y="-20" width="90" height="40" rx="10" fill="#081328" stroke="#E5B842" stroke-width="2"/>
      <text x="0" y="-3" font-family="sans-serif" font-weight="bold" font-size="10" fill="#94A3B8" text-anchor="middle">MULTIPLIER</text>
      <text x="0" y="12" font-family="monospace" font-weight="900" font-size="13" fill="#E5B842" text-anchor="middle">5.0× BOOST</text>
    </g>
  </g>

  <text x="400" y="440" font-family="monospace" font-weight="bold" font-size="13" fill="#E2E8F0" text-anchor="middle" letter-spacing="2">
    ★ PLAN 4: NILE ECOSYSTEM STAKING · DAILY COMPOUNDED LIQUIDITY REWARDS ★
  </text>
</svg>
`;

async function main() {
  const tasks = [
    { svg: softwareLicenseSvg, out: 'public/assets/products/software-license-box.png' },
    { svg: giftcardSvg, out: 'public/assets/products/giftcard-luxury-vault.png' },
    { svg: tokenDevSvg, out: 'public/assets/products/smart-contract-audit.png' },
    { svg: nileStakingSvg, out: 'public/assets/plans/plan-nile-staking.png' }
  ];

  for (let t of tasks) {
    await sharp(Buffer.from(t.svg)).png({ compressionLevel: 8 }).toFile(t.out);
    console.log(`Generated: ${t.out}`);
  }
  console.log('Extra photos successfully rendered!');
}

main().catch(console.error);
