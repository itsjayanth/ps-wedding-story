import type { Version } from '@/content/wedding';

export function Moments({ version }: { version: Version }) {
  return <section data-section="moments" data-version={version} className="min-h-[50vh]" />;
}
