const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Create high-res 1024x1024 SVG of the Official Nile Ecosystem Mascot Logo
const svg = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Gradient -->
    <radialGradient id="bgGrad" cx="50%" cy="45%" r="65%">
      <stop offset="0%" stop-color="#FBF3EB"/>
      <stop offset="70%" stop-color="#F3E5D8"/>
      <stop offset="100%" stop-color="#E8D5C4"/>
    </radialGradient>

    <!-- Globe Blue Gradient -->
    <radialGradient id="globeGrad" cx="40%" cy="35%" r="70%">
      <stop offset="0%" stop-color="#BEE3F8"/>
      <stop offset="60%" stop-color="#8AC7E8"/>
      <stop offset="100%" stop-color="#5B9EC9"/>
    </radialGradient>

    <!-- Metallic Gold Gradient -->
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF4B8"/>
      <stop offset="30%" stop-color="#F5CF63"/>
      <stop offset="70%" stop-color="#D49B27"/>
      <stop offset="100%" stop-color="#8E5E0B"/>
    </linearGradient>

    <linearGradient id="goldLight" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFF9D2"/>
      <stop offset="50%" stop-color="#F3C34B"/>
      <stop offset="100%" stop-color="#A56E10"/>
    </linearGradient>

    <!-- Crocodile Skin Green Gradients -->
    <linearGradient id="crocSkin" x1="20%" y1="10%" x2="80%" y2="90%">
      <stop offset="0%" stop-color="#8FD19E"/>
      <stop offset="40%" stop-color="#64B07B"/>
      <stop offset="100%" stop-color="#3D7D54"/>
    </linearGradient>

    <linearGradient id="crocUnderbelly" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFF6D6"/>
      <stop offset="100%" stop-color="#E5D19E"/>
    </linearGradient>

    <!-- Hoodie Charcoal Gradient -->
    <linearGradient id="hoodieGrad" x1="10%" y1="0%" x2="90%" y2="100%">
      <stop offset="0%" stop-color="#2D3748"/>
      <stop offset="50%" stop-color="#1A202C"/>
      <stop offset="100%" stop-color="#11151D"/>
    </linearGradient>

    <!-- Nile Blue River Wave Gradient -->
    <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38B2AC"/>
      <stop offset="50%" stop-color="#00A3E0"/>
      <stop offset="100%" stop-color="#006699"/>
    </linearGradient>

    <!-- Drop Shadows -->
    <filter id="dropShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#5A3A10" flood-opacity="0.35"/>
    </filter>

    <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>

    <filter id="textShadow" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx="3" dy="8" stdDeviation="6" flood-color="#301A02" flood-opacity="0.7"/>
    </filter>
  </defs>

  <!-- Background Base Canvas -->
  <rect width="1024" height="1024" rx="200" fill="url(#bgGrad)"/>

  <!-- Outer Circular Medallion Frame -->
  <g filter="url(#dropShadow)">
    <!-- Gold Medallion Rim -->
    <circle cx="512" cy="420" r="390" fill="none" stroke="url(#goldGrad)" stroke-width="24"/>
    <circle cx="512" cy="420" r="378" fill="none" stroke="#68420B" stroke-width="4"/>
    <circle cx="512" cy="420" r="372" fill="url(#globeGrad)"/>

    <!-- Globe Map Coordinate Lines -->
    <ellipse cx="512" cy="420" rx="372" ry="180" fill="none" stroke="#FFFFFF" stroke-opacity="0.35" stroke-width="3"/>
    <ellipse cx="512" cy="420" rx="372" ry="320" fill="none" stroke="#FFFFFF" stroke-opacity="0.25" stroke-width="3"/>
    <line x1="512" y1="48" x2="512" y2="792" stroke="#FFFFFF" stroke-opacity="0.35" stroke-width="3"/>
    <line x1="140" y1="420" x2="884" y2="420" stroke="#FFFFFF" stroke-opacity="0.35" stroke-width="3"/>

    <!-- Rising Financial Growth Bars on the Right -->
    <g transform="translate(680, 240)">
      <!-- Bar 1 -->
      <rect x="0" y="190" width="36" height="150" rx="6" fill="url(#goldLight)" stroke="#8C5C0C" stroke-width="4"/>
      <!-- Bar 2 -->
      <rect x="48" y="120" width="36" height="220" rx="6" fill="url(#goldLight)" stroke="#8C5C0C" stroke-width="4"/>
      <!-- Bar 3 -->
      <rect x="96" y="50" width="36" height="290" rx="6" fill="url(#goldLight)" stroke="#8C5C0C" stroke-width="4"/>
      <!-- Growth Arrow Line -->
      <path d="M -20 220 L 40 140 L 90 80 L 150 10" fill="none" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round"/>
      <path d="M -20 220 L 40 140 L 90 80 L 150 10" fill="none" stroke="url(#goldGrad)" stroke-width="6" stroke-linecap="round"/>
      <!-- Arrowhead -->
      <polygon points="150,10 115,22 138,45" fill="url(#goldLight)" stroke="#8C5C0C" stroke-width="3"/>
    </g>
  </g>

  <!-- ============================================== -->
  <!-- CROCODILE MASCOT BODY & HOODIE                 -->
  <!-- ============================================== -->
  <g id="mascot">
    <!-- Dark Blue/Charcoal Hoodie Body -->
    <path d="M 270 590 
             C 270 500, 340 450, 420 430 
             L 600 430 
             C 680 450, 750 500, 750 590 
             L 770 730 
             L 250 730 Z" 
          fill="url(#hoodieGrad)" stroke="#111622" stroke-width="10"/>

    <!-- Hoodie Details: Shoulders, Seams, Zippers -->
    <path d="M 440 435 L 420 720" stroke="#0E131C" stroke-width="6"/>
    <path d="M 580 435 L 600 720" stroke="#0E131C" stroke-width="6"/>
    <!-- Center Zipper -->
    <line x1="512" y1="440" x2="512" y2="720" stroke="#F5CF63" stroke-width="6" stroke-dasharray="8 3"/>

    <!-- Underbelly / Throat visible in collar -->
    <path d="M 460 410 C 460 410, 512 450, 560 410 L 550 490 C 530 500, 490 500, 470 490 Z" 
          fill="url(#crocUnderbelly)" stroke="#523C13" stroke-width="4"/>

    <!-- Gold Monogram 'N' + Crown on Left Breast of Hoodie -->
    <g transform="translate(625, 485) scale(0.65)">
      <!-- Mini Crown -->
      <path d="M 20 15 L 28 35 L 50 20 L 72 35 L 80 15 L 85 45 L 15 45 Z" fill="url(#goldLight)" stroke="#68420B" stroke-width="2"/>
      <circle cx="20" cy="15" r="4" fill="#FFFFFF"/>
      <circle cx="50" cy="20" r="4" fill="#FFFFFF"/>
      <circle cx="80" cy="15" r="4" fill="#FFFFFF"/>
      <!-- Monogram 'N' -->
      <path d="M 22 55 L 42 55 L 62 105 L 62 55 L 82 55 L 82 125 L 62 125 L 42 75 L 42 125 L 22 125 Z" 
            fill="url(#goldLight)" stroke="#68420B" stroke-width="4"/>
    </g>

    <!-- Crocodile Head & Snout -->
    <!-- Head Base -->
    <path d="M 330 310 
             C 330 200, 430 140, 530 140 
             C 630 140, 690 200, 700 270 
             C 705 310, 680 370, 620 400 
             C 540 430, 420 430, 360 380 
             C 340 360, 330 335, 330 310 Z" 
          fill="url(#crocSkin)" stroke="#22472F" stroke-width="10"/>

    <!-- Scaly Crests on Top of Head -->
    <path d="M 430 140 Q 450 115 470 135 Q 490 110 510 135 Q 530 110 550 135 Q 570 115 590 140" 
          fill="none" stroke="#22472F" stroke-width="8" stroke-linecap="round"/>

    <!-- Snout & Strong Jaw Extended Forward -->
    <path d="M 360 270 
             C 320 280, 240 310, 260 380 
             C 275 420, 360 435, 490 430 
             C 590 425, 680 400, 700 340 
             C 710 300, 640 270, 560 260 Z" 
          fill="url(#crocSkin)" stroke="#22472F" stroke-width="9"/>

    <!-- Snout Nostrils -->
    <ellipse cx="285" cy="330" rx="8" ry="14" fill="#1C3825"/>
    <ellipse cx="310" cy="326" rx="8" ry="14" fill="#1C3825"/>

    <!-- Predatory Cool Eyes -->
    <!-- Left Brow & Eye -->
    <path d="M 425 210 Q 460 175 495 210" fill="none" stroke="#1D3E28" stroke-width="12" stroke-linecap="round"/>
    <ellipse cx="460" cy="225" rx="32" ry="34" fill="#FFFFFF" stroke="#22472F" stroke-width="5"/>
    <ellipse cx="466" cy="225" rx="18" ry="24" fill="#E59B16"/>
    <ellipse cx="468" cy="225" rx="8" ry="20" fill="#111622"/>
    <circle cx="462" cy="216" r="6" fill="#FFFFFF"/>

    <!-- Right Brow & Eye -->
    <path d="M 545 200 Q 585 170 620 205" fill="none" stroke="#1D3E28" stroke-width="12" stroke-linecap="round"/>
    <ellipse cx="585" cy="218" rx="30" ry="32" fill="#FFFFFF" stroke="#22472F" stroke-width="5"/>
    <ellipse cx="590" cy="218" rx="17" ry="22" fill="#E59B16"/>
    <ellipse cx="592" cy="218" rx="7" ry="18" fill="#111622"/>
    <circle cx="587" cy="210" r="5" fill="#FFFFFF"/>

    <!-- Smiling Mouth Line with Sharp Crocodile Teeth -->
    <path d="M 270 380 Q 420 410 660 330" fill="none" stroke="#1D3E28" stroke-width="8"/>
    <!-- Pointed Sharp White Teeth -->
    <polygon points="310,382 320,400 330,384" fill="#FFFFFF" stroke="#2B4633" stroke-width="2"/>
    <polygon points="350,387 362,410 374,389" fill="#FFFFFF" stroke="#2B4633" stroke-width="2"/>
    <polygon points="400,392 414,416 426,394" fill="#FFFFFF" stroke="#2B4633" stroke-width="2"/>
    <polygon points="450,394 464,417 476,393" fill="#FFFFFF" stroke="#2B4633" stroke-width="2"/>
    <polygon points="505,390 518,412 530,388" fill="#FFFFFF" stroke="#2B4633" stroke-width="2"/>
    <polygon points="560,380 572,400 584,376" fill="#FFFFFF" stroke="#2B4633" stroke-width="2"/>
    <polygon points="615,362 626,382 636,356" fill="#FFFFFF" stroke="#2B4633" stroke-width="2"/>

    <!-- Left Arm & Claw holding the Golden Bitcoin Coin -->
    <g transform="translate(140, 310)">
      <!-- Arm Sleeve -->
      <path d="M 130 260 C 130 200, 110 160, 60 180 L 10 240 C 40 290, 100 300, 130 260 Z" 
            fill="url(#hoodieGrad)" stroke="#111622" stroke-width="8"/>
      
      <!-- Green Claw Hand holding coin -->
      <path d="M 60 170 C 40 160, 20 180, 25 210 C 30 240, 70 240, 80 200 Z" 
            fill="url(#crocSkin)" stroke="#22472F" stroke-width="6"/>

      <!-- Large Golden Bitcoin Coin in Hand -->
      <g transform="translate(5, 10)" filter="url(#dropShadow)">
        <circle cx="120" cy="120" r="105" fill="url(#goldGrad)" stroke="#68420B" stroke-width="8"/>
        <!-- Inner Coin Rim -->
        <circle cx="120" cy="120" r="92" fill="none" stroke="#FFFFFF" stroke-opacity="0.6" stroke-width="3"/>
        <circle cx="120" cy="120" r="88" fill="none" stroke="#7A4C07" stroke-width="3" stroke-dasharray="6 4"/>
        <circle cx="120" cy="120" r="82" fill="url(#goldLight)"/>

        <!-- Bold 3D Bitcoin '₿' Symbol -->
        <text x="120" y="152" font-family="'Impact', 'Arial Black', sans-serif" font-size="110" font-weight="bold" 
              text-anchor="middle" fill="#68420B" opacity="0.4" dx="3" dy="4">₿</text>
        <text x="120" y="150" font-family="'Impact', 'Arial Black', sans-serif" font-size="110" font-weight="bold" 
              text-anchor="middle" fill="url(#goldGrad)" stroke="#5B3906" stroke-width="4">₿</text>
      </g>

      <!-- Three Green Claw Fingers wrapping over the front of the coin -->
      <path d="M 50 80 Q 75 90 70 120 Q 50 125 40 95 Z" fill="url(#crocSkin)" stroke="#22472F" stroke-width="4"/>
      <path d="M 55 125 Q 85 135 80 165 Q 60 170 50 140 Z" fill="url(#crocSkin)" stroke="#22472F" stroke-width="4"/>
      <path d="M 65 170 Q 95 180 90 210 Q 70 215 60 185 Z" fill="url(#crocSkin)" stroke="#22472F" stroke-width="4"/>
    </g>
  </g>

  <!-- ============================================== -->
  <!-- 3D GOLD TYPOGRAPHY: 'NILE' + WATER WAVE + CROWN-->
  <!-- ============================================== -->
  <g id="typography" filter="url(#textShadow)" transform="translate(0, 30)">
    <!-- Golden Royal Crown over the 'I' in NILE -->
    <g transform="translate(378, 560)">
      <path d="M 10 35 L 26 58 L 54 36 L 82 58 L 98 35 L 105 75 L 3 75 Z" 
            fill="url(#goldLight)" stroke="#4A2E05" stroke-width="5"/>
      <circle cx="10" cy="35" r="7" fill="#FFFFFF" stroke="#4A2E05" stroke-width="3"/>
      <circle cx="54" cy="36" r="8" fill="#FFFFFF" stroke="#4A2E05" stroke-width="3"/>
      <circle cx="98" cy="35" r="7" fill="#FFFFFF" stroke="#4A2E05" stroke-width="3"/>
      <!-- Ruby in crown center -->
      <circle cx="54" cy="62" r="6" fill="#E53E3E" stroke="#742A2A" stroke-width="2"/>
    </g>

    <!-- Main 'NILE' Text in Bold 3D Bevel -->
    <!-- Extrusion / 3D Shadow Layers -->
    <text x="512" y="760" font-family="'Impact', 'Arial Black', sans-serif" font-size="205" font-weight="900" 
          letter-spacing="18" text-anchor="middle" fill="#3D2103" stroke="#251300" stroke-width="22">NILE</text>
    <text x="512" y="756" font-family="'Impact', 'Arial Black', sans-serif" font-size="205" font-weight="900" 
          letter-spacing="18" text-anchor="middle" fill="#754708" stroke="#472A03" stroke-width="12">NILE</text>
    <!-- Top Face of 'NILE' -->
    <text x="512" y="750" font-family="'Impact', 'Arial Black', sans-serif" font-size="205" font-weight="900" 
          letter-spacing="18" text-anchor="middle" fill="url(#goldLight)" stroke="#523204" stroke-width="5">NILE</text>

    <!-- Flowing Nile River Wave intersecting the lower portion of 'NILE' -->
    <path d="M 200 730 
             C 280 680, 360 760, 460 720 
             C 560 680, 640 760, 740 715 
             C 790 690, 840 725, 870 710 
             L 865 770 
             C 800 790, 720 760, 630 780 
             C 520 805, 410 750, 320 785 
             C 260 805, 210 770, 195 765 Z" 
          fill="url(#waveGrad)" stroke="#0E4263" stroke-width="5"/>
    <!-- Wave Foamy White Highlights -->
    <path d="M 240 725 C 320 685, 390 745, 480 715 C 570 685, 660 745, 750 710" 
          fill="none" stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="6" stroke-linecap="round"/>

    <!-- 'ECOSYSTEM' Under-Banner -->
    <g transform="translate(0, 830)">
      <!-- Left & Right Gold Separator Lines -->
      <line x1="130" y1="-8" x2="260" y2="-8" stroke="url(#goldGrad)" stroke-width="6" stroke-linecap="round"/>
      <line x1="764" y1="-8" x2="894" y2="-8" stroke="url(#goldGrad)" stroke-width="6" stroke-linecap="round"/>

      <!-- ECOSYSTEM Text with Double Outline -->
      <text x="512" y="0" font-family="'Montserrat', 'Arial Black', sans-serif" font-size="56" font-weight="900" 
            letter-spacing="14" text-anchor="middle" fill="#241503" stroke="#241503" stroke-width="8">ECOSYSTEM</text>
      <text x="512" y="-2" font-family="'Montserrat', 'Arial Black', sans-serif" font-size="56" font-weight="900" 
            letter-spacing="14" text-anchor="middle" fill="url(#goldLight)">ECOSYSTEM</text>
    </g>

    <!-- Motto: 'HUNT OPPORTUNITIES. BUILD WEALTH.' -->
    <text x="512" y="895" font-family="'Montserrat', 'Trebuchet MS', sans-serif" font-size="28" font-weight="800" 
          letter-spacing="5" text-anchor="middle" fill="#A87322">HUNT OPPORTUNITIES. BUILD WEALTH.</text>
  </g>
</svg>
`;

async function main() {
  const publicDir = path.join(__dirname, '..', 'public');
  const brandingDir = path.join(publicDir, 'assets', 'branding');
  if (!fs.existsSync(brandingDir)) {
    fs.mkdirSync(brandingDir, { recursive: true });
  }

  // 1. Save raw SVG
  const svgPath = path.join(brandingDir, 'nile-official-logo.svg');
  fs.writeFileSync(svgPath, svg.trim());
  console.log('Saved SVG:', svgPath);

  // 2. Render 1024x1024 Master PNG
  const svgBuffer = Buffer.from(svg);
  const masterPngPath = path.join(brandingDir, 'nile-official-logo.png');
  await sharp(svgBuffer).png().toFile(masterPngPath);
  console.log('Saved 1024x1024 PNG:', masterPngPath);

  // 3. Render 512x512, 192x192, 64x64, 32x32 targets
  await sharp(masterPngPath).resize(512, 512).toFile(path.join(publicDir, 'logo.png'));
  await sharp(masterPngPath).resize(512, 512).toFile(path.join(publicDir, 'nile-token-512.png'));
  await sharp(masterPngPath).resize(512, 512).toFile(path.join(publicDir, 'pwa-512x512.png'));
  await sharp(masterPngPath).resize(512, 512).toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  await sharp(masterPngPath).resize(192, 192).toFile(path.join(publicDir, 'pwa-192x192.png'));
  await sharp(masterPngPath).resize(192, 192).toFile(path.join(publicDir, 'nile-token-192.png'));
  await sharp(masterPngPath).resize(180, 180).toFile(path.join(publicDir, 'apple-touch-icon.png'));
  await sharp(masterPngPath).resize(32, 32).toFile(path.join(publicDir, 'favicon-32x32.png'));
  await sharp(masterPngPath).resize(16, 16).toFile(path.join(publicDir, 'favicon-16x16.png'));

  // Also update nile-token-coin.png with the new official mascot emblem!
  await sharp(masterPngPath).toFile(path.join(publicDir, 'nile-token-coin.png'));
  await sharp(masterPngPath).toFile(path.join(brandingDir, 'nile-token-coin.png'));
  // Update 1000095276.jpg / 1000095277.jpg so all references load the user logo!
  await sharp(masterPngPath).jpeg({ quality: 95 }).toFile(path.join(brandingDir, '1000095276.jpg'));
  await sharp(masterPngPath).jpeg({ quality: 95 }).toFile(path.join(brandingDir, 'nile-mascot-logo.jpg'));

  console.log('ALL PLATFORM LOGO TARGETS UPDATED WITH USER LOGO SUCCESSFULLY!');
}

main().catch(console.error);
