#!/usr/bin/env node
/**
 * Optimise originals from media-src/ into public/media/.
 *   images : <name>.jpg (<=2400px, mozjpeg q78) + .webp + .avif, plus blur.json placeholders
 *   videos : <name>.mp4 (H.264, muted, faststart, <=1280px, 30fps, <6MB) + <name>-poster.jpg
 *   audio  : music.mp3 (128k)
 * Env: MEDIA_SRC (default media-src), MEDIA_OUT (default public/media). Idempotent: up-to-date outputs are skipped.
 */
import { execFileSync, spawnSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
  rmSync,
} from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SRC = path.resolve(process.env.MEDIA_SRC ?? 'media-src');
const OUT = path.resolve(process.env.MEDIA_OUT ?? 'public/media');
const MAX_VIDEO_BYTES = 6 * 1024 * 1024;
const IMG = new Set(['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif']);
const VID = new Set(['.mp4', '.mov']);
const AUD = new Set(['.mp3', '.wav', '.m4a']);

const log = (m) => console.log(m);
const mb = (b) => (b / 1048576).toFixed(2) + ' MB';

const hasFfmpeg = spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' }).status === 0;

if (!existsSync(SRC)) {
  log(`No source folder at ${SRC}. Create it and drop your originals in, then re-run.`);
  process.exit(0);
}
mkdirSync(OUT, { recursive: true });

const upToDate = (src, ...outs) =>
  outs.every((o) => existsSync(o) && statSync(o).mtimeMs >= statSync(src).mtimeMs);

const ff = (args) =>
  execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', ...args], {
    stdio: 'inherit',
  });

const blurPath = path.join(OUT, 'blur.json');
let blur = {};
try {
  blur = JSON.parse(readFileSync(blurPath, 'utf8'));
} catch {}

const files = readdirSync(SRC)
  .filter((f) => !f.startsWith('.'))
  .sort();
let done = 0;
let skipped = 0;

async function image(file, base) {
  const src = path.join(SRC, file);
  const jpg = path.join(OUT, `${base}.jpg`);
  const webp = path.join(OUT, `${base}.webp`);
  const avif = path.join(OUT, `${base}.avif`);
  if (upToDate(src, jpg, webp, avif) && blur[`${base}.jpg`]) {
    log(`  skip   ${file} (up to date)`);
    skipped++;
    return;
  }
  const pipeline = () =>
    sharp(src, { failOn: 'none' })
      .rotate()
      .resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true });
  await pipeline().jpeg({ quality: 78, mozjpeg: true }).toFile(jpg);
  await pipeline().webp({ quality: 76 }).toFile(webp);
  await pipeline().avif({ quality: 55, effort: 4 }).toFile(avif);
  const tiny = await sharp(src, { failOn: 'none' })
    .rotate()
    .resize(16, 16, { fit: 'inside' })
    .jpeg({ quality: 50 })
    .toBuffer();
  blur[`${base}.jpg`] = `data:image/jpeg;base64,${tiny.toString('base64')}`;
  log(
    `  image  ${file} -> ${base}.jpg ${mb(statSync(jpg).size)}, .webp ${mb(statSync(webp).size)}, .avif ${mb(statSync(avif).size)}`,
  );
  done++;
}

function video(file, base) {
  const src = path.join(SRC, file);
  const mp4 = path.join(OUT, `${base}.mp4`);
  const poster = path.join(OUT, `${base}-poster.jpg`);
  if (upToDate(src, mp4, poster)) {
    log(`  skip   ${file} (up to date)`);
    skipped++;
    return;
  }
  const vf = "scale='min(1280,iw)':-2,fps=30,format=yuv420p";
  const common = [
    '-i',
    src,
    '-an',
    '-vf',
    vf,
    '-c:v',
    'libx264',
    '-preset',
    'slow',
    '-movflags',
    '+faststart',
    '-pix_fmt',
    'yuv420p',
  ];
  let crf = 26;
  ff([...common, '-crf', String(crf), mp4]);
  while (statSync(mp4).size > MAX_VIDEO_BYTES && crf < 32) {
    crf += 2;
    log(`  ...    ${mb(statSync(mp4).size)} is over 6 MB, retrying at CRF ${crf}`);
    ff([...common, '-crf', String(crf), mp4]);
  }
  if (statSync(mp4).size > MAX_VIDEO_BYTES) {
    const dur = parseFloat(
      execFileSync('ffprobe', [
        '-v',
        'error',
        '-show_entries',
        'format=duration',
        '-of',
        'csv=p=0',
        src,
      ]).toString(),
    );
    const kbps = Math.max(150, Math.floor((MAX_VIDEO_BYTES * 0.92 * 8) / dur / 1000));
    log(`  ...    still too big, two-pass at ${kbps} kbps`);
    const logfile = path.join(OUT, `.ffpass-${base}`);
    const pass = [
      ...common.filter((_, i, a) => a[i] !== '-crf'),
      '-b:v',
      `${kbps}k`,
      '-passlogfile',
      logfile,
    ];
    ff([...pass, '-pass', '1', '-f', 'mp4', '/dev/null']);
    ff([...pass, '-pass', '2', mp4]);
    for (const f of readdirSync(OUT))
      if (f.startsWith(`.ffpass-${base}`)) rmSync(path.join(OUT, f));
  }
  ff(['-ss', '1', '-i', mp4, '-frames:v', '1', '-q:v', '3', poster]);
  if (!existsSync(poster)) ff(['-i', mp4, '-frames:v', '1', '-q:v', '3', poster]);
  log(`  video  ${file} -> ${base}.mp4 ${mb(statSync(mp4).size)} + ${base}-poster.jpg`);
  done++;
}

function audio(file) {
  const src = path.join(SRC, file);
  const mp3 = path.join(OUT, 'music.mp3');
  if (upToDate(src, mp3)) {
    log(`  skip   ${file} (up to date)`);
    skipped++;
    return;
  }
  ff(['-i', src, '-vn', '-c:a', 'libmp3lame', '-b:a', '128k', mp3]);
  log(`  audio  ${file} -> music.mp3 ${mb(statSync(mp3).size)}`);
  done++;
}

log(`Optimising ${SRC} -> ${OUT}`);
if (!hasFfmpeg)
  log('ffmpeg not found: videos and audio will be skipped (install ffmpeg to process them).');

for (const file of files) {
  const ext = path.extname(file).toLowerCase();
  const base = path.basename(file, path.extname(file));
  try {
    if (IMG.has(ext)) await image(file, base);
    else if (VID.has(ext) || AUD.has(ext)) {
      if (!hasFfmpeg) {
        log(`  skip   ${file} (ffmpeg missing)`);
        skipped++;
      } else if (VID.has(ext)) video(file, base);
      else audio(file);
    } else log(`  skip   ${file} (unsupported type)`);
  } catch (err) {
    log(`  FAIL   ${file}: ${err.message}`);
    process.exitCode = 1;
  }
}

writeFileSync(blurPath, JSON.stringify(blur, null, 2) + '\n');
log(
  `Done: ${done} processed, ${skipped} skipped. Blur placeholders: ${path.relative(process.cwd(), blurPath)}`,
);
