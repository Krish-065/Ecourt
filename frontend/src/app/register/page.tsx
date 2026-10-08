'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  UserCheck,
  ShieldCheck,
  Lock,
  Gavel,
  GraduationCap,
  Building2,
  Users,
  CheckCircle2,
  UploadCloud,
  FileCheck,
  Sparkles,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Scale
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
  const [stateBarCouncil, setStateBarCouncil] = useState('Bar Council of Maharashtra & Goa');
  const [barCouncilId, setBarCouncilId] = useState('');
  const [collegeId, setCollegeId] = useState('');
  const [companyReg, setCompanyReg] = useState('');

  // ID Scanning State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFileName(file.name);
      setScanResult(null);
    }
  };

  const handleScanIDCard = async () => {
    if (!fileName && !barCouncilId) {
      setStatusMsg({ type: 'error', text: 'Please select an Advocate ID Card file or enter Bar Council Number first.' });
      return;
    }

    setScanning(true);
    setStatusMsg(null);

    const res = await scanAdvocateIDCard(fileName || 'advocate_id.pdf', stateBarCouncil);
    setScanning(false);

    if (res.success && res.data) {
      setScanResult(res.data);
      if (res.data.extractedData?.barCouncilNumber) {
        setBarCouncilId(res.data.extractedData.barCouncilNumber);
      }
      setStatusMsg({
        type: 'success',
        text: 'Advocate ID Card scanned and verified against State Bar Council Registry!',
      });
    } else {
      setStatusMsg({ type: 'error', text: 'ID Card scanning failed. Please verify document legibility.' });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
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
      verificationStatus: role === 'ADVOCATE' && scanResult?.verified ? 'VERIFIED' : 'PENDING',
    };

    const res = await registerUser(payload);
    setLoading(false);

    if (res.success) {
      setStatusMsg({
        type: 'success',
        text: `Account created successfully as ${role.replace('_', ' ')}! Initializing chambers...`,
      });
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1200);
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
    <div className="max-w-2xl mx-auto space-y-6 py-6 px-4">
      {/* Header with Logo */}
      <div className="flex flex-col items-center text-center space-y-2">
        <Logo variant="light" size="lg" />
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight pt-2">
          Chamber Enrollment & Credentials
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm">
          Register your account on the Indian National eCourts AI Grid
        </p>
      </div>

      {/* Role Picker — Unified style across all roles */}
      <div className="space-y-2">
        <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 block text-center">
          Enrollment Type
        </label>
        <div className="grid grid-cols-4 gap-2 text-center">
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

      {/* Main Registration Form */}
      <form onSubmit={handleRegister} className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5 text-xs">
        {statusMsg && (
          <div
            className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
              statusMsg.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {statusMsg.type === 'success' ? <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" /> : <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />}
            <span>{statusMsg.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-slate-700 font-semibold">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Adv. Rajesh Sharma"
              className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition text-xs"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-700 font-semibold">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. advocate@ecourt.in"
              className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition text-xs"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-slate-700 font-semibold">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-700 font-semibold">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition text-xs"
              required
            />
          </div>
        </div>

        {/* Advocate Specific Document Upload & OCR Scan Section */}
        {role === 'ADVOCATE' && (
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Gavel className="h-4 w-4 text-blue-600" />
                Advocate Verification & Bar ID Proof
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                Statutory Verification
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-700 font-semibold">State Bar Council</label>
              <select
                value={stateBarCouncil}
                onChange={(e) => setStateBarCouncil(e.target.value)}
                className="w-full bg-white border border-slate-200 px-3 py-2 rounded-lg font-medium text-slate-900 text-xs focus:outline-none focus:border-blue-600"
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
              <label className="text-slate-700 font-semibold">Upload Advocate ID Card / Sanad Certificate (PNG, JPG, PDF)</label>
              <div className="border-2 border-dashed border-slate-300 bg-white p-5 rounded-xl text-center space-y-2 hover:border-blue-500 transition">
                <UploadCloud className="h-7 w-7 text-blue-600 mx-auto" />
                {fileName ? (
                  <p className="text-xs font-semibold text-slate-900 flex items-center justify-center gap-1.5">
                    <FileCheck className="h-4 w-4 text-emerald-600" /> {fileName}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500">Upload Bar Council Sanad or Advocate ID for verification</p>
                )}
                <input type="file" onChange={handleFileChange} className="hidden" id="advocate-id-input" accept="image/*,.pdf" />
                <label
                  htmlFor="advocate-id-input"
                  className="inline-block px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs cursor-pointer border border-slate-200 transition"
                >
                  Browse File
                </label>
              </div>
            </div>

            {/* OCR Scanner Button */}
            <button
              type="button"
              onClick={handleScanIDCard}
              disabled={scanning}
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
            >
              {scanning ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-white" />
                  <span>Scanning Document via OCR...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-blue-200" />
                  <span>Verify with State Bar Council Registry</span>
                </>
              )}
            </button>

            {/* OCR Extracted Result Badge */}
            {scanResult && (
              <div className="p-4 rounded-xl bg-white border border-emerald-300 space-y-2 text-xs text-slate-900 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold flex items-center gap-1.5 text-emerald-800">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" /> Verified Advocate Credentials
                  </span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                    Match Confidence: {scanResult.confidenceScore}%
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div>
                    <span className="text-slate-500">Bar Enrollment No:</span>
                    <p className="font-mono font-bold text-slate-900">{scanResult.extractedData.barCouncilNumber}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">State Bar Council:</span>
                    <p className="font-bold text-slate-900">{scanResult.extractedData.stateBarCouncil}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Verification Status:</span>
                    <p className="font-bold text-emerald-700">{scanResult.extractedData.status}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Enrollment Date:</span>
                    <p className="font-bold text-slate-900">{scanResult.extractedData.enrollmentDate}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {role === 'LAW_STUDENT' && (
          <div className="space-y-1.5 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <label className="text-slate-900 font-semibold flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4 text-blue-600" /> Law School Roll Number / College ID
            </label>
            <input
              type="text"
              value={collegeId}
              onChange={(e) => setCollegeId(e.target.value)}
              placeholder="e.g. NLSIU-2024-089"
              className="w-full bg-white border border-slate-200 px-3.5 py-2 rounded-lg font-mono text-slate-900 text-xs focus:outline-none focus:border-blue-600"
              required
            />
          </div>
        )}

        {role === 'BUSINESS' && (
          <div className="space-y-1.5 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <label className="text-slate-900 font-semibold flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-blue-600" /> Corporate Registration (CIN / GSTIN)
            </label>
            <input
              type="text"
              value={companyReg}
              onChange={(e) => setCompanyReg(e.target.value)}
              placeholder="e.g. CIN U72200MH2021PTC123456"
              className="w-full bg-white border border-slate-200 px-3.5 py-2 rounded-lg font-mono text-slate-900 text-xs focus:outline-none focus:border-blue-600"
              required
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-2 transition cursor-pointer mt-2"
        >
          {loading ? (
            <span>Enrolling Chamber...</span>
          ) : (
            <>
              <span>Complete Enrollment & Enter Chambers</span>
              <ArrowRight className="h-4 w-4 text-white" />
            </>
          )}
        </button>

        <p className="text-center text-slate-500 pt-2 text-xs">
          Already registered on the platform?{' '}
          <Link href="/auth" className="text-blue-600 hover:text-blue-800 font-semibold">
            Member Sign In
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
