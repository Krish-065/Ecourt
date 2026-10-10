'use client';

import React from 'react';
import Link from 'next/link';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

const roleLabels: Record<string, string> = {
  CITIZEN: 'Citizen',
  ADVOCATE: 'Advocate',
  LAW_STUDENT: 'Law Student',
  BUSINESS: 'Corporate',
  ADMIN: 'Administrator',
};

const roleColors: Record<string, string> = {
  CITIZEN: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  ADVOCATE: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  LAW_STUDENT: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  BUSINESS: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  ADMIN: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/65 dark:bg-[#070b14]/65 backdrop-blur-2xl backdrop-saturate-200 border-b border-white/80 dark:border-white/10 text-slate-900 dark:text-white px-5 py-3 flex items-center justify-between shadow-[0_4px_25px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.45)] transition-colors duration-200 select-none">
      {/* Brand Logo */}
      <Link href="/" className="hover:opacity-95 transition-opacity">
        <Logo variant="auto" size="md" />
      </Link>

      {/* Right actions - only theme toggle */}
      <div className="flex items-center gap-3">
        <ThemeToggle />
      </div>
    </header>
  );
}
