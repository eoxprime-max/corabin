'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Buttons';
import { StarMotif } from '@/components/ui/StarMotif';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const PROJECT_TYPES = [
  'UI/UX Design',
  'Full-Stack Next.js App',
  'AI & Automation Workflows',
  'Design Systems',
  'Full Digital Build',
  'Other Advisory',
];

const BUDGET_RANGES = [
  '<$500',
  '$500 - $1k',
  '$1k - $10k',
  'above $10k',
];

const TIMELINES = [
  'Immediate(<1mounth)',
  '1 – 3 Months',
  '3 – 6 Months',
  'Flexible / Exploring',
];

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectTypes: [] as string[],
    budget: '<$500',
    timeline: 'Immediate(<1mounth)',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const toggleProjectType = (type: string) => {
    setFormData((prev) => {
      const exists = prev.projectTypes.includes(type);
      return {
        ...prev,
        projectTypes: exists
          ? prev.projectTypes.filter((t) => t !== type)
          : [...prev.projectTypes, type],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setStatus('error');
      setErrorMessage('Please fill in your name, email, phone number, and project details.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to submit message.');
      }

      setStatus('success');
    } catch (err: unknown) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred. Please reach out via email directly.');
    }
  };

  if (status === 'success') {
    return (
      <div id="contact-success-state" className="p-8 sm:p-12 rounded-3xl bg-[#142B29] border border-[#E7D9C3]/20 text-center">
        <div className="w-16 h-16 rounded-full bg-[#1F3D3A] border border-[#C07A5A]/50 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-[#A7B89E]" />
        </div>

        <h3 className="font-sans text-2xl sm:text-3xl font-medium text-[#FCF9F4] mb-3">
          Inquiry Received.
        </h3>

        <p className="text-base text-[#E7D9C3]/80 max-w-md mx-auto mb-8 leading-relaxed">
          Thank you for reaching out to NovaStack. A senior partner will review your project brief and respond within 24 business hours.
        </p>

        <Button
          onClick={() => {
            setFormData({
              name: '',
              email: '',
              phone: '',
              company: '',
              projectTypes: [],
              budget: '<$500',
              timeline: 'Immediate(<1mounth)',
              message: '',
            });
            setStatus('idle');
          }}
          variant="terracotta"
          size="md"
          id="send-another-inquiry-btn"
        >
          Submit Another Inquiry
        </Button>
      </div>
    );
  }

  return (
    <form
      id="nova-contact-form"
      onSubmit={handleSubmit}
      className="p-8 sm:p-12 rounded-3xl bg-[#111827]/80 border border-[#E7D9C3]/15 shadow-2xl space-y-8"
    >
      {/* Form Header info */}
      <div className="flex items-center justify-between border-b border-[#E7D9C3]/10 pb-6">
        <div className="flex items-center gap-2">
          <StarMotif size={12} color="#C07A5A" />
          <span className="text-xs font-mono uppercase tracking-widest text-[#E7D9C3]/75">
            PROJECT INTAKE BRIEF
          </span>
        </div>
        <span className="text-[11px] font-mono text-[#A7B89E]">CONFIDENTIAL</span>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-950/40 border border-red-800/50 text-red-200 text-xs sm:text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Row 1: Name & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="contact-name" className="block text-xs font-mono uppercase tracking-wider text-[#E7D9C3]/80 mb-2">
            Full Name <span className="text-[#C07A5A]">*</span>
          </label>
          <input
            type="text"
            id="contact-name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Jane Doe"
            className="w-full px-4 py-3 rounded-xl bg-[#080A0B] border border-[#E7D9C3]/20 text-[#FCF9F4] placeholder-[#E7D9C3]/30 text-sm focus:outline-none focus:border-[#C07A5A] transition-colors"
          />
        </div>

        <div>
          <label htmlFor="contact-email" className="block text-xs font-mono uppercase tracking-wider text-[#E7D9C3]/80 mb-2">
            Work Email <span className="text-[#C07A5A]">*</span>
          </label>
          <input
            type="email"
            id="contact-email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="jane@company.com"
            className="w-full px-4 py-3 rounded-xl bg-[#080A0B] border border-[#E7D9C3]/20 text-[#FCF9F4] placeholder-[#E7D9C3]/30 text-sm focus:outline-none focus:border-[#C07A5A] transition-colors"
          />
        </div>
      </div>

      {/* Row 2: Company & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="contact-company" className="block text-xs font-mono uppercase tracking-wider text-[#E7D9C3]/80 mb-2">
            Company or Project Name <span className="text-[#E7D9C3]/40">(Optional)</span>
          </label>
          <input
            type="text"
            id="contact-company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="Acme Corp"
            className="w-full px-4 py-3 rounded-xl bg-[#080A0B] border border-[#E7D9C3]/20 text-[#FCF9F4] placeholder-[#E7D9C3]/30 text-sm focus:outline-none focus:border-[#C07A5A] transition-colors"
          />
        </div>

        <div>
          <label htmlFor="contact-phone" className="block text-xs font-mono uppercase tracking-wider text-[#E7D9C3]/80 mb-2">
            Phone Number <span className="text-[#C07A5A]">*</span>
          </label>
          <input
            type="tel"
            id="contact-phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+1 (555) 000-0000"
            required
            className="w-full px-4 py-3 rounded-xl bg-[#080A0B] border border-[#E7D9C3]/20 text-[#FCF9F4] placeholder-[#E7D9C3]/30 text-sm focus:outline-none focus:border-[#C07A5A] transition-colors"
          />
        </div>
      </div>

      {/* Row 3: Project Type Multi-Pills */}
      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-[#E7D9C3]/80 mb-3">
          Disciplines Needed <span className="text-[#E7D9C3]/40">(Select all that apply)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {PROJECT_TYPES.map((type) => {
            const isSelected = formData.projectTypes.includes(type);
            return (
              <button
                type="button"
                key={type}
                onClick={() => toggleProjectType(type)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-sans font-medium transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#C07A5A] text-[#FCF9F4] border border-[#C07A5A]'
                    : 'bg-[#080A0B] text-[#E7D9C3]/75 border border-[#E7D9C3]/15 hover:border-[#E7D9C3]/40'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Row 4: Budget & Timeline Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[#E7D9C3]/80 mb-2">
            Target Budget Range
          </label>
          <select
            id="contact-budget-select"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-[#080A0B] border border-[#E7D9C3]/20 text-[#FCF9F4] text-sm focus:outline-none focus:border-[#C07A5A] transition-colors cursor-pointer"
          >
            {BUDGET_RANGES.map((b) => (
              <option key={b} value={b} className="bg-[#111827] text-[#FCF9F4]">
                {b}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[#E7D9C3]/80 mb-2">
            Desired Launch Window
          </label>
          <select
            id="contact-timeline-select"
            value={formData.timeline}
            onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-[#080A0B] border border-[#E7D9C3]/20 text-[#FCF9F4] text-sm focus:outline-none focus:border-[#C07A5A] transition-colors cursor-pointer"
          >
            {TIMELINES.map((t) => (
              <option key={t} value={t} className="bg-[#111827] text-[#FCF9F4]">
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 5: Message Details */}
      <div>
        <label htmlFor="contact-message" className="block text-xs font-mono uppercase tracking-wider text-[#E7D9C3]/80 mb-2">
          Project Details & Goals <span className="text-[#C07A5A]">*</span>
        </label>
        <textarea
          id="contact-message"
          required
          rows={5}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Tell us what you're building, key constraints, current tech stack, or the outcome you need to achieve..."
          className="w-full px-4 py-3 rounded-xl bg-[#080A0B] border border-[#E7D9C3]/20 text-[#FCF9F4] placeholder-[#E7D9C3]/30 text-sm focus:outline-none focus:border-[#C07A5A] transition-colors resize-none"
        />
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={status === 'loading'}
          id="submit-contact-form-btn"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#C07A5A] hover:bg-[#A96344] text-[#FCF9F4] font-sans font-medium text-sm transition-all duration-200 shadow-lg shadow-[#C07A5A]/30 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Transmitting Inquiry...</span>
            </>
          ) : (
            <>
              <span>Send Project Inquiry</span>
              <StarMotif size={12} color="#FCF9F4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
