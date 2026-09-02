'use client';

import React, { useState } from 'react';
import { processPhases, ProcessPhase } from '@/lib/data/site-config';
import { StarMotif } from '@/components/ui/StarMotif';
import { CheckCircle2, Layers, Clock } from 'lucide-react';

export function ProcessTimelineView() {
  const [selectedPhase, setSelectedPhase] = useState<number>(0);
  const activePhase: ProcessPhase = processPhases[selectedPhase];

  return (
    <div>
      {/* Horizontal Phase Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-12 sm:mb-16">
        {processPhases.map((phase, idx) => {
          const isSelected = selectedPhase === idx;
          return (
            <button
              key={phase.number}
              onClick={() => setSelectedPhase(idx)}
              id={`process-tab-${phase.name.toLowerCase()}`}
              className={`p-4 sm:p-5 rounded-2xl text-left transition-all duration-300 border cursor-pointer ${
                isSelected
                  ? 'bg-[#1F3D3A] border-[#C07A5A] shadow-lg shadow-black/40 translate-y-[-2px]'
                  : 'bg-[#111827] border-[#E7D9C3]/15 hover:border-[#E7D9C3]/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`font-mono text-xs ${isSelected ? 'text-[#C07A5A] font-bold' : 'text-[#E7D9C3]/50'}`}>
                  PHASE {phase.number}
                </span>
                {isSelected && <StarMotif size={10} color="#C07A5A" />}
              </div>

              <span className="font-sans text-base sm:text-lg font-medium block text-[#FCF9F4]">
                {phase.name}
              </span>

              <span className="text-[11px] font-mono text-[#A7B89E] mt-1 block">
                {phase.duration}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Phase Detailed Breakdown Card */}
      <div
        id="active-phase-card"
        className="p-8 sm:p-12 lg:p-16 rounded-3xl bg-[#111827]/80 border border-[#E7D9C3]/20 shadow-2xl transition-all duration-300"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left: Phase Overview (6 cols) */}
          <div className="lg:col-span-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-10 h-10 rounded-full bg-[#1F3D3A] text-[#FCF9F4] font-mono text-xs flex items-center justify-center font-bold border border-[#E7D9C3]/20">
                {activePhase.number}
              </span>
              <div className="flex items-center gap-2 text-xs font-mono text-[#A7B89E]">
                <Clock className="w-3.5 h-3.5" />
                <span>Estimated Window: {activePhase.duration}</span>
              </div>
            </div>

            <h2 className="font-sans text-3xl sm:text-4xl font-medium tracking-tight text-[#FCF9F4] mb-3">
              Phase {activePhase.number}: {activePhase.name}
            </h2>

            <p className="font-serif italic text-lg sm:text-xl text-[#C07A5A] mb-6">
              {activePhase.headline}
            </p>

            <p className="text-base text-[#E7D9C3]/80 leading-relaxed">
              {activePhase.description}
            </p>
          </div>

          {/* Right: Key Activities & Concrete Outputs (6 cols) */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* Key Activities */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#080A0B]/60 border border-[#E7D9C3]/10">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#A7B89E] font-semibold mb-4">
                <Layers className="w-4 h-4 text-[#C07A5A]" />
                <span>Core Activities & Sprints</span>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-[#E7D9C3]/85">
                {activePhase.keyActivities.map((act, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C07A5A] shrink-0 mt-1.5" />
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tangible Outputs */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#142B29]/60 border border-[#E7D9C3]/15">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#C07A5A] font-semibold mb-4">
                <StarMotif size={12} color="#C07A5A" />
                <span>Verified Deliverable Artifacts</span>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-[#FCF9F4]">
                {activePhase.outputs.map((out, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#A7B89E] shrink-0 mt-0.5" />
                    <span className="font-medium">{out}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
