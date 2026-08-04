'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Scale, ShieldCheck, Bell, Sparkles, Search, ChevronDown, UserPlus, LogIn, Rocket, LogOut, Gavel } from 'lucide-react';
import { UserProfile } from '../lib/api';

export default function Navbar() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('ecourt_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('ecourt_user');
    setUser(null);
    window.location.href = '/';
  };

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'ADVOCATE': return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'LAW_STUDENT': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'BUSINESS': return 'bg-sky-50 text-sky-700 border-sky-200';
      default: return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm">
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-sky-500 flex items-center justify-center shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
            <Scale className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
              ECourt <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold">AI Legal OS</span>
            </span>
            <p className="text-[10px] text-slate-500 font-medium">Jurisdiction: Supreme Court & All High Courts of India</p>
          </div>
        </Link>
      </div>

      {/* Quick Search */}
      <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 w-72 text-xs text-slate-500 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition">
        <Search className="h-4 w-4 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search Indian Constitution, BNS, BNSS, Consumer Act, eCourts..." 
          className="bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none w-full text-xs"
        />
        <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 bg-white rounded border border-slate-200 shadow-2xs">⌘K</kbd>
      </div>

      {/* User Actions & Role Navigation */}
      <div className="flex items-center gap-2.5">
        {user && (
          <>
            <Link href="/advocates" className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold transition">
              <Gavel className="h-3.5 w-3.5 text-indigo-600 animate-pulse" />
              <span>Find Advocate</span>
            </Link>

            <Link href="/ai-chat" className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>Aura AI</span>
            </Link>
          </>
        )}

        {user ? (
          /* Role Profile Badge & Dropdown */
          <div className="relative">
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 p-1 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-400 transition shadow-2xs focus:outline-none"
            >
              <div className="h-8 w-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                {(user.fullName || user.full_name || 'User').charAt(0)}
              </div>
              <div className="hidden md:block text-left pr-1">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-900">{user.fullName || user.full_name || 'User'}</span>
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                </div>
                <span className={`text-[9px] px-1.5 py-0.2 rounded border font-bold inline-block ${getRoleBadgeColor(user.role)}`}>
                  {user.role}
                </span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 pr-1" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 text-xs font-bold text-slate-700 animate-in fade-in-50 slide-in-from-top-2 duration-150">
                <Link 
                  href="/dashboard" 
                  onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2 hover:bg-slate-100 transition"
                >
                  My Dashboard
                </Link>
                <Link 
                  href="/vault" 
                  onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2 hover:bg-slate-100 transition"
                >
                  Document Vault
                </Link>
                <div className="h-px bg-slate-100 my-1"></div>
                <button 
                  onClick={() => { setDropdownOpen(false); handleLogout(); }}
                  className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 transition flex items-center gap-2"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Sign In CTA if not logged in */
          <div className="flex items-center gap-2">
            <Link 
              href="/auth" 
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition flex items-center gap-1.5"
            >
              <LogIn className="h-3.5 w-3.5 text-indigo-600" />
              <span>Sign In</span>
            </Link>
            <Link 
              href="/register" 
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <UserPlus className="h-3.5 w-3.5 text-indigo-200" />
              <span>Register</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
