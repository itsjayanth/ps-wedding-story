import type { Version } from '@/content/wedding';
import { EntryGate } from './EntryGate';
import { Hero } from './Hero';
import { MusicToggle } from './MusicToggle';
import { ThreadLayer } from './ThreadLayer';
import { Beginning } from './sections/Beginning';
import { Blessings } from './sections/Blessings';
import { Celebrations } from './sections/Celebrations';
import { Closing } from './sections/Closing';
import { Families } from './sections/Families';
import { Moments } from './sections/Moments';
import { Rsvp } from './sections/Rsvp';
import { Venue } from './sections/Venue';

/** One design, one content file. `version` toggles only the differences described in the brief. */
export function Invitation({ version }: { version: Version }) {
  return (
    <EntryGate>
      <MusicToggle />
      <main>
        <Hero />
        <ThreadLayer>
          <Families version={version} />
          <Beginning />
          <Blessings version={version} />
          <Celebrations version={version} />
          <Moments version={version} />
          <Venue />
          <Rsvp />
          <Closing version={version} />
        </ThreadLayer>
      </main>
    </EntryGate>
  );
}
