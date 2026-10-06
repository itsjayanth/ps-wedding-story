import type { Version } from '@/content/wedding';

export function Closing({ version }: { version: Version }) {
  return <section data-section="closing" data-version={version} className="min-h-[50vh]" />;
}
