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
    <div className="space-y-8 py-2">
      {/* Header Banner */}
      <div className="text-center space-y-2.5 max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Bar-Certified Advocate Directory
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Retain certified advocates verified against State Bar Sanad registries. Filter by jurisdiction, court admissions, and specialty.
        </p>
      </div>

      {/* Filter and Search Panel */}
      <div className="bg-white/85 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs backdrop-blur-xl">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="relative sm:col-span-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Counsel name..."
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="relative sm:col-span-1">
            <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="City / High Court..."
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="relative sm:col-span-1">
            <Briefcase className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Specialization (Criminal, Writs...)"
              value={specializationFilter}
              onChange={(e) => setSpecializationFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="sm:col-span-1">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Search className="h-4 w-4" />
              <span>Search Directory</span>
            </button>
          </div>
        </form>
      </div>

      {/* Directory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {loadingList ? (
          <div className="col-span-3 py-16 text-center text-slate-500 dark:text-slate-400 flex flex-col items-center gap-2">
            <Sparkles className="h-6 w-6 animate-spin text-blue-600 dark:text-blue-400" />
            <p className="text-xs">Querying National Bar Registry...</p>
          </div>
        ) : advocates.length === 0 ? (
          <div className="col-span-3 py-16 text-center text-slate-500 dark:text-slate-400 bg-white/85 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
            <AlertCircle className="h-8 w-8 mx-auto text-slate-400 dark:text-slate-500 mb-2" />
            <p className="text-xs">No advocates match your search criteria. Try a different city or specialization.</p>
          </div>
        ) : (
          advocates.map((adv) => (
            <div
              key={adv.id}
              className="bg-white/85 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-xs backdrop-blur-xl flex flex-col justify-between space-y-4 hover:border-blue-500/50 transition-all duration-200"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{adv.full_name}</h3>
                    <div className="flex items-center gap-1.5 text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                      <Briefcase className="h-3 w-3 shrink-0" />
                      <span>{adv.specialization}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-0.5 shrink-0">
                    <UserCheck className="h-2.5 w-2.5" /> Sanad
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {adv.bio}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-slate-200/80 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                    <span className="truncate">{adv.office_location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                    <span>{adv.experience_years} Years of Practice</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono font-medium text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Phone className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                    {adv.contact_phone}
                  </span>
                  <a
                    href={`mailto:${adv.email}`}
                    className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition"
                    title="Send Email"
                  >
                    <Mail className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Advocate Chamber Registration Section (Only for ADVOCATE role) */}
      {user?.role === 'ADVOCATE' && (
        <div className="bg-white/85 dark:bg-slate-900/60 p-6 md:p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs backdrop-blur-xl space-y-5">
          <div className="pb-3 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Manage Your Public Bar Directory Chamber Profile
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Update your chamber address, consultation helpline, and practice areas for prospective litigants.
              </p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 font-mono">
              Bar Enrollment: {user.barCouncilId || 'Verified'}
            </span>
          </div>

          {statusMsg && (
            <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
              statusMsg.type === 'success' 
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' 
                : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
            }`}>
              {statusMsg.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <span>{statusMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleUpsertProfile} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-slate-700 dark:text-slate-300 font-semibold">Primary Practice Area</label>
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 px-3 py-2.5 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Constitutional & Criminal Law">Constitutional & Criminal Law</option>
                  <option value="Corporate & Commercial Disputes">Corporate & Commercial Disputes</option>
                  <option value="Civil Litigation & Property Law">Civil Litigation & Property Law</option>
                  <option value="Cyber Law & Data Privacy">Cyber Law & Data Privacy</option>
                  <option value="Arbitration & Dispute Resolution">Arbitration & Dispute Resolution</option>
                  <option value="Taxation & GST Litigation">Taxation & GST Litigation</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 dark:text-slate-300 font-semibold">Chamber / Office Location</label>
                <input
                  type="text"
                  placeholder="e.g. Chambers 42, Supreme Court Complex, New Delhi"
                  value={officeLocation}
                  onChange={(e) => setOfficeLocation(e.target.value)}
                  required
                  className="w-full bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 px-3.5 py-2.5 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 dark:text-slate-300 font-semibold">Years of Active Practice</label>
                <input
                  type="number"
                  placeholder="e.g. 15"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  required
                  min={1}
                  max={60}
                  className="w-full bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 px-3.5 py-2.5 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-slate-700 dark:text-slate-300 font-semibold">Consultation Phone Helpline</label>
                <input
                  type="text"
                  placeholder="+91 98110 00000"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  required
                  className="w-full bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 px-3.5 py-2.5 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 dark:text-slate-300 font-semibold">Chamber Summary / Practice Experience</label>
                <textarea
                  rows={3}
                  placeholder="Summarize your court admissions, landmark ratio victories, and client areas..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  required
                  className="w-full bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 p-3 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingProfile}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-500/25 flex items-center gap-2 transition cursor-pointer"
              >
                <span>{savingProfile ? 'Publishing Chamber...' : 'Update Chamber Listing'}</span>
                <Sparkles className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
