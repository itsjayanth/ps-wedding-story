/**
 * SINGLE SOURCE OF TRUTH for the whole site.
 * Edit names, dates, venue, media paths and the WhatsApp number here only.
 * Anything marked `// SAMPLE: replace` is placeholder copy.
 */

export type Version = 'friends' | 'family';

export interface MediaRef {
  /** Path under /public, e.g. "/media/hero-1.jpg". Missing files render an elegant placeholder. */
  src: string;
  alt: string;
  /** Caption shown inside the placeholder frame when the file is missing. */
  caption: string;
}

export const wedding = {
  site: {
    title: 'Prajwal & Supraja | Wedding Invitation',
    description: 'With the blessings of our families, we invite you to celebrate the beginning of a beautiful journey.',
    /** Set to your real domain for correct link previews, e.g. https://prajwalsupraja.com */
    url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wedding-prajwal-supraja.vercel.app',
    ogImage: '/og.jpg',
  },

  invocation: '|| Sri Rameshwaraswamy Prasanna ||',

  couple: {
    groom: { name: 'Prajwal M Palegar', short: 'Prajwal' },
    bride: { name: 'Supraja K.S.', short: 'Supraja' },
    // TODO: verify Kannada spellings with the families before publishing.
    kannada: 'ಪ್ರಜ್ವಲ್ ಎಂ. ಮತ್ತು ಸುಪ್ರಜಾ ಕೆ.ಎಸ್.',
    ampersandNames: 'Prajwal & Supraja',
  },

  hero: {
    blessing: 'With the blessings of our families',
    invite: 'invite you to celebrate the beginning of a beautiful journey',
    dates: '21 and 22 November 2026, Mysore',
    scroll: 'Scroll',
  },

  families: {
    heading: 'Two families, becoming one',
    bride: {
      label: 'The bride’s family',
      parents: ['Smt. Suma', 'Sri H.S. Suresh'],
      parentsNote: 'Sr. Head Master', // shown on family version only
      town: 'K.R. Nagara',
      address: '#139, Sri Rama Block, 5th Cross, K.R. Nagara, Mysore Dist.',
      description: 'A home of learning and quiet warmth, rooted in the Mysore countryside.', // SAMPLE: replace
    },
    groom: {
      label: 'The groom’s family',
      parents: ['Smt. Nagarathna K.', 'Sri Manjunathappa M.E.'],
      town: 'Hosakote',
      address: '#107, Nisarga Layout, 7th Phase, Hosakote, Bengaluru Rural',
      description: 'A close, generous family who hold their traditions dear.', // SAMPLE: replace
    },
  },

  beginning: {
    line: 'Six months of getting to know each other. Two families who knew it was right.',
    portraits: [
      { src: '/media/portrait-1.jpg', alt: 'Prajwal and Supraja together', caption: 'Couple portrait' },
      { src: '/media/portrait-2.jpg', alt: 'Prajwal and Supraja smiling', caption: 'Couple portrait' },
    ] as MediaRef[],
  },

  blessings: {
    heading: 'Blessings',
    video: {
      src: '/media/engagement.mp4',
      poster: '/media/engagement-poster.jpg',
      caption: 'Engagement film',
    },
    elders: [
      // SAMPLE: replace
      { quote: 'May your home always be lit with patience, laughter and a quiet kind of love.', by: 'Parents' },
      // SAMPLE: replace
      { quote: 'Two families, one blessing. We could not be happier.', by: 'Elders of the family' },
    ],
    friends: [
      // SAMPLE: replace (friends version only)
      { quote: 'We have never seen Prajwal this calm and this happy.', by: 'A friend of Prajwal' },
      // SAMPLE: replace (friends version only)
      { quote: 'Supraja brings light into every room she enters.', by: 'A friend of Supraja' },
    ],
  },

  celebrations: {
    heading: 'The celebrations',
    printedLine:
      'One moment, Two Hearts, Three knots, Seven steps, A dozen promises and a lifetime of togetherness',
    formalInvitation:
      'We solicit your gracious presence with family and friends on the auspicious occasion of the marriage of our son and daughter.',
    awaiting: {
      label: 'Awaiting your presence',
      names: ['Smt. Nagarathna K. & Sri Manjunathappa M.E.', 'Jayanthi M.'],
    },
    events: [
      {
        id: 'reception',
        title: 'Reception',
        kannada: 'ಆರತಕ್ಷತೆ',
        day: 'Saturday',
        date: '21 November 2026',
        time: '7:00 pm onwards',
        meaning: 'An evening to meet, greet and bless the couple.', // SAMPLE: replace
      },
      {
        id: 'muhurtham',
        title: 'Muhurtham',
        kannada: 'ಮುಹೂರ್ತ',
        day: 'Sunday',
        date: '22 November 2026',
        time: '9:30 am to 10:15 am',
        meaning: 'The sacred hour of three knots and seven steps.', // SAMPLE: replace
      },
    ],
  },

  moments: {
    heading: 'Moments',
    /** Family shows the first 4, friends shows all 8. */
    photos: Array.from({ length: 8 }, (_, i) => ({
      src: `/media/moment-${i + 1}.jpg`,
      alt: `A moment from the engagement, photograph ${i + 1}`,
      caption: `Moment ${i + 1}`,
    })) as MediaRef[],
    counts: { family: 4, friends: 8 },
  },

  venue: {
    heading: 'The venue',
    name: 'Spectra Convention Centre',
    locality: 'Hinkal, Mysore',
    get full() {
      return `${this.name}, ${this.locality}`;
    },
    get mapsUrl() {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(this.full)}`;
    },
    get directionsUrl() {
      return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(this.full)}`;
    },
  },

  rsvp: {
    heading: 'Will you join us?',
    line: 'A single message is all we need.',
    button: 'Confirm on WhatsApp',
    /** Local number. International format is derived below. */
    whatsappLocal: '8660628162',
    countryCode: '91',
    message: "Namaskara! I would love to be part of Prajwal & Supraja's wedding celebrations.",
    get url() {
      return `https://wa.me/${this.countryCode}${this.whatsappLocal}?text=${encodeURIComponent(this.message)}`;
    },
  },

  closing: {
    countdownTarget: '2026-11-22T09:30:00+05:30',
    line: 'Your blessings will make our beginning complete.',
    wishes: 'With best wishes from Relatives & Friends',
    photo: { src: '/media/closing.jpg', alt: 'Prajwal and Supraja', caption: 'Closing portrait' } as MediaRef,
  },

  hero_media: {
    // Slow image sequence slots. Optional looping video: set `video` + `poster`.
    video: { src: '/media/hero.mp4', poster: '/media/hero-poster.jpg' },
    slides: [
      { src: '/media/hero-temple.jpg', alt: 'The family temple', caption: 'Temple' },
      { src: '/media/hero-engagement.jpg', alt: 'The engagement ceremony', caption: 'Engagement' },
      { src: '/media/hero-blessings.jpg', alt: 'Families gathered in blessing', caption: 'Family blessings' },
      { src: '/media/hero-couple.jpg', alt: 'Prajwal and Supraja', caption: 'Couple portrait' },
    ] as MediaRef[],
  },

  music: { src: '/media/music.mp3', label: 'Music' },

  entry: { prompt: 'Enter', caption: 'Please join us' },
} as const;

export type Wedding = typeof wedding;
