import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { servicesData } from '@/lib/data/site-config';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PillarIcons } from '@/components/ui/StarMotif';

export function ServicesPreview() {
  return (
    <section id="services-preview-section" className="py-24 sm:py-32 bg-[#0D1112] text-[#FCF9F4] relative overflow-hidden bg-topo-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-20 gap-6">
          <SectionHeading
            eyebrow="CORE SERVICES"
            title="What we"
            highlight="build."
            subtitle="Three interconnected disciplines designed to take ambitious ideas from blank canvas to scalable production systems."
          />

          <Link
            href="/services"
            id="view-all-services-link"
            className="group inline-flex items-center gap-2 text-sm font-sans font-medium text-[#C07A5A] hover:text-[#E7D9C3] transition-colors shrink-0"
          >
            <span>Explore All Capabilities</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {servicesData.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              id={`service-card-${service.id}`}
              className="group relative flex flex-col justify-between p-8 sm:p-10 rounded-2xl bg-[#111827]/70 border border-[#E7D9C3]/15 hover:border-[#C07A5A]/50 hover:bg-[#1F3D3A]/40 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-black/50"
            >
              {/* Top Row: Index + Icon */}
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="font-mono text-xs text-[#E7D9C3]/50 group-hover:text-[#C07A5A] transition-colors">
                    {service.number} &mdash; CAPABILITY
                  </span>

                  <div className="w-12 h-12 rounded-xl bg-[#080A0B] border border-[#E7D9C3]/15 flex items-center justify-center group-hover:border-[#C07A5A]/40 group-hover:scale-105 transition-all">
                    <PillarIcons
                      type={service.iconType}
                      className="w-6 h-6"
                      color="#C07A5A"
                    />
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-sans text-2xl sm:text-3xl font-medium tracking-tight text-[#FCF9F4] group-hover:text-[#E7D9C3] transition-colors mb-4">
                  {service.title}
                </h3>

                {/* Short Description */}
                <p className="text-sm sm:text-base text-[#E7D9C3]/75 leading-relaxed mb-8">
                  {service.shortDesc}
                </p>

                {/* Deliverables snippet */}
                <div className="space-y-2 mb-8 pt-6 border-t border-[#E7D9C3]/10">
                  <span className="text-[11px] font-mono tracking-widest uppercase text-[#A7B89E]">KEY DELIVERABLES:</span>
                  <ul className="text-xs text-[#E7D9C3]/70 space-y-1.5 pt-1">
                    {service.deliverables.slice(0, 3).map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-[#C07A5A]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom: Learn More Link + Arrow */}
              <div className="pt-4 border-t border-[#E7D9C3]/10 flex items-center justify-between text-xs font-sans font-medium uppercase tracking-wider text-[#C07A5A]">
                <span>Discover Service</span>
                <div className="w-8 h-8 rounded-full border border-[#C07A5A]/30 flex items-center justify-center group-hover:bg-[#C07A5A] group-hover:text-[#FCF9F4] transition-all">
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
