// Generates public/og.jpg (1200x630). Run: node scripts/make-og.mjs
import sharp from 'sharp';
const W = 1200, H = 630;
const gold = '#B8893A', deep = '#8A6425', ink = '#2B241B';
const cx = W / 2;
// Multifoil (cusped) arch outline: scalloped edge over a tall rectangle.
const x0 = 330, x1 = 870, top = 70, bot = 560, n = 7, r = (x1 - x0) / n / 2;
let scallop = '';
for (let i = 0; i < n; i++) scallop += ` A ${r} ${r} 0 0 1 ${x0 + r * 2 * (i + 1)} ${top + 70}`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<rect width="${W}" height="${H}" fill="#F8F4E8"/>
<g fill="none" stroke="${gold}" stroke-width="1.5">
  <rect x="24" y="24" width="${W - 48}" height="${H - 48}" stroke-width="1"/>
  <path d="M ${x0} ${bot} V ${top + 70}${scallop} V ${bot} Z"/>
</g>
<g text-anchor="middle" font-family="Cormorant Garamond, Georgia, 'Liberation Serif', serif">
  <text x="${cx}" y="300" font-size="86" font-weight="300" fill="${ink}">Prajwal</text>
  <text x="${cx}" y="352" font-size="38" font-style="italic" fill="${gold}">&amp;</text>
  <text x="${cx}" y="430" font-size="86" font-weight="300" fill="${ink}">Supraja</text>
  <path d="M ${cx - 60} 470 H ${cx + 60}" stroke="${gold}" stroke-width="1"/>
  <text x="${cx}" y="510" font-size="26" fill="${deep}">21 &amp; 22 November 2026 · Mysore</text>
</g>
</svg>`;
await sharp(Buffer.from(svg)).jpeg({ quality: 90, mozjpeg: true }).toFile('public/og.jpg');
console.log('wrote public/og.jpg');
