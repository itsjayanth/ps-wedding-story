'use client';
import { motion, useTransform, type MotionValue } from 'framer-motion';
import type { ThreadGeometry } from './geometry';

export const THREAD = '#CFA650';
export const strokeStyle = { stroke: THREAD, strokeOpacity: 0.95, fill: 'none', strokeWidth: 1.15 } as const;
const BEAD_GAP = 190;

/** Tiny closed lotus bud, drawn around (0,0), pointing up. */
function Bud() {
  return (
    <g stroke={THREAD} strokeWidth={1} fill="rgb(27 20 12 / 0.0)" strokeLinejoin="round" strokeLinecap="round">
      <circle r={9} stroke="none" fill="rgb(216 183 106 / 0.22)" />
      <path d="M0 6C-5 2-5-4 0-10C5-4 5 2 0 6z" fill="rgb(243 224 162 / 0.9)" />
      <path d="M0 6C-8 4-9-3-6-6C-4-3-2-1 0 0M0 6C8 4 9-3 6-6C4-3 2-1 0 0" />
    </g>
  );
}

/** The scroll-drawn trunk: glowing line, diamond beads revealed behind the tip, and a lotus bud at the tip. */
export function Trunk({
  geo,
  len,
  progress,
  id,
}: {
  geo: ThreadGeometry;
  len: number;
  progress: MotionValue<number>;
  id: string;
}) {
  const { x, y0, y1 } = geo.trunk;
  const offset = useTransform(progress, (v) => len * (1 - v));
  const diamondOpacity = useTransform(progress, [0.97, 1], [0, 1]);
  const tipY = useTransform(progress, (v) => v * len);
  const budOpacity = useTransform(progress, [0, 0.02, 0.95, 0.99], [0, 1, 1, 0]);
  const clipH = useTransform(progress, (v) => v * len);
  const beads: number[] = [];
  for (let y = y0 + BEAD_GAP * 0.6; y < y1 - 40; y += BEAD_GAP) beads.push(y);
  return (
    <>
      <motion.path
        d={`M${x} ${y0} V${y1}`}
        style={{ ...strokeStyle, strokeDasharray: len, strokeDashoffset: offset }}
      />
      <clipPath id={id}>
        <motion.rect x={x - 12} y={y0} width={24} style={{ height: clipH }} />
      </clipPath>
      <g clipPath={`url(#${id})`}>
        {beads.map((y) => (
          <path key={y} d={`M${x} ${y - 4.5} l3.6 4.5 l-3.6 4.5 l-3.6 -4.5 z`} fill={THREAD} stroke="none" opacity={0.95} />
        ))}
      </g>
      <g transform={`translate(${x} ${y0})`}>
        <motion.g style={{ y: tipY, opacity: budOpacity }}>
          <Bud />
        </motion.g>
      </g>
      <motion.path d={`M${x} ${y1 - 7} l7 7 l-7 7 l-7 -7 z`} style={{ ...strokeStyle, opacity: diamondOpacity }} />
    </>
  );
}
