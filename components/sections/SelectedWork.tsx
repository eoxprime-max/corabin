import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { projectsData } from '@/lib/data/site-config';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PillTag } from '@/components/ui/Buttons';

export function SelectedWork() {
  const featuredProjects = projectsData.filter((p) => p.featured);

  return (
    <section id="selected-work-section" className="py-24 sm:py-32 bg-[#080A0B] text-[#FCF9F4] relative overflow-hidden bg-topo-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-20 gap-6">
          <SectionHeading
            eyebrow="PORTFOLIO"
            title="Selected"
            highlight="work."
            subtitle="An editorial selection of digital products, scalable web systems, and automation engines crafted for clarity and scale."
          />

          <Link
            href="/work"
            id="view-all-work-link"
            className="group inline-flex items-center gap-2 text-sm font-sans font-medium text-[#C07A5A] hover:text-[#E7D9C3] transition-colors shrink-0"
          >
            <span>View All Case Studies</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Alternating Asymmetric Project Grid */}
        <div className="space-y-16 sm:space-y-24">
          {featuredProjects.map((project, idx) => {
            const isReversed = idx % 2 !== 0;

            return (
              <div
                key={project.slug}
                id={`featured-project-${project.slug}`}
                className="group relative rounded-3xl bg-[#0D1112] border border-[#E7D9C3]/15 overflow-hidden p-6 sm:p-10 lg:p-12 hover:border-[#C07A5A]/50 transition-all duration-500 shadow-xl"
              >
                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
                  isReversed ? 'lg:flex-row-reverse' : ''
                }`}>
                  
                  {/* Text Column (5 cols) */}
                  <div className={`lg:col-span-5 flex flex-col justify-between ${
                    isReversed ? 'lg:order-2' : 'lg:order-1'
                  }`}>
                    <div>
                      {/* Top Badges */}
                      <div className="flex flex-wrap items-center gap-2.5 mb-6">
                        <PillTag variant="forest">{project.category}</PillTag>
                        <PillTag variant="terracotta">{project.year}</PillTag>
                        {project.isConceptual && (
                          <span className="text-[10px] font-mono tracking-wider uppercase text-[#E7D9C3]/60 bg-[#111827] px-2.5 py-0.5 rounded-full border border-[#E7D9C3]/10">
                            Studio Study
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="font-sans text-3xl sm:text-4xl font-normal tracking-tight text-[#FCF9F4] group-hover:text-[#C07A5A] transition-colors mb-4">
                        <Link href={`/work/${project.slug}`}>
                          {project.title}
                        </Link>
                      </h3>

                      {/* Summary */}
                      <p className="text-sm sm:text-base text-[#E7D9C3]/80 leading-relaxed mb-6">
                        {project.summary}
                      </p>

                      {/* Key highlights */}
                      <div className="space-y-2 mb-8 text-xs text-[#E7D9C3]/70">
                        <span className="font-mono text-[#A7B89E] tracking-widest uppercase text-[10px]">CORE ARCHITECTURE:</span>
                        <p className="italic text-[#E7D9C3]/90 pt-0.5 font-serif">
                          &ldquo;{project.outcome}&rdquo;
                        </p>
                      </div>

                      {/* Technologies */}
                      <div className="flex flex-wrap gap-1.5 mb-8">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="text-[11px] font-mono text-[#E7D9C3]/60 bg-[#080A0B] px-2.5 py-1 rounded border border-[#E7D9C3]/10"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Case Study Link */}
                    <div>
                      <Link
                        href={`/work/${project.slug}`}
                        id={`read-case-study-${project.slug}`}
                        className="inline-flex items-center gap-2 text-sm font-sans font-medium text-[#FCF9F4] group-hover:text-[#C07A5A] transition-colors"
                      >
                        <span className="underline underline-offset-4 decoration-[#C07A5A]/50 group-hover:decoration-[#C07A5A]">
                          Explore Full Case Study
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-[#C07A5A] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </Link>
                    </div>
                  </div>

                  {/* Image Column (7 cols) */}
                  <div className={`lg:col-span-7 ${
                    isReversed ? 'lg:order-1' : 'lg:order-2'
                  }`}>
                    <Link
                      href={`/work/${project.slug}`}
                      className="block relative aspect-16/10 sm:aspect-16/9 rounded-2xl overflow-hidden border border-[#E7D9C3]/15 bg-[#142B29]"
                    >
                      <Image
                        src={project.image}
                        alt={`Corabin Case Study: ${project.title}`}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        referrerPolicy="no-referrer"
                        sizes="(max-width: 1024px) 100vw, 60vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#080A0B]/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
