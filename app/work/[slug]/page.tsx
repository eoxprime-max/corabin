import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, ChevronRight, Layers, Sparkles, Terminal } from 'lucide-react';
import { projectsData } from '@/lib/data/site-config';
import { PillTag, Button } from '@/components/ui/Buttons';
import { StarMotif } from '@/components/ui/StarMotif';
import { CTASection } from '@/components/sections/CTASection';

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projectsData.find((p) => p.slug === slug);
  if (!project) return { title: 'Project Not Found | Corabin' };

  return {
    title: `${project.title} - Case Study | Corabin`,
    description: project.summary,
  };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const projectIndex = projectsData.findIndex((p) => p.slug === slug);
  if (projectIndex === -1) return notFound();

  const project = projectsData[projectIndex];
  const nextProject = projectsData[(projectIndex + 1) % projectsData.length];

  return (
    <main id={`case-study-${project.slug}`} className="min-h-screen bg-[#080A0B] text-[#FCF9F4] pt-28">
      
      {/* 01: Hero Header */}
      <section className="py-16 sm:py-24 border-b border-[#E7D9C3]/15 bg-topo-dark relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-mono text-[#E7D9C3]/60 mb-8">
            <Link href="/" className="hover:text-[#FCF9F4] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/work" className="hover:text-[#FCF9F4] transition-colors">Work</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#C07A5A]">{project.title}</span>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2.5 mb-6">
            <PillTag variant="forest">{project.category}</PillTag>
            <PillTag variant="terracotta">{project.year}</PillTag>
            {project.isConceptual && (
              <span className="text-xs font-mono uppercase tracking-wider text-[#E7D9C3]/70 bg-[#111827] px-3 py-1 rounded-full border border-[#E7D9C3]/15">
                Studio Monograph
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="font-sans text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-[#FCF9F4] leading-[1.08] mb-6">
            {project.title} &mdash;{" "}
            <span className="font-serif italic text-[#C07A5A] font-normal">
              {project.tag}
            </span>
          </h1>

          {/* Summary Lead */}
          <p className="text-lg sm:text-xl md:text-2xl text-[#E7D9C3]/85 font-light leading-relaxed max-w-4xl mb-12">
            {project.summary}
          </p>

          {/* Project Metadata Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-[#E7D9C3]/15 font-mono text-xs">
            <div>
              <span className="text-[#A7B89E] block mb-1">CLIENT</span>
              <span className="text-[#FCF9F4]">{project.client}</span>
            </div>
            <div>
              <span className="text-[#A7B89E] block mb-1">DISCIPLINE</span>
              <span className="text-[#FCF9F4]">{project.category}</span>
            </div>
            <div>
              <span className="text-[#A7B89E] block mb-1">YEAR</span>
              <span className="text-[#FCF9F4]">{project.year}</span>
            </div>
            <div>
              <span className="text-[#A7B89E] block mb-1">TYPE</span>
              <span className="text-[#C07A5A]">{project.projectType || (project.isConceptual ? "Studio Architecture" : "Production")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 02: Full-Bleed Editorial Cover Image */}
      <section className="py-12 sm:py-16 bg-[#0D1112]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative aspect-16/9 rounded-3xl overflow-hidden border border-[#E7D9C3]/20 shadow-2xl bg-[#142B29]">
            <Image
              src={project.image}
              alt={`Hero Visual for ${project.title}`}
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
              priority
              sizes="(max-width: 1280px) 100vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080A0B]/70 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* 03: Challenge & Approach */}
      <section className="py-20 sm:py-28 bg-[#FCF9F4] text-[#111827] border-y border-[#D8CDC0]/80 bg-topo-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* The Challenge (6 cols) */}
            <div className="lg:col-span-6 p-8 sm:p-10 rounded-2xl bg-white border border-[#D8CDC0] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#9C5A3E] font-semibold mb-4">
                  <span className="w-2 h-2 rounded-full bg-[#C07A5A]" />
                  THE CHALLENGE
                </div>
                <h2 className="font-sans text-2xl sm:text-3xl font-medium tracking-tight text-[#111827] mb-4">
                  {project.challengeHeading || "Operational & visual friction"}
                </h2>
                <p className="text-base text-[#1F3D3A]/85 leading-relaxed">
                  {project.challenge}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-[#D8CDC0] text-xs font-mono text-[#1F3D3A]/60">
                AUDIT // IDENTIFIED_BOTTLENECK
              </div>
            </div>

            {/* The Approach (6 cols) */}
            <div className="lg:col-span-6 p-8 sm:p-10 rounded-2xl bg-[#142B29] text-[#FCF9F4] border border-[#1F3D3A] shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#A7B89E] font-semibold mb-4">
                  <StarMotif size={12} color="#C07A5A" />
                  THE STRATEGY
                </div>
                <h2 className="font-sans text-2xl sm:text-3xl font-medium tracking-tight text-[#FCF9F4] mb-4">
                  {project.approachHeading || "Architectural intervention"}
                </h2>
                <p className="text-base text-[#E7D9C3]/85 leading-relaxed">
                  {project.approach}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-[#E7D9C3]/10 text-xs font-mono text-[#A7B89E]">
                SOLUTION // INTEGRATED_DELIVERY
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 04: Three Pillars of Execution (Design, Development, Automation) */}
      <section className="py-24 sm:py-32 bg-[#0D1112] text-[#FCF9F4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-16">
            <div className="inline-flex items-center gap-2 mb-3">
              <StarMotif size={12} color="#C07A5A" />
              <span className="text-xs uppercase tracking-[0.24em] font-medium text-[#E7D9C3]/80">
                EXECUTION DEEP-DIVE
              </span>
            </div>
            <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#FCF9F4]">
              How the system was{" "}
              <span className="font-serif italic text-[#C07A5A] font-normal">
                crafted.
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Design Pillar */}
            <div className="p-8 rounded-2xl bg-[#111827]/80 border border-[#E7D9C3]/15 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#080A0B] border border-[#E7D9C3]/15 flex items-center justify-center mb-6">
                  <Layers className="w-6 h-6 text-[#C07A5A]" />
                </div>
                <h3 className="font-sans text-xl font-medium text-[#FCF9F4] mb-4">
                  01 UI/UX Architecture
                </h3>
                <ul className="space-y-3 text-sm text-[#E7D9C3]/80">
                  {project.designHighlights.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C07A5A] shrink-0 mt-1.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Development Pillar */}
            <div className="p-8 rounded-2xl bg-[#111827]/80 border border-[#E7D9C3]/15 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#080A0B] border border-[#E7D9C3]/15 flex items-center justify-center mb-6">
                  <Terminal className="w-6 h-6 text-[#A7B89E]" />
                </div>
                <h3 className="font-sans text-xl font-medium text-[#FCF9F4] mb-4">
                  02 Engineering & Code
                </h3>
                <ul className="space-y-3 text-sm text-[#E7D9C3]/80">
                  {project.devHighlights.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#A7B89E] shrink-0 mt-1.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Automation Pillar */}
            <div className="p-8 rounded-2xl bg-[#111827]/80 border border-[#E7D9C3]/15 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#080A0B] border border-[#E7D9C3]/15 flex items-center justify-center mb-6">
                  <Sparkles className="w-6 h-6 text-[#C07A5A]" />
                </div>
                <h3 className="font-sans text-xl font-medium text-[#FCF9F4] mb-4">
                  03 Automation & Pipeline
                </h3>
                <ul className="space-y-3 text-sm text-[#E7D9C3]/80">
                  {project.automationHighlights.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C07A5A] shrink-0 mt-1.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 05: Honest Outcome Statement */}
      <section className="py-20 sm:py-28 bg-[#142B29] text-[#FCF9F4] border-y border-[#E7D9C3]/15">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <StarMotif size={14} color="#C07A5A" />
            <span className="text-xs uppercase tracking-[0.24em] font-medium text-[#E7D9C3]">
              OUTCOME & IMPACT
            </span>
          </div>

          <h2 className="font-sans text-2xl sm:text-3xl md:text-4xl font-light text-[#FCF9F4] leading-relaxed max-w-3xl mx-auto mb-8">
            &ldquo;{project.outcome}&rdquo;
          </h2>

          <div className="flex flex-wrap justify-center gap-2 pt-4">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="text-xs font-mono text-[#E7D9C3] bg-[#080A0B]/60 px-3 py-1.5 rounded-full border border-[#E7D9C3]/20"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 06: Next Project Navigation Bar */}
      <section className="py-16 sm:py-20 bg-[#080A0B] border-b border-[#E7D9C3]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8 p-8 sm:p-12 rounded-3xl bg-[#111827]/70 border border-[#E7D9C3]/15">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#A7B89E] block mb-2">
                NEXT CASE STUDY
              </span>
              <h3 className="font-sans text-2xl sm:text-3xl font-medium text-[#FCF9F4]">
                {nextProject.title}
              </h3>
              <p className="text-sm text-[#E7D9C3]/70">
                {nextProject.category} &mdash; {nextProject.tag}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Button
                href="/work"
                variant="secondary"
                size="md"
                id="back-to-all-work-btn"
              >
                <ArrowLeft className="w-4 h-4 mr-2 inline-block" />
                All Projects
              </Button>

              <Button
                href={`/work/${nextProject.slug}`}
                variant="terracotta"
                size="md"
                showArrow
                id="view-next-project-btn"
              >
                Next Project
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Global CTA */}
      <CTASection />
    </main>
  );
}
