import type { Version } from '@/content/wedding';

export function Blessings({ version }: { version: Version }) {
  return <section data-section="blessings" data-version={version} className="min-h-[50vh]" />;
}
