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
  Gavel,
  ExternalLink
} from 'lucide-react';
import { UserProfile } from '../../lib/api';

export default function Dashboard() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [liveCases, setLiveCases] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('ecourt_user');
    const token = localStorage.getItem('ecourt_token');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {}
    } else {
      window.location.href = '/register';
    }

    if (token) {
      fetch('http://localhost:5000/api/v1/cases', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data && data.data.length > 0) {
            setLiveCases(data.data);
          }
        })
        .catch(() => {});
    }
  }, []);

  const displayName = user ? (user.fullName || (user as any).full_name || 'Legal Member') : 'Legal Member';

  // ==========================================
  // CITIZEN DASHBOARD
  // ==========================================
  const renderCitizenDashboard = () => (
    <div className="space-y-6">
      {/* Citizen Greeting Banner - Dynamic color (Royal Blue in White theme, Dark Slate in Dark theme) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 dark:from-slate-900 dark:to-slate-900 border border-blue-500/30 dark:border-slate-800 text-white p-6 md:p-8 shadow-xl shadow-blue-600/15 dark:shadow-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">Citizen Legal Chamber</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 dark:bg-emerald-500/15 text-white dark:text-emerald-400 border border-white/30 dark:border-emerald-500/30 flex items-center gap-1">
                <UserCheck className="h-3 w-3" /> VERIFIED LITIGANT
              </span>
            </div>
            <p className="text-xs sm:text-sm text-blue-100 dark:text-slate-300 max-w-xl leading-relaxed">
              Welcome, <strong className="text-white font-semibold">{displayName}</strong>. Access simplified legal guidance, track ongoing dispute statuses, and review your rights under Indian Law.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link 
              href="/ai-chat" 
              className="px-5 py-2.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500 text-xs font-bold flex items-center gap-2 shadow-lg shadow-black/10 dark:shadow-blue-500/25 border border-white/80 dark:border-blue-400/30 transition-all duration-200"
            >
              <Sparkles className="h-4 w-4 text-blue-600 dark:text-white" />
              <span>Consult AI Advisor</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Citizen Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Case Status */}
        <div className="group rounded-2xl p-6 transition-all duration-300 bg-white/85 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 backdrop-blur-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 w-fit border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
              <Globe className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Track Case Status
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Enter your 16-character CNR number or filing year to fetch live updates from District and High Courts.
            </p>
          </div>
          <Link href="/cases" className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold transition-all group-hover:gap-2">
            <span>Open Case Docket</span> <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Card 2: FIR & Notice Explanation */}
        <div className="group rounded-2xl p-6 transition-all duration-300 bg-white/85 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 backdrop-blur-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 w-fit border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              FIR & Notice Explanation
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Upload police notices, FIRs, or legal letters to obtain an unbiased, plain-language summary of your obligations.
            </p>
          </div>
          <Link href="/analyzers" className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold transition-all group-hover:gap-2">
            <span>Analyze Legal Notice</span> <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Card 3: Evidence Vault */}
        <div className="group rounded-2xl p-6 transition-all duration-300 bg-white/85 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 backdrop-blur-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 w-fit border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
              <FolderLock className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Personal Evidence Vault
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Securely preserve land registry documents, tenancy agreements, and dispute evidence protected with AES-256 encryption.
            </p>
          </div>
          <Link href="/vault" className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold transition-all group-hover:gap-2">
            <span>Access Vault</span> <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Citizen Active Case Docket Interconnected Panel */}
      <div className="rounded-2xl p-6 bg-white/85 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Scale className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Your Active Dispute Docket</h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              UNDER TRIAL
            </span>
          </div>
          <Link href="/cases" className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold flex items-center gap-1 transition">
            <span>View Full Portfolio</span> <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400 dark:text-slate-500">Case Title & Reference</span>
            <p className="font-bold text-slate-900 dark:text-white text-sm">
              {liveCases.length > 0 ? liveCases[0].title : 'Meet Thacker vs. State of NCT Delhi & Anr.'}
            </p>
            <p className="font-mono text-xs text-slate-500 dark:text-slate-400">
              {liveCases.length > 0 ? liveCases[0].case_number : 'EC-DEL-2026-0042'} • High Court of Delhi
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400 dark:text-slate-500">Assigned Advocate Counsel</span>
            <p className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 text-sm">
              <Gavel className="h-3.5 w-3.5 shrink-0" />
              <span>{liveCases.length > 0 ? (liveCases[0].advocate_name || 'Adv. Rajeshwar Sharma') : 'Adv. Rajeshwar Sharma'}</span>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Supreme Court & Delhi HC Chambers</p>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400 dark:text-slate-500">Next Cause List Date</span>
            <p className="font-bold text-slate-900 dark:text-white text-sm">
              {liveCases.length > 0 && liveCases[0].next_hearing_date 
                ? new Date(liveCases[0].next_hearing_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) + ' (10:30 AM)'
                : 'Aug 18, 2026 (10:30 AM)'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Bench: Hon&apos;ble Justice Vipin Sanghi</p>
          </div>
        </div>
      </div>

      {/* Citizen Accuracy Guarantee Panel */}
      <div className="rounded-2xl p-6 bg-slate-100/70 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-sm space-y-2">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          Guaranteed Statutory Accuracy
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Legal documents can be intimidating. Unlike generic chatbots that hallucinate false sections, eCourt AI anchors every explanation directly in the active Bare Acts of India. Whenever criminal provisions are cited, both the 2023 Bharatiya Nyaya Sanhita (BNS) and historic IPC equivalents are provided.
        </p>
      </div>
    </div>
  );

  // ==========================================
  // ADVOCATE DASHBOARD
  // ==========================================
  const renderAdvocateDashboard = () => (
    <div className="space-y-6">
      {/* Advocate Greeting Banner - Dynamic color (Royal Blue in White theme, Dark Slate in Dark theme) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 dark:from-slate-900 dark:to-slate-900 border border-blue-500/30 dark:border-slate-800 text-white p-6 md:p-8 shadow-xl shadow-blue-600/15 dark:shadow-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">Advocate Practice Chambers</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 dark:bg-blue-500/15 text-white dark:text-blue-400 border border-white/30 dark:border-blue-500/30 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> BAR VERIFIED
              </span>
            </div>
            <p className="text-xs sm:text-sm text-blue-100 dark:text-slate-300">
              Advocate: <strong className="text-white font-semibold">{displayName}</strong> | Bar Enrollment: <span className="font-mono text-white dark:text-blue-400 font-bold bg-white/15 dark:bg-transparent px-2 py-0.5 rounded">{user?.barCouncilId || 'MAH/1234/2015'}</span>
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link 
              href="/cases" 
              className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/25 dark:bg-slate-800/90 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700/80 text-xs font-semibold flex items-center gap-2 transition"
            >
              <Globe className="h-4 w-4 text-blue-100 dark:text-blue-400" />
              <span>eCourts Live Sync</span>
            </Link>
            <Link 
              href="/ai-chat" 
              className="px-5 py-2.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500 text-xs font-bold flex items-center gap-2 shadow-lg shadow-black/10 dark:shadow-blue-500/25 border border-white/80 dark:border-blue-400/30 transition-all duration-200"
            >
              <Sparkles className="h-4 w-4 text-blue-600 dark:text-white" />
              <span>AI Co-Counsel</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Advocate Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white/85 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 shadow-xs backdrop-blur-xl space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Active Dockets</span>
            <Briefcase className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">14</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" /> +2 this term
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">3 in High Court of Delhi</p>
        </div>

        <div className="p-5 rounded-2xl bg-white/85 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 shadow-xs backdrop-blur-xl space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Upcoming Hearings</span>
            <CalendarDays className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">4</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">In 3 Days</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Delhi HC — Bench No. 4</p>
        </div>

        <div className="p-5 rounded-2xl bg-white/85 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 shadow-xs backdrop-blur-xl space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Client Evidence</span>
            <FolderLock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">42</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">AES-256</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">148 MB Encrypted</p>
        </div>

        <div className="p-5 rounded-2xl bg-white/85 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 shadow-xs backdrop-blur-xl space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Statutory Index</span>
            <Scale className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">100%</span>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold font-mono">BNS & BSA</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Zero Hallucinations</p>
        </div>
      </div>

      {/* Litigations & Hearing Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              Active Litigation Portfolio
            </h3>
            <Link href="/cases" className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold flex items-center gap-1 transition">
              View All Dockets <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="rounded-2xl bg-white/85 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-xs backdrop-blur-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/70 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200/80 dark:border-slate-800/80">
                  <tr>
                    <th className="p-3.5">Case Title & Reference</th>
                    <th className="p-3.5">Forum</th>
                    <th className="p-3.5">Active Provisions</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 text-slate-800 dark:text-slate-200">
                  {(liveCases.length > 0 ? liveCases.slice(0, 6) : [
                    { title: 'Meet Thacker vs. State of NCT Delhi & Anr.', case_number: 'EC-DEL-2026-0042', court_name: 'High Court of Delhi', statute_section: 'BNS Sec 329 / BNSS 144', status: 'UNDER_TRIAL', client_name: 'Meet Thacker' },
                    { title: 'Nexus Retail vs. Municipal Corporation', case_number: 'EC-BOM-2026-1189', court_name: 'Bombay High Court', statute_section: 'Art. 226 Constitution', status: 'PENDING_HEARING', client_name: 'Nexus Retail Pvt Ltd' },
                    { title: 'Rahul Sharma vs. Union of India', case_number: 'EC-SC-2026-0774', court_name: 'Supreme Court of India', statute_section: 'Art. 21 / DPDP Act', status: 'UNDER_TRIAL', client_name: 'Rahul Sharma' }
                  ]).map((c: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                      <td className="p-3.5">
                        <p className="font-bold text-slate-900 dark:text-white">{c.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{c.case_number}</span>
                          {c.client_name && (
                            <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded font-bold border border-blue-500/20">
                              Client: {c.client_name}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-400">{c.court_name}</td>
                      <td className="p-3.5 font-mono text-[11px] text-slate-900 dark:text-slate-100 font-semibold">{c.statute_section}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 uppercase">
                          {(c.status || 'UNDER_TRIAL').replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Next Hearing Details */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            Next Scheduled Hearing
          </h3>
          <div className="p-6 rounded-2xl bg-white/85 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 shadow-xs backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
              <span className="font-bold text-slate-900 dark:text-white">Aug 18, 2026 • 10:30 AM</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">Court No. 14</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Priya Verma vs. State of NCT Delhi</p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Oral arguments on interim status quo and demarcation survey.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-[11px] text-slate-800 dark:text-slate-200 space-y-1">
              <span className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Precedent Memo:
              </span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Refer to <em className="text-slate-900 dark:text-white font-semibold">AIR 2023 SC 1450</em> regarding maintaining status quo during pending boundary survey reports.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ==========================================
  // LAW STUDENT DASHBOARD
  // ==========================================
  const renderLawStudentDashboard = () => (
    <div className="space-y-6">
      {/* Law Student Greeting Banner - Dynamic color (Royal Blue in White theme, Dark Slate in Dark theme) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 dark:from-slate-900 dark:to-slate-900 border border-blue-500/30 dark:border-slate-800 text-white p-6 md:p-8 shadow-xl shadow-blue-600/15 dark:shadow-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">Jurisprudence Study Desk</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 dark:bg-blue-500/15 text-white dark:text-blue-400 border border-white/30 dark:border-blue-500/30 flex items-center gap-1">
                <GraduationCap className="h-3 w-3" /> LAW SCHOLAR
              </span>
            </div>
            <p className="text-xs sm:text-sm text-blue-100 dark:text-slate-300">
              Welcome, <strong className="text-white font-semibold">{displayName}</strong> | Enrollment: <span className="font-mono text-white dark:text-blue-400 font-bold bg-white/15 dark:bg-transparent px-2 py-0.5 rounded">{user?.collegeId || 'NLSIU-2024-089'}</span>
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link 
              href="/research" 
              className="px-5 py-2.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500 text-xs font-bold flex items-center gap-2 shadow-lg shadow-black/10 dark:shadow-blue-500/25 border border-white/80 dark:border-blue-400/30 transition-all duration-200"
            >
              <BookOpen className="h-4 w-4 text-blue-600 dark:text-white" />
              <span>Statute Concordance</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Student Research Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-6 rounded-2xl bg-white/85 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 shadow-xs backdrop-blur-xl space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            BNS 2023 vs IPC 1860 Concordance
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Quickly translate provisions between legacy Indian Penal Code sections and Bharatiya Nyaya Sanhita 2023 with legislative rationale.
          </p>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="e.g. IPC Section 420 or BNS 318..." 
              className="flex-1 bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 px-3.5 py-2 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500" 
            />
            <Link 
              href="/research" 
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <span>Compare</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white/85 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 shadow-xs backdrop-blur-xl space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            Memorial Citation Builder
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Format Supreme Court of India and High Court authorities into standard Bluebook 21st Edition and Indian Law Institute (ILI) styles.
          </p>
          <Link 
            href="/ai-chat" 
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 text-xs font-bold transition"
          >
            <span>Launch Citation Assistant</span> <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );

  // ==========================================
  // BUSINESS / CORPORATE DASHBOARD
  // ==========================================
  const renderBusinessDashboard = () => (
    <div className="space-y-6">
      {/* Business Greeting Banner - Dynamic color (Royal Blue in White theme, Dark Slate in Dark theme) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 dark:from-slate-900 dark:to-slate-900 border border-blue-500/30 dark:border-slate-800 text-white p-6 md:p-8 shadow-xl shadow-blue-600/15 dark:shadow-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">Corporate Governance & Compliance</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 dark:bg-blue-500/15 text-white dark:text-blue-400 border border-white/30 dark:border-blue-500/30 flex items-center gap-1">
                <Building2 className="h-3 w-3" /> ENTERPRISE
              </span>
            </div>
            <p className="text-xs sm:text-sm text-blue-100 dark:text-slate-300">
              Organization: <strong className="text-white font-semibold">{displayName}</strong> | CIN: <span className="font-mono text-white dark:text-blue-400 font-bold bg-white/15 dark:bg-transparent px-2 py-0.5 rounded">{user?.companyRegNo || 'U72200MH2021PTC123456'}</span>
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link 
              href="/analyzers" 
              className="px-5 py-2.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500 text-xs font-bold flex items-center gap-2 shadow-lg shadow-black/10 dark:shadow-blue-500/25 border border-white/80 dark:border-blue-400/30 transition-all duration-200"
            >
              <Upload className="h-4 w-4 text-blue-600 dark:text-white" />
              <span>Audit Agreement</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Business Tools */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="group rounded-2xl p-6 transition-all duration-300 bg-white/85 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 backdrop-blur-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 w-fit border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
              <FolderLock className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Contract Risk Auditor</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Scans master service agreements for missing indemnity caps, ambiguous termination clauses, and non-compete liabilities.
            </p>
          </div>
          <Link href="/analyzers" className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold transition-all group-hover:gap-2">
            <span>Run Contract Audit</span> <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="group rounded-2xl p-6 transition-all duration-300 bg-white/85 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 backdrop-blur-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 w-fit border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">DPDP Act 2023 Check</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Verify consumer data processing, consent notices, and data principal grievances against the Digital Personal Data Protection Act.
            </p>
          </div>
          <Link href="/ai-chat" className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold transition-all group-hover:gap-2">
            <span>Run DPDP Review</span> <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="group rounded-2xl p-6 transition-all duration-300 bg-white/85 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 backdrop-blur-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 w-fit border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
              <BookOpen className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Corporate Litigation Docket</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Monitor company filings, arbitration proceedings, and statutory compliance hearings across NCLT benches nationwide.
            </p>
          </div>
          <Link href="/cases" className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold transition-all group-hover:gap-2">
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
        return renderCitizenDashboard();
    }
  };

  return (
    <div className="space-y-6">
      {renderDashboardByRole()}
    </div>
  );
}
