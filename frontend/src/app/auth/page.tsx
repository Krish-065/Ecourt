'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  UserCheck, 
  ShieldCheck, 
  Lock, 
  Gavel, 
  GraduationCap, 
  Building2, 
  Users, 
  Scale, 
  CheckCircle2, 
  UserPlus, 
  ArrowRight, 
  AlertCircle, 
  Sparkles,
  Shield
} from 'lucide-react';
import { loginUser } from '../../lib/api';
import Logo from '../../components/Logo';

export default function AuthPage() {
  const [role, setRole] = useState<'CITIZEN' | 'ADVOCATE' | 'LAW_STUDENT' | 'BUSINESS' | 'ADMIN'>('ADVOCATE');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [barId, setBarId] = useState('MAH/1234/2015');
  const [collegeId, setCollegeId] = useState('');
  const [companyReg, setCompanyReg] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleAutofillDemo = () => {
    const demoCredentials: Record<string, { email: string; pass: string }> = {
      CITIZEN: { email: 'citizen@ecourt.in', pass: 'Password123!' },
      ADVOCATE: { email: 'advocate@ecourt.in', pass: 'Password123!' },
      LAW_STUDENT: { email: 'student@ecourt.in', pass: 'Password123!' },
      BUSINESS: { email: 'business@ecourt.in', pass: 'Password123!' },
      ADMIN: { email: 'admin@ecourt.in', pass: 'Password123!' },
    };
    const creds = demoCredentials[role];
    if (creds) {
      setEmail(creds.email);
      setPassword(creds.pass);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await loginUser(email, password);
    setLoading(false);
    if (res.success) {
      setStatusMsg({
        type: 'success',
        text: `Authenticated successfully as ${res.data.user.role}! Entering chambers...`
      });
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
    } else {
      setStatusMsg({
        type: 'error',
        text: `Authentication Error: ${res.error}`
      });
    }
  };

  const roles = [
    { id: 'CITIZEN', label: 'Citizen', icon: Users },
    { id: 'ADVOCATE', label: 'Advocate', icon: Gavel },
    { id: 'LAW_STUDENT', label: 'Student', icon: GraduationCap },
    { id: 'BUSINESS', label: 'Corporate', icon: Building2 },
    { id: 'ADMIN', label: 'Admin', icon: Shield },
  ] as const;

  return (
    <div className="max-w-xl mx-auto space-y-6 py-6 px-4">
      {/* Header with Logo */}
      <div className="flex flex-col items-center text-center space-y-2">
        <Logo variant="light" size="lg" />
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight pt-2">
          Sign In to Your Chamber
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm">
          Select your legal operating role to access role-restricted dashboard features.
        </p>
      </div>

      {/* Role Picker — Unified style across all roles */}
      <div className="space-y-2">
        <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 block text-center">
          Operating Persona
        </label>
        <div className="grid grid-cols-5 gap-2 text-center">
          {roles.map((r) => {
            const Icon = r.icon;
            const isSelected = role === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all duration-150 cursor-pointer ${
                  isSelected 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-500/20' 
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`h-4 w-4 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                <span className="text-[11px]">{r.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <span className="text-slate-900 font-bold text-sm">Chamber Credentials</span>
          <button
            type="button"
            onClick={handleAutofillDemo}
            className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-lg cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            <span>Autofill Demo Account</span>
          </button>
        </div>

        {statusMsg && (
          <div className={`p-3.5 rounded-xl border font-medium flex items-center gap-2 ${
            statusMsg.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            {statusMsg.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-slate-700 font-semibold">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition text-xs"
            placeholder="advocate@ecourt.in"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-slate-700 font-semibold">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition text-xs"
            placeholder="••••••••••••"
            required
          />
        </div>

        {/* Verification Extra Inputs */}
        {role === 'ADVOCATE' && (
          <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <label className="text-slate-900 font-semibold flex items-center gap-1.5">
              <Gavel className="h-3.5 w-3.5 text-blue-600" /> Bar Council Registration Number
            </label>
            <input
              type="text"
              value={barId}
              onChange={(e) => setBarId(e.target.value)}
              placeholder="e.g. MAH/1234/2015"
              className="w-full bg-white border border-slate-200 px-3 py-2 rounded-lg text-slate-900 font-mono text-xs focus:outline-none focus:border-blue-600"
            />
          </div>
        )}

        {role === 'LAW_STUDENT' && (
          <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <label className="text-slate-900 font-semibold flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5 text-blue-600" /> University Roll Number
            </label>
            <input
              type="text"
              value={collegeId || 'NLSIU-2024-089'}
              onChange={(e) => setCollegeId(e.target.value)}
              placeholder="e.g. NLSIU-2024-089"
              className="w-full bg-white border border-slate-200 px-3 py-2 rounded-lg text-slate-900 font-mono text-xs focus:outline-none focus:border-blue-600"
            />
          </div>
        )}

        {role === 'BUSINESS' && (
          <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <label className="text-slate-900 font-semibold flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-blue-600" /> Corporate Registration (CIN / GSTIN)
            </label>
            <input
              type="text"
              value={companyReg || 'U72200MH2021PTC123456'}
              onChange={(e) => setCompanyReg(e.target.value)}
              placeholder="e.g. CIN / GSTIN"
              className="w-full bg-white border border-slate-200 px-3 py-2 rounded-lg text-slate-900 font-mono text-xs focus:outline-none focus:border-blue-600"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm transition flex items-center justify-center gap-2 cursor-pointer mt-2 text-xs"
        >
          {loading ? 'Authenticating...' : `Enter Chamber as ${role.replace('_', ' ')}`}
          <ArrowRight className="h-4 w-4" />
        </button>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2 mt-4">
          <p className="text-slate-600 text-xs">Need to register a new legal chamber or verify credentials?</p>
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-slate-900 border border-slate-200 font-semibold text-xs hover:border-blue-500 hover:text-blue-600 transition shadow-2xs"
          >
            <UserPlus className="h-3.5 w-3.5 text-blue-600" /> Register Chamber & Verify Bar Credentials
          </Link>
        </div>
      </form>
    </div>
  );
}
