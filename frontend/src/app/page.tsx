'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  Scale, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  BookOpen, 
  CheckCircle2, 
  Gavel, 
  Building, 
  GraduationCap, 
  User, 
  ChevronRight 
} from 'lucide-react';
import Footer from '../components/Footer';

// Interactive Cursor Spotlight Button Component
function SpotlightButton({
  href,
  variant,
  children,
  className = '',
}: {
  href: string;
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
  className?: string;
}) {
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setCursor({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const isPrimary = variant === 'primary';

  return (
    <Link
      ref={buttonRef}
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className={`relative inline-flex items-center justify-center rounded-2xl overflow-hidden font-semibold text-xs transition-all duration-300 select-none group ${className}`}
      style={{ minWidth: '175px', height: '48px' }}
    >
      {/* 1. Base Layer (Normal state) */}
      <div
        className={`absolute inset-0 flex items-center justify-center gap-2 px-6 transition-all duration-300 ${
          isPrimary
            ? 'bg-blue-600 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25 border border-blue-400/30'
            : 'bg-white/85 dark:bg-slate-900/80 text-slate-800 dark:text-slate-100 border border-slate-200/90 dark:border-slate-700/80 shadow-md backdrop-blur-xl'
        }`}
      >
        {children}
      </div>

      {/* 2. Cursor Spotlight Layer (Only active around cursor position) */}
      <div
        className={`absolute inset-0 flex items-center justify-center gap-2 px-6 pointer-events-none transition-opacity duration-200 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        } ${
          isPrimary
            ? 'bg-white text-blue-700 font-bold border border-white shadow-xl'
            : 'bg-blue-600 text-white font-bold border border-blue-400 shadow-xl'
        }`}
        style={{
          clipPath: isHovered
            ? `circle(75px at ${cursor.x}px ${cursor.y}px)`
            : 'circle(0px at 0px 0px)',
          transition: 'clip-path 0.08s ease-out, opacity 0.2s ease',
        }}
      >
        {children}
      </div>

      {/* Specular subtle edge sheen */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none ring-1 ring-inset ring-white/20" />
    </Link>
  );
}

export default function Home() {
  const [activeRoleTab, setActiveRoleTab] = useState<'citizen' | 'advocate' | 'student' | 'business'>('advocate');

  const roleDetails = {
    advocate: {
      title: 'Advocates & Legal Practitioners',
      tagline: 'Accelerated case preparation with verified statutory Bare Act citations',
      points: [
        'Automatic CNR case tracking across 3,000+ District and High Courts',
        'AI Co-Counsel referencing Bharatiya Nyaya Sanhita (BNS 2023) & IPC concordance',
        'Privilege-grade AES-256 evidence vault with tamper-evident metadata',
        'Automated drafting of writ petitions, bail applications, and rejoinders'
      ],
      ctaText: 'Access Advocate Suite',
      badge: 'Bar Council Verified'
    },
    citizen: {
      title: 'Citizens & Litigants',
      tagline: 'Demystifying the Indian justice system with plain-language legal clarity',
      points: [
        'Instant status breakdown of hearings, orders, and next dates using your CNR number',
        'FIR and Legal Notice Analyzer that explains obligations in simple language',
        'Step-by-step guidance on consumer forums, tenant disputes, and family law',
        'Verified Advocate Directory to find local bar-certified counsel without middlemen'
      ],
      ctaText: 'Check Your Legal Rights',
      badge: 'Public Legal Aid'
    },
    student: {
      title: 'Law Students & Researchers',
      tagline: 'Grounded constitutional jurisprudence and legal research intelligence',
      points: [
        'Constitutional assembly debates and landmark Supreme Court ratio search',
        'Legal appellate brief generator with opposing counter-argument simulation',
        'Interactive statutory cross-mapper: IPC to BNS, CrPC to BNSS, IEA to BSA',
        'Direct citation generation conforming to Bluebook and Indian standard formats'
      ],
      ctaText: 'Explore Student Portal',
      badge: 'Academic Jurisprudence'
    },
    business: {
      title: 'Corporate Legal & Compliance',
      tagline: 'Proactive contract risk detection and statutory regulatory monitoring',
      points: [
        'Contract audit engine for indemnification, non-compete, and arbitration vulnerabilities',
        'Corporate dispute tracking across NCLT, NCLAT, and Commercial Courts',
        'Real-time regulatory compliance mapping for Indian corporate and labor laws',
        'Multi-stakeholder vault sharing with role-based document access controls'
      ],
      ctaText: 'Start Corporate Audit',
      badge: 'Enterprise Governance'
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between relative overflow-hidden bg-gradient-to-b from-slate-50 via-slate-50/50 to-white dark:from-[#070b14] dark:via-[#090e1c] dark:to-[#070b14] transition-colors duration-300">
      
      {/* Ambient background mesh glow behind hero */}
      <div className="absolute top-[-8rem] left-1/2 -translate-x-1/2 w-[48rem] h-[28rem] bg-gradient-to-b from-blue-500/20 via-indigo-500/10 to-transparent dark:from-blue-600/20 dark:via-indigo-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[24rem] right-[-6rem] w-[28rem] h-[28rem] bg-sky-500/15 dark:bg-sky-600/10 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* Main Landing Page Content */}
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-12 space-y-16">
        
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto">
          
          {/* Main Headline (Static Original Sentence) */}
          <div className="select-none pb-2">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Justice, Grounded in <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 dark:from-blue-400 dark:via-sky-300 dark:to-indigo-300 bg-clip-text text-transparent">
                Statutory Precision
              </span> & Truth
            </h1>
          </div>

          {/* Subtitle Paragraph */}
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-normal pt-4 sm:pt-6">
            A modern legal workspace uniting live eCourts CNR tracking, zero-hallucination statutory RAG, and encrypted client vaults. Grounded directly in the Constitution of India, BNS, BNSS, and BSA.
          </p>

          {/* Action Buttons with Interactive Cursor Hover Spotlight Effect */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <SpotlightButton href="/register" variant="primary">
              <span>Create Account</span>
              <ArrowRight className="h-4 w-4" />
            </SpotlightButton>

            <SpotlightButton href="/auth" variant="secondary">
              <span>Sign In</span>
            </SpotlightButton>
          </div>

          {/* The 4 Hero Feature Badges (Enhanced High-Visibility Liquid Glass) */}
          <div className="relative pt-12">
            {/* Ambient colorful backdrop behind cards to make frosted glass shimmer visibly */}
            <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-r from-blue-500/15 via-indigo-500/10 to-sky-500/15 dark:from-blue-600/20 dark:via-indigo-600/15 dark:to-sky-600/20 rounded-3xl blur-2xl -z-10" />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4 text-left">
              
              {/* Card 1: Anti-Hallucination */}
              <div className="visible-glass-card p-4 sm:p-5 cursor-default group">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200 shadow-xs">
                  <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  Anti-Hallucination
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  100% cited to Bare Acts
                </div>
              </div>

              {/* Card 2: AES-256 Vault */}
              <div className="visible-glass-card p-4 sm:p-5 cursor-default group">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200 shadow-xs">
                  <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  AES-256 Vault
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  Client privilege protection
                </div>
              </div>

              {/* Card 3: 2023 Codes Active */}
              <div className="visible-glass-card p-4 sm:p-5 cursor-default group">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200 shadow-xs">
                  <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  2023 Codes Active
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  BNS, BNSS & BSA Ingested
                </div>
              </div>

              {/* Card 4: Live eCourts Grid */}
              <div className="visible-glass-card p-4 sm:p-5 cursor-default group">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200 shadow-xs">
                  <Scale className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  Live eCourts Grid
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  Sub-second CNR tracking
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Role-Specific Workspaces Section */}
        <section className="space-y-8 pt-4">
          <div className="text-center space-y-2">
            <div className="font-mono text-xs uppercase tracking-widest text-blue-600 dark:text-blue-400 font-bold">
              Tailored Workspaces
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Engineered Specifically for Every Legal Role
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
              Choose your profile to see how eCourt adapts its tools, security safeguards, and AI reasoning.
            </p>
          </div>

          {/* Role Tabs */}
          <div className="flex justify-center">
            <div className="inline-flex p-1.5 bg-slate-200/60 dark:bg-slate-800/60 border border-slate-300/60 dark:border-slate-700/60 rounded-2xl max-w-full overflow-x-auto gap-1 backdrop-blur-md">
              <button
                onClick={() => setActiveRoleTab('advocate')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  activeRoleTab === 'advocate'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <Gavel className="w-3.5 h-3.5" />
                <span>Advocates</span>
              </button>
              <button
                onClick={() => setActiveRoleTab('citizen')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  activeRoleTab === 'citizen'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Citizens</span>
              </button>
              <button
                onClick={() => setActiveRoleTab('student')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  activeRoleTab === 'student'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Law Students</span>
              </button>
              <button
                onClick={() => setActiveRoleTab('business')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  activeRoleTab === 'business'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                <span>Corporate</span>
              </button>
            </div>
          </div>

          {/* Active Role Content Card (Visible Frosted Glass Surface) */}
          <div className="visible-glass-card p-6 sm:p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-6 border-b border-slate-200/80 dark:border-slate-800/80">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {roleDetails[activeRoleTab].title}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/20 font-mono">
                    {roleDetails[activeRoleTab].badge}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                  {roleDetails[activeRoleTab].tagline}
                </p>
              </div>

              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold transition-all shadow-sm hover:shadow shrink-0 group"
              >
                <span>{roleDetails[activeRoleTab].ctaText}</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Feature Points Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 pt-6">
              {roleDetails[activeRoleTab].points.map((point, idx) => (
                <div 
                  key={idx} 
                  className="flex items-start gap-3.5 p-4 rounded-xl bg-white/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 hover:border-blue-300 dark:hover:border-blue-500/40 transition-colors duration-200 shadow-2xs"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>

      {/* Clean, Aligned Legal OS Footer */}
      <Footer />

    </div>
  );
}
