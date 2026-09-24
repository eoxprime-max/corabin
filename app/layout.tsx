import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import { SiteHeader } from '@/components/navigation/SiteHeader';
import { SiteFooter } from '@/components/footer/SiteFooter';

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://corabin.com'),
  title: 'Corabin',
  description: 'Corabin is a boutique creative technology agency blending thoughtful UI/UX design, robust modern engineering, and intelligent AI automation workflows.',
  keywords: ['Digital Agency', 'UI/UX Design', 'Next.js Development', 'AI Automation', 'Design Systems', 'Creative Technology Studio'],
  authors: [{ name: 'Corabin' }],
  icons: {
    icon: [
      { url: '/images/corabin-logo-white.png', type: 'image/png' },
      { url: '/favicon.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: [
      { url: '/images/corabin-logo-white.png', type: 'image/png' },
      { url: '/apple-touch-icon.png', type: 'image/png' },
    ],
    shortcut: '/images/corabin-logo-white.png',
  },
  openGraph: {
    title: 'Corabin',
    description: 'A premium creative technology agency combining UI/UX design, modern engineering, automation, and AI workflows.',
    type: 'website',
    siteName: 'Corabin',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Corabin',
    description: 'A premium creative technology agency combining UI/UX design, modern engineering, automation, and AI workflows.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} dark`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/corabin-logo-white.png" type="image/png" />
        <link rel="shortcut icon" href="/images/corabin-logo-white.png" type="image/png" />
        <link rel="apple-touch-icon" href="/images/corabin-logo-white.png" />
      </head>
      <body className="min-h-screen bg-[#080A0B] text-[#FCF9F4] font-sans antialiased selection:bg-[#C07A5A] selection:text-[#FCF9F4]">
        <SiteHeader />
        <div className="flex flex-col min-h-screen">
          <div className="grow">
            {children}
          </div>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
