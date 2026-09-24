import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { servicesData } from '@/lib/data/site-config';
import { ServiceDetailView } from '@/components/services/ServiceDetailView';

export const metadata: Metadata = {
  title: 'AI Workflows & Automation | Corabin',
  description: 'Intelligent automation systems that streamline operations, eliminate repetitive manual toil, and drive exponential team leverage.',
};

export default function AiWorkflowsPage() {
  const service = servicesData.find((s) => s.slug === 'ai-workflows');
  if (!service) return notFound();

  return <ServiceDetailView service={service} />;
}
