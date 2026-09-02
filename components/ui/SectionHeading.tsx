import React from 'react';
import { StarMotif } from './StarMotif';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  theme?: 'dark' | 'light';
  className?: string;
  id?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  highlight,
  subtitle,
  align = 'left',
  theme = 'dark',
  className = "",
  id
}: SectionHeadingProps) {
  const isDark = theme === 'dark';
  const alignClass = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  }[align];

  return (
    <div id={id} className={`flex flex-col ${alignClass} ${className}`}>
      {eyebrow && (
        <div className="inline-flex items-center gap-2 mb-3 sm:mb-4">
          <StarMotif size={12} color={isDark ? "#C07A5A" : "#1F3D3A"} />
          <span className={`text-xs uppercase tracking-[0.22em] font-medium ${
            isDark ? "text-[#E7D9C3]/80" : "text-[#1F3D3A]/85"
          }`}>
            {eyebrow}
          </span>
        </div>
      )}

      <h2 className={`font-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight leading-[1.12] ${
        isDark ? "text-[#FCF9F4]" : "text-[#111827]"
      }`}>
        {title}{" "}
        {highlight && (
          <span className="font-serif italic font-normal text-[#C07A5A] ml-1">
            {highlight}
          </span>
        )}
      </h2>

      {subtitle && (
        <p className={`mt-4 sm:mt-5 text-base sm:text-lg md:text-xl font-normal leading-relaxed max-w-2xl ${
          isDark ? "text-[#E7D9C3]/75" : "text-[#1F3D3A]/80"
        }`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
