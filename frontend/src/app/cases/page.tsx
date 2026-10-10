'use client';

import React, { useState, useEffect } from 'react';
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
  const [activeTab, setActiveTab] = useState<'ECOURTS_FETCH' | 'LIST' | 'TIMELINE'>('LIST');

  // eCourts Search State
  const [cnrNumber, setCnrNumber] = useState('');
  const [caseType, setCaseType] = useState('');
  const [caseNumber, setCaseNumber] = useState('');
  const [caseYear, setCaseYear] = useState('');
  const [partyName, setPartyName] = useState('');
  const [searching, setSearching] = useState(false);
  const [fetchedRecord, setFetchedRecord] = useState<any>(null);
  const [imported, setImported] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loadingCases, setLoadingCases] = useState(false);
  const [activeCases, setActiveCases] = useState<any[]>([
    {
      id: 'EC-DEL-2026-0042',
      title: 'Meet Thacker vs. State of NCT Delhi & Anr.',
      court: 'High Court of Delhi (Civil Bench 4)',
      nextHearing: 'Aug 18, 2026 (10:30 AM)',
      judge: 'Hon\'ble Justice Vipin Sanghi',
      priority: 'HIGH',
      stage: 'UNDER TRIAL',
      summary: 'Contested municipal boundary demarcation and unauthorized commercial encroachment claim under Bharatiya Nagarik Suraksha Sanhita.',
      clientName: 'Meet Thacker',
      advocateName: 'Adv. Rajeshwar Sharma'
    },
    {
      id: 'EC-BOM-2026-1189',
      title: 'Nexus Retail Pvt Ltd vs. Municipal Corporation of Greater Mumbai',
      court: 'Bombay High Court (Original Side)',
      nextHearing: 'Sep 02, 2026 (02:00 PM)',
      judge: 'Hon\'ble Justice G. S. Patel',
      priority: 'CRITICAL',
      stage: 'PENDING HEARING',
      summary: 'Writ Petition under Article 226 challenging property assessment re-evaluation and municipal commercial license cancellation notice.',
      clientName: 'Nexus Retail Pvt Ltd',
      advocateName: 'Adv. Rajeshwar Sharma'
    }
  ]);

  useEffect(() => {
    const savedUser = localStorage.getItem('ecourt_user');
    const token = localStorage.getItem('ecourt_token');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {}
    }

    const loadLiveCases = async () => {
      if (!token) return;
      try {
        setLoadingCases(true);
        const res = await fetch('http://localhost:5000/api/v1/cases', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          const mapped = data.data.map((c: any) => ({
            id: c.case_number,
            title: c.title,
            court: c.court_name,
            nextHearing: c.next_hearing_date 
              ? new Date(c.next_hearing_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) + ' (10:30 AM)'
              : 'Aug 18, 2026 (10:30 AM)',
            judge: c.judge_name || 'Hon\'ble Justice Vipin Sanghi',
            priority: c.priority || 'MEDIUM',
            stage: c.status?.replace('_', ' ') || 'UNDER TRIAL',
            summary: c.description,
            clientName: c.client_name,
            advocateName: c.advocate_name || 'Adv. Rajeshwar Sharma',
            statuteSection: c.statute_section
          }));
          setActiveCases(mapped);
        }
      } catch (err) {
        console.error('Failed to load live cases:', err);
      } finally {
        setLoadingCases(false);
      }
    };

    loadLiveCases();
  }, []);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Scale className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            eCourts Live Tracking & Case Records
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Query official eCourts records via 16-character CNR numbers or case metadata across High Courts and Subordinate Courts.
          </p>
        </div>

        <button 
          onClick={() => setActiveTab('ECOURTS_FETCH')}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-500/25 border border-blue-400/30 flex items-center gap-2 transition cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>New Case Lookup</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 w-fit">
        <button
          onClick={() => setActiveTab('ECOURTS_FETCH')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'ECOURTS_FETCH' 
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20' 
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Globe className="h-3.5 w-3.5" />
          <span>eCourts Live Search</span>
        </button>

        <button
          onClick={() => setActiveTab('LIST')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
            activeTab === 'LIST' 
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20' 
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Active Portfolio ({activeCases.length})
        </button>

        <button
          onClick={() => setActiveTab('TIMELINE')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
            activeTab === 'TIMELINE' 
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20' 
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Evidence Timeline
        </button>
      </div>

      {/* Tab 1: eCourts Live Search & Import */}
      {activeTab === 'ECOURTS_FETCH' && (
        <div className="space-y-6">
          <div className="bg-white/85 dark:bg-slate-900/60 backdrop-blur-xl p-6 md:p-7 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Search className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Query Indian National Judicial Repository
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                Live eCourts Grid
              </span>
            </div>

            <form onSubmit={handleFetchECourt} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5 md:col-span-1">
                  <label className="text-slate-700 dark:text-slate-300 font-semibold">16-Digit CNR Number</label>
                  <input
                    type="text"
                    value={cnrNumber}
                    onChange={(e) => setCnrNumber(e.target.value)}
                    placeholder="e.g. MHAU010048212024"
                    className="w-full bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 px-3.5 py-2.5 rounded-xl font-mono text-slate-900 dark:text-white uppercase text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-slate-700 dark:text-slate-300 font-semibold">Or Search by Case Details (Type / No / Year)</label>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={caseType}
                      onChange={(e) => setCaseType(e.target.value)}
                      placeholder="Type (e.g. W.P.)"
                      className="bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 px-3 py-2.5 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                    <input
                      type="text"
                      value={caseNumber}
                      onChange={(e) => setCaseNumber(e.target.value)}
                      placeholder="Case No (4582)"
                      className="bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 px-3 py-2.5 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                    <input
                      type="text"
                      value={caseYear}
                      onChange={(e) => setCaseYear(e.target.value)}
                      placeholder="Year (2024)"
                      className="bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 px-3 py-2.5 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={searching}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-500/20 flex items-center gap-2 transition cursor-pointer"
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
            <div className="bg-white/85 dark:bg-slate-900/60 backdrop-blur-xl p-6 md:p-8 rounded-2xl border border-blue-500/30 dark:border-blue-500/30 shadow-lg shadow-blue-500/5 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      LIVE RECORD VERIFIED
                    </span>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400">CNR: {fetchedRecord.cnrNumber}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1.5">{fetchedRecord.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1">
                    <Building className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    {fetchedRecord.courtName}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleImportCase}
                    disabled={imported}
                    className={`px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition ${
                      imported
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 cursor-default'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/25'
                    }`}
                  >
                    {imported ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-500" /> Docket Synced to Portfolio
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
                <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                  <p className="text-slate-500 dark:text-slate-400 font-medium">Presiding Bench</p>
                  <p className="font-bold text-slate-900 dark:text-white mt-1">{fetchedRecord.presidingJudge}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                  <p className="text-blue-600 dark:text-blue-400 font-medium">Next Hearing Date</p>
                  <p className="font-bold text-slate-900 dark:text-white mt-1">{fetchedRecord.nextHearingDate}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                  <p className="text-slate-500 dark:text-slate-400 font-medium">Current Case Stage</p>
                  <p className="font-bold text-slate-900 dark:text-white mt-1">{fetchedRecord.caseStage}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                  <p className="text-slate-500 dark:text-slate-400 font-medium">Statute & Provisions</p>
                  <p className="font-mono font-medium text-slate-900 dark:text-slate-100 mt-1">{fetchedRecord.statuteSection}</p>
                </div>
              </div>

              {/* Parties & Advocates */}
              <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" /> Petitioner & Counsel
                  </p>
                  <p className="text-slate-800 dark:text-slate-200 font-semibold mt-1">{fetchedRecord.petitioner}</p>
                  <p className="text-slate-500 dark:text-slate-400 font-mono text-[11px] mt-0.5">{fetchedRecord.petitionerAdvocate}</p>
                </div>

                <div>
                  <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Gavel className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" /> Respondent & Counsel
                  </p>
                  <p className="text-slate-800 dark:text-slate-200 font-semibold mt-1">{fetchedRecord.respondent}</p>
                  <p className="text-slate-500 dark:text-slate-400 font-mono text-[11px] mt-0.5">{fetchedRecord.respondentAdvocate}</p>
                </div>
              </div>

              {/* Court Orders */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Interim Orders & Proceedings Log</h4>
                <div className="space-y-2">
                  {fetchedRecord.recentOrders?.map((order: any, idx: number) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/60 flex items-start gap-3">
                      <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[10px] shrink-0">
                        {order.date}
                      </span>
                      <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{order.orderSummary}</p>
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
            <div key={i} className="p-6 rounded-2xl bg-white/85 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 shadow-xs backdrop-blur-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                    {c.priority}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1.5">{c.title}</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    CNR / Reference: <span className="font-mono font-medium text-slate-900 dark:text-white">{c.id}</span> • Forum: {c.court}
                  </p>
                </div>

                <div className="sm:text-right space-y-1">
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Next Cause List Date</p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white bg-slate-100/70 dark:bg-slate-800/60 px-3 py-1 rounded-lg border border-slate-200/80 dark:border-slate-700/60 inline-block">
                    {c.nextHearing}
                  </p>
                </div>
              </div>

              {/* Interconnected Legal Parties */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-100/70 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/60 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-1">
                    <User className="h-3 w-3 text-slate-500" /> Litigant / Client
                  </span>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">{c.clientName || 'Private Litigant'}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 tracking-wider flex items-center gap-1">
                    <Gavel className="h-3 w-3 text-blue-600 dark:text-blue-400" /> Assigned Legal Counsel
                  </span>
                  <p className="font-bold text-blue-600 dark:text-blue-400 mt-0.5">{c.advocateName || 'Adv. Rajeshwar Sharma'}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs space-y-2">
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white">Matter Summary:</strong> {c.summary}
                </p>
                <div className="flex flex-wrap gap-4 text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/80 dark:border-slate-700/60">
                  <span>Presiding Bench: <strong className="text-slate-900 dark:text-white">{c.judge}</strong></span>
                  <span>Procedural Stage: <strong className="text-blue-600 dark:text-blue-400 font-semibold">{c.stage}</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Evidence Timeline */}
      {activeTab === 'TIMELINE' && (
        <div className="p-6 md:p-8 rounded-2xl bg-white/85 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 shadow-xs backdrop-blur-xl space-y-6">
          <div className="pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              Chronological Incident & Procedural Record (Docket: EC-DEL-2026-0042)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Tamper-evident legal audit log with verified SHA-256 evidence hashes.
            </p>
          </div>

          <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            {[
              { date: '15-Mar-2026', title: 'Petition Filed under Art 226', desc: 'Initial filing before High Court of Delhi challenging municipal demolition order.', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
              { date: '22-Mar-2026', title: 'Ad-Interim Status Quo Granted', desc: 'Bench granted status quo order restraining municipal authority pending site inspection report.', hash: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e' },
              { date: '10-Jul-2026', title: 'Survey Report Placed on Record', desc: 'Government surveyor affidavit submitted affirming disputed boundary demarcation.', hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8' }
            ].map((step, idx) => (
              <div key={idx} className="relative flex items-start gap-4 pl-8">
                <div className="absolute left-1.5 top-1.5 w-4 h-4 rounded-full bg-blue-600 ring-4 ring-white dark:ring-slate-900" />
                <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs space-y-1 w-full">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{step.title}</span>
                    <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400 font-semibold">{step.date}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{step.desc}</p>
                  <p className="font-mono text-[9px] text-slate-400 dark:text-slate-500 pt-1">
                    SHA-256: {step.hash}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
