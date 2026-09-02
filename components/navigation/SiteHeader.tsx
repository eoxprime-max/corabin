'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { siteConfig } from '@/lib/data/site-config';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Buttons';
import { MobileMenu } from './MobileMenu';

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        id="main-site-header"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#080A0B]/85 backdrop-blur-md border-b border-[#E7D9C3]/10 py-3.5 shadow-md shadow-black/20'
            : 'bg-transparent py-5 sm:py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left: Logo */}
            <div className="flex items-center">
              <Logo variant="light" size="md" />
            </div>

            {/* Center: Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2 px-4 py-1.5 rounded-full bg-[#111827]/60 border border-[#E7D9C3]/15 backdrop-blur-md" aria-label="Main Navigation">
              {siteConfig.navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    id={`desktop-nav-${item.label.toLowerCase()}`}
                    className={`relative px-4 py-1.5 text-xs lg:text-sm font-sans font-medium tracking-wide transition-colors rounded-full ${
                      isActive
                        ? 'text-[#FCF9F4] bg-[#1F3D3A] shadow-xs'
                        : 'text-[#E7D9C3]/75 hover:text-[#FCF9F4] hover:bg-[#FCF9F4]/5'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right: CTA + Mobile Toggle */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block">
                <Button
                  href="/contact"
                  variant="terracotta"
                  size="sm"
                  showArrow
                  id="header-start-project-btn"
                >
                  Start a Project
                </Button>
              </div>

              {/* Mobile Menu Trigger */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                id="open-mobile-menu"
                className="md:hidden p-2 rounded-full border border-[#E7D9C3]/20 text-[#FCF9F4] hover:bg-[#1F3D3A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C07A5A]"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}
