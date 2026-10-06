/**
 * Thin gold line-art SVG ornaments. Contract (do not change signatures):
 * every ornament accepts { className?: string } and uses stroke="currentColor", 1px
 * non-scaling stroke, fill none. Colour them with text-gold / text-gold-light classes.
 */
import type { SVGProps } from 'react';

export type OrnamentProps = { className?: string } & Omit<SVGProps<SVGSVGElement>, 'className'>;

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  vectorEffect: 'non-scaling-stroke',
} as const;

const n2 = (n: number) => Number(n.toFixed(2));

/* ------------------------------------------------------------------ Arch --- */

/** Left half of a two-centred pointed arch, bottom -> apex, as n+1 points. */
function pointedArchLeft(x0: number, cx: number, ySpring: number, yApex: number, n: number) {
  const h = ySpring - yApex;
  const c = (h * h + cx * cx - x0 * x0) / (2 * (cx - x0)); // centre x of the left arc
  const r = c - x0;
  const a0 = Math.PI;
  const a1 = Math.atan2(-h, cx - c) + 2 * Math.PI;
  const pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const t = a0 + ((a1 - a0) * i) / n;
    pts.push([c + r * Math.cos(t), ySpring + r * Math.sin(t)]);
  }
  return { pts, r };
}

function pointedArch(x0: number, cx: number, ySpring: number, yApex: number) {
  const { r } = pointedArchLeft(x0, cx, ySpring, yApex, 1);
  const R = n2(r);
  return `M${x0} ${ySpring}A${R} ${R} 0 0 1 ${cx} ${yApex}A${R} ${R} 0 0 1 ${2 * cx - x0} ${ySpring}`;
}

/** Scalloped pointed arch: each segment is a semicircle bulging inward, giving cusps pointing inward. */
function cuspedArch(x0: number, cx: number, ySpring: number, yApex: number, n: number, bulge = 1) {
  const { pts } = pointedArchLeft(x0, cx, ySpring, yApex, n);
  const seg = (a: [number, number], b: [number, number]) => {
    const rr = n2((Math.hypot(b[0] - a[0], b[1] - a[1]) / 2) * bulge);
    return `A${rr} ${rr} 0 0 0 ${n2(b[0])} ${n2(b[1])}`;
  };
  const mir = (p: [number, number]): [number, number] => [2 * cx - p[0], p[1]];
  let d = `M${n2(pts[0][0])} ${n2(pts[0][1])}`;
  for (let i = 1; i <= n; i++) d += seg(pts[i - 1], pts[i]);
  for (let i = n - 1; i >= 0; i--) d += seg(mir(pts[i + 1]), mir(pts[i]));
  return d;
}

const ARCH_OUTER = pointedArch(6, 100, 128, 12);
const ARCH_CUSPS = cuspedArch(14, 100, 128, 30, 6, 1);

/**
 * Mysore-palace style cusped (multifoil) arch outline: pointed outer arch, a fine inner
 * rim, a six-cusp-per-side intaglio, flat pillars with capitals and a plinth.
 * Stretches to its box (preserveAspectRatio none).
 */
export function MultifoilArch({ className, ...p }: OrnamentProps) {
  return (
    <svg viewBox="0 0 200 260" preserveAspectRatio="none" className={className} aria-hidden="true" {...p}>
      <path {...base} d={`${ARCH_OUTER}V250M6 250V128`} />
      <path {...base} d={`M14 128V250`} />
      <path {...base} d={`M186 128V250`} />
      <path {...base} d={ARCH_CUSPS} />
      {/* pillar capitals and plinth */}
      <path {...base} d="M2 128h16M182 128h16M6 136h8M186 136h8M2 250h196M2 256h196M6 244h188" />
      {/* finial bud */}
      <path {...base} d="M100 12V7M96.5 7C96.5 2 103.5 2 103.5 7z" />
    </svg>
  );
}

/* --------------------------------------------------------------- Gopuram --- */

const finial = (x: number, y: number, s = 1) =>
  `M${n2(x - 2.4 * s)} ${n2(y)}c${n2(-1.4 * s)} ${n2(1.6 * s)} ${n2(-1.4 * s)} ${n2(4 * s)} 0 ${n2(5 * s)}h${n2(4.8 * s)}c${n2(1.4 * s)} ${n2(-1) * s} ${n2(1.4 * s)} ${n2(-3.4 * s)} 0 ${n2(-5 * s)}zM${x} ${y}v${n2(-4 * s)}`;

function gopuramPath() {
  let d = '';
  // plinth with gateway
  d += 'M10 134h100M14 134v-8h92v8M18 126V108h84v18';
  d += 'M52 126V114c0-5 16-5 16 0v12';
  d += 'M52 114c0-8 16-8 16 0';
  const tiers = 6;
  for (let i = 0; i < tiers; i++) {
    const yb = 108 - i * 14; // bottom of tier
    const hw = 40 - i * 5; // half width of tier
    const yt = yb - 11;
    d += `M${60 - hw} ${yb}V${yt}h${2 * hw}V${yb}`; // body
    d += `M${60 - hw - 3} ${yt}h${2 * hw + 6}M${60 - hw - 1} ${yt - 3}h${2 * hw + 2}`; // cornice
    d += `M${60 - hw - 3} ${yt}v3M${60 + hw + 3} ${yt}v3`;
    // arched windows
    const cells = Math.max(1, Math.floor(hw / 7));
    const step = (2 * hw) / (cells + 1);
    for (let k = 1; k <= cells; k++) {
      const x = 60 - hw + step * k;
      d += `M${n2(x - 2)} ${yb}V${yb - 5}c0-4 4-4 4 0V${yb}`;
    }
    // end finials on the cornice
    d += `M${60 - hw} ${yt - 3}l0-2M${60 + hw} ${yt - 3}l0-2`;
  }
  // barrel-vault crown (shalasa)
  const yc = 108 - tiers * 14 + 11 - 3; // top cornice line
  d += `M30 ${yc}`.replace('M30', `M${60 - 12}`) + `c0-14 24-14 24 0`;
  d += `M${60 - 8} ${yc}c0-8 16-8 16 0M${60 - 4} ${yc}c0-4 8-4 8 0`;
  return { d, yc };
}

const GOPURAM = gopuramPath();

/** Tiered temple tower (rajagopuram) silhouette with kalasha finials. Line only. */
export function Gopuram({ className, ...p }: OrnamentProps) {
  const y = GOPURAM.yc - 10;
  return (
    <svg viewBox="0 0 120 150" className={className} aria-hidden="true" {...p}>
      <path {...base} d={GOPURAM.d} />
      <path {...base} d={finial(60, y - 4, 1.1)} />
      <path {...base} d={finial(46, y + 3, 0.8)} />
      <path {...base} d={finial(74, y + 3, 0.8)} />
    </svg>
  );
}

/* ----------------------------------------------------------------- Lotus --- */

const PETAL = 'M0 0C-9-8-12-24 0-44C12-24 9-8 0 0zM0-6C-3-14-3-26 0-35C3-26 3-14 0-6z';

/** Open lotus in profile with layered pointed petals and a ripple line. */
export function Lotus({ className, ...p }: OrnamentProps) {
  const petals: [number, number, number][] = [
    [0, 1, 0],
    [-30, 0.92, 1],
    [30, 0.92, 1],
    [-58, 0.78, 2],
    [58, 0.78, 2],
    [-82, 0.55, 3],
    [82, 0.55, 3],
  ];
  return (
    <svg viewBox="0 0 120 80" className={className} aria-hidden="true" {...p}>
      <g transform="translate(60 64)">
        {petals.map(([a, s]) => (
          <path key={a} {...base} d={PETAL} transform={`rotate(${a}) scale(${s})`} />
        ))}
      </g>
      <path {...base} d="M44 63c4 4 28 4 32 0M30 70c10 5 50 5 60 0M10 76h30M80 76h30" />
    </svg>
  );
}

/* --------------------------------------------------------------- Kalasha --- */

const LEAF = 'M0 0C-5-5-5-15 0-25C5-15 5-5 0 0zM0-3V-21';

/** Kalasha: ornamented pot, ring of mango leaves and a coconut with tuft. */
export function Kalasha({ className, ...p }: OrnamentProps) {
  return (
    <svg viewBox="0 0 80 120" className={className} aria-hidden="true" {...p}>
      {/* mango leaves */}
      <g transform="translate(40 58)">
        {[-68, -40, 40, 68].map((a) => (
          <path key={a} {...base} d={LEAF} transform={`rotate(${a})`} />
        ))}
      </g>
      {/* coconut */}
      <path {...base} d="M40 56C30 52 30 28 40 24c10 4 10 28 0 32zM40 24c-1-3-4-5-6-6M40 24c0-4 1-7 3-9M40 24c2-2 5-3 8-3" />
      <path {...base} d="M38 36h.01M42 36h.01M40 41h.01" />
      {/* rim and neck */}
      <path {...base} d="M29 60h22M31 60l-1 5h20l-1-5M31 65c-2 5-4 8-12 14" />
      <path {...base} d="M49 65c2 5 4 8 12 14" />
      {/* belly */}
      <path {...base} d="M19 79C8 90 12 104 28 108h24c16-4 20-18 9-29" />
      <path {...base} d="M19 79c8 3 34 3 42 0M15 92c14 5 36 5 50 0" />
      {/* ornament band */}
      <path {...base} d="M25 85l3 3 3-3 3 3 3-3 3 3 3-3 3 3 3-3 3 3 3-3" />
      <path {...base} d="M40 95l-4 4 4 4 4-4z" />
      {/* foot */}
      <path {...base} d="M30 108l-2 4h24l-2-4M26 112h28M24 116h32" />
    </svg>
  );
}

/* ------------------------------------------------------------------ Jali --- */

function jaliPath() {
  const tiles = 15;
  let d = 'M0 1H240M0 15H240';
  for (let i = 0; i < tiles; i++) {
    const x = i * 16;
    d += `M${x} 8L${x + 8} 1L${x + 16} 8L${x + 8} 15Z`;
    d += `M${x + 8} 4.5L${x + 12.5} 8L${x + 8} 11.5L${x + 3.5} 8Z`;
    d += `M${x + 8} 6.9v2.2`;
  }
  return d;
}

/** Fine pierced-stone lattice strip: diamond trellis with inner diamonds. Tiles horizontally. */
export function Jali({ className, ...p }: OrnamentProps) {
  return (
    <svg viewBox="0 0 240 16" preserveAspectRatio="none" className={className} aria-hidden="true" {...p}>
      <path {...base} d={jaliPath()} />
    </svg>
  );
}

/* ----------------------------------------------------------------- Kolam --- */

const dot = (x: number, y: number) => `M${x - 0.7} ${y}a0.7 0.7 0 1 0 1.4 0a0.7 0.7 0 1 0-1.4 0`;

/** Small symmetric pulli kolam divider: dotted, looped four-petal motifs joined by a line. */
export function Kolam({ className, ...p }: OrnamentProps) {
  const petal = 'M60 20C52 14 52 7 60 3C68 7 68 14 60 20z';
  const side = (cx: number) =>
    `M${cx - 10} 20Q${cx} 20 ${cx} 10Q${cx} 20 ${cx + 10} 20Q${cx} 20 ${cx} 30Q${cx} 20 ${cx - 10} 20z`;
  return (
    <svg viewBox="0 0 120 40" className={className} aria-hidden="true" {...p}>
      <g>
        {[0, 90, 180, 270].map((a) => (
          <path {...base} key={a} d={petal} transform={`rotate(${a} 60 20)`} />
        ))}
        <path {...base} d="M60 20m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0" />
        <path {...base} d={side(26)} />
        <path {...base} d={side(94)} />
        <path {...base} d="M36 20H44M76 20H84M10 20H16M104 20H110" />
        <path {...base} d={`${dot(60, 20)}${dot(26, 20)}${dot(94, 20)}${dot(50, 10)}${dot(70, 10)}${dot(50, 30)}${dot(70, 30)}${dot(7, 20)}${dot(113, 20)}${dot(46, 20)}${dot(74, 20)}`} />
        <path {...base} d={`${dot(26, 4)}${dot(26, 36)}${dot(94, 4)}${dot(94, 36)}`} />
      </g>
    </svg>
  );
}

/* --------------------------------------------------------------- Diamond --- */

export function Diamond({ className, ...p }: OrnamentProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...p}>
      <path {...base} d="M12 1l11 11-11 11L1 12z" />
      <path {...base} d="M12 6l6 6-6 6-6-6z" />
      <path {...base} d="M12 10l2 2-2 2-2-2z" />
    </svg>
  );
}

/* ----------------------------------------------------------- Gandaberunda --- */

const GANDA_HALF = [
  // head with hooked beak, crest and eye
  'M60 40C58 30 52 24 46 24C42 24 40 26 38 29L28 31C26 32 26 34 28 35L33 35C31 37 32 39 35 39L40 38C42 42 46 44 52 44',
  'M46 24C46 18 50 15 52 11M50 25C52 20 56 18 58 15M54 28c3-3 6-4 8-6',
  // neck
  'M52 44C56 52 62 58 66 64M60 40C64 48 68 54 72 58',
  // wing: leading edge and scalloped feather edge
  'M66 62C50 58 30 62 6 46C12 54 14 58 12 62C18 62 20 64 20 68C26 66 28 70 28 74C34 70 38 74 38 78C44 74 48 78 50 82C54 78 58 80 60 84',
  'M66 62C56 66 46 66 36 64M64 68C52 72 42 74 30 72M62 74C54 78 48 80 40 80',
  // body, tail and talons
  'M72 58C66 66 66 78 70 88M80 60V72',
  'M60 84C58 96 66 102 72 106M80 76C70 90 66 100 64 112M80 80C76 94 76 106 80 116',
  'M64 112c-3 2-4 4-4 6M64 112c1 3 0 5-1 7M64 112c3 1 5 3 5 5',
].map((d) => d).join('');

/** Gandaberunda: the royal two-headed eagle emblem of Mysore, drawn symmetrically in line. */
export function Gandaberunda({ className, ...p }: OrnamentProps) {
  const half = GANDA_HALF;
  return (
    <svg viewBox="0 0 160 124" className={className} aria-hidden="true" {...p}>
      <path {...base} d={half} />
      <path {...base} d={half} transform="translate(160 0) scale(-1 1)" />
      <path {...base} d="M46 28h.01M114 28h.01M80 60l-4 6 4 6 4-6z" />
    </svg>
  );
}
