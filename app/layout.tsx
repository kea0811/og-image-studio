import type { Metadata, Viewport } from 'next';
import './globals.css';

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
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
