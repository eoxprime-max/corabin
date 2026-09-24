import React from 'react';
import type { Metadata } from 'next';
import { studioPrinciples, siteConfig } from '@/lib/data/site-config';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { StarMotif } from '@/components/ui/StarMotif';
import { CTASection } from '@/components/sections/CTASection';

export const metadata: Metadata = {
  title: 'About | Corabin',
  description: 'A small studio mindset with a systems approach. Discover the design philosophy, engineering principles, and visual DNA behind Corabin.',
};

export default function AboutPage() {
  return (
    <main id="about-page-root" className="min-h-screen bg-[#080A0B] text-[#FCF9F4] pt-28">
      
      {/* 01: Hero Header */}
      <section className="py-16 sm:py-24 border-b border-[#E7D9C3]/15 bg-topo-dark relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111827] border border-[#E7D9C3]/15 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#C07A5A] animate-pulse" />
              <span className="text-xs uppercase tracking-[0.24em] font-medium text-[#E7D9C3]/90">
                STUDIO IDENTITY & MANIFESTO
              </span>
            </div>

            <h1 className="font-sans text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-[#FCF9F4] leading-[1.08] mb-6">
              A boutique studio mindset with a{" "}
              <span className="font-serif italic text-[#C07A5A] font-normal">
                systems approach.
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-[#E7D9C3]/80 leading-relaxed max-w-3xl">
              Corabin was founded on a simple conviction: the best digital products are not built by throwing mockups over the wall to disconnected developers. They are architected by a tight-knit team fluent in visual craft, resilient engineering, and intelligent automation.
            </p>
          </div>
        </div>
      </section>

      {/* 02: The Studio Story & Creative North Star */}
      <section className="py-20 sm:py-28 bg-[#FCF9F4] text-[#111827] border-b border-[#D8CDC0]/80 bg-topo-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Statement */}
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 mb-4">
                <StarMotif size={14} color="#1F3D3A" />
                <span className="text-xs font-mono uppercase tracking-[0.22em] text-[#1F3D3A] font-semibold">
                  THE ARCHITECTURAL BRIDGE
                </span>
              </div>

              <h2 className="font-sans text-3xl sm:text-4xl font-light tracking-tight text-[#111827] leading-[1.2] mb-6">
                An architectural studio for{" "}
                <span className="font-serif italic text-[#C07A5A]">digital systems.</span>
              </h2>

              <div className="w-16 h-[2px] bg-[#C07A5A] mb-6" />

              <p className="text-base text-[#1F3D3A]/85 leading-relaxed">
                Just as physical architects balance structural engineering with tactile materiality and environmental harmony, we build digital platforms where typography, database schemas, API speed, and automated workflows reinforce one another.
              </p>
            </div>

            {/* Right Narrative */}
            <div className="lg:col-span-7 space-y-6 text-base sm:text-lg text-[#1F3D3A]/85 font-normal leading-relaxed">
              <p>
                In a digital landscape flooded with generic AI boilerplate and template marketplaces, intentional design has never been more valuable. We believe that true luxury in technology is simplicity, sub-second responsiveness, and frictionless usability.
              </p>
              <p>
                We do not maintain sprawling bureaucratic account management layers. When you partner with Corabin, you collaborate directly with the senior designers, engineers, and automation architects who write the code and shape every pixel.
              </p>
              
              <div className="pt-6 border-t border-[#D8CDC0] grid grid-cols-2 sm:grid-cols-3 gap-6 font-mono text-xs text-[#1F3D3A]">
                <div>
                  <span className="text-[#C07A5A] font-bold block text-sm">ZERO NOISE</span>
                  <span>Direct senior partner involvement</span>
                </div>
                <div>
                  <span className="text-[#1F3D3A] font-bold block text-sm">FULL STACK</span>
                  <span>Design + Next.js + AI Automation</span>
                </div>
                <div>
                  <span className="text-[#A7B89E] font-bold block text-sm">MODULAR</span>
                  <span>Long-term code maintainability</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03: The 5 Studio Principles */}
      <section className="py-24 sm:py-32 bg-[#0D1112] text-[#FCF9F4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-16 sm:mb-20">
            <SectionHeading
              eyebrow="CORE BELIEFS"
              title="Guiding"
              highlight="principles."
              subtitle="The non-negotiable standards that govern how we design interfaces, structure codebases, and collaborate with founders."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {studioPrinciples.map((prin) => (
              <div
                key={prin.number}
                className="p-8 sm:p-10 rounded-2xl bg-[#111827]/80 border border-[#E7D9C3]/15 hover:border-[#C07A5A]/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs text-[#C07A5A]">{prin.number} &mdash; STANDARD</span>
                    <StarMotif size={12} color="#A7B89E" />
                  </div>

                  <h3 className="font-sans text-2xl font-medium text-[#FCF9F4] mb-3">
                    {prin.title}
                  </h3>

                  <p className="text-sm text-[#E7D9C3]/75 leading-relaxed">
                    {prin.desc}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-[#E7D9C3]/10 text-[11px] font-mono text-[#E7D9C3]/40">
                  CORABIN_STANDARD
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 04: Brand Visual DNA & Palette Story */}
      <section className="py-20 sm:py-28 bg-[#142B29] text-[#FCF9F4] border-t border-[#E7D9C3]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-16">
            <div className="inline-flex items-center gap-2 mb-3">
              <StarMotif size={12} color="#C07A5A" />
              <span className="text-xs uppercase tracking-[0.24em] font-medium text-[#E7D9C3]/80">
                MATERIAL LANGUAGE
              </span>
            </div>
            <h2 className="font-sans text-3xl sm:text-4xl font-light tracking-tight text-[#FCF9F4]">
              The visual DNA of{" "}
              <span className="font-serif italic text-[#C07A5A] font-normal">Corabin.</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="p-6 rounded-2xl bg-[#1F3D3A] border border-[#E7D9C3]/20 flex flex-col justify-between aspect-square">
              <span className="font-mono text-xs text-[#A7B89E]">#1F3D3A</span>
              <div>
                <span className="font-sans text-base font-semibold block text-[#FCF9F4]">Deep Forest</span>
                <span className="text-xs text-[#E7D9C3]/70">Stability, Growth, Groundedness</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#A7B89E] text-[#111827] border border-[#FCF9F4]/20 flex flex-col justify-between aspect-square">
              <span className="font-mono text-xs text-[#1F3D3A]">#A7B89E</span>
              <div>
                <span className="font-sans text-base font-semibold block text-[#111827]">Sage Mist</span>
                <span className="text-xs text-[#1F3D3A]/80">Balance, Calm, Clarity</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#E7D9C3] text-[#111827] border border-[#FCF9F4]/20 flex flex-col justify-between aspect-square">
              <span className="font-mono text-xs text-[#1F3D3A]">#E7D9C3</span>
              <div>
                <span className="font-sans text-base font-semibold block text-[#111827]">Sand Dune</span>
                <span className="text-xs text-[#1F3D3A]/80">Warmth, Trust, Approachability</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#C07A5A] text-[#FCF9F4] border border-[#FCF9F4]/20 flex flex-col justify-between aspect-square">
              <span className="font-mono text-xs text-[#FCF9F4]/80">#C07A5A</span>
              <div>
                <span className="font-sans text-base font-semibold block text-[#FCF9F4]">Terracotta</span>
                <span className="text-xs text-[#FCF9F4]/80">Energy, Passion, Creativity</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#111827] border border-[#E7D9C3]/20 flex flex-col justify-between aspect-square">
              <span className="font-mono text-xs text-[#C07A5A]">#111827</span>
              <div>
                <span className="font-sans text-base font-semibold block text-[#FCF9F4]">Midnight</span>
                <span className="text-xs text-[#E7D9C3]/70">Sophistication, Depth, Modernity</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global CTA */}
      <CTASection />
    </main>
  );
}
