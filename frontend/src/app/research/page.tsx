'use client';

import React, { useState } from 'react';
import { BookOpenCheck, Search, Sparkles, Scale, BookOpen, ExternalLink, Bookmark, ChevronRight, CheckCircle2 } from 'lucide-react';
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

  const sampleQueries = [
    "Section 103(2) Bharatiya Nyaya Sanhita mob lynching penalties",
    "Article 21 procedural due process vs procedure established by law",
    "Bharatiya Sakshya Adhiniyam Section 61 admissibility of electronic records",
    "Section 438 CrPC anticipatory bail principles under BNSS"
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpenCheck className="h-6 w-6 text-blue-600" />
            Statutory Research & Precedent Corpus
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Grounded vector retrieval across Bharatiya Nyaya Sanhita (BNS), BNSS, BSA, Constitution of India, and Supreme Court rulings.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 text-xs text-slate-900 font-semibold border border-slate-200">
          <Scale className="h-4 w-4 text-blue-600" />
          <span className="font-mono text-[11px]">Bare Acts 2024 Ingested</span>
        </div>
      </div>

      {/* Statute Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: 'ALL', label: 'All Jurisdictions' },
          { id: 'BHARATIYA_NYAYA_SANHITA', label: 'BNS 2023' },
          { id: 'BNSS_2023', label: 'BNSS 2023 (Procedure)' },
          { id: 'EVIDENCE_ACT_BSA', label: 'BSA 2023 (Evidence)' },
          { id: 'CONSTITUTION', label: 'Constitution of India' }
        ].map((stat) => (
          <button
            key={stat.id}
            onClick={() => setSelectedStatute(stat.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              selectedStatute === stat.id
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {stat.label}
          </button>
        ))}
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 bg-white border border-slate-200 px-4 py-3 rounded-xl flex items-center gap-3 shadow-2xs focus-within:border-blue-600 transition">
          <Search className="h-4 w-4 text-blue-600 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search BNS Section, Constitutional Article, or Ratio Decidendi (e.g. 'Section 103 BNS', 'Article 21 life liberty')..."
            className="w-full bg-transparent text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer shrink-0"
        >
          <Sparkles className="h-4 w-4" />
          <span>{loading ? 'Synthesizing...' : 'Search Corpus'}</span>
        </button>
      </form>

      {/* Suggested Jurisprudential Topics */}
      {!response && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <div className="text-xs font-bold text-slate-900">Curated Research Inquiries</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {sampleQueries.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => setQuery(sample)}
                className="text-left p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-400 text-xs text-slate-800 transition cursor-pointer flex items-center justify-between"
              >
                <span className="line-clamp-1">{sample}</span>
                <ChevronRight className="w-3.5 h-3.5 text-blue-600 shrink-0 ml-2" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {response && (
        <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Scale className="h-4 w-4 text-blue-600" />
              Statutory Research Synthesis
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Match Confidence: {response.confidence_score}%
            </span>
          </div>

          <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
            {response.response}
          </div>

          {response.citations && response.citations.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Grounded Bare Act Citations & Landmark Authorities
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {response.citations.map((c: any, idx: number) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{c.source}</span>
                      <span className="font-mono text-[10px] text-blue-700 font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                        {(c.relevance_score * 100).toFixed(0)}% Relevance
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px]">{c.reference}</p>
                    {c.text && (
                      <p className="text-slate-800 text-[11px] italic bg-white p-2.5 rounded-lg border border-slate-200 mt-1">
                        "{c.text}"
                      </p>
                    )}
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
