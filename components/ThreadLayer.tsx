import type { ReactNode } from 'react';

/** Wraps Families → Closing; draws the gold thread behind children. */
export function ThreadLayer({ children }: { children: ReactNode }) {
  return <div className="relative">{children}</div>;
}
