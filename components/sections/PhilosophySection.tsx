import React from 'react';
import { StarMotif, PillarIcons } from '@/components/ui/StarMotif';
import { philosophyFourPillars } from '@/lib/data/site-config';

export function PhilosophySection() {
  return (
    <section id="philosophy-section" className="py-24 sm:py-32 bg-[#142B29] text-[#FCF9F4] relative overflow-hidden border-y border-[#E7D9C3]/15">
      {/* Background Topographic Ambience */}
      <div className="absolute inset-0 opacity-40 pointer-events-none bg-topo-dark" />
      
      {/* Radial Forest Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#1F3D3A]/60 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header matching Brand Reference */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 mb-4">
            <StarMotif size={16} color="#C07A5A" />
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#E7D9C3]">
              BUILDING THE FUTURE.
            </span>
          </div>

          <h2 className="font-serif italic text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-[#C07A5A] tracking-tight mb-6">
            Empowering Growth.
          </h2>

          <div className="w-16 h-[2px] bg-[#C07A5A] mb-6" />

          <p className="text-base sm:text-lg text-[#E7D9C3]/80 font-normal leading-relaxed">
            We reject ephemeral vanity metrics. Every system we architect is grounded in four foundational engineering and design principles built to outlast immediate trend cycles.
          </p>
        </div>

        {/* 4 Pillars Grid matching bottom left of Brand Board */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {philosophyFourPillars.map((pillar) => {
            const typeKey = pillar.id === 'future-ready'
              ? 'future-ready'
              : pillar.id === 'scalable-architecture'
              ? 'scalable'
              : pillar.id === 'ai-automation'
              ? 'automation'
              : 'growth';

            return (
              <div
                key={pillar.id}
                id={`philosophy-pillar-${pillar.id}`}
                className="group p-8 rounded-2xl bg-[#080A0B]/40 border border-[#E7D9C3]/15 hover:border-[#C07A5A]/50 hover:bg-[#080A0B]/60 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-xl bg-[#1F3D3A]/60 border border-[#E7D9C3]/20 flex items-center justify-center mb-6 group-hover:border-[#C07A5A]/50 group-hover:scale-105 transition-all">
                    <PillarIcons
                      type={typeKey}
                      className="w-7 h-7"
                      color="#E7D9C3"
                    />
                  </div>

                  <h3 className="font-sans text-sm sm:text-base font-semibold uppercase tracking-[0.14em] text-[#FCF9F4] mb-3 group-hover:text-[#C07A5A] transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#E7D9C3]/75 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-[#E7D9C3]/10 flex items-center justify-between text-[11px] font-mono text-[#A7B89E]">
                  <span>PILLAR // 0{philosophyFourPillars.indexOf(pillar) + 1}</span>
                  <span className="text-[#C07A5A]">ACTIVE</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
