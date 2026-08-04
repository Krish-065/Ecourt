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
  Building2
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

  const displayName = user ? (user.fullName || (user as any).full_name || 'User') : 'User';

  const renderCitizenDashboard = () => (
    <div className="space-y-6">
      {/* Citizen Greeting banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 md:p-8 rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-sky-600 text-white shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold">Citizen Legal Portal</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400 text-emerald-950 flex items-center gap-1">
              <UserCheck className="h-3 w-3" /> ACTIVE CITIZEN
            </span>
          </div>
          <p className="text-xs text-indigo-100 font-medium">
            Welcome, {displayName} | Track your case disputes and consult our grounded AI legal guides.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/ai-chat" className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 text-xs font-extrabold flex items-center gap-2 shadow-sm transition">
            <Sparkles className="h-4 w-4 fill-amber-950 text-amber-950" />
            <span>Consult AI Lawyer</span>
          </Link>
        </div>
      </div>

      {/* Citizen Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 w-fit">
            <Globe className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-extrabold text-slate-900">Track My Live Case</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Enter your CNR number or case details to fetch live updates directly from eCourts.
          </p>
          <Link href="/cases" className="inline-flex items-center gap-1 text-xs text-indigo-600 font-bold hover:underline">
            <span>Open Case Finder</span> <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 w-fit">
            <FileText className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-extrabold text-slate-900">FIR & Consumer Complaint Guide</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Step-by-step guidance on lodging Zero FIRs or filing consumer forum complaints.
          </p>
          <Link href="/ai-chat" className="inline-flex items-center gap-1 text-xs text-emerald-600 font-bold hover:underline">
            <span>Draft with AI Assistant</span> <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 w-fit">
            <FolderLock className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-extrabold text-slate-900">Encrypted Client Vault</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Safeguard your FIR copies, notices, and land documents with client-side AES-256 encryption.
          </p>
          <Link href="/vault" className="inline-flex items-center gap-1 text-xs text-amber-700 font-bold hover:underline">
            <span>Manage My Vault</span> <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Citizen Case Info Panel */}
      <div className="p-6 rounded-3xl bg-indigo-50/50 border border-indigo-100 space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-indigo-600" />
          How We Solve Your Legal Problems
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          Navigating laws is hard. Standard models hallucinate acts. ECourt AI uses a highly secure RAG system to check every answer against the official Indian Bare Acts. You get answers you can trust with verified statute numbers.
        </p>
      </div>
    </div>
  );

  const renderAdvocateDashboard = () => (
    <div className="space-y-6">
      {/* Advocate Greeting banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold">Advocate Practice Console</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-amber-950 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" /> VERIFIED ADVOCATE
            </span>
          </div>
          <p className="text-xs text-indigo-100 font-medium">
            Advocate: <strong className="text-white">{displayName}</strong> | Bar ID: <span className="font-mono text-amber-200">{user?.barCouncilId || 'MAH/1234/2015'}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/cases" className="px-4 py-2.5 rounded-2xl bg-white text-slate-900 hover:bg-slate-50 text-xs font-bold flex items-center gap-2 shadow-sm transition">
            <Globe className="h-4 w-4 text-indigo-600" />
            <span>eCourts Live Search</span>
          </Link>
          <Link href="/ai-chat" className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold flex items-center gap-2 shadow-sm transition">
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span>Aura AI</span>
          </Link>
        </div>
      </div>

      {/* Advocate Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Active Cases</span>
            <Briefcase className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">14</span>
            <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" /> +2 this week
            </span>
          </div>
          <p className="text-[11px] text-slate-500">3 Under Trial in Bombay High Court</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Upcoming Hearings</span>
            <CalendarDays className="h-5 w-5 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">4</span>
            <span className="text-[10px] text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Next: In 3 Days</span>
          </div>
          <p className="text-[11px] text-slate-500">Delhi High Court - Bench No. 4</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Client Files</span>
            <FolderLock className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">42</span>
            <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">AES-256 Active</span>
          </div>
          <p className="text-[11px] text-slate-500">148 MB Total Client Documents</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">AI Precedent Speed</span>
            <Zap className="h-5 w-5 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">320 tok/s</span>
            <span className="text-[10px] text-indigo-700 font-bold">Supercore AI</span>
          </div>
          <p className="text-[11px] text-slate-500">Grounded SC/HC Precedents</p>
        </div>
      </div>

      {/* Litigations & Hearing Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-indigo-600" />
              Active Litigation & Case Portfolio
            </h3>
            <Link href="/cases" className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1">
              View All <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Case ID & Title</th>
                  <th className="p-3.5">Court</th>
                  <th className="p-3.5">Statute</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                <tr className="hover:bg-slate-50/80 transition">
                  <td className="p-3.5">
                    <p className="font-extrabold text-slate-900">Priya Verma vs. State of NCT Delhi</p>
                    <p className="text-[10px] text-slate-500 font-mono">EC-DEL-2026-0042</p>
                  </td>
                  <td className="p-3.5 text-slate-700 font-medium">High Court of Delhi</td>
                  <td className="p-3.5 font-mono text-[11px] font-bold text-slate-900">BNS Sec 329 / BNSS 144</td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                      UNDER TRIAL
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/80 transition">
                  <td className="p-3.5">
                    <p className="font-extrabold text-slate-900">Nexus Retail vs. Municipal Corp</p>
                    <p className="text-[10px] text-slate-500 font-mono">CNR: MHAU010048212024</p>
                  </td>
                  <td className="p-3.5 text-slate-700 font-medium">Bombay High Court</td>
                  <td className="p-3.5 font-mono text-[11px] font-bold text-slate-900">Article 226 Constitution</td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-300">
                      ECOURTS SYNCED
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-amber-600" />
            Hearing Schedule
          </h3>
          <div className="p-5 rounded-3xl bg-white border border-amber-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-slate-900">Aug 18, 2026 • 10:30 AM</span>
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300">Court No. 14</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Priya Verma vs. State of NCT Delhi</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Arguments on Interim Injunction & Land Survey</p>
            </div>
            <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-200 text-[11px] text-indigo-950 space-y-1">
              <span className="font-bold text-indigo-800 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-amber-600" /> AI Precedent Tip:
              </span>
              <p className="text-indigo-900 font-medium">Cite *AIR 2023 SC 1450* regarding status quo orders during boundary disputes.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLawStudentDashboard = () => (
    <div className="space-y-6">
      {/* Law Student Greeting banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 md:p-8 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-700 to-indigo-600 text-white shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold">Student Legal Research Hub</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400 text-emerald-950 flex items-center gap-1">
              <GraduationCap className="h-3 w-3" /> LAW STUDENT
            </span>
          </div>
          <p className="text-xs text-indigo-100 font-medium">
            Welcome, {displayName} | Institute Roll ID: <span className="font-mono text-emerald-200">{user?.collegeId || 'NLSIU-2024-089'}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/ai-chat" className="px-4 py-2.5 rounded-2xl bg-white text-emerald-700 hover:bg-emerald-50 text-xs font-extrabold flex items-center gap-2 shadow-sm transition">
            <BookOpen className="h-4 w-4" />
            <span>Search Bare Acts</span>
          </Link>
        </div>
      </div>

      {/* Student Research Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            BNS 2023 vs IPC 1860 Section Comparator
          </h3>
          <p className="text-xs text-slate-500">
            Compare and trace sections between the old Indian Penal Code and the new Bharatiya Nyaya Sanhita (BNS) 2023.
          </p>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="e.g. IPC Section 302..." 
              className="flex-1 glass-input px-3.5 py-2 rounded-xl text-xs" 
            />
            <Link href="/ai-chat" className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1">
              Compare <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <FileText className="h-4 w-4 text-indigo-600" />
            Legal Citation Builder (AIR / SCC / INSC)
          </h3>
          <p className="text-xs text-slate-500">
            Generate properly formatted legal citations for your moot court memorials.
          </p>
          <Link href="/ai-chat" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition">
            <span>Launch Citation Assistant</span> <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );

  const renderBusinessDashboard = () => (
    <div className="space-y-6">
      {/* Business Greeting banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 md:p-8 rounded-3xl bg-gradient-to-r from-sky-700 via-sky-800 to-indigo-700 text-white shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold">Corporate Legal & Compliance</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-300 text-slate-950 flex items-center gap-1">
              <Building2 className="h-3 w-3" /> ENTERPRISE
            </span>
          </div>
          <p className="text-xs text-indigo-100 font-medium">
            Welcome, {displayName} | Corporate Registration: <span className="font-mono text-sky-200">{user?.companyRegNo || 'CIN U72200MH2021PTC123456'}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/vault" className="px-4 py-2.5 rounded-2xl bg-white text-sky-700 hover:bg-sky-50 text-xs font-extrabold flex items-center gap-2 shadow-sm transition">
            <Upload className="h-4 w-4" />
            <span>Upload Agreement</span>
          </Link>
        </div>
      </div>

      {/* Business Tools */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
            <FolderLock className="h-4 w-4 text-sky-600" />
            Contract Risk Scanner
          </h3>
          <p className="text-xs text-slate-500">
            AI audits uploaded agreements for missing liability caps, indemnity risks, and renewal clauses.
          </p>
          <Link href="/vault" className="inline-flex items-center gap-1 text-xs text-sky-600 font-bold hover:underline">
            <span>Analyze Agreements</span> <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
            <ShieldAlert className="h-4 w-4 text-indigo-600" />
            DPDP Act 2023 Compliance
          </h3>
          <p className="text-xs text-slate-500">
            Verify user data collection practices against the Digital Personal Data Protection Act rules.
          </p>
          <Link href="/ai-chat" className="inline-flex items-center gap-1 text-xs text-indigo-600 font-bold hover:underline">
            <span>Run AI DPDP Audit</span> <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
            <BookOpen className="h-4 w-4 text-amber-600" />
            GST & Tax Advisor
          </h3>
          <p className="text-xs text-slate-500">
            Instant guidance on corporate tax liabilities, filings, and dispute resolutions in India.
          </p>
          <Link href="/ai-chat" className="inline-flex items-center gap-1 text-xs text-amber-700 font-bold hover:underline">
            <span>Consult AI Advisor</span> <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );

  // Fallback Role view
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
