import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';
import { servicesData } from '@/lib/data/site-config';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PillarIcons } from '@/components/ui/StarMotif';
import { Button } from '@/components/ui/Buttons';
import { CTASection } from '@/components/sections/CTASection';

export const metadata: Metadata = {
  title: 'Services | Corabin',
  description: 'Explore Corabin capabilities across UI/UX Design, Next.js Development, and AI Automation Workflows.',
};

export default function ServicesPage() {
  return (
    <main id="services-page-root" className="min-h-screen bg-[#080A0B] text-[#FCF9F4] pt-28">
      
      {/* Services Hero Header */}
      <section className="py-16 sm:py-24 border-b border-[#E7D9C3]/15 bg-topo-dark relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111827] border border-[#E7D9C3]/15 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#C07A5A] animate-pulse" />
              <span className="text-xs uppercase tracking-[0.24em] font-medium text-[#E7D9C3]/90">
                CAPABILITIES & DISCIPLINES
              </span>
            </div>

            <h1 className="font-sans text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-[#FCF9F4] leading-[1.08] mb-6">
              Design the experience. Build the system.{" "}
              <span className="font-serif italic text-[#C07A5A] font-normal">
                Automate the work.
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-[#E7D9C3]/80 leading-relaxed max-w-2xl">
              We operate at the exact intersection of craft and engineering. We turn complex domain logic into effortless interfaces, resilient production code, and automated operational leverage.
            </p>
          </div>
        </div>
      </section>

      {/* 3 Pillars Deep Editorial Grid */}
      <section className="py-20 sm:py-28 bg-[#0D1112]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {servicesData.map((service, idx) => (
              <div
                key={service.id}
                id={`service-pillar-${service.id}`}
                className="p-8 sm:p-12 lg:p-16 rounded-3xl bg-[#111827]/70 border border-[#E7D9C3]/15 hover:border-[#C07A5A]/50 transition-all duration-300 shadow-2xl"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
                  
                  {/* Left Column: Number, Title, Tagline, Summary (7 cols) */}
                  <div className="lg:col-span-7 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 text-xs font-mono text-[#C07A5A] mb-4">
                        <span>{service.number}</span>
                        <span className="text-[#E7D9C3]/30">/</span>
                        <span className="uppercase tracking-widest text-[#E7D9C3]/70">DISCIPLINE</span>
                      </div>

                      <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#FCF9F4] mb-3">
                        {service.title}
                      </h2>

                      <p className="font-serif italic text-lg sm:text-xl text-[#C07A5A] mb-6">
                        {service.tagline}
                      </p>

                      <p className="text-sm sm:text-base text-[#E7D9C3]/80 leading-relaxed mb-8">
                        {service.summary}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[#E7D9C3]/10">
                      <Button
                        href={`/services/${service.slug}`}
                        variant="terracotta"
                        size="md"
                        showArrow
                        id={`explore-service-${service.slug}-btn`}
                      >
                        Explore {service.title}
                      </Button>

                      <Button
                        href="/contact"
                        variant="secondary"
                        size="md"
                        id={`inquire-service-${service.slug}-btn`}
                      >
                        Inquire About Scope
                      </Button>
                    </div>
                  </div>

                  {/* Right Column: Key Deliverables Checklist (5 cols) */}
                  <div className="lg:col-span-5 bg-[#080A0B]/60 p-6 sm:p-8 rounded-2xl border border-[#E7D9C3]/10">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-xs font-mono uppercase tracking-widest text-[#A7B89E]">CORE DELIVERABLES</span>
                      <PillarIcons type={service.iconType} className="w-5 h-5" color="#C07A5A" />
                    </div>

                    <ul className="space-y-3 text-xs sm:text-sm text-[#E7D9C3]/80 mb-6">
                      {service.deliverables.slice(0, 5).map((del, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C07A5A] shrink-0 mt-1.5" />
                          <span>{del}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#C07A5A] hover:text-[#FCF9F4] transition-colors"
                    >
                      <span>View full capability breakdown ({service.deliverables.length} items)</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global CTA */}
      <CTASection />
    </main>
  );
}
