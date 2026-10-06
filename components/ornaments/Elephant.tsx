/**
 * Signature illustration: a caparisoned Mysore Dasara elephant carrying the golden ambari,
 * plus the palace-gate skyline used as the entry backdrop. 1px gold line art (currentColor),
 * non-scaling strokes, a few very faint gold-tint fills (<= 0.12). Decorative: aria-hidden.
 */
import { useId, type SVGProps } from 'react';

type P = [number, number];
type SvgProps = Omit<SVGProps<SVGSVGElement>, 'className'>;
export type ElephantProps = {
  className?: string;
  /** Calm walk cycle (legs, bob, tail, ear, trunk, bells). Honours prefers-reduced-motion. */
  animated?: boolean;
  /** Ambari glows with a soft golden halo and tiny sparkles. */
  lit?: boolean;
  /** With `animated`, set false to stand still (legs rest) while ear, tail and bells keep a gentle idle. */
  walking?: boolean;
} & SvgProps;
export type PalaceProps = { className?: string; lit?: boolean; open?: boolean } & SvgProps;

const r1 = (n: number) => Math.round(n * 10) / 10;
const pt = (p: P) => `${r1(p[0])} ${r1(p[1])}`;

/** Catmull-Rom through points -> cubic bezier path (open). `move` false continues an existing path. */
function cr(pts: P[], move = true): string {
  let d = move ? `M${pt(pts[0])}` : '';
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1: P = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: P = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${pt(c1)} ${pt(c2)} ${pt(p2)}`;
  }
  return d;
}

/** Dense samples of a Catmull-Rom spline through [x, y, width] control points. */
function sampleSpline(ctrl: [number, number, number][], per = 10) {
  const out: { x: number; y: number; w: number; tx: number; ty: number }[] = [];
  for (let i = 0; i < ctrl.length - 1; i++) {
    const p0 = ctrl[i - 1] ?? ctrl[i];
    const p1 = ctrl[i];
    const p2 = ctrl[i + 1];
    const p3 = ctrl[i + 2] ?? p2;
    for (let s = 0; s < per; s++) {
      const t = s / per;
      const t2 = t * t;
      const t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) =>
        0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      const df = (a: number, b: number, c: number, d: number) =>
        0.5 * ((-a + c) + 2 * (2 * a - 5 * b + 4 * c - d) * t + 3 * (-a + 3 * b - 3 * c + d) * t2);
      out.push({
        x: f(p0[0], p1[0], p2[0], p3[0]),
        y: f(p0[1], p1[1], p2[1], p3[1]),
        w: p1[2] + (p2[2] - p1[2]) * t,
        tx: df(p0[0], p1[0], p2[0], p3[0]),
        ty: df(p0[1], p1[1], p2[1], p3[1]),
      });
    }
  }
  const l = ctrl[ctrl.length - 1];
  const prev = out[out.length - 1];
  out.push({ x: l[0], y: l[1], w: l[2], tx: prev.tx, ty: prev.ty });
  return out;
}

/** A tapering ribbon around a spline: returns outline path plus cross-ring hairlines. */
function ribbon(ctrl: [number, number, number][], opts: { per?: number; ringEvery?: number; ringFrom?: number; ringTo?: number; cap?: boolean; side?: 'both' | 'left' } = {}) {
  const { per = 10, ringEvery = 4, ringFrom = 0.15, ringTo = 0.92, cap = true } = opts;
  const s = sampleSpline(ctrl, per);
  const L: P[] = [];
  const R: P[] = [];
  s.forEach((q) => {
    const len = Math.hypot(q.tx, q.ty) || 1;
    const nx = -q.ty / len;
    const ny = q.tx / len;
    L.push([q.x + (nx * q.w) / 2, q.y + (ny * q.w) / 2]);
    R.push([q.x - (nx * q.w) / 2, q.y - (ny * q.w) / 2]);
  });
  const poly = (a: P[]) => a.map((p, i) => `${i ? 'L' : 'M'}${pt(p)}`).join('');
  const tip = s[s.length - 1];
  const capD = cap ? `A${r1(tip.w / 2)} ${r1(tip.w / 2)} 0 0 1 ${pt(R[R.length - 1])}` : `L${pt(R[R.length - 1])}`;
  const outline = `${poly(L)}${capD}${R.slice().reverse().slice(1).map((p) => `L${pt(p)}`).join('')}`;
  let rings = '';
  for (let i = Math.floor(s.length * ringFrom); i < s.length * ringTo; i += ringEvery) {
    const q = s[i];
    const len = Math.hypot(q.tx, q.ty) || 1;
    const tx = (q.tx / len) * 2.2;
    const ty = (q.ty / len) * 2.2;
    rings += `M${pt(L[i])}Q${r1((L[i][0] + R[i][0]) / 2 + tx)} ${r1((L[i][1] + R[i][1]) / 2 + ty)} ${pt(R[i])}`;
  }
  const mid = s.map((q) => [q.x, q.y] as P);
  return { outline, rings, L, R, mid, s };
}

/** Row of scallops (semicircles hanging down) from x1 to x2 at y. */
function scallops(x1: number, x2: number, y: number, n: number, drop = 1, dy = 0, move = true) {
  const w = (x2 - x1) / n;
  const rr = r1(Math.abs(w) / 2);
  let d = move ? `M${r1(x1)} ${r1(y)}` : '';
  for (let i = 1; i <= n; i++) {
    const x = x1 + w * i;
    d += `A${rr} ${r1(rr * drop)} 0 0 ${w > 0 ? 0 : 1} ${r1(x)} ${r1(y + (dy * i) / n)}`;
  }
  return d;
}

/** Cusped pointed arch between x0 and x1 springing at ys with apex at ya. */
function foilArch(x0: number, x1: number, ys: number, ya: number) {
  const w = x1 - x0;
  const cx = (x0 + x1) / 2;
  const ym = ys - (ys - ya) * 0.66;
  const pts: P[] = [[x0, ys], [x0 + w * 0.2, ym], [cx, ya], [x1 - w * 0.2, ym], [x1, ys]];
  let d = `M${pt(pts[0])}`;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const rr = r1(Math.hypot(b[0] - a[0], b[1] - a[1]) * 0.56);
    d += `A${rr} ${rr} 0 0 1 ${pt(b)}`;
  }
  return d;
}

const dots = (pts: P[]) => pts.map((p) => `M${r1(p[0])} ${r1(p[1])}h.01`).join('');

/** A little bell: dome, lip, clapper. Origin at top centre. */
const bell = (x: number, y: number, s = 1) =>
  `M${r1(x - 3.2 * s)} ${r1(y + 6 * s)}C${r1(x - 3.2 * s)} ${r1(y + 1 * s)} ${r1(x - 1.6 * s)} ${r1(y)} ${r1(x)} ${r1(y)}S${r1(x + 3.2 * s)} ${r1(y + 1 * s)} ${r1(x + 3.2 * s)} ${r1(y + 6 * s)}H${r1(x - 3.2 * s)}M${r1(x)} ${r1(y + 7.8 * s)}h.01`;

/* =============================================================== ELEPHANT === */

const GROUND = 392;

/** One leg: tapered column, rounded foot, nails, padded anklet with bells. */
function leg(o: { x: number; y0: number; yg: number; wt: number; wa: number; wf: number; lean?: number; nails?: boolean }) {
  const { x, y0, yg, wt, wa, wf, lean = 0, nails = true } = o;
  const ya = yg - 40;
  const xa = x + lean;
  const L: P[] = [
    [x - wt / 2, y0],
    [x - wt / 2 + (lean * 0.15) - 1, y0 + (ya - y0) * 0.5],
    [xa - wa / 2, ya],
    [xa - wf / 2 + 2, yg - 22],
    [xa - wf / 2, yg - 9],
  ];
  const foot: P[] = [[xa - wf / 2 + 3, yg - 2], [xa, yg], [xa + wf / 2 - 3, yg - 2]];
  const Rr: P[] = [
    [xa + wf / 2, yg - 9],
    [xa + wf / 2 - 2, yg - 22],
    [xa + wa / 2, ya],
    [x + wt / 2 + (lean * 0.15) + 1, y0 + (ya - y0) * 0.5],
    [x + wt / 2, y0],
  ];
  const body = cr([...L, ...foot, ...Rr]);
  // anklet: two bands with a row of bells
  const ay = ya + 9;
  const aw = wa / 2 + 2.5;
  const anklet =
    `M${r1(xa - aw)} ${ay}Q${r1(xa)} ${ay + 5} ${r1(xa + aw)} ${ay}` +
    `M${r1(xa - aw)} ${ay + 6}Q${r1(xa)} ${ay + 11} ${r1(xa + aw)} ${ay + 6}` +
    `M${r1(xa - aw)} ${ay}V${ay + 6}M${r1(xa + aw)} ${ay}V${ay + 6}`;
  let bells = '';
  const nb = 5;
  for (let i = 0; i < nb; i++) {
    const bx = xa - aw + 3 + ((2 * aw - 6) * i) / (nb - 1);
    bells += bell(bx, ay + 9 + Math.sin((i / (nb - 1)) * Math.PI) * 4, 0.62);
  }
  const studs = dots([0, 1, 2, 3].map((i) => [xa - aw + 6 + ((2 * aw - 12) * i) / 3, ay + 3.4 + Math.sin((i / 3) * Math.PI) * 2.6] as P));
  // toe nails along the front of the foot
  let toes = '';
  if (nails) {
    for (let i = 0; i < 3; i++) {
      const tx = xa - wf / 2 + 8 + ((wf - 16) * i) / 2;
      toes += `M${r1(tx - 3.4)} ${yg - 0.5}Q${r1(tx)} ${yg - 6.2} ${r1(tx + 3.4)} ${yg - 0.5}`;
    }
  }
  // skin folds
  const folds = `M${r1(x - wt / 2 + 6)} ${y0 + 34}q${r1(wt * 0.25)} 5 ${r1(wt * 0.5)} 1M${r1(x - wt / 2 + 9)} ${y0 + 48}q${r1(wt * 0.2)} 4 ${r1(wt * 0.4)} 1`;
  return { body, anklet, bells, studs, toes, folds, ankleY: ay };
}

const TRUNK = ribbon(
  [
    [504, 198, 36],
    [534, 212, 32],
    [570, 216, 27],
    [599, 202, 22],
    [614, 174, 18],
    [609, 146, 14],
    [591, 130, 11],
    [575, 136, 8],
    [570, 150, 5],
  ],
  { per: 9, ringEvery: 3, ringFrom: 0.1, ringTo: 0.95 },
);

/* forehead ornament (nettipattam): a jewelled ribbon along the forehead */
const NETTI = ribbon(
  [
    [462, 143, 16],
    [486, 141, 15],
    [503, 152, 14],
    [511, 168, 13],
    [512, 182, 11],
  ],
  { per: 8, ringEvery: 5, ringFrom: 0.05, ringTo: 0.97, cap: false },
);

const NETTI_DROPS = (() => {
  let d = '';
  for (let i = 4; i < NETTI.L.length - 6; i += 7) {
    const a = NETTI.L[i];
    const b = NETTI.R[i];
    const nx = (a[0] - b[0]) / (Math.hypot(a[0] - b[0], a[1] - b[1]) || 1);
    const ny = (a[1] - b[1]) / (Math.hypot(a[0] - b[0], a[1] - b[1]) || 1);
    const e: P = [a[0] + nx * 5, a[1] + ny * 5];
    d += `M${pt(a)}L${pt(e)}M${r1(e[0] - 1.1)} ${r1(e[1])}a1.1 1.1 0 1 0 2.2 0a1.1 1.1 0 1 0-2.2 0`;
  }
  return d;
})();

const EAR = (() => {
  const outer: P[] = [[452, 164], [430, 168], [414, 196], [412, 230], [426, 260], [446, 270], [462, 258], [470, 228], [470, 192]];
  return { outer: cr(outer), rim: cr(outer.map(([x, y]) => [x + (466 - x) * 0.14, y + (216 - y) * 0.14] as P)) };
})();

const HEAD_TOP: P[] = [[398, 184], [420, 168], [438, 144], [464, 128], [492, 126], [512, 140], [522, 164]];
const JAW: P[] = [[510, 234], [500, 247], [482, 251], [474, 264], [480, 284], [494, 302]];

const CLOTH_W = { x0: 150, x1: 410, top: 172, hemL: 302, hemR: 296 };

export function Elephant({ className, animated = false, lit = false, walking = true, ...p }: ElephantProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const stroke = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    vectorEffect: 'non-scaling-stroke',
  } as const;
  const soft = { ...stroke, opacity: 0.55 } as const;
  const faint = { ...stroke, opacity: 0.32 } as const;

  const nearFront = leg({ x: 470, y0: 300, yg: GROUND, wt: 60, wa: 42, wf: 56, lean: 4 });
  const farFront = leg({ x: 402, y0: 296, yg: GROUND - 4, wt: 52, wa: 36, wf: 46, lean: -4 });
  const nearRear = leg({ x: 166, y0: 302, yg: GROUND, wt: 70, wa: 44, wf: 56, lean: -8 });
  const farRear = leg({ x: 238, y0: 298, yg: GROUND - 4, wt: 54, wa: 36, wf: 46, lean: 2 });

  // caparison hem and borders
  const { x0, x1, top, hemL, hemR } = CLOTH_W;
  const cloth =
    `M${x0} ${top + 22}C${x0 + 30} ${top + 6} ${x0 + 90} ${top} 285 ${top}S${x1 - 40} ${top + 8} ${x1} ${top + 18}` +
    `C${x1 + 12} ${top + 70} ${x1 + 10} ${hemR - 40} ${x1 + 4} ${hemR}${scallops(x1 + 4, x0 - 8, hemR, 13, 1, hemL - hemR, false)}` +
    `C${x0 - 26} ${hemL - 50} ${x0 - 28} ${top + 60} ${x0} ${top + 22}Z`;
  const innerHemY = hemR - 14;
  const innerHemL = hemL - 14;
  const clothInner =
    `M${x0 + 12} ${top + 28}C${x0 + 40} ${top + 14} ${x0 + 96} ${top + 9} 285 ${top + 9}S${x1 - 46} ${top + 16} ${x1 - 10} ${top + 24}` +
    `C${x1 + 2} ${top + 70} ${x1} ${innerHemY - 40} ${x1 - 6} ${innerHemY}${scallops(x1 - 6, x0 + 2, innerHemY, 12, 0.8, innerHemL - innerHemY, false)}` +
    `C${x0 - 14} ${innerHemL - 50} ${x0 - 14} ${top + 66} ${x0 + 12} ${top + 28}Z`;
  // tassels under every scallop
  const tassels: string[] = [];
  {
    const n = 13;
    const w = (x0 - 8 - (x1 + 4)) / n;
    for (let i = 0; i < n; i++) {
      const cx = x1 + 4 + w * (i + 0.5);
      const y = hemR + ((hemL - hemR) * (i + 0.5)) / n + Math.abs(w) / 2 + 1;
      tassels.push(`M${r1(cx)} ${r1(y)}v3M${r1(cx - 1.8)} ${r1(y + 3)}q1.8 -1.2 3.6 0l-.5 6.4h-2.6z`);
    }
  }
  // embroidery: medallions along the cloth
  const medallion = (cx: number, cy: number, rr: number, petals = 8) => {
    let d = `M${cx + rr} ${cy}a${rr} ${rr} 0 1 0 ${-2 * rr} 0a${rr} ${rr} 0 1 0 ${2 * rr} 0`;
    d += `M${cx + rr * 0.34} ${cy}a${rr * 0.34} ${rr * 0.34} 0 1 0 ${-rr * 0.68} 0a${rr * 0.34} ${rr * 0.34} 0 1 0 ${rr * 0.68} 0`;
    for (let i = 0; i < petals; i++) {
      const a = (i / petals) * Math.PI * 2;
      const ca = Math.cos(a);
      const sa = Math.sin(a);
      const a1 = a - 0.32;
      const a2 = a + 0.32;
      d += `M${r1(cx + ca * rr * 0.34)} ${r1(cy + sa * rr * 0.34)}Q${r1(cx + Math.cos(a1) * rr * 0.72)} ${r1(cy + Math.sin(a1) * rr * 0.72)} ${r1(cx + ca * rr * 0.98)} ${r1(cy + sa * rr * 0.98)}Q${r1(cx + Math.cos(a2) * rr * 0.72)} ${r1(cy + Math.sin(a2) * rr * 0.72)} ${r1(cx + ca * rr * 0.34)} ${r1(cy + sa * rr * 0.34)}`;
    }
    return d;
  };
  const paisley = (cx: number, cy: number, s: number, flip = 1) =>
    `M${cx} ${cy + 12 * s}C${cx - 10 * s * flip} ${cy + 6 * s} ${cx - 8 * s * flip} ${cy - 8 * s} ${cx} ${cy - 12 * s}C${cx + 10 * s * flip} ${cy - 6 * s} ${cx + 8 * s * flip} ${cy + 6 * s} ${cx} ${cy + 12 * s}M${cx} ${cy + 6 * s}C${cx - 4 * s * flip} ${cy + 2 * s} ${cx - 3 * s * flip} ${cy - 5 * s} ${cx} ${cy - 7 * s}`;
  const midY = 242;
  const embroidery =
    medallion(285, midY, 21) +
    medallion(212, midY + 2, 15, 6) +
    medallion(358, midY + 2, 15, 6) +
    paisley(248, midY + 2, 0.9, 1) +
    paisley(322, midY + 2, 0.9, -1) +
    paisley(176, midY + 4, 0.8, 1) +
    paisley(394, midY + 4, 0.8, -1);
  // sunburst ring round the great medallion, vine and kangura fringe
  let rays = '';
  for (let i = 0; i < 28; i++) {
    const a = (i / 28) * Math.PI * 2;
    rays += `M${r1(285 + Math.cos(a) * 24)} ${r1(midY + Math.sin(a) * 24)}L${r1(285 + Math.cos(a) * 28)} ${r1(midY + Math.sin(a) * 28)}`;
  }
  rays += `M285 ${midY - 28}a28 28 0 1 0 0 56a28 28 0 1 0 0 -56`;
  let vine = `M${x0 + 18} ${innerHemY - 8}`;
  for (let i = 0; i < 17; i++) vine += `q4.4 ${i % 2 ? 7 : -7} 8.8 0`;
  let buds = '';
  for (let i = 0; i < 17; i++) {
    const bx = x0 + 22.4 + i * 8.8 * 1;
    buds += `M${r1(bx)} ${innerHemY - (i % 2 ? 4 : 12)}v${i % 2 ? 5 : -4}`;
  }
  let kangura = '';
  for (let i = 0; i < 40; i++) kangura += `M${r1(x0 + 16 + i * 5.9)} ${innerHemY - 1}q2.9 -6 5.9 0`;
  // zig-zag + dots along the inner hem
  // upper frieze: small diamond lattice just under the top border
  let frieze = '';
  for (let i = 0; i < 22; i++) {
    const fx = x0 + 28 + i * 11.6;
    frieze += `M${r1(fx)} ${top + 24 + Math.sin((i / 22) * Math.PI) * -6}l3.2 3.4l-3.2 3.4l-3.2 -3.4z`;
  }

  // mala (bead chains) draped over the shoulder, neck bells
  const chain = (pts: P[]) => cr(pts);
  const chainBeads = (pts: P[], n: number) => {
    const s = sampleSpline(pts.map((q) => [q[0], q[1], 0] as [number, number, number]), 12);
    let d = '';
    for (let i = 0; i < n; i++) {
      const q = s[Math.floor((s.length - 1) * ((i + 0.5) / n))];
      d += `M${r1(q.x)} ${r1(q.y)}h.01`;
    }
    return d;
  };
  const mala1: P[] = [[444, 268], [452, 292], [472, 306], [494, 298]];
  const mala2: P[] = [[438, 270], [444, 300], [468, 318], [498, 306]];

  const ambari = (
    <g className="psel-ambari" transform="translate(0 5)">
      {/* pad cushion */}
      <path {...stroke} d="M184 172q0-8 8-8H388q8 0 8 8z" />
      <path {...faint} d="M190 168H390" />
      {/* plinth with scalloped lower edge and jali */}
      <path {...stroke} d="M196 164V140H384V164" />
      <path {...stroke} d={scallops(196, 384, 164, 16, 0.9)} />
      <path {...stroke} d="M192 140H388M194 144H386" />
      <path {...faint} d={Array.from({ length: 15 }, (_, i) => `M${r1(201 + i * 12)} 154l6 -6l6 6l-6 6z`).join('')} />
      {/* balustrade */}
      <path {...stroke} d="M198 140V120M382 140V120M198 120H382M198 124H382" />
      <path {...faint} d={Array.from({ length: 15 }, (_, i) => `M${r1(204 + i * 12)} 140V132q4 -7 8 0V140`).join('')} />
      {/* pillars */}
      {[206, 248, 290, 332, 374].map((x) => (
        <g key={x}>
          <path {...stroke} d={`M${x - 3} 120V80M${x + 3} 120V80M${x - 6} 80h12M${x - 5} 84h10M${x - 5} 116h10`} />
          <path {...faint} d={`M${x} 118V82`} />
        </g>
      ))}
      {/* cusped arches between pillars and hanging drops */}
      {[206, 248, 290, 332].map((x) => (
        <g key={x}>
          <path {...stroke} d={foilArch(x + 3, x + 39, 104, 82)} />
          <path {...faint} d={foilArch(x + 7, x + 35, 104, 90)} />
        </g>
      ))}
      <path {...soft} d={dots([227, 269, 311, 353].flatMap((x) => [[x, 108] as P]))} />
      {/* curved eave with up-turned ends */}
      <path {...stroke} d="M178 66C186 76 194 78 206 78H374C386 78 394 76 402 66" />
      <path {...stroke} d="M182 72C192 70 198 70 206 70H374C382 70 388 70 398 72M206 78V70M374 78V70" />
      <path {...faint} d={Array.from({ length: 17 }, (_, i) => `M${r1(190 + i * 12.5)} 76.5q0 -3 0 -6`).join('')} />
      {/* crest of little lotus buds along the eave */}
      <path {...soft} d={Array.from({ length: 15 }, (_, i) => `M${r1(204 + i * 12.5)} 70q2 -7 4 0`).join('')} />
      {/* drum under the great dome */}
      <path {...stroke} d="M246 70V54H334V70M242 54H338M244 58H336" />
      {[252, 270, 288, 306, 324].map((x) => (
        <path key={x} {...faint} d={`M${x} 70V62q4 -6 8 0V70`} />
      ))}
      {/* lotus ring + great onion dome + kalasha */}
      <path {...stroke} d="M252 54q6 -8 12 0q6 -8 12 0q6 -8 12 0q6 -8 12 0q6 -8 12 0" />
      <path
        {...stroke}
        fill="currentColor"
        fillOpacity={0.1}
        d="M250 48C238 36 258 26 290 18C322 26 342 36 330 48z"
      />
      <path {...stroke} d="M250 48C238 36 258 26 290 18C322 26 342 36 330 48" />
      <path {...faint} d="M262 46C256 38 268 31 290 25C312 31 324 38 318 46M290 20V46" />
      <path {...stroke} d="M290 18V14M286 14h8M287 14C285 10 288 8 290 6C292 8 295 10 293 14M290 6V3" />
      <path {...soft} d="M282 18l-3 -4M298 18l3 -4" />
      {/* end domelets */}
      {[212, 368].map((x) => (
        <g key={x}>
          <path {...stroke} d={`M${x - 14} 70V62H${x + 14}V70M${x - 16} 62h32`} />
          <path {...stroke} d={`M${x - 12} 62C${x - 22} 54 ${x - 6} 46 ${x} 40C${x + 6} 46 ${x + 22} 54 ${x + 12} 62`} fill="currentColor" fillOpacity={0.08} />
          <path {...stroke} d={`M${x} 40V35M${x - 2} 35h4M${x} 35V32`} />
          <path {...faint} d={`M${x - 6} 62V70M${x + 6} 62V70`} />
        </g>
      ))}
      {/* swags of bead garland across the front */}
      <path {...soft} d="M214 124Q231 134 248 124Q269 134 290 124Q311 134 332 124Q353 134 374 124" />
    </g>
  );

  return (
    <svg viewBox="70 0 570 420" className={className} aria-hidden="true" focusable="false" {...p}>
      <defs>
        <radialGradient id={`${uid}g`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#F3E0A2" stopOpacity="0.5" />
          <stop offset="0.45" stopColor="#D8B76A" stopOpacity="0.18" />
          <stop offset="1" stopColor="#D8B76A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <style>{`
        .psel-ambari{transition:filter 1.6s ease}
        ${lit ? `.psel-ambari{filter:drop-shadow(0 0 5px rgb(243 224 162 / .55)) drop-shadow(0 0 16px rgb(216 183 106 / .45))}` : ''}
        .psel-glow{opacity:${lit ? 1 : 0};transition:opacity 1.6s ease}
        .psel-spark{opacity:${lit ? 1 : 0};transition:opacity 1.2s ease .3s}
        ${animated ? `
        .psel-bob,.psel-legA,.psel-legB,.psel-tail,.psel-ear,.psel-trunk,.psel-bells,.psel-twinkle{transform-box:fill-box}
        .psel-legA,.psel-legB{transform-origin:50% 0}
        .psel-tail{transform-origin:50% 0}
        .psel-ear{transform-origin:85% 8%}
        .psel-trunk{transform-origin:5% 70%}
        @media (prefers-reduced-motion:no-preference){
          .psel-bob{animation:psel-bob 2.6s ease-in-out infinite}
          ${walking ? `.psel-legA{animation:psel-lift 2.6s ease-in-out infinite}
          .psel-legB{animation:psel-lift 2.6s ease-in-out infinite;animation-delay:-1.3s}` : ''}
          .psel-tail{animation:psel-sway 3.4s ease-in-out infinite alternate}
          .psel-ear{animation:psel-ear 3.1s ease-in-out infinite alternate}
          .psel-trunk{animation:psel-trunk 4.2s ease-in-out infinite alternate}
          .psel-bells{animation:psel-shimmer 1.3s ease-in-out infinite alternate}
          .psel-twinkle{animation:psel-tw 2.4s ease-in-out infinite;transform-origin:center}
        }
        @keyframes psel-bob{0%,100%{transform:translateY(0)}25%,75%{transform:translateY(-1.6px)}50%{transform:translateY(0.6px)}}
        @keyframes psel-lift{0%,50%,100%{transform:translateY(0) rotate(0)}25%{transform:translateY(-7px) rotate(-3deg)}}
        @keyframes psel-sway{from{transform:rotate(-5deg)}to{transform:rotate(6deg)}}
        @keyframes psel-ear{from{transform:rotate(-3deg)}to{transform:rotate(5deg)}}
        @keyframes psel-trunk{from{transform:rotate(-2deg)}to{transform:rotate(3deg)}}
        @keyframes psel-shimmer{from{opacity:.6}to{opacity:1}}
        @keyframes psel-tw{0%,100%{opacity:.25;transform:scale(.6)}50%{opacity:1;transform:scale(1)}}
        ` : ''}
      `}</style>

      <g className="psel-bob">
        {/* optional opaque silhouette (set --el-bg on the svg to the backdrop colour) so scenery behind never shows through */}
        <g fill="var(--el-bg, none)" stroke="none">
          <path d={farRear.body} />
          <path d={farFront.body} />
          <path d={nearRear.body} />
          <path d={nearFront.body} />
          <path d={cloth} />
          <path d="M197 178H383V78H197z" />
          <path d={`${cr([...HEAD_TOP, TRUNK.R[0]])}L${pt(TRUNK.L[0])}${cr([TRUNK.L[0], ...JAW], false)}L440 296L398 190Z`} />
          <path d="M246 70V48C238 36 258 26 290 18C322 26 342 36 334 48V70zM198 70V62C190 52 206 44 212 40C218 44 234 52 226 62V70zM354 70V62C346 52 362 44 368 40C374 44 390 52 382 62V70z" />
          <path d={TRUNK.outline} />
          <path d={EAR.outer} />
        </g>
        {/* soft glow behind the ambari */}
        <ellipse className="psel-glow" cx="290" cy="92" rx="190" ry="120" fill={`url(#${uid}g)`} />

        {/* far legs (behind) */}
        <g className="psel-legB">
          <g {...faint}>
            <path d={farRear.body} />
            <path d={farRear.anklet} />
            <path d={farRear.toes} />
          </g>
          <g {...faint}>
            <path d={farRear.bells} />
          </g>
        </g>
        <g className="psel-legA">
          <g {...faint}>
            <path d={farFront.body} />
            <path d={farFront.anklet} />
            <path d={farFront.toes} />
            <path d={farFront.bells} />
          </g>
        </g>

        {/* tail */}
        <g className="psel-tail">
          <path {...stroke} d="M126 232C110 248 106 272 114 290" />
          <path {...stroke} d="M128 236C118 250 116 270 122 288" />
          <path {...stroke} d="M118 288c-8 10 -10 22 -2 32c4 -5 6 -9 6 -14c2 6 5 10 9 12c4 -9 1 -22 -7 -30" />
          <path {...faint} d="M118 306c-2 6 -2 10 1 14M124 304c0 6 1 10 3 13" />
          <path {...stroke} d="M115 290h14M116 295h12" />
        </g>

        {/* rump and belly */}
                <path {...soft} d={cr([[198, 328], [262, 334], [330, 333], [396, 329], [440, 320]])} />

        {/* near legs */}
        <g className="psel-legB">
          <path {...stroke} d={nearRear.body} />
          <path {...faint} d={nearRear.folds} />
          <path {...stroke} d={nearRear.anklet} />
          <path {...stroke} d={nearRear.toes} />
          <path {...soft} d={nearRear.studs} />
          <g className="psel-bells"><path {...stroke} d={nearRear.bells} /></g>
        </g>
        <g className="psel-legA">
          <path {...stroke} d={nearFront.body} />
          <path {...faint} d={nearFront.folds} />
          <path {...stroke} d={nearFront.anklet} />
          <path {...stroke} d={nearFront.toes} />
          <path {...soft} d={nearFront.studs} />
          <g className="psel-bells"><path {...stroke} d={nearFront.bells} /></g>
        </g>

        {/* caparison */}
        <path d={cloth} fill="currentColor" fillOpacity={0.07} stroke="none" />
        <path {...stroke} d={cloth} />
        <path {...stroke} d={clothInner} />
        <path {...soft} d={tassels.join('')} />
        <path {...stroke} d={embroidery} />
        <path {...soft} d={frieze} />
        <path {...soft} d={rays} />
        <path {...soft} d={vine + buds} />
        <path {...faint} d={kangura} />
        <path {...faint} d={dots(Array.from({ length: 24 }, (_, i) => [x0 + 22 + i * 10.6, innerHemY - 6 - Math.sin(i * 0.26) * 0] as P))} />
        {/* girth chain and big brass bells at the hem */}
        <g className="psel-bells">
          <path {...stroke} d={bell(190, 296, 1.5) + bell(250, 301, 1.5) + bell(320, 303, 1.5) + bell(388, 300, 1.5)} />
        </g>

        {/* mala chains over the shoulder and chest */}
        <path {...stroke} d={chain(mala1)} />
        <path {...soft} d={chain(mala2)} />
        <path {...stroke} d={chainBeads(mala1, 9)} strokeWidth={2.4} />
        <path {...stroke} d={chainBeads(mala2, 8)} strokeWidth={2} />
        <path {...stroke} d={bell(471, 306, 1.6)} />

        {/* golden ambari */}
        {ambari}

        {/* mahout */}
        <g>
          <path {...stroke} d="M401 192C401 176 406 166 414 163C422 166 426 176 426 192" />
          <circle {...stroke} cx="414" cy="153" r="7" />
          <path {...stroke} d="M406 150C406 143 422 143 422 150M407 147h14M412 143c0 -4 4 -4 4 0" />
          <path {...stroke} d="M424 170L446 154M446 154l4 -8M446 154l6 2" />
          <path {...faint} d="M407 192V180M421 192V180" />
        </g>

        {/* ear */}
        <g className="psel-ear">
          <path {...stroke} d={EAR.outer} />
          <path {...faint} d={EAR.rim} />
          <path {...faint} d="M452 176C440 196 436 222 446 256M444 182C432 204 428 228 436 248" />
        </g>

        {/* head, neck and jaw */}
        <path {...stroke} d={cr([...HEAD_TOP, TRUNK.R[0]])} />
        <path {...stroke} d={cr([TRUNK.L[0], ...JAW])} />
        {/* mouth */}
        <path {...stroke} d="M508 228C506 238 498 243 486 241" />
        {/* eye */}
        <path {...stroke} d="M470 200q6 -5 13 0q-6 5 -13 0z" />
        <circle {...stroke} cx="476.5" cy="200" r="1.6" />
        <path {...faint} d="M466 194q9 -8 20 -2M468 208q8 4 16 0M488 214q8 8 16 6M480 226q8 5 14 3" />
        {/* cheek / temple */}
        <path {...faint} d="M458 210q-6 12 2 22" />

        {/* nettipattam */}
        <path {...stroke} d={NETTI.outline} />
        <path {...faint} d={NETTI.rings} />
        <path {...stroke} d="M488 154l6 7l-6 7l-6 -7z" />
        <path {...soft} d={NETTI_DROPS} />

        {/* tusk */}
        <path {...stroke} d="M507 240C530 250 560 252 588 230C584 252 556 270 532 266C520 264 510 256 507 247" />
        <path {...faint} d="M522 246c1 6 1 11 -1 16M552 248c-1 6 -4 11 -8 14" />
        <path {...soft} d="M518 244c1.6 6 1.6 12 -.4 18" />

        {/* trunk */}
        <g className="psel-trunk">
          <path {...stroke} d={TRUNK.outline} />
          <path {...faint} d={TRUNK.rings} />
        </g>

        {/* sparkles around a lit ambari */}
        <g className="psel-spark" {...stroke}>
          {([[176, 54], [404, 50], [290, 2], [228, 28], [352, 30], [190, 130], [394, 132]] as P[]).map(([x, y], i) => (
            <path key={i} className="psel-twinkle" style={{ animationDelay: `${i * 0.37}s` }} d={`M${x} ${y - 5}V${y + 5}M${x - 5} ${y}H${x + 5}`} />
          ))}
        </g>
      </g>
    </svg>
  );
}

/* ================================================================ PALACE === */

/** Onion dome on a base of half-width hw, height h, with a small kalasha finial. */
function dome(cx: number, yb: number, hw: number, h: number) {
  const ya = yb - h;
  return (
    `M${r1(cx - hw)} ${yb}C${r1(cx - hw * 1.3)} ${r1(yb - h * 0.42)} ${r1(cx - hw * 0.45)} ${r1(yb - h * 0.8)} ${cx} ${r1(ya)}` +
    `C${r1(cx + hw * 0.45)} ${r1(yb - h * 0.8)} ${r1(cx + hw * 1.3)} ${r1(yb - h * 0.42)} ${r1(cx + hw)} ${yb}`
  );
}
const finialD = (cx: number, y: number, s = 1) =>
  `M${cx} ${r1(y)}V${r1(y - 6 * s)}M${r1(cx - 2.4 * s)} ${r1(y - 6 * s)}h${r1(4.8 * s)}M${r1(cx - 2 * s)} ${r1(y - 6 * s)}c${r1(-1.4 * s)} ${r1(-3 * s)} 0 ${r1(-6 * s)} ${r1(2 * s)} ${r1(-7.5 * s)}c${r1(2 * s)} ${r1(1.5 * s)} ${r1(3.4 * s)} ${r1(4.5 * s)} ${r1(2 * s)} ${r1(7.5 * s)}M${cx} ${r1(y - 13.5 * s)}V${r1(y - 17 * s)}`;

/** Slim pointed-arch window outline (+ closed shape for glow). */
const windowD = (x: number, yb: number, w: number, h: number) => {
  const ys = yb - h + w * 0.7;
  return `M${r1(x)} ${r1(yb)}V${r1(ys)}Q${r1(x)} ${r1(ys - w * 0.55)} ${r1(x + w / 2)} ${r1(yb - h)}Q${r1(x + w)} ${r1(ys - w * 0.55)} ${r1(x + w)} ${r1(ys)}V${r1(yb)}Z`;
};

/** Open pavilion (chhatri): plinth, four slender pillars with cusped arches, cornice, onion dome, finial. */
function chhatri(cx: number, yb: number, w: number, hp: number, hd: number) {
  const x0 = cx - w / 2;
  const step = w / 3;
  let d = `M${r1(x0 - 4)} ${yb}h${r1(w + 8)}M${r1(x0 - 2)} ${yb - 3}h${r1(w + 4)}`;
  for (let i = 0; i < 4; i++) d += `M${r1(x0 + step * i)} ${yb - 3}V${r1(yb - hp)}`;
  for (let i = 0; i < 3; i++) d += foilArch(x0 + step * i + 1.5, x0 + step * (i + 1) - 1.5, yb - hp + 10, yb - hp + 1);
  const yc = yb - hp;
  d += `M${r1(x0 - 7)} ${yc}h${r1(w + 14)}M${r1(x0 - 5)} ${r1(yc - 3)}h${r1(w + 10)}M${r1(x0 - 3)} ${r1(yc - 6)}h${r1(w + 6)}`;
  d += dome(cx, yc - 6, w / 2 + 1, hd);
  d += finialD(cx, yc - 6 - hd + 1, 0.9);
  return d;
}

/** Cusped (multifoil) arch rim: scallops that follow a pointed arch. side = left half points bottom->apex. */
function archHalf(x0: number, cx: number, ys: number, ya: number): P[] {
  const pts: P[] = [];
  const n = 24;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    // pointed arch: cubic from (x0, ys) to (cx, ya) with vertical start tangent
    const mt = 1 - t;
    const c1: P = [x0, ys - (ys - ya) * 0.62];
    const c2: P = [cx - (cx - x0) * 0.3, ya + (ys - ya) * 0.3];
    pts.push([
      mt ** 3 * x0 + 3 * mt * mt * t * c1[0] + 3 * mt * t * t * c2[0] + t ** 3 * cx,
      mt ** 3 * ys + 3 * mt * mt * t * c1[1] + 3 * mt * t * t * c2[1] + t ** 3 * ya,
    ]);
  }
  return pts;
}
function archPath(x0: number, cx: number, ys: number, ya: number) {
  const l = archHalf(x0, cx, ys, ya);
  const rr = l.map(([x, y]) => `L${r1(2 * cx - x)} ${r1(y)}`).reverse();
  return `M${r1(x0)} ${ys}${l.slice(1).map(([x, y]) => `L${r1(x)} ${r1(y)}`).join('')}${rr.slice(1).join('')}`;
}
function cuspRim(x0: number, cx: number, ys: number, ya: number, lobes: number) {
  const l = archHalf(x0, cx, ys, ya);
  const per = Math.floor((l.length - 1) / lobes);
  const keys: P[] = [];
  for (let i = 0; i <= lobes; i++) keys.push(l[Math.min(i * per, l.length - 1)]);
  keys[lobes] = l[l.length - 1];
  let d = `M${pt(keys[0])}`;
  for (let i = 1; i <= lobes; i++) {
    const rr = r1((Math.hypot(keys[i][0] - keys[i - 1][0], keys[i][1] - keys[i - 1][1]) / 2) * 1.04);
    d += `A${rr} ${rr} 0 0 0 ${pt(keys[i])}`;
  }
  for (let i = lobes - 1; i >= 0; i--) {
    const a: P = [2 * cx - keys[i + 1][0], keys[i + 1][1]];
    const b: P = [2 * cx - keys[i][0], keys[i][1]];
    const rr = r1((Math.hypot(b[0] - a[0], b[1] - a[1]) / 2) * 1.04);
    d += `A${rr} ${rr} 0 0 0 ${pt(b)}`;
  }
  return d;
}

const merlons = (x0: number, x1: number, y: number, n: number, h = 8) => {
  const w = (x1 - x0) / n;
  let d = '';
  for (let i = 0; i < n; i++) d += `M${r1(x0 + w * i + 1)} ${y}V${y - h * 0.55}Q${r1(x0 + w * i + w / 2)} ${y - h * 1.5} ${r1(x0 + w * (i + 1) - 1)} ${y - h * 0.55}V${y}`;
  return d;
};

const PAL = (() => {
  const G = 420; // ground
  // Central gateway
  const cx = 600;
  const ARCH = { x0: 392, ys: 276, ya: 156 };
  const parts: Record<string, string> = {};
  parts.ground = `M0 ${G - 0.5}H1200`;

  // ----- wings: arcades of cusped arches with lit windows
  const wing = (xa: number, xb: number) => {
    const n = Math.round((xb - xa) / 44);
    const w = (xb - xa) / n;
    const wall = `M${xa} ${G}V292H${xb}V${G}M${xa} 300H${xb}M${xa} 296H${xb}`;
    let arcs = '';
    let glow = '';
    for (let i = 0; i < n; i++) {
      const ax = xa + w * i + 6;
      const aw = w - 12;
      arcs += windowD(ax, G, aw, 82).replace('Z', '') + `M${r1(ax + 4)} ${G}V${G - 62}M${r1(ax + aw - 4)} ${G}V${G - 62}`;
      arcs += foilArch(ax + 4, ax + aw - 4, G - 62, G - 76).replace(/^M/, 'M');
      glow += windowD(ax + 6, G - 6, aw - 12, 60);
    }
    return { wall: wall + merlons(xa, xb, 292, Math.round((xb - xa) / 12)), arcs, glow };
  };
  const wl = wing(8, 304);
  const wr = wing(896, 1192);
  parts.wall = wl.wall + wr.wall;
  parts.arcs = wl.arcs + wr.arcs;
  parts.glow = wl.glow + wr.glow;

  // ----- pavilions on the wings
  parts.chhatris =
    chhatri(214, 292, 66, 44, 42) + chhatri(986, 292, 66, 44, 42) +
    chhatri(96, 292, 46, 30, 30) + chhatri(1104, 292, 46, 30, 30) +
    chhatri(300, 292, 38, 26, 24) + chhatri(900, 292, 38, 26, 24);

  // ----- central block
  const bx0 = 304;
  const bx1 = 896;
  parts.block =
    `M${bx0} ${G}V122H${bx1}V${G}` +
    `M${bx0 - 6} 122H${bx1 + 6}M${bx0 - 4} 116H${bx1 + 4}M${bx0 - 6} 122v-6M${bx1 + 6} 122v-6` +
    `M${bx0 + 14} ${G}V130M${bx0 + 22} ${G}V130M${bx1 - 14} ${G}V130M${bx1 - 22} ${G}V130` +
    merlons(bx0 - 4, bx1 + 4, 116, 49, 8);
  // flanking window ranks on the gateway block
  let bwin = '';
  let bglow = '';
  // two columns of arched windows each side (x 334..372 and 828..866) stacked in three rows
  for (const base of [330, 826]) {
    for (let r = 0; r < 3; r++) {
      const yb = 224 + r * 66;
      for (let k = 0; k < 2; k++) {
        const x = base + k * 24;
        bwin += windowD(x, yb, 18, 38) + foilArch(x + 2, x + 16, yb - 22, yb - 30);
        bglow += windowD(x + 3, yb - 3, 12, 30);
      }
    }
  }
  parts.bwin = bwin;
  parts.bglow = bglow;

  // ----- tier above block, drum and the great dome
  parts.tier2 =
    `M${cx - 214} 116V84H${cx + 214}V116M${cx - 222} 84H${cx + 222}M${cx - 220} 79H${cx + 220}M${cx - 222} 84v-5M${cx + 222} 84v-5` +
    merlons(cx - 220, cx + 220, 79, 36, 7);
  let t2win = '';
  let t2glow = '';
  for (let i = 0; i < 9; i++) {
    const x = cx - 192 + i * 43;
    t2win += windowD(x, 114, 26, 26) + foilArch(x + 3, x + 23, 100, 92);
    t2glow += windowD(x + 4, 112, 18, 21);
  }
  parts.t2win = t2win;
  parts.t2glow = t2glow;
  parts.drum = `M${cx - 78} 79V60H${cx + 78}V79M${cx - 86} 60H${cx + 86}M${cx - 84} 57H${cx + 84}M${cx - 84} 57v3M${cx + 84} 57v3`;
  let drumArcs = '';
  for (let i = 0; i < 4; i++) drumArcs += foilArch(cx - 72 + i * 36, cx - 72 + i * 36 + 32, 77, 65);
  parts.drumArcs = drumArcs;
  parts.dome = dome(cx, 57, 66, 44);
  parts.domeRibs = dome(cx, 54, 40, 34);
  parts.finial = finialD(cx, 13, 0.8);
  parts.lotus = Array.from({ length: 6 }, (_, i) => `M${cx - 66 + i * 22} 57q11 -9 22 0`).join('');
  // small domelets on the block corners and tier
  parts.corner =
    chhatri(bx0 - 8, 116, 30, 16, 18) + chhatri(bx1 + 8, 116, 30, 16, 18) +
    chhatri(cx - 214, 79, 24, 10, 14) + chhatri(cx + 214, 79, 24, 10, 14) +
    chhatri(cx - 150, 79, 18, 8, 11) + chhatri(cx + 150, 79, 18, 8, 11);

  // ----- the great arch (opening, rims, receding arches)
  const { x0, ys, ya } = ARCH;
  parts.arch1 = archPath(x0 - 28, cx, ys, ya - 34); // outer frame
  parts.arch2 = archPath(x0 - 14, cx, ys, ya - 16);
  parts.arch3 = archPath(x0, cx, ys, ya);
  parts.cusp = cuspRim(x0 + 4, cx, ys + 2, ya + 6, 8);
  parts.archPillars = `M${x0 - 28} ${G}V${ys}M${x0 - 14} ${G}V${ys}M${2 * cx - x0 + 28} ${G}V${ys}M${2 * cx - x0 + 14} ${G}V${ys}M${x0 - 34} ${G}h${2 * (cx - x0) + 68}M${x0 - 34} ${G - 6}h${2 * (cx - x0) + 68}`;
  parts.archDepth = archPath(x0 + 36, cx, ys, ya + 36) + archPath(x0 + 66, cx, ys + 8, ya + 70) + `M${x0 + 36} ${G}V${ys}M${2 * cx - x0 - 36} ${G}V${ys}M${x0 + 66} ${G}V${ys + 8}M${2 * cx - x0 - 66} ${G}V${ys + 8}`;
  parts.floor = `M${x0 + 36} ${G}L${x0 + 66} ${G - 22}H${2 * cx - x0 - 66}L${2 * cx - x0 - 36} ${G}`;
  // door leaves (left half drawn, right half mirrored with a transform)
  const half = (x: number) => {
    const out = `M${x} ${G}V${ys}C${x} ${r1(ys - (ys - ya) * 0.62)} ${r1(cx - (cx - x) * 0.55)} ${r1(ya + (ys - ya) * 0.07)} ${cx} ${ya}V${G}Z`;
    return out;
  };
  parts.leaf = half(x0);
  // panels in the leaf
  const px = x0 + 14;
  parts.leafPanels =
    `M${px} ${G - 8}V${ys + 6}C${px} ${r1(ys - 70)} ${r1(cx - 130)} ${r1(ya + 52)} ${cx - 12} ${ya + 28}V${G - 8}Z` +
    `M${px} ${G - 70}H${cx - 12}M${px} ${G - 150}H${cx - 12}M${px} ${G - 230}H${cx - 12}` +
    `M${px + 6} ${G - 30}h${cx - px - 24}`;
  let studs = '';
  for (let r = 0; r < 6; r++) for (let c = 0; c < 5; c++) studs += `M${r1(px + 14 + c * ((cx - px - 40) / 4))} ${G - 40 - r * 28}h.01`;
  parts.studs = studs;
  parts.ring = `M${cx - 28} ${G - 150}a6 6 0 1 0 .01 0M${cx - 28} ${G - 144}v6`;
  return parts;
})();

export function Palace({ className, lit = false, open = false, ...p }: PalaceProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const stroke = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    vectorEffect: 'non-scaling-stroke',
  } as const;
  const soft = { ...stroke, opacity: 0.55 } as const;
  const faint = { ...stroke, opacity: 0.3 } as const;
  const win = { fill: 'currentColor', stroke: 'none' } as const;
  return (
    <svg viewBox="0 0 1200 420" className={className} aria-hidden="true" focusable="false" {...p}>
      <defs>
        <radialGradient id={`${uid}d`} cx="50%" cy="62%" r="62%">
          <stop offset="0" stopColor="#F3E0A2" stopOpacity="0.85" />
          <stop offset="0.5" stopColor="#D8B76A" stopOpacity="0.4" />
          <stop offset="1" stopColor="#B8893A" stopOpacity="0.05" />
        </radialGradient>
        <clipPath id={`${uid}c`}>
          <path d={PAL.leaf} />
          <path d={PAL.leaf} transform="translate(1200 0) scale(-1 1)" />
        </clipPath>
      </defs>
      <style>{`
        .psp-win{opacity:.2;transition:opacity 1.6s ease}
        ${lit ? '.psp-win{opacity:.34}' : ''}
        .psp-light{opacity:${open ? 1 : lit ? 0.5 : 0.18};transition:opacity 1.6s ease}
        .psp-leaf{transform-box:fill-box;transition:transform 1.5s cubic-bezier(.65,0,.25,1),opacity 1.5s ease}
        .psp-leafL{transform-origin:0% 50%}
        .psp-leafR{transform-origin:100% 50%}
        ${open ? '.psp-leaf{transform:scaleX(.06);opacity:.4}' : ''}
        @media (prefers-reduced-motion:no-preference){
          .psp-win{animation:psp-flick 5s ease-in-out infinite}
          .psp-w2{animation-delay:-1.7s}.psp-w3{animation-delay:-3.1s}
        }
        @keyframes psp-flick{0%,100%{opacity:.16}50%{opacity:.34}}
      `}</style>

      {/* warm light behind the doors */}
      <g clipPath={`url(#${uid}c)`}>
        <rect className="psp-light" x="360" y="110" width="480" height="310" fill={`url(#${uid}d)`} />
      </g>
      <g {...faint}>
        <path d={PAL.archDepth} />
        <path d={PAL.floor} />
      </g>

      {/* structure */}
      <path {...stroke} d={PAL.ground} />
      <path {...stroke} d={PAL.wall} />
      <path {...faint} d={PAL.arcs} />
      <path {...stroke} d={PAL.chhatris} />
      <path {...stroke} d={PAL.block} />
      <path {...faint} d={PAL.bwin} />
      <path {...stroke} d={PAL.tier2} />
      <path {...faint} d={PAL.t2win} />
      <path {...stroke} d={PAL.drum} />
      <path {...faint} d={PAL.drumArcs} />
      <path {...stroke} d={PAL.corner} />
      <path {...soft} d={PAL.lotus} />
      <path {...stroke} fill="currentColor" fillOpacity={0.08} d={PAL.dome} />
      <path {...stroke} d={PAL.dome} />
      <path {...faint} d={PAL.domeRibs} />
      <path {...stroke} d={PAL.finial} />

      {/* the great gateway */}
      <path {...stroke} d={PAL.arch1} />
      <path {...soft} d={PAL.arch2} />
      <path {...stroke} d={PAL.arch3} />
      <path {...stroke} d={PAL.cusp} />
      <path {...stroke} d={PAL.archPillars} />

      {/* door leaves */}
      <g className="psp-leaf psp-leafL">
        <path d={PAL.leaf} fill="currentColor" fillOpacity={0.06} stroke="none" />
        <path {...stroke} d={PAL.leaf} />
        <path {...soft} d={PAL.leafPanels} />
        <path {...stroke} d={PAL.studs} strokeWidth={2} opacity={0.6} />
        <path {...stroke} d={PAL.ring} />
      </g>
      <g transform="translate(1200 0) scale(-1 1)">
        <g className="psp-leaf psp-leafL">
          <path d={PAL.leaf} fill="currentColor" fillOpacity={0.06} stroke="none" />
          <path {...stroke} d={PAL.leaf} />
          <path {...soft} d={PAL.leafPanels} />
          <path {...stroke} d={PAL.studs} strokeWidth={2} opacity={0.6} />
          <path {...stroke} d={PAL.ring} />
        </g>
      </g>

      {/* softly glowing windows */}
      <g {...win}>
        <path className="psp-win" d={PAL.glow} />
        <path className="psp-win psp-w2" d={PAL.bglow} />
        <path className="psp-win psp-w3" d={PAL.t2glow} />
      </g>
    </svg>
  );
}
