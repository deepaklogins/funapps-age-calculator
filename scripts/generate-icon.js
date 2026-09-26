const sharp = require('sharp');
const path = require('path');
const SIZE = 1024;
const ASSETS = path.join(__dirname, '..', 'assets');

const iconSvg = `
<svg width="${SIZE}" height="${SIZE}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0a1a"/>
      <stop offset="100%" style="stop-color:#141428"/>
    </linearGradient>
  </defs>
  <rect width="${SIZE}" height="${SIZE}" rx="220" fill="url(#bg)"/>
  <!-- Calendar icon -->
  <g transform="translate(${SIZE/2}, ${SIZE/2})">
    <rect x="-250" y="-200" width="500" height="420" rx="40" fill="#e94560"/>
    <rect x="-250" y="-200" width="500" height="100" rx="40" fill="#c23152"/>
    <rect x="-250" y="-140" width="500" height="40" fill="#c23152"/>
    <!-- Calendar hooks -->
    <rect x="-140" y="-250" width="30" height="80" rx="15" fill="#fff"/>
    <rect x="110" y="-250" width="30" height="80" rx="15" fill="#fff"/>
    <!-- Number -->
    <text x="0" y="120" font-family="Arial,sans-serif" font-size="260" font-weight="bold" fill="white" text-anchor="middle">25</text>
  </g>
  <!-- Sparkles -->
  <text x="140" y="200" font-size="60" fill="#f39c12" opacity="0.8">✨</text>
  <text x="750" y="780" font-size="50" fill="#f39c12" opacity="0.6">🎂</text>
</svg>`;

const foregroundSvg = `
<svg width="${SIZE}" height="${SIZE}" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(${SIZE/2}, ${SIZE/2})">
    <rect x="-220" y="-180" width="440" height="380" rx="35" fill="#e94560"/>
    <rect x="-220" y="-180" width="440" height="90" rx="35" fill="#c23152"/>
    <rect x="-220" y="-120" width="440" height="35" fill="#c23152"/>
    <rect x="-120" y="-225" width="26" height="70" rx="13" fill="#fff"/>
    <rect x="94" y="-225" width="26" height="70" rx="13" fill="#fff"/>
    <text x="0" y="110" font-family="Arial,sans-serif" font-size="230" font-weight="bold" fill="white" text-anchor="middle">25</text>
  </g>
</svg>`;

const bgSvg = `<svg width="${SIZE}" height="${SIZE}" xmlns="http://www.w3.org/2000/svg"><rect width="${SIZE}" height="${SIZE}" fill="#0a0a1a"/></svg>`;
const splashSvg = `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg"><g transform="translate(150,140)"><rect x="-70" y="-60" width="140" height="130" rx="12" fill="#e94560"/><rect x="-70" y="-60" width="140" height="30" rx="12" fill="#c23152"/><rect x="-70" y="-40" width="140" height="10" fill="#c23152"/><rect x="-35" y="-78" width="10" height="28" rx="5" fill="#fff"/><rect x="25" y="-78" width="10" height="28" rx="5" fill="#fff"/><text x="0" y="50" font-family="Arial" font-size="70" font-weight="bold" fill="white" text-anchor="middle">25</text></g></svg>`;

async function generate() {
  await sharp(Buffer.from(iconSvg)).resize(1024,1024).png().toFile(path.join(ASSETS,'icon.png'));
  await sharp(Buffer.from(foregroundSvg)).resize(1024,1024).png().toFile(path.join(ASSETS,'android-icon-foreground.png'));
  await sharp(Buffer.from(bgSvg)).resize(1024,1024).png().toFile(path.join(ASSETS,'android-icon-background.png'));
  await sharp(Buffer.from(foregroundSvg)).resize(1024,1024).png().toFile(path.join(ASSETS,'android-icon-monochrome.png'));
  await sharp(Buffer.from(splashSvg)).resize(300,300).png().toFile(path.join(ASSETS,'splash-icon.png'));
  await sharp(Buffer.from(iconSvg)).resize(48,48).png().toFile(path.join(ASSETS,'favicon.png'));
  console.log('✓ All icons generated');
}
generate().catch(console.error);
