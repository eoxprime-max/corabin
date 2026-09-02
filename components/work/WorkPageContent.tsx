'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { projectsData, ProjectItem } from '@/lib/data/site-config';
import { PillTag } from '@/components/ui/Buttons';

type CategoryFilter = 'All' | 'UI/UX Design' | 'Development' | 'AI Workflows' | 'Full Digital Build' | 'Web Platform Build' | 'UI/UX & Frontend Development' | 'AI Workflow Automation';

export function WorkPageContent() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');

  const categories: CategoryFilter[] = [
    'All',
    'UI/UX Design',
    'Development',
    'AI Workflows',
    'Full Digital Build',
    'Web Platform Build',
    'UI/UX & Frontend Development',
    'AI Workflow Automation',
  ];

  const filteredProjects = activeCategory === 'All'
    ? projectsData
    : projectsData.filter((p) => p.category === activeCategory);

  return (
    <div>
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-12 sm:mb-16">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              id={`filter-btn-${cat.toLowerCase().replace(/[\s/]+/g, '-')}`}
              className={`px-4 py-2 text-xs sm:text-sm font-sans font-medium rounded-full transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-[#C07A5A] text-[#FCF9F4] shadow-md shadow-[#C07A5A]/25'
                  : 'bg-[#111827] text-[#E7D9C3]/75 border border-[#E7D9C3]/15 hover:border-[#E7D9C3]/40 hover:text-[#FCF9F4]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Editorial Case Study Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {filteredProjects.map((project: ProjectItem) => (
          <article
            key={project.slug}
            id={`work-card-${project.slug}`}
            className="group flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-[#111827]/70 border border-[#E7D9C3]/15 hover:border-[#C07A5A]/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-black/50"
          >
            <div>
              {/* Image Frame */}
              <Link
                href={`/work/${project.slug}`}
                className="block relative aspect-16/10 rounded-2xl overflow-hidden mb-6 bg-[#142B29] border border-[#E7D9C3]/10"
              >
                <Image
                  src={project.image}
                  alt={`Cover for ${project.title}`}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080A0B]/80 via-transparent to-transparent opacity-50 group-hover:opacity-30 transition-opacity" />
              </Link>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <PillTag variant="forest">{project.category}</PillTag>
                <PillTag variant="terracotta">{project.year}</PillTag>
                {project.isConceptual && (
                  <span className="text-[10px] font-mono tracking-wider uppercase text-[#E7D9C3]/60 bg-[#080A0B] px-2.5 py-0.5 rounded-full border border-[#E7D9C3]/10">
                    Studio Study
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 className="font-sans text-2xl sm:text-3xl font-medium tracking-tight text-[#FCF9F4] group-hover:text-[#C07A5A] transition-colors mb-3">
                <Link href={`/work/${project.slug}`}>
                  {project.title}
                </Link>
              </h2>

              {/* Short summary */}
              <p className="text-sm text-[#E7D9C3]/80 leading-relaxed mb-6">
                {project.summary}
              </p>
            </div>

            {/* Technologies & Link */}
            <div className="pt-6 border-t border-[#E7D9C3]/10 flex items-center justify-between">
              <div className="flex flex-wrap gap-1.5 max-w-[70%]">
                {project.technologies.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="text-[10px] font-mono text-[#E7D9C3]/60 bg-[#080A0B] px-2 py-0.5 rounded border border-[#E7D9C3]/10"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <Link
                href={`/work/${project.slug}`}
                className="w-9 h-9 rounded-full border border-[#E7D9C3]/20 flex items-center justify-center text-[#C07A5A] group-hover:bg-[#C07A5A] group-hover:text-[#FCF9F4] group-hover:border-[#C07A5A] transition-all"
                aria-label={`View ${project.title} case study`}
              >
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
