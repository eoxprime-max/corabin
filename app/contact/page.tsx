import React from 'react';
import type { Metadata } from 'next';
import { Mail, MapPin, Clock, ShieldCheck, ArrowUpRight, Phone } from 'lucide-react';
import { ContactForm } from '@/components/forms/ContactForm';
import { siteConfig } from '@/lib/data/site-config';
import { StarMotif } from '@/components/ui/StarMotif';

export const metadata: Metadata = {
  title: 'Contact & Inquiries — NovaStack Creative Technology Studio',
  description: 'Start a project with NovaStack. Tell us what you want to build, automate, or scale.',
};

export default function ContactPage() {
  return (
    <main id="contact-page-root" className="min-h-screen bg-[#080A0B] text-[#FCF9F4] pt-28">
      
      {/* Hero Header */}
      <section className="py-16 sm:py-24 border-b border-[#E7D9C3]/15 bg-topo-dark relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111827] border border-[#E7D9C3]/15 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#C07A5A] animate-pulse" />
              <span className="text-xs uppercase tracking-[0.24em] font-medium text-[#E7D9C3]/90">
                INITIATE COLLABORATION
              </span>
            </div>

            <h1 className="font-sans text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-[#FCF9F4] leading-[1.08] mb-6">
              Start a{" "}
              <span className="font-serif italic text-[#C07A5A] font-normal">
                project.
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-[#E7D9C3]/80 leading-relaxed max-w-2xl">
              Tell us what you&apos;re trying to build, automate, or improve. We&apos;ll help you clarify the architecture and shape the roadmap.
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid: Form + Studio Details */}
      <section className="py-20 sm:py-28 bg-[#0D1112]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Interactive Intake Form (7 cols) */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>

            {/* Right Column: Direct Studio Information (5 cols) */}
            <div className="lg:col-span-5 space-y-8">
              
              {/* Studio Direct Card */}
              <div className="p-8 rounded-3xl bg-[#111827]/80 border border-[#E7D9C3]/15 shadow-xl space-y-6">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#A7B89E]">
                  <StarMotif size={12} color="#C07A5A" />
                  <span>DIRECT STUDIO ACCESS</span>
                </div>

                <div>
                  <h3 className="font-sans text-2xl font-medium text-[#FCF9F4] mb-2">
                    Talk directly with partners.
                  </h3>
                  <p className="text-sm text-[#E7D9C3]/75 leading-relaxed">
                    We skip junior business development filters. Every inquiry is reviewed by technical and design leadership.
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-[#E7D9C3]/10 text-xs sm:text-sm">
                  {/* Email */}
                  <a
                    href={`mailto:${siteConfig.contactEmail}`}
                    className="flex items-center justify-between p-4 rounded-xl bg-[#080A0B] border border-[#E7D9C3]/10 hover:border-[#C07A5A]/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-[#C07A5A]" />
                      <span className="font-mono text-[#FCF9F4]">{siteConfig.contactEmail}</span>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-[#E7D9C3]/50 group-hover:text-[#C07A5A] transition-colors" />
                  </a>

                  {/* Phone */}
                  {siteConfig.contactPhone && (
                    <a
                      href={`tel:${siteConfig.contactPhone}`}
                      className="flex items-center justify-between p-4 rounded-xl bg-[#080A0B] border border-[#E7D9C3]/10 hover:border-[#C07A5A]/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-[#C07A5A]" />
                        <span className="font-mono text-[#FCF9F4]">{siteConfig.contactPhone}</span>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-[#E7D9C3]/50 group-hover:text-[#C07A5A] transition-colors" />
                    </a>
                  )}

                  {/* Location */}
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-[#080A0B] border border-[#E7D9C3]/10">
                    <MapPin className="w-4 h-4 text-[#A7B89E] shrink-0" />
                    <div>
                      <span className="block text-[#FCF9F4] font-medium">{siteConfig.location}</span>
                      <span className="text-[11px] text-[#E7D9C3]/50">Remote Global Engagements</span>
                    </div>
                  </div>

                  {/* Hours & Response */}
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-[#080A0B] border border-[#E7D9C3]/10">
                    <Clock className="w-4 h-4 text-[#C07A5A] shrink-0" />
                    <div>
                      <span className="block text-[#FCF9F4] font-medium">Open Mon-Sun 9:00am-10:00pm</span>
                      <span className="text-[11px] text-[#A7B89E]">Typical response within 24 hours</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Engagement Standards Card */}
              <div className="p-8 rounded-3xl bg-[#142B29]/60 border border-[#E7D9C3]/15">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#C07A5A] mb-4">
                  <ShieldCheck className="w-4 h-4 text-[#A7B89E]" />
                  <span>ENGAGEMENT COMMITMENT</span>
                </div>

                <h4 className="font-sans text-lg font-medium text-[#FCF9F4] mb-3">
                  Zero sales pressure.
                </h4>

                <p className="text-xs sm:text-sm text-[#E7D9C3]/80 leading-relaxed mb-4">
                  If we determine your project isn&apos;t the right fit for NovaStack, we will honestly tell you and point you toward better-suited tools or specialists.
                </p>

                <div className="text-[11px] font-mono text-[#A7B89E]">
                  NON_DISCLOSURE_READY // BY_DEFAULT
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
