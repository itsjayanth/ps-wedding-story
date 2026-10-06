import type { Version } from '@/content/wedding';

export function Celebrations({ version }: { version: Version }) {
  return <section data-section="celebrations" data-version={version} className="min-h-[50vh]" />;
}
