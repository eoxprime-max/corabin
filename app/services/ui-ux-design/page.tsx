import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { servicesData } from '@/lib/data/site-config';
import { ServiceDetailView } from '@/components/services/ServiceDetailView';

export const metadata: Metadata = {
  title: 'UI/UX Design | Corabin',
  description: 'Human-centered designs that create intuitive, tactile, and memorable digital experiences. From design systems to micro-interactions.',
};

export default function UiUxDesignPage() {
  const service = servicesData.find((s) => s.slug === 'ui-ux-design');
  if (!service) return notFound();

  return <ServiceDetailView service={service} />;
}
