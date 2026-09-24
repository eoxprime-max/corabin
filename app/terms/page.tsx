import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { siteConfig } from '@/lib/data/site-config';

export const metadata: Metadata = {
  title: 'Terms of Service | Corabin',
  description: 'Corabin studio terms of service and engagement terms.',
};

export default function TermsPage() {
  return (
    <main id="terms-page-root" className="min-h-screen bg-[#080A0B] text-[#FCF9F4] pt-28 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#C07A5A] hover:text-[#FCF9F4] transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Home</span>
        </Link>

        {/* Title */}
        <div className="border-b border-[#E7D9C3]/15 pb-8 mb-12">
          <h1 className="font-sans text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#FCF9F4] mb-4">
            Terms of Service
          </h1>
          <p className="font-mono text-xs text-[#A7B89E]">
            LAST REVISED: MARCH 2025 // CORABIN STUDIO
          </p>
        </div>

        {/* Terms Content */}
        <div className="space-y-8 text-sm sm:text-base text-[#E7D9C3]/80 leading-relaxed font-normal">
          <section className="space-y-3">
            <h2 className="font-sans text-xl font-medium text-[#FCF9F4]">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using this website, you agree to comply with and be bound by these Terms of Service. If you disagree with any portion of these terms, please discontinue using this site.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans text-xl font-medium text-[#FCF9F4]">
              2. Intellectual Property & Brand Assets
            </h2>
            <p>
              All materials on this site &mdash; including the Corabin logo mark, geometric star motif, typography treatments, architectural graphics, editorial case study narratives, and code &mdash; are the intellectual property of Corabin unless otherwise attributed.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans text-xl font-medium text-[#FCF9F4]">
              3. Scope of Client Engagements
            </h2>
            <p>
              Formal creative, engineering, and automation advisory engagements are governed by individual Master Services Agreements (MSA) and Statements of Work (SOW) executed separately between the client and Corabin.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans text-xl font-medium text-[#FCF9F4]">
              4. Disclaimer & Limitations
            </h2>
            <p>
              This website and its content are provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of any kind, whether express or implied.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans text-xl font-medium text-[#FCF9F4]">
              5. Inquiries
            </h2>
            <p>
              For legal inquiries or questions regarding our terms, please contact{' '}
              <a href={`mailto:${siteConfig.contactEmail}`} className="text-[#C07A5A] underline underline-offset-4">
                {siteConfig.contactEmail}
              </a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
