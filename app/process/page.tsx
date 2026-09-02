import React from 'react';
import type { Metadata } from 'next';
import { ProcessTimelineView } from '@/components/process/ProcessTimelineView';
import { CTASection } from '@/components/sections/CTASection';

export const metadata: Metadata = {
  title: 'Process & Lifecycle — NovaStack Creative Technology Studio',
  description: 'Our disciplined 6-phase engineering lifecycle: Discover, Define, Design, Build, Automate, and Evolve.',
};

export default function ProcessPage() {
  return (
    <main id="process-page-root" className="min-h-screen bg-[#080A0B] text-[#FCF9F4] pt-28">
      
      {/* Header */}
      <section className="py-16 sm:py-24 border-b border-[#E7D9C3]/15 bg-topo-dark relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111827] border border-[#E7D9C3]/15 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#C07A5A] animate-pulse" />
              <span className="text-xs uppercase tracking-[0.24em] font-medium text-[#E7D9C3]/90">
                METHODOLOGY & LIFECYCLE
              </span>
            </div>

            <h1 className="font-sans text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-[#FCF9F4] leading-[1.08] mb-6">
              How we work &mdash;{" "}
              <span className="font-serif italic text-[#C07A5A] font-normal">
                from blank slate to scale.
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-[#E7D9C3]/80 leading-relaxed max-w-2xl">
              A structured, transparent 6-phase process engineered to de-risk complex requirements, ensure architectural integrity, and deliver systems built to outlast immediate trend cycles.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Timeline & Deliverables */}
      <section className="py-20 sm:py-28 bg-[#0D1112]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProcessTimelineView />
        </div>
      </section>

      {/* Global CTA */}
      <CTASection />
    </main>
  );
}
