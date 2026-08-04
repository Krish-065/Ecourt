'use client';

import React, { useState } from 'react';
import { BookOpenCheck, Search, Sparkles, Scale, BookOpen, ExternalLink, Bookmark, ChevronRight } from 'lucide-react';
import { queryAIAgent } from '../../lib/api';

export default function BareActResearchPage() {
  const [query, setQuery] = useState('');
  const [selectedStatute, setSelectedStatute] = useState('ALL');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;
    setLoading(true);
    const res = await queryAIAgent('LEGAL_RESEARCH_ASSISTANT', `[Statute Filter: ${selectedStatute}] ${query}`);
    setResponse(res);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <BookOpenCheck className="h-6 w-6 text-amber-600" />
            Bare Act Chat & Judicial Precedents Portal
          </h1>
          <p className="text-xs text-slate-600">
            Semantic vector search across Bharatiya Nyaya Sanhita (BNS), BNSS, BSA, Indian Constitution & landmark SC judgments.
          </p>
        </div>
      </div>

      {/* Statute Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {['ALL', 'BHARATIYA_NYAYA_SANHITA', 'BNSS_2023', 'EVIDENCE_ACT_BSA', 'CONSTITUTION'].map((stat) => (
          <button
            key={stat}
            onClick={() => setSelectedStatute(stat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedStatute === stat
                ? 'bg-amber-500 text-amber-950 shadow-md shadow-amber-500/20'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {stat.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1 bg-white border border-slate-200 px-4 py-3 rounded-2xl flex items-center gap-3 shadow-sm focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 transition">
          <Search className="h-5 w-5 text-amber-600" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search BNS Section, Constitutional Right, or Case Law (e.g. 'Section 103 BNS', 'Article 21 life liberty', 'natural justice')..."
            className="w-full bg-transparent text-slate-900 text-xs placeholder-slate-400 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold text-xs shadow-md shadow-amber-500/20 flex items-center gap-2 transition disabled:opacity-50"
        >
          <Sparkles className="h-4 w-4" />
          <span>{loading ? 'Searching...' : 'Search Legal Corpus'}</span>
        </button>
      </form>

      {/* Search Results */}
      {response && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Scale className="h-4 w-4 text-amber-600" />
              Statutory Research Summary & Citations
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
              Confidence Score: {response.confidence_score}%
            </span>
          </div>

          <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap font-medium">
            {response.response}
          </div>

          {response.citations && response.citations.length > 0 && (
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Ground Truth Precedents & Bare Act Sections</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {response.citations.map((c: any, idx: number) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900">{c.source}</span>
                      <span className="text-amber-800 font-mono text-[10px] font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">{c.reference}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-2">{c.excerpt}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
