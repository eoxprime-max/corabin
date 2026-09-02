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
  title: 'NovaStack — Design. Develop. Automate. Scale.',
  description: 'NovaStack is a boutique creative technology agency blending thoughtful UI/UX design, robust modern engineering, and intelligent AI automation workflows.',
  keywords: ['Digital Agency', 'UI/UX Design', 'Next.js Development', 'AI Automation', 'Design Systems', 'Creative Technology Studio'],
  authors: [{ name: 'NovaStack' }],
  openGraph: {
    title: 'NovaStack — Design. Develop. Automate. Scale.',
    description: 'A premium creative technology agency combining UI/UX design, modern engineering, automation, and AI workflows.',
    type: 'website',
    siteName: 'NovaStack',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NovaStack — Design. Develop. Automate. Scale.',
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
