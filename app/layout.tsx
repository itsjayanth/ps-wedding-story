import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Jost, Noto_Serif_Kannada } from 'next/font/google';
import { wedding } from '@/content/wedding';
import './globals.css';

const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['300', '400', '500'], style: ['normal', 'italic'], variable: '--font-cormorant', display: 'swap' });
const jost = Jost({ subsets: ['latin'], weight: ['300', '400'], variable: '--font-jost', display: 'swap' });
const kannada = Noto_Serif_Kannada({ subsets: ['kannada'], weight: ['300', '400'], variable: '--font-kannada', display: 'swap' });

const { site } = wedding;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  robots: { index: false, follow: false, nocache: true },
  openGraph: {
    title: site.title,
    description: site.description,
    url: site.url,
    siteName: 'Prajwal & Supraja',
    type: 'website',
    images: [{ url: site.ogImage, width: 1200, height: 630, alt: 'Prajwal & Supraja wedding invitation' }],
  },
  twitter: { card: 'summary_large_image', title: site.title, description: site.description, images: [site.ogImage] },
  icons: { icon: '/icon.svg' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F8F4E8' },
    { media: '(prefers-color-scheme: dark)', color: '#2A1F14' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable} ${kannada.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
