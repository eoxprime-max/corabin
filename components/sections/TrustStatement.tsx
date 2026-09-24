import React from 'react';
import { StarMotif } from '@/components/ui/StarMotif';

export function TrustStatement() {
  return (
    <section id="trust-statement-section" className="py-20 sm:py-28 bg-[#FCF9F4] text-[#111827] relative border-y border-[#D8CDC0]/60 bg-topo-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-baseline">
          
          {/* Eyebrow Column (4 cols) */}
          <div className="lg:col-span-4 flex items-center gap-2.5">
            <StarMotif size={14} color="#1F3D3A" />
            <span className="text-xs font-mono uppercase tracking-[0.24em] font-semibold text-[#1F3D3A]/80">
              CORE PHILOSOPHY
            </span>
          </div>

          {/* Large Editorial Statement (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <h2 className="font-sans text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-[#111827] leading-[1.2]">
              Technology should feel <span className="font-serif italic font-normal text-[#C07A5A]">effortless.</span>
            </h2>

            <p className="text-base sm:text-lg md:text-xl text-[#1F3D3A]/85 font-normal leading-relaxed max-w-3xl">
              We combine strategic clarity, deliberate design systems, full-stack engineering, and intelligent AI automation into unified digital products. Systems that are easier to use, easier to scale, and built to keep evolving over time.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-[#1F3D3A]/70 font-mono">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C07A5A]" />
                Zero bloated templates
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1F3D3A]" />
                Full-stack type safety
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A7B89E]" />
                Automated operational leverage
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
