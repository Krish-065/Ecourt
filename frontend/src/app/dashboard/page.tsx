'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  CalendarDays,
  FolderLock,
  Sparkles,
  ShieldCheck,
  Plus,
  Clock,
  FileText,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  UserCheck,
  Globe,
  Zap,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Search,
  Upload,
  User,
  CheckCircle2,
  FileCheck2,
  GraduationCap,
  Building2,
  Scale,
  Shield,
  ExternalLink
} from 'lucide-react';
import { UserProfile } from '../../lib/api';

export default function Dashboard() {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('ecourt_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {}
    } else {
      window.location.href = '/register';
    }
  }, []);

  const displayName = user ? (user.fullName || (user as any).full_name || 'Legal Member') : 'Legal Member';

  const renderCitizenDashboard = () => (
    <div className="space-y-6">
      {/* Citizen Greeting banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-white">Citizen Legal Chamber</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <UserCheck className="h-3 w-3" /> VERIFIED LITIGANT
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Welcome, {displayName}. Access simplified legal guidance, track ongoing dispute statuses, and review your rights under Indian Law.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link 
            href="/ai-chat" 
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition"
          >
            <Sparkles className="h-4 w-4" />
            <span>Consult AI Advisor</span>
          </Link>
        </div>
      </div>

      {/* Citizen Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 hover:border-blue-400 transition">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 w-fit border border-blue-100">
            <Globe className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Track Case Status</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Enter your 16-character CNR number or filing year to fetch live updates from District and High Courts.
          </p>
          <Link href="/cases" className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-semibold transition">
            <span>Open Case Docket</span> <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 hover:border-blue-400 transition">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 w-fit border border-blue-100">
            <FileText className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">FIR & Notice Explanation</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Upload police notices, FIRs, or legal letters to obtain an unbiased, plain-language summary of your obligations.
          </p>
          <Link href="/analyzers" className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-semibold transition">
            <span>Analyze Legal Notice</span> <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 hover:border-blue-400 transition">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 w-fit border border-blue-100">
            <FolderLock className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Personal Evidence Vault</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Securely preserve land registry documents, tenancy agreements, and dispute evidence protected with AES-256 encryption.
          </p>
          <Link href="/vault" className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-semibold transition">
            <span>Access Vault</span> <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Citizen Case Info Panel */}
      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          Guaranteed Statutory Accuracy
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Legal documents can be intimidating. Unlike generic chatbots that hallucinate false sections, eCourt AI anchors every explanation directly in the active Bare Acts of India. Whenever criminal provisions are cited, both the 2023 Bharatiya Nyaya Sanhita (BNS) and historic IPC equivalents are provided.
        </p>
      </div>
    </div>
  );

  const renderAdvocateDashboard = () => (
    <div className="space-y-6">
      {/* Advocate Greeting banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-blue-950 text-white shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-white">Advocate Practice Chambers</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" /> BAR VERIFIED
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300">
            Advocate: <strong className="text-white font-semibold">{displayName}</strong> | Bar Enrollment: <span className="font-mono text-blue-400">{user?.barCouncilId || 'MAH/1234/2015'}</span>
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link 
            href="/cases" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition"
          >
            <Globe className="h-4 w-4 text-blue-400" />
            <span>eCourts Live Sync</span>
          </Link>
          <Link 
            href="/ai-chat" 
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition"
          >
            <Sparkles className="h-4 w-4" />
            <span>AI Co-Counsel</span>
          </Link>
        </div>
      </div>

      {/* Advocate Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 md:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Active Dockets</span>
            <Briefcase className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">14</span>
            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" /> +2 this term
            </span>
          </div>
          <p className="text-[11px] text-slate-500">3 in High Court of Delhi</p>
        </div>

        <div className="p-4 md:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Upcoming Hearings</span>
            <CalendarDays className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">4</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">In 3 Days</span>
          </div>
          <p className="text-[11px] text-slate-500">Delhi HC — Bench No. 4</p>
        </div>

        <div className="p-4 md:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Client Evidence</span>
            <FolderLock className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">42</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">AES-256</span>
          </div>
          <p className="text-[11px] text-slate-500">148 MB Encrypted</p>
        </div>

        <div className="p-4 md:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Statutory Index</span>
            <Scale className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">100%</span>
            <span className="text-[10px] text-blue-600 font-bold font-mono">BNS & BSA</span>
          </div>
          <p className="text-[11px] text-slate-500">Zero Hallucinations</p>
        </div>
      </div>

      {/* Litigations & Hearing Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-blue-600" />
              Active Litigation Portfolio
            </h3>
            <Link href="/cases" className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 transition">
              View All Dockets <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Case Title & Reference</th>
                  <th className="p-3.5">Forum</th>
                  <th className="p-3.5">Active Provisions</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                <tr className="hover:bg-slate-50 transition">
                  <td className="p-3.5">
                    <p className="font-bold text-slate-900">Priya Verma vs. State of NCT Delhi</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">EC-DEL-2026-0042</p>
                  </td>
                  <td className="p-3.5 text-slate-600">High Court of Delhi</td>
                  <td className="p-3.5 font-mono text-[11px] text-slate-900 font-semibold">BNS Sec 329 / BNSS 144</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      UNDER TRIAL
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition">
                  <td className="p-3.5">
                    <p className="font-bold text-slate-900">Nexus Retail vs. Municipal Corporation</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">CNR: MHAU010048212024</p>
                  </td>
                  <td className="p-3.5 text-slate-600">Bombay High Court</td>
                  <td className="p-3.5 font-mono text-[11px] text-slate-900 font-semibold">Art. 226 Constitution</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      LIVE SYNCED
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Next Hearing Details */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-blue-600" />
            Next Scheduled Hearing
          </h3>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
              <span className="font-bold text-slate-900">Aug 18, 2026 • 10:30 AM</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">Court No. 14</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Priya Verma vs. State of NCT Delhi</p>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                Oral arguments on interim status quo and demarcation survey.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-800 space-y-1">
              <span className="font-semibold text-blue-600 flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Precedent Memo:
              </span>
              <p className="text-slate-600 leading-relaxed">
                Refer to <em className="text-slate-900 font-semibold">AIR 2023 SC 1450</em> regarding maintaining status quo during pending boundary survey reports.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLawStudentDashboard = () => (
    <div className="space-y-6">
      {/* Law Student Greeting banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-blue-950 text-white shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-white">Jurisprudence Study Desk</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
              <GraduationCap className="h-3 w-3" /> LAW SCHOLAR
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300">
            Welcome, {displayName} | Enrollment: <span className="font-mono text-blue-400">{user?.collegeId || 'NLSIU-2024-089'}</span>
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link 
            href="/research" 
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition"
          >
            <BookOpen className="h-4 w-4" />
            <span>Statute Concordance</span>
          </Link>
        </div>
      </div>

      {/* Student Research Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-600" />
            BNS 2023 vs IPC 1860 Concordance
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Quickly translate provisions between legacy Indian Penal Code sections and Bharatiya Nyaya Sanhita 2023 with legislative rationale.
          </p>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="e.g. IPC Section 420 or BNS 318..." 
              className="flex-1 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600" 
            />
            <Link 
              href="/research" 
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition flex items-center gap-1.5"
            >
              <span>Compare</span>
              <ArrowRight className="h-3.5 w-3.5 text-blue-400" />
            </Link>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-600" />
            Moot Memorial Citation Builder
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Format Supreme Court of India and High Court authorities into standard Bluebook 21st Edition and Indian Law Institute (ILI) styles.
          </p>
          <Link 
            href="/ai-chat" 
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200 text-xs font-semibold transition"
          >
            <span>Launch Citation Assistant</span> <ChevronRight className="h-3.5 w-3.5 text-blue-600" />
          </Link>
        </div>
      </div>
    </div>
  );

  const renderBusinessDashboard = () => (
    <div className="space-y-6">
      {/* Business Greeting banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-blue-950 text-white shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-white">Corporate Governance & Compliance</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
              <Building2 className="h-3 w-3" /> ENTERPRISE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300">
            Organization: <strong className="text-white font-semibold">{displayName}</strong> | CIN: <span className="font-mono text-blue-400">{user?.companyRegNo || 'U72200MH2021PTC123456'}</span>
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link 
            href="/analyzers" 
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition"
          >
            <Upload className="h-4 w-4" />
            <span>Audit Agreement</span>
          </Link>
        </div>
      </div>

      {/* Business Tools */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 hover:border-blue-400 transition">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 w-fit border border-blue-100">
            <FolderLock className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Contract Risk Auditor</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Scans master service agreements for missing indemnity caps, ambiguous termination clauses, and non-compete liabilities.
          </p>
          <Link href="/analyzers" className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold transition">
            <span>Run Contract Audit</span> <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 hover:border-blue-400 transition">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 w-fit border border-blue-100">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">DPDP Act 2023 Check</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Verify consumer data processing, consent notices, and data principal grievances against the Digital Personal Data Protection Act.
          </p>
          <Link href="/ai-chat" className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold transition">
            <span>Run DPDP Review</span> <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 hover:border-blue-400 transition">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 w-fit border border-blue-100">
            <BookOpen className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Corporate Litigation Docket</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Monitor company filings, arbitration proceedings, and statutory compliance hearings across NCLT benches nationwide.
          </p>
          <Link href="/cases" className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold transition">
            <span>Track Corporate Dockets</span> <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );

  const renderDashboardByRole = () => {
    switch (user?.role) {
      case 'CITIZEN':
        return renderCitizenDashboard();
      case 'ADVOCATE':
        return renderAdvocateDashboard();
      case 'LAW_STUDENT':
        return renderLawStudentDashboard();
      case 'BUSINESS':
        return renderBusinessDashboard();
      default:
        return renderAdvocateDashboard();
    }
  };

  return (
    <div className="space-y-6">
      {renderDashboardByRole()}
    </div>
  );
}
