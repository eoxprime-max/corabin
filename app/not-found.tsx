import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Buttons';
import { StarMotif } from '@/components/ui/StarMotif';
import { LogoMark } from '@/components/ui/Logo';

export default function NotFound() {
  return (
    <main id="not-found-page-root" className="min-h-[85vh] flex items-center justify-center bg-[#080A0B] text-[#FCF9F4] px-4 py-32 relative overflow-hidden bg-topo-dark">
      
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#1F3D3A]/30 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-2xl mx-auto text-center relative z-10">
        
        {/* Visual Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111827] border border-[#E7D9C3]/15 mb-8">
          <LogoMark className="w-4 h-4" variant="light" alt="Corabin Logo" />
          <span className="text-xs font-mono tracking-widest text-[#C07A5A]">ERROR 404 // STACK_MISSING</span>
        </div>

        {/* Headline */}
        <h1 className="font-sans text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-[#FCF9F4] leading-tight mb-6">
          This page drifted off the{" "}
          <span className="font-serif italic text-[#C07A5A] font-normal">
            stack.
          </span>
        </h1>

        {/* Copy */}
        <p className="text-base sm:text-lg text-[#E7D9C3]/80 leading-relaxed max-w-lg mx-auto mb-10">
          The requested coordinate doesn&apos;t exist in our current architecture or has been relocated during a recent system refactor.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            href="/"
            variant="terracotta"
            size="md"
            showArrow
            id="not-found-home-btn"
          >
            Return to Homepage
          </Button>

          <Button
            href="/work"
            variant="secondary"
            size="md"
            id="not-found-work-btn"
          >
            Explore Case Studies
          </Button>
        </div>

        {/* Bottom subtle note */}
        <div className="mt-16 pt-8 border-t border-[#E7D9C3]/10 flex items-center justify-center gap-2 text-xs font-mono text-[#E7D9C3]/50">
          <StarMotif size={10} color="#C07A5A" />
          <span>Corabin Creative Technology Agency</span>
        </div>
      </div>
    </main>
  );
}
