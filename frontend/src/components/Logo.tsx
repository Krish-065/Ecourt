'use client';

import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ variant = 'dark', size = 'md' }: LogoProps) {
  const isLight = variant === 'light';

  const pixelDimensions = {
    sm: { box: 28, svg: 16 },
    md: { box: 36, svg: 20 },
    lg: { box: 48, svg: 26 },
  };

  const dim = pixelDimensions[size] || pixelDimensions.md;

  const iconClasses = {
    sm: 'h-7 w-7',
    md: 'h-9 w-9',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex items-center gap-2.5 select-none shrink-0">
      {/* Official Geometric Judicial Shield SVG */}
      <div 
        style={{ width: `${dim.box}px`, height: `${dim.box}px` }}
        className={`${iconClasses[size]} relative flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-slate-900 shadow-md shadow-blue-500/15 shrink-0 p-1.5 ring-1 ring-white/10`}
      >
        <svg
          width={dim.svg}
          height={dim.svg}
          style={{ width: `${dim.svg}px`, height: `${dim.svg}px`, maxWidth: '100%', maxHeight: '100%' }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white shrink-0"
        >
          {/* Pillar / Stand */}
          <path d="M12 3v15" />
          <path d="M7 21h10" />
          <path d="M10 3h4" />
          {/* Beam */}
          <path d="M4 7h16" />
          {/* Left Pan */}
          <path d="m4 7 3 5" />
          <path d="m4 7-3 5" />
          <path d="M1 12c.5 1.5 2 2 3 2s2.5-.5 3-2H1Z" fill="currentColor" fillOpacity="0.2" />
          {/* Right Pan */}
          <path d="m20 7 3 5" />
          <path d="m20 7-3 5" />
          <path d="M17 12c.5 1.5 2 2 3 2s2.5-.5 3-2h-6Z" fill="currentColor" fillOpacity="0.2" />
          {/* Apex Star */}
          <circle cx="12" cy="3" r="1" fill="#60A5FA" />
        </svg>
      </div>

      <div className="flex flex-col leading-tight">
        <div className="flex items-baseline gap-0.5">
          <span className="font-extrabold text-blue-500 tracking-tight text-lg">e</span>
          <span className={`font-bold tracking-tight text-lg ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Court
          </span>
          <span className="ml-1.5 px-1 py-0.2 rounded text-[9px] font-mono font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            AI OS
          </span>
        </div>
        <span className={`text-[10px] font-medium tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
          Judicial Intelligence
        </span>
      </div>
    </div>
  );
}
