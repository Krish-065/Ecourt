'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Scale, 
  ShieldCheck, 
  Lock, 
  BookOpen, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="w-full mt-20 border-t border-slate-200/90 dark:border-slate-800/80 bg-white/85 dark:bg-[#070b14]/95 backdrop-blur-xl transition-colors duration-300">
      
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 items-start">
          
          {/* Column 1: Brand & Identity (Spans 2 cols on desktop) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block hover:opacity-95 transition-opacity">
              <Logo variant="auto" size="md" />
            </Link>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              India’s dedicated AI legal workspace for judicial intelligence, live eCourts CNR docket sync, zero-hallucination Bare Act statutory research, and end-to-end privileged chamber vaults.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-slate-500 dark:text-slate-400">
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300">
                Statutory Engine v2.4
              </span>
              <span>100% Bare Act Cited</span>
            </div>
          </div>

          {/* Column 2: Chambers & Roles */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 font-mono">
              Chambers & Portals
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <li>
                <Link href="/register" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Advocate Suite
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Citizen Legal Aid
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Law Student Desk
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Corporate Counsel
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Statutory Corpus */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 font-mono">
              Statutory Corpus
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                <span>Bharatiya Nyaya Sanhita</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                <span>Nagarik Suraksha (BNSS)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                <span>Sakshya Adhiniyam (BSA)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                <span>Constitution of India</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Security Architecture */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 font-mono">
              Security & Trust
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <li className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>AES-256 Vault Privilege</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>DPDPA 2023 Aligned</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>Sec 65B Electronic Proof</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span>eCourts Live Grid Sync</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Symmetrical Bottom Legal & Copyright Bar */}
      <div className="border-t border-slate-200/80 dark:border-slate-800/80 py-5 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} eCourt AI OS. Grounded in the statutory laws of the Republic of India.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-5 text-[11px] font-medium">
            <span className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">
              Statutory Disclaimers
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">
              Data Privacy
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">
              Chamber Terms
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">
              Security Architecture
            </span>
          </div>
        </div>
      </div>

    </footer>
  );
}
