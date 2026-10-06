# Prajwal & Supraja: wedding invitation

A static (Next.js 15 `output: 'export'`, App Router, TypeScript, Tailwind 3) wedding invitation with two versions:

| Route      | Audience | Differences                                                                        |
| ---------- | -------- | ---------------------------------------------------------------------------------- |
| `/friends` | Friends  | Friends' blessings, all 8 moments, relaxed tone                                    |
| `/family`  | Family   | Elders' blessings only, first 4 moments, shows the parents' note (Sr. Head Master) |

`/` redirects to `/friends`. Both routes render the same sections with a `version` prop (`'friends' | 'family'`). The site is `noindex, nofollow`.

## Run

```bash
npm i
npm run dev          # http://localhost:3000
npm run build        # static export to out/
npm run lint
npm run typecheck
npm run test:smoke   # builds, serves out/ on :3100, runs Playwright (screenshots in test-results/screenshots)
npm run format       # prettier
```

## Edit content

Everything lives in `content/wedding.ts`: names, dates, venue, events, quotes, media paths, WhatsApp number.

- Lines marked `// SAMPLE: replace` are placeholder copy. Replace them (and a small "sample" tag disappears with them where applicable).
- `couple.kannada` has a `TODO`: verify the Kannada spellings with both families before publishing.

### WhatsApp number

`rsvp.whatsappLocal` (e.g. `8660628162`) and `rsvp.countryCode` (e.g. `91`). The link becomes `https://wa.me/<countryCode><whatsappLocal>?text=...`; edit `rsvp.message` for the pre-filled text. There is no form on the site by design.

### Theme

Colour tokens are CSS variables in `app/globals.css` (`--ivory`, `--sandstone`, `--gold`, `--gold-light`, `--gold-deep`, `--bronze`, `--ink`, plus semantic `--surface`, `--text`, `--line`, with a dark-mode override). They are exposed to Tailwind in `tailwind.config.ts` (`bg-ivory`, `text-gold-deep`, ...). Fonts: Cormorant (serif), Jost (sans), a Kannada font.

## Photos, videos, music

Put files in `public/media/`. Every slot is optional; a missing file shows a placeholder.

| File                                                                              | Used for                                  |
| --------------------------------------------------------------------------------- | ----------------------------------------- |
| `hero-temple.jpg`, `hero-engagement.jpg`, `hero-blessings.jpg`, `hero-couple.jpg` | Hero slow image sequence                  |
| `hero.mp4` + `hero-poster.jpg`                                                    | Optional looping hero video               |
| `portrait-1.jpg`, `portrait-2.jpg`                                                | "Our beginning" portraits                 |
| `engagement.mp4` + `engagement-poster.jpg`                                        | Blessings / engagement film               |
| `moment-1.jpg` ... `moment-8.jpg`                                                 | Moments gallery (family shows 1-4)        |
| `closing.jpg`                                                                     | Closing portrait                          |
| `music.mp3`                                                                       | Background music (toggle, off by default) |
| `og.jpg` (in `public/`, referenced as `/og.jpg`)                                  | Link preview image, 1200x630              |

### optimize-media workflow

1. Put originals in `media-src/` (git-ignored) with the final base names, e.g. `moment-1.heic`, `engagement.mov`, `song.m4a` (audio always becomes `music.mp3`).
2. `npm run optimize-media`
3. Images become a `.jpg` (max 2400px, mozjpeg q78) plus `.webp` and `.avif`, and `blur.json` holds tiny blur placeholders. Videos become H.264 `.mp4` (muted, faststart, max 1280px, 30fps, under 6 MB) plus `<name>-poster.jpg`. Audio becomes 128k mp3.

Needs `ffmpeg` on PATH for video/audio (skipped with a message otherwise). Re-running skips up-to-date files. Override folders with `MEDIA_SRC` / `MEDIA_OUT`. Put `og.jpg` in `public/` yourself (the script writes to `public/media/`).

## Deploy to Vercel

- Easiest: import the GitHub repo at vercel.com/new (framework: Next.js, defaults are fine).
- CLI: `npx vercel` for a preview, `npx vercel --prod` for production.
- `vercel.json` adds the `/` to `/friends` redirect, security headers, `noindex`, and caching (`/media/*` is cached for a day since filenames are stable, `/_next/static/*` is immutable).

### Custom domain

1. Vercel dashboard, Project, Settings, Domains, Add your domain.
2. At your DNS provider: apex domain gets an `A` record to `76.76.21.21`; `www` gets a `CNAME` to `cname.vercel-dns.com`.
3. Project, Settings, Environment Variables: set `NEXT_PUBLIC_SITE_URL=https://yourdomain.com` (used for correct Open Graph URLs).
4. Redeploy (`npx vercel --prod` or Deployments, Redeploy) so the variable is baked into the static build.

## Notes

- Indexing is disabled (`X-Robots-Tag` and meta). Remove both if you ever want it searchable.
- Lighthouse: run it on a production build (`npm run build && npx serve out`) in mobile mode. Keep hero images modest, always use the optimised `.jpg/.webp/.avif` output, and keep videos muted with a poster. Large unoptimised photos are the main thing that hurts the score.
