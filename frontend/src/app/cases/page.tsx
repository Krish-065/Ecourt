'use client';

import React, { useState } from 'react';
import {
  Briefcase,
  CalendarDays,
  Plus,
  Clock,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Search,
  ChevronRight,
  Globe,
  Building,
  User,
  Gavel,
  RefreshCw,
  Download,
  Check,
} from 'lucide-react';
import { fetchECourtDetails } from '../../lib/api';

export default function CaseManagementPage() {
  const [activeTab, setActiveTab] = useState<'LIST' | 'ECOURTS_FETCH' | 'TIMELINE'>('ECOURTS_FETCH');

  // eCourts Search State
  const [cnrNumber, setCnrNumber] = useState('');
  const [caseType, setCaseType] = useState('');
  const [caseNumber, setCaseNumber] = useState('');
  const [caseYear, setCaseYear] = useState('');
  const [partyName, setPartyName] = useState('');
  const [searching, setSearching] = useState(false);
  const [fetchedRecord, setFetchedRecord] = useState<any>(null);
  const [imported, setImported] = useState(false);
  const [activeCases, setActiveCases] = useState<any[]>([]);

  const handleFetchECourt = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(true);
    setFetchedRecord(null);
    setImported(false);

    const res = await fetchECourtDetails({
      cnrNumber,
      caseType,
      caseNumber,
      caseYear,
      partyName,
    });

    setSearching(false);
    if (res.success && res.data) {
      setFetchedRecord(res.data);
    }
  };

  const handleImportCase = () => {
    if (!fetchedRecord) return;
    const newCase = {
      id: fetchedRecord.cnrNumber,
      title: fetchedRecord.title,
      court: fetchedRecord.courtName,
      nextHearing: `${fetchedRecord.nextHearingDate} (10:30 AM)`,
      judge: fetchedRecord.presidingJudge,
      priority: 'IMPORTED FROM ECOURTS',
      stage: fetchedRecord.caseStage,
      summary: `Synced from eCourts Services. Statute: ${fetchedRecord.statuteSection}. Petitioner: ${fetchedRecord.petitioner}. Respondent: ${fetchedRecord.respondent}.`,
    };
    setActiveCases([newCase, ...activeCases]);
    setImported(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-indigo-600" />
            eCourts Live Fetcher & Portfolio Management
          </h1>
          <p className="text-xs text-slate-600">
            Search official eCourts records by CNR Number or Case Details, sync hearings, and manage evidence.
          </p>
        </div>

        <button className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-2 transition">
          <Plus className="h-4 w-4" />
          <span>Manual Case Filing</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white border border-slate-200 w-fit shadow-xs">
        <button
          onClick={() => setActiveTab('ECOURTS_FETCH')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'ECOURTS_FETCH' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Globe className="h-3.5 w-3.5" />
          <span>eCourts Live Search</span>
        </button>

        <button
          onClick={() => setActiveTab('LIST')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'LIST' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Active Portfolio ({activeCases.length})
        </button>

        <button
          onClick={() => setActiveTab('TIMELINE')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'TIMELINE' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Evidence Timeline
        </button>
      </div>

      {/* Tab 1: eCourts Live Search & Import */}
      {activeTab === 'ECOURTS_FETCH' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Search className="h-4 w-4 text-indigo-600" />
                Search Official eCourts Case Repository (Indian Jurisdiction)
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
                LIVE API SIMULATOR
              </span>
            </div>

            <form onSubmit={handleFetchECourt} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1 md:col-span-1">
                  <label className="text-slate-700 font-bold">16-Digit Unique CNR Number</label>
                  <input
                    type="text"
                    value={cnrNumber}
                    onChange={(e) => setCnrNumber(e.target.value)}
                    placeholder="e.g. MHAU010048212024"
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl font-mono text-slate-900 uppercase"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-slate-700 font-bold">Or Search by Case Type / Number / Year</label>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={caseType}
                      onChange={(e) => setCaseType(e.target.value)}
                      placeholder="Type (e.g. W.P.)"
                      className="glass-input px-3 py-2.5 rounded-xl text-slate-900"
                    />
                    <input
                      type="text"
                      value={caseNumber}
                      onChange={(e) => setCaseNumber(e.target.value)}
                      placeholder="Case No (4582)"
                      className="glass-input px-3 py-2.5 rounded-xl text-slate-900"
                    />
                    <input
                      type="text"
                      value={caseYear}
                      onChange={(e) => setCaseYear(e.target.value)}
                      placeholder="Year (2024)"
                      className="glass-input px-3 py-2.5 rounded-xl text-slate-900"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={searching}
                  className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-2 transition"
                >
                  {searching ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Fetching from eCourts Database...</span>
                    </>
                  ) : (
                    <>
                      <Globe className="h-4 w-4" />
                      <span>Fetch Live Court Case Details</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Fetched Record Card */}
          {fetchedRecord && (
            <div className="bg-white p-6 rounded-3xl border border-indigo-200 shadow-md space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      LIVE RECORD VERIFIED
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500">CNR: {fetchedRecord.cnrNumber}</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 mt-1">{fetchedRecord.title}</h3>
                  <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                    <Building className="h-3.5 w-3.5 text-indigo-600" />
                    {fetchedRecord.courtName}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleImportCase}
                    disabled={imported}
                    className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-1.5 transition ${
                      imported
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20'
                    }`}
                  >
                    {imported ? (
                      <>
                        <Check className="h-4 w-4" /> Case Imported to Portfolio
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" /> Import Case to Portfolio
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <p className="text-slate-500 font-bold">Presiding Bench</p>
                  <p className="font-semibold text-slate-900 mt-1">{fetchedRecord.presidingJudge}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                  <p className="text-amber-800 font-bold">Next Hearing Date</p>
                  <p className="font-extrabold text-amber-900 mt-1 text-sm">{fetchedRecord.nextHearingDate}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <p className="text-slate-500 font-bold">Current Stage of Case</p>
                  <p className="font-semibold text-slate-900 mt-1">{fetchedRecord.caseStage}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <p className="text-slate-500 font-bold">Statute & Section</p>
                  <p className="font-mono font-semibold text-slate-900 mt-1">{fetchedRecord.statuteSection}</p>
                </div>
              </div>

              {/* Parties & Advocates */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="font-bold text-slate-700 flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-indigo-600" /> Petitioner & Counsel
                  </p>
                  <p className="text-slate-900 font-semibold mt-1">{fetchedRecord.petitioner}</p>
                  <p className="text-slate-500 font-mono text-[11px]">{fetchedRecord.petitionerAdvocate}</p>
                </div>

                <div>
                  <p className="font-bold text-slate-700 flex items-center gap-1">
                    <Gavel className="h-3.5 w-3.5 text-indigo-600" /> Respondent & Counsel
                  </p>
                  <p className="text-slate-900 font-semibold mt-1">{fetchedRecord.respondent}</p>
                  <p className="text-slate-500 font-mono text-[11px]">{fetchedRecord.respondentAdvocate}</p>
                </div>
              </div>

              {/* Court Orders */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-slate-900">Recent eCourts Orders & Daily Proceedings</h4>
                <div className="space-y-2">
                  {fetchedRecord.recentOrders?.map((order: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                      <span className="font-mono font-bold text-indigo-700 px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-[10px]">
                        {order.date}
                      </span>
                      <p className="text-slate-800 font-medium">{order.orderSummary}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Active Case Portfolio */}
      {activeTab === 'LIST' && (
        <div className="space-y-4">
          {activeCases.map((c, i) => (
            <div key={i} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-amber-100 text-amber-800 border border-amber-300">
                    {c.priority}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 mt-2">{c.title}</h2>
                  <p className="text-xs text-slate-500">
                    Case ID: <span className="font-mono text-slate-800 font-bold">{c.id}</span> • Court: {c.court}
                  </p>
                </div>

                <div className="text-right space-y-1">
                  <p className="text-xs text-slate-500 font-bold">Next Hearing Date</p>
                  <p className="text-xs font-extrabold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    {c.nextHearing}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <p className="text-slate-700 leading-relaxed font-medium">
                  <strong>Summary:</strong> {c.summary}
                </p>
                <div className="flex flex-wrap gap-4 text-[11px] text-slate-600 pt-2 border-t border-slate-200">
                  <span>Presiding Judge: <strong className="text-slate-900">{c.judge}</strong></span>
                  <span>Stage: <strong className="text-indigo-700 font-bold">{c.stage}</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Evidence Timeline */}
      {activeTab === 'TIMELINE' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-600" />
            Chronological Evidence & Incident Timeline (Case: EC-DEL-2026-0042)
          </h3>

          <div className="relative border-l-2 border-indigo-400 ml-4 space-y-8 pl-6">
            {/* Event Node 1 */}
            <div className="relative">
              <span className="absolute -left-[31px] top-0 h-4 w-4 rounded-full bg-indigo-600 ring-4 ring-white"></span>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span className="font-bold text-indigo-700">INCIDENT RECORDED • Jun 12, 2026</span>
                  <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-bold">DIGITAL EVIDENCE</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Encroachment Notice Served & CCTV Timestamp Logged</h4>
                <p className="text-slate-600">CCTV footage captured unauthorized boundary wall alteration. File hash verified via SHA-256 integrity.</p>
                <div className="flex items-center gap-2 text-[10px] text-emerald-700 font-bold pt-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Evidence Cryptographically Signed & Uploaded to Encrypted Vault
                </div>
              </div>
            </div>

            {/* Event Node 2 */}
            <div className="relative">
              <span className="absolute -left-[31px] top-0 h-4 w-4 rounded-full bg-amber-500 ring-4 ring-white"></span>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span className="font-bold text-amber-800">FIR LODGED • Jun 18, 2026</span>
                  <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-bold">POLICE RECORD</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">FIR No. 204/2026 Registered under BNS Sec 329</h4>
                <p className="text-slate-600">Registered at Police Station Hauz Khas. Investigating Officer assigned.</p>
              </div>
            </div>

            {/* Event Node 3 */}
            <div className="relative">
              <span className="absolute -left-[31px] top-0 h-4 w-4 rounded-full bg-emerald-500 ring-4 ring-white"></span>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span className="font-bold text-emerald-800">COURT HEARING • Jul 04, 2026</span>
                  <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-bold">HIGH COURT</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Interim Status Quo Notice Issued</h4>
                <p className="text-slate-600">Hon'ble Justice Gauba granted interim protection pending land survey report.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
