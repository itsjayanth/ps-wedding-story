'use client';
import { motion, useReducedMotion } from 'framer-motion';

/** Big Bodoni section heading: each word rises out of a mask when it scrolls into view. */
export function MaskedHeading({
  id,
  text,
  className = '',
  wordClassName = '',
  style,
}: {
  id: string;
  text: string;
  className?: string;
  wordClassName?: string;
  style?: React.CSSProperties;
}) {
  const reduce = useReducedMotion();
  const words = text.split(' ');
  return (
    <h2 id={id} className={`thread-mask mx-auto w-fit px-4 text-center ${className}`}>
      {words.map((w, i) => (
        <span key={i}>
          <span className="inline-block overflow-hidden px-[0.04em] pb-[0.18em] align-bottom leading-[1.05]">
            <motion.span
              className={`inline-block ${wordClassName}`}
              style={style}
              initial={reduce ? false : { y: '115%' }}
              whileInView={{ y: '0%' }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 1.5, delay: i * 0.12, ease: [0.22, 0.61, 0.36, 1] }}
            >
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </h2>
  );
}
