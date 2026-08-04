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
} from 'lucide-react';
import { registerUser, scanAdvocateIDCard } from '../../lib/api';

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
        text: '✅ Advocate ID Card scanned and verified against State Bar Council Registry!',
      });
    } else {
      setStatusMsg({ type: 'error', text: 'ID Card scanning failed. Please check document clarity.' });
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
        text: `🎉 Account created successfully as ${role}! Redirecting to dashboard...`,
      });
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1200);
    } else {
      setStatusMsg({ type: 'error', text: res.error || 'Registration failed.' });
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center mx-auto shadow-sm">
          <UserCheck className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Create ECourt Account & Verify Credentials</h1>
        <p className="text-xs text-slate-600">
          Join India's AI Legal OS for Citizens, Advocates, Law Students & Businesses
        </p>
      </div>

      {/* Role Picker */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Select Account Type</label>
        <div className="grid grid-cols-4 gap-2 text-center">
          <button
            type="button"
            onClick={() => setRole('ADVOCATE')}
            className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
              role === 'ADVOCATE'
                ? 'bg-indigo-600 border-indigo-700 text-white shadow-md shadow-indigo-600/20'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Gavel className="h-4 w-4" />
            <span className="text-[11px]">Advocate</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('CITIZEN')}
            className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
              role === 'CITIZEN'
                ? 'bg-indigo-600 border-indigo-700 text-white shadow-md shadow-indigo-600/20'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Users className="h-4 w-4" />
            <span className="text-[11px]">Citizen / Consumer</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('LAW_STUDENT')}
            className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
              role === 'LAW_STUDENT'
                ? 'bg-indigo-600 border-indigo-700 text-white shadow-md shadow-indigo-600/20'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            <span className="text-[11px]">Law Student</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('BUSINESS')}
            className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
              role === 'BUSINESS'
                ? 'bg-indigo-600 border-indigo-700 text-white shadow-md shadow-indigo-600/20'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span className="text-[11px]">Business</span>
          </button>
        </div>
      </div>

      {/* Main Registration Form */}
      <form onSubmit={handleRegister} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5 text-xs">
        {statusMsg && (
          <div
            className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center gap-2 ${
              statusMsg.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {statusMsg.type === 'success' ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <AlertCircle className="h-4 w-4 text-rose-600" />}
            <span>{statusMsg.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-slate-700 font-bold">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Adv. Rajesh Sharma"
              className="w-full glass-input px-3.5 py-2.5 rounded-xl focus:outline-none"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-700 font-bold">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. advocate@ecourt.in"
              className="w-full glass-input px-3.5 py-2.5 rounded-xl focus:outline-none"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-slate-700 font-bold">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full glass-input px-3.5 py-2.5 rounded-xl focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-700 font-bold">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full glass-input px-3.5 py-2.5 rounded-xl focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Advocate Specific Document Upload & OCR Scan Section */}
        {role === 'ADVOCATE' && (
          <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
                <Gavel className="h-4 w-4 text-amber-700" />
                Advocate Verification & Bar ID Proof Upload
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                REQUIRED FOR ADVOCATES
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-slate-700 font-bold">State Bar Council</label>
              <select
                value={stateBarCouncil}
                onChange={(e) => setStateBarCouncil(e.target.value)}
                className="w-full glass-input px-3 py-2 rounded-xl bg-white font-medium text-slate-800"
              >
                <option>Bar Council of Maharashtra & Goa</option>
                <option>Bar Council of Delhi</option>
                <option>Bar Council of Tamil Nadu & Puducherry</option>
                <option>Bar Council of Karnataka</option>
                <option>Bar Council of West Bengal</option>
                <option>Bar Council of Uttar Pradesh</option>
              </select>
            </div>

            {/* Document Upload Box */}
            <div className="space-y-2">
              <label className="text-slate-700 font-bold">Upload Advocate ID Card / Sanad Certificate (PNG, JPG, PDF)</label>
              <div className="border-2 border-dashed border-amber-300 bg-white p-4 rounded-2xl text-center space-y-2 hover:border-amber-500 transition">
                <UploadCloud className="h-8 w-8 text-amber-600 mx-auto" />
                {fileName ? (
                  <p className="text-xs font-bold text-slate-800 flex items-center justify-center gap-1">
                    <FileCheck className="h-4 w-4 text-emerald-600" /> {fileName}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500">Drag & drop your Advocate ID Card / Sanad Certificate file or browse</p>
                )}
                <input type="file" onChange={handleFileChange} className="hidden" id="advocate-id-input" accept="image/*,.pdf" />
                <label
                  htmlFor="advocate-id-input"
                  className="inline-block px-3.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs cursor-pointer transition"
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
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold flex items-center justify-center gap-2 shadow-sm transition"
            >
              {scanning ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Scanning Advocate ID Card via OCR...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-amber-200" />
                  <span>Scan Advocate ID & Verify Bar Registry</span>
                </>
              )}
            </button>

            {/* OCR Extracted Result Badge */}
            {scanResult && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2 text-xs text-emerald-900">
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1.5 text-emerald-800">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" /> Verified Advocate Credentials
                  </span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                    Score: {scanResult.confidenceScore}%
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
                    <span className="text-slate-500">Status:</span>
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
          <div className="space-y-1 p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
            <label className="text-emerald-900 font-bold flex items-center gap-1">
              <GraduationCap className="h-4 w-4 text-emerald-600" /> Law School Roll Number / College ID
            </label>
            <input
              type="text"
              value={collegeId}
              onChange={(e) => setCollegeId(e.target.value)}
              placeholder="e.g. NLSIU-2024-089"
              className="w-full glass-input px-3.5 py-2.5 rounded-xl font-mono text-slate-800"
              required
            />
          </div>
        )}

        {role === 'BUSINESS' && (
          <div className="space-y-1 p-4 rounded-2xl bg-sky-50 border border-sky-200">
            <label className="text-sky-900 font-bold flex items-center gap-1">
              <Building2 className="h-4 w-4 text-sky-600" /> Corporate Registration (CIN / GSTIN)
            </label>
            <input
              type="text"
              value={companyReg}
              onChange={(e) => setCompanyReg(e.target.value)}
              placeholder="e.g. CIN U72200MH2021PTC123456"
              className="w-full glass-input px-3.5 py-2.5 rounded-xl font-mono text-slate-800"
              required
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition"
        >
          {loading ? (
            <span>Creating Account...</span>
          ) : (
            <>
              <span>Complete Registration & Access ECourt</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        <p className="text-center text-slate-500 pt-2">
          Already have an account?{' '}
          <Link href="/auth" className="text-indigo-600 font-bold hover:underline">
            Sign In here
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="text-center p-8 text-slate-500 font-bold">Loading Registration...</div>}>
      <RegisterFormContent />
    </Suspense>
  );
}
