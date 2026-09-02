'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, ArrowUpRight } from 'lucide-react';
import { siteConfig } from '@/lib/data/site-config';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Buttons';
import { StarMotif } from '@/components/ui/StarMotif';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <div
      id="mobile-menu-overlay"
      className="fixed inset-0 z-50 bg-[#080A0B]/98 backdrop-blur-xl flex flex-col justify-between p-6 sm:p-10 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
    >
      {/* Top Bar inside Menu */}
      <div className="flex items-center justify-between border-b border-[#E7D9C3]/15 pb-6">
        <Logo variant="light" size="md" />
        <button
          onClick={onClose}
          id="close-mobile-menu"
          className="p-2.5 rounded-full border border-[#E7D9C3]/20 text-[#FCF9F4] hover:bg-[#1F3D3A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C07A5A]"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Nav Links */}
      <nav className="py-8 flex flex-col gap-5 my-auto" aria-label="Mobile Navigation">
        {siteConfig.navItems.map((item, idx) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              id={`mobile-nav-${item.label.toLowerCase()}`}
              className="group flex items-center justify-between py-2 transition-transform duration-200"
            >
              <div className="flex items-baseline gap-4">
                <span className="text-xs font-mono text-[#C07A5A]">0{idx + 1}</span>
                <span className={`text-3xl sm:text-4xl font-sans tracking-tight transition-colors ${
                  isActive ? "text-[#C07A5A] font-medium" : "text-[#FCF9F4] group-hover:text-[#E7D9C3]"
                }`}>
                  {item.label}
                </span>
              </div>
              <ArrowUpRight className={`w-5 h-5 text-[#C07A5A] opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                isActive ? "opacity-100" : ""
              }`} />
            </Link>
          );
        })}
      </nav>

      {/* Footer Area inside Mobile Menu */}
      <div className="pt-6 border-t border-[#E7D9C3]/15 flex flex-col gap-5">
        <Button
          href="/contact"
          variant="terracotta"
          size="lg"
          showArrow
          className="w-full justify-center"
          onClick={onClose}
          id="mobile-start-project-btn"
        >
          Start a Project
        </Button>

        <div className="flex items-center justify-between text-xs text-[#E7D9C3]/60 pt-2">
          <div className="flex items-center gap-2">
            <StarMotif size={10} color="#C07A5A" />
            <span className="tracking-[0.18em] uppercase">DESIGN. DEVELOP. AUTOMATE. SCALE.</span>
          </div>
          <span className="text-[#A7B89E]">{siteConfig.status}</span>
        </div>
      </div>
    </div>
  );
}
