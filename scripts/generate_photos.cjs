const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Common Finance Background SVG Defs
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
    <linearGradient id="silver-metal" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="30%" stop-color="#E2E8F0"/>
      <stop offset="60%" stop-color="#94A3B8"/>
      <stop offset="100%" stop-color="#64748B"/>
    </linearGradient>
    <linearGradient id="card-black" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E293B"/>
      <stop offset="50%" stop-color="#0F172A"/>
      <stop offset="100%" stop-color="#020617"/>
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
    { x: 60, o: 320, c: 260, h: 230, l: 340, up: true },
    { x: 110, o: 260, c: 290, h: 240, l: 310, up: false },
    { x: 160, o: 290, c: 210, h: 190, l: 300, up: true },
    { x: 210, o: 210, c: 170, h: 150, l: 230, up: true },
    { x: 260, o: 170, c: 220, h: 160, l: 240, up: false },
    { x: 310, o: 220, c: 140, h: 120, l: 230, up: true },
    { x: 360, o: 140, c: 110, h: 90, l: 160, up: true },
    { x: 410, o: 110, c: 150, h: 100, l: 170, up: false },
    { x: 460, o: 150, c: 90, h: 80, l: 160, up: true },
    { x: 510, o: 90, c: 70, h: 50, l: 110, up: true },
    { x: 560, o: 70, c: 100, h: 60, l: 120, up: false },
    { x: 610, o: 100, c: 50, h: 40, l: 110, up: true },
    { x: 660, o: 50, c: 40, h: 30, l: 70, up: true },
    { x: 710, o: 40, c: 60, h: 30, l: 80, up: false }
  ];

  return `
    <g opacity="0.18">
      ${sticks.map(s => {
        const color = s.up ? '#00E599' : '#F43F5E';
        const top = Math.min(s.o, s.c);
        const height = Math.max(8, Math.abs(s.o - s.c));
        return `
          <line x1="${s.x}" y1="${s.h}" x2="${s.x}" y2="${s.l}" stroke="${color}" stroke-width="2"/>
          <rect x="${s.x - 12}" y="${top}" width="24" height="${height}" fill="${color}" rx="2"/>
        `;
      }).join('\n')}
      <!-- Grid Lines -->
      <line x1="0" y1="100" x2="${w}" y2="100" stroke="#E5B842" stroke-width="1" stroke-dasharray="4,8" opacity="0.3"/>
      <line x1="0" y1="200" x2="${w}" y2="200" stroke="#E5B842" stroke-width="1" stroke-dasharray="4,8" opacity="0.2"/>
      <line x1="0" y1="300" x2="${w}" y2="300" stroke="#E5B842" stroke-width="1" stroke-dasharray="4,8" opacity="0.15"/>
    </g>
  `;
}

// 1. Physical Casascius Bitcoin Photography
const casasciusSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  ${financeDefs}
  <rect width="800" height="500" fill="url(#finance-bg)"/>
  ${renderCandlesticks(800, 500)}
  <circle cx="400" cy="250" r="280" fill="url(#gold-spot)"/>

  <!-- Presentation Pedestal Slab (Dark Black Obsidian) -->
  <polygon points="120,440 680,440 740,490 60,490" fill="#050A17" stroke="#E5B842" stroke-width="1.5" opacity="0.8"/>
  <line x1="60" y1="490" x2="740" y2="490" stroke="#00E599" stroke-width="3" opacity="0.7"/>

  <!-- Physical Brass Coin in 3D Angle -->
  <g filter="url(#soft-shadow)">
    <!-- Outer Rim -->
    <circle cx="400" cy="240" r="160" fill="url(#gold-metal)" stroke="#5A3A00" stroke-width="5"/>
    <circle cx="400" cy="240" r="150" fill="#0C152B" stroke="#E5B842" stroke-width="3"/>
    
    <!-- Outer Inscription -->
    <circle cx="400" cy="240" r="134" fill="none" stroke="#E5B842" stroke-width="1" stroke-dasharray="3,3" opacity="0.6"/>
    
    <!-- Central Tamper-Evident Rainbow Hologram Core -->
    <circle cx="400" cy="240" r="115" fill="#111B33"/>
    <circle cx="400" cy="240" r="115" fill="url(#gold-metal)" opacity="0.25"/>

    <!-- Holographic Rainbow Foil Ring -->
    <circle cx="400" cy="240" r="105" fill="none" stroke="url(#gold-metal)" stroke-width="8" opacity="0.9"/>
    
    <!-- Bitcoin Emblem (Embossed Gold) -->
    <g transform="translate(400, 240) scale(1.1)">
      <!-- Bitcoin B -->
      <text x="0" y="32" font-family="sans-serif" font-weight="900" font-size="95" fill="url(#gold-metal)" text-anchor="middle" filter="url(#neon-glow)">
        ₿
      </text>
    </g>

    <!-- Tamper Proof Security Window & Honeycomb Hologram -->
    <circle cx="400" cy="240" r="85" fill="none" stroke="#00E599" stroke-width="1.5" stroke-dasharray="5,3" opacity="0.8"/>
    <text x="400" y="175" font-family="monospace" font-weight="bold" font-size="11" fill="#FFF2A3" text-anchor="middle" letter-spacing="3">
      CASASCIUS 2013 · GENUINE
    </text>
    <text x="400" y="325" font-family="monospace" font-weight="bold" font-size="10" fill="#00E599" text-anchor="middle" letter-spacing="2">
      ★ UNTAMPERED PRIVATE KEY HOLOGRAM ★
    </text>
  </g>

  <!-- Museum Archival Slab Frame -->
  <rect x="200" y="50" width="400" height="380" rx="24" fill="none" stroke="#E5B842" stroke-width="2" opacity="0.4"/>
  <rect x="210" y="60" width="380" height="360" rx="20" fill="none" stroke="#FFFFFF" stroke-width="1" opacity="0.15"/>
  <text x="400" y="85" font-family="sans-serif" font-weight="900" font-size="13" fill="#E5B842" text-anchor="middle" letter-spacing="4">
    ARCHIVAL BITCOIN NUMISMATIC BULLION
  </text>
</svg>
`;

// 2. $1,000,000 Banknote & Gold Bullion Photography
const millionBanknoteSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  ${financeDefs}
  <rect width="800" height="500" fill="url(#finance-bg)"/>
  ${renderCandlesticks(800, 500)}
  <circle cx="280" cy="230" r="260" fill="url(#gold-spot)"/>
  <circle cx="580" cy="270" r="220" fill="url(#cyan-spot)"/>

  <!-- Framed $1,000,000 Gold Leaf Banknote (Left/Center Angle) -->
  <g filter="url(#soft-shadow)">
    <!-- Ornate Frame -->
    <rect x="50" y="80" width="440" height="260" rx="12" fill="#091426" stroke="url(#gold-metal)" stroke-width="6"/>
    <rect x="62" y="92" width="416" height="236" rx="8" fill="#040914" stroke="#4D3500" stroke-width="2"/>

    <!-- Green & Gold Intaglio Banknote Border -->
    <rect x="75" y="105" width="390" height="210" rx="4" fill="#071B17" stroke="#10B981" stroke-width="3" opacity="0.95"/>
    <rect x="85" y="115" width="370" height="190" fill="none" stroke="url(#gold-metal)" stroke-width="1.5" stroke-dasharray="6,4"/>

    <!-- Banknote Details -->
    <text x="270" y="145" font-family="serif" font-weight="bold" font-size="13" fill="#E5B842" text-anchor="middle" letter-spacing="4">
      UNITED STATES OF AMERICA
    </text>
    <text x="270" y="165" font-family="sans-serif" font-weight="900" font-size="9" fill="#10B981" text-anchor="middle" letter-spacing="3">
      CERTIFIED HISTORICAL SERIES · NON-NEGOTIABLE BULLION NOTE
    </text>

    <!-- $1,000,000 Big Value -->
    <text x="270" y="225" font-family="serif" font-weight="900" font-size="44" fill="url(#gold-metal)" text-anchor="middle" filter="url(#neon-glow)">
      $1,000,000
    </text>
    <text x="270" y="250" font-family="serif" font-style="italic" font-size="14" fill="#FDE047" text-anchor="middle">
      One Million Dollars in Gold Value
    </text>

    <text x="110" y="285" font-family="monospace" font-size="10" fill="#E5B842">SERIES: 2026-A</text>
    <text x="430" y="285" font-family="monospace" font-size="10" fill="#E5B842" text-anchor="end">PROVENANCE: VERIFIED</text>
  </g>

  <!-- 6 Stacked Gold Bullion Bars (Right Foreground) -->
  <g filter="url(#soft-shadow)" transform="translate(480, 160)">
    <!-- Base Bar 1 -->
    <polygon points="20,180 180,180 230,140 70,140" fill="url(#gold-metal)" stroke="#4A3400" stroke-width="2"/>
    <rect x="20" y="180" width="160" height="40" fill="url(#gold-metal)" stroke="#4A3400" stroke-width="2"/>

    <!-- Base Bar 2 (offset) -->
    <polygon points="90,140 250,140 300,100 140,100" fill="url(#gold-metal)" stroke="#4A3400" stroke-width="2"/>
    <rect x="90" y="140" width="160" height="40" fill="url(#gold-metal)" stroke="#4A3400" stroke-width="2"/>

    <!-- Top Pyramid Bar -->
    <polygon points="60,100 220,100 270,60 110,60" fill="url(#gold-metal)" stroke="#4A3400" stroke-width="2"/>
    <rect x="60" y="100" width="160" height="40" fill="url(#gold-metal)" stroke="#4A3400" stroke-width="2"/>

    <!-- Assay Stamp on Top Bar -->
    <text x="140" y="125" font-family="sans-serif" font-weight="900" font-size="11" fill="#4A3200" text-anchor="middle" letter-spacing="1">
      .9999 FINE GOLD · 1 KILO
    </text>
  </g>

  <!-- Seal of Authenticity Ribbon -->
  <circle cx="680" cy="110" r="45" fill="url(#gold-metal)" stroke="#5A3E00" stroke-width="3" filter="url(#soft-shadow)"/>
  <circle cx="680" cy="110" r="38" fill="#0A1224" stroke="#E5B842" stroke-width="1.5"/>
  <text x="680" y="108" font-family="sans-serif" font-weight="900" font-size="10" fill="#E5B842" text-anchor="middle">
    100% AUDITED
  </text>
  <text x="680" y="122" font-family="sans-serif" font-weight="bold" font-size="8" fill="#00E599" text-anchor="middle">
    ASSAY PROOF
  </text>
</svg>
`;

// 3. Luxury International Crypto Cards Trio
const cardsTrioSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  ${financeDefs}
  <rect width="800" height="500" fill="url(#finance-bg)"/>
  ${renderCandlesticks(800, 500)}
  <circle cx="400" cy="240" r="260" fill="url(#gold-spot)"/>

  <!-- Card 1: Platinum Silver (Left Tilt) -->
  <g transform="translate(160, 180) rotate(-16)" filter="url(#soft-shadow)">
    <rect x="0" y="0" width="280" height="176" rx="14" fill="url(#silver-metal)" stroke="#FFFFFF" stroke-width="1.5"/>
    <circle cx="40" cy="35" r="16" fill="#091124" opacity="0.8"/>
    <!-- EMV Chip -->
    <rect x="35" y="65" width="34" height="26" rx="4" fill="url(#gold-metal)"/>
    <text x="35" y="125" font-family="monospace" font-size="12" font-weight="bold" fill="#0F172A">•••• •••• •••• 3787</text>
    <text x="35" y="152" font-family="sans-serif" font-size="10" font-weight="bold" fill="#1E293B">MATIN PARSA</text>
    <text x="245" y="152" font-family="sans-serif" font-size="12" font-weight="black" fill="#0284C7" text-anchor="end">VISA</text>
  </g>

  <!-- Card 2: World Black Metal (Center Front) -->
  <g transform="translate(250, 150) rotate(2)" filter="url(#soft-shadow)">
    <rect x="0" y="0" width="300" height="188" rx="16" fill="url(#card-black)" stroke="url(#gold-metal)" stroke-width="2.5"/>
    <!-- Gold Foil Nile Emblem -->
    <circle cx="45" cy="40" r="18" fill="url(#gold-metal)"/>
    <text x="75" y="45" font-family="sans-serif" font-size="13" font-weight="900" fill="#FFF2A3" letter-spacing="2">NILE</text>
    <text x="120" y="45" font-family="sans-serif" font-size="9" font-weight="bold" fill="#E5B842" letter-spacing="1">SOVEREIGN</text>

    <!-- EMV Chip with micro contacts -->
    <rect x="45" y="70" width="36" height="28" rx="5" fill="url(#gold-metal)" stroke="#664600" stroke-width="1"/>
    
    <text x="45" y="132" font-family="monospace" font-size="14" font-weight="bold" fill="#E2E8F0" letter-spacing="3">5205 8123 1047 5546</text>
    <div style="display:flex">
      <text x="45" y="162" font-family="sans-serif" font-size="11" font-weight="bold" fill="#FFFFFF">MATIN PARSA</text>
      <text x="170" y="162" font-family="monospace" font-size="10" fill="#E5B842">11/28</text>
      <!-- Mastercard Two Interlocking Circles -->
      <circle cx="250" cy="156" r="14" fill="#EB001B" opacity="0.95"/>
      <circle cx="268" cy="156" r="14" fill="#F79E1B" opacity="0.95"/>
    </div>
  </g>

  <!-- Card 3: Commercial Elite Titanium (Right Tilt) -->
  <g transform="translate(390, 190) rotate(18)" filter="url(#soft-shadow)">
    <rect x="0" y="0" width="280" height="176" rx="14" fill="#182236" stroke="#00E599" stroke-width="1.5"/>
    <rect x="35" y="65" width="34" height="26" rx="4" fill="url(#gold-metal)"/>
    <text x="35" y="125" font-family="monospace" font-size="12" font-weight="bold" fill="#00E599">5331 •••• •••• 8336</text>
    <text x="35" y="152" font-family="sans-serif" font-size="10" font-weight="bold" fill="#FFFFFF">MATIN PARSA</text>
    <text x="245" y="152" font-family="sans-serif" font-size="10" font-weight="bold" fill="#E5B842" text-anchor="end">COMMERCIAL ELITE</text>
  </g>

  <!-- Bottom Limit Banner -->
  <text x="400" y="440" font-family="monospace" font-weight="900" font-size="15" fill="#E5B842" text-anchor="middle" letter-spacing="3">
    ★ GLOBAL SPEND BALANCES: $100 TO $100,000 USD · 5% CASHBACK ★
  </text>
</svg>
`;

// 4. Crypto Reserve Vault (BTC & USDT Canisters)
const cryptoVaultSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  ${financeDefs}
  <rect width="800" height="500" fill="url(#finance-bg)"/>
  ${renderCandlesticks(800, 500)}
  <circle cx="280" cy="250" r="240" fill="url(#gold-spot)"/>
  <circle cx="540" cy="250" r="240" fill="url(#cyan-spot)"/>

  <!-- Left: Bitcoin Reserve Canister -->
  <g transform="translate(180, 80)" filter="url(#soft-shadow)">
    <!-- Titanium Body -->
    <rect x="0" y="60" width="180" height="260" rx="20" fill="#0C1527" stroke="url(#gold-metal)" stroke-width="3"/>
    <!-- Glass Chamber -->
    <rect x="20" y="90" width="140" height="170" rx="12" fill="#060C18" stroke="#F59E0B" stroke-width="1.5"/>
    <!-- Glowing ₿ inside -->
    <circle cx="90" cy="175" r="45" fill="#F7931A" opacity="0.2" filter="url(#neon-glow)"/>
    <text x="90" y="205" font-family="sans-serif" font-weight="900" font-size="75" fill="#F7931A" text-anchor="middle">₿</text>
    <!-- Cap & Base -->
    <rect x="20" y="40" width="140" height="25" rx="8" fill="url(#gold-metal)"/>
    <rect x="20" y="315" width="140" height="25" rx="8" fill="url(#gold-metal)"/>
    <text x="90" y="300" font-family="monospace" font-size="11" font-weight="bold" fill="#FFF2A3" text-anchor="middle">
      BTC RESERVE: 25.0 LOT
    </text>
  </g>

  <!-- Right: USDT Liquidity Vault Canister -->
  <g transform="translate(440, 80)" filter="url(#soft-shadow)">
    <!-- Titanium Body -->
    <rect x="0" y="60" width="180" height="260" rx="20" fill="#0C1527" stroke="#00E599" stroke-width="3"/>
    <!-- Glass Chamber -->
    <rect x="20" y="90" width="140" height="170" rx="12" fill="#060C18" stroke="#00E599" stroke-width="1.5"/>
    <!-- Glowing ₮ inside -->
    <circle cx="90" cy="175" r="45" fill="#26A17B" opacity="0.2" filter="url(#neon-glow)"/>
    <text x="90" y="205" font-family="sans-serif" font-weight="900" font-size="75" fill="#00E599" text-anchor="middle">₮</text>
    <!-- Cap & Base -->
    <rect x="20" y="40" width="140" height="25" rx="8" fill="#00E599"/>
    <rect x="20" y="315" width="140" height="25" rx="8" fill="#00E599"/>
    <text x="90" y="300" font-family="monospace" font-size="11" font-weight="bold" fill="#00E599" text-anchor="middle">
      USDT VAULT: 100K LOT
    </text>
  </g>

  <!-- Center Verification Link Beam -->
  <line x1="360" y1="240" x2="440" y2="240" stroke="#E5B842" stroke-width="4" stroke-dasharray="8,4" filter="url(#neon-glow)"/>
  <text x="400" y="440" font-family="monospace" font-weight="bold" font-size="13" fill="#E2E8F0" text-anchor="middle" letter-spacing="2">
    10% DISCOUNT CRYPTO · 20% DISCOUNT NILE TOKEN SETTLEMENT
  </text>
</svg>
`;

// 5. Plan 4: ULTIMATE Plan Flagship (50,000% Vault Photography)
const planUltimateSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  ${financeDefs}
  <rect width="800" height="500" fill="url(#finance-bg)"/>
  ${renderCandlesticks(800, 500)}
  <circle cx="400" cy="220" r="300" fill="url(#gold-spot)"/>

  <!-- Heavy High-Security Vault Door Outline -->
  <circle cx="400" cy="230" r="190" fill="#081022" stroke="url(#gold-metal)" stroke-width="8" filter="url(#soft-shadow)"/>
  <circle cx="400" cy="230" r="170" fill="#040814" stroke="#4A3400" stroke-width="4"/>

  <!-- Vault Spokes & Lock Bolts -->
  ${Array.from({length: 8}).map((_, i) => {
    const rad = (i * 45 * Math.PI) / 180;
    const x1 = 400 + 130 * Math.cos(rad);
    const y1 = 230 + 130 * Math.sin(rad);
    const x2 = 400 + 180 * Math.cos(rad);
    const y2 = 230 + 180 * Math.sin(rad);
    return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="url(#gold-metal)" stroke-width="12" stroke-linecap="round"/>`;
  }).join('\n')}

  <!-- Central Vault Dial & 50,000% APY Hologram Badge -->
  <circle cx="400" cy="230" r="120" fill="url(#gold-metal)" stroke="#382500" stroke-width="4" filter="url(#soft-shadow)"/>
  <circle cx="400" cy="230" r="110" fill="#070D1B"/>

  <text x="400" y="195" font-family="sans-serif" font-weight="900" font-size="12" fill="#E5B842" text-anchor="middle" letter-spacing="3">
    FLAGSHIP APEX YIELD
  </text>
  <text x="400" y="245" font-family="sans-serif" font-weight="900" font-size="46" fill="url(#gold-metal)" text-anchor="middle" filter="url(#neon-glow)">
    50,000%
  </text>
  <text x="400" y="275" font-family="monospace" font-weight="bold" font-size="12" fill="#00E599" text-anchor="middle" letter-spacing="2">
    1 YEAR HORIZON · CAPPED $1M
  </text>

  <!-- Bottom Institutional Guarantee Ribbon -->
  <rect x="180" y="420" width="440" height="40" rx="12" fill="#0A1326" stroke="#E5B842" stroke-width="1.5"/>
  <text x="400" y="445" font-family="sans-serif" font-weight="bold" font-size="12" fill="#FFF2A3" text-anchor="middle" letter-spacing="1">
    ★ 100% INSTITUTIONAL GUARANTEE BY NILE ECOSYSTEM LTD ★
  </text>
</svg>
`;

// 6. Plan 5: 90-Day Surprise Campaign Vault Photography
const planSurpriseSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  ${financeDefs}
  <rect width="800" height="500" fill="url(#finance-bg)"/>
  ${renderCandlesticks(800, 500)}
  <circle cx="400" cy="230" r="280" fill="url(#gold-spot)"/>
  <circle cx="400" cy="230" r="180" fill="url(#cyan-spot)"/>

  <!-- Radial Volumetric Light Beams (Sunburst) -->
  <g opacity="0.35" stroke="url(#gold-metal)" stroke-width="3">
    ${Array.from({length: 24}).map((_, i) => {
      const rad = (i * 15 * Math.PI) / 180;
      const x1 = 400 + 40 * Math.cos(rad);
      const y1 = 230 + 40 * Math.sin(rad);
      const x2 = 400 + 380 * Math.cos(rad);
      const y2 = 230 + 380 * Math.sin(rad);
      return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke-dasharray="8,12"/>`;
    }).join('\n')}
  </g>

  <!-- Golden Treasure Vault Chest with Radiant Light -->
  <g filter="url(#soft-shadow)" transform="translate(240, 120)">
    <!-- Chest Lid -->
    <path d="M 40 90 Q 160 20 280 90 L 300 130 L 20 130 Z" fill="url(#gold-metal)" stroke="#4A3400" stroke-width="3"/>
    <!-- Chest Base -->
    <rect x="20" y="130" width="280" height="130" rx="8" fill="#0C162E" stroke="url(#gold-metal)" stroke-width="4"/>
    <!-- Gold Trim Straps -->
    <rect x="60" y="130" width="24" height="130" fill="url(#gold-metal)"/>
    <rect x="236" y="130" width="24" height="130" fill="url(#gold-metal)"/>

    <!-- Keyhole / Chronometer Lock -->
    <circle cx="160" cy="180" r="25" fill="url(#gold-metal)" stroke="#4A3400" stroke-width="2"/>
    <circle cx="160" cy="180" r="18" fill="#070D1B"/>
    <text x="160" y="185" font-family="sans-serif" font-weight="900" font-size="16" fill="#00E599" text-anchor="middle">90d</text>
  </g>

  <!-- Surprise Yield Banners -->
  <g filter="url(#soft-shadow)">
    <rect x="150" y="380" width="500" height="60" rx="16" fill="#081022" stroke="url(#gold-metal)" stroke-width="2"/>
    <text x="400" y="405" font-family="sans-serif" font-weight="900" font-size="14" fill="#FFF2A3" text-anchor="middle" letter-spacing="2">
      90-DAY ULTIMATE SURPRISE YIELD HORIZONS
    </text>
    <text x="400" y="425" font-family="monospace" font-weight="bold" font-size="12" fill="#00E599" text-anchor="middle">
      WEEKLY: +150% · MONTHLY: +1,500% · 3 MONTHS: +15,000%
    </text>
  </g>
</svg>
`;

// Write and render all images
async function generateAll() {
  console.log('Rendering high-resolution 3D finance photography assets...');

  const tasks = [
    { svg: casasciusSvg, out: 'public/assets/products/casascius-bitcoin-collectible.png' },
    { svg: millionBanknoteSvg, out: 'public/assets/products/million-dollar-banknote-gold.png' },
    { svg: cardsTrioSvg, out: 'public/assets/products/nile-cards-trio.png' },
    { svg: cryptoVaultSvg, out: 'public/assets/products/crypto-reserve-vault.png' },
    { svg: planUltimateSvg, out: 'public/assets/plans/plan-ultimate-flagship.png' },
    { svg: planSurpriseSvg, out: 'public/assets/plans/plan-surprise-campaign.png' }
  ];

  for (const t of tasks) {
    await sharp(Buffer.from(t.svg))
      .png({ compressionLevel: 8 })
      .toFile(t.out);
    console.log(`Rendered: ${t.out}`);
  }

  // Also create a high-res finance background for the pages
  const bgSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
    ${financeDefs}
    <rect width="1920" height="1080" fill="url(#finance-bg)"/>
    <circle cx="300" cy="200" r="500" fill="url(#gold-spot)"/>
    <circle cx="1600" cy="400" r="600" fill="url(#cyan-spot)"/>
    <circle cx="960" cy="900" r="500" fill="url(#gold-spot)"/>
    ${renderCandlesticks(1920, 1080)}
    <!-- Vignette borders -->
    <rect width="1920" height="1080" fill="none" stroke="#000000" stroke-width="120" opacity="0.6"/>
  </svg>
  `;

  await sharp(Buffer.from(bgSvg))
    .jpeg({ quality: 92 })
    .toFile('public/assets/backgrounds/luxury-finance-bg.jpg');

  console.log('Rendered: public/assets/backgrounds/luxury-finance-bg.jpg');
}

generateAll().catch(err => {
  console.error('Error generating photos:', err);
  process.exit(1);
});
