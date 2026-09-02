import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { servicesData } from '@/lib/data/site-config';
import { ServiceDetailView } from '@/components/services/ServiceDetailView';

export const metadata: Metadata = {
  title: 'Development — NovaStack Creative Technology Studio',
  description: 'Robust, scalable and future-ready web solutions built with Next.js, full-stack TypeScript, and clean modular code.',
};

export default function DevelopmentPage() {
  const service = servicesData.find((s) => s.slug === 'development');
  if (!service) return notFound();

  return <ServiceDetailView service={service} />;
}
