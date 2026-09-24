import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  variant?: 'light' | 'dark' | 'auto';
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LogoMark({
  className = "w-8 h-8",
  variant = 'light',
  alt = "Corabin Logo",
}: {
  className?: string;
  variant?: 'light' | 'dark' | 'auto';
  alt?: string;
}) {
  // Use Corabin_Logo_white.png for dark theme sections (variant === 'light' or default)
  // Use Corabin_Logo_black.png for light theme sections (variant === 'dark')
  const isLightBg = variant === 'dark';
  const logoSrc = isLightBg
    ? "/images/corabin-logo-black.png"
    : "/images/corabin-logo-white.png";

  return (
    <div className={`relative shrink-0 ${className}`}>
      <Image
        src={logoSrc}
        alt={alt}
        fill
        sizes="128px"
        className="object-contain"
        priority
      />
    </div>
  );
}

export function Logo({
  variant = 'light',
  showTagline = false,
  size = 'md',
  className = ""
}: LogoProps) {
  const isLightMode = variant === 'light'; // light text/logo on dark background
  
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
      aria-label="Corabin Home"
    >
      <div className="inline-flex items-center gap-2.5 sm:gap-3">
        <LogoMark className={markSize} variant={variant} alt="Corabin Logo" />
        
        <div className="flex flex-col">
          <div className={`font-sans font-semibold tracking-tight leading-none ${textSize}`}>
            <span className={isLightMode ? "text-[#F4EFE8]" : "text-[#111827]"}>Cora</span>
            <span className="text-[#C07A5A] group-hover:text-[#D98A68] transition-colors">bin</span>
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
      <LogoMark className="w-14 h-14 mb-3" variant="light" alt="Corabin Logo" />
      <div className="text-3xl font-semibold tracking-tight">
        <span className="text-[#F4EFE8]">Cora</span>
        <span className="text-[#C07A5A]">bin</span>
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
