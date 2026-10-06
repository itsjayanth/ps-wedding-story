/** Dev-only "(sample)" marker for placeholder copy. Renders nothing in production. */
export function SampleTag() {
  if (process.env.NODE_ENV !== 'development') return null;
  return <span className="ml-2 align-middle font-sans text-xs italic text-gold-deep dark:text-gold-light">(sample)</span>;
}
