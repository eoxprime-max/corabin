import React from 'react';
import { StarMotif } from '@/components/ui/StarMotif';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function WhyNovaStack() {
  const pillars = [
    {
      title: "Strategy",
      tagline: "Clarity before execution",
      desc: "We diagnose architectural constraints, validate user jobs, and craft lean technical specifications that prevent costly re-platforming."
    },
    {
      title: "Design",
      tagline: "High-contrast editorial craft",
      desc: "We design tactile interfaces, modular token hierarchies, and ergonomic interaction models that make complex workflows feel effortless."
    },
    {
      title: "Engineering",
      tagline: "Sub-second resilient code",
      desc: "Full-stack TypeScript and Next.js applications engineered with server components, zero bloat, and strict accessibility standards."
    },
    {
      title: "Automation",
      tagline: "Leverage through intelligence",
      desc: "Connecting AI-powered document extraction, webhook queues, and automated operational pipelines that compound team leverage."
    }
  ];

  return (
    <section id="why-novastack-section" className="py-24 sm:py-32 bg-[#0D1112] text-[#FCF9F4] relative overflow-hidden bg-topo-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <SectionHeading
            eyebrow="INTEGRATED MODEL"
            title="One partner."
            highlight="Four capabilities."
            subtitle="Traditional agencies hand off designs to external vendors or build systems that can't scale. Corabin bridges design, engineering, and automation into a single cohesive delivery team."
          />
        </div>

        {/* 4 Pillars Horizontal/Grid Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => (
            <div
              key={pillar.title}
              id={`why-pillar-${pillar.title.toLowerCase()}`}
              className="p-8 rounded-2xl bg-[#111827]/80 border border-[#E7D9C3]/15 hover:border-[#C07A5A]/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-xs text-[#C07A5A]">0{idx + 1} &mdash; MODEL</span>
                  <StarMotif size={12} color="#A7B89E" />
                </div>

                <h3 className="font-sans text-2xl font-medium tracking-tight text-[#FCF9F4] mb-1">
                  {pillar.title}
                </h3>

                <p className="text-xs font-mono uppercase tracking-wider text-[#A7B89E] mb-4">
                  {pillar.tagline}
                </p>

                <p className="text-sm text-[#E7D9C3]/75 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-[#E7D9C3]/10 text-[11px] font-mono text-[#E7D9C3]/40">
                INTEGRATED_DISCIPLINE
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
