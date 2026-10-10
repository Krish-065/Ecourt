'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.add('theme-transition');
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);

    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 400);
  };

  if (!mounted) {
    return (
      <div className="w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700" />
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
      className={`relative w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer select-none group
        ${isDark
          ? 'bg-slate-800/95 hover:bg-slate-700 border-2 border-slate-700 hover:border-amber-400/50 shadow-md shadow-black/40 text-amber-400'
          : 'bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-blue-400/50 shadow-sm hover:shadow-md text-slate-700'
        }`}
    >
      {/* Ambient soft glow on hover */}
      <div className={`absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none ${
        isDark ? 'bg-amber-400' : 'bg-blue-400'
      }`} />

      {/* Single Icon (Sun when Dark, Moon when Light) */}
      {isDark ? (
        <Sun className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45 relative z-10 fill-amber-400/20" />
      ) : (
        <Moon className="w-5 h-5 transition-transform duration-300 group-hover:-rotate-12 relative z-10 fill-slate-700/15" />
      )}
    </button>
  );
}
