import React from 'react';
import { StarMotif } from './StarMotif';

interface EditorialDividerProps {
  theme?: 'dark' | 'light';
  showStar?: boolean;
  className?: string;
}

export function EditorialDivider({
  theme = 'dark',
  showStar = false,
  className = ""
}: EditorialDividerProps) {
  const isDark = theme === 'dark';
  const lineColor = isDark ? "border-[#E7D9C3]/15" : "border-[#1F3D3A]/15";
  const starColor = isDark ? "#C07A5A" : "#1F3D3A";

  if (showStar) {
    return (
      <div className={`relative flex items-center justify-center py-6 sm:py-8 ${className}`}>
        <div className={`grow border-t ${lineColor}`} />
        <div className="mx-4 shrink-0 flex items-center justify-center">
          <StarMotif size={14} color={starColor} />
        </div>
        <div className={`grow border-t ${lineColor}`} />
      </div>
    );
  }

  return (
    <div className={`border-t ${lineColor} ${className}`} />
  );
}
