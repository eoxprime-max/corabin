import React from 'react';
import { HomeHero } from '@/components/hero/HomeHero';
import { TrustStatement } from '@/components/sections/TrustStatement';
import { ServicesPreview } from '@/components/sections/ServicesPreview';
import { PhilosophySection } from '@/components/sections/PhilosophySection';
import { SelectedWork } from '@/components/sections/SelectedWork';
import { ProcessTeaser } from '@/components/sections/ProcessTeaser';
import { WhyNovaStack } from '@/components/sections/WhyNovaStack';
import { CTASection } from '@/components/sections/CTASection';

export default function HomePage() {
  return (
    <main id="home-page-root" className="min-h-screen bg-[#080A0B]">
      {/* 01: Hero Section */}
      <HomeHero />

      {/* 02: Trust & Editorial Philosophy Statement */}
      <TrustStatement />

      {/* 03: Core Services Preview (UI/UX, Dev, AI Workflows) */}
      <ServicesPreview />

      {/* 04: Philosophy & 4 Pillars (Building the Future / Empowering Growth) */}
      <PhilosophySection />

      {/* 05: Selected Work (Featured Case Studies) */}
      <SelectedWork />

      {/* 06: Process Teaser (From Idea to Impact) */}
      <ProcessTeaser />

      {/* 07: Why NovaStack (One Partner, Four Capabilities) */}
      <WhyNovaStack />

      {/* 08: Global Project Inquiry CTA */}
      <CTASection />
    </main>
  );
}
