// Generates public/og.jpg (1200x630). Run: node scripts/make-og.mjs
// Renders an HTML card in headless Chromium using Pinyon Script + Bodoni Moda (fetched from Google Fonts,
// cached in the OS temp dir), then compresses with sharp. Set CHROME_PATH if Chromium lives elsewhere.
import sharp from 'sharp';
import { chromium } from '@playwright/test';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const W = 1200, H = 630;
const FONTS = {
  pinyon: 'https://fonts.gstatic.com/s/pinyonscript/v24/6xKpdSJbL9-e9LuoeQiDRQR8aOI.ttf',
  bodoni: 'https://fonts.gstatic.com/s/bodonimoda/v28/aFT07PxzY382XsXX63LUYJSPUqb0pL6OQqxrZLnVbvZedvJtj-V7tIaZKMN4sQ.ttf',
};
const dir = join(tmpdir(), 'ps-og-fonts');
mkdirSync(dir, { recursive: true });
const b64 = {};
for (const [k, url] of Object.entries(FONTS)) {
  const f = join(dir, `${k}.ttf`);
  if (!existsSync(f)) writeFileSync(f, Buffer.from(await (await fetch(url)).arrayBuffer()));
  b64[k] = readFileSync(f).toString('base64');
}

const cx = W / 2;
// Palace arch (two-centred pointed) outline path, gold double rule.
const arch = (x0, x1, yTop, yBot, spring) => {
  const half = (x1 - x0) / 2, h = spring - yTop;
  const r = (h * h + half * half) / (2 * half);
  return `M${x0} ${yBot}V${spring}A${r} ${r} 0 0 1 ${cx} ${yTop}A${r} ${r} 0 0 1 ${x1} ${spring}V${yBot}`;
};
const lotus = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="url(#g)" stroke-width="1.2">
  <path d="M0 0C-10 -6 -12 -18 0 -30C12 -18 10 -6 0 0Z"/><path d="M0 0C-16 -2 -26 -12 -26 -22C-14 -20 -6 -12 0 0Z"/>
  <path d="M0 0C16 -2 26 -12 26 -22C14 -20 6 -12 0 0Z"/><path d="M0 0C-22 4 -36 -2 -42 -12C-26 -14 -10 -8 0 0Z"/>
  <path d="M0 0C22 4 36 -2 42 -12C26 -14 10 -8 0 0Z"/></g>`;

const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:P;src:url(data:font/ttf;base64,${b64.pinyon})}
@font-face{font-family:B;font-style:italic;src:url(data:font/ttf;base64,${b64.bodoni})}
html,body{margin:0;width:${W}px;height:${H}px;overflow:hidden;background:#1B140C}
.c{position:relative;width:${W}px;height:${H}px;
 background:radial-gradient(55% 60% at 50% 42%,rgba(216,183,106,.30),transparent 72%),radial-gradient(70% 40% at 50% 112%,rgba(184,137,58,.28),transparent 70%),#1B140C}
svg{position:absolute;inset:0}
.n{position:absolute;left:0;right:0;text-align:center;font-family:P,cursive;
 background:linear-gradient(100deg,#8a6425,#d8b76a 22%,#f6e6ae 42%,#b8893a 60%,#e6cb8a 80%,#9a7230);-webkit-background-clip:text;color:transparent;line-height:1}
.d{position:absolute;left:0;right:0;text-align:center;font-family:B,Georgia,serif;font-style:italic;font-size:27px;letter-spacing:.04em;color:#E6CB8A}
</style><div class="c">
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#8a6425"/><stop offset=".5" stop-color="#f1dc9a"/><stop offset="1" stop-color="#b8893a"/></linearGradient></defs>
<g fill="none" stroke="url(#g)">
<rect x="22" y="22" width="${W - 44}" height="${H - 44}" stroke-width="1" opacity=".55"/>
<rect x="30" y="30" width="${W - 60}" height="${H - 60}" stroke-width="1" opacity=".3"/>
<path d="${arch(300, 900, 46, 600, 250)}" stroke-width="1.6"/>
<path d="${arch(318, 882, 70, 600, 262)}" stroke-width="1" opacity=".6"/>
<path d="M300 600H900" stroke-width="1.6"/></g>
${lotus(cx, 142, 0.9)}
<g stroke="url(#g)" stroke-width="1" opacity=".8"><path d="M${cx - 150} 470H${cx - 14}"/><path d="M${cx + 14} 470H${cx + 150}"/></g>
<path d="M${cx} 462l8 8-8 8-8-8z" fill="none" stroke="url(#g)"/>
</svg>
<div class="n" style="top:176px;font-size:128px">Prajwal</div>
<div class="n" style="top:292px;font-size:116px">&amp; Supraja</div>
<div class="d" style="top:500px">21 &amp; 22 November 2026 &middot; Mysore</div>
</div>`;

const exe = process.env.CHROME_PATH || (existsSync('/opt/pw-browsers/chromium-1194/chrome-linux/chrome') ? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' : undefined);
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: W, height: H } });
await page.setContent(html);
await page.evaluate(() => document.fonts.ready);
const png = await page.screenshot();
await browser.close();
await sharp(png).jpeg({ quality: 90, mozjpeg: true }).toFile('public/og.jpg');
console.log('wrote public/og.jpg');
