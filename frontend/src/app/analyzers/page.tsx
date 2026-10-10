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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileCheck2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            Statutory Document & Risk Diagnostic
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Cross-checks clauses against the Indian Contract Act 1872, BNS 2023, BNSS procedural rights, and statutory benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-white font-semibold border border-slate-200/80 dark:border-slate-700/60">
          <Scale className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="font-mono text-[11px]">Due Diligence Engine</span>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 w-fit">
        <button
          onClick={() => { setMode('CONTRACT'); setResult(null); setInputText(''); }}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
            mode === 'CONTRACT' ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Commercial Agreement Risk Scanner
        </button>
        <button
          onClick={() => { setMode('FIR'); setResult(null); setInputText(''); }}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
            mode === 'FIR' ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          FIR & Police Offense Classifier (BNS / BNSS)
        </button>
      </div>

      {/* Main Input & Result Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="bg-white/85 dark:bg-slate-900/60 p-6 md:p-7 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              {mode === 'CONTRACT' ? 'Deed / Agreement Clause Payload' : 'FIR & Complaint Text Input'}
            </h3>
            <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">Plaintext Parser</span>
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
            className="w-full bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 p-4 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
          />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
            <button
              onClick={() => setInputText(mode === 'CONTRACT' 
                ? "Party A agrees to indemnify Party B without limit for all losses, including indirect consequential damages. Non-compete clause restricts Party B from engaging in any similar business for 5 years after termination across India."
                : "FIR lodged under Section 103(2) BNS (Mob Violence / Homicide) and Section 318 BNS (Cheating) against Accused regarding disputed partition deed."
              )}
              className="text-[11px] text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold cursor-pointer underline underline-offset-2"
            >
              Autofill Sample Legal Brief
            </button>

            <button
              onClick={handleScan}
              disabled={loading || !inputText.trim()}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition disabled:opacity-40 cursor-pointer"
            >
              <span>{loading ? 'Evaluating Clauses...' : 'Run Risk Analysis'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="bg-white/85 dark:bg-slate-900/60 p-6 md:p-7 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs backdrop-blur-xl space-y-4 min-h-[380px]">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Statutory Evaluation Report
            </h3>
            <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">Legal Audit Output</span>
          </div>

          {!result && !loading && (
            <div className="h-64 flex flex-col items-center justify-center text-center text-slate-400 dark:text-slate-500 space-y-2">
              <FileCheck2 className="h-10 w-10 text-slate-300 dark:text-slate-600 stroke-1" />
              <p className="text-xs max-w-xs leading-relaxed">
                Paste contract text or an FIR excerpt and click 'Run Risk Analysis' to generate instant statutory assessments.
              </p>
            </div>
          )}

          {loading && (
            <div className="h-64 flex items-center justify-center text-xs text-slate-800 dark:text-slate-200 font-medium gap-2.5">
              <Sparkles className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />
              <span>Cross-verifying clauses against Indian Contract Act & BNS precedents...</span>
            </div>
          )}

          {result && mode === 'CONTRACT' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Agreement Risk Score</span>
                  <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                    {result.risk_score} / 100
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  result.risk_score > 60
                    ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                    : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                }`}>
                  {result.overall_status}
                </span>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Flagged Clauses & Uncapped Liabilities
                </p>
                {result.flagged_clauses?.map((item: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">{item.clause}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.severity === 'HIGH'
                          ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                      }`}>
                        {item.severity} SEVERITY
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{item.finding}</p>
                    <p className="text-blue-600 dark:text-blue-400 font-semibold pt-1">
                      Statutory Fix: {item.recommendation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result && mode === 'FIR' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Offense Classification</span>
                <p className="font-bold text-slate-900 dark:text-white text-base">{result.offense_category}</p>
                <p className="text-slate-600 dark:text-slate-300">Bail Eligibility: <strong className="text-slate-900 dark:text-white">{result.bail_eligibility}</strong></p>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">Mapped Bharatiya Nyaya Sanhita Sections:</span>
                <div className="flex flex-wrap gap-2">
                  {result.mapped_statutes?.map((st: string, idx: number) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-mono font-semibold">
                      {st}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-1.5">
                <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                  <Gavel className="h-4 w-4" /> Recommended Defense Strategy:
                </span>
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  {result.recommended_strategy}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
