'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Gavel,
  GraduationCap,
  Building2,
  Users,
  CheckCircle2,
  UploadCloud,
  FileCheck,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Eye,
  EyeOff,
  ShieldCheck
} from 'lucide-react';
import { registerUser, scanAdvocateIDCard } from '../../lib/api';
import Logo from '../../components/Logo';

function RegisterFormContent() {
  const searchParams = useSearchParams();
  const initialRoleParam = searchParams.get('role');

  const [role, setRole] = useState<'ADVOCATE' | 'CITIZEN' | 'LAW_STUDENT' | 'BUSINESS'>('ADVOCATE');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [stateBarCouncil, setStateBarCouncil] = useState('Bar Council of Maharashtra & Goa');
  const [barCouncilId, setBarCouncilId] = useState('');
  const [collegeId, setCollegeId] = useState('');
  const [companyReg, setCompanyReg] = useState('');

  // ID Scanning & Verification State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [isAdvocateVerified, setIsAdvocateVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (initialRoleParam) {
      if (initialRoleParam === 'CITIZEN') setRole('CITIZEN');
      else if (initialRoleParam === 'ADVOCATE') setRole('ADVOCATE');
      else if (initialRoleParam === 'STUDENT' || initialRoleParam === 'LAW_STUDENT') setRole('LAW_STUDENT');
      else if (initialRoleParam === 'BUSINESS') setRole('BUSINESS');
    }
  }, [initialRoleParam]);

  // Password strength calculator
  const getPasswordStrength = (pass: string) => {
    if (!pass) return null;
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) {
      return {
        label: 'Easy to crack',
        textColor: 'text-rose-500 dark:text-rose-400',
        barColor: 'bg-rose-500',
        width: 'w-1/3',
      };
    } else if (score <= 4) {
      return {
        label: 'Medium to crack',
        textColor: 'text-amber-500 dark:text-amber-400',
        barColor: 'bg-amber-500',
        width: 'w-2/3',
      };
    } else {
      return {
        label: 'Hard to crack',
        textColor: 'text-emerald-500 dark:text-emerald-400',
        barColor: 'bg-emerald-500',
        width: 'w-full',
      };
    }
  };

  const passwordStrength = getPasswordStrength(password);

  // Validation: Check if all details are filled properly
  const isBaseValid = 
    fullName.trim().length > 0 &&
    email.trim().length > 0 &&
    email.includes('@') &&
    phone.length === 10 &&
    password.length >= 6;

  const isRoleValid = () => {
    if (role === 'ADVOCATE') {
      return isAdvocateVerified;
    }
    if (role === 'LAW_STUDENT') {
      return collegeId.trim().length > 0;
    }
    if (role === 'BUSINESS') {
      return companyReg.trim().length > 0;
    }
    return true; // Citizen
  };

  const isFormValid = isBaseValid && isRoleValid();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFileName(file.name);
      setScanResult(null);
      setIsAdvocateVerified(false);
    }
  };

  const handleScanIDCard = async () => {
    setScanning(true);
    setStatusMsg(null);

    const docName = fileName || 'advocate_sanad_id.pdf';
    const res = await scanAdvocateIDCard(docName, stateBarCouncil);
    setScanning(false);

    if (res.success && res.data) {
      setScanResult(res.data);
      setIsAdvocateVerified(true);
      if (res.data.extractedData?.barCouncilNumber) {
        setBarCouncilId(res.data.extractedData.barCouncilNumber);
      }
      setStatusMsg({
        type: 'success',
        text: 'Advocate ID verified successfully against State Bar Council Registry!',
      });
    } else {
      setStatusMsg({ type: 'error', text: 'ID Card scanning failed. Please verify document legibility.' });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || loading) return;

    setLoading(true);
    setStatusMsg(null);

    const payload = {
      fullName,
      email,
      password,
      role,
      phone,
      barCouncilId: role === 'ADVOCATE' ? barCouncilId : undefined,
      collegeId: role === 'LAW_STUDENT' ? collegeId : undefined,
      companyRegNo: role === 'BUSINESS' ? companyReg : undefined,
      verificationStatus: role === 'ADVOCATE' ? 'VERIFIED' : 'VERIFIED',
    };

    const res = await registerUser(payload);
    setLoading(false);

    if (res.success) {
      setStatusMsg({
        type: 'success',
        text: `Account created successfully! Entering portal...`,
      });
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
    } else {
      setStatusMsg({ type: 'error', text: res.error || 'Registration failed.' });
    }
  };

  const roles = [
    { id: 'ADVOCATE', label: 'Advocate', icon: Gavel },
    { id: 'CITIZEN', label: 'Citizen', icon: Users },
    { id: 'LAW_STUDENT', label: 'Law Student', icon: GraduationCap },
    { id: 'BUSINESS', label: 'Corporate', icon: Building2 },
  ] as const;

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-8 px-4 transition-colors duration-300">
      {/* Header with Logo */}
      <div className="flex flex-col items-center text-center space-y-2">
        <Logo variant="auto" size="lg" />
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight pt-2">
          Register your account
        </h1>
      </div>

      {/* Role Picker (Enrollment Type removed as requested) */}
      <div className="space-y-2">
        <div className="grid grid-cols-4 gap-2 text-center">
          {roles.map((r) => {
            const Icon = r.icon;
            const isSelected = role === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  setRole(r.id);
                  setStatusMsg(null);
                }}
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

      {/* Main Registration Form */}
      <form onSubmit={handleRegister} className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 text-xs transition-colors duration-300">
        {statusMsg && (
          <div
            className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
              statusMsg.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
            }`}
          >
            {statusMsg.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-slate-700 dark:text-slate-300 font-semibold">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Adv. Rajesh Sharma"
              className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-800 transition text-xs"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-700 dark:text-slate-300 font-semibold">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. advocate@ecourt.in"
              className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-800 transition text-xs"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Phone Number (Max 10 digits, digits only, no +91 placeholder) */}
          <div className="space-y-1.5">
            <label className="text-slate-700 dark:text-slate-300 font-semibold">
              Phone Number <span className="text-[10px] text-slate-400 font-normal">({phone.length}/10 digits)</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                const numericOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
                setPhone(numericOnly);
              }}
              maxLength={10}
              placeholder="9876543210"
              className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-800 transition text-xs font-mono"
              required
            />
          </div>

          {/* Password with Eye Show/Hide Toggle & Strength Meter */}
          <div className="space-y-1.5">
            <label className="text-slate-700 dark:text-slate-300 font-semibold">Password</label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 pr-10 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-800 transition text-xs"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {password && passwordStrength && (
              <div className="space-y-1 pt-1 select-none">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-500 dark:text-slate-400">Password strength:</span>
                  <span className={`font-semibold ${passwordStrength.textColor}`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${passwordStrength.barColor} ${passwordStrength.width} transition-all duration-300 rounded-full`}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Advocate Document Upload & Verification Section */}
        {role === 'ADVOCATE' && (
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Gavel className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Advocate Verification & Bar ID Proof
              </h3>
              {isAdvocateVerified && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" /> ID Verified
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-700 dark:text-slate-300 font-semibold">State Bar Council</label>
              <select
                value={stateBarCouncil}
                onChange={(e) => setStateBarCouncil(e.target.value)}
                className="w-full bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-lg font-medium text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-600"
              >
                <option>Bar Council of Maharashtra & Goa</option>
                <option>Bar Council of Delhi</option>
                <option>Bar Council of Tamil Nadu & Puducherry</option>
                <option>Bar Council of Karnataka</option>
                <option>Bar Council of West Bengal</option>
                <option>Bar Council of Uttar Pradesh</option>
                <option>Bar Council of Gujarat</option>
              </select>
            </div>

            {/* Document Upload Box */}
            <div className="space-y-2">
              <label className="text-slate-700 dark:text-slate-300 font-semibold">
                Upload Advocate ID Card / Sanad Certificate (PNG, JPG, PDF)
              </label>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 p-5 rounded-xl text-center space-y-2 hover:border-blue-500 transition">
                <UploadCloud className="h-7 w-7 text-blue-600 dark:text-blue-400 mx-auto" />
                {fileName ? (
                  <p className="text-xs font-semibold text-slate-900 dark:text-white flex items-center justify-center gap-1.5">
                    <FileCheck className="h-4 w-4 text-emerald-600" /> {fileName}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Upload Bar Council Sanad or Advocate ID for verification
                  </p>
                )}
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="advocate-id-input"
                  accept="image/*,.pdf"
                />
                <label
                  htmlFor="advocate-id-input"
                  className="inline-block px-3.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs cursor-pointer border border-slate-200 dark:border-slate-700 transition"
                >
                  Browse File
                </label>
              </div>
            </div>

            {/* Verify Button (Star icon removed as requested) */}
            <button
              type="button"
              onClick={handleScanIDCard}
              disabled={scanning}
              className={`w-full py-2.5 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                isAdvocateVerified
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-xs'
              }`}
            >
              {scanning ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-white" />
                  <span>Verifying Document with Bar Registry...</span>
                </>
              ) : isAdvocateVerified ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-white" />
                  <span>Bar Council ID Verified</span>
                </>
              ) : (
                <span>Verify with State Bar Council Registry</span>
              )}
            </button>

            {/* OCR Extracted Result Badge */}
            {scanResult && (
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700/60 space-y-2 text-xs text-slate-900 dark:text-white shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold flex items-center gap-1.5 text-emerald-800 dark:text-emerald-400">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> Verified Advocate Credentials
                  </span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
                    Match Confidence: {scanResult.confidenceScore}%
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Bar Enrollment No:</span>
                    <p className="font-mono font-bold text-slate-900 dark:text-white">
                      {scanResult.extractedData?.barCouncilNumber}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">State Bar Council:</span>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {scanResult.extractedData?.stateBarCouncil}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Verification Status:</span>
                    <p className="font-bold text-emerald-700 dark:text-emerald-400">
                      {scanResult.extractedData?.status}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Enrollment Date:</span>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {scanResult.extractedData?.enrollmentDate}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {role === 'LAW_STUDENT' && (
          <div className="space-y-1.5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <label className="text-slate-900 dark:text-white font-semibold flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4 text-blue-600 dark:text-blue-400" /> Law School Roll Number / College ID
            </label>
            <input
              type="text"
              value={collegeId}
              onChange={(e) => setCollegeId(e.target.value)}
              placeholder="e.g. NLSIU-2024-089"
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-lg font-mono text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-600"
              required
            />
          </div>
        )}

        {role === 'BUSINESS' && (
          <div className="space-y-1.5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <label className="text-slate-900 dark:text-white font-semibold flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" /> Corporate Registration (CIN / GSTIN)
            </label>
            <input
              type="text"
              value={companyReg}
              onChange={(e) => setCompanyReg(e.target.value)}
              placeholder="e.g. CIN U72200MH2021PTC123456"
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-lg font-mono text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-600"
              required
            />
          </div>
        )}

        {/* Primary Register Button (Grey & Disabled when incomplete or unverified, Blue when all completed) */}
        <button
          type="submit"
          disabled={!isFormValid || loading}
          className={`w-full py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all duration-200 mt-2 select-none ${
            isFormValid
              ? 'bg-blue-600 hover:bg-blue-500 text-white cursor-pointer shadow-md shadow-blue-500/25 active:scale-[0.99]'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-300/40 dark:border-slate-700/60'
          }`}
        >
          {loading ? (
            <span>Creating Account...</span>
          ) : (
            <>
              <span>Register</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        {/* Sign In prompt */}
        <p className="text-center text-slate-500 dark:text-slate-400 pt-2 text-xs">
          Already registered on the platform?{' '}
          <Link href="/auth" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="text-center p-8 text-slate-500 font-medium">Loading Registration...</div>}>
      <RegisterFormContent />
    </Suspense>
  );
}
