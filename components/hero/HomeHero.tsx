'use client';

import React from 'react';
import { Button } from '@/components/ui/Buttons';
import { StarMotif } from '@/components/ui/StarMotif';
import { LogoMark } from '@/components/ui/Logo';

export function HomeHero() {
  return (
    <section
      id="home-hero"
      className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 sm:pb-24 overflow-hidden bg-[#080A0B] bg-topo-dark"
    >
      {/* Background Subtle Gradient Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#1F3D3A]/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-[#C07A5A]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Headline & Copy (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Agency Status Eyebrow */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#111827] border border-[#E7D9C3]/15 backdrop-blur-md mb-6 sm:mb-8">
              <span className="w-2 h-2 rounded-full bg-[#C07A5A] animate-pulse" />
              <span className="text-xs uppercase tracking-[0.2em] font-medium text-[#E7D9C3]/90">
                Creative Technology Agency
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-sans text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-[#FCF9F4] leading-[1.08] mb-6">
              We design. We build.
              <br />
              <span className="font-serif italic font-normal text-[#C07A5A] inline-flex items-center gap-3">
                We automate growth.
                <StarMotif size={24} color="#C07A5A" className="hidden sm:inline-block animate-pulse" />
              </span>
            </h1>

            {/* Subtle Divider Line under Headline */}
            <div className="w-16 h-[2px] bg-[#C07A5A] mb-6 sm:mb-8" />

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg md:text-xl text-[#E7D9C3]/80 font-normal leading-relaxed max-w-xl mb-8 sm:mb-10">
              Corabin is a creative technology agency blending human-centered UI/UX design, robust modern engineering, and intelligent AI workflows to help ambitious businesses move faster.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <Button
                href="/contact"
                variant="terracotta"
                size="lg"
                showArrow
                id="hero-primary-cta"
              >
                Start a Project
              </Button>

              <Button
                href="/work"
                variant="secondary"
                size="lg"
                showArrow
                arrowType="right"
                id="hero-secondary-cta"
              >
                Explore Our Work
              </Button>
            </div>

            {/* Micro proof: capabilities pill row */}
            <div className="mt-12 pt-8 border-t border-[#E7D9C3]/10 w-full flex flex-wrap items-center gap-y-3 gap-x-6 text-xs text-[#E7D9C3]/65">
              <span className="uppercase tracking-widest text-[#C07A5A] font-semibold">CAPABILITIES:</span>
              <span className="hover:text-[#FCF9F4] transition-colors">Product Design</span>
              <span className="text-[#E7D9C3]/20">•</span>
              <span className="hover:text-[#FCF9F4] transition-colors">Next.js Engineering</span>
              <span className="text-[#E7D9C3]/20">•</span>
              <span className="hover:text-[#FCF9F4] transition-colors">AI & Process Automation</span>
            </div>
          </div>

          {/* Right Column: Architectural Still Life Graphic (5 cols) */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            
            {/* Visual Frame */}
            <div className="relative w-full max-w-[480px] aspect-4/5 rounded-2xl overflow-hidden bg-[#0D1112] border border-[#E7D9C3]/15 shadow-2xl shadow-black/60 p-6 flex flex-col justify-between">
              
              {/* Top Accent info */}
              <div className="flex items-center justify-between z-20 border-b border-[#E7D9C3]/10 pb-4">
                <div className="flex items-center gap-2">
                  <LogoMark className="w-5 h-5" variant="light" alt="Corabin Logo" />
                  <span className="text-xs font-mono tracking-widest uppercase text-[#E7D9C3]/75">CORABIN // 01</span>
                </div>
                <span className="text-[11px] font-mono text-[#A7B89E] bg-[#1F3D3A]/60 px-2 py-0.5 rounded">SYSTEM_ACTIVE</span>
              </div>

              {/* Center 3D Architectural Composition */}
              <div className="relative my-auto w-full h-[280px] sm:h-[320px] flex items-center justify-center">
                
                {/* Architectural Arc Line */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 300" fill="none">
                  {/* Outer Geometric Arc */}
                  <path
                    d="M 50 250 A 100 100 0 0 1 250 250"
                    stroke="#E7D9C3"
                    strokeWidth="1"
                    strokeOpacity="0.25"
                    strokeDasharray="4 4"
                  />
                  {/* Inner Contour Lines */}
                  <path
                    d="M 70 250 A 80 80 0 0 1 230 250"
                    stroke="#1F3D3A"
                    strokeWidth="1.5"
                    strokeOpacity="0.6"
                  />
                  <path
                    d="M 90 250 A 60 60 0 0 1 210 250"
                    stroke="#C07A5A"
                    strokeWidth="1"
                    strokeOpacity="0.4"
                  />
                </svg>

                {/* Central Stepped Architectural Monolith */}
                <div className="relative z-10 flex flex-col items-center">
                  
                  {/* Floating Warm Metallic Sphere */}
                  <div className="absolute -top-6 -right-2 w-8 h-8 rounded-full bg-gradient-to-tr from-[#9C5A3E] via-[#C9A06A] to-[#FCF9F4] shadow-lg shadow-[#C07A5A]/30 border border-[#FCF9F4]/40" />

                  {/* Stepped Forest Green Monolith Layers */}
                  <div className="w-40 sm:w-48 h-10 bg-gradient-to-r from-[#142B29] to-[#1F3D3A] rounded-t-lg border-t border-x border-[#E7D9C3]/20 shadow-md relative">
                    <div className="absolute top-1 left-2 w-3 h-1 bg-[#C07A5A]/60 rounded-full" />
                  </div>
                  <div className="w-48 sm:w-56 h-12 bg-gradient-to-r from-[#1F3D3A] to-[#2A514D] border-t border-x border-[#E7D9C3]/20 shadow-md relative">
                    <div className="absolute bottom-2 right-4 text-[10px] font-mono text-[#E7D9C3]/40">MODULAR_STACK</div>
                  </div>
                  <div className="w-56 sm:w-64 h-16 bg-gradient-to-r from-[#0D1112] via-[#142B29] to-[#1F3D3A] rounded-b-lg border border-[#E7D9C3]/20 shadow-xl flex items-center justify-between px-4">
                    <span className="text-[11px] font-mono text-[#C07A5A]">STRUCTURE</span>
                    <span className="text-[11px] font-mono text-[#A7B89E]">SCALE: 1.0</span>
                  </div>
                </div>

                {/* Ambient Floor Reflection */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-6 bg-[#C07A5A]/15 blur-lg rounded-full" />
              </div>

              {/* Bottom Card Summary */}
              <div className="z-20 border-t border-[#E7D9C3]/10 pt-3 flex items-center justify-between text-xs text-[#E7D9C3]/75">
                <div className="flex items-center gap-1.5">
                  <StarMotif size={10} color="#C07A5A" />
                  <span>Physical & Digital Geometry</span>
                </div>
                <span className="font-mono text-[#C07A5A]">EST. 2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
