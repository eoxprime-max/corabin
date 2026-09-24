import React from 'react';

interface StarMotifProps {
  className?: string;
  size?: number;
  color?: string;
}

export function StarMotif({
  className = "",
  size = 18,
  color = "#C07A5A"
}: StarMotifProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 ${className}`}
      aria-hidden="true"
    >
      {/* Refined 4-point architectural star from Corabin brand board */}
      <path
        d="M 12 0 C 12 6.627 17.373 12 24 12 C 17.373 12 12 17.373 12 24 C 12 17.373 6.627 12 0 12 C 6.627 12 12 6.627 12 0 Z"
        fill={color}
      />
    </svg>
  );
}

export function PillarIcons({
  type,
  className = "w-6 h-6",
  color = "#C07A5A"
}: {
  type: 'future-ready' | 'scalable' | 'automation' | 'growth' | 'design' | 'development' | 'ai';
  className?: string;
  color?: string;
}) {
  switch (type) {
    case 'design':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
          {/* Architectural Drafting Pen / Nib */}
          <path d="M12 2L19 9L15 22L12 17L9 22L5 9L12 2Z" />
          <circle cx="12" cy="11" r="1.5" fill={color} />
          <path d="M12 17V22" />
        </svg>
      );
    case 'development':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
          {/* Clean Code Structure </ > */}
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
          <line x1="14" y1="4" x2="10" y2="20" />
        </svg>
      );
    case 'ai':
    case 'automation':
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Star Spark Orchestration */}
          <path d="M12 2C12 7.5 16.5 12 22 12C16.5 12 12 16.5 12 22C12 16.5 7.5 12 2 12C7.5 12 12 7.5 12 2Z" fill={color} />
          <path d="M19 16C19 17.6 20.4 19 22 19C20.4 19 19 20.4 19 22C19 20.4 17.6 19 16 19C17.6 19 19 17.6 19 16Z" fill="#E7D9C3" />
        </svg>
      );
    case 'future-ready':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
          {/* Target / Radar Concentric Rings */}
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="12" cy="12" r="1" fill={color} />
          <line x1="12" y1="3" x2="12" y2="6" />
          <line x1="12" y1="18" x2="12" y2="21" />
        </svg>
      );
    case 'scalable':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
          {/* Stacked Modular Isometric Planes */}
          <path d="M12 2L2 7L12 12L22 7L12 2Z" />
          <path d="M2 12L12 17L22 12" />
          <path d="M2 17L12 22L22 17" />
        </svg>
      );
    case 'growth':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
          {/* Structural Bar Step Chart + Trend Arrow */}
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
          <polyline points="14 2 22 2 22 10" />
          <line x1="10" y1="14" x2="22" y2="2" />
        </svg>
      );
    default:
      return <StarMotif className={className} color={color} />;
  }
}
