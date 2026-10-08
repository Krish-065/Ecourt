'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Scale, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  BookOpen, 
  CheckCircle2, 
  FileText,
  AlertCircle,
  Gavel,
  Search,
  Building,
  GraduationCap,
  User,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import Logo from '../components/Logo';

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
      tagline: 'Grounded constitutional jurisprudence and moot court intelligence',
      points: [
        'Constitutional assembly debates and landmark Supreme Court ratio search',
        'Moot court brief generator with opposing counter-argument simulation',
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
    <div className="space-y-16 py-6 px-4 max-w-5xl mx-auto">
      
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-4xl mx-auto pt-4 md:pt-8">
        
        {/* Modern Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold shadow-2xs">
          <Sparkles className="h-3.5 w-3.5 text-blue-600" />
          <span>Next-Gen AI Legal Operating System for India</span>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
          <span className="font-mono text-[11px] text-blue-600/80">Statutory 2024</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Justice, Grounded in <br className="hidden sm:inline" />
          <span className="text-blue-600">Statutory Precision</span> & Truth
        </h1>

        <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          A modern legal workspace uniting live eCourts CNR tracking, zero-hallucination statutory RAG, and encrypted client vaults. Grounded directly in the Constitution of India, BNS, BNSS, and BSA.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link 
            href="/register" 
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
          >
            <span>Create Authorized Account</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            href="/auth" 
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs border border-slate-200 transition shadow-2xs"
          >
            Sign In to Chambers
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-8 border-t border-slate-200 text-left">
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <ShieldCheck className="h-5 w-5 text-blue-600 mb-2" />
            <div className="text-xs font-bold text-slate-900">Anti-Hallucination</div>
            <div className="text-[11px] text-slate-500">100% cited to Bare Acts</div>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <Lock className="h-5 w-5 text-blue-600 mb-2" />
            <div className="text-xs font-bold text-slate-900">AES-256 Vault</div>
            <div className="text-[11px] text-slate-500">Client privilege protection</div>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <BookOpen className="h-5 w-5 text-blue-600 mb-2" />
            <div className="text-xs font-bold text-slate-900">2023 Codes Active</div>
            <div className="text-[11px] text-slate-500">BNS, BNSS & BSA Ingested</div>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <Scale className="h-5 w-5 text-blue-600 mb-2" />
            <div className="text-xs font-bold text-slate-900">Live eCourts Grid</div>
            <div className="text-[11px] text-slate-500">Sub-second CNR tracking</div>
          </div>
        </div>
      </section>

      {/* Role-Specific Workspaces Section */}
      <section className="space-y-6">
        <div className="text-center space-y-1.5">
          <div className="font-mono text-xs uppercase tracking-widest text-blue-600 font-bold">Tailored Workspaces</div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
            Engineered Specifically for Every Legal Role
          </h2>
          <p className="text-xs md:text-sm text-slate-500 max-w-xl mx-auto">
            Choose your profile to see how eCourt adapts its tools, security safeguards, and AI reasoning.
          </p>
        </div>

        {/* Role Tabs */}
        <div className="flex justify-center">
          <div className="inline-flex p-1.5 bg-slate-100 border border-slate-200 rounded-xl max-w-full overflow-x-auto gap-1">
            <button
              onClick={() => setActiveRoleTab('advocate')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeRoleTab === 'advocate'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Gavel className="w-3.5 h-3.5" />
              <span>Advocates</span>
            </button>
            <button
              onClick={() => setActiveRoleTab('citizen')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeRoleTab === 'citizen'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Citizens</span>
            </button>
            <button
              onClick={() => setActiveRoleTab('student')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeRoleTab === 'student'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Law Students</span>
            </button>
            <button
              onClick={() => setActiveRoleTab('business')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeRoleTab === 'business'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>Corporate</span>
            </button>
          </div>
        </div>

        {/* Active Role Content Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <h3 className="text-xl font-bold text-slate-900">{roleDetails[activeRoleTab].title}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {roleDetails[activeRoleTab].badge}
                </span>
              </div>
              <p className="text-xs text-slate-500">{roleDetails[activeRoleTab].tagline}</p>
            </div>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition shrink-0"
            >
              <span>{roleDetails[activeRoleTab].ctaText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-6">
            {roleDetails[activeRoleTab].points.map((point, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-800 font-medium leading-relaxed">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Call to Action */}
      <section className="p-8 md:p-10 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-blue-950 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-blue-400 font-mono text-xs uppercase tracking-wider font-semibold">
            <Gavel className="h-4 w-4" />
            <span>Digital Chambers Active</span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white">
            Open Your eCourt Chamber Today
          </h3>
          <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
            Join thousands of Advocates, Corporates, Law Scholars, and Litigants building on India's national legal operating system.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <Link 
            href="/register" 
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition shadow-sm"
          >
            <span>Register Chamber</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link 
            href="/auth" 
            className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center border border-slate-700 transition"
          >
            <span>Member Login</span>
          </Link>
        </div>
      </section>

    </div>
  );
}
