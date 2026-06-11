import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'OG Image Studio — design Open Graph images in your browser',
  description:
    'A visual editor for Open Graph / social-share images. Add text, gradients and image backgrounds, then export a pixel-perfect PNG — no design tool required.',
  keywords: [
    'open graph',
    'og image',
    'social card',
    'meta image',
    'image editor',
    'png export',
  ],
  authors: [{ name: 'kea0811' }],
  openGraph: {
    title: 'OG Image Studio',
    description: 'Design Open Graph images in your browser and export them as PNG.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a12',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
