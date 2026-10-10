'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Gavel, 
  GraduationCap, 
  Building2, 
  Shield, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  Eye, 
  EyeOff, 
  UserPlus 
} from 'lucide-react';
import { loginUser } from '../../lib/api';
import Logo from '../../components/Logo';

export default function AuthPage() {
  const [role, setRole] = useState<'CITIZEN' | 'ADVOCATE' | 'LAW_STUDENT' | 'BUSINESS' | 'ADMIN'>('ADVOCATE');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [barId, setBarId] = useState('MAH/1234/2015');
  const [collegeId, setCollegeId] = useState('');
  const [companyReg, setCompanyReg] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const roleDisplayNames: Record<string, string> = {
    CITIZEN: 'Citizen',
    ADVOCATE: 'Advocate',
    LAW_STUDENT: 'Law Student',
    BUSINESS: 'Corporate',
    ADMIN: 'Admin',
  };

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

  // Validation: Check if required details are filled
  const isFormValid = email.trim().length > 0 && password.trim().length > 0;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || loading) return;

    setLoading(true);
    setStatusMsg(null);
    const res = await loginUser(email, password);
    setLoading(false);
    if (res.success) {
      setStatusMsg({
        type: 'success',
        text: `Authenticated successfully as ${roleDisplayNames[role]}! Entering portal...`
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
    <div className="max-w-xl mx-auto space-y-6 py-8 px-4 transition-colors duration-300">
      {/* Header with Logo */}
      <div className="flex flex-col items-center text-center space-y-2">
        <Logo variant="auto" size="lg" />
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight pt-2">
          Sign In
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm">
          Select your role
        </p>
      </div>

      {/* Role Picker (Operating Persona removed as requested) */}
      <div className="space-y-2">
        <div className="grid grid-cols-5 gap-2 text-center">
          {roles.map((r) => {
            const Icon = r.icon;
            const isSelected = role === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                  isSelected 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20 ring-2 ring-blue-500/30' 
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`h-4 w-4 ${isSelected ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                <span className="text-[11px]">{r.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sign In Form */}
      <form onSubmit={handleLogin} className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs transition-colors duration-300">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
          <span className="text-slate-900 dark:text-white font-bold text-sm">Chamber Credentials</span>
          <button
            type="button"
            onClick={handleAutofillDemo}
            className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800/60 px-2.5 py-1 rounded-lg cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span>Autofill Demo Account</span>
          </button>
        </div>

        {statusMsg && (
          <div className={`p-3.5 rounded-xl border font-medium flex items-center gap-2 ${
            statusMsg.type === 'success' 
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300' 
              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
          }`}>
            {statusMsg.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Email Address */}
        <div className="space-y-1.5">
          <label className="text-slate-700 dark:text-slate-300 font-semibold">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-800 transition text-xs"
            placeholder="e.g. advocate@ecourt.in"
            required
          />
        </div>

        {/* Password with Eye Show/Hide Toggle */}
        <div className="space-y-1.5">
          <label className="text-slate-700 dark:text-slate-300 font-semibold">Password</label>
          <div className="relative flex items-center">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 pr-10 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-800 transition text-xs"
              placeholder="••••••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Verification Extra Inputs */}
        {role === 'ADVOCATE' && (
          <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <label className="text-slate-900 dark:text-slate-200 font-semibold flex items-center gap-1.5">
              <Gavel className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" /> Bar Council Registration Number
            </label>
            <input
              type="text"
              value={barId}
              onChange={(e) => setBarId(e.target.value)}
              placeholder="e.g. MAH/1234/2015"
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-lg text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:border-blue-600"
            />
          </div>
        )}

        {role === 'LAW_STUDENT' && (
          <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <label className="text-slate-900 dark:text-slate-200 font-semibold flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" /> University Roll Number
            </label>
            <input
              type="text"
              value={collegeId || 'NLSIU-2024-089'}
              onChange={(e) => setCollegeId(e.target.value)}
              placeholder="e.g. NLSIU-2024-089"
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-lg text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:border-blue-600"
            />
          </div>
        )}

        {role === 'BUSINESS' && (
          <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <label className="text-slate-900 dark:text-slate-200 font-semibold flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" /> Corporate Registration (CIN / GSTIN)
            </label>
            <input
              type="text"
              value={companyReg || 'U72200MH2021PTC123456'}
              onChange={(e) => setCompanyReg(e.target.value)}
              placeholder="e.g. CIN / GSTIN"
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-lg text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:border-blue-600"
            />
          </div>
        )}

        {/* Enter as Role Button (Grey & Disabled when incomplete, Blue when filled) */}
        <button
          type="submit"
          disabled={!isFormValid || loading}
          className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 mt-2 text-xs select-none ${
            isFormValid
              ? 'bg-blue-600 hover:bg-blue-500 text-white cursor-pointer shadow-md shadow-blue-500/20 active:scale-[0.99]'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-300/40 dark:border-slate-700/60'
          }`}
        >
          {loading ? (
            <span>Authenticating...</span>
          ) : (
            <>
              <span>Enter as {roleDisplayNames[role]}</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        {/* Register prompt */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center space-y-2 mt-4">
          <p className="text-slate-600 dark:text-slate-400 text-xs">
            If you don&apos;t have an account click on register
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-semibold text-xs hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition shadow-2xs"
          >
            <UserPlus className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span>Register Now</span>
          </Link>
        </div>
      </form>
    </div>
  );
}
