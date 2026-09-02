import React from 'react';
import Link from 'next/link';

interface LogoProps {
  variant?: 'light' | 'dark' | 'auto';
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LogoMark({ className = "w-8 h-8", variant = 'dark' }: { className?: string; variant?: 'light' | 'dark' | 'auto' }) {
  // SVG representation matching the interlocking 3D geometric planes from the brand identity board
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="NovaStack Mark"
    >
      <defs>
        {/* Deep Forest Gradient */}
        <linearGradient id="forestGrad" x1="15" y1="20" x2="45" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2A514D" />
          <stop offset="60%" stopColor="#1F3D3A" />
          <stop offset="100%" stopColor="#142B29" />
        </linearGradient>

        {/* Ivory Stone Gradient */}
        <linearGradient id="ivoryGrad" x1="25" y1="20" x2="75" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FCF9F4" />
          <stop offset="40%" stopColor="#F4EFE8" />
          <stop offset="100%" stopColor="#D8CDC0" />
        </linearGradient>

        {/* Terracotta / Copper Gradient */}
        <linearGradient id="copperGrad" x1="55" y1="20" x2="85" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#D98A68" />
          <stop offset="50%" stopColor="#C07A5A" />
          <stop offset="100%" stopColor="#9C5A3E" />
        </linearGradient>

        {/* Metallic Rim Glow */}
        <linearGradient id="goldRim" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E7D9C3" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#C9A06A" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#9C5A3E" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* Left Deep Forest Facet */}
      <path
        d="M 24 16 L 44 26 L 44 84 L 24 74 Z"
        fill="url(#forestGrad)"
      />
      <path
        d="M 12 36 L 24 16 L 24 74 L 12 54 Z"
        fill="#142B29"
        fillOpacity="0.95"
      />

      {/* Center Diagonal Ivory/Cream Facet (Interlocking Stack) */}
      <path
        d="M 24 16 L 68 64 L 68 84 L 24 36 Z"
        fill="url(#ivoryGrad)"
      />
      <path
        d="M 24 36 L 68 84 L 54 90 L 12 42 Z"
        fill="#D8CDC0"
        fillOpacity="0.8"
      />

      {/* Right Terracotta / Copper Facet */}
      <path
        d="M 54 20 L 76 32 L 76 76 L 54 64 Z"
        fill="url(#copperGrad)"
      />
      <path
        d="M 76 32 L 88 40 L 88 68 L 76 76 Z"
        fill="#9C5A3E"
      />

      {/* Rim light highlight line along edge */}
      <path
        d="M 24 16 L 68 64"
        stroke="url(#goldRim)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M 54 20 L 76 32"
        stroke="#E7D9C3"
        strokeWidth="1.2"
        strokeOpacity="0.8"
      />
    </svg>
  );
}

export function Logo({
  variant = 'light',
  showTagline = false,
  size = 'md',
  className = ""
}: LogoProps) {
  const isLightMode = variant === 'light'; // light text on dark background
  
  const sizeMap = {
    sm: { mark: "w-6 h-6", text: "text-lg", tag: "text-[9px]" },
    md: { mark: "w-8 h-8", text: "text-xl", tag: "text-[10px]" },
    lg: { mark: "w-11 h-11", text: "text-2xl sm:text-3xl", tag: "text-xs" },
  };

  const { mark: markSize, text: textSize, tag: tagSize } = sizeMap[size];

  return (
    <Link
      href="/"
      id="site-logo-link"
      className={`inline-flex flex-col group transition-opacity hover:opacity-90 ${className}`}
      aria-label="NovaStack Home"
    >
      <div className="inline-flex items-center gap-2.5 sm:gap-3">
        <LogoMark className={markSize} variant={variant} />
        
        <div className="flex flex-col">
          <div className={`font-sans font-semibold tracking-tight leading-none ${textSize}`}>
            <span className={isLightMode ? "text-[#F4EFE8]" : "text-[#111827]"}>Nova</span>
            <span className="text-[#C07A5A] group-hover:text-[#D98A68] transition-colors">Stack</span>
          </div>

          {showTagline && (
            <div className="mt-1.5 flex items-center gap-2">
              <span className="h-[1px] w-3 bg-[#C07A5A]/50" />
              <span className={`font-sans uppercase tracking-[0.24em] font-medium leading-none ${tagSize} ${
                isLightMode ? "text-[#E7D9C3]/75" : "text-[#1F3D3A]/80"
              }`}>
                DESIGN. DEVELOP. AUTOMATE. SCALE.
              </span>
              <span className="h-[1px] w-3 bg-[#C07A5A]/50" />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export function LogoLockup({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <LogoMark className="w-14 h-14 mb-3" variant="dark" />
      <div className="text-3xl font-semibold tracking-tight">
        <span className="text-[#F4EFE8]">Nova</span>
        <span className="text-[#C07A5A]">Stack</span>
      </div>
      <div className="mt-2 flex items-center justify-center gap-2.5">
        <span className="h-[1px] w-6 bg-[#C07A5A]/60" />
        <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#E7D9C3]/80">
          DESIGN. DEVELOP. AUTOMATE. SCALE.
        </span>
        <span className="h-[1px] w-6 bg-[#C07A5A]/60" />
      </div>
    </div>
  );
}
