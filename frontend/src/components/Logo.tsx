'use client';

import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark' | 'auto';
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ variant = 'auto', size = 'md' }: LogoProps) {
  const isExplicitLight = variant === 'light';
  const isExplicitDark = variant === 'dark';

  const pixelDimensions = {
    sm: { box: 32, svg: 18, text: 'text-lg', sub: 'text-[9px]' },
    md: { box: 40, svg: 22, text: 'text-xl', sub: 'text-[10px]' },
    lg: { box: 48, svg: 26, text: 'text-2xl', sub: 'text-[11px]' },
  };

  const dim = pixelDimensions[size] || pixelDimensions.md;

  return (
    <div className="flex items-center gap-3 select-none shrink-0 group cursor-pointer">
      {/* Brand-New Modern Judicial Crest Emblem */}
      <div 
        style={{ width: `${dim.box}px`, height: `${dim.box}px` }}
        className="relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 shadow-md shadow-blue-500/25 border border-white/20 dark:border-white/10 group-hover:scale-105 group-hover:shadow-blue-500/40 transition-all duration-300"
      >
        {/* Specular glass reflection sheen */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-transparent via-white/10 to-white/25 pointer-events-none" />

        <svg
          width={dim.svg}
          height={dim.svg}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white relative z-10 transition-transform duration-300 group-hover:rotate-3"
        >
          {/* Sovereign Scales of Justice & Constitutional Pillar */}
          <path d="m3 7 3-3h12l3 3" />
          <path d="M12 4v16" />
          <path d="M8 20h8" />
          {/* Left balance scale */}
          <path d="M6 7l-3 6" />
          <path d="M6 7l3 6" />
          <path d="M2.5 13h7a3.5 3.5 0 0 1-7 0Z" fill="currentColor" fillOpacity="0.25" />
          {/* Right balance scale */}
          <path d="M18 7l-3 6" />
          <path d="M18 7l3 6" />
          <path d="M14.5 13h7a3.5 3.5 0 0 1-7 0Z" fill="currentColor" fillOpacity="0.25" />
          {/* Apex truth diamond */}
          <circle cx="12" cy="4" r="1.5" fill="#93C5FD" stroke="none" />
        </svg>
      </div>

      {/* Brand Name & Tagline (AI OS completely removed) */}
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline tracking-tight">
          <span className="font-extrabold text-blue-600 dark:text-blue-400 text-xl md:text-2xl font-sans">
            e
          </span>
          <span className={`font-black tracking-tight text-xl md:text-2xl font-sans ${
            isExplicitLight ? 'text-slate-900' : isExplicitDark ? 'text-white' : 'text-slate-900 dark:text-white'
          }`}>
            Court
          </span>
        </div>
        <span className={`font-mono font-bold tracking-[0.2em] uppercase text-[9px] mt-1 ${
          isExplicitLight ? 'text-slate-500' : isExplicitDark ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'
        }`}>
          Judicial Intelligence
        </span>
      </div>
    </div>
  );
}
