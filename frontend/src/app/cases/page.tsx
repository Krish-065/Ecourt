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
  Scale
} from 'lucide-react';
import { fetchECourtDetails } from '../../lib/api';

export default function CaseManagementPage() {
  const [activeTab, setActiveTab] = useState<'ECOURTS_FETCH' | 'LIST' | 'TIMELINE'>('ECOURTS_FETCH');

  // eCourts Search State
  const [cnrNumber, setCnrNumber] = useState('');
  const [caseType, setCaseType] = useState('');
  const [caseNumber, setCaseNumber] = useState('');
  const [caseYear, setCaseYear] = useState('');
  const [partyName, setPartyName] = useState('');
  const [searching, setSearching] = useState(false);
  const [fetchedRecord, setFetchedRecord] = useState<any>(null);
  const [imported, setImported] = useState(false);
  const [activeCases, setActiveCases] = useState<any[]>([
    {
      id: 'EC-DEL-2026-0042',
      title: 'Priya Verma vs. State of NCT Delhi',
      court: 'High Court of Delhi (Civil Bench 4)',
      nextHearing: 'Aug 18, 2026 (10:30 AM)',
      judge: 'Hon\'ble Justice Vipin Sanghi',
      priority: 'UNDER TRIAL',
      stage: 'Arguments on Demarcation',
      summary: 'Interim injunction petition regarding contested boundary demarcations and municipal survey reports under BNS Section 329 & BNSS 144.',
    },
    {
      id: 'MHAU010048212024',
      title: 'Nexus Retail Pvt Ltd vs. Municipal Corporation of Greater Mumbai',
      court: 'Bombay High Court (Original Side)',
      nextHearing: 'Sep 02, 2026 (02:00 PM)',
      judge: 'Hon\'ble Justice G. S. Patel',
      priority: 'HIGH PRIORITY',
      stage: 'Reply Affidavit Awaited',
      summary: 'Writ Petition under Article 226 challenging property assessment re-evaluation and municipal commercial license cancellation notice.',
    }
  ]);

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
      priority: 'IMPORTED RECORD',
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
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Scale className="h-6 w-6 text-blue-600" />
            eCourts Live Tracking & Case Records
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Query official eCourts records via 16-character CNR numbers or case metadata across High Courts and Subordinate Courts.
          </p>
        </div>

        <button 
          onClick={() => setActiveTab('ECOURTS_FETCH')}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm flex items-center gap-2 transition cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>New Case Lookup</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 w-fit">
        <button
          onClick={() => setActiveTab('ECOURTS_FETCH')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'ECOURTS_FETCH' 
              ? 'bg-blue-600 text-white shadow-xs' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Globe className="h-3.5 w-3.5" />
          <span>eCourts Live Search</span>
        </button>

        <button
          onClick={() => setActiveTab('LIST')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
            activeTab === 'LIST' 
              ? 'bg-blue-600 text-white shadow-xs' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Active Portfolio ({activeCases.length})
        </button>

        <button
          onClick={() => setActiveTab('TIMELINE')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
            activeTab === 'TIMELINE' 
              ? 'bg-blue-600 text-white shadow-xs' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Evidence Timeline
        </button>
      </div>

      {/* Tab 1: eCourts Live Search & Import */}
      {activeTab === 'ECOURTS_FETCH' && (
        <div className="space-y-6">
          <div className="bg-white p-6 md:p-7 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Search className="h-4 w-4 text-blue-600" />
                Query Indian National Judicial Repository
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                Live eCourts Grid
              </span>
            </div>

            <form onSubmit={handleFetchECourt} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5 md:col-span-1">
                  <label className="text-slate-700 font-semibold">16-Digit CNR Number</label>
                  <input
                    type="text"
                    value={cnrNumber}
                    onChange={(e) => setCnrNumber(e.target.value)}
                    placeholder="e.g. MHAU010048212024"
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl font-mono text-slate-900 uppercase text-xs focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-slate-700 font-semibold">Or Search by Case Details (Type / No / Year)</label>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={caseType}
                      onChange={(e) => setCaseType(e.target.value)}
                      placeholder="Type (e.g. W.P.)"
                      className="bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-blue-600"
                    />
                    <input
                      type="text"
                      value={caseNumber}
                      onChange={(e) => setCaseNumber(e.target.value)}
                      placeholder="Case No (4582)"
                      className="bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-blue-600"
                    />
                    <input
                      type="text"
                      value={caseYear}
                      onChange={(e) => setCaseYear(e.target.value)}
                      placeholder="Year (2024)"
                      className="bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={searching}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs flex items-center gap-2 transition cursor-pointer"
                >
                  {searching ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin text-white" />
                      <span>Fetching from Judicial Grid...</span>
                    </>
                  ) : (
                    <>
                      <Globe className="h-4 w-4" />
                      <span>Fetch Live Docket Details</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Fetched Record Card */}
          {fetchedRecord && (
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-blue-200 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      LIVE RECORD VERIFIED
                    </span>
                    <span className="text-xs font-mono text-slate-500">CNR: {fetchedRecord.cnrNumber}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mt-1.5">{fetchedRecord.title}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                    <Building className="h-3.5 w-3.5 text-blue-600" />
                    {fetchedRecord.courtName}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleImportCase}
                    disabled={imported}
                    className={`px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition ${
                      imported
                        ? 'bg-slate-100 text-slate-600 border border-slate-200 cursor-default'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                    }`}
                  >
                    {imported ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-600" /> Docket Synced to Portfolio
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 text-white" /> Import Docket into Chamber
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-slate-500 font-medium">Presiding Bench</p>
                  <p className="font-bold text-slate-900 mt-1">{fetchedRecord.presidingJudge}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-blue-600 font-medium">Next Hearing Date</p>
                  <p className="font-bold text-slate-900 mt-1">{fetchedRecord.nextHearingDate}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-slate-500 font-medium">Current Case Stage</p>
                  <p className="font-bold text-slate-900 mt-1">{fetchedRecord.caseStage}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-slate-500 font-medium">Statute & Provisions</p>
                  <p className="font-mono font-medium text-slate-900 mt-1">{fetchedRecord.statuteSection}</p>
                </div>
              </div>

              {/* Parties & Advocates */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-blue-600" /> Petitioner & Counsel
                  </p>
                  <p className="text-slate-800 font-semibold mt-1">{fetchedRecord.petitioner}</p>
                  <p className="text-slate-500 font-mono text-[11px] mt-0.5">{fetchedRecord.petitionerAdvocate}</p>
                </div>

                <div>
                  <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <Gavel className="h-3.5 w-3.5 text-blue-600" /> Respondent & Counsel
                  </p>
                  <p className="text-slate-800 font-semibold mt-1">{fetchedRecord.respondent}</p>
                  <p className="text-slate-500 font-mono text-[11px] mt-0.5">{fetchedRecord.respondentAdvocate}</p>
                </div>
              </div>

              {/* Court Orders */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-slate-900 text-sm">Interim Orders & Proceedings Log</h4>
                <div className="space-y-2">
                  {fetchedRecord.recentOrders?.map((order: any, idx: number) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-start gap-3">
                      <span className="font-mono text-blue-600 font-semibold px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-[10px] shrink-0">
                        {order.date}
                      </span>
                      <p className="text-slate-800 leading-relaxed">{order.orderSummary}</p>
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
            <div key={i} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    {c.priority}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 mt-1.5">{c.title}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    CNR / Reference: <span className="font-mono font-medium text-slate-900">{c.id}</span> • Forum: {c.court}
                  </p>
                </div>

                <div className="sm:text-right space-y-1">
                  <p className="text-[11px] text-slate-500 font-medium">Next Cause List Date</p>
                  <p className="text-xs font-bold text-slate-900 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200 inline-block">
                    {c.nextHearing}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <p className="text-slate-800 leading-relaxed">
                  <strong className="text-slate-900">Matter Summary:</strong> {c.summary}
                </p>
                <div className="flex flex-wrap gap-4 text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                  <span>Presiding Bench: <strong className="text-slate-900">{c.judge}</strong></span>
                  <span>Procedural Stage: <strong className="text-blue-600 font-semibold">{c.stage}</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Evidence Timeline */}
      {activeTab === 'TIMELINE' && (
        <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              Chronological Incident & Procedural Record (Docket: EC-DEL-2026-0042)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Tamper-evident legal audit log with verified SHA-256 evidence hashes.
            </p>
          </div>

          <div className="relative border-l-2 border-blue-200 ml-4 space-y-8 pl-6">
            {/* Event Node 1 */}
            <div className="relative">
              <span className="absolute -left-[31px] top-0 h-4 w-4 rounded-full bg-blue-600 ring-4 ring-white" />
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span className="font-semibold text-slate-900">Jun 12, 2026 • 11:45 AM</span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200">DIGITAL EVIDENCE</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Encroachment Notice Served & CCTV Timestamp Ingested</h4>
                <p className="text-slate-700 leading-relaxed">High-resolution CCTV footage captured unlawful boundary wall construction during court vacation. SHA-256 integrity hash verified.</p>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-semibold pt-1">
                  <ShieldCheck className="h-3.5 w-3.5" /> Cryptographically anchored in Evidence Vault
                </div>
              </div>
            </div>

            {/* Event Node 2 */}
            <div className="relative">
              <span className="absolute -left-[31px] top-0 h-4 w-4 rounded-full bg-slate-700 ring-4 ring-white" />
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span className="font-semibold text-slate-900">Jun 18, 2026 • 04:30 PM</span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-200 text-slate-800">POLICE RECORD</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">FIR No. 204/2026 Registered under BNS Sec 329</h4>
                <p className="text-slate-700 leading-relaxed">Registered at Hauz Khas Police Station. Investigating officer conducted preliminary on-site panchnama.</p>
              </div>
            </div>

            {/* Event Node 3 */}
            <div className="relative">
              <span className="absolute -left-[31px] top-0 h-4 w-4 rounded-full bg-emerald-600 ring-4 ring-white" />
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span className="font-semibold text-slate-900">Jul 04, 2026 • 10:30 AM</span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">HIGH COURT ORDER</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Interim Status Quo Notice Issued</h4>
                <p className="text-slate-700 leading-relaxed">Hon'ble Justice Gauba granted interim protection directing all parties to maintain physical status quo pending the demarcation report.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
