'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UserCheck, ShieldCheck, Lock, Gavel, GraduationCap, Building2, Users, Scale, CheckCircle2, UserPlus, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { loginUser } from '../../lib/api';

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
        text: `Authenticated successfully as ${res.data.user.role}! Redirecting...`
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

  return (
    <div className="max-w-xl mx-auto space-y-6 py-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center mx-auto shadow-sm">
          <UserCheck className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">ECourt Sign In & Role Verification</h1>
        <p className="text-xs text-slate-600">Select your legal persona to enter role-restricted dashboard views</p>
      </div>

      {/* Role Picker */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Select Role Persona</label>
        <div className="grid grid-cols-5 gap-2 text-center">
          <button
            type="button"
            onClick={() => { setRole('CITIZEN'); }}
            className={`p-2.5 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1 transition ${
              role === 'CITIZEN' ? 'bg-indigo-600 border-indigo-700 text-white shadow-md' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Users className="h-4 w-4" />
            <span className="text-[10px]">Citizen</span>
          </button>

          <button
            type="button"
            onClick={() => { setRole('ADVOCATE'); }}
            className={`p-2.5 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1 transition ${
              role === 'ADVOCATE' ? 'bg-amber-600 border-amber-700 text-white shadow-md' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Gavel className="h-4 w-4" />
            <span className="text-[10px]">Advocate</span>
          </button>

          <button
            type="button"
            onClick={() => { setRole('LAW_STUDENT'); }}
            className={`p-2.5 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1 transition ${
              role === 'LAW_STUDENT' ? 'bg-emerald-600 border-emerald-700 text-white shadow-md' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            <span className="text-[10px]">Student</span>
          </button>

          <button
            type="button"
            onClick={() => { setRole('BUSINESS'); }}
            className={`p-2.5 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1 transition ${
              role === 'BUSINESS' ? 'bg-sky-600 border-sky-700 text-white shadow-md' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span className="text-[10px]">Business</span>
          </button>

          <button
            type="button"
            onClick={() => { setRole('ADMIN'); }}
            className={`p-2.5 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1 transition ${
              role === 'ADMIN' ? 'bg-rose-600 border-rose-700 text-white shadow-md' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Scale className="h-4 w-4" />
            <span className="text-[10px]">Admin</span>
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
        <div className="flex justify-between items-center">
          <span className="text-slate-700 font-bold uppercase tracking-wider text-[10px]">Sign In Credentials</span>
          <button
            type="button"
            onClick={handleAutofillDemo}
            className="text-[10px] font-extrabold text-indigo-600 hover:text-indigo-850 transition flex items-center gap-1.5 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-150 px-2 py-1 rounded-xl"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500 fill-amber-400" />
            <span>Autofill Demo Account</span>
          </button>
        </div>
        {statusMsg && (
          <div className={`p-3.5 rounded-2xl border font-bold flex items-center gap-2 ${
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

        <div className="space-y-1">
          <label className="text-slate-700 font-bold">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full glass-input px-3.5 py-2.5 rounded-xl text-slate-900 focus:outline-none"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-slate-700 font-bold">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full glass-input px-3.5 py-2.5 rounded-xl text-slate-900 focus:outline-none"
            required
          />
        </div>

        {/* Verification Extra Inputs */}
        {role === 'ADVOCATE' && (
          <div className="space-y-1 p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
            <label className="text-amber-900 font-bold flex items-center gap-1">
              <Gavel className="h-3.5 w-3.5 text-amber-700" /> Bar Council Registration Number
            </label>
            <input
              type="text"
              value={barId}
              onChange={(e) => setBarId(e.target.value)}
              placeholder="e.g. MAH/1234/2015"
              className="w-full glass-input px-3 py-2 rounded-xl text-slate-900 font-mono"
            />
          </div>
        )}

        {role === 'LAW_STUDENT' && (
          <div className="space-y-1 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
            <label className="text-emerald-900 font-bold flex items-center gap-1">
              <GraduationCap className="h-3.5 w-3.5 text-emerald-700" /> College ID Card Roll Number
            </label>
            <input
              type="text"
              value={collegeId || 'NLSIU-2024-089'}
              onChange={(e) => setCollegeId(e.target.value)}
              placeholder="e.g. NLSIU-2024-089"
              className="w-full glass-input px-3 py-2 rounded-xl text-slate-900 font-mono"
            />
          </div>
        )}

        {role === 'BUSINESS' && (
          <div className="space-y-1 p-3.5 rounded-2xl bg-sky-50 border border-sky-200">
            <label className="text-sky-900 font-bold flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5 text-sky-700" /> Corporate Registration (CIN / GSTIN)
            </label>
            <input
              type="text"
              value={companyReg || 'U72200MH2021PTC123456'}
              onChange={(e) => setCompanyReg(e.target.value)}
              placeholder="e.g. CIN / GSTIN"
              className="w-full glass-input px-3 py-2 rounded-xl text-slate-900 font-mono"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20 transition flex items-center justify-center gap-2"
        >
          {loading ? 'Authenticating...' : `Sign In & Access ${role} Dashboard`}
          <ArrowRight className="h-4 w-4" />
        </button>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2 mt-4">
          <p className="text-slate-600 text-xs">Don't have an account or need to verify Advocate ID proof?</p>
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold text-xs hover:bg-indigo-100 transition"
          >
            <UserPlus className="h-4 w-4" /> Go to Register Page & Verify ID Card
          </Link>
        </div>
      </form>
    </div>
  );
}
