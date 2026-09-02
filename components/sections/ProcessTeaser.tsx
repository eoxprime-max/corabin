import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Buttons';

export function ProcessTeaser() {
  const steps = [
    {
      num: "01",
      title: "Discover",
      desc: "Deconstruct business challenges, map user workflows, and establish clear architectural constraints."
    },
    {
      num: "02",
      title: "Design",
      desc: "Architect mathematical design systems, high-fidelity prototypes, and tactile micro-interactions."
    },
    {
      num: "03",
      title: "Build",
      desc: "Engineer resilient, type-safe Next.js codebases optimized for sub-second speeds and accessibility."
    },
    {
      num: "04",
      title: "Automate & Scale",
      desc: "Integrate intelligent LLM pipelines, automated event queues, and continuous growth telemetry."
    }
  ];

  return (
    <section id="process-teaser-section" className="py-24 sm:py-32 bg-[#FCF9F4] text-[#111827] relative border-y border-[#D8CDC0]/60 bg-topo-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-20 gap-6">
          <SectionHeading
            eyebrow="METHODOLOGY"
            title="From idea to"
            highlight="impact."
            subtitle="A disciplined 4-stage execution model designed to eliminate guesswork, mitigate scope drift, and deliver scalable digital platforms."
            theme="light"
          />

          <Link
            href="/process"
            id="view-full-process-link"
            className="group inline-flex items-center gap-2 text-sm font-sans font-semibold text-[#1F3D3A] hover:text-[#C07A5A] transition-colors shrink-0"
          >
            <span>Explore 6-Phase System</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* 4 Steps Progression Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          
          {/* Subtle connecting line across desktop */}
          <div className="hidden lg:block absolute top-7 left-12 right-12 h-[1px] bg-[#1F3D3A]/20 pointer-events-none" />

          {steps.map((step, idx) => (
            <div
              key={step.num}
              id={`process-teaser-step-${step.num}`}
              className="relative flex flex-col p-6 sm:p-8 rounded-2xl bg-white border border-[#D8CDC0]/80 shadow-sm hover:shadow-md hover:border-[#1F3D3A]/40 transition-all duration-300"
            >
              {/* Step Marker */}
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="w-12 h-12 rounded-full bg-[#1F3D3A] text-[#FCF9F4] flex items-center justify-center font-mono text-sm font-semibold shadow-sm">
                  {step.num}
                </div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#1F3D3A]/60">PHASE 0{idx + 1}</span>
              </div>

              {/* Title */}
              <h3 className="font-sans text-xl sm:text-2xl font-medium tracking-tight text-[#111827] mb-3">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-[#1F3D3A]/80 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA bar */}
        <div className="mt-16 pt-8 border-t border-[#D8CDC0]/80 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-sm text-[#1F3D3A]/80">
            Want to see our comprehensive 6-phase engineering lifecycle and delivery artifacts?
          </p>
          <Button
            href="/process"
            variant="outline"
            size="md"
            showArrow
            id="process-teaser-cta"
          >
            Review Complete Process
          </Button>
        </div>
      </div>
    </section>
  );
}
