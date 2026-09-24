import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { siteConfig } from '@/lib/data/site-config';

export const metadata: Metadata = {
  title: 'Privacy Policy | Corabin',
  description: 'Corabin privacy policy and data governance practices.',
};

export default function PrivacyPage() {
  return (
    <main id="privacy-page-root" className="min-h-screen bg-[#080A0B] text-[#FCF9F4] pt-28 pb-24">
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
            Privacy Policy
          </h1>
          <p className="font-mono text-xs text-[#A7B89E]">
            LAST REVISED: MARCH 2025 // CORABIN STUDIO
          </p>
        </div>

        {/* Legal Editorial Content */}
        <div className="space-y-8 text-sm sm:text-base text-[#E7D9C3]/80 leading-relaxed font-normal">
          <section className="space-y-3">
            <h2 className="font-sans text-xl font-medium text-[#FCF9F4]">
              1. Overview & Commitment
            </h2>
            <p>
              Corabin (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;the Studio&rdquo;) respects your privacy. We collect minimal personal information necessary to correspond regarding client project inquiries, provide digital design and engineering services, and maintain our web property.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans text-xl font-medium text-[#FCF9F4]">
              2. Information We Collect
            </h2>
            <p>
              When you submit an inquiry through our contact form or contact us via email, we collect your name, email address, company name (if provided), project parameters, and message content. We do not sell, rent, or trade your personal information to any third parties for advertising or marketing.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans text-xl font-medium text-[#FCF9F4]">
              3. Telemetry & Analytics
            </h2>
            <p>
              We prioritize privacy-preserving, cookie-less infrastructure diagnostics. We do not deploy invasive cross-site tracking pixels or third-party behavioral advertising scripts.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans text-xl font-medium text-[#FCF9F4]">
              4. Client Confidentiality & NDAs
            </h2>
            <p>
              All proprietary business logic, architectural designs, workflow descriptions, and intellectual property shared with Corabin during consultations are treated under strict confidentiality standards. We routinely execute mutual Non-Disclosure Agreements (NDAs) prior to in-depth technical evaluations.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans text-xl font-medium text-[#FCF9F4]">
              5. Contacting the Studio
            </h2>
            <p>
              If you have any questions regarding our data privacy practices or wish to request the deletion of any communications, please email us directly at{' '}
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
