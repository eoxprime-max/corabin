import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle2, ChevronRight } from 'lucide-react';
import { ServiceItem } from '@/lib/data/site-config';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button, PillTag } from '@/components/ui/Buttons';
import { PillarIcons, StarMotif } from '@/components/ui/StarMotif';
import { CTASection } from '@/components/sections/CTASection';

interface ServiceDetailViewProps {
  service: ServiceItem;
}

export function ServiceDetailView({ service }: ServiceDetailViewProps) {
  return (
    <main id={`service-detail-${service.slug}`} className="min-h-screen bg-[#080A0B] text-[#FCF9F4] pt-28">
      
      {/* 01: Hero Section */}
      <section className="py-16 sm:py-24 border-b border-[#E7D9C3]/15 relative overflow-hidden bg-topo-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-mono text-[#E7D9C3]/60 mb-8">
            <Link href="/" className="hover:text-[#FCF9F4] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/services" className="hover:text-[#FCF9F4] transition-colors">Services</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#C07A5A]">{service.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111827] border border-[#E7D9C3]/15 mb-6">
                <span className="font-mono text-xs text-[#C07A5A]">{service.number}</span>
                <span className="text-xs uppercase tracking-[0.2em] font-medium text-[#E7D9C3]/90">
                  DISCIPLINE // CORE SERVICE
                </span>
              </div>

              <h1 className="font-sans text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-[#FCF9F4] leading-[1.1] mb-6">
                {service.title} &mdash;
                <br />
                <span className="font-serif italic text-[#C07A5A] font-normal">
                  {service.tagline}
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-[#E7D9C3]/80 leading-relaxed max-w-2xl mb-8">
                {service.summary}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Button
                  href="/contact"
                  variant="terracotta"
                  size="md"
                  showArrow
                  id={`service-${service.slug}-start-cta`}
                >
                  Inquire About {service.title}
                </Button>

                <Button
                  href="/work"
                  variant="secondary"
                  size="md"
                  showArrow
                  arrowType="right"
                  id={`service-${service.slug}-view-work-cta`}
                >
                  View Related Work
                </Button>
              </div>
            </div>

            {/* Right: Architectural Icon Frame */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="w-full max-w-[340px] aspect-square rounded-3xl bg-[#111827] border border-[#E7D9C3]/20 p-8 flex flex-col justify-between shadow-2xl relative">
                <div className="flex items-center justify-between text-xs font-mono text-[#E7D9C3]/50">
                  <span>DISCIPLINE_0{service.number}</span>
                  <span className="text-[#A7B89E]">CERTIFIED_STACK</span>
                </div>

                <div className="flex justify-center my-auto">
                  <div className="w-24 h-24 rounded-2xl bg-[#080A0B] border border-[#E7D9C3]/20 flex items-center justify-center shadow-inner">
                    <PillarIcons
                      type={service.iconType}
                      className="w-12 h-12"
                      color="#C07A5A"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E7D9C3]/10 flex items-center justify-between text-xs text-[#E7D9C3]/80">
                  <span>Production Ready</span>
                  <span className="font-mono text-[#C07A5A]">EST. 2024</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 02: The Problem vs. The NovaStack Approach */}
      <section className="py-20 sm:py-28 bg-[#FCF9F4] text-[#111827] border-b border-[#D8CDC0]/80 bg-topo-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            
            {/* The Industry Problem */}
            <div className="p-8 sm:p-10 rounded-2xl bg-white border border-[#D8CDC0] shadow-sm">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#9C5A3E] font-semibold mb-4">
                <span className="w-2 h-2 rounded-full bg-[#C07A5A]" />
                THE FRICTION POINT
              </div>
              <h2 className="font-sans text-2xl sm:text-3xl font-medium tracking-tight text-[#111827] mb-4">
                The common challenge
              </h2>
              <p className="text-base text-[#1F3D3A]/85 leading-relaxed">
                {service.problem}
              </p>
            </div>

            {/* The NovaStack Approach */}
            <div className="p-8 sm:p-10 rounded-2xl bg-[#142B29] text-[#FCF9F4] border border-[#1F3D3A] shadow-md">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#A7B89E] font-semibold mb-4">
                <StarMotif size={12} color="#C07A5A" />
                THE NOVASTACK STANDARD
              </div>
              <h2 className="font-sans text-2xl sm:text-3xl font-medium tracking-tight text-[#FCF9F4] mb-4">
                How we solve it
              </h2>
              <p className="text-base text-[#E7D9C3]/85 leading-relaxed">
                {service.approach}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 03: Key Capabilities & Deliverables */}
      <section className="py-24 sm:py-32 bg-[#0D1112] text-[#FCF9F4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-16 sm:mb-20">
            <SectionHeading
              eyebrow="SCOPE & CAPABILITIES"
              title="What we"
              highlight="deliver."
              subtitle="Every deliverable is crafted to the highest standard of technical rigor, architectural maintainability, and visual distinction."
            />
          </div>

          {/* Capabilities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {service.capabilities.map((cap, idx) => (
              <div
                key={cap.title}
                className="p-8 rounded-2xl bg-[#111827]/80 border border-[#E7D9C3]/15 hover:border-[#C07A5A]/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs text-[#C07A5A]">0{idx + 1} &mdash; CAPABILITY</span>
                  <StarMotif size={12} color="#A7B89E" />
                </div>
                <h3 className="font-sans text-xl font-medium text-[#FCF9F4] mb-3">
                  {cap.title}
                </h3>
                <p className="text-sm text-[#E7D9C3]/75 leading-relaxed">
                  {cap.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Tangible Deliverables Checklist */}
          <div className="p-8 sm:p-12 rounded-3xl bg-[#142B29]/60 border border-[#E7D9C3]/15">
            <h3 className="font-sans text-xl sm:text-2xl font-medium text-[#FCF9F4] mb-8 flex items-center gap-3">
              <span className="text-[#C07A5A]">✦</span>
              <span>Tangible Deliverables Checklist</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {service.deliverables.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-4 rounded-xl bg-[#080A0B]/50 border border-[#E7D9C3]/10 text-xs sm:text-sm text-[#E7D9C3]/90"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#A7B89E] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 04: Process for this service */}
      <section className="py-20 sm:py-28 bg-[#080A0B] border-t border-[#E7D9C3]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-16">
            <SectionHeading
              eyebrow="EXECUTION ROADMAP"
              title="Phased"
              highlight="workflow."
              subtitle={`How we execute ${service.title} engagements from initial audit to production validation.`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {service.processSteps.map((step) => (
              <div
                key={step.step}
                className="p-6 rounded-2xl bg-[#111827]/60 border border-[#E7D9C3]/15"
              >
                <div className="w-10 h-10 rounded-full bg-[#1F3D3A] text-[#FCF9F4] font-mono text-xs flex items-center justify-center font-bold mb-4">
                  {step.step}
                </div>
                <h4 className="font-sans text-lg font-medium text-[#FCF9F4] mb-2">
                  {step.title}
                </h4>
                <p className="text-xs sm:text-sm text-[#E7D9C3]/75 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 05: Frequently Asked Questions */}
      <section className="py-20 sm:py-28 bg-[#FCF9F4] text-[#111827] border-t border-[#D8CDC0]/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <SectionHeading
            eyebrow="FREQUENTLY ASKED"
            title="Questions about"
            highlight={service.title}
            theme="light"
            className="mb-12"
          />

          <div className="space-y-6">
            {service.faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-2xl bg-white border border-[#D8CDC0] shadow-sm"
              >
                <h4 className="font-sans text-lg sm:text-xl font-medium text-[#111827] mb-3">
                  {faq.question}
                </h4>
                <p className="text-sm sm:text-base text-[#1F3D3A]/85 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 06: Global CTA */}
      <CTASection />
    </main>
  );
}
