'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ChevronDown, LogIn, LogOut, User } from 'lucide-react';
import Logo from './Logo';
import { UserProfile } from '../lib/api';

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
  const pathname = usePathname();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('ecourt_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {}
    }
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('ecourt_user');
    localStorage.removeItem('ecourt_token');
    setUser(null);
    window.location.href = '/';
  };

  const displayName = user ? (user.fullName || (user as any).full_name || 'User') : '';

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-white px-5 py-3 flex items-center justify-between shadow-md">
      {/* Brand Logo */}
      <Link href="/" className="hover:opacity-95 transition-opacity">
        <Logo variant="dark" size="md" />
      </Link>

      {/* Center search — only when logged in */}
      {user && (
        <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 w-80 text-xs text-slate-300 focus-within:border-blue-500 transition shadow-inner">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search statutes, cases, bare acts..."
            className="bg-transparent text-white placeholder-slate-400 focus:outline-none w-full text-xs"
          />
          <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-700/60 rounded border border-slate-600">
            /
          </kbd>
        </div>
      )}

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl hover:bg-slate-800 transition border border-transparent hover:border-slate-700"
            >
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xs text-white shadow-sm">
                {displayName ? displayName[0].toUpperCase() : 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-white leading-tight">{displayName}</p>
                <span className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-medium border ${roleColors[user.role || 'CITIZEN']}`}>
                  {roleLabels[user.role || 'CITIZEN'] || 'Member'}
                </span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 rounded-xl border border-slate-700 shadow-xl py-1.5 z-50 text-xs">
                <div className="px-4 py-2 border-b border-slate-800">
                  <p className="text-xs font-bold text-white">{displayName}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  <span className={`inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-semibold border ${roleColors[user.role || 'CITIZEN']}`}>
                    {roleLabels[user.role || 'CITIZEN']} Profile
                  </span>
                </div>

                <Link
                  href="/dashboard"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 transition"
                >
                  <User className="h-3.5 w-3.5 text-blue-400" />
                  <span>Chamber Dashboard</span>
                </Link>

                <div className="border-t border-slate-800 my-1" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-rose-400 hover:bg-rose-500/10 transition text-left"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/auth"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 transition"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-sm"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
