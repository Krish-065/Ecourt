'use client';

import React, { useState } from 'react';
import { FileCheck2, AlertTriangle, ShieldCheck, Sparkles, Gavel, CheckCircle2, ArrowRight, Scale, ShieldAlert } from 'lucide-react';
import { analyzeContract, analyzeFIR } from '../../lib/api';

export default function AnalyzersPage() {
  const [mode, setMode] = useState<'CONTRACT' | 'FIR'>('CONTRACT');
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setResult(null);

    if (mode === 'CONTRACT') {
      const res = await analyzeContract(inputText);
      setResult(res);
    } else {
      const res = await analyzeFIR(inputText);
      setResult(res);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileCheck2 className="h-6 w-6 text-blue-600" />
            Statutory Document & Risk Diagnostic
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Cross-checks clauses against the Indian Contract Act 1872, BNS 2023, BNSS procedural rights, and statutory benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 text-xs text-slate-900 font-semibold border border-slate-200">
          <Scale className="h-4 w-4 text-blue-600" />
          <span className="font-mono text-[11px]">Due Diligence Engine</span>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 w-fit">
        <button
          onClick={() => { setMode('CONTRACT'); setResult(null); setInputText(''); }}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
            mode === 'CONTRACT' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Commercial Agreement Risk Scanner
        </button>
        <button
          onClick={() => { setMode('FIR'); setResult(null); setInputText(''); }}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
            mode === 'FIR' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          FIR & Police Offense Classifier (BNS / BNSS)
        </button>
      </div>

      {/* Main Input & Result Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="bg-white p-6 md:p-7 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-600" />
              {mode === 'CONTRACT' ? 'Deed / Agreement Clause Payload' : 'FIR & Complaint Text Input'}
            </h3>
            <span className="font-mono text-[10px] text-slate-400">Plaintext Parser</span>
          </div>

          <textarea
            rows={11}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              mode === 'CONTRACT'
                ? "Paste agreement clauses here, e.g.: 'Party A hereby indemnifies Party B without limit against all liabilities, losses, and legal costs arising from any third party claims. Non-compete clause restricts employee for 3 years across all Indian states...'"
                : "Paste FIR or police notice text here, e.g.: 'Complaint lodged at Hauz Khas Police Station regarding property dispute under Section 103 and Section 318 of BNS 2023...'"
            }
            className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 leading-relaxed font-sans"
          />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
            <button
              onClick={() => setInputText(mode === 'CONTRACT' 
                ? "Party A agrees to indemnify Party B without limit for all losses, including indirect consequential damages. Non-compete clause restricts Party B from engaging in any similar business for 5 years after termination across India."
                : "FIR lodged under Section 103(2) BNS (Mob Violence / Homicide) and Section 318 BNS (Cheating) against Accused regarding disputed partition deed."
              )}
              className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold cursor-pointer underline underline-offset-2"
            >
              Autofill Sample Legal Brief
            </button>

            <button
              onClick={handleScan}
              disabled={loading || !inputText.trim()}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs flex items-center justify-center gap-2 transition disabled:opacity-40 cursor-pointer"
            >
              <span>{loading ? 'Evaluating Clauses...' : 'Run Risk Analysis'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="bg-white p-6 md:p-7 rounded-2xl border border-slate-200 shadow-sm space-y-4 min-h-[380px]">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Statutory Evaluation Report
            </h3>
            <span className="font-mono text-[10px] text-slate-400">Legal Audit Output</span>
          </div>

          {!result && !loading && (
            <div className="h-64 flex flex-col items-center justify-center text-center text-slate-400 space-y-2">
              <FileCheck2 className="h-10 w-10 text-slate-300 stroke-1" />
              <p className="text-xs max-w-xs leading-relaxed">
                Paste contract text or an FIR excerpt and click 'Run Risk Analysis' to generate instant statutory assessments.
              </p>
            </div>
          )}

          {loading && (
            <div className="h-64 flex items-center justify-center text-xs text-slate-800 font-medium gap-2.5">
              <Sparkles className="h-4 w-4 animate-spin text-blue-600" />
              <span>Cross-verifying clauses against Indian Contract Act & BNS precedents...</span>
            </div>
          )}

          {result && mode === 'CONTRACT' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <p className="text-[10px] font-mono font-bold text-slate-500 uppercase">Risk Index</p>
                  <p className="text-lg font-bold text-slate-900">{result.overall_status} ({result.risk_score}/100)</p>
                </div>
                <ShieldAlert className="h-6 w-6 text-amber-500" />
              </div>

              <div className="space-y-2.5">
                <p className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">Identified Risk Vulnerabilities</p>
                {result.flagged_clauses.map((item: any, idx: number) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{item.clause}</span>
                      <span className={item.severity === 'HIGH' ? 'px-2 py-0.5 rounded text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-200' : 'px-2 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200'}>
                        {item.severity} RISK
                      </span>
                    </div>
                    <p className="text-slate-700 text-[11px] leading-relaxed">{item.finding}</p>
                    <p className="text-slate-900 text-[11px] bg-white p-2 rounded-lg border border-slate-200 mt-1">
                      <strong className="text-blue-600">Recommendation:</strong> {item.recommendation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result && mode === 'FIR' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="text-[10px] font-mono font-bold text-slate-500 uppercase">Offense Classification</p>
                <p className="text-base font-bold text-slate-900">{result.offense_category}</p>
                <p className="text-[11px] text-slate-600 font-medium">{result.bail_eligibility}</p>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">Active Statutory Sections</p>
                <div className="flex flex-wrap gap-2">
                  {result.mapped_statutes.map((stat: string, idx: number) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-mono font-bold">
                      {stat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <p className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">Mandatory Procedural Rights (BNSS 2023)</p>
                <div className="space-y-2">
                  {result.procedural_rights.map((right: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2.5 text-slate-800 text-[11px]">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{right}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
