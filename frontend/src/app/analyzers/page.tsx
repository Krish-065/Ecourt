'use client';

import React, { useState } from 'react';
import { FileCheck2, AlertTriangle, ShieldCheck, Sparkles, Gavel, CheckCircle2, ArrowRight } from 'lucide-react';
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
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <FileCheck2 className="h-6 w-6 text-indigo-600" />
            Instant Contract & FIR AI Risk Radar
          </h1>
          <p className="text-xs text-slate-600">
            Deep structural analysis cross-referencing Indian Contract Act 1872, BNS 2023, BNSS 2023 & statutory precedents.
          </p>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white border border-slate-200 w-fit shadow-xs">
        <button
          onClick={() => { setMode('CONTRACT'); setResult(null); setInputText(''); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            mode === 'CONTRACT' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Contract & Agreement Risk Scanner
        </button>
        <button
          onClick={() => { setMode('FIR'); setResult(null); setInputText(''); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            mode === 'FIR' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          FIR & Police Offense Mapper (BNSS / BNS)
        </button>
      </div>

      {/* Main Input & Result Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-600" />
            {mode === 'CONTRACT' ? 'Paste Contract / Deed Text' : 'Paste FIR Contents / Complaint Details'}
          </h3>

          <textarea
            rows={10}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              mode === 'CONTRACT'
                ? "Paste agreement text here e.g.: 'Party A hereby indemnifies Party B without limit against all liabilities, losses, and legal costs arising from any third party claims...'"
                : "Paste FIR excerpt here e.g.: 'FIR filed under Section 302 and Section 420 regarding land transaction fraud in South Delhi...'"
            }
            className="w-full glass-input p-4 rounded-2xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none leading-relaxed"
          />

          <div className="flex items-center justify-between">
            <button
              onClick={() => setInputText(mode === 'CONTRACT' 
                ? "Party A agrees to indemnify Party B without limit for all losses. Non-compete clause restricts Party B for 5 years after termination in all of India."
                : "FIR lodged under Section 103 BNS (Murder) and Section 318 BNS (Cheating) against Accused regarding property dispute."
              )}
              className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold"
            >
              Paste Sample Test Payload
            </button>

            <button
              onClick={handleScan}
              disabled={loading || !inputText.trim()}
              className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-2 transition disabled:opacity-50"
            >
              <span>{loading ? 'Analyzing...' : 'Run Legal AI Scan'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 min-h-[380px]">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            AI Diagnostic & Risk Report
          </h3>

          {!result && !loading && (
            <div className="h-64 flex flex-col items-center justify-center text-center text-slate-400 space-y-2">
              <FileCheck2 className="h-10 w-10 stroke-1" />
              <p className="text-xs">Paste text and click 'Run Legal AI Scan' to view instant statutory risk diagnostic.</p>
            </div>
          )}

          {loading && (
            <div className="h-64 flex items-center justify-center text-xs text-indigo-700 font-bold gap-2">
              <Sparkles className="h-5 w-5 animate-spin text-amber-600" />
              <span>Scanning clauses against BNS, BNSS, and Contract Act precedents...</span>
            </div>
          )}

          {result && mode === 'CONTRACT' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-rose-50 border border-rose-200">
                <div>
                  <p className="text-[10px] text-rose-700 font-bold">Risk Assessment Score</p>
                  <p className="text-lg font-extrabold text-rose-900">{result.overall_status} ({result.risk_score}/100)</p>
                </div>
                <AlertTriangle className="h-6 w-6 text-rose-600" />
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Flagged Clauses</p>
                {result.flagged_clauses.map((item: any, idx: number) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900">{item.clause}</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                        item.severity === 'HIGH' ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {item.severity} RISK
                      </span>
                    </div>
                    <p className="text-slate-700 text-[11px]">{item.finding}</p>
                    <p className="text-emerald-800 font-bold text-[10px] pt-1">💡 <strong>Recommendation:</strong> {item.recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result && mode === 'FIR' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                <p className="text-[10px] text-amber-800 font-bold">Offense Classification</p>
                <p className="text-base font-extrabold text-amber-900">{result.offense_category}</p>
                <p className="text-[11px] text-slate-700 font-medium">{result.bail_eligibility}</p>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Mapped Statutory Sections</p>
                <div className="flex flex-wrap gap-2">
                  {result.mapped_statutes.map((stat: string, idx: number) => (
                    <span key={idx} className="px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-mono font-bold">
                      {stat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Mandatory Procedural Rights (BNSS 2023)</p>
                <div className="space-y-1.5">
                  {result.procedural_rights.map((right: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 text-slate-800 text-[11px] font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>{right}</span>
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
