import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { siteConfig } from '@/lib/data/site-config';
import { Logo } from '@/components/ui/Logo';
import { StarMotif } from '@/components/ui/StarMotif';

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="main-site-footer" className="bg-[#080A0B] text-[#FCF9F4] border-t border-[#E7D9C3]/15 relative overflow-hidden bg-topo-dark">
      {/* Upper Subtle Accent Light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-[#C07A5A]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 mb-16">
          {/* Brand Column (5 cols) */}
          <div className="md:col-span-5 flex flex-col items-start">
            <Logo variant="light" showTagline size="lg" className="mb-6" />
            
            <p className="text-sm sm:text-base text-[#E7D9C3]/75 leading-relaxed max-w-md mb-8">
              A boutique creative technology agency blending human-centered UI/UX design, robust web engineering, and intelligent AI automation workflows.
            </p>

            <div className="flex items-center gap-3 text-xs text-[#A7B89E] bg-[#1F3D3A]/40 border border-[#1F3D3A] px-3.5 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#C07A5A] animate-pulse" />
              <span>{siteConfig.status}</span>
            </div>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="md:col-span-3">
            <div className="text-xs uppercase tracking-[0.2em] text-[#C07A5A] font-semibold mb-5 flex items-center gap-2">
              <StarMotif size={10} color="#C07A5A" />
              <span>Navigation</span>
            </div>
            <ul className="space-y-3.5">
              {siteConfig.navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    id={`footer-nav-${item.label.toLowerCase()}`}
                    className="text-sm text-[#E7D9C3]/75 hover:text-[#FCF9F4] hover:translate-x-1 transition-all inline-flex items-center gap-1 group"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-[#C07A5A] transition-opacity" />
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/contact"
                  id="footer-nav-contact"
                  className="text-sm text-[#C07A5A] hover:text-[#D98A68] hover:translate-x-1 transition-all inline-flex items-center gap-1 group font-medium"
                >
                  <span>Start a Project</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Services Group (2 cols) */}
          <div className="md:col-span-2">
            <div className="text-xs uppercase tracking-[0.2em] text-[#C07A5A] font-semibold mb-5 flex items-center gap-2">
              <StarMotif size={10} color="#C07A5A" />
              <span>Capabilities</span>
            </div>
            <ul className="space-y-3.5 text-sm text-[#E7D9C3]/75">
              <li>
                <Link href="/services/ui-ux-design" className="hover:text-[#FCF9F4] transition-colors">
                  UI/UX Design
                </Link>
              </li>
              <li>
                <Link href="/services/development" className="hover:text-[#FCF9F4] transition-colors">
                  Development
                </Link>
              </li>
              <li>
                <Link href="/services/ai-workflows" className="hover:text-[#FCF9F4] transition-colors">
                  AI Workflows
                </Link>
              </li>
              <li>
                <Link href="/process" className="hover:text-[#FCF9F4] transition-colors">
                  Systems Process
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct Contact (2 cols) */}
          <div className="md:col-span-2">
            <div className="text-xs uppercase tracking-[0.2em] text-[#C07A5A] font-semibold mb-5 flex items-center gap-2">
              <StarMotif size={10} color="#C07A5A" />
              <span>Direct</span>
            </div>
            <p className="text-sm text-[#E7D9C3]/75 mb-3">
              Inquiries & RFPs:
            </p>
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              id="footer-email-link"
              className="block text-sm font-mono text-[#FCF9F4] hover:text-[#C07A5A] transition-colors break-all mb-2"
            >
              {siteConfig.contactEmail}
            </a>
            {siteConfig.contactPhone && (
              <a
                href={`tel:${siteConfig.contactPhone}`}
                id="footer-phone-link"
                className="block text-sm font-mono text-[#FCF9F4] hover:text-[#C07A5A] transition-colors break-all"
              >
                {siteConfig.contactPhone}
              </a>
            )}

            <div className="mt-6 flex items-center gap-3">
              <Link href="/privacy" className="text-xs text-[#E7D9C3]/50 hover:text-[#E7D9C3] transition-colors">
                Privacy
              </Link>
              <span className="text-[#E7D9C3]/30">/</span>
              <Link href="/terms" className="text-xs text-[#E7D9C3]/50 hover:text-[#E7D9C3] transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Banner matching Reference Brand Board */}
        <div className="pt-8 border-t border-[#E7D9C3]/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#E7D9C3]/60">
          <div className="flex items-center gap-3">
            <span className="font-semibold tracking-wider uppercase text-[#FCF9F4]">CORABIN</span>
            <span className="text-[#E7D9C3]/30">|</span>
            <span className="tracking-widest uppercase">DIGITAL AGENCY</span>
          </div>

          <div className="flex items-center gap-2 text-[#E7D9C3]/80">
            <StarMotif size={12} color="#C07A5A" />
            <span className="tracking-widest uppercase text-[11px]">TURNING IDEAS INTO <span className="text-[#C07A5A] font-medium">IMPACT.</span></span>
          </div>

          <div>
            &copy; {currentYear} Corabin. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
