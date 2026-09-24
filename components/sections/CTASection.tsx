import React from 'react';
import { Button } from '@/components/ui/Buttons';
import { StarMotif } from '@/components/ui/StarMotif';
import { siteConfig } from '@/lib/data/site-config';

export function CTASection() {
  return (
    <section id="global-cta-section" className="py-24 sm:py-32 bg-[#080A0B] text-[#FCF9F4] relative overflow-hidden border-t border-[#E7D9C3]/15 bg-topo-dark">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#1F3D3A]/40 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-[#C07A5A]/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
        
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111827] border border-[#E7D9C3]/15 mb-6">
          <StarMotif size={12} color="#C07A5A" />
          <span className="text-xs uppercase tracking-[0.24em] font-medium text-[#E7D9C3]/90">
            START THE CONVERSATION
          </span>
        </div>

        {/* Headline */}
        <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-[#FCF9F4] leading-[1.12] mb-6 max-w-3xl">
          Have an idea worth{" "}
          <span className="font-serif italic font-normal text-[#C07A5A]">
            building?
          </span>
        </h2>

        {/* Supporting Copy */}
        <p className="text-base sm:text-lg md:text-xl text-[#E7D9C3]/80 font-normal leading-relaxed max-w-2xl mb-10">
          Tell us what you&apos;re trying to build, automate, or improve. We&apos;ll help you clarify the architecture, shape the roadmap, and execute with precision.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto justify-center mb-12">
          <Button
            href="/contact"
            variant="terracotta"
            size="lg"
            showArrow
            id="cta-start-project-btn"
          >
            Start a Project
          </Button>

          <Button
            href={`mailto:${siteConfig.contactEmail}`}
            variant="secondary"
            size="lg"
            showArrow
            arrowType="up-right"
            id="cta-email-btn"
          >
            Email Studio Direct
          </Button>
        </div>

        {/* Bottom studio status card */}
        <div className="inline-flex items-center gap-4 text-xs font-mono text-[#E7D9C3]/60 bg-[#111827]/60 border border-[#E7D9C3]/15 px-5 py-2.5 rounded-full backdrop-blur-md">
          <span className="flex items-center gap-1.5 text-[#A7B89E]">
            <span className="w-2 h-2 rounded-full bg-[#C07A5A] animate-pulse" />
            {siteConfig.status}
          </span>
          <span className="text-[#E7D9C3]/30">•</span>
          <span className="text-[#E7D9C3]/80">Average response within 24 hours</span>
        </div>
      </div>
    </section>
  );
}
