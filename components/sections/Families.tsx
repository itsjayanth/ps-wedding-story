import type { Version } from '@/content/wedding';

export function Families({ version }: { version: Version }) {
  return <section data-section="families" data-version={version} className="min-h-[50vh]" />;
}
