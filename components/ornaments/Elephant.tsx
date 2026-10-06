import type { OrnamentProps } from './index';

/** STUB: replaced by the real caparisoned elephant + golden ambari illustration. */
export function Elephant({ className, ...p }: OrnamentProps & { animated?: boolean; lit?: boolean }) {
  return (
    <svg viewBox="0 0 400 260" className={className} aria-hidden="true" {...p}>
      <path d="M40 220h320" fill="none" stroke="currentColor" strokeWidth={1} />
    </svg>
  );
}
