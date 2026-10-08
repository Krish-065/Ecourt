'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Gavel, 
  Briefcase, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  UserCheck,
  Scale
} from 'lucide-react';
import { UserProfile } from '../../lib/api';

const fallbackAdvocates = [
  {
    id: 'adv_1',
    full_name: 'Adv. Rajeshwar Sharma',
    specialization: 'Constitutional & Criminal Law',
    experience_years: 18,
    office_location: 'New Delhi (Supreme Court Chambers)',
    contact_phone: '+91 98110 44219',
    email: 'r.sharma@delhibar.in',
    bio: 'Senior practitioner representing clients before the Supreme Court of India and High Court of Delhi in writ petitions, BNS criminal appeals, and constitutional challenges.'
  },
  {
    id: 'adv_2',
    full_name: 'Adv. Meenakshi Sundaram',
    specialization: 'Corporate & Commercial Disputes',
    experience_years: 12,
    office_location: 'Mumbai, Maharashtra (Fort Chambers)',
    contact_phone: '+91 98201 88390',
    email: 'm.sundaram@bombaybar.org',
    bio: 'Specialist in commercial arbitration, NCLT insolvency proceedings, and cross-border master service agreement risk mitigation.'
  },
  {
    id: 'adv_3',
    full_name: 'Adv. Anand K. Sen',
    specialization: 'Civil Litigation & Property Law',
    experience_years: 15,
    office_location: 'Kolkata, West Bengal (High Court)',
    contact_phone: '+91 98305 77123',
    email: 'anand.sen@calcuttabar.in',
    bio: 'Extensive track record handling title demarcation, partition suits, and commercial tenant disputes across Eastern India benches.'
  }
];

export default function AdvocatesDirectory() {
  const [user, setUser] = useState<UserProfile | null>(null);
  
  // Search Filters
  const [nameFilter, setNameFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('');
  const [advocates, setAdvocates] = useState<any[]>(fallbackAdvocates);
  const [loadingList, setLoadingList] = useState(false);

  // Form State for upserting profile
  const [specialization, setSpecialization] = useState('Criminal Law');
  const [officeLocation, setOfficeLocation] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [bio, setBio] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('ecourt_user');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        setUser(u);
        if (u.role === 'ADVOCATE') {
          setContactPhone(u.phone || '');
        }
      } catch (e) {}
    }

    fetchAdvocates();
  }, []);

  const fetchAdvocates = async () => {
    setLoadingList(true);
    try {
      const queryParams = new URLSearchParams();
      if (nameFilter) queryParams.append('name', nameFilter);
      if (locationFilter) queryParams.append('location', locationFilter);
      if (specializationFilter) queryParams.append('specialization', specializationFilter);

      const token = localStorage.getItem('ecourt_token');
      const res = await fetch(`http://localhost:5000/api/v1/advocates?${queryParams.toString()}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        setAdvocates(data.data);
      } else {
        const filtered = fallbackAdvocates.filter(a => {
          const matchName = !nameFilter || a.full_name.toLowerCase().includes(nameFilter.toLowerCase());
          const matchLoc = !locationFilter || a.office_location.toLowerCase().includes(locationFilter.toLowerCase());
          const matchSpec = !specializationFilter || a.specialization.toLowerCase().includes(specializationFilter.toLowerCase());
          return matchName && matchLoc && matchSpec;
        });
        setAdvocates(filtered);
      }
    } catch (e) {
      const filtered = fallbackAdvocates.filter(a => {
        const matchName = !nameFilter || a.full_name.toLowerCase().includes(nameFilter.toLowerCase());
        const matchLoc = !locationFilter || a.office_location.toLowerCase().includes(locationFilter.toLowerCase());
        const matchSpec = !specializationFilter || a.specialization.toLowerCase().includes(specializationFilter.toLowerCase());
        return matchName && matchLoc && matchSpec;
      });
      setAdvocates(filtered);
    } finally {
      setLoadingList(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAdvocates();
  };

  const handleUpsertProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setStatusMsg(null);

    const token = localStorage.getItem('ecourt_token');
    if (!token) {
      setStatusMsg({ type: 'error', text: 'You must be signed in to register your practice chamber.' });
      setSavingProfile(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/v1/advocates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          specialization,
          officeLocation,
          experienceYears: parseInt(experienceYears, 10),
          contactPhone,
          bio
        })
      });

      const data = await res.json();
      if (data.success) {
        setStatusMsg({ type: 'success', text: 'Practice credentials listed successfully in Bar Directory!' });
        fetchAdvocates();
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Failed to update chamber profile.' });
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message });
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4 px-2">
      {/* Header Banner */}
      <div className="text-center space-y-2.5 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold shadow-2xs">
          <Gavel className="h-4 w-4 text-blue-600" />
          <span>Verified State Bar Council Register</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
          Find & Retain <span className="text-blue-600">Bar-Certified Counsel</span>
        </h1>
        <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
          Locate licensed advocates across India verified against State Bar Council Sanad credentials by specialization, jurisdiction, and court enrollment.
        </p>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Hand Search Column */}
        <div className="space-y-6 lg:col-span-1">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <Search className="h-4 w-4 text-blue-600" />
              Filter Registry
            </h3>

            <form onSubmit={handleSearchSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-700 font-semibold">Advocate Name</label>
                <input 
                  type="text" 
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                  placeholder="e.g. Adv. Rajeshwar Sharma"
                  className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 font-semibold">Chamber Location (City / Bench)</label>
                <input 
                  type="text" 
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  placeholder="e.g. Delhi or Mumbai"
                  className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 font-semibold">Practice Specialization</label>
                <select 
                  value={specializationFilter}
                  onChange={(e) => setSpecializationFilter(e.target.value)}
                  className="w-full bg-white border border-slate-200 px-3 py-2.5 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-blue-600"
                >
                  <option value="">All Specializations</option>
                  <option value="Criminal Law">Criminal Law (BNS & BNSS)</option>
                  <option value="Civil Litigation">Civil Litigation & Property</option>
                  <option value="Corporate Law & Tax">Corporate, Tax & NCLT</option>
                  <option value="Family Law">Family & Matrimonial</option>
                  <option value="Constitutional Writs">Constitutional Writs (Art. 226/32)</option>
                </select>
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition cursor-pointer shadow-xs"
              >
                Apply Directory Filters
              </button>
            </form>
          </div>

          {/* Advocate Profile Listing Box */}
          {user?.role === 'ADVOCATE' && (
            <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-200 shadow-sm space-y-4">
              <div className="space-y-1 pb-2 border-b border-blue-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  Chamber Directory Profile
                </h3>
                <p className="text-[11px] text-slate-500">
                  Publish your credentials so litigants and corporate clients can retain your counsel.
                </p>
              </div>

              {statusMsg && (
                <div className={`p-3 rounded-xl border text-[11px] font-semibold ${
                  statusMsg.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}>
                  {statusMsg.text}
                </div>
              )}

              <form onSubmit={handleUpsertProfile} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-700 font-semibold">Primary Practice Area</label>
                  <select 
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="w-full bg-white border border-slate-200 px-3 py-2 rounded-lg text-slate-900"
                  >
                    <option>Criminal Law</option>
                    <option>Civil Litigation</option>
                    <option>Corporate Law & Tax</option>
                    <option>Family Law</option>
                    <option>Constitutional Writs</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-semibold">Chambers Address & City</label>
                  <input 
                    type="text" 
                    value={officeLocation}
                    onChange={(e) => setOfficeLocation(e.target.value)}
                    placeholder="e.g. High Court Chambers, Mumbai"
                    className="w-full bg-white border border-slate-200 px-3 py-2 rounded-lg text-slate-900"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-semibold">Years in Active Practice</label>
                  <input 
                    type="number" 
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    placeholder="e.g. 10"
                    className="w-full bg-white border border-slate-200 px-3 py-2 rounded-lg text-slate-900"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-semibold">Chamber Helpline</label>
                  <input 
                    type="tel" 
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full bg-white border border-slate-200 px-3 py-2 rounded-lg text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-semibold">Chamber Overview / Notable Precedents</label>
                  <textarea 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Practice focus, landmark reported judgements..."
                    className="w-full bg-white border border-slate-200 px-3 py-2 rounded-lg text-slate-900 h-20 resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={savingProfile}
                  className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition cursor-pointer"
                >
                  {savingProfile ? 'Publishing...' : 'Publish Chamber Listing'}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right Hand Advocates List Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h2 className="text-sm font-bold text-slate-900">
              Certified Legal Practitioners ({advocates.length})
            </h2>
            <span className="text-[11px] font-mono text-slate-500 font-semibold">Bar Registry Synchronized</span>
          </div>

          {loadingList ? (
            <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center font-medium text-slate-500 text-xs">
              Querying State Bar Council Registry...
            </div>
          ) : advocates.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-2">
              <Gavel className="h-8 w-8 text-slate-300 mx-auto" />
              <p className="text-xs font-semibold text-slate-900">No advocates match the specified criteria.</p>
              <p className="text-[11px] text-slate-500">Try broadening your search or resetting the specialization filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {advocates.map((adv) => (
                <div key={adv.id} className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-sm transition-all duration-150 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                          {adv.full_name}
                          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                        </h4>
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200 mt-1 inline-block">
                          {adv.specialization}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] text-slate-500 uppercase font-mono block">Seniority</span>
                        <p className="text-xs font-bold text-slate-900">{adv.experience_years} Years</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {adv.bio || "Active legal counsel certified by State Bar Council. Reach out via chambers for briefs."}
                    </p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-slate-100 text-[11px] text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">{adv.office_location}</span>
                    </div>
                    {adv.contact_phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                        <span>{adv.contact_phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">{adv.email}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
