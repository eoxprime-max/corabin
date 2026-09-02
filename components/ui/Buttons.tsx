'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'terracotta' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  showArrow?: boolean;
  arrowType?: 'up-right' | 'right';
  className?: string;
  id?: string;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  showArrow = false,
  arrowType = 'up-right',
  className = "",
  id,
  ...props
}: ButtonProps) {
  const baseStyles = "group relative inline-flex items-center justify-center font-sans font-medium tracking-wide transition-all duration-300 select-none disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C07A5A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080A0B]";

  const sizeStyles = {
    sm: "text-xs px-4 py-2 gap-1.5 rounded-full",
    md: "text-sm px-6 py-3 gap-2 rounded-full",
    lg: "text-base px-8 py-4 gap-2.5 rounded-full",
  };

  const variantStyles = {
    primary: "bg-[#111827] text-[#FCF9F4] border border-[#E7D9C3]/20 hover:bg-[#1F3D3A] hover:border-[#C07A5A]/50 hover:shadow-lg hover:shadow-[#000000]/40",
    terracotta: "bg-[#C07A5A] text-[#FCF9F4] border border-[#D98A68]/40 hover:bg-[#B56E4D] hover:border-[#E7D9C3]/50 hover:shadow-lg hover:shadow-[#C07A5A]/25",
    secondary: "bg-[#FCF9F4]/10 text-[#FCF9F4] border border-[#E7D9C3]/25 backdrop-blur-sm hover:bg-[#FCF9F4]/15 hover:border-[#E7D9C3]/50",
    outline: "bg-transparent text-[#111827] border border-[#111827]/25 hover:bg-[#111827] hover:text-[#FCF9F4]",
    ghost: "bg-transparent text-[#FCF9F4] hover:bg-[#FCF9F4]/10",
  };

  const ArrowIcon = arrowType === 'up-right' ? ArrowUpRight : ArrowRight;

  const content = (
    <>
      <span className="relative z-10">{children}</span>
      {showArrow && (
        <ArrowIcon className="w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      )}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        id={id}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      id={id}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {content}
    </button>
  );
}

export function PillTag({
  children,
  variant = 'forest',
  className = "",
  id
}: {
  children: React.ReactNode;
  variant?: 'forest' | 'terracotta' | 'sage' | 'sand' | 'midnight';
  className?: string;
  id?: string;
}) {
  const styles = {
    forest: "bg-[#1F3D3A]/60 text-[#A7B89E] border-[#1F3D3A]",
    terracotta: "bg-[#C07A5A]/15 text-[#C07A5A] border-[#C07A5A]/30",
    sage: "bg-[#A7B89E]/15 text-[#A7B89E] border-[#A7B89E]/30",
    sand: "bg-[#E7D9C3]/15 text-[#E7D9C3] border-[#E7D9C3]/30",
    midnight: "bg-[#111827] text-[#FCF9F4]/80 border-[#E7D9C3]/15",
  };

  return (
    <span
      id={id}
      className={`inline-flex items-center px-3 py-1 text-xs font-sans font-medium tracking-wide uppercase rounded-full border backdrop-blur-xs whitespace-nowrap ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
