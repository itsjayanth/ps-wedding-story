# Design direction: "The Royal Procession" (Mysore Dasara)

Goal: rich, elegant, unmistakably Mysore-royal, and unique. Not a template. Think a jewel-box
palace at night meeting warm ivory silk. Removed for good: Kannada text, any deity/god name, the diya.

## Palette (no red / maroon anywhere, no pure black/white)
ivory #F8F4E8 · champagne #F1E6C8 · sandstone #E6D9BC · antique gold #B8893A · light gold #D8B76A ·
deep gold #8A6425 (gold text on ivory) · bronze #2A1F14 · NIGHT #1B140C (deepest, for dramatic sections).
Gold foil is now a STAR: use the foil gradient (`.foil-text`, richer 5-stop gradient with a slow shimmer
sweep) on display names, section titles on dark, numerals, and thin rules. Alternate rhythm:
ivory -> night/bronze -> champagne -> night -> ivory. Dark sections are lit by soft radial gold glows.

## Type
- Display / headings: **Bodoni Moda** (`font-display` / `font-serif`), high-contrast, large, italics for emphasis.
- Script: **Pinyon Script** (`font-script`) for the couple's names and one or two flourishes only.
- Body: Jost 300/400. Lines under ~60 chars. No all-caps tracked eyebrow labels.
- Go BIG: names clamp up to ~14rem on desktop, section titles 4–7rem, with generous whitespace.

## Texture and depth
Warm paper grain (CSS noise via SVG feTurbulence data-URI at ~4% opacity), faint jali / palace-arch
patterns at 4–8% opacity, soft gold radial glows, thin double-rule gold frames, gold dust motes in dark sections.
Ornaments are 1px gold line-art (components/ornaments) but may now be larger and more present.

## Signature motif: the elephant and golden ambari
A caparisoned Mysore Dasara elephant carrying the golden ambari (howdah) is the hero illustration
(`components/ornaments/Elephant.tsx`, export `Elephant({className, animated?, lit?})`, gold line-art with
fine caparison details, currentColor stroke). It replaces the diya everywhere. It appears: in the entry
gate (walks in under palace arches, ambari glows, then the arch doors open), as a scroll-linked
procession crossing the Celebrations section, and quietly at the end of the thread near the closing.

## Motion (scroll-driven, premium, still calm: no bounce, no spin, respect prefers-reduced-motion)
Use framer-motion (`useScroll`, `useTransform`, `useSpring`). Ideas to use across sections:
arch-shaped clip-path photo reveals, split-line headline reveals (masked, line by line), layered
parallax, sticky/pinned storytelling scenes, scroll-linked horizontal gallery, the two family cards
converging as you scroll and the threads joining, foil shimmer sweeps, counting numerals, the procession.
Reduced motion: static, fully visible, no parallax.

## Rules kept
Content only from content/wedding.ts. Missing media shows an elegant placeholder. Mobile-first at 360/390/768/1440,
safe-area insets, no hydration warnings, no console errors, accessible (contrast, focus, alt, aria).
Version prop: friends vs family differences unchanged.
